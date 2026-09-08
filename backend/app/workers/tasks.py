"""
EthioVuln — Celery Task Definitions
Master orchestration and sub-tasks for scan engines.
"""

import json
import uuid
import logging
from datetime import datetime, timezone
from celery import shared_task
import redis
from app.config import get_settings
from app.workers.celery_app import celery_app

settings = get_settings()
logger = logging.getLogger(__name__)


def get_redis_client():
    """Create a Redis client for Pub/Sub messaging."""
    return redis.from_url(settings.REDIS_URL, decode_responses=True)


def publish_update(scan_id: str, update_type: str, data: dict):
    """Publish a real-time update to the scan's WebSocket channel."""
    try:
        r = get_redis_client()
        message = json.dumps({"type": update_type, "data": data})
        r.publish(f"scan:{scan_id}", message)
        r.close()
    except Exception as e:
        logger.error(f"Failed to publish update for scan {scan_id}: {e}")


def publish_log(scan_id: str, message: str, level: str = "info"):
    """Publish a log message to the scan's WebSocket channel."""
    publish_update(scan_id, "log", {"message": message, "level": level, "timestamp": datetime.now(timezone.utc).isoformat()})


def publish_progress(scan_id: str, progress: int, stage: str = ""):
    """Publish a progress update to the scan's WebSocket channel."""
    publish_update(scan_id, "progress", {"progress": progress, "stage": stage})


def publish_vulnerability(scan_id: str, vuln: dict):
    """Publish a new vulnerability finding to the scan's WebSocket channel."""
    publish_update(scan_id, "vulnerability", vuln)


def update_scan_in_db(scan_id: str, **kwargs):
    """Update scan record in the database using a synchronous session."""
    from sqlalchemy import create_engine, update
    from sqlalchemy.orm import Session
    from app.models.scan import Scan

    try:
        sync_engine = create_engine(settings.DATABASE_URL_SYNC)
        with Session(sync_engine) as session:
            session.execute(
                update(Scan).where(Scan.id == uuid.UUID(scan_id)).values(**kwargs)
            )
            session.commit()
        sync_engine.dispose()
        logger.info(f"DB updated for scan {scan_id}: {kwargs}")
    except Exception as e:
        logger.error(f"FAILED to update DB for scan {scan_id}: {e}")


