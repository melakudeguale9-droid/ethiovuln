"""
EthioVuln — AI & Gemini Ping Tests
Unit and integration tests for AI status probe and latency ping endpoints.
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.services.gemini_service import gemini_service

client = TestClient(app)


class TestAIPingEndpoints:
    """Tests for the /api/ai/status and /api/ai/ping endpoints."""

    def test_ai_status_endpoint(self):
        """GET /api/ai/status returns configured status and model name."""
        response = client.get("/api/ai/status")
        assert response.status_code == 200
        data = response.json()
        assert "configured" in data
        assert "model" in data
        assert isinstance(data["configured"], bool)
        assert isinstance(data["model"], str)

    def test_ai_v1_status_prefix_compatibility(self):
        """GET /api/v1/ai/status works identically via the v1 router prefix."""
        response = client.get("/api/v1/ai/status")
        assert response.status_code == 200
        data = response.json()
        assert "configured" in data

    @pytest.mark.asyncio
    async def test_ai_ping_when_api_key_missing(self):
        """When GEMINI_API_KEY is not configured, ping returns success=False and clear notice."""
        with patch.object(gemini_service, "is_configured", return_value=False):
            with patch.object(
                gemini_service,
                "ping",
                new_callable=AsyncMock,
                return_value={
                    "success": False,
                    "configured": False,
                    "message": "Google GenAI (Gemini) API key is missing or not configured.",
                    "model": "gemini-2.5-flash",
                    "latency_ms": 0.0,
                },
            ):
                response = client.post("/api/ai/ping")
                assert response.status_code == 200
                data = response.json()
                assert data["success"] is False
                assert data["configured"] is False
                assert "missing or not configured" in data["message"]
                assert data["latency_ms"] == 0.0

    @pytest.mark.asyncio
    async def test_ai_ping_live_connectivity_success(self):
        """When Gemini responds, ping returns success=True with latency and model output."""
        mock_result = {
            "success": True,
            "configured": True,
            "message": "PONG: Connection verified.",
            "model": "gemini-2.5-flash",
            "latency_ms": 142.5,
        }
        with patch.object(gemini_service, "ping", new_callable=AsyncMock, return_value=mock_result):
            response = client.post("/api/ai/ping")
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["configured"] is True
            assert data["message"] == "PONG: Connection verified."
            assert data["model"] == "gemini-2.5-flash"
            assert data["latency_ms"] > 0

    @pytest.mark.asyncio
    async def test_ai_ping_timeout_handling(self):
        """When Gemini API probe times out after 15s, ping returns success=False with timeout detail."""
        mock_result = {
            "success": False,
            "configured": True,
            "message": "Gemini API ping timed out after 15 seconds.",
            "model": "gemini-2.5-flash",
            "latency_ms": 15000.0,
        }
        with patch.object(gemini_service, "ping", new_callable=AsyncMock, return_value=mock_result):
            response = client.post("/api/ai/ping")
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is False
            assert "timed out" in data["message"]
            assert data["latency_ms"] >= 15000.0
