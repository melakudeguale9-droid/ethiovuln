"""
EthioVuln — Models Package
"""

from app.models.user import User
from app.models.scan import Scan, ScanStatus, ScanType
from app.models.vulnerability import Vulnerability, Severity, ScanSource

__all__ = [
    "User",
    "Scan",
    "ScanStatus",
    "ScanType",
    "Vulnerability",
    "Severity",
    "ScanSource",
]
