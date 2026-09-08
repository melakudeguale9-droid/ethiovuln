"""
EthioVuln — Application Configuration
Uses pydantic-settings to load from .env file.
"""

import os
import sys
import logging
from pydantic_settings import BaseSettings
from functools import lru_cache

logger = logging.getLogger(__name__)

# Resolve .env path relative to this file so it works from any working directory
_ENV_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")

# ─── Unsafe default values that must be overridden in production ──────────────
_UNSAFE_SECRET_KEYS = {
    "your-super-secret-key-change-in-production",
    "your-super-secret-key",
    "changeme",
    "secret",
    "password",
}


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://dast:dast_secret@localhost:5432/dast_db"
    DATABASE_URL_SYNC: str = "postgresql://dast:dast_secret@localhost:5432/dast_db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # OWASP ZAP
    ZAP_API_URL: str = "http://localhost:8080"
    ZAP_API_KEY: str = "changeme"

    # Nuclei
    NUCLEI_PATH: str = "/usr/bin/nuclei"

    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Application
    APP_NAME: str = "EthioVuln"
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:3000"
    DEBUG: bool = True

    # Fuzzer
    FUZZER_THREADS: int = 30
    FUZZER_TIMEOUT: int = 5
    FUZZER_RATE_LIMIT: float = 0.0

    model_config = {
        "env_file": _ENV_FILE,
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


def validate_settings(settings: "Settings") -> None:
    """
    Validate critical settings at startup.
    Warns in DEBUG mode, exits in production.
    """
    errors = []
    warnings = []

    # ── Check SECRET_KEY ────────────────────────────────────────────────────
    if settings.SECRET_KEY in _UNSAFE_SECRET_KEYS:
        msg = "SECRET_KEY is set to an insecure default value. Change it before deploying."
        if settings.DEBUG:
            warnings.append(msg)
        else:
            errors.append(msg)

    if len(settings.SECRET_KEY) < 32:
        msg = f"SECRET_KEY is too short ({len(settings.SECRET_KEY)} chars). Use at least 32 characters."
        if settings.DEBUG:
            warnings.append(msg)
        else:
            errors.append(msg)

    # ── Check DATABASE_URL ───────────────────────────────────────────────────
    if not settings.DATABASE_URL.startswith("postgresql"):
        errors.append(f"DATABASE_URL does not look like a PostgreSQL URL: {settings.DATABASE_URL[:40]}")

    # ── Check REDIS_URL ──────────────────────────────────────────────────────
    if not settings.REDIS_URL.startswith("redis://"):
        errors.append(f"REDIS_URL does not look like a Redis URL: {settings.REDIS_URL[:40]}")

    # ── Check NUCLEI_PATH ────────────────────────────────────────────────────
    if not os.path.isfile(settings.NUCLEI_PATH):
        warnings.append(
            f"Nuclei binary not found at '{settings.NUCLEI_PATH}'. "
            "Nuclei-based scans will fail. Install with: sudo apt install nuclei"
        )

    # ── Check .env file exists ───────────────────────────────────────────────
    if not os.path.isfile(_ENV_FILE):
        warnings.append(
            f".env file not found at '{_ENV_FILE}'. "
            "Using default values — copy .env.example to backend/.env and configure it."
        )

    # ── Log warnings ────────────────────────────────────────────────────────
    for w in warnings:
        logger.warning(f"⚠  CONFIG WARNING: {w}")

    # ── Hard fail on errors in production ───────────────────────────────────
    if errors:
        for e in errors:
            logger.critical(f"✗  CONFIG ERROR: {e}")
        logger.critical("Startup aborted due to configuration errors. Fix the issues above and restart.")
        sys.exit(1)


@lru_cache()
def get_settings() -> Settings:
    return Settings()