def save_vulnerability_to_db(scan_id: str, vuln_data: dict):
    """Save a vulnerability finding to the database."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session
    from app.models.vulnerability import Vulnerability, Severity, ScanSource

    severity_map = {
        "critical": Severity.CRITICAL,
        "high": Severity.HIGH,
        "medium": Severity.MEDIUM,
        "low": Severity.LOW,
        "info": Severity.INFO,
    }
    source_map = {
        "nuclei": ScanSource.NUCLEI,
        "zap": ScanSource.ZAP,
        "fuzzer": ScanSource.FUZZER,
    }

    try:
        sync_engine = create_engine(settings.DATABASE_URL_SYNC)
        with Session(sync_engine) as session:
            vuln = Vulnerability(
                scan_id=uuid.UUID(scan_id),
                title=vuln_data.get("title", "Unknown"),
                description=vuln_data.get("description", ""),
                severity=severity_map.get(vuln_data.get("severity", "info"), Severity.INFO),
                cvss_score=vuln_data.get("cvss_score", 0.0),
                cvss_vector=vuln_data.get("cvss_vector", ""),
                cwe_id=vuln_data.get("cwe_id"),
                cwe_name=vuln_data.get("cwe_name", ""),
                url=vuln_data.get("url", ""),
                evidence=vuln_data.get("evidence", ""),
                request_data=vuln_data.get("request_data", ""),
                response_data=vuln_data.get("response_data", ""),
                remediation=vuln_data.get("remediation", ""),
                reference_urls=vuln_data.get("reference_urls", ""),
                source=source_map.get(vuln_data.get("source", "nuclei"), ScanSource.NUCLEI),
                template_id=vuln_data.get("template_id", ""),
            )
            session.add(vuln)
            session.commit()
        sync_engine.dispose()
        logger.info(f"Saved vuln: {vuln_data.get('title')} [{vuln_data.get('severity')}]")
    except Exception as e:
        logger.error(f"FAILED to save vulnerability: {e} | data: {vuln_data.get('title')}")


@celery_app.task(name="app.workers.tasks.run_scan_task", bind=True, max_retries=2)
def run_scan_task(self, scan_id: str):
    """
    Master scan orchestration task.
    Coordinates Nuclei, ZAP, and Fuzzer sub-scans based on scan type.
    """
    logger.info(f"Starting scan task for scan_id={scan_id}")

    try:
        # Get scan details from DB
        from sqlalchemy import create_engine, select
        from sqlalchemy.orm import Session
        from app.models.scan import Scan, ScanStatus, ScanType

        sync_engine = create_engine(settings.DATABASE_URL_SYNC)
        with Session(sync_engine) as session:
            scan = session.execute(
                select(Scan).where(Scan.id == uuid.UUID(scan_id))
            ).scalar_one_or_none()

            if not scan:
                logger.error(f"Scan {scan_id} not found in database")
                return

            target_url = scan.target_url
            scan_type = scan.scan_type
        sync_engine.dispose()

        # Update status to running
        update_scan_in_db(
            scan_id,
            status=ScanStatus.RUNNING,
            progress=5,
            started_at=datetime.now(timezone.utc),
        )
        publish_update(scan_id, "status", {"status": "running"})
        publish_log(scan_id, f"Scan started for target: {target_url}")
        publish_progress(scan_id, 0, "Initializing scan engines")

        all_findings = []

        # ─── Phase 1: Nuclei Scan ─────────────────────────────
        if scan_type in (ScanType.FULL, ScanType.NUCLEI_ONLY, ScanType.NUCLEI_ZAP):
            publish_log(scan_id, "Starting Nuclei template-based scan...")
            publish_progress(scan_id, 5, "Running Nuclei scanner")

            try:
                from app.workers.nuclei_engine import nuclei_engine

                for finding in nuclei_engine.stream_scan(target_url):
                    all_findings.append(finding)
                    save_vulnerability_to_db(scan_id, finding)
                    publish_vulnerability(scan_id, finding)
                    publish_log(
                        scan_id,
                        f"[Nuclei] Found: {finding['title']} ({finding['severity'].upper()})",
                        "warning" if finding["severity"] in ("critical", "high") else "info",
                    )

                publish_log(scan_id, f"Nuclei scan complete: {len([f for f in all_findings if f['source'] == 'nuclei'])} findings")
            except Exception as e:
                publish_log(scan_id, f"Nuclei scan error: {str(e)}", "error")
                logger.error(f"Nuclei error for scan {scan_id}: {e}")

            publish_progress(scan_id, 35, "Nuclei scan complete")

        # ─── Phase 2: ZAP Spider + Active Scan ────────────────
        if scan_type in (ScanType.ZAP_ONLY, ScanType.NUCLEI_ZAP):
            import socket
            zap_available = False
            try:
                s = socket.create_connection(("localhost", 8080), timeout=2)
                s.close()
                zap_available = True
            except Exception:
                pass

            if not zap_available:
                publish_log(scan_id, "⚠ ZAP not available (Docker not running) — skipping ZAP phase", "warning")
                publish_progress(scan_id, 70, "ZAP skipped")
            else:
                publish_log(scan_id, "Starting OWASP ZAP spider and active scan...")
                publish_progress(scan_id, 40, "Running OWASP ZAP")
                try:
                    from app.workers.zap_engine import zap_engine

                    def zap_progress(pct, msg):
                        overall = 40 + int(pct * 0.3)
                        publish_progress(scan_id, overall, msg)
                        publish_log(scan_id, f"[ZAP] {msg}")

                    zap_findings = zap_engine.run_full_scan(target_url, zap_progress)
                    for finding in zap_findings:
                        all_findings.append(finding)
                        save_vulnerability_to_db(scan_id, finding)
                        publish_vulnerability(scan_id, finding)
                        publish_log(scan_id, f"[ZAP] Found: {finding['title']} ({finding['severity'].upper()})", "warning" if finding["severity"] in ("critical", "high") else "info")
                    zap_engine.cleanup()
                    publish_log(scan_id, f"ZAP scan complete: {len(zap_findings)} findings")
                except Exception as e:
                    publish_log(scan_id, f"ZAP scan error: {str(e)}", "error")
                    logger.error(f"ZAP error for scan {scan_id}: {e}")
                publish_progress(scan_id, 70, "ZAP scan complete")

        # ─── Phase 3: Custom Fuzzer ───────────────────────────
        if scan_type in (ScanType.FULL, ScanType.FUZZ_ONLY):
            publish_log(scan_id, "Starting directory and sensitive file fuzzing...")
            publish_progress(scan_id, 75, "Running directory fuzzer")

            try:
                from app.workers.fuzzer import directory_fuzzer

                def fuzz_progress(pct, msg):
                    overall = 75 + int(pct * 0.2)  # Fuzzer progress mapped to 75-95%
                    publish_progress(scan_id, overall, msg)
                    publish_log(scan_id, f"[Fuzzer] {msg}")
                    # Update DB every 5% so polling shows progress
                    if pct % 5 == 0:
                        update_scan_in_db(scan_id, progress=overall, status=ScanStatus.RUNNING)

                fuzz_findings = directory_fuzzer.run_scan(target_url, progress_callback=fuzz_progress)

                for finding in fuzz_findings:
                    all_findings.append(finding)
                    save_vulnerability_to_db(scan_id, finding)
                    publish_vulnerability(scan_id, finding)
                    publish_log(
                        scan_id,
                        f"[Fuzzer] Found: {finding['title']} ({finding['severity'].upper()})",
                        "warning" if finding["severity"] in ("critical", "high") else "info",
                    )

                publish_log(scan_id, f"Fuzzer complete: {len(fuzz_findings)} findings")
            except Exception as e:
                publish_log(scan_id, f"Fuzzer error: {str(e)}", "error")
                logger.error(f"Fuzzer error for scan {scan_id}: {e}")

            publish_progress(scan_id, 95, "Fuzzer complete")

        # ─── Finalize ────────────────────────────────────────
        # Count severity totals
        severity_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0}
        for f in all_findings:
            sev = f.get("severity", "info")
            if sev in severity_counts:
                severity_counts[sev] += 1

        update_scan_in_db(
            scan_id,
            status=ScanStatus.COMPLETED,
            progress=100,
            completed_at=datetime.now(timezone.utc),
            total_vulnerabilities=len(all_findings),
            critical_count=severity_counts["critical"],
            high_count=severity_counts["high"],
            medium_count=severity_counts["medium"],
            low_count=severity_counts["low"],
            info_count=severity_counts["info"],
        )

        publish_progress(scan_id, 100, "Scan complete")
        publish_log(
            scan_id,
            f"Scan completed! Found {len(all_findings)} total vulnerabilities: "
            f"{severity_counts['critical']} Critical, {severity_counts['high']} High, "
            f"{severity_counts['medium']} Medium, {severity_counts['low']} Low, "
            f"{severity_counts['info']} Info",
        )
        publish_update(scan_id, "status", {"status": "completed"})

        logger.info(f"Scan {scan_id} completed with {len(all_findings)} findings")

    except Exception as e:
        logger.error(f"Scan task {scan_id} failed: {e}")
        publish_log(scan_id, f"Scan failed: {str(e)}", "error")
        publish_update(scan_id, "status", {"status": "failed"})

        update_scan_in_db(
            scan_id,
            status="failed",
            error_message=str(e),
            completed_at=datetime.now(timezone.utc),
        )
