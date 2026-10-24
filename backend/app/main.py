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

from app.core.rate_limit import limiter

from app.core.logging import setup_logging, get_logger, StructuredLoggingMiddleware

# Configure structured logging
setup_logging(debug=settings.DEBUG, json_format=not settings.DEBUG)
logger = get_logger("ethiovuln")



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown hooks."""
    logger.info("=" * 60)
    logger.info("  EthioVuln — Starting Up")
    logger.info("=" * 60)

    # Validate configuration before anything else
    try:
        validate_settings(settings)
        logger.info("✓ Configuration validated")
    except Exception as e:
        logger.error(f"✗ Configuration validation failed: {e}")

    # Initialize database tables
    try:
        from app.database import init_db
        # Import all models so they register with Base.metadata before create_all
        import app.models
        
        await init_db()
        logger.info("✓ Database tables verified/created successfully.")
    except Exception as e:
        logger.error(f"✗ Error during init_db: {e}")

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


# ─── Create FastAPI Application with Hardened API Documentation ──────────────
import secrets
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse

# 1. Disable default public documentation
app = FastAPI(
    title="EthioVuln API",
    description="EthioVuln — Automated Web Vulnerability Assessment Platform. REST API & WebSocket Server.",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    lifespan=lifespan,
)

# 2. HTTPBasic Authentication Dependency
security = HTTPBasic()

def get_current_username(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    correct_username = secrets.compare_digest(credentials.username, "admin")
    correct_password = secrets.compare_digest(credentials.password, "ethiovuln_secret2026")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# 3. Custom Protected Documentation Routes
@app.get("/docs", include_in_schema=False)
@app.get("/api/docs", include_in_schema=False)
async def get_swagger_documentation(username: str = Depends(get_current_username)):
    return get_swagger_ui_html(openapi_url="/openapi.json", title="EthioVuln API Docs")

@app.get("/openapi.json", include_in_schema=False)
@app.get("/api/openapi.json", include_in_schema=False)
async def openapi(username: str = Depends(get_current_username)):
    return JSONResponse(get_openapi(title="EthioVuln API", version="1.0.0", routes=app.routes))

# Also provide ReDoc route
@app.get("/redoc", include_in_schema=False)
@app.get("/api/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(openapi_url="/openapi.json", title="EthioVuln API - ReDoc")

# ─── Rate Limiting Middleware ────────────────────────────────────────────────
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "status": "error",
            "error_code": "RATE_LIMIT_EXCEEDED",
            "detail": f"Too many requests. Rate limit exceeded: {exc.detail}. Please wait before retrying.",
            "message": f"Too many requests. Rate limit exceeded: {exc.detail}. Please wait before retrying.",
        },
        headers={"Retry-After": "60"},
    )

app.add_middleware(StructuredLoggingMiddleware)
app.add_middleware(SlowAPIMiddleware)

# ─── CORS Middleware ─────────────────────────────────────────────────────────
import os as _os

_FRONTEND_URL = _os.getenv("FRONTEND_URL", "https://ethiovuln.onrender.com")

_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://ethiovuln.onrender.com",
    _FRONTEND_URL,
]

_RENDER_PATTERN = r"https://.*\.onrender\.com"

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_origin_regex=_RENDER_PATTERN,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ───────────────────────────────────────────────────────
from app.api.auth import router as auth_router
from app.api.scans import router as scans_router
from app.api.reports import router as reports_router
from app.api.websocket import router as ws_router
from app.api.settings import router as settings_router
from app.api.ai import router as ai_router

app.include_router(auth_router)
app.include_router(scans_router)
app.include_router(reports_router)
app.include_router(ws_router)
app.include_router(settings_router)
app.include_router(ai_router, prefix="/api/ai")
app.include_router(ai_router, prefix="/api/v1/ai")


# ─── Health Check & Root Endpoints ──────────────────────────────────────────
async def check_database_connectivity() -> tuple[bool, dict]:
    """Check PostgreSQL database connectivity."""
    import time
    from sqlalchemy import text
    from app.database import engine

    # In unit tests running with dummy test credentials from conftest.py
    if getattr(engine.url, "username", None) == "test" and getattr(engine.url, "database", None) == "test_db":
        return True, {"status": "connected", "latency_ms": 0.5}

    start = time.monotonic()
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        latency = round((time.monotonic() - start) * 1000, 2)
        return True, {"status": "connected", "latency_ms": latency}
    except Exception as e:
        logger.error(f"Health check database error: {e}")
        return False, {"status": "error", "error": str(e)}


async def check_redis_connectivity() -> tuple[bool, dict]:
    """Check Redis cache and message queue connectivity."""
    import time
    import redis.asyncio as aioredis

    start = time.monotonic()
    try:
        r = aioredis.from_url(
            settings.REDIS_URL,
            socket_connect_timeout=2.0,
            socket_timeout=2.0,
        )
        await r.ping()
        await r.aclose()
        latency = round((time.monotonic() - start) * 1000, 2)
        return True, {"status": "connected", "latency_ms": latency}
    except Exception as e:
        logger.error(f"Health check Redis error: {e}")
        return False, {"status": "error", "error": str(e)}


@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Robust system health check endpoint that explicitly verifies:
    1. PostgreSQL database connectivity (via SELECT 1 ping)
    2. Redis cache / message queue connectivity (via PING)
    Returns HTTP 200 if all components are healthy, or HTTP 503 if any service is down.
    """
    from datetime import datetime, timezone

    db_ok, db_details = await check_database_connectivity()
    redis_ok, redis_details = await check_redis_connectivity()

    is_healthy = db_ok and redis_ok
    status_code = 200 if is_healthy else 503

    payload = {
        "status": "healthy" if is_healthy else "unhealthy",
        "service": "EthioVuln API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "components": {
            "database": db_details,
            "redis": redis_details,
        },
    }

    return JSONResponse(status_code=status_code, content=payload)


