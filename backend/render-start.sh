#!/bin/bash
# ─── EthioVuln Backend — Render Production Startup ──────────────────────────
set -e

echo "=== EthioVuln Backend Starting ==="

# Fix DATABASE_URL for SQLAlchemy async driver
# Render provides postgres:// but asyncpg needs postgresql+asyncpg://
if [[ "$DATABASE_URL" == postgres://* ]]; then
  export DATABASE_URL="${DATABASE_URL/postgres:\/\//postgresql+asyncpg://}"
  echo "✓ Converted DATABASE_URL to asyncpg format"
fi

# Fix DATABASE_URL_SYNC for sync driver (Celery / Alembic)
if [[ "$DATABASE_URL_SYNC" == postgres://* ]]; then
  export DATABASE_URL_SYNC="${DATABASE_URL_SYNC/postgres:\/\//postgresql://}"
  echo "✓ Converted DATABASE_URL_SYNC to psycopg2 format"
fi

# Also fix if only DATABASE_URL is provided (Render sets it automatically)
if [[ -z "$DATABASE_URL_SYNC" ]]; then
  # Derive sync URL from async URL
  export DATABASE_URL_SYNC="${DATABASE_URL/postgresql+asyncpg:\/\//postgresql://}"
  echo "✓ Derived DATABASE_URL_SYNC from DATABASE_URL"
fi

# Run database migrations
echo "=== Running Alembic migrations ==="
alembic upgrade head
echo "✓ Migrations complete"

# Seed admin user (idempotent — skips if already exists)
echo "=== Seeding admin user ==="
python -m app.seed_admin || echo "Admin user already exists or seed skipped"

echo "=== Starting Uvicorn ==="
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
