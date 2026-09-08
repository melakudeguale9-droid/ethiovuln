"""
EthioVuln — FastAPI Application Entry Point
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.config import get_settings, validate_settings
from app.database import init_db

settings = get_settings()

# ─── Rate Limiter ─────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown hooks."""
    logger.info("=" * 60)
    logger.info("  EthioVuln — Starting Up")
    logger.info("=" * 60)

    # Validate configuration before anything else
    validate_settings(settings)
    logger.info("✓ Configuration validated")

    # Initialize database tables (dev mode)
    try:
        await init_db()
        logger.info("✓ Database tables initialized")
    except Exception as e:
        logger.error(f"✗ Database initialization failed: {e}")

    # Verify Redis connectivity
    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL)
        await r.ping()
        await r.close()
        logger.info("✓ Redis connection verified")
    except Exception as e:
        logger.warning(f"✗ Redis connection failed: {e}")

    logger.info(f"  Backend URL: {settings.BACKEND_URL}")
    logger.info(f"  Frontend URL: {settings.FRONTEND_URL}")
    logger.info("=" * 60)

    yield

    logger.info("EthioVuln — Shutting Down")


# ─── Create FastAPI Application ──────────────────────────────────────────────
app = FastAPI(
    title="EthioVuln API",
    description="EthioVuln — Automated Web Vulnerability Assessment Platform. REST API & WebSocket Server.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ─── Rate Limiting Middleware ────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# ─── CORS Middleware ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ───────────────────────────────────────────────────────
from app.api.auth import router as auth_router
from app.api.scans import router as scans_router
from app.api.reports import router as reports_router
from app.api.websocket import router as ws_router

app.include_router(auth_router)
app.include_router(scans_router)
app.include_router(reports_router)
app.include_router(ws_router)


# ─── Health Check ────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "EthioVuln API",
        "version": "1.0.0",
    }


@app.get("/", tags=["System"])
async def root():
    """Root endpoint — API information."""
    return {
        "name": "EthioVuln",
        "description": "EthioVuln — Automated Web Vulnerability Assessment Platform",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/api/health",
    }
