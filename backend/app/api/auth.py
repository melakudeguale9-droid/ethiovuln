"""
EthioVuln — Authentication API Routes
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    TokenRefresh,
    AcceptTosRequest,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
)
from app.api.deps import get_current_user
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/auth", tags=["Authentication"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/register", response_model=UserResponse, status_code=201)
@limiter.limit("10/minute")
async def register(request: Request, data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    # Check if email already exists
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Check if username already exists
    existing = await db.execute(
        select(User).where(User.username == data.username)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )

    user = User(
        email=data.email,
        username=data.username,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate user and return JWT tokens."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent", "")

    if not user or not verify_password(data.password, user.hashed_password):
        # Record failed login
        if user:
            from app.models.settings import LoginHistory
            db.add(LoginHistory(user_id=user.id, ip_address=ip, user_agent=ua, success=False))
            await db.flush()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    # Record successful login
    from app.models.settings import LoginHistory
    db.add(LoginHistory(user_id=user.id, ip_address=ip, user_agent=ua, success=True))
    await db.flush()

    access_token = create_access_token(str(user.id), user.email)
    refresh_token = create_refresh_token(str(user.id))

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: TokenRefresh, db: AsyncSession = Depends(get_db)):
    """Refresh an expired access token."""
    payload = verify_refresh_token(data.refresh_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    import uuid

    user_id = payload.get("sub")
    result = await db.execute(
        select(User).where(User.id == uuid.UUID(user_id))
    )
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or deactivated",
        )

    access_token = create_access_token(str(user.id), user.email)
    new_refresh = create_refresh_token(str(user.id))

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return current_user


@router.post("/accept-tos", response_model=UserResponse)
async def accept_tos(
    data: AcceptTosRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Accept the Terms of Service and Security Disclaimer."""
    if data.accepted:
        current_user.tos_accepted_at = datetime.now(timezone.utc)
        await db.flush()
        await db.refresh(current_user)
    return current_user


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/change-password")
@limiter.limit("5/minute")
async def change_password(
    request: Request,
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Change the current user's password."""
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters",
        )

    current_user.hashed_password = hash_password(data.new_password)
    await db.flush()
    await db.refresh(current_user)
    return {"message": "Password changed successfully"}
