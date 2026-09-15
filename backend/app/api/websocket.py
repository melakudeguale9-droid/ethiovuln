"""
EthioVuln — WebSocket Handler
Streams live scan logs, progress, and vulnerability findings via Redis Pub/Sub.
"""

import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as aioredis
from app.config import get_settings
from app.database import get_db
from app.api.deps import get_ws_user

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
            self.active_connections[scan_id].remove(websocket)
            if not self.active_connections[scan_id]:
                del self.active_connections[scan_id]

    async def send_to_scan(self, scan_id: str, message: dict):
        if scan_id in self.active_connections:
            dead_connections = []
            for ws in self.active_connections[scan_id]:
                try:
                    await ws.send_json(message)
                except Exception:
                    dead_connections.append(ws)
            for ws in dead_connections:
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

    Messages sent to client:
    - {"type": "log", "data": {"message": "...", "level": "info|warning|error"}}
    - {"type": "progress", "data": {"progress": 0-100, "stage": "..."}}
    - {"type": "vulnerability", "data": {vulnerability_object}}
    - {"type": "status", "data": {"status": "running|completed|failed"}}
    - {"type": "ping"}
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

    await manager.connect(scan_id, websocket)

    # Create Redis subscriber for this scan
    redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    pubsub = redis_client.pubsub()
    channel = f"scan:{scan_id}"

    try:
        await pubsub.subscribe(channel)

        # Send initial connection confirmation
        await websocket.send_json({
            "type": "connected",
            "data": {"scan_id": scan_id, "message": "Connected to scan stream"},
        })

        # Run two concurrent tasks: listen to Redis and handle WebSocket pings
        async def redis_listener():
            """Listen for messages from Redis Pub/Sub and forward to WebSocket."""
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
                    await asyncio.sleep(0.1)
                except asyncio.CancelledError:
                    break
                except Exception:
                    break

        async def ping_handler():
            """Send periodic pings to keep the connection alive."""
            while True:
                try:
                    await asyncio.sleep(30)
                    await websocket.send_json({"type": "ping"})
                except asyncio.CancelledError:
                    break
                except Exception:
                    break

        async def client_receiver():
            """Receive and handle messages from the client (e.g., pong responses)."""
            while True:
                try:
                    data = await websocket.receive_text()
                    msg = json.loads(data)
                    if msg.get("type") == "pong":
                        pass  # Connection alive
                except asyncio.CancelledError:
                    break
                except WebSocketDisconnect:
                    break
                except Exception:
                    break

        # Run all handlers concurrently
        tasks = [
            asyncio.create_task(redis_listener()),
            asyncio.create_task(ping_handler()),
            asyncio.create_task(client_receiver()),
        ]

        # Wait until any task finishes (usually client_receiver on disconnect)
        done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
        for task in pending:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        manager.disconnect(scan_id, websocket)
        await pubsub.unsubscribe(channel)
        await pubsub.close()
        await redis_client.close()
