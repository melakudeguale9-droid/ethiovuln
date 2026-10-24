"""
EthioVuln — 7-Day Free Trial & Subscription Enforcement Unit Tests
"""

import pytest
import uuid
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, status
from app.api.deps import verify_user_trial
from app.models.user import User


class TestTrialEnforcement:
    def test_active_trial_user_passes(self):
        user = User(
            id=uuid.uuid4(),
            email="activetrial@agency.et",
            username="activetrial",
            hashed_password="hashedpassword",
            subscription_tier="Free",
            trial_ends_at=datetime.now(timezone.utc) + timedelta(days=5),
            is_admin=False,
        )
        # Should execute without raising any exception
        verify_user_trial(user)

    def test_expired_trial_user_raises_402(self):
        user = User(
            id=uuid.uuid4(),
            email="expiredtrial@agency.et",
            username="expiredtrial",
            hashed_password="hashedpassword",
            subscription_tier="Free",
            trial_ends_at=datetime.now(timezone.utc) - timedelta(days=1),
            is_admin=False,
        )
        with pytest.raises(HTTPException) as excinfo:
            verify_user_trial(user)

        assert excinfo.value.status_code == status.HTTP_402_PAYMENT_REQUIRED
        assert "7-day free trial has expired" in excinfo.value.detail

    def test_fallback_to_created_at_when_trial_ends_at_missing(self):
        # User registered 8 days ago without explicit trial_ends_at
        user = User(
            id=uuid.uuid4(),
            email="olduser@agency.et",
            username="olduser",
            hashed_password="hashedpassword",
            subscription_tier="Free",
            trial_ends_at=None,
            created_at=datetime.now(timezone.utc) - timedelta(days=8),
            is_admin=False,
        )
        with pytest.raises(HTTPException) as excinfo:
            verify_user_trial(user)

        assert excinfo.value.status_code == status.HTTP_402_PAYMENT_REQUIRED

    def test_paid_monthly_tier_allowed_after_trial_date(self):
        user = User(
            id=uuid.uuid4(),
            email="pro@agency.et",
            username="pro",
            hashed_password="hashedpassword",
            subscription_tier="Monthly",
            trial_ends_at=datetime.now(timezone.utc) - timedelta(days=30),
            is_admin=False,
        )
        # Paid tier should never be blocked by trial expiry
        verify_user_trial(user)

    def test_paid_annual_tier_allowed(self):
        user = User(
            id=uuid.uuid4(),
            email="annual@agency.et",
            username="annual",
            hashed_password="hashedpassword",
            subscription_tier="Annual",
            trial_ends_at=datetime.now(timezone.utc) - timedelta(days=60),
            is_admin=False,
        )
        verify_user_trial(user)

    def test_admin_user_bypasses_trial_expiration(self):
        user = User(
            id=uuid.uuid4(),
            email="admin@agency.et",
            username="admin",
            hashed_password="hashedpassword",
            subscription_tier="Free",
            trial_ends_at=datetime.now(timezone.utc) - timedelta(days=100),
            is_admin=True,
        )
        # Admin must bypass trial checks
        verify_user_trial(user)

    @pytest.mark.asyncio
    async def test_admin_bypasses_require_active_subscription_dependency(self):
        from app.api.deps import require_active_subscription
        user = User(
            id=uuid.uuid4(),
            email="owner@ethiovuln.com",
            username="owner",
            hashed_password="hashedpassword",
            subscription_tier="Free",
            trial_ends_at=datetime.now(timezone.utc) - timedelta(days=365),
            is_admin=True,
        )
        result = await require_active_subscription(current_user=user)
        assert result == user

