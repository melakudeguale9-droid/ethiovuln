"""
EthioVuln — Models Package
"""

from app.models.user import User
from app.models.scan import Scan, ScanStatus, ScanType
from app.models.vulnerability import Vulnerability, Severity, ScanSource
from app.models.settings import UserPreferences, ApiKey, LoginHistory

__all__ = [
    "User",
    "Scan",
    "ScanStatus",
    "ScanType",
    "Vulnerability",
    "Severity",
    "ScanSource",
    "UserPreferences",
    "ApiKey",
    "LoginHistory",
]
