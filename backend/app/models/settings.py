"""
EthioVuln — User Settings, API Keys, Login History Models
"""
from __future__ import annotations

import uuid
import secrets
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text, Integer, JSON, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class UserPreferences(Base):
    """Stores per-user preferences for scans, dashboard, notifications, reports."""
    __tablename__ = "user_preferences"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Scan Preferences
    default_scan_type: Mapped[str] = mapped_column(String(50), default="full")
    default_scan_timeout: Mapped[int] = mapped_column(Integer, default=30)
    default_fuzzer_threads: Mapped[int] = mapped_column(Integer, default=30)
    auto_stop_on_critical: Mapped[bool] = mapped_column(Boolean, default=False)
    exclude_paths: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Dashboard Preferences
    default_severity_filter: Mapped[str] = mapped_column(String(20), default="all")
    items_per_page: Mapped[int] = mapped_column(Integer, default=20)
    show_stats_cards: Mapped[bool] = mapped_column(Boolean, default=True)

    # Notifications
    notify_scan_complete: Mapped[bool] = mapped_column(Boolean, default=True)
    notify_critical_finding: Mapped[bool] = mapped_column(Boolean, default=True)
    notify_email: Mapped[bool] = mapped_column(Boolean, default=False)

    # Reports
    report_include_low: Mapped[bool] = mapped_column(Boolean, default=True)
    report_company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="preferences")


class ApiKey(Base):
    """Personal API keys for programmatic access."""
    __tablename__ = "api_keys"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    key_prefix: Mapped[str] = mapped_column(String(8), nullable=False)
    hashed_key: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="api_keys")


class LoginHistory(Base):
    """Records login attempts for security audit."""
    __tablename__ = "login_history"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(500), nullable=True)
    success: Mapped[bool] = mapped_column(Boolean, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="login_history")
