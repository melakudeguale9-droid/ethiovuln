"""
EthioVuln — Pydantic Schema Validation Tests
Tests for request/response schema validation, defaults, and edge cases.
"""

import uuid
import pytest
from datetime import datetime, timezone
from pydantic import ValidationError
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.schemas.scan import ScanCreate, ScanResponse, ScanListResponse
from app.schemas.vulnerability import VulnerabilityResponse
from app.models.scan import ScanStatus, ScanType
from app.models.vulnerability import Severity, ScanSource


# ═══════════════════════════════════════════════════════════════════════════════
# User Schemas
# ═══════════════════════════════════════════════════════════════════════════════

class TestUserCreate:
    """Validation tests for UserCreate schema."""

    def test_valid_user(self):
        user = UserCreate(
            email="test@ethiovuln.com",
            username="testuser",
            password="SecureP@ss1",
            full_name="Test User",
        )
        assert user.email == "test@ethiovuln.com"
        assert user.username == "testuser"

    def test_email_too_short(self):
        """Email shorter than 5 chars should fail."""
        with pytest.raises(ValidationError):
            UserCreate(email="a@b", username="test", password="12345678")

    def test_password_too_short(self):
        """Password shorter than 8 chars should fail."""
        with pytest.raises(ValidationError):
            UserCreate(email="test@test.com", username="test", password="short")

    def test_username_too_short(self):
        """Username shorter than 3 chars should fail."""
        with pytest.raises(ValidationError):
            UserCreate(email="test@test.com", username="ab", password="12345678")

    def test_full_name_optional(self):
        """full_name should be optional (default None)."""
        user = UserCreate(
            email="test@test.com",
            username="testuser",
            password="SecureP@ss1",
        )
        assert user.full_name is None


class TestUserLogin:
    """Validation tests for UserLogin schema."""

    def test_valid_login(self):
        login = UserLogin(email="test@test.com", password="password123")
        assert login.email == "test@test.com"

    def test_missing_email_fails(self):
        with pytest.raises(ValidationError):
            UserLogin(password="password123")

    def test_missing_password_fails(self):
        with pytest.raises(ValidationError):
            UserLogin(email="test@test.com")


class TestTokenResponse:
    """Tests for TokenResponse schema."""

    def test_valid_token_response(self):
        resp = TokenResponse(
            access_token="eyJ...",
            refresh_token="eyJ...",
            expires_in=86400,
        )
        assert resp.token_type == "bearer"
        assert resp.expires_in == 86400


# ═══════════════════════════════════════════════════════════════════════════════
# Scan Schemas
# ═══════════════════════════════════════════════════════════════════════════════

class TestScanCreate:
    """Validation tests for ScanCreate schema."""

    def test_valid_scan(self):
        scan = ScanCreate(
            target_url="https://example.com/app",
            scan_type="full",
            tos_accepted=True,
        )
        assert scan.scan_type == ScanType.FULL
        assert scan.tos_accepted is True

    def test_target_url_too_short(self):
        """target_url must be at least 10 chars."""
        with pytest.raises(ValidationError):
            ScanCreate(target_url="http://x", tos_accepted=True)

    def test_tos_required(self):
        """tos_accepted is required — omitting it should fail."""
        with pytest.raises(ValidationError):
            ScanCreate(target_url="https://example.com")

    def test_default_scan_type_is_full(self):
        """Default scan_type should be 'full'."""
        scan = ScanCreate(
            target_url="https://example.com/path",
            tos_accepted=True,
        )
        assert scan.scan_type == ScanType.FULL

    def test_nuclei_only_scan_type(self):
        scan = ScanCreate(
            target_url="https://target.example.com",
            scan_type="nuclei_only",
            tos_accepted=True,
        )
        assert scan.scan_type == ScanType.NUCLEI_ONLY

    def test_invalid_scan_type(self):
        """An invalid scan_type value should raise a validation error."""
        with pytest.raises(ValidationError):
            ScanCreate(
                target_url="https://example.com/path",
                scan_type="invalid_type",
                tos_accepted=True,
            )


class TestScanListResponse:
    """Tests for ScanListResponse pagination and compatibility fields."""

    def test_compat_fields_populated(self):
        """Compatibility fields (scans, total, page_size) should auto-populate."""
        data = {
            "items": [],
            "total_items": 42,
            "total_pages": 5,
            "page": 1,
            "limit": 10,
        }
        resp = ScanListResponse(**data)
        assert resp.scans == []
        assert resp.total == 42
        assert resp.page_size == 10

    def test_explicit_compat_fields_preserved(self):
        """Explicit compat fields should not be overwritten."""
        data = {
            "items": [],
            "total_items": 42,
            "total_pages": 5,
            "page": 1,
            "limit": 10,
            "scans": [],
            "total": 42,
            "page_size": 10,
        }
        resp = ScanListResponse(**data)
        assert resp.total == 42


# ═══════════════════════════════════════════════════════════════════════════════
# Enum Values
# ═══════════════════════════════════════════════════════════════════════════════

class TestEnumValues:
    """Tests for model enums to ensure all expected values exist."""

    def test_scan_status_values(self):
        expected = {"pending", "verifying", "running", "completed", "failed", "cancelled"}
        actual = {s.value for s in ScanStatus}
        assert actual == expected

    def test_scan_type_values(self):
        expected = {"full", "nuclei_only", "zap_only", "fuzz_only", "nuclei_zap"}
        actual = {t.value for t in ScanType}
        assert actual == expected

    def test_severity_values(self):
        expected = {"critical", "high", "medium", "low", "info"}
        actual = {s.value for s in Severity}
        assert actual == expected

    def test_scan_source_values(self):
        expected = {"nuclei", "zap", "fuzzer"}
        actual = {s.value for s in ScanSource}
        assert actual == expected
