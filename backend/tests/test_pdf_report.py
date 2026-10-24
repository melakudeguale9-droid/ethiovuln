"""
Unit and integration tests for PDF Report Generation.
Tests safe handling of edge cases, None values, empty lists, and CVSS calculations.
"""

import pytest
from app.services.pdf_generator import pdf_generator, _safe_str, _safe_float, _safe_int, _safe_escape


class TestPDFReportGenerator:
    """Tests for ReportLab PDF compilation and resilience."""

    def test_safe_helpers(self):
        assert _safe_str(None, "def") == "def"
        assert _safe_str("  hello  ") == "hello"
        assert _safe_escape("<script>alert(1)</script>") == "&lt;script&gt;alert(1)&lt;/script&gt;"
        assert _safe_float(None, 1.5) == 1.5
        assert _safe_float("invalid", 2.5) == 2.5
        assert _safe_float(7.8) == 7.8
        assert _safe_int(None, 10) == 10
        assert _safe_int("invalid", 5) == 5
        assert _safe_int("42") == 42

    def test_generate_report_with_findings(self):
        scan_data = {
            "target_url": "https://test.ethiovuln.sec",
            "scan_type": "full",
            "started_at": "2026-10-24 10:00 UTC",
            "completed_at": "2026-10-24 10:20 UTC",
            "critical_count": 1,
            "high_count": 1,
            "medium_count": 0,
            "low_count": 1,
            "info_count": 0,
            "total_vulnerabilities": 3,
        }
        vulns = [
            {
                "title": "SQL Injection in Login Endpoint",
                "severity": "critical",
                "cvss_score": 9.8,
                "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
                "cwe_id": "CWE-89",
                "cwe_name": "SQL Injection",
                "url": "https://test.ethiovuln.sec/api/v1/login",
                "description": "SQL injection in user authentication endpoint.",
                "evidence": "' OR 1=1 --",
                "remediation": "Use prepared statements with parameterized inputs.",
                "source": "zap",
            },
            {
                "title": "Missing Content-Security-Policy",
                "severity": "low",
                "cvss_score": 3.8,
                "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:N",
                "cwe_id": "CWE-1021",
                "cwe_name": "Missing Security Header",
                "url": "https://test.ethiovuln.sec/",
                "description": "Response does not include CSP header.",
                "evidence": "HTTP/1.1 200 OK",
                "remediation": "Add CSP header to all HTTP responses.",
                "source": "nuclei",
            },
        ]

        pdf_bytes = pdf_generator.generate_report(scan_data, vulns)
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 1000
        # Valid PDF header verification
        assert pdf_bytes.startswith(b"%PDF")

    def test_generate_report_clean_scan_no_findings(self):
        scan_data = {
            "target_url": "https://clean.ethiovuln.sec",
            "scan_type": "quick",
            "critical_count": 0,
            "high_count": 0,
            "medium_count": 0,
            "low_count": 0,
            "info_count": 0,
            "total_vulnerabilities": 0,
        }
        pdf_bytes = pdf_generator.generate_report(scan_data, [])
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 500
        assert pdf_bytes.startswith(b"%PDF")

    def test_generate_report_with_null_and_malformed_values(self):
        scan_data = {
            "target_url": None,
            "scan_type": None,
            "started_at": None,
            "completed_at": None,
            "critical_count": None,
            "total_vulnerabilities": None,
        }
        vulns = [
            {
                "title": None,
                "severity": None,
                "cvss_score": None,
                "cvss_vector": None,
                "cwe_id": None,
                "cwe_name": None,
                "url": None,
                "description": None,
                "evidence": None,
                "remediation": None,
                "source": None,
            }
        ]
        pdf_bytes = pdf_generator.generate_report(scan_data, vulns)
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 500
        assert pdf_bytes.startswith(b"%PDF")
