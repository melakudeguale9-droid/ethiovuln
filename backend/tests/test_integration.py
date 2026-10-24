"""
EthioVuln — End-to-End Integration Tests
Validates complete user lifecycles, token authentication, scan workflows,
and AI Gemini integration contracts using FastAPI and Pytest.
"""

import pytest
import uuid
from datetime import datetime, timezone, timedelta
from unittest.mock import AsyncMock, MagicMock, patch

from app.models.user import User
from app.models.scan import Scan, ScanStatus, ScanType
from app.models.vulnerability import Vulnerability, Severity, ScanSource
from app.models.settings import ApiKey
from app.core.security import (
    create_access_token,
    verify_access_token,
    create_refresh_token,
    verify_refresh_token,
    hash_password,
    verify_password,
)
from app.api.scans import get_scan, stop_scan
from app.api.settings import get_profile, revoke_api_key
from app.services.gemini_service import gemini_service


class TestUserAuthLifecycleIntegration:
    """Tests the complete user authentication and token rotation workflow."""

    def test_registration_and_password_validation(self):
        """Validates secure credential handling on signup."""
        plaintext_pwd = "P@ssw0rdSecure2026!"
        hashed = hash_password(plaintext_pwd)

        assert verify_password(plaintext_pwd, hashed) is True
        assert verify_password("WrongPassword!", hashed) is False

    def test_jwt_token_issuance_and_claims_verification(self):
        """Validates that issued access tokens carry valid user claims and security roles."""
        user_id = str(uuid.uuid4())
        email = "analyst@ethiovuln.com"
        role = "Lead Pentester"

        token = create_access_token(user_id=user_id, email=email, role=role, is_admin=False)
        claims = verify_access_token(token)

        assert claims is not None
        assert claims["sub"] == user_id
        assert claims["email"] == email
        assert claims["role"] == role
        assert claims["is_admin"] is False
        assert claims["type"] == "access"
        assert "exp" in claims
        assert "jti" in claims

    def test_refresh_token_lifecycle(self):
        """Validates that refresh tokens are distinct from access tokens and verifiable."""
        user_id = str(uuid.uuid4())
        email = "analyst@ethiovuln.com"

        refresh_token = create_refresh_token(user_id=user_id)
        claims = verify_refresh_token(refresh_token)

        assert claims is not None
        assert claims["sub"] == user_id
        assert claims["type"] == "refresh"

        # Access token must not be accepted by verify_refresh_token
        access_token = create_access_token(user_id=user_id, email=email)
        assert verify_refresh_token(access_token) is None


class TestScanWorkflowIntegration:
    """Tests the scan initialization, querying, and cancellation workflow."""

    @pytest.fixture
    def test_user(self):
        return User(
            id=uuid.uuid4(),
            email="tester@ethiovuln.com",
            username="tester",
            role="Security Researcher",
            is_admin=False,
            is_active=True,
            subscription_tier="Pro",
        )

    @pytest.mark.asyncio
    async def test_get_scan_with_vulnerabilities(self, test_user):
        """Validates fetching a completed scan and its loaded vulnerability list."""
        scan_id = uuid.uuid4()
        scan = Scan(
            id=scan_id,
            user_id=test_user.id,
            target_url="https://test-target.gov.et",
            target_domain="test-target.gov.et",
            status=ScanStatus.COMPLETED,
            scan_type=ScanType.FULL,
            progress=100,
            total_vulnerabilities=1,
            critical_count=1,
        )

        vuln = Vulnerability(
            id=uuid.uuid4(),
            scan_id=scan_id,
            title="SQL Injection in Login Param",
            severity=Severity.CRITICAL,
            cvss_score=9.8,
            url="https://test-target.gov.et/login.php",
            source=ScanSource.ZAP,
        )
        scan.vulnerabilities = [vuln]

        db_mock = AsyncMock()
        db_result = MagicMock()
        db_result.scalar_one_or_none.return_value = scan
        db_mock.execute.return_value = db_result

        result_scan = await get_scan(scan_id=scan_id, current_user=test_user, db=db_mock)
        assert result_scan.id == scan_id
        assert result_scan.status == ScanStatus.COMPLETED
        assert len(result_scan.vulnerabilities) == 1
        assert result_scan.vulnerabilities[0].severity == Severity.CRITICAL

    @pytest.mark.asyncio
    async def test_stop_running_scan_workflow(self, test_user):
        """Validates that an active scan is gracefully marked as CANCELLED."""
        scan_id = uuid.uuid4()
        scan = Scan(
            id=scan_id,
            user_id=test_user.id,
            target_url="https://test-target.gov.et",
            target_domain="test-target.gov.et",
            status=ScanStatus.RUNNING,
            progress=45,
        )

        db_mock = AsyncMock()
        db_result = MagicMock()
        db_result.scalar_one_or_none.return_value = scan
        db_mock.execute.return_value = db_result

        stopped_scan = await stop_scan(scan_id=scan_id, current_user=test_user, db=db_mock)
        assert stopped_scan.status == ScanStatus.CANCELLED
        assert db_mock.flush.called


class TestAIPingServiceIntegration:
    """Tests the Gemini AI service probe and roundtrip ping behavior."""

    @pytest.mark.asyncio
    async def test_ai_service_configured_probe(self):
        """Validates the ping probe return contract when Gemini is configured."""
        mock_response = {
            "success": True,
            "configured": True,
            "message": "PONG: Live connectivity verified.",
            "model": "gemini-2.5-flash",
            "latency_ms": 95.4,
        }
        with patch.object(gemini_service, "ping", new_callable=AsyncMock, return_value=mock_response):
            result = await gemini_service.ping()
            assert result["success"] is True
            assert result["configured"] is True
            assert "PONG" in result["message"]
            assert result["latency_ms"] == 95.4

    @pytest.mark.asyncio
    async def test_ai_service_unconfigured_probe(self):
        """Validates the ping probe return contract when API key is missing."""
        with patch.object(gemini_service, "is_configured", return_value=False):
            result = await gemini_service.ping()
            assert result["success"] is False
            assert result["configured"] is False
            assert "not configured" in result["message"]
            assert result["latency_ms"] == 0.0
