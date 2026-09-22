"""
EthioVuln — Target Verification Tests
Tests for URL validation, DNS resolution blocking, and SSRF protection.
"""

import socket
import pytest
from unittest.mock import patch, MagicMock
from app.core.target_verification import (
    TargetVerifier,
    VerificationStatus,
    VerificationResult,
    BLOCKED_DOMAINS,
    BLOCKED_PATTERNS,
)


@pytest.fixture
def verifier():
    """Create a fresh TargetVerifier instance for each test."""
    return TargetVerifier()


# ═══════════════════════════════════════════════════════════════════════════════
# URL Format Validation
# ═══════════════════════════════════════════════════════════════════════════════

class TestURLValidation:
    """Tests for validate_url() — URL format and scheme checks."""

    def test_valid_https_url(self, verifier):
        """A well-formed https URL should pass validation."""
        result = verifier.validate_url("https://example.com")
        assert result.is_valid is True
        assert result.status == VerificationStatus.VALID
        assert result.domain == "example.com"

    def test_valid_http_url(self, verifier):
        """A well-formed http URL should pass validation."""
        result = verifier.validate_url("http://testsite.org/path")
        assert result.is_valid is True
        assert result.domain == "testsite.org"

    def test_url_with_port(self, verifier):
        """URLs with port numbers should be accepted."""
        result = verifier.validate_url("https://target.com:8443/api")
        assert result.is_valid is True
        assert result.domain == "target.com"

    def test_url_without_scheme_is_invalid(self, verifier):
        """A URL without a scheme should be rejected."""
        result = verifier.validate_url("example.com")
        assert result.is_valid is False
        assert result.status == VerificationStatus.INVALID_URL

    def test_ftp_scheme_rejected(self, verifier):
        """FTP scheme should be rejected — only http/https are allowed."""
        result = verifier.validate_url("ftp://files.example.com")
        assert result.is_valid is False
        assert result.status == VerificationStatus.INVALID_SCHEME

    def test_file_scheme_rejected(self, verifier):
        """file:// scheme should be rejected."""
        result = verifier.validate_url("file:///etc/passwd")
        assert result.is_valid is False
        assert result.status == VerificationStatus.INVALID_SCHEME

    def test_javascript_scheme_rejected(self, verifier):
        """javascript: scheme should be rejected."""
        result = verifier.validate_url("javascript:alert(1)")
        assert result.is_valid is False
        assert result.status == VerificationStatus.INVALID_SCHEME

    def test_empty_string_rejected(self, verifier):
        """An empty string should be rejected."""
        result = verifier.validate_url("")
        assert result.is_valid is False

    def test_url_without_hostname(self, verifier):
        """A URL with scheme but no hostname should be rejected."""
        result = verifier.validate_url("http://")
        assert result.is_valid is False


# ═══════════════════════════════════════════════════════════════════════════════
# Blocked Domains (SSRF Prevention)
# ═══════════════════════════════════════════════════════════════════════════════

class TestBlockedDomains:
    """Tests for domain blocklist enforcement against SSRF."""

    def test_localhost_blocked(self, verifier):
        """'localhost' must be blocked to prevent SSRF."""
        result = verifier.validate_url("http://localhost/admin")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_localhost_localdomain_blocked(self, verifier):
        """localhost.localdomain must be blocked."""
        result = verifier.validate_url("http://localhost.localdomain")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_private_ip_10_x_blocked(self, verifier):
        """10.x.x.x private IPs in the hostname must be blocked."""
        result = verifier.validate_url("http://10.0.0.1")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_private_ip_192_168_blocked(self, verifier):
        """192.168.x.x private IPs in the hostname must be blocked."""
        result = verifier.validate_url("http://192.168.1.1")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_private_ip_172_16_blocked(self, verifier):
        """172.16-31.x.x private IPs in the hostname must be blocked."""
        result = verifier.validate_url("http://172.16.0.1")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_loopback_127_blocked(self, verifier):
        """127.x.x.x loopback IPs in the hostname must be blocked."""
        result = verifier.validate_url("http://127.0.0.1")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_zero_address_blocked(self, verifier):
        """0.0.0.0 must be blocked."""
        result = verifier.validate_url("http://0.0.0.0")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_link_local_169_254_blocked(self, verifier):
        """169.254.x.x link-local IPs must be blocked (AWS metadata, etc.)."""
        result = verifier.validate_url("http://169.254.169.254")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_dot_local_tld_blocked(self, verifier):
        """Domains ending in .local must be blocked."""
        result = verifier.validate_url("http://myserver.local")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_dot_internal_tld_blocked(self, verifier):
        """Domains ending in .internal must be blocked."""
        result = verifier.validate_url("http://api.internal")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_dot_corp_tld_blocked(self, verifier):
        """Domains ending in .corp must be blocked."""
        result = verifier.validate_url("http://intranet.corp")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_public_domain_passes(self, verifier):
        """A public domain like example.com should pass URL validation."""
        result = verifier.validate_url("https://example.com")
        assert result.is_valid is True
        assert result.status == VerificationStatus.VALID


