"""
EthioVuln — API Documentation Hardening Tests
Validates HTTPBasic authentication, Swagger UI, ReDoc, and OpenAPI schema security.
"""

from fastapi.testclient import TestClient
from app.main import app


def test_docs_requires_http_basic_auth():
    """Unauthenticated requests to /docs return 401 Unauthorized with WWW-Authenticate header."""
    client = TestClient(app)
    response = client.get("/docs")
    assert response.status_code == 401
    assert "Basic" in response.headers.get("WWW-Authenticate", "")


def test_openapi_json_requires_http_basic_auth():
    """Unauthenticated requests to /openapi.json return 401 Unauthorized."""
    client = TestClient(app)
    response = client.get("/openapi.json")
    assert response.status_code == 401
    assert "Basic" in response.headers.get("WWW-Authenticate", "")


def test_docs_with_invalid_credentials_rejected():
    """Invalid credentials return 401 Unauthorized."""
    client = TestClient(app)
    response = client.get("/docs", auth=("admin", "wrong_password"))
    assert response.status_code == 401
    assert "Basic" in response.headers.get("WWW-Authenticate", "")


def test_docs_with_valid_credentials_succeeds():
    """Valid credentials (admin:ethiovuln_secret2026) return 200 OK with Swagger UI."""
    client = TestClient(app)
    response = client.get("/docs", auth=("admin", "ethiovuln_secret2026"))
    assert response.status_code == 200
    assert "swagger-ui" in response.text.lower() or "html" in response.headers.get("content-type", "").lower()

    # Alias /api/docs also works with credentials
    alias_resp = client.get("/api/docs", auth=("admin", "ethiovuln_secret2026"))
    assert alias_resp.status_code == 200


def test_openapi_json_with_valid_credentials_succeeds():
    """Valid credentials return 200 OK with valid OpenAPI schema."""
    client = TestClient(app)
    response = client.get("/openapi.json", auth=("admin", "ethiovuln_secret2026"))
    assert response.status_code == 200
    schema = response.json()
    assert schema.get("info", {}).get("title") == "EthioVuln API"
    assert "paths" in schema

    # Alias /api/openapi.json also works with credentials
    alias_resp = client.get("/api/openapi.json", auth=("admin", "ethiovuln_secret2026"))
    assert alias_resp.status_code == 200


def test_redoc_endpoint_accessible():
    """ReDoc endpoint is accessible and renders HTML."""
    client = TestClient(app)
    response = client.get("/api/redoc")
    assert response.status_code == 200
    assert "text/html" in response.headers.get("content-type", "")
    assert "EthioVuln API - ReDoc" in response.text


def test_root_endpoint_metadata():
    """Verify root endpoint exposes documentation and health check links."""
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "EthioVuln"
    assert data["health"] == "/api/health"
    assert data["docs"] == "/docs"
    assert data["redoc"] == "/redoc"
    assert data["openapi"] == "/openapi.json"
