# ─── EthioVuln Backend Dockerfile ───────────────────────────────────────────
FROM python:3.11-slim

# Install system dependencies (curl for healthcheck, libpq for asyncpg)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies first (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose API port
EXPOSE 8000

# Run migrations, seed admin (idempotent — skips if user exists), then start API
CMD ["sh", "-c", "alembic upgrade head && python -m app.seed_admin; uvicorn app.main:app --host 0.0.0.0 --port 8000"]
