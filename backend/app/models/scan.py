"""
EthioVuln — Scan Model
"""
from __future__ import annotations

import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Enum, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ScanStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFYING = "verifying"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ScanType(str, enum.Enum):
    FULL = "full"
    NUCLEI_ONLY = "nuclei_only"
    ZAP_ONLY = "zap_only"
    FUZZ_ONLY = "fuzz_only"
    NUCLEI_ZAP = "nuclei_zap"


class Scan(Base):
    __tablename__ = "scans"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    target_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    target_domain: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[ScanStatus] = mapped_column(
        Enum(ScanStatus), default=ScanStatus.PENDING
    )
    scan_type: Mapped[ScanType] = mapped_column(
        Enum(ScanType), default=ScanType.FULL
    )
    progress: Mapped[int] = mapped_column(Integer, default=0)
    total_vulnerabilities: Mapped[int] = mapped_column(Integer, default=0)
    critical_count: Mapped[int] = mapped_column(Integer, default=0)
    high_count: Mapped[int] = mapped_column(Integer, default=0)
    medium_count: Mapped[int] = mapped_column(Integer, default=0)
    low_count: Mapped[int] = mapped_column(Integer, default=0)
    info_count: Mapped[int] = mapped_column(Integer, default=0)
    celery_task_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="scans")
    vulnerabilities = relationship(
        "Vulnerability", back_populates="scan", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Scan {self.id} target={self.target_url} status={self.status}>"
