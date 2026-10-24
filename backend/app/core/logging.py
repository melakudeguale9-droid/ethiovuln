"""
EthioVuln — Structured JSON Logging System
Provides enterprise JSON-formatted structured logging via structlog.
Automatically injects request_id, user_id, endpoint, and timestamps into every log entry.
"""

import sys
import uuid
import time
import logging
from typing import Any, Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import structlog


def setup_logging(debug: bool = False, json_format: bool = True) -> None:
    """
    Configure global logging with structlog.
    When json_format is True, all logs (structlog and stdlib logging) are formatted as JSON.
    """
    log_level = logging.DEBUG if debug else logging.INFO

    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
    ]

    if json_format:
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
    else:
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
                structlog.dev.ConsoleRenderer(colors=True),
            ],
        )

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Remove existing handlers to avoid duplicate log entries
    for handler in list(root_logger.handlers):
        root_logger.removeHandler(handler)

    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(formatter)
    root_logger.addHandler(stream_handler)

    structlog.configure(
        processors=shared_processors + [
            structlog.stdlib.filter_by_level,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )


def get_logger(name: str = "ethiovuln") -> structlog.stdlib.BoundLogger:
    """Return a configured structlog logger instance."""
    return structlog.get_logger(name)


def extract_user_id_from_request(request: Request) -> str:
    """Extract user ID from request state or JWT token without database queries."""
    if hasattr(request.state, "user_id") and request.state.user_id:
        return str(request.state.user_id)
    if hasattr(request.state, "user") and request.state.user:
        return str(getattr(request.state.user, "id", "anonymous"))

    try:
        auth_header = request.headers.get("Authorization", "")
        token = ""
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
        elif "access_token" in request.cookies:
            token = request.cookies["access_token"]
        if token:
            from app.core.security import verify_access_token
            payload = verify_access_token(token)
            if payload and payload.get("sub"):
                return str(payload["sub"])
    except Exception:
        pass

    return "anonymous"


class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that automatically injects request context (request_id, user_id, endpoint)
    into structlog contextvars for the duration of the request and sets X-Request-ID response header.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Resolve or generate correlation request ID
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id

        endpoint = f"{request.method} {request.url.path}"
        user_id = extract_user_id_from_request(request)

        # Bind context variables to current async execution context
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            endpoint=endpoint,
            user_id=user_id,
            client_ip=request.client.host if request.client else "unknown",
        )

        logger = get_logger("ethiovuln.request")
        start_time = time.monotonic()

        try:
            response = await call_next(request)
            duration_ms = round((time.monotonic() - start_time) * 1000, 2)

            # Update user_id if authenticated later in request execution
            current_user_id = getattr(request.state, "user_id", user_id)
            if current_user_id != user_id:
                structlog.contextvars.bind_contextvars(user_id=current_user_id)

            response.headers["X-Request-ID"] = request_id

            # Avoid spamming logs for successful health checks
            if not (request.url.path == "/api/health" and response.status_code == 200):
                logger.info(
                    "HTTP Request Processed",
                    status_code=response.status_code,
                    duration_ms=duration_ms,
                )
            return response
        except Exception:
            raise
        finally:
            structlog.contextvars.clear_contextvars()
