#!/bin/bash
set -e
echo "--- Starting Uvicorn Server ---"
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
