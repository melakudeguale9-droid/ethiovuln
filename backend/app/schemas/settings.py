"""
EthioVuln — Settings & Preferences Schemas (Pydantic)
Dedicated schema definitions for user profile, scanner preferences, and API keys.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class ProfileResponse(BaseModel):
    id: str
    email: str
    username: str
    full_name: Optional[str] = None
    role: str = "Cyber Security Student"
    is_admin: bool
    is_active: bool
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=255)
    username: Optional[str] = Field(None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    role: Optional[str] = Field(None, max_length=100)


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
    name: str = Field(..., min_length=1, max_length=100)


class ApiKeyResponse(BaseModel):
    id: str
    name: str
    prefix: str
    created_at: Optional[str] = None
    last_used_at: Optional[str] = None
    is_active: bool


class SubscriptionResponse(BaseModel):
    subscription_tier: str
    trial_ends_at: Optional[str] = None
    is_trial_expired: bool
    days_remaining: int
    created_at: Optional[str] = None


class SubscriptionUpgradeRequest(BaseModel):
    tier: str = Field(..., min_length=2, max_length=50, description="Target subscription package: Monthly or Annual")

