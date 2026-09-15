"""
EthioVuln — CVSS v3.1 Score Utilities
Maps scan engine outputs to standardized CVSS v3.1 vectors and severity ratings.
"""


# ─── CVSS v3.1 Severity Thresholds ──────────────────────────────────────────
# Critical: 9.0 - 10.0
# High:     7.0 - 8.9
# Medium:   4.0 - 6.9
# Low:      0.1 - 3.9
# Info:     0.0

SEVERITY_THRESHOLDS = {
    "critical": (9.0, 10.0),
    "high": (7.0, 8.9),
    "medium": (4.0, 6.9),
    "low": (0.1, 3.9),
    "info": (0.0, 0.0),
}


def score_to_severity(score: float) -> str:
    """Convert a CVSS v3.1 score to a severity label."""
    if score >= 9.0:
        return "critical"
    elif score >= 7.0:
        return "high"
    elif score >= 4.0:
        return "medium"
    elif score > 0.0:
        return "low"
    return "info"


def severity_to_score(severity: str) -> float:
    """Convert a severity label to a representative CVSS v3.1 score."""
    mapping = {
        "critical": 9.5,
        "high": 8.0,
        "medium": 5.5,
        "low": 2.5,
        "info": 0.0,
    }
    return mapping.get(severity.lower(), 0.0)


def nuclei_severity_to_cvss(nuclei_severity: str) -> tuple[float, str]:
    """
    Map Nuclei severity levels to CVSS v3.1 scores and vectors.
    
    Returns:
        Tuple of (cvss_score, cvss_vector_string)
    """
    mapping = {
        "critical": (
            9.8,
            "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        ),
        "high": (
            8.2,
            "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N",
        ),
        "medium": (
            5.3,
            "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
        ),
        "low": (
            3.1,
            "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:N/A:N",
        ),
        "info": (
            0.0,
            "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:N",
        ),
        "unknown": (
            0.0,
            "",
        ),
    }
    return mapping.get(nuclei_severity.lower(), mapping["unknown"])


def zap_risk_to_cvss(zap_risk: str) -> tuple[float, str]:
    """
    Map OWASP ZAP risk levels to CVSS v3.1 scores and vectors.
    
    Returns:
        Tuple of (cvss_score, cvss_vector_string)
    """
    mapping = {
        "High": (
            8.2,
            "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N",
        ),
        "Medium": (
            5.3,
            "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
        ),
        "Low": (
            3.1,
            "CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:N/A:N",
        ),
        "Informational": (
            0.0,
            "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:N/A:N",
        ),
    }
    return mapping.get(zap_risk, (0.0, ""))


def get_severity_color(severity: str) -> str:
    """Get a hex color code for a severity level."""
    colors = {
        "critical": "#FF0040",
        "high": "#FF4444",
        "medium": "#FFB020",
        "low": "#44BB44",
        "info": "#4488FF",
    }
    return colors.get(severity.lower(), "#888888")


def get_severity_label(severity: str) -> str:
    """Get a properly formatted severity label."""
    labels = {
        "critical": "CRITICAL",
        "high": "HIGH",
        "medium": "MEDIUM",
        "low": "LOW",
        "info": "INFORMATIONAL",
    }
    return labels.get(severity.lower(), "UNKNOWN")
