"""
EthioVuln — Scan API Routes
"""

import uuid
from datetime import datetime, timezone
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, HTTPException, Request, status, Query
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.scan import Scan, ScanStatus
from app.models.vulnerability import Vulnerability
from app.schemas.scan import (
    ScanCreate,
    ScanResponse,
    ScanListResponse,
    ScanDetailResponse,
)
from app.api.deps import get_current_user
from app.core.target_verification import target_verifier

router = APIRouter(prefix="/api/scans", tags=["Scans"])
limiter = Limiter(key_func=get_remote_address)


@router.post("", response_model=ScanResponse, status_code=201)
@limiter.limit("10/minute")
async def create_scan(
    request: Request,
    data: ScanCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create and launch a new vulnerability scan."""
    # Check ToS acceptance
    if not data.tos_accepted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must accept the Terms of Service and Security Disclaimer before scanning.",
        )

    if not current_user.tos_accepted_at:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please accept the Terms of Service via your profile before launching scans.",
        )

    # Verify target
    verification = target_verifier.verify_target(data.target_url)
    if not verification.is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Target verification failed: {verification.message}",
        )

    # Extract domain
    parsed = urlparse(data.target_url)
    domain = parsed.hostname or ""

    # Create scan record
    scan = Scan(
        user_id=current_user.id,
        target_url=data.target_url,
        target_domain=domain,
        scan_type=data.scan_type,
        status=ScanStatus.PENDING,
    )
    db.add(scan)
    await db.commit()
    await db.refresh(scan)

    # Dispatch Celery task — commit first so worker can read the scan from DB
    try:
        from app.workers.tasks import run_scan_task

        scan.status = ScanStatus.VERIFYING
        await db.commit()
        await db.refresh(scan)

        task = run_scan_task.apply_async(args=[str(scan.id)], queue='default')
        scan.celery_task_id = task.id
        await db.commit()
        await db.refresh(scan)
    except Exception as e:
        scan.status = ScanStatus.FAILED
        scan.error_message = f"Failed to queue scan: {str(e)}"
        await db.commit()
        await db.refresh(scan)

    return scan


@router.get("", response_model=ScanListResponse)
async def list_scans(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List the current user's scans with pagination."""
    # Count total
    count_query = select(func.count()).select_from(Scan).where(
        Scan.user_id == current_user.id
    )
    total = (await db.execute(count_query)).scalar() or 0

    # Fetch page
    offset = (page - 1) * page_size
    query = (
        select(Scan)
        .where(Scan.user_id == current_user.id)
        .order_by(desc(Scan.created_at))
        .offset(offset)
        .limit(page_size)
    )
    result = await db.execute(query)
    scans = result.scalars().all()

    return ScanListResponse(
        scans=scans,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{scan_id}", response_model=ScanDetailResponse)
async def get_scan(
    scan_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get detailed scan information including vulnerabilities."""
    query = (
        select(Scan)
        .options(selectinload(Scan.vulnerabilities))
        .where(Scan.id == scan_id, Scan.user_id == current_user.id)
    )
    result = await db.execute(query)
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found",
        )

    return scan


@router.post("/{scan_id}/stop", response_model=ScanResponse)
async def stop_scan(
    scan_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Cancel a running scan."""
    result = await db.execute(
        select(Scan).where(Scan.id == scan_id, Scan.user_id == current_user.id)
    )
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found",
        )

    if scan.status not in (ScanStatus.PENDING, ScanStatus.VERIFYING, ScanStatus.RUNNING):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot stop scan with status '{scan.status}'",
        )

    # Revoke Celery task if running
    if scan.celery_task_id:
        try:
            from app.workers.celery_app import celery_app

            celery_app.control.revoke(scan.celery_task_id, terminate=True)
        except Exception:
            pass

    scan.status = ScanStatus.CANCELLED
    scan.completed_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(scan)

    return scan


@router.get("/{scan_id}/vulnerabilities")
async def get_scan_vulnerabilities(
    scan_id: uuid.UUID,
    severity: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get vulnerabilities for a specific scan, optionally filtered by severity."""
    # Verify scan belongs to user
    scan_result = await db.execute(
        select(Scan).where(Scan.id == scan_id, Scan.user_id == current_user.id)
    )
    if not scan_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Scan not found")

    query = select(Vulnerability).where(Vulnerability.scan_id == scan_id)
    if severity:
        query = query.where(Vulnerability.severity == severity)
    query = query.order_by(desc(Vulnerability.cvss_score))

    result = await db.execute(query)
    vulns = result.scalars().all()

    return [
        {
            "id": str(v.id),
            "title": v.title,
            "description": v.description,
            "severity": v.severity,
            "cvss_score": v.cvss_score,
            "cvss_vector": v.cvss_vector,
            "cwe_id": v.cwe_id,
            "cwe_name": v.cwe_name,
            "url": v.url,
            "evidence": v.evidence,
            "remediation": v.remediation,
            "source": v.source,
            "found_at": v.found_at.isoformat() if v.found_at else None,
        }
        for v in vulns
    ]
