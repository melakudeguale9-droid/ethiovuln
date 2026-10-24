"""
EthioVuln — WebSocket Handler
Streams live scan logs, progress, and vulnerability findings via Redis Pub/Sub,
with log replay and persistent audit telemetry for completed scans.
"""

import json
import uuid
import asyncio
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select
import redis.asyncio as aioredis
from app.config import get_settings
from app.database import async_session_factory
from app.models.user import User
from app.models.scan import Scan

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(tags=["WebSocket"])


class ConnectionManager:
    """Manages active WebSocket connections."""

    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, scan_id: str, websocket: WebSocket):
        await websocket.accept()
        if scan_id not in self.active_connections:
            self.active_connections[scan_id] = []
        self.active_connections[scan_id].append(websocket)

    def disconnect(self, scan_id: str, websocket: WebSocket):
        if scan_id in self.active_connections:
            if websocket in self.active_connections[scan_id]:
                self.active_connections[scan_id].remove(websocket)
            if not self.active_connections[scan_id]:
                del self.active_connections[scan_id]

    async def send_to_scan(self, scan_id: str, message: dict):
        if scan_id in self.active_connections:
            dead_connections = []
            for ws in list(self.active_connections[scan_id]):
                try:
                    await ws.send_json(message)
                except Exception:
                    dead_connections.append(ws)
            for ws in dead_connections:
                if ws in self.active_connections[scan_id]:
                    self.active_connections[scan_id].remove(ws)


manager = ConnectionManager()


