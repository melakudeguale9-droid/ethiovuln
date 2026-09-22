"""
EthioVuln — Test Configuration & Shared Fixtures
Provides pytest fixtures for the entire test suite.
"""

import os
import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timezone

# ─── Force test-safe settings before any app import ─────────────────────────
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost:5432/test_db")
os.environ.setdefault("DATABASE_URL_SYNC", "postgresql://test:test@localhost:5432/test_db")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/1")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-unit-tests-only-change-me-0123456789")
os.environ.setdefault("DEBUG", "true")
os.environ.setdefault("ZAP_API_KEY", "test-zap-key")
os.environ.setdefault("NUCLEI_PATH", "/usr/bin/nuclei")


# ─── Fixtures ────────────────────────────────────────────────────────────────

@pytest.fixture
def sample_user_id():
    """Return a stable test UUID for user fixtures."""
    return uuid.UUID("11111111-1111-1111-1111-111111111111")


@pytest.fixture
def sample_scan_id():
    """Return a stable test UUID for scan fixtures."""
    return uuid.UUID("22222222-2222-2222-2222-222222222222")


@pytest.fixture
def sample_vuln_id():
    """Return a stable test UUID for vulnerability fixtures."""
    return uuid.UUID("33333333-3333-3333-3333-333333333333")


@pytest.fixture
def sample_user_data():
    """Return sample user registration payload."""
    return {
        "email": "testuser@ethiovuln.com",
        "username": "testuser",
        "password": "SecurePassword123!",
        "full_name": "Test User",
    }


@pytest.fixture
def sample_scan_data():
    """Return sample scan creation payload."""
    return {
        "target_url": "https://example.com",
        "scan_type": "full",
        "tos_accepted": True,
    }


@pytest.fixture
def now_utc():
    """Return the current UTC time."""
    return datetime.now(timezone.utc)
