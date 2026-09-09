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
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.database import get_db
from app.models.user import User
from app.models.settings import UserPreferences, ApiKey, LoginHistory
from app.models.scan import Scan
from app.api.deps import get_current_user
from app.core.security import hash_password, verify_password

router = APIRouter(prefix="/api/settings", tags=["Settings"])
limiter = Limiter(key_func=get_remote_address)


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


# ─── Schemas ─────────────────────────────────────────────────────────────────

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None


class PreferencesUpdate(BaseModel):
    default_scan_type: Optional[str] = None
    default_scan_timeout: Optional[int] = None
    default_fuzzer_threads: Optional[int] = None
    auto_stop_on_critical: Optional[bool] = None
    exclude_paths: Optional[str] = None
    default_severity_filter: Optional[str] = None
    items_per_page: Optional[int] = None
    show_stats_cards: Optional[bool] = None
    notify_scan_complete: Optional[bool] = None
    notify_critical_finding: Optional[bool] = None
    notify_email: Optional[bool] = None
    report_include_low: Optional[bool] = None
    report_company_name: Optional[str] = None


class ApiKeyCreate(BaseModel):
    name: str


# ─── Profile ─────────────────────────────────────────────────────────────────

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "is_admin": current_user.is_admin,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    }


@router.patch("/profile")
async def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update user profile (name, username, email)."""
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

    await db.flush()
    await db.refresh(current_user)
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "is_admin": current_user.is_admin,
    }


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
