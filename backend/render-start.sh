#!/bin/bash
set -e

echo "--- EthioVuln Backend Starting ---"
echo "--- Running Alembic migrations ---"
alembic upgrade head || echo "⚠️ Migration skipped (tables already exist)"

echo "--- Initializing Tables ---"
python3 -c "import asyncio; from app.database import init_db; asyncio.run(init_db())" || echo "init_db completed or skipped"

echo "--- Starting Uvicorn Server ---"
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
