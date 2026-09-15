"""
EthioVuln — Scan Schemas (Pydantic)
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl
from app.models.scan import ScanStatus, ScanType


class ScanCreate(BaseModel):
    target_url: str = Field(..., min_length=10, max_length=2048)
    scan_type: ScanType = ScanType.FULL
    tos_accepted: bool = Field(
        ..., description="User must accept Terms of Service"
    )


class ScanResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    target_url: str
    target_domain: str
    status: ScanStatus
    scan_type: ScanType
    progress: int
    total_vulnerabilities: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    info_count: int
    celery_task_id: str | None
    error_message: str | None
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ScanListResponse(BaseModel):
    scans: list[ScanResponse]
    total: int
    page: int
    page_size: int


class ScanDetailResponse(ScanResponse):
    vulnerabilities: list["VulnerabilityResponse"] = []


# Forward reference resolved after VulnerabilityResponse is defined
from app.schemas.vulnerability import VulnerabilityResponse

ScanDetailResponse.model_rebuild()
