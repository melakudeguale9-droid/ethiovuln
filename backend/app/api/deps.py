"""
EthioVuln — API Dependencies
Authentication and database session injection.
"""

import uuid
from datetime import datetime, timezone, timedelta
from fastapi import Depends, HTTPException, status, WebSocket, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.core.security import verify_access_token
from app.models.user import User

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate user from JWT bearer token or secure HttpOnly cookie."""
    token = credentials.credentials if credentials else request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    result = await db.execute(
        select(User).where(User.id == uuid.UUID(user_id))
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or session expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )

    request.state.user = user
    request.state.user_id = str(user.id)
    return user


def verify_user_trial(user: User) -> None:
    """
    Validates that a user is on an active subscription or has a valid 7-day trial.
    If the user is on the 'Free' tier and 7 days have passed since registration (or trial_ends_at),
    raises HTTP 402 Payment Required.
    """
    if getattr(user, "is_admin", False):
        return

    tier = getattr(user, "subscription_tier", "Free")
    # If the user has upgraded to any paid subscription tier, access is granted
    if tier and tier.strip().lower() not in ("free", "trial"):
        return

    now = datetime.now(timezone.utc)
    trial_ends = getattr(user, "trial_ends_at", None)

    if trial_ends is not None:
        is_expired = now > trial_ends
    elif getattr(user, "created_at", None) is not None:
        is_expired = now > (user.created_at + timedelta(days=7))
    else:
        is_expired = False

    if is_expired:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Your 7-day free trial has expired. Core security features are locked until an active Monthly or Annual subscription is selected.",
        )


async def require_active_subscription(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency that enforces the 7-day free trial limit.
    Blocks core feature access with HTTP 402 Payment Required if expired.
    """
    verify_user_trial(current_user)
    return current_user


security_scheme_optional = HTTPBearer(auto_error=False)



async def get_current_user_optional(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme_optional),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Extract current user if bearer token or cookie is present; returns None for unauthenticated public requests."""
    token = credentials.credentials if credentials else request.cookies.get("access_token")
    if not token:
        return None
    payload = verify_access_token(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    try:
        result = await db.execute(
            select(User).where(User.id == uuid.UUID(user_id))
        )
        user = result.scalar_one_or_none()
        if user and user.is_active:
            request.state.user = user
            request.state.user_id = str(user.id)
            return user
    except Exception:
        return None
    return None


async def get_ws_user(
    websocket: WebSocket,
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """
    Extract user from WebSocket query parameter token.
    WebSocket connections pass the token as ?token=<jwt>
    """
    token = websocket.query_params.get("token")
    if not token:
        return None

    payload = verify_access_token(token)
    if not payload:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    result = await db.execute(
        select(User).where(User.id == uuid.UUID(user_id))
    )
    return result.scalar_one_or_none()
