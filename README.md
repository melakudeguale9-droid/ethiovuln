# 🛡️ EthioVuln — Automated Web Vulnerability Assessment Platform

> **Discover. Analyze. Secure.**  
> Enterprise-grade Dynamic Application Security Testing (DAST) engineered for automated web reconnaissance, vulnerability discovery, CVSS v3.1 scoring, and executive reporting.

[![CI Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Backend Tests](https://img.shields.io/badge/pytest-131%2F131%20passed-10B981.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-16.2.3-00E5FF.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-009688.svg)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

---

## Table of Contents

1. [Overview](#1-overview)
2. [Features & Capabilities](#2-features--capabilities)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Project Directory Structure](#5-project-directory-structure)
6. [Authentication & RBAC](#6-authentication--rbac)
7. [Dual-Engine Scanning Pipeline](#7-dual-engine-scanning-pipeline)
8. [SSRF Protection Gate](#8-ssrf-protection-gate)
9. [REST API & Interactive Documentation](#9-rest-api--interactive-documentation)
10. [Real-Time WebSocket Protocol](#10-real-time-websocket-protocol)
11. [Executive PDF Reports](#11-executive-pdf-reports)
12. [API Key Management](#12-api-key-management)
13. [Local Development Setup](#13-local-development-setup)
14. [Docker Setup](#14-docker-setup)
15. [Environment Variables Reference](#15-environment-variables-reference)
16. [Testing Suite](#16-testing-suite)
17. [Production Build](#17-production-build)
18. [Render Deployment Guide](#18-render-deployment-guide)
19. [Render Free Tier vs. Local Docker Limitations](#19-render-free-tier-vs-local-docker-limitations)
20. [Security Engineering & Hardening](#20-security-engineering--hardening)
21. [Responsible Use & Ethics Policy](#21-responsible-use--ethics-policy)
22. [Screenshots & Interface Previews](#22-screenshots--interface-previews)
23. [Author & Social Links](#23-author--social-links)
24. [License](#24-license)

---

## 1. Overview

**EthioVuln** is an automated Dynamic Application Security Testing (DAST) and vulnerability management platform designed for security researchers, DevSecOps engineers, and penetration testers. It unifies high-speed template matching (Nuclei), active application crawling and injection probing (OWASP ZAP), and sensitive directory discovery into a single glassmorphic dashboard.

Every assessment runs through a multi-tier SSRF validation gate, streams real-time console telemetry over WebSockets, calculates CVSS v3.1 severity scores mapped to MITRE CWE definitions, and compiles executive PDF audit summaries with actionable remediation advice.

---

## 2. Features & Capabilities

- **Multi-Engine Orchestration:** Seamlessly coordinates ProjectDiscovery Nuclei, OWASP ZAP active spidering, and custom high-concurrency directory fuzzers.
- **SSRF Safety Gateway:** Multi-tier target validation blocking private RFC 1918 CIDRs, AWS/GCP/Azure cloud metadata (`169.254.169.254`), and local loopback interfaces.
- **Real-Time Telemetry:** Live WebSocket log streaming, progress updates (0–100%), and instant finding notifications.
- **Standardized CVSS v3.1 Scoring:** Quantitative severity vectors calculated across all findings with direct MITRE CWE references.
- **Executive PDF Reporting:** Automated report compilation powered by ReportLab, featuring severity distribution charts and remediation blueprints.
- **Hardened Authentication:** JWT token rotation, bcrypt password hashing, timing-attack countermeasures, and isolated failed-login transaction commits.
- **API Key Management:** User-scoped SHA-256 hashed API keys for headless CI/CD pipeline integration.
- **Modern Cyber UI/UX:** Built with Next.js 16 (Turbopack), featuring deep navy/slate themes, subtle glassmorphism, responsive data tables, and zero cartoonish elements.

---

## 3. High-Level Architecture

```
                             ┌──────────────────────────────────────┐
                             │       Next.js 16 Web Dashboard       │
                             │   (React 19 / Turbopack / Port 3000) │
                             └──────────────────┬───────────────────┘
                                                │
                                REST API        │   WebSocket Telemetry
                                (/api/*)        │   (/api/ws/scans/{id})
                                                ▼
                             ┌──────────────────────────────────────┐
                             │         FastAPI Core Engine          │
                             │       (Python 3.11 / Port 8000)      │
                             └──────────┬───────────────┬───────────┘
                                        │               │
                     SQLAlchemy Async   │               │ Redis Pub/Sub &
                     (asyncpg)          │               │ Celery Message Broker
                                        ▼               ▼
                      ┌──────────────────────┐    ┌──────────────────────┐
                      │  PostgreSQL Database │    │     Redis Server     │
                      │      (Port 5433)     │    │      (Port 6379)     │
                      └──────────────────────┘    └──────────┬───────────┘
                                                             │
                                                             ▼
                                                  ┌──────────────────────┐
                                                  │  Celery Scan Worker  │
                                                  └──────────┬───────────┘
                                                             │
                                        ┌────────────────────┼────────────────────┐
                                        ▼                    ▼                    ▼
                             ┌────────────────────┐ ┌─────────────────┐ ┌─────────────────┐
                             │   Nuclei Engine    │ │    OWASP ZAP    │ │  Smart Fuzzer   │
                             │ (8,000+ Templates) │ │   (Port 8080)   │ │ (Dirs & Headers)│
                             └────────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 4. Technology Stack

| Layer | Component | Version | Description |
|---|---|---|---|
| **Frontend Framework** | Next.js | 16.2.3 | Modern App Router, Server Components & Turbopack |
| **Frontend Library** | React | 19.x | Component runtime with Hooks & Suspense |
| **Frontend Language** | TypeScript | 5.x | End-to-end static typing and contract validation |
| **Styling** | Vanilla CSS + Tailwind | 4.x | Design system tokens, glassmorphism, responsive grids |
| **Backend Framework** | FastAPI | 0.115.6 | Asynchronous Python REST API with Pydantic v2 validation |
| **ASGI Server** | Uvicorn | 0.34.0 | High-performance asynchronous server |
| **Database** | PostgreSQL | 16 | Relational data store for scans, users, and findings |
| **ORM & Migrations** | SQLAlchemy + Alembic | 2.0.36 / 1.14.0 | Asyncpg-powered asynchronous database management |
| **Task Queue & Broker** | Celery + Redis | 5.4.0 / 7.2 | Distributed job execution and telemetry pub/sub |
| **Template Scanner** | ProjectDiscovery Nuclei | v3.x | Community-curated vulnerability template matcher |
| **Dynamic Scanner** | OWASP ZAP | 2.14+ | Spidering, crawling, and active web injection engine |
| **PDF Generation** | ReportLab | 4.2.5 | Native Python PDF rendering with CVSS charts |

---

## 5. Project Directory Structure

```
ethiovuln/
├── backend/
│   ├── alembic/                      # Database migration scripts
│   ├── app/
│   │   ├── api/                      # REST endpoints (auth, scans, reports, keys, ws)
│   │   ├── core/                     # Configuration, database engine, security tokens
│   │   ├── models/                   # SQLAlchemy database models (User, Scan, Finding)
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   ├── services/                 # Scan orchestration, engines (Nuclei/ZAP), ReportLab PDF
│   │   └── tasks/                    # Celery task definitions
│   ├── tests/                        # Pytest suite (131 test cases)
│   ├── Dockerfile                    # Multi-stage production container
│   ├── render-start.sh               # Render entrypoint with automated migrations
│   └── requirements.txt              # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/                      # Next.js 16 App Router pages
│   │   │   ├── about/                # Developer bio and platform architecture
│   │   │   ├── dashboard/            # Overview, scans, reports, settings
│   │   │   │   └── scans/            # Scan history, new scan wizard, live telemetry [id]
│   │   │   ├── login/                # Sign in with password toggle & alert banner
│   │   │   ├── register/             # Registration with password strength meter
│   │   │   ├── globals.css           # Design tokens, color system, cyber animations
│   │   │   └── layout.tsx            # Global metadata, Inter & JetBrains Mono fonts
│   │   ├── components/               # Modular UI architecture
│   │   │   ├── layout/               # Section headers and shell containers
│   │   │   ├── navigation/           # Navbar, Sidebar, PageNav
│   │   │   ├── reports/              # Report card components
│   │   │   ├── scans/                # Scan rows, severity badges, status pills
│   │   │   └── ui/                   # Button, Card, Input, Alert, Badge, Skeleton
│   │   ├── hooks/                    # useAuth, useWebSocket custom state hooks
│   │   ├── lib/                      # Central API client, constants, CVSS calculators
│   │   └── types/                    # Shared TypeScript interfaces
│   ├── Dockerfile                    # Frontend production container
│   └── package.json                  # Frontend scripts and dependencies
├── docker-compose.yml                # Full local 5-container development topology
├── render.yaml                       # Render Infrastructure-as-Code Blueprint
├── .env.example                      # Centralized environment variable documentation
└── README.md                         # Project documentation
```

---

## 6. Authentication & RBAC

EthioVuln implements a secure authentication system engineered to eliminate common authorization flaws:

1. **Token Flow:** Returns an HS256-signed JWT Access Token (default: 24 hours) and Refresh Token (default: 7 days).
2. **Timing-Attack Countermeasure:** If an unrecognized email attempts authentication, the backend executes a dummy password verification computation against a fixed hash, ensuring response latencies remain indistinguishable from existing accounts.
3. **Isolated Failed-Login Transactions:** Failed login attempts are incremented and committed in a separate nested sub-transaction. Even when a `401 Unauthorized` response is emitted, the failed login count and lockout audit trail persist without being rolled back.
4. **Role-Based Access Control (RBAC):** Users are assigned `user` or `admin` scopes. Admin accounts have access to system-wide telemetry, user management, and queue configuration.

---

## 7. Dual-Engine Scanning Pipeline

EthioVuln avoids relying on a single scanning methodology by coordinating two industry-standard tools:

### Nuclei Engine (ProjectDiscovery)
- Executes over 8,000+ community YAML templates covering CVEs, exposed panels, leaked API tokens, and critical misconfigurations.
- High-speed async I/O scanning with low false-positive rates due to deterministic regex pattern matchers.

### OWASP ZAP (Zed Attack Proxy)
- Performs traditional and AJAX crawling to spider modern single-page applications and multi-page portals.
- Injects active testing payloads for SQL Injection, Cross-Site Scripting (XSS), Path Traversal, and Remote Code Execution (RCE).

### Smart Content Discovery Fuzzer
- Concurrent directory brute-forcing checking 153+ sensitive paths (`.env`, `.git/HEAD`, `wp-config.php.bak`, `backup.zip`).
- Header audit examining Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and CORS policies.

---

## 8. SSRF Protection Gate

To prevent EthioVuln from being weaponized to attack internal cloud infrastructures, every target URL submitted to `POST /api/scans/` is routed through the SSRF Protection Gate:

```
[Target URL Input]
       │
       ▼
[Scheme Gate] ──── Reject if not http:// or https://
       │
       ▼
[DNS Resolver] ─── Resolve hostname to IPv4/IPv6 addresses
       │
       ▼
[CIDR Filter] ──── Match against Private & Sensitive Ranges:
                   • 10.0.0.0/8 (RFC 1918)
                   • 172.16.0.0/12 (RFC 1918)
                   • 192.168.0.0/16 (RFC 1918)
                   • 127.0.0.0/8 (Loopback / Localhost)
                   • 169.254.169.254 (Cloud Instance Metadata Service)
                   • 0.0.0.0/8 (Current Network)
       │
       ▼
[Allowed Target] ─ Proceed to Queue Dispatch
```

---

## 9. REST API & Interactive Documentation

FastAPI automatically generates OpenAPI 3.0 schemas for all endpoints.

> **Interactive API Documentation URL:**  
> `http://127.0.0.1:8000/api/docs` *(Swagger UI)*  
> `http://127.0.0.1:8000/api/redoc` *(ReDoc UI)*  
> *(Note: The documentation is mounted explicitly under `/api/docs`, not `/docs`)*

### Core Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT tokens | No |
| `POST` | `/api/auth/refresh` | Refresh an expired access token | Refresh Token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer Token |
| `POST` | `/api/auth/accept-tos` | Record legal terms acceptance timestamp | Bearer Token |
| `GET` | `/api/scans/` | Paginated scan history | Bearer Token |
| `POST` | `/api/scans/` | Validate target and launch assessment | Bearer Token |
| `GET` | `/api/scans/{id}` | Inspect scan status, counts, and findings | Bearer Token |
| `POST` | `/api/scans/{id}/stop` | Abort an active assessment | Bearer Token |
| `GET` | `/api/scans/{id}/report` | Compile and download executive PDF report | Bearer Token |
| `GET` | `/api/apikeys/` | List user-scoped API keys | Bearer Token |
| `POST` | `/api/apikeys/` | Generate a new SHA-256 hashed API key | Bearer Token |
| `DELETE`| `/api/apikeys/{id}` | Revoke an active API key | Bearer Token |
| `GET` | `/api/health` | Service health check | No |

---

## 10. Real-Time WebSocket Protocol

Live telemetry is streamed directly to the frontend over a dedicated WebSocket connection:

- **Endpoint:** `ws://127.0.0.1:8000/api/ws/scans/{scan_id}` (or `wss://` in production)
- **Authentication:** Requires `token=<jwt_access_token>` in the query string.

### Event Payload Schema

```json
{
  "type": "log",
  "stage": "Phase 2: Content Discovery",
  "progress": 45,
  "data": {
    "level": "warning",
    "message": "[FUZZ] Discovered exposed environment file: https://target.com/.env",
    "timestamp": "2026-09-29T14:30:15Z"
  }
}
```

When a vulnerability is discovered, a `"type": "vulnerability"` event is pushed, allowing the dashboard UI to update without reloading.

---

## 11. Executive PDF Reports

EthioVuln utilizes the Python **ReportLab** library to compile production-ready security reports suitable for C-level executives and engineering teams.

- **Cover Page:** Target domain, assessment duration, tester identity, and timestamp.
- **Executive Summary:** High-level risk score, total vulnerability counts, and status overview.
- **Severity Breakdown:** Color-coded CVSS v3.1 severity matrix (Critical, High, Medium, Low, Info).
- **Technical Findings Detail:**
  - Finding Title & Description
  - Affected URL & HTTP Parameter
  - CVSS v3.1 Base Score and Vector String
  - MITRE CWE Identifier with reference URL
  - Raw Proof-of-Concept / Evidence Payload
  - Recommended Remediation Steps

---

## 12. API Key Management

For automated security audits in CI/CD pipelines (GitHub Actions, GitLab CI), EthioVuln provides API key authentication:

- **Key Format:** `ev_live_<32_random_hex_characters>`
- **Storage:** Only a SHA-256 hash of the key is stored in the database. The raw key is displayed once upon creation and cannot be retrieved later.
- **Usage:** Clients supply the key in the `X-API-Key` HTTP header.
- **Enforcement:** Enforces a maximum of 5 active keys per user account to prevent credential sprawl.

---

## 13. Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+ & npm
- PostgreSQL 16
- Redis 7

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Copy and configure environment variables
cp ../.env.example .env

# 5. Run database migrations
alembic upgrade head

# 6. Start FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Launch Next.js development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 14. Docker Setup

To deploy the complete topology (PostgreSQL, Redis, OWASP ZAP, FastAPI, Next.js, and Celery Worker) locally:

```bash
# Clone repository
git clone https://github.com/melakudeguale9-droid/ethiovuln.git
cd ethiovuln

# Copy environment template
cp .env.example .env

# Build and start all 5 containers
docker-compose up --build -d
```

### Container Port Mappings

- **Next.js Frontend:** `http://localhost:3000`
- **FastAPI Backend:** `http://localhost:8000`
- **FastAPI Documentation:** `http://localhost:8000/api/docs`
- **PostgreSQL Database:** `localhost:5433`
- **Redis Server:** `localhost:6379`
- **OWASP ZAP Daemon:** `localhost:8080`

To verify container health:
```bash
docker-compose ps
```

---

## 15. Environment Variables Reference

A centralized template is provided in `.env.example`.

| Variable | Description | Default / Example |
|---|---|---|
| `DATABASE_URL` | Async PostgreSQL connection string | `postgresql+asyncpg://dast:dastpass@localhost:5433/dast_db` |
| `DATABASE_URL_SYNC` | Synchronous PostgreSQL connection for Alembic | `postgresql://dast:dastpass@localhost:5433/dast_db` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `SECRET_KEY` | Cryptographic secret for JWT signing | `generate-a-secure-random-secret` |
| `JWT_ALGORITHM` | Algorithm used for token encoding | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifespan | `1440` (24 hours) |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifespan | `7` (7 days) |
| `ZAP_PROXY_URL` | URL to the OWASP ZAP daemon API | `http://localhost:8080` |
| `ZAP_API_KEY` | Authentication key for ZAP daemon | `changeme` |
| `NUCLEI_PATH` | Path to Nuclei executable binary | `/usr/bin/nuclei` |
| `NEXT_PUBLIC_API_URL` | Frontend API proxy endpoint | `http://localhost:8000` (or empty for reverse proxy) |
| `NEXT_PUBLIC_WS_URL` | Frontend WebSocket endpoint | `ws://localhost:8000` |

---

## 16. Testing Suite

The repository contains an automated test suite verifying all critical paths, configuration defaults, token lifespans, CVSS algorithms, target validation, and API schemas.

```bash
# Run backend pytest suite
pytest backend/tests

# Run frontend Next.js production build verification
cd frontend && npm run build
```

Expected result:
- **Backend:** `131 passed` (100% pass rate)
- **Frontend:** `12/12 routes compiled cleanly`

---

## 17. Production Build

To test and compile production bundles locally:

```bash
# Frontend Next.js build
cd frontend
npm ci
npm run build
npm run start

# Backend production run
cd backend
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 18. Render Deployment Guide

EthioVuln includes a Blueprint configuration (`render.yaml`) for deploying to [Render](https://render.com).

### Deployment Steps
1. Fork or push this repository to your GitHub account.
2. In the Render Dashboard, click **New +** → **Blueprint**.
3. Connect your repository.
4. Render will parse `render.yaml` and provision:
   - `ethiovuln-backend` (Web Service)
   - `ethiovuln-frontend` (Web Service)
   - `ethiovuln-redis` (Key-Value Store under `services:`)
   - `ethiovuln-db` (PostgreSQL Database under `databases:`)
5. Click **Apply** to launch the services.

---

## 19. Render Free Tier vs. Local Docker Limitations

To maintain transparency regarding cloud hosting boundaries:

| Capability | Local Docker Compose | Render Free Tier (`render.yaml`) |
|---|---|---|
| **FastAPI REST API** | Full Support | Full Support |
| **Next.js Dashboard** | Full Support | Full Support |
| **PostgreSQL Database** | Full Support | Full Support (Managed) |
| **Redis Cache / PubSub** | Full Support | Full Support (Key-Value) |
| **Celery Background Workers** | Full Support (Dedicated container) | Omitted (Workers require Render Paid Tier) |
| **OWASP ZAP Daemon** | Full Support (~1.5 GB RAM container) | Omitted (Exceeds Free Tier RAM limits) |
| **Nuclei CLI Engine** | Full Support | Degrades safely (Mock fallback / API logging) |

*On Render's Free Tier, scan jobs are created and stored in the database. For full asynchronous multi-engine scanning, deploy using `docker-compose` on a VPS with at least 4 GB RAM, or upgrade Render to include a Background Worker service.*

---

## 20. Security Engineering & Hardening

- **Non-Root Containers:** Both backend and frontend Dockerfiles run under unprivileged system users (`appuser` / `nextjs`).
- **SQL Injection Prevention:** 100% of queries use SQLAlchemy parameterized async queries; raw SQL concatenation is strictly prohibited.
- **Content Security:** Strict HTTP headers configured in production (CSP, HSTS, X-Content-Type-Options, Frame-Options).
- **Data Privacy:** User passwords and API keys are never stored in plaintext.

---

## 21. Responsible Use & Ethics Policy

> **WARNING:**  
> EthioVuln is built exclusively for authorized penetration testing, vulnerability assessments, and academic security research.

- **Explicit Authorization:** Never launch scans against systems, domain names, or IP addresses without prior written authorization from the owner.
- **Service Disruption:** Active vulnerability fuzzing may cause unstable applications to crash. Always schedule scans during agreed maintenance windows.
- **Legal Compliance:** Unauthorized vulnerability scanning is illegal in many jurisdictions and may lead to criminal prosecution. The authors assume no liability for misuse of this tool.

---

## 22. Screenshots & Interface Previews

| View | Description | Key Features |
|---|---|---|
| **Security Operations Center** | Dashboard overview | Realistic metric cards, severity breakdown, posture summary |
| **Live Scan Telemetry** | Active scan monitor | Real-time console terminal, auto-scroll, severity accordions |
| **New Assessment Wizard** | Scan configuration | Profile cards (Full, Quick Recon, Custom), SSRF safety gate |
| **Executive Reports** | Reporting module | ReportLab PDF export, CVSS v3.1 scores, remediation advice |
| **Settings & API Keys** | Account control | SHA-256 hashed API keys, session details, login audit history |

---

## 23. Author & Social Links

EthioVuln is designed and engineered by **Melaku Deguale**.

- **Developer:** Melaku Deguale (Ethical Hacker & Security Researcher)
- **GitHub Repository:** [https://github.com/melakudeguale9-droid/ethiovuln](https://github.com/melakudeguale9-droid/ethiovuln)
- **Telegram Channel:** [https://t.me/melakucyber](https://t.me/melakucyber)
- **LinkedIn Profile:** [https://www.linkedin.com/in/melaku-deguale-7803ba416/](https://www.linkedin.com/in/melaku-deguale-7803ba416/)
- **YouTube:** Channel configuration pending

---

## 24. License

This project is licensed under the **MIT License**. See the `LICENSE` file for full terms and conditions.

```
Copyright (c) 2026 Melaku Deguale

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```
