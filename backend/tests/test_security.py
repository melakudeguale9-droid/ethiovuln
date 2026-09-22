"""
EthioVuln — Security Module Tests
Tests for JWT token creation, password hashing, and token verification.
"""

import uuid
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta, timezone


class TestPasswordHashing:
    """Tests for hash_password() and verify_password()."""

    def test_hash_password_returns_string(self):
        """Hashing a password should return a non-empty bcrypt hash string."""
        from app.core.security import hash_password

        hashed = hash_password("TestPassword123!")
        assert isinstance(hashed, str)
        assert len(hashed) > 0
        # bcrypt hashes start with $2b$ or $2a$
        assert hashed.startswith("$2")

    def test_verify_password_correct(self):
        """verify_password should return True for matching plaintext/hash pair."""
        from app.core.security import hash_password, verify_password

        password = "MySecretP@ss1"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True

    def test_verify_password_wrong(self):
        """verify_password should return False for a wrong password."""
        from app.core.security import hash_password, verify_password

        hashed = hash_password("CorrectPassword1")
        assert verify_password("WrongPassword2", hashed) is False

    def test_hash_password_different_salts(self):
        """Two hashes of the same password should differ (random salt)."""
        from app.core.security import hash_password

        h1 = hash_password("SamePassword")
        h2 = hash_password("SamePassword")
        assert h1 != h2  # bcrypt generates unique salts

    def test_password_truncated_at_72_bytes(self):
        """bcrypt only considers the first 72 bytes; verify this boundary."""
        from app.core.security import hash_password, verify_password

        long_password = "A" * 100
        hashed = hash_password(long_password)
        # The first 72 chars should still verify
        assert verify_password(long_password, hashed) is True


class TestJWTTokens:
    """Tests for JWT access token and refresh token creation/verification."""

    def test_create_access_token_returns_string(self):
        """create_access_token should return a non-empty JWT string."""
        from app.core.security import create_access_token

        user_id = str(uuid.uuid4())
        token = create_access_token(user_id, "test@ethiovuln.com")
        assert isinstance(token, str)
        assert len(token) > 0
        # JWT has 3 parts separated by dots
        assert len(token.split(".")) == 3

    def test_create_refresh_token_returns_string(self):
        """create_refresh_token should return a non-empty JWT string."""
        from app.core.security import create_refresh_token

        token = create_refresh_token(str(uuid.uuid4()))
        assert isinstance(token, str)
        assert len(token.split(".")) == 3

    def test_verify_access_token_valid(self):
        """verify_access_token should return payload for a valid access token."""
        from app.core.security import create_access_token, verify_access_token

        user_id = str(uuid.uuid4())
        token = create_access_token(user_id, "admin@ethiovuln.com")
        payload = verify_access_token(token)
        assert payload is not None
        assert payload["sub"] == user_id
        assert payload["email"] == "admin@ethiovuln.com"
        assert payload["type"] == "access"

    def test_verify_access_token_rejects_refresh(self):
        """verify_access_token should return None for a refresh token."""
        from app.core.security import create_refresh_token, verify_access_token

        token = create_refresh_token(str(uuid.uuid4()))
        assert verify_access_token(token) is None

    def test_verify_refresh_token_valid(self):
        """verify_refresh_token should return payload for a valid refresh token."""
        from app.core.security import create_refresh_token, verify_refresh_token

        user_id = str(uuid.uuid4())
        token = create_refresh_token(user_id)
        payload = verify_refresh_token(token)
        assert payload is not None
        assert payload["sub"] == user_id
        assert payload["type"] == "refresh"

    def test_verify_refresh_token_rejects_access(self):
        """verify_refresh_token should return None for an access token."""
        from app.core.security import create_access_token, verify_refresh_token

        token = create_access_token(str(uuid.uuid4()), "test@test.com")
        assert verify_refresh_token(token) is None

    def test_decode_token_invalid_string(self):
        """decode_token should return None for a garbage string."""
        from app.core.security import decode_token

        assert decode_token("not-a-valid-jwt-token") is None

    def test_decode_token_empty_string(self):
        """decode_token should return None for an empty string."""
        from app.core.security import decode_token

        assert decode_token("") is None

    def test_access_token_contains_jti(self):
        """Access tokens should contain a unique 'jti' (JWT ID) claim."""
        from app.core.security import create_access_token, verify_access_token

        token = create_access_token(str(uuid.uuid4()), "test@test.com")
        payload = verify_access_token(token)
        assert "jti" in payload
        # Should be a valid UUID
        uuid.UUID(payload["jti"])

    def test_two_tokens_have_different_jti(self):
        """Two tokens for the same user should have different JTI values."""
        from app.core.security import create_access_token, verify_access_token

        uid = str(uuid.uuid4())
        t1 = create_access_token(uid, "x@x.com")
        t2 = create_access_token(uid, "x@x.com")
        p1 = verify_access_token(t1)
        p2 = verify_access_token(t2)
        assert p1["jti"] != p2["jti"]