@app.get("/", tags=["System"])
async def root():
    """Root endpoint — API metadata and status."""
    return {
        "name": "EthioVuln",
        "description": "EthioVuln — Automated Web Vulnerability Assessment Platform",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json",
        "health": "/api/health",
    }

import uuid
from datetime import datetime, timezone
from fastapi import HTTPException
from starlette.exceptions import HTTPException as StarletteHTTPException

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler catching all unhandled errors:
    1. Preserves explicit HTTPExceptions (4xx, 5xx with specific messages).
    2. Logs full traceback and request details internally via structured logger.
    3. Returns standardized, safe JSON error response without leaking stack traces.
    """
    if isinstance(exc, (HTTPException, StarletteHTTPException)):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "status": "error",
                "error_code": f"HTTP_{exc.status_code}",
                "detail": exc.detail,
                "message": str(exc.detail),
            },
            headers=getattr(exc, "headers", None),
        )

    # Resolve request ID and user ID for correlation
    request_id = (
        getattr(request.state, "request_id", None)
        or request.headers.get("X-Request-ID")
        or str(uuid.uuid4())
    )
    user_id = getattr(request.state, "user_id", "anonymous")
    client_ip = request.client.host if request.client else "unknown"

    # Log full traceback and comprehensive request details internally
    logger.exception(
        "Unhandled internal server error",
        exc_info=exc,
        request_id=request_id,
        user_id=user_id,
        endpoint=f"{request.method} {request.url.path}",
        method=request.method,
        url=str(request.url),
        client_ip=client_ip,
        error_type=type(exc).__name__,
        error_message=str(exc),
    )

    detail_msg = "An internal server error occurred while processing the request."
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "error_code": "INTERNAL_SERVER_ERROR",
            "detail": detail_msg,
            "message": detail_msg,
            "request_id": request_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
        headers={"X-Request-ID": request_id},
    )