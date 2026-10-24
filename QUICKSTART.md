# 🚀 EthioVuln — Quick Start & Installation Guide

EthioVuln is an enterprise-grade Dynamic Application Security Testing (DAST) platform designed to identify security vulnerabilities in web applications. Built with **Next.js 15 (React 19)** and **FastAPI**, it features live scanning telemetry over WebSockets, asynchronous Celery task pipelines, and automated executive PDF reporting.

---

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:
* **Docker & Docker Compose** (For PostgreSQL, Redis, OWASP ZAP, or full containerized deployment)
* **Node.js** (v20 or higher) & **npm**
* **Python** (3.11 or higher — compatible with Python 3.11 – 3.14)
* **Git**

---

## ⚙️ Environment Setup

You need to configure the environment variables for both the backend and frontend.

### 1. Backend `.env` (inside `backend/.env`)

Create or copy `backend/.env` from `.env.example`:

```env
# ─── Environment & Hardening ───
ENVIRONMENT=development
DEBUG=true
ENABLE_API_DOCS=true

# ─── Database & Message Broker ───
# Use port 5433 if running PostgreSQL via Docker (mapped 5433:5432), or 5432 for native PostgreSQL
DATABASE_URL=postgresql+asyncpg://dast:dast_secret@localhost:5433/dast_db
DATABASE_URL_SYNC=postgresql://dast:dast_secret@localhost:5433/dast_db
REDIS_URL=redis://localhost:6379/0

# ─── Authentication & Security ───
# Generate a random 32+ character key: openssl rand -hex 32
SECRET_KEY=3f8a2e1d9c7b4f6a0e5d3c2b1a9f8e7d6c5b4a3e2d1f0e9d8c7b6a5f4e3d2c1
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7

# ─── URLs ───
APP_NAME=EthioVuln
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# ─── Scanning Engines ───
ZAP_API_URL=http://localhost:8080
ZAP_API_KEY=changeme
NUCLEI_PATH=/usr/bin/nuclei

# ─── AI Intelligence (Optional) ───
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash-lite
```

### 2. Frontend `.env.local` (inside `frontend/.env.local`)

```env
# URL for client-side API requests (proxy or direct)
NEXT_PUBLIC_API_URL=http://localhost:8000

# WebSocket URL for real-time live scan telemetry
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## 🏃 Running the Application

### Option A: Local Development Setup (`npm run dev`)

This option runs PostgreSQL & Redis via Docker while running FastAPI and Next.js locally with hot-reloading.

#### 1. Start Database & Cache Containers
```bash
# Starts PostgreSQL (port 5433) and Redis (port 6379)
docker-compose up -d postgres redis
```

#### 2. Start Backend & Database Migrations
```bash
cd backend

# Create & activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### 3. Start Celery Worker (In a separate terminal)
```bash
cd backend
source venv/bin/activate
celery -A app.workers.celery_app worker --loglevel=info --pool=solo
```

#### 4. Start Next.js Frontend
```bash
cd frontend

# Install dependencies (use --legacy-peer-deps for React 19)
npm install --legacy-peer-deps

# Launch Next.js development server
npm run dev
```

The Web Dashboard is now accessible at **[`http://localhost:3000`](http://localhost:3000)**!

---

### Option B: Docker Compose Full Stack (Single Command)

To run the complete platform inside Docker containers (PostgreSQL, Redis, OWASP ZAP, FastAPI Backend, Celery Worker, and Next.js Frontend):

```bash
# 1. Ensure .env is copied in root directory
cp .env.example .env

# 2. Build and launch all 6 services
docker-compose up --build -d

# 3. Check running status
docker-compose ps
```

To view live application logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

To stop all services:
```bash
docker-compose down
```

---

## 🌐 Service Access URLs

| Interface | URL | Description |
|---|---|---|
| **Next.js Dashboard** | [`http://localhost:3000`](http://localhost:3000) | Web Dashboard, Live Telemetry & Reports |
| **FastAPI Backend** | [`http://localhost:8000`](http://localhost:8000) | REST API & WebSocket Server |
| **Swagger UI** | [`http://localhost:8000/api/docs`](http://localhost:8000/api/docs) | Interactive API Explorer (Hardened) |
| **ReDoc UI** | [`http://localhost:8000/api/redoc`](http://localhost:8000/api/redoc) | Technical Reference Documentation |
| **OpenAPI Schema** | [`http://localhost:8000/api/openapi.json`](http://localhost:8000/api/openapi.json) | OpenAPI 3.0 Machine Specification |
| **Health Check** | [`http://localhost:8000/api/health`](http://localhost:8000/api/health) | Service & Database Liveness Probe |

> 🔒 **Security Notice:** In production deployments, setting `ENABLE_API_DOCS=false` disables `/api/docs`, `/api/redoc`, and `/api/openapi.json` to prevent endpoint reconnaissance.

---

## 🧪 Testing Commands

### Backend Tests (Pytest)
```bash
cd backend
source venv/bin/activate
pytest -v
```
*Pass Rate: 178 / 178 tests passed.*

### Frontend Unit Tests (React Testing Library & Vitest)
```bash
cd frontend
npm run test
```
*Pass Rate: 13 / 13 tests passed.*

### Frontend End-to-End Tests (Playwright)
```bash
cd frontend
npm run test:e2e
```
*Pass Rate: 4 / 4 passed.*
