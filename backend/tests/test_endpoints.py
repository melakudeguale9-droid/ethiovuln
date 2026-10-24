"""
EthioVuln — FastAPI Endpoint Unit Tests
Verifies HTTP contract, status codes, input validations, and route security.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestPublicEndpoints:
    """Tests for public endpoints accessible without authentication."""

    def test_root_endpoint_metadata(self):
        """GET / returns system information and service name."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "EthioVuln"
        assert "version" in data
        assert data["health"] == "/api/health"

    def test_health_check_endpoint(self):
        """GET /api/health returns healthy status."""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "EthioVuln API"

    def test_redoc_documentation_endpoint(self):
        """GET /api/redoc returns HTML ReDoc UI."""
        response = client.get("/api/redoc")
        assert response.status_code == 200
        assert "text/html" in response.headers.get("content-type", "")
        assert "EthioVuln API - ReDoc" in response.text


class TestProtectedEndpointsRequireAuth:
    """Tests verifying protected routes return 401 Unauthorized without bearer tokens."""

    def test_get_scans_requires_auth(self):
        response = client.get("/api/scans")
        assert response.status_code == 401
        assert "Authentication required" in response.json().get("detail", "")

    def test_post_scans_requires_auth(self):
        response = client.post("/api/scans", json={"target_url": "https://example.com", "tos_accepted": True})
        assert response.status_code == 401

    def test_get_scan_detail_requires_auth(self):
        response = client.get("/api/scans/11111111-1111-1111-1111-111111111111")
        assert response.status_code == 401

    def test_settings_profile_requires_auth(self):
        response = client.get("/api/settings/profile")
        assert response.status_code == 401

    def test_settings_keys_requires_auth(self):
        response = client.get("/api/settings/api-keys")
        assert response.status_code == 401


class TestEndpointValidationErrors:
    """Tests verifying 422 Unprocessable Entity responses on invalid schemas."""

    def test_login_missing_credentials(self):
        """POST /api/auth/login without body returns 422."""
        response = client.post("/api/auth/login", json={})
        assert response.status_code == 422

    def test_register_missing_email(self):
        """POST /api/auth/register missing email returns 422."""
        response = client.post("/api/auth/register", json={"username": "testuser", "password": "Password123!"})
        assert response.status_code == 422

    def test_refresh_missing_token(self):
        """POST /api/auth/refresh without payload returns 422."""
        response = client.post("/api/auth/refresh", json={})
        assert response.status_code == 422
