"""
EthioVuln — Phase 4: Object-Level Authorization & IDOR / BOLA Unit Tests
Validates that authenticated users cannot access, tamper with, or stream
resources (scans, reports, API keys, WebSockets) belonging to other users.
"""

import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException, status
from app.models.user import User
from app.models.scan import Scan, ScanStatus
from app.models.settings import ApiKey
from app.api.scans import get_scan, stop_scan, get_scan_vulnerabilities
from app.api.reports import generate_pdf_report
from app.api.settings import revoke_api_key
from app.api.websocket import scan_websocket


@pytest.fixture
def user_a():
    return User(
        id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
        email="usera@ethiovuln.com",
        username="usera",
        role="Cyber Security Student",
        is_admin=False,
        is_active=True,
    )


@pytest.fixture
def user_b():
    return User(
        id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
        email="userb@ethiovuln.com",
        username="userb",
        role="Cyber Security Student",
        is_admin=False,
        is_active=True,
    )


@pytest.fixture
def user_b_scan(user_b):
    return Scan(
        id=uuid.UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
        user_id=user_b.id,
        target_url="https://victim-org.et",
        target_domain="victim-org.et",
        status=ScanStatus.COMPLETED,
    )


class TestScanIDORProtection:
    """Tests ensuring User A cannot read or modify User B's scans."""

    @pytest.mark.asyncio
    async def test_user_cannot_get_other_users_scan(self, user_a, user_b_scan):
        """User A attempts GET /api/scans/{scan_b_id} -> must return 404."""
        db_mock = AsyncMock()
        # Mock database returning None because Scan.user_id == user_a.id does not match
        db_result = MagicMock()
        db_result.scalar_one_or_none.return_value = None
        db_mock.execute.return_value = db_result

        with pytest.raises(HTTPException) as exc_info:
            await get_scan(scan_id=user_b_scan.id, current_user=user_a, db=db_mock)

        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
        assert exc_info.value.detail == "Scan not found"

    @pytest.mark.asyncio
    async def test_user_cannot_stop_other_users_scan(self, user_a, user_b_scan):
        """User A attempts POST /api/scans/{scan_b_id}/stop -> must return 404."""
        db_mock = AsyncMock()
        db_result = MagicMock()
        db_result.scalar_one_or_none.return_value = None
        db_mock.execute.return_value = db_result

        with pytest.raises(HTTPException) as exc_info:
            await stop_scan(scan_id=user_b_scan.id, current_user=user_a, db=db_mock)

        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
        assert exc_info.value.detail == "Scan not found"

    @pytest.mark.asyncio
    async def test_user_cannot_view_other_users_vulnerabilities(self, user_a, user_b_scan):
        """User A attempts GET /api/scans/{scan_b_id}/vulnerabilities -> must return 404."""
        db_mock = AsyncMock()
        db_result = MagicMock()
        db_result.scalar_one_or_none.return_value = None
        db_mock.execute.return_value = db_result

        with pytest.raises(HTTPException) as exc_info:
            await get_scan_vulnerabilities(scan_id=user_b_scan.id, current_user=user_a, db=db_mock)

        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
        assert exc_info.value.detail == "Scan not found"


class TestReportIDORProtection:
    """Tests ensuring User A cannot download or generate User B's scan reports."""

    @pytest.mark.asyncio
    async def test_user_cannot_download_other_users_report(self, user_a, user_b_scan):
        """User A attempts GET /api/reports/{scan_b_id}/pdf -> must return 404."""
        db_mock = AsyncMock()
        db_result = MagicMock()
        db_result.scalar_one_or_none.return_value = None
        db_mock.execute.return_value = db_result

        with pytest.raises(HTTPException) as exc_info:
            await generate_pdf_report(scan_id=user_b_scan.id, current_user=user_a, db=db_mock)

        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
        assert exc_info.value.detail == "Scan not found"


class TestSettingsIDORProtection:
    """Tests ensuring User A cannot revoke or alter User B's credentials/keys."""

    @pytest.mark.asyncio
    async def test_user_cannot_revoke_other_users_api_key(self, user_a, user_b):
        """User A attempts DELETE /api/settings/api-keys/{key_b_id} -> must return 404."""
        db_mock = AsyncMock()
        db_result = MagicMock()
        db_result.scalar_one_or_none.return_value = None
        db_mock.execute.return_value = db_result

        other_key_id = str(uuid.uuid4())
        with pytest.raises(HTTPException) as exc_info:
            await revoke_api_key(key_id=other_key_id, current_user=user_a, db=db_mock)

        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
        assert exc_info.value.detail == "API key not found"


class TestWebSocketIDORProtection:
    """Tests ensuring User A cannot stream or intercept User B's live scan WebSocket telemetry."""

    @pytest.mark.asyncio
    async def test_websocket_rejects_unauthorized_user_on_foreign_scan(self, user_a, user_b, user_b_scan):
        """User A attempts WS connect to /api/ws/scans/{scan_b_id} -> must close with 4003 Forbidden."""
        websocket_mock = AsyncMock()
        websocket_mock.query_params = {"token": "valid-token-for-user-a"}

        # Token payload belongs to User A
        token_payload = {
            "sub": str(user_a.id),
            "email": user_a.email,
            "role": user_a.role,
            "type": "access",
        }

        # Mock DB session returns User A, but the scan belongs to User B
        mock_session = AsyncMock()
        user_res = MagicMock()
        user_res.scalar_one_or_none.return_value = user_a
        scan_res = MagicMock()
        scan_res.scalar_one_or_none.return_value = user_b_scan
        mock_session.execute.side_effect = [user_res, scan_res]

        mock_session_ctx = AsyncMock()
        mock_session_ctx.__aenter__.return_value = mock_session
        mock_session_ctx.__aexit__.return_value = None

        with patch("app.core.security.verify_access_token", return_value=token_payload), \
             patch("app.api.websocket.async_session_factory", return_value=mock_session_ctx):
            await scan_websocket(websocket=websocket_mock, scan_id=str(user_b_scan.id))

        # Must close with code 4003 Forbidden
        websocket_mock.close.assert_called_once_with(
            code=4003, reason="Forbidden: Access to target scan denied"
        )
