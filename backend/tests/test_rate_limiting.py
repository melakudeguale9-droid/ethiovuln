"""
EthioVuln — Rate Limiting Test Suite
Tests for slowapi rate limiting enforcement:
  - Client identifier resolution (User ID vs Client IP)
  - Strict 5 requests/minute on AI Probe endpoint (/api/ai/ping)
  - Strict 2 scans/minute per user on DAST Scan initiation (/api/scans)
  - General API endpoints (100 requests/minute default)
  - 429 RateLimitExceeded JSON response format & Retry-After headers
"""

import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch, MagicMock
import pytest
from starlette.requests import Request
from fastapi.testclient import TestClient

from app.main import app
from app.core.rate_limit import (
    limiter,
    get_client_identifier,
    RATE_LIMIT_GENERAL,
    RATE_LIMIT_AI_PROBE,
    RATE_LIMIT_SCAN_INITIATE,
)
from app.core.security import create_access_token
from app.api.deps import require_active_subscription, get_db
from app.models.user import User
from app.services.gemini_service import gemini_service

client = TestClient(app)


class TestClientIdentifierResolution:
    """Unit tests for get_client_identifier helper function."""

    def test_resolve_from_request_state_user_id(self):
        """request.state.user_id takes highest precedence."""
        scope = {
            "type": "http",
            "method": "GET",
            "path": "/api/scans",
            "headers": [],
            "client": ("10.0.0.1", 12345),
        }
        req = Request(scope)
        req.state.user_id = "user-12345"
        identifier = get_client_identifier(req)
        assert identifier == "user:user-12345"

    def test_resolve_from_request_state_user_object(self):
        """request.state.user.id is used when state.user is present."""
        scope = {
            "type": "http",
            "method": "GET",
            "path": "/api/scans",
            "headers": [],
            "client": ("10.0.0.1", 12345),
        }
        req = Request(scope)
        mock_user = MagicMock()
        mock_user.id = "user-abc-999"
        req.state.user = mock_user
        identifier = get_client_identifier(req)
        assert identifier == "user:user-abc-999"

    def test_resolve_from_authorization_bearer_header(self):
        """Valid Authorization: Bearer <jwt> header resolves to user:<user_id>."""
        user_uuid = str(uuid.uuid4())
        token = create_access_token(user_uuid, "test@example.com")
        scope = {
            "type": "http",
            "method": "POST",
            "path": "/api/scans",
            "headers": [(b"authorization", f"Bearer {token}".encode())],
            "client": ("10.0.0.2", 12345),
        }
        req = Request(scope)
        identifier = get_client_identifier(req)
        assert identifier == f"user:{user_uuid}"

    def test_resolve_from_cookie(self):
        """Valid access_token cookie resolves to user:<user_id>."""
        user_uuid = str(uuid.uuid4())
        token = create_access_token(user_uuid, "test@example.com")
        scope = {
            "type": "http",
            "method": "GET",
            "path": "/api/scans",
            "headers": [(b"cookie", f"access_token={token}".encode())],
            "client": ("10.0.0.3", 12345),
        }
        req = Request(scope)
        identifier = get_client_identifier(req)
        assert identifier == f"user:{user_uuid}"

    def test_resolve_from_x_forwarded_for_header(self):
        """Unauthenticated requests fall back to first IP in X-Forwarded-For."""
        scope = {
            "type": "http",
            "method": "GET",
            "path": "/api/health",
            "headers": [(b"x-forwarded-for", b"203.0.113.195, 70.41.3.18")],
            "client": ("10.0.0.1", 12345),
        }
        req = Request(scope)
        identifier = get_client_identifier(req)
        assert identifier == "ip:203.0.113.195"

    def test_resolve_from_x_real_ip_header(self):
        """Unauthenticated requests use X-Real-IP if present."""
        scope = {
            "type": "http",
            "method": "GET",
            "path": "/api/health",
            "headers": [(b"x-real-ip", b"198.51.100.4")],
            "client": ("10.0.0.1", 12345),
        }
        req = Request(scope)
        identifier = get_client_identifier(req)
        assert identifier == "ip:198.51.100.4"

    def test_resolve_from_socket_remote_address(self):
        """Unauthenticated requests fall back to client socket host."""
        scope = {
            "type": "http",
            "method": "GET",
            "path": "/api/health",
            "headers": [],
            "client": ("192.168.1.100", 54321),
        }
        req = Request(scope)
        identifier = get_client_identifier(req)
        assert identifier == "ip:192.168.1.100"


