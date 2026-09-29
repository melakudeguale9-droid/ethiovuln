#!/bin/bash
set -e

echo "--- EthioVuln Backend Starting ---"
echo "--- Running Alembic migrations ---"
alembic upgrade head || echo "⚠️ Migration skipped (tables already exist)"

echo "--- Starting Uvicorn Server ---"
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
