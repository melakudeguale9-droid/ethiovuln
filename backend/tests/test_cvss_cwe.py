"""
EthioVuln — CVSS & CWE Utility Tests
Tests for CVSS v3.1 score conversion, severity mapping, and CWE lookups.
"""

import pytest
from app.utils.cvss import (
    score_to_severity,
    severity_to_score,
    nuclei_severity_to_cvss,
    zap_risk_to_cvss,
    get_severity_color,
    get_severity_label,
)
from app.utils.cwe_mapping import get_cwe_info, get_cwe_url


# ═══════════════════════════════════════════════════════════════════════════════
# CVSS Score → Severity
# ═══════════════════════════════════════════════════════════════════════════════

class TestScoreToSeverity:
    """Tests for score_to_severity() — CVSS v3.1 thresholds."""

    def test_critical_score_10(self):
        assert score_to_severity(10.0) == "critical"

    def test_critical_score_9(self):
        assert score_to_severity(9.0) == "critical"

    def test_high_score_8_9(self):
        assert score_to_severity(8.9) == "high"

    def test_high_score_7(self):
        assert score_to_severity(7.0) == "high"

    def test_medium_score_6_9(self):
        assert score_to_severity(6.9) == "medium"

    def test_medium_score_4(self):
        assert score_to_severity(4.0) == "medium"

    def test_low_score_3_9(self):
        assert score_to_severity(3.9) == "low"

    def test_low_score_0_1(self):
        assert score_to_severity(0.1) == "low"

    def test_info_score_0(self):
        assert score_to_severity(0.0) == "info"


# ═══════════════════════════════════════════════════════════════════════════════
# Severity → Score
# ═══════════════════════════════════════════════════════════════════════════════

class TestSeverityToScore:
    """Tests for severity_to_score() — representative CVSS scores."""

    def test_critical(self):
        assert severity_to_score("critical") == 9.5

    def test_high(self):
        assert severity_to_score("high") == 8.0

    def test_medium(self):
        assert severity_to_score("medium") == 5.5

    def test_low(self):
        assert severity_to_score("low") == 2.5

    def test_info(self):
        assert severity_to_score("info") == 0.0

    def test_unknown_returns_zero(self):
        assert severity_to_score("banana") == 0.0

    def test_case_insensitive(self):
        """Should handle uppercase input."""
        assert severity_to_score("CRITICAL") == 9.5
        assert severity_to_score("High") == 8.0


# ═══════════════════════════════════════════════════════════════════════════════
# Nuclei Severity Mapping
# ═══════════════════════════════════════════════════════════════════════════════

class TestNucleiSeverityToCVSS:
    """Tests for nuclei_severity_to_cvss() — Nuclei engine output mapping."""

    def test_critical(self):
        score, vector = nuclei_severity_to_cvss("critical")
        assert score == 9.8
        assert vector.startswith("CVSS:3.1/")

    def test_high(self):
        score, vector = nuclei_severity_to_cvss("high")
        assert score == 8.2
        assert "CVSS:3.1/" in vector

    def test_medium(self):
        score, vector = nuclei_severity_to_cvss("medium")
        assert score == 5.3

    def test_low(self):
        score, vector = nuclei_severity_to_cvss("low")
        assert score == 3.1

    def test_info(self):
        score, vector = nuclei_severity_to_cvss("info")
        assert score == 0.0

    def test_unknown_fallback(self):
        score, vector = nuclei_severity_to_cvss("nonsense")
        assert score == 0.0
        assert vector == ""

    def test_case_insensitive(self):
        """Should normalize input to lowercase internally."""
        score, _ = nuclei_severity_to_cvss("CRITICAL")
        assert score == 9.8


# ═══════════════════════════════════════════════════════════════════════════════
# ZAP Risk Mapping
# ═══════════════════════════════════════════════════════════════════════════════

