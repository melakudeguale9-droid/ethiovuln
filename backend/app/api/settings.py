"""
EthioVuln — Settings API Routes
Handles: preferences, API keys, login history, profile update, avatar, export, delete account
"""

import uuid
import json
import hashlib
import secrets
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from app.core.rate_limit import limiter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.database import get_db
from app.models.user import User
from app.models.settings import UserPreferences, ApiKey, LoginHistory
from app.models.scan import Scan
from app.api.deps import get_current_user
from app.core.security import hash_password, verify_password

from app.schemas.settings import (
    ProfileResponse,
    ProfileUpdate,
    PreferencesUpdate,
    ApiKeyCreate,
    SubscriptionResponse,
    SubscriptionUpgradeRequest,
)

router = APIRouter(prefix="/api/settings", tags=["Settings"])


# ─── Helper ──────────────────────────────────────────────────────────────────

async def get_or_create_preferences(user: User, db: AsyncSession) -> UserPreferences:
    result = await db.execute(
        select(UserPreferences).where(UserPreferences.user_id == user.id)
    )
    prefs = result.scalar_one_or_none()
    if not prefs:
        prefs = UserPreferences(user_id=user.id)
        db.add(prefs)
        await db.flush()
        await db.refresh(prefs)
    return prefs


# ─── Profile ─────────────────────────────────────────────────────────────────

@router.get("/profile", response_model=ProfileResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile with security telemetry role."""
    return ProfileResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        role=getattr(current_user, "role", "Cyber Security Student") or "Cyber Security Student",
        is_admin=current_user.is_admin,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None,
    )


@router.patch("/profile", response_model=ProfileResponse)
async def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update user profile (name, username, email, role)."""
    if data.email and data.email != current_user.email:
        existing = await db.execute(select(User).where(User.email == data.email))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="Email already in use")
        current_user.email = data.email

    if data.username and data.username != current_user.username:
        existing = await db.execute(select(User).where(User.username == data.username))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="Username already taken")
        current_user.username = data.username

    if data.full_name is not None:
        current_user.full_name = data.full_name

    if data.role is not None:
        current_user.role = data.role.strip()

    await db.flush()
    await db.refresh(current_user)
    return ProfileResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        role=getattr(current_user, "role", "Cyber Security Student") or "Cyber Security Student",
        is_admin=current_user.is_admin,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None,
    )


# ─── Preferences ─────────────────────────────────────────────────────────────