@router.websocket("/api/ws/scans/{scan_id}")
async def scan_websocket(
    websocket: WebSocket,
    scan_id: str,
):
    """
    WebSocket endpoint for real-time scan updates.
    Connect with: ws://host/api/ws/scans/{scan_id}?token=<jwt>
    Strictly verifies ownership: users can only connect to scans they own.
    """
    # Authenticate via query parameter
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001, reason="Missing authentication token")
        return

    from app.core.security import verify_access_token

    payload = verify_access_token(token)
    if not payload:
        await websocket.close(code=4001, reason="Invalid or expired token")
        return

    user_id_str = payload.get("sub")
    if not user_id_str:
        await websocket.close(code=4001, reason="Invalid token claims")
        return

    try:
        user_uuid = uuid.UUID(user_id_str)
        scan_uuid = uuid.UUID(scan_id)
    except (ValueError, TypeError):
        await websocket.close(code=4000, reason="Invalid identifier format")
        return

    # Verify authorization: User must own the target scan (or be an admin)
    scan_record = None
    try:
        async with async_session_factory() as session:
            user_result = await session.execute(select(User).where(User.id == user_uuid))
            current_user = user_result.scalar_one_or_none()
            if not current_user or not current_user.is_active:
                await websocket.close(code=4001, reason="User account is inactive or not found")
                return

            scan_result = await session.execute(select(Scan).where(Scan.id == scan_uuid))
            scan_record = scan_result.scalar_one_or_none()
            if not scan_record:
                await websocket.close(code=4004, reason="Scan not found")
                return

            if scan_record.user_id != current_user.id and not current_user.is_admin:
                logger.warning(
                    f"Unauthorized WebSocket access: user {current_user.id} ({current_user.email}) "
                    f"attempted to stream scan {scan_id} belonging to {scan_record.user_id}"
                )
                await websocket.close(code=4003, reason="Forbidden: Access to target scan denied")
                return
    except Exception as auth_err:
        logger.error(f"Error during WebSocket authorization check: {auth_err}")
        await websocket.close(code=4000, reason="Authorization verification failed")
        return

    await manager.connect(scan_id, websocket)

    redis_client = None
    pubsub = None
    channel = f"scan:{scan_id}"

    try:
        # Send initial connection confirmation
        await websocket.send_json({
            "type": "connected",
            "data": {"scan_id": scan_id, "message": "Connected to scan stream"},
        })

        replayed_logs = False

        # Attempt to connect to Redis
        try:
            redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            pubsub = redis_client.pubsub()
            await pubsub.subscribe(channel)

            # Replay any stored logs for this scan from Redis
            stored_logs = await redis_client.lrange(f"scan:{scan_id}:logs", 0, -1)
            if stored_logs:
                replayed_logs = True
                for log_raw in stored_logs:
                    try:
                        log_data = json.loads(log_raw)
                        await websocket.send_json({"type": "log", "data": log_data})
                    except Exception:
                        pass

            # Replay any stored live vulnerabilities for this scan from Redis
            replayed_vulns = False
            stored_vulns = await redis_client.lrange(f"scan:{scan_id}:vulnerabilities", 0, -1)
            if stored_vulns:
                replayed_vulns = True
                for vuln_raw in stored_vulns:
                    try:
                        vuln_data = json.loads(vuln_raw)
                        await websocket.send_json({"type": "vulnerability", "data": vuln_data})
                    except Exception:
                        pass
        except Exception as redis_err:
            logger.warning(f"Redis unavailable for WebSocket scan {scan_id}: {redis_err}")
            pubsub = None
            redis_client = None
            replayed_vulns = False

        # Stream existing vulnerabilities from DB if none were replayed from Redis
        if not replayed_vulns and scan_record:
            try:
                from app.models.vulnerability import Vulnerability as VulnModel
                async with async_session_factory() as session:
                    vuln_res = await session.execute(
                        select(VulnModel).where(VulnModel.scan_id == scan_uuid).order_by(VulnModel.created_at.asc())
                    )
                    db_vulns = vuln_res.scalars().all()
                    for v in db_vulns:
                        await websocket.send_json({
                            "type": "vulnerability",
                            "data": {
                                "id": str(v.id),
                                "scan_id": str(v.scan_id),
                                "title": v.title,
                                "description": v.description or "",
                                "severity": v.severity.value if hasattr(v.severity, "value") else str(v.severity),
                                "cvss_score": v.cvss_score or 0.0,
                                "cvss_vector": v.cvss_vector or "",
                                "cwe_id": v.cwe_id,
                                "cwe_name": v.cwe_name or "",
                                "url": v.url or "",
                                "target_url": v.url or "",
                                "evidence": v.evidence or "",
                                "request_data": v.request_data or "",
                                "response_data": v.response_data or "",
                                "remediation": v.remediation or "",
                                "reference_urls": v.reference_urls or "",
                                "source": v.source.value if hasattr(v.source, "value") else str(v.source),
                                "template_id": v.template_id or "",
                                "created_at": v.created_at.isoformat() if v.created_at else None,
                            },
                        })
            except Exception as db_v_err:
                logger.error(f"Error streaming DB vulnerabilities: {db_v_err}")

        # If no logs were replayed from Redis, use Scan from DB to synthesize historical logs
        if not replayed_logs and scan_record:
            try:
                t_iso = (scan_record.started_at or scan_record.created_at or datetime.now(timezone.utc)).isoformat()
                await websocket.send_json({
                    "type": "log",
                    "data": {
                        "message": f"Target scope initialized: {scan_record.target_url}",
                        "level": "info",
                        "timestamp": t_iso,
                    },
                })
                await websocket.send_json({
                    "type": "log",
                    "data": {
                        "message": f"Engine execution mode: {scan_record.scan_type.value.upper()}",
                        "level": "info",
                        "timestamp": t_iso,
                    },
                })
                if scan_record.status.value.lower() == "completed":
                    comp_iso = (scan_record.completed_at or datetime.now(timezone.utc)).isoformat()
                    await websocket.send_json({
                        "type": "log",
                        "data": {
                            "message": f"Security assessment completed. Total findings: {scan_record.total_vulnerabilities} "
                                       f"({scan_record.critical_count} Critical, {scan_record.high_count} High, "
                                       f"{scan_record.medium_count} Medium, {scan_record.low_count} Low)",
                            "level": "info",
                            "timestamp": comp_iso,
                        },
                    })
                    await websocket.send_json({
                        "type": "status",
                        "data": {
                            "status": "completed",
                            "progress": 100,
                            "stage": "Assessment Completed",
                        },
                    })
                elif scan_record.status.value.lower() in ("running", "verifying", "pending"):
                    await websocket.send_json({
                        "type": "log",
                        "data": {
                            "message": f"Assessment in progress ({scan_record.progress}% complete)...",
                            "level": "info",
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        },
                    })
                    await websocket.send_json({
                        "type": "progress",
                        "data": {
                            "progress": scan_record.progress,
                            "stage": "Running engine pipeline",
                        },
                    })
            except Exception as db_err:
                logger.error(f"Error rendering scan telemetry: {db_err}")

        # Concurrently listen to Redis (if available), handle pings, and receive client messages
        async def redis_listener():
            if not pubsub:
                while True:
                    await asyncio.sleep(5)
            while True:
                try:
                    message = await pubsub.get_message(
                        ignore_subscribe_messages=True, timeout=1.0
                    )
                    if message and message["type"] == "message":
                        try:
                            data = json.loads(message["data"])
                            await websocket.send_json(data)
                        except json.JSONDecodeError:
                            await websocket.send_json({
                                "type": "log",
                                "data": {"message": message["data"], "level": "info"},
                            })
                    await asyncio.sleep(0.05)
                except asyncio.CancelledError:
                    break
                except Exception:
                    await asyncio.sleep(1.0)

        async def ping_handler():
            while True:
                try:
                    await asyncio.sleep(25)
                    await websocket.send_json({"type": "ping"})
                except asyncio.CancelledError:
                    break
                except Exception:
                    break

        async def client_receiver():
            while True:
                try:
                    data = await websocket.receive_text()
                    msg = json.loads(data)
                    if msg.get("type") == "pong":
                        pass
                except asyncio.CancelledError:
                    break
                except WebSocketDisconnect:
                    break
                except Exception:
                    break

        tasks = [
            asyncio.create_task(redis_listener()),
            asyncio.create_task(ping_handler()),
            asyncio.create_task(client_receiver()),
        ]

        done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
        for task in pending:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"WebSocket session error: {e}")
    finally:
        manager.disconnect(scan_id, websocket)
        if pubsub and redis_client:
            try:
                await pubsub.unsubscribe(channel)
                await pubsub.close()
                await redis_client.close()
            except Exception:
                pass
