"""
Alembic environment configuration.
"""

import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Import Base and all models so Alembic can detect them
from app.database import Base
from app.models import User, Scan, Vulnerability  # noqa
from app.models.settings import UserPreferences, ApiKey, LoginHistory  # noqa

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def _get_url() -> str:
    """
    Resolve the database URL with this priority:
    1. DATABASE_URL_SYNC env var (explicit sync URL)
    2. DATABASE_URL env var — strip async driver prefix if present
    3. alembic.ini sqlalchemy.url (local fallback)

    Render injects postgres:// — convert to postgresql:// for SQLAlchemy.
    """
    url = (
        os.getenv("DATABASE_URL_SYNC")
        or os.getenv("DATABASE_URL")
        or config.get_main_option("sqlalchemy.url")
    )
    # Normalize driver prefixes for sync usage
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    if url.startswith("postgresql+asyncpg://"):
        url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
    return url


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=_get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    cfg = config.get_section(config.config_ini_section, {})
    cfg["sqlalchemy.url"] = _get_url()
    connectable = engine_from_config(
        cfg,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
