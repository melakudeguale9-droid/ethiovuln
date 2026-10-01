# ─── EthioVuln Backend Dockerfile ───────────────────────────────────────────
FROM python:3.11-slim

# Install system dependencies (curl for healthcheck, libpq for asyncpg)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq-dev \
    gcc \
    unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PYTHONPATH=/app

# Install Nuclei
RUN curl -L -o nuclei.zip https://github.com/projectdiscovery/nuclei/releases/download/v3.2.0/nuclei_3.2.0_linux_amd64.zip \
    && unzip nuclei.zip -d /usr/bin/ \
    && rm nuclei.zip

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

# Start API server using the dynamically assigned port from Render
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips='*'"]
