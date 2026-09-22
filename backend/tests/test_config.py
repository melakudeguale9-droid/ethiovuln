"""
EthioVuln — Configuration Tests
Tests for Settings validation, defaults, and safety checks.
"""

import os
import pytest
from unittest.mock import patch
from app.config import Settings, validate_settings, _UNSAFE_SECRET_KEYS


class TestSettingsDefaults:
    """Tests for default Settings values."""

    def test_default_app_name(self):
        s = Settings()
        assert s.APP_NAME == "EthioVuln"

    def test_default_jwt_algorithm(self):
        s = Settings()
        assert s.JWT_ALGORITHM == "HS256"

    def test_default_access_token_minutes(self):
        s = Settings()
        assert s.ACCESS_TOKEN_EXPIRE_MINUTES == 1440  # 24 hours

    def test_default_refresh_token_days(self):
        s = Settings()
        assert s.REFRESH_TOKEN_EXPIRE_DAYS == 7

    def test_default_debug_true(self):
        s = Settings()
        assert s.DEBUG is True

    def test_default_database_url_is_postgres(self):
        s = Settings()
        assert s.DATABASE_URL.startswith("postgresql")

    def test_default_redis_url(self):
        s = Settings()
        assert s.REDIS_URL.startswith("redis://")

    def test_default_fuzzer_threads(self):
        s = Settings()
        assert s.FUZZER_THREADS == 30

    def test_default_fuzzer_timeout(self):
        s = Settings()
        assert s.FUZZER_TIMEOUT == 5


class TestUnsafeSecretKeys:
    """Tests for unsafe secret key detection."""

    def test_known_unsafe_keys(self):
        """All well-known unsafe keys should be in the blocklist."""
        assert "changeme" in _UNSAFE_SECRET_KEYS
        assert "secret" in _UNSAFE_SECRET_KEYS
        assert "password" in _UNSAFE_SECRET_KEYS

    def test_safe_key_not_in_blocklist(self):
        """A proper random key should not be in the blocklist."""
        safe_key = "x8k2p9q4m7n1a3b5c6d0e-f4g7h2i9j1"
        assert safe_key not in _UNSAFE_SECRET_KEYS


class TestSettingsValidation:
    """Tests for validate_settings() warnings and errors."""

    def test_validate_warns_on_unsafe_key_in_debug(self, caplog):
        """In DEBUG mode, an unsafe key should produce a warning, not crash."""
        import logging
        s = Settings()
        s.SECRET_KEY = "changeme"
        s.DEBUG = True
        # Should not sys.exit in debug
        with caplog.at_level(logging.WARNING):
            validate_settings(s)
        assert any("insecure" in r.message.lower() or "SECRET_KEY" in r.message for r in caplog.records)

    def test_validate_warns_on_short_key_in_debug(self, caplog):
        """Short SECRET_KEY should warn in debug mode."""
        import logging
        s = Settings()
        s.SECRET_KEY = "tooshort"
        s.DEBUG = True
        with caplog.at_level(logging.WARNING):
            validate_settings(s)
        assert any("short" in r.message.lower() or "SECRET_KEY" in r.message for r in caplog.records)

    def test_validate_exits_on_unsafe_key_in_production(self):
        """In production, an unsafe key should cause sys.exit."""
        s = Settings()
        s.SECRET_KEY = "changeme"
        s.DEBUG = False
        with pytest.raises(SystemExit):
            validate_settings(s)
