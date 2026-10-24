"""
EthioVuln — Structured Logging & Centralized Error Handling Tests
Tests:
  1. Structured JSON formatting with automatic injection of request_id, user_id, endpoint, and timestamps.
  2. Global exception handler catching unhandled exceptions without leaking backend stack traces.
  3. Preservation of explicit HTTPExceptions (400, 401, 404).
  4. Automatic assignment and propagation of X-Request-ID headers.
"""

import io
import json
import logging
from unittest.mock import patch
import pytest
from fastapi import APIRouter, HTTPException
from fastapi.testclient import TestClient
import structlog

from app.main import app
from app.core.logging import (
    setup_logging,
    get_logger,
    extract_user_id_from_request,
)

# Router with endpoints designed to test unhandled and handled errors
error_testing_router = APIRouter(prefix="/api/test-errors", tags=["Testing"])


@error_testing_router.get("/unhandled")
async def trigger_unhandled_error():
    """Endpoint that throws an unexpected internal error with sensitive info."""
    raise RuntimeError("Internal database failure: secret_connection_key=SUPER_SECRET_123")


@error_testing_router.get("/handled-403")
async def trigger_handled_http_exception():
    """Endpoint that explicitly raises an HTTPException."""
    raise HTTPException(status_code=403, detail="Access denied to requested resource")


@error_testing_router.get("/logged-action")
async def trigger_logged_action():
    """Endpoint that emits logs during processing."""
    log = get_logger("ethiovuln.test")
    log.info("Processing test action inside route", route_param="sample_value")
    return {"status": "ok", "message": "Logged successfully"}


app.include_router(error_testing_router)
client = TestClient(app, raise_server_exceptions=False)


class TestStructuredLogging:
    """Tests verifying structured JSON logging and context variable injection."""

    def test_structured_log_json_format_and_context(self):
        """Verify structlog formats output as JSON with request_id, user_id, endpoint, and timestamp."""
        buffer = io.StringIO()
        formatter = structlog.stdlib.ProcessorFormatter(
            foreign_pre_chain=[
                structlog.contextvars.merge_contextvars,
                structlog.stdlib.add_logger_name,
                structlog.stdlib.add_log_level,
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.stdlib.ExtraAdder(),
            ],
            processors=[
                structlog.stdlib.ProcessorFormatter.remove_processors_meta,
                structlog.processors.JSONRenderer(),
            ],
        )
        handler = logging.StreamHandler(buffer)
        handler.setFormatter(formatter)

        root = logging.getLogger()
        root.addHandler(handler)

        try:
            logger = get_logger("test_module")
            structlog.contextvars.bind_contextvars(
                request_id="req-999-test",
                user_id="user-888-uuid",
                endpoint="GET /api/scans",
            )
            logger.info("Executing security scan engine", engine="nuclei", target_count=5)

            log_output = buffer.getvalue().strip()
            assert log_output, "Log output should not be empty"

            parsed = json.loads(log_output)
            assert parsed["event"] == "Executing security scan engine"
            assert parsed["request_id"] == "req-999-test"
            assert parsed["user_id"] == "user-888-uuid"
            assert parsed["endpoint"] == "GET /api/scans"
            assert parsed["engine"] == "nuclei"
            assert parsed["target_count"] == 5
            assert "timestamp" in parsed
            assert parsed["level"] == "info"
            assert parsed["logger"] == "test_module"
        finally:
            structlog.contextvars.clear_contextvars()
            root.removeHandler(handler)

    def test_request_id_propagation_in_middleware(self):
        """Verify that requests receive X-Request-ID response headers."""
        custom_req_id = "client-trace-12345"
        resp = client.get("/api/test-errors/logged-action", headers={"X-Request-ID": custom_req_id})
        assert resp.status_code == 200
        assert resp.headers.get("X-Request-ID") == custom_req_id

        # Auto-generated when omitted
        resp_auto = client.get("/api/test-errors/logged-action")
        assert resp_auto.status_code == 200
        assert resp_auto.headers.get("X-Request-ID") is not None


class TestGlobalExceptionHandler:
    """Tests verifying centralized error handling and safe error responses."""

    def test_unhandled_exception_returns_safe_500_without_stacktrace(self):
        """
        Verify that unhandled server exceptions:
          - Return HTTP 500
          - Contain standard error structure
          - Do NOT leak sensitive error messages or Python stack traces
        """
        resp = client.get("/api/test-errors/unhandled")
        assert resp.status_code == 500

        data = resp.json()
        assert data["status"] == "error"
        assert data["error_code"] == "INTERNAL_SERVER_ERROR"
        assert data["detail"] == "An internal server error occurred while processing the request."
        assert "request_id" in data
        assert "timestamp" in data

        # Sensitive internal message MUST NOT be leaked
        assert "SUPER_SECRET_123" not in resp.text
        assert "Traceback" not in resp.text
        assert "RuntimeError" not in resp.text

    def test_http_exceptions_preserve_status_and_detail(self):
        """Verify that standard HTTPExceptions (like 401 or 403) are preserved."""
        # 1. Custom 403 HTTPException
        resp_403 = client.get("/api/test-errors/handled-403")
        assert resp_403.status_code == 403
        data_403 = resp_403.json()
        assert "Access denied" in data_403.get("detail", "")

        # 2. Protected endpoint requiring authentication
        resp_auth = client.get("/api/scans")
        assert resp_auth.status_code == 401
        data_auth = resp_auth.json()
        assert "Authentication required" in data_auth.get("detail", "")