@router.get("/preferences")
async def get_preferences(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user preferences."""
    prefs = await get_or_create_preferences(current_user, db)
    return {
        "default_scan_type": prefs.default_scan_type,
        "default_scan_timeout": prefs.default_scan_timeout,
        "default_fuzzer_threads": prefs.default_fuzzer_threads,
        "auto_stop_on_critical": prefs.auto_stop_on_critical,
        "exclude_paths": prefs.exclude_paths or "",
        "default_severity_filter": prefs.default_severity_filter,
        "items_per_page": prefs.items_per_page,
        "show_stats_cards": prefs.show_stats_cards,
        "notify_scan_complete": prefs.notify_scan_complete,
        "notify_critical_finding": prefs.notify_critical_finding,
        "notify_email": prefs.notify_email,
        "report_include_low": prefs.report_include_low,
        "report_company_name": prefs.report_company_name or "",
    }


@router.patch("/preferences")
async def update_preferences(
    data: PreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update user preferences."""
    prefs = await get_or_create_preferences(current_user, db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(prefs, field, value)
    await db.flush()
    await db.refresh(prefs)
    return {"message": "Preferences updated successfully"}


# ─── API Keys ─────────────────────────────────────────────────────────────────

@router.get("/api-keys")
async def list_api_keys(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all API keys for current user."""
    result = await db.execute(
        select(ApiKey).where(ApiKey.user_id == current_user.id, ApiKey.is_active == True)
    )
    keys = result.scalars().all()
    return [
        {
            "id": str(k.id),
            "name": k.name,
            "key_prefix": k.key_prefix,
            "last_used_at": k.last_used_at.isoformat() if k.last_used_at else None,
            "created_at": k.created_at.isoformat(),
        }
        for k in keys
    ]


@router.post("/api-keys")
@limiter.limit("5/minute")
async def create_api_key(
    request: Request,
    data: ApiKeyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate a new API key. Returns the raw key once — store it safely."""
    # Check limit: max 5 active keys per user
    result = await db.execute(
        select(ApiKey).where(ApiKey.user_id == current_user.id, ApiKey.is_active == True)
    )
    if len(result.scalars().all()) >= 5:
        raise HTTPException(status_code=400, detail="Maximum of 5 API keys allowed")

    raw_key = f"ev_{secrets.token_urlsafe(32)}"
    prefix = raw_key[:8]
    hashed = hashlib.sha256(raw_key.encode()).hexdigest()

    key = ApiKey(
        user_id=current_user.id,
        name=data.name,
        key_prefix=prefix,
        hashed_key=hashed,
    )
    db.add(key)
    await db.flush()
    await db.refresh(key)

    return {
        "id": str(key.id),
        "name": key.name,
        "key_prefix": prefix,
        "raw_key": raw_key,  # shown once only
        "created_at": key.created_at.isoformat(),
        "warning": "Save this key now — it will not be shown again.",
    }


@router.delete("/api-keys/{key_id}")
async def revoke_api_key(
    key_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Revoke an API key."""
    result = await db.execute(
        select(ApiKey).where(ApiKey.id == uuid.UUID(key_id), ApiKey.user_id == current_user.id)
    )
    key = result.scalar_one_or_none()
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    key.is_active = False
    await db.flush()
    return {"message": "API key revoked"}


# ─── Login History ────────────────────────────────────────────────────────────

@router.get("/login-history")
async def get_login_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get last 20 login attempts."""
    result = await db.execute(
        select(LoginHistory)
        .where(LoginHistory.user_id == current_user.id)
        .order_by(LoginHistory.created_at.desc())
        .limit(20)
    )
    entries = result.scalars().all()
    return [
        {
            "id": str(e.id),
            "ip_address": e.ip_address or "Unknown",
            "user_agent": e.user_agent or "Unknown",
            "success": e.success,
            "created_at": e.created_at.isoformat(),
        }
        for e in entries
    ]


# ─── Export Data ──────────────────────────────────────────────────────────────

@router.get("/export")
async def export_my_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Export all user data as JSON."""
    scans_result = await db.execute(
        select(Scan).where(Scan.user_id == current_user.id)
    )
    scans = scans_result.scalars().all()

    prefs = await get_or_create_preferences(current_user, db)

    return {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "username": current_user.username,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        },
        "preferences": {
            "default_scan_type": prefs.default_scan_type,
            "default_scan_timeout": prefs.default_scan_timeout,
            "notify_scan_complete": prefs.notify_scan_complete,
            "report_company_name": prefs.report_company_name,
        },
        "scans": [
            {
                "id": str(s.id),
                "target_url": s.target_url,
                "status": s.status.value,
                "scan_type": s.scan_type.value,
                "total_vulnerabilities": s.total_vulnerabilities,
                "created_at": s.created_at.isoformat(),
            }
            for s in scans
        ],
        "total_scans": len(scans),
    }


# ─── Danger Zone ──────────────────────────────────────────────────────────────

class DeleteHistoryRequest(BaseModel):
    confirm: bool


class DeleteAccountRequest(BaseModel):
    password: str
    confirm: bool


@router.delete("/scan-history")
async def delete_scan_history(
    data: DeleteHistoryRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete all scan history for current user."""
    if not data.confirm:
        raise HTTPException(status_code=400, detail="Confirmation required")
    await db.execute(delete(Scan).where(Scan.user_id == current_user.id))
    await db.flush()
    return {"message": "All scan history deleted"}


@router.delete("/account")
@limiter.limit("3/minute")
async def delete_account(
    request: Request,
    data: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Permanently delete user account and all associated data."""
    if not data.confirm:
        raise HTTPException(status_code=400, detail="Confirmation required")

    if not verify_password(data.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    await db.delete(current_user)
    await db.flush()
    return {"message": "Account permanently deleted"}


@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription_status(
    current_user: User = Depends(get_current_user),
):
    """
    Get user's current subscription tier, trial status, and remaining days.
    """
    tier = getattr(current_user, "subscription_tier", "Free")
    trial_ends = getattr(current_user, "trial_ends_at", None)
    now = datetime.now(timezone.utc)

    if getattr(current_user, "is_admin", False):
        is_expired = False
        days_remaining = 365
        trial_ends_str = trial_ends.isoformat() if trial_ends else None
    elif trial_ends:
        diff = trial_ends - now
        days_remaining = max(0, diff.days if diff.total_seconds() > 0 else 0)
        is_expired = now > trial_ends and tier.strip().lower() in ("free", "trial")
        trial_ends_str = trial_ends.isoformat()
    elif current_user.created_at:
        from datetime import timedelta
        calculated_end = current_user.created_at + timedelta(days=7)
        diff = calculated_end - now
        days_remaining = max(0, diff.days if diff.total_seconds() > 0 else 0)
        is_expired = now > calculated_end and tier.strip().lower() in ("free", "trial")
        trial_ends_str = calculated_end.isoformat()
    else:
        days_remaining = 7
        is_expired = False
        trial_ends_str = None

    return SubscriptionResponse(
        subscription_tier=tier,
        trial_ends_at=trial_ends_str,
        is_trial_expired=is_expired,
        days_remaining=days_remaining,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None,
    )


@router.post("/subscription/upgrade")
async def upgrade_subscription(
    data: SubscriptionUpgradeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Upgrade user subscription package (e.g. Monthly, Annual, Enterprise).
    Restores full access to all core DAST features.
    """
    valid_tiers = ["Monthly", "Annual", "Pro Monthly", "Pro Annual", "Enterprise"]
    selected = data.tier.strip()
    match = next((vt for vt in valid_tiers if vt.lower() == selected.lower()), None)
    if not match:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid subscription tier. Please choose from: {', '.join(valid_tiers)}",
        )

    current_user.subscription_tier = match
    await db.flush()
    await db.refresh(current_user)

    return {
        "message": f"Successfully activated {match} subscription package. All core security features are unlocked.",
        "subscription_tier": current_user.subscription_tier,
    }