class TestZapRiskToCVSS:
    """Tests for zap_risk_to_cvss() — OWASP ZAP output mapping."""

    def test_high(self):
        score, vector = zap_risk_to_cvss("High")
        assert score == 8.2

    def test_medium(self):
        score, vector = zap_risk_to_cvss("Medium")
        assert score == 5.3

    def test_low(self):
        score, vector = zap_risk_to_cvss("Low")
        assert score == 3.1

    def test_informational(self):
        score, vector = zap_risk_to_cvss("Informational")
        assert score == 0.0

    def test_unknown_risk_fallback(self):
        score, vector = zap_risk_to_cvss("Unknown")
        assert score == 0.0
        assert vector == ""


# ═══════════════════════════════════════════════════════════════════════════════
# Severity Color & Label
# ═══════════════════════════════════════════════════════════════════════════════

class TestSeverityColorAndLabel:
    """Tests for display utilities: colors and labels."""

    def test_critical_color(self):
        assert get_severity_color("critical") == "#FF0040"

    def test_high_color(self):
        assert get_severity_color("high") == "#FF4444"

    def test_medium_color(self):
        assert get_severity_color("medium") == "#FFB020"

    def test_low_color(self):
        assert get_severity_color("low") == "#44BB44"

    def test_info_color(self):
        assert get_severity_color("info") == "#4488FF"

    def test_unknown_color_fallback(self):
        assert get_severity_color("xyz") == "#888888"

    def test_critical_label(self):
        assert get_severity_label("critical") == "CRITICAL"

    def test_info_label(self):
        assert get_severity_label("info") == "INFORMATIONAL"

    def test_unknown_label_fallback(self):
        assert get_severity_label("xyz") == "UNKNOWN"


# ═══════════════════════════════════════════════════════════════════════════════
# CWE Mapping
# ═══════════════════════════════════════════════════════════════════════════════

class TestCWEMapping:
    """Tests for get_cwe_info() and get_cwe_url()."""

    def test_known_cwe_sql_injection(self):
        """CWE-89 (SQL Injection) should return complete info."""
        info = get_cwe_info("CWE-89")
        assert info["name"] == "SQL Injection"
        assert info["category"] == "Injection"
        assert "SQL" in info["description"]

    def test_known_cwe_xss(self):
        """CWE-79 (XSS) should be found."""
        info = get_cwe_info("CWE-79")
        assert "XSS" in info["name"] or "Cross-site" in info["name"]

    def test_cwe_without_prefix(self):
        """Should accept plain numeric IDs like '89'."""
        info = get_cwe_info("89")
        assert info["name"] == "SQL Injection"

    def test_cwe_case_insensitive(self):
        """Should handle 'cwe-79' (lowercase) input."""
        info = get_cwe_info("cwe-79")
        assert "XSS" in info["name"] or "Cross-site" in info["name"]

    def test_unknown_cwe_returns_fallback(self):
        """An unknown CWE ID should return a fallback with 'Unknown'."""
        info = get_cwe_info("CWE-99999")
        assert "Unknown" in info["name"]

    def test_none_input_returns_empty(self):
        """None input should return an empty dict."""
        assert get_cwe_info(None) == {}

    def test_empty_string_returns_empty(self):
        """Empty string should return an empty dict."""
        assert get_cwe_info("") == {}

    def test_cwe_url_for_known_id(self):
        """get_cwe_url should return a valid MITRE URL."""
        url = get_cwe_url("CWE-79")
        assert url == "https://cwe.mitre.org/data/definitions/79.html"

    def test_cwe_url_empty_input(self):
        """get_cwe_url with empty input should return empty string."""
        assert get_cwe_url("") == ""

    def test_ssrf_cwe_918(self):
        """CWE-918 (SSRF) should be in the database."""
        info = get_cwe_info("CWE-918")
        assert "SSRF" in info["name"] or "Server-Side Request" in info["name"]

    def test_clickjacking_cwe_1021(self):
        """CWE-1021 (Clickjacking) should be in the database."""
        info = get_cwe_info("CWE-1021")
        assert "Clickjacking" in info["name"] or "UI Layers" in info["name"]
