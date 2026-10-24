"""
EthioVuln — Authentication & Password Reset Unit Tests
"""

import pytest
from app.core.security import (
    create_password_reset_token,
    verify_password_reset_token,
    create_access_token,
    hash_password,
    verify_password,
)


class TestPasswordResetTokens:
    def test_create_and_verify_valid_reset_token(self):
        user_id = "11111111-1111-1111-1111-111111111111"
        email = "analyst@agency.et"
        token = create_password_reset_token(user_id=user_id, email=email)

        payload = verify_password_reset_token(token)
        assert payload is not None
        assert payload.get("sub") == user_id
        assert payload.get("email") == email
        assert payload.get("type") == "password_reset"

    def test_verify_reset_token_rejects_tampered_token(self):
        user_id = "11111111-1111-1111-1111-111111111111"
        email = "analyst@agency.et"
        token = create_password_reset_token(user_id=user_id, email=email)
        tampered = token[:-5] + "XXXXX"

        payload = verify_password_reset_token(tampered)
        assert payload is None

    def test_verify_reset_token_rejects_access_token(self):
        user_id = "11111111-1111-1111-1111-111111111111"
        email = "analyst@agency.et"
        access_token = create_access_token(user_id=user_id, email=email)

        # Access tokens must never be accepted as password reset tokens
        payload = verify_password_reset_token(access_token)
        assert payload is None

    def test_password_hashing_and_verification(self):
        raw_pw = "SuperSecurePassword123!"
        hashed = hash_password(raw_pw)
        assert hashed != raw_pw
        assert verify_password(raw_pw, hashed) is True
        assert verify_password("WrongPassword!", hashed) is False