class TestAIProbeRateLimiting:
    """Tests enforcing strict 5 requests per minute limit on AI probe (/api/ai/ping)."""

    def test_ai_probe_strict_5_per_minute(self):
        """Client can perform 5 pings per minute; 6th ping fails with 429."""
        limiter.limiter.storage.reset()
        mock_ping = {
            "success": True,
            "configured": True,
            "message": "AI Probe OK",
            "model": "gemini-2.5-flash",
            "latency_ms": 120.0,
        }

        with patch.object(gemini_service, "ping", new_callable=AsyncMock, return_value=mock_ping):
            test_headers = {"X-Forwarded-For": "198.51.100.1"}

            # Requests 1 to 5 should succeed (200 OK)
            for i in range(5):
                resp = client.post("/api/ai/ping", headers=test_headers)
                assert resp.status_code == 200, f"Request {i+1} failed with {resp.status_code}"

            # 6th request from same IP must be rate limited (429)
            resp_6 = client.post("/api/ai/ping", headers=test_headers)
            assert resp_6.status_code == 429
            data = resp_6.json()
            assert data["status"] == "error"
            assert data["error_code"] == "RATE_LIMIT_EXCEEDED"
            assert "Rate limit exceeded: 5 per 1 minute" in data["detail"]
            assert resp_6.headers.get("Retry-After") is not None

    def test_ai_probe_isolated_by_ip(self):
        """Rate limit on AI probe is isolated per IP / client identity."""
        limiter.limiter.storage.reset()
        mock_ping = {
            "success": True,
            "configured": True,
            "message": "AI Probe OK",
            "model": "gemini-2.5-flash",
            "latency_ms": 85.0,
        }

        with patch.object(gemini_service, "ping", new_callable=AsyncMock, return_value=mock_ping):
            ip_a_headers = {"X-Forwarded-For": "192.0.2.10"}
            ip_b_headers = {"X-Forwarded-For": "192.0.2.20"}

            # Exhaust IP A quota (5 requests)
            for _ in range(5):
                assert client.post("/api/ai/ping", headers=ip_a_headers).status_code == 200
            assert client.post("/api/ai/ping", headers=ip_a_headers).status_code == 429

            # IP B still has quota available
            resp_b = client.post("/api/ai/ping", headers=ip_b_headers)
            assert resp_b.status_code == 200


class TestDASTScanInitiationRateLimiting:
    """Tests enforcing strict 2 scans per minute per user on POST /api/scans."""

    def test_dast_scan_initiation_limit_2_per_minute_per_user(self):
        """User can initiate up to 2 scans per minute; 3rd attempt is rejected with 429."""
        limiter.limiter.storage.reset()

        user_a_id = str(uuid.uuid4())
        token_a = create_access_token(user_a_id, "user_a@ethiovuln.com")
        mock_user_a = User(
            id=uuid.UUID(user_a_id),
            email="user_a@ethiovuln.com",
            tos_accepted_at=datetime.now(timezone.utc),
            subscription_tier="Enterprise",
        )

        user_b_id = str(uuid.uuid4())
        token_b = create_access_token(user_b_id, "user_b@ethiovuln.com")
        mock_user_b = User(
            id=uuid.UUID(user_b_id),
            email="user_b@ethiovuln.com",
            tos_accepted_at=datetime.now(timezone.utc),
            subscription_tier="Enterprise",
        )

        current_user_holder = [mock_user_a]
        app.dependency_overrides[require_active_subscription] = lambda: current_user_holder[0]

        db_mock = AsyncMock()
        db_mock.add = MagicMock()
        async def mock_refresh(scan):
            scan.id = uuid.uuid4()
            scan.progress = 0
            scan.total_vulnerabilities = 0
            scan.critical_count = 0
            scan.high_count = 0
            scan.medium_count = 0
            scan.low_count = 0
            scan.info_count = 0
            scan.created_at = datetime.now(timezone.utc)
        db_mock.refresh.side_effect = mock_refresh
        app.dependency_overrides[get_db] = lambda: db_mock

        try:
            headers_a = {"Authorization": f"Bearer {token_a}"}
            payload = {"target_url": "https://example.com", "tos_accepted": True}

            # First scan for User A: Allowed
            resp1 = client.post("/api/scans", json=payload, headers=headers_a)
            assert resp1.status_code == 201

            # Second scan for User A: Allowed
            resp2 = client.post("/api/scans", json=payload, headers=headers_a)
            assert resp2.status_code == 201

            # Third scan for User A: 429 RateLimitExceeded
            resp3 = client.post("/api/scans", json=payload, headers=headers_a)
            assert resp3.status_code == 429
            data = resp3.json()
            assert data["status"] == "error"
            assert data["error_code"] == "RATE_LIMIT_EXCEEDED"
            assert "2 per 1 minute" in data["detail"]

            # User B must NOT be blocked (Per-user rate limit isolation)
            current_user_holder[0] = mock_user_b
            headers_b = {"Authorization": f"Bearer {token_b}"}
            resp_b = client.post("/api/scans", json=payload, headers=headers_b)
            assert resp_b.status_code == 201

        finally:
            app.dependency_overrides.clear()


class TestGeneralAPIRateLimitingConfiguration:
    """Tests confirming general API limits and limiter configuration."""

    def test_rate_limit_constants_and_default_limits(self):
        """Verifies rate limiting specifications match requirements."""
        assert RATE_LIMIT_GENERAL == "100/minute"
        assert RATE_LIMIT_AI_PROBE == "5/minute"
        assert RATE_LIMIT_SCAN_INITIATE == "2/minute"

    def test_health_check_responds_under_general_limit(self):
        """GET /api/health succeeds under general limit."""
        resp = client.get("/api/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "healthy"
