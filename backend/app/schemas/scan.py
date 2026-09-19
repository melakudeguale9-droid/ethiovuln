"""
EthioVuln — Scan Schemas (Pydantic)
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl, model_validator
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
    items: list[ScanResponse]
    total_items: int
    total_pages: int
    page: int
    limit: int
    # Compatibility fields for existing callers
    scans: list[ScanResponse] | None = None
    total: int | None = None
    page_size: int | None = None

    @model_validator(mode="before")
    @classmethod
    def populate_compat_fields(cls, data):
        if isinstance(data, dict):
            # Create a copy so we don't mutate input kwargs
            d = dict(data)
            if "items" in d and d.get("scans") is None:
                d["scans"] = d["items"]
            if "total_items" in d and d.get("total") is None:
                d["total"] = d["total_items"]
            if "limit" in d and d.get("page_size") is None:
                d["page_size"] = d["limit"]
            return d
        return data

    model_config = {"from_attributes": True}


# Alias for clarity
ScanPaginatedResponse = ScanListResponse


class ScanDetailResponse(ScanResponse):
    vulnerabilities: list["VulnerabilityResponse"] = []


# Forward reference resolved after VulnerabilityResponse is defined
from app.schemas.vulnerability import VulnerabilityResponse

ScanDetailResponse.model_rebuild()
