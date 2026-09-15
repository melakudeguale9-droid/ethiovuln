"""
EthioVuln — Reports API Routes
PDF report generation and download.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.scan import Scan, ScanStatus
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/{scan_id}/pdf")
async def generate_pdf_report(
    scan_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate and download a PDF executive summary for a completed scan."""
    # Fetch scan with vulnerabilities
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

    if scan.status != ScanStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot generate report for scan with status '{scan.status}'. Scan must be completed.",
        )

    # Prepare scan data
    scan_data = {
        "id": str(scan.id),
        "target_url": scan.target_url,
        "scan_type": scan.scan_type.value if scan.scan_type else "full",
        "started_at": scan.started_at.strftime("%Y-%m-%d %H:%M UTC") if scan.started_at else "N/A",
        "completed_at": scan.completed_at.strftime("%Y-%m-%d %H:%M UTC") if scan.completed_at else "N/A",
        "total_vulnerabilities": scan.total_vulnerabilities,
        "critical_count": scan.critical_count,
        "high_count": scan.high_count,
        "medium_count": scan.medium_count,
        "low_count": scan.low_count,
        "info_count": scan.info_count,
    }

    # Prepare vulnerability data
    vuln_data = [
        {
            "title": v.title,
            "description": v.description or "",
            "severity": v.severity.value if v.severity else "info",
            "cvss_score": v.cvss_score or 0.0,
            "cvss_vector": v.cvss_vector or "",
            "cwe_id": v.cwe_id or "",
            "cwe_name": v.cwe_name or "",
            "url": v.url or "",
            "evidence": v.evidence or "",
            "remediation": v.remediation or "",
            "source": v.source.value if v.source else "unknown",
        }
        for v in scan.vulnerabilities
    ]

    # Generate PDF
    try:
        from app.services.pdf_generator import pdf_generator
        pdf_bytes = pdf_generator.generate_report(scan_data, vuln_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(e)}",
        )

    filename = f"DAST_Report_{scan.target_domain}_{scan.created_at.strftime('%Y%m%d')}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
        },
    )


@router.get("")
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all completed scans that can have reports generated."""
    query = (
        select(Scan)
        .where(
            Scan.user_id == current_user.id,
            Scan.status == ScanStatus.COMPLETED,
        )
        .order_by(Scan.completed_at.desc())
    )
    result = await db.execute(query)
    scans = result.scalars().all()

    return [
        {
            "scan_id": str(s.id),
            "target_url": s.target_url,
            "target_domain": s.target_domain,
            "completed_at": s.completed_at.isoformat() if s.completed_at else None,
            "total_vulnerabilities": s.total_vulnerabilities,
            "critical_count": s.critical_count,
            "high_count": s.high_count,
            "medium_count": s.medium_count,
            "low_count": s.low_count,
            "info_count": s.info_count,
        }
        for s in scans
    ]
