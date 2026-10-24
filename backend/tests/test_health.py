"""
EthioVuln — Health Check API Tests
Verifies robust /api/health endpoint:
  - Returns 200 OK with connected database and redis components.
  - Returns 503 Service Unavailable when Database is disconnected.
  - Returns 503 Service Unavailable when Redis is disconnected.
"""
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_success():
    """Verify that the health check endpoint returns 200 OK and expected component statuses."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "EthioVuln API"
    assert "version" in data
    assert "environment" in data
    assert "timestamp" in data
    assert "components" in data
    assert data["components"]["database"]["status"] == "connected"
    assert "latency_ms" in data["components"]["database"]
    assert data["components"]["redis"]["status"] == "connected"
    assert "latency_ms" in data["components"]["redis"]


def test_health_check_database_failure():
    """Verify that database connection failure returns 503 Service Unavailable."""
    mock_db_fail = AsyncMock(return_value=(False, {"status": "error", "error": "Database connection timeout"}))
    with patch("app.main.check_database_connectivity", mock_db_fail):
        response = client.get("/api/health")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "unhealthy"
        assert data["components"]["database"]["status"] == "error"
        assert "Database connection timeout" in data["components"]["database"]["error"]


def test_health_check_redis_failure():
    """Verify that Redis connection failure returns 503 Service Unavailable."""
    mock_redis_fail = AsyncMock(return_value=(False, {"status": "error", "error": "Redis connection refused"}))
    with patch("app.main.check_redis_connectivity", mock_redis_fail):
        response = client.get("/api/health")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "unhealthy"
        assert data["components"]["redis"]["status"] == "error"
        assert "Redis connection refused" in data["components"]["redis"]["error"]
