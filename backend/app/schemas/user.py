"""
EthioVuln — User Schemas (Pydantic)
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: str = Field(..., min_length=5, max_length=255)
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8, max_length=128)
    full_name: str | None = Field(None, max_length=255)
    role: str = Field(default="Cyber Security Student", max_length=100)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    username: str
    full_name: str | None
    role: str = "Cyber Security Student"
    subscription_tier: str = "Free"
    trial_ends_at: datetime | None = None
    is_active: bool = True
    is_admin: bool = False
    tos_accepted_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenRefresh(BaseModel):
    refresh_token: str


class AcceptTosRequest(BaseModel):
    accepted: bool = True


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="User's registered email address")


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., description="Signed password reset token")
    new_password: str = Field(..., min_length=8, max_length=128, description="New secure password")


