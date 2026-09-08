"""
EthioVuln — Celery Application Configuration
"""

from celery import Celery
from app.config import get_settings

settings = get_settings()

celery_app = Celery(
    "dast_platform",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.workers.tasks"],
)

celery_app.conf.update(
    # Serialization
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",

    # Timezone
    timezone="UTC",
    enable_utc=True,

    # Task behavior — keep it simple for Windows solo pool
    task_track_started=True,
    task_acks_late=False,          # Must be False on Windows solo pool
    worker_prefetch_multiplier=1,

    # Result expiry (24 hours)
    result_expires=86400,

    # Single queue — no routing complexity
    task_default_queue="default",
    task_routes={},                # No routing — everything goes to default
)
