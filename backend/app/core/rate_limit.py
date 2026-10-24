"""
EthioVuln — Centralized Rate Limiting
Provides shared slowapi Limiter instance connected to Redis or memory storage.
Identifies clients by Authenticated User ID or Client IP address.
"""

import logging
from starlette.requests import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config import get_settings
from app.core.security import verify_access_token

logger = logging.getLogger(__name__)
settings = get_settings()

# Standard Rate Limit Specifications
RATE_LIMIT_GENERAL = "100/minute"
RATE_LIMIT_AI_PROBE = "5/minute"
RATE_LIMIT_SCAN_INITIATE = "2/minute"


def get_client_identifier(request: Request) -> str:
    """
    Extract unique client identifier for rate limiting.
    Resolves client identity in order of precedence:
      1. Authenticated user ID from request.state.user_id or request.state.user.id
      2. Authenticated user ID decoded from Authorization Bearer JWT token
      3. Authenticated user ID decoded from access_token cookie
      4. Client IP address (checking X-Forwarded-For / X-Real-IP, falling back to remote socket)
    """
    try:
        # 1. Check request.state (set by auth dependencies or middleware)
        state_user_id = getattr(request.state, "user_id", None)
        if state_user_id:
            return f"user:{state_user_id}"

        state_user = getattr(request.state, "user", None)
        if state_user and getattr(state_user, "id", None):
            return f"user:{state_user.id}"

        # 2. Check Authorization Bearer token header
        auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
            if token:
                payload = verify_access_token(token)
                if payload and payload.get("sub"):
                    return f"user:{payload['sub']}"

        # 3. Check access_token cookie
        cookie_token = request.cookies.get("access_token")
        if cookie_token:
            payload = verify_access_token(cookie_token)
            if payload and payload.get("sub"):
                return f"user:{payload['sub']}"
    except Exception:
        # Gracefully proceed to IP resolution on token/state error
        pass

    # 4. Fall back to client IP address
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
        if client_ip:
            return f"ip:{client_ip}"

    real_ip = request.headers.get("X-Real-IP")
    if real_ip and real_ip.strip():
        return f"ip:{real_ip.strip()}"

    client_ip = get_remote_address(request)
    return f"ip:{client_ip or '127.0.0.1'}"


def get_limiter() -> Limiter:
    """Initialize shared Limiter with Redis backend or in-memory fallback."""
    default_limits = [RATE_LIMIT_GENERAL]
    try:
        import redis
        r = redis.from_url(settings.REDIS_URL, socket_timeout=1)
        r.ping()
        logger.info(f"Rate Limiter connected to Redis storage: {settings.REDIS_URL}")
        return Limiter(
            key_func=get_client_identifier,
            default_limits=default_limits,
            storage_uri=settings.REDIS_URL,
        )
    except Exception as e:
        logger.warning(f"Rate Limiter falling back to in-memory storage (Redis unavailable: {e})")
        return Limiter(
            key_func=get_client_identifier,
            default_limits=default_limits,
            storage_uri="memory://",
        )


limiter = get_limiter()
