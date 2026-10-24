"""
EthioVuln — Authentication API Routes
"""

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.rate_limit import limiter
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    TokenRefresh,
    AcceptTosRequest,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    create_password_reset_token,
    verify_password_reset_token,
)
from app.api.deps import get_current_user
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=201)
@limiter.limit("10/minute")
async def register(request: Request, data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user account with security telemetry role."""
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

    now = datetime.now(timezone.utc)
    user = User(
        email=data.email,
        username=data.username,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role=data.role if data.role else "Cyber Security Student",
        subscription_tier="Free",
        trial_ends_at=now + timedelta(days=7),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    """Authenticate user, return JWT tokens, and set secure HttpOnly session cookies."""
    # Form data uses 'username' field, which we map to email
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()

    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent", "")

    if not user:
        # Prevent user enumeration timing attacks
        hash_password(form_data.password)
        is_valid_password = False
    else:
        is_valid_password = verify_password(form_data.password, user.hashed_password)

    if not is_valid_password:
        # Record failed login
        if user:
            from app.models.settings import LoginHistory
            db.add(LoginHistory(user_id=user.id, ip_address=ip, user_agent=ua, success=False))
            await db.commit()
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

    access_token = create_access_token(
        str(user.id),
        user.email,
        role=getattr(user, "role", "Cyber Security Student"),
        is_admin=getattr(user, "is_admin", False),
    )
    refresh_token = create_refresh_token(str(user.id))

    # ─── Set Secure Session Cookies (HttpOnly, Secure, SameSite) ───────────
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Prevents JavaScript document.cookie access (mitigates XSS token theft)
        secure=not settings.DEBUG,  # Only transmitted over HTTPS in production
        samesite="lax",  # Mitigates CSRF
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/api/auth",
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: Request,
    response: Response,
    data: TokenRefresh | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Refresh an expired access token using bearer payload or HttpOnly cookie."""
    raw_token = data.refresh_token if data and data.refresh_token else request.cookies.get("refresh_token")
    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing refresh token",
        )

    payload = verify_refresh_token(raw_token)
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

    access_token = create_access_token(
        str(user.id),
        user.email,
        role=getattr(user, "role", "Cyber Security Student"),
        is_admin=getattr(user, "is_admin", False),
    )
    new_refresh = create_refresh_token(str(user.id))

    # Re-issue refreshed HttpOnly session cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/api/auth",
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/logout")
async def logout(response: Response):
    """Invalidate session by clearing HttpOnly cookies."""
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/api/auth")
    return {"message": "Session logged out and cookies cleared successfully"}



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


@router.post("/forgot-password")
@limiter.limit("5/minute")
async def forgot_password(
    request: Request,
    data: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate a password reset token for account recovery.
    Prevents account enumeration by returning a standardized confirmation message.
    """
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    reset_token = None
    if user and user.is_active:
        reset_token = create_password_reset_token(str(user.id), user.email)

    return {
        "message": "If an account with that email exists, password reset instructions have been generated.",
        "reset_token": reset_token if settings.DEBUG else None,
    }


@router.post("/reset-password")
@limiter.limit("5/minute")
async def reset_password(
    request: Request,
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Reset user password using a verified time-limited reset token.
    """
    payload = verify_password_reset_token(data.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid, expired, or malformed password reset token",
        )

    user_id = payload.get("sub")
    email = payload.get("email")

    import uuid
    try:
        user_uuid = uuid.UUID(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token identifier",
        )

    result = await db.execute(select(User).where(User.id == user_uuid, User.email == email))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found or deactivated",
        )

    user.hashed_password = hash_password(data.new_password)
    await db.flush()
    await db.refresh(user)

    return {"message": "Password has been successfully reset. You can now sign in with your new credentials."}