# ═══════════════════════════════════════════════════════════════════════════════
# DNS Resolution & Private IP Detection
# ═══════════════════════════════════════════════════════════════════════════════

class TestDNSResolution:
    """Tests for check_dns() — DNS resolution and private IP blocking."""

    def test_dns_resolves_to_public_ip(self, verifier):
        """A domain resolving to a public IP should be accepted."""
        with patch("socket.gethostbyname", return_value="93.184.216.34"):
            result = verifier.check_dns("example.com")
            assert result.is_valid is True
            assert result.resolved_ip == "93.184.216.34"

    def test_dns_resolves_to_private_ip_blocked(self, verifier):
        """A domain resolving to a private IP must be rejected (SSRF)."""
        with patch("socket.gethostbyname", return_value="10.0.0.1"):
            result = verifier.check_dns("evil.com")
            assert result.is_valid is False
            assert result.status == VerificationStatus.PRIVATE_IP

    def test_dns_resolves_to_loopback_blocked(self, verifier):
        """A domain resolving to 127.0.0.1 must be rejected."""
        with patch("socket.gethostbyname", return_value="127.0.0.1"):
            result = verifier.check_dns("sneaky.com")
            assert result.is_valid is False
            assert result.status == VerificationStatus.PRIVATE_IP

    def test_dns_resolves_to_link_local_blocked(self, verifier):
        """A domain resolving to 169.254.x.x must be rejected."""
        with patch("socket.gethostbyname", return_value="169.254.169.254"):
            result = verifier.check_dns("metadata.cloud")
            assert result.is_valid is False
            assert result.status == VerificationStatus.PRIVATE_IP

    def test_dns_failure_handled(self, verifier):
        """DNS resolution failure should return DNS_FAILURE status."""
        with patch("socket.gethostbyname", side_effect=socket.gaierror):
            result = verifier.check_dns("nonexistent.invalid")
            assert result.is_valid is False
            assert result.status == VerificationStatus.DNS_FAILURE

    def test_dns_unexpected_error_handled(self, verifier):
        """Unexpected DNS errors should be caught gracefully."""
        with patch("socket.gethostbyname", side_effect=RuntimeError("boom")):
            result = verifier.check_dns("broken.com")
            assert result.is_valid is False
            assert result.status == VerificationStatus.DNS_FAILURE


# ═══════════════════════════════════════════════════════════════════════════════
# Full Verification Pipeline
# ═══════════════════════════════════════════════════════════════════════════════

class TestFullVerification:
    """Tests for verify_target() — end-to-end target verification."""

    def test_full_pipeline_valid_target(self, verifier):
        """A valid public target should pass the full verification pipeline."""
        with patch("socket.gethostbyname", return_value="93.184.216.34"):
            result = verifier.verify_target("https://example.com")
            assert result.is_valid is True
            assert result.status == VerificationStatus.VALID
            assert result.resolved_ip == "93.184.216.34"
            assert result.domain == "example.com"

    def test_full_pipeline_rejects_localhost(self, verifier):
        """verify_target should reject localhost at the URL validation stage."""
        result = verifier.verify_target("http://localhost")
        assert result.is_valid is False
        assert result.status == VerificationStatus.BLOCKED_DOMAIN

    def test_full_pipeline_rejects_private_dns(self, verifier):
        """verify_target should reject a domain that resolves to a private IP."""
        with patch("socket.gethostbyname", return_value="192.168.1.100"):
            result = verifier.verify_target("https://legit-looking-domain.com")
            assert result.is_valid is False
            assert result.status == VerificationStatus.PRIVATE_IP

    def test_full_pipeline_rejects_bad_scheme(self, verifier):
        """verify_target should reject non-HTTP schemes."""
        result = verifier.verify_target("ftp://files.example.com")
        assert result.is_valid is False
        assert result.status == VerificationStatus.INVALID_SCHEME


# ═══════════════════════════════════════════════════════════════════════════════
# Verification Result Dataclass
# ═══════════════════════════════════════════════════════════════════════════════

class TestVerificationResult:
    """Tests for the VerificationResult dataclass defaults."""

    def test_default_is_valid_false(self):
        """VerificationResult.is_valid should default to False."""
        result = VerificationResult(
            status=VerificationStatus.INVALID_URL,
            message="test",
        )
        assert result.is_valid is False
        assert result.resolved_ip is None
        assert result.domain is None

    def test_all_fields_populated(self):
        """All fields should be settable."""
        result = VerificationResult(
            status=VerificationStatus.VALID,
            message="OK",
            resolved_ip="1.2.3.4",
            domain="example.com",
            is_valid=True,
        )
        assert result.status == VerificationStatus.VALID
        assert result.resolved_ip == "1.2.3.4"
        assert result.domain == "example.com"
        assert result.is_valid is True
