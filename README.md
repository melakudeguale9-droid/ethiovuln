# 🛡️ EthioVuln — Automated Web Vulnerability Assessment Platform

> **Discover. Analyze. Secure.**  
> Enterprise-grade Dynamic Application Security Testing (DAST) engineered for automated web reconnaissance, vulnerability discovery, CVSS v3.1 scoring, and executive reporting.

[![CI Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Backend Tests](https://img.shields.io/badge/pytest-198%2F198%20passed-10B981.svg)]()
[![Frontend Unit Tests](https://img.shields.io/badge/vitest%20RTL-13%2F13%20passed-10B981.svg)]()
[![Frontend E2E Tests](https://img.shields.io/badge/playwright-4%2F4%20passed-10B981.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-00E5FF.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

> 🚀 **Quick Start:** For a streamlined, step-by-step setup guide, see [**`QUICKSTART.md`**](QUICKSTART.md).  
> 📡 **Uptime Monitoring:** For external alerting with UptimeRobot, see [**`MONITORING.md`**](MONITORING.md).

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
16. [Comprehensive Testing Suite](#16-comprehensive-testing-suite)
17. [Production Build](#17-production-build)
18. [Continuous Integration & Deployment (CI/CD)](#18-continuous-integration--deployment-cicd)
19. [Render Deployment Guide](#19-render-deployment-guide)
20. [Render Free Tier vs. Local Docker Limitations](#20-render-free-tier-vs-local-docker-limitations)
21. [Security Engineering & Observability](#21-security-engineering--observability)
22. [System Health & Uptime Monitoring](#22-system-health--uptime-monitoring)
23. [Responsible Use & Ethics Policy](#23-responsible-use--ethics-policy)
24. [Screenshots & Interface Previews](#24-screenshots--interface-previews)
25. [Author & Social Links](#25-author--social-links)
26. [License](#26-license)

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
- **Structured JSON Logging & Observability:** Production-ready `structlog` logging injecting `request_id`, `user_id`, `endpoint`, and timestamps into all events, paired with safe global exception handling.
- **Deep Health Telemetry:** Multi-service dependency probing verifying PostgreSQL and Redis status and roundtrip latency.
- **Modern Cyber UI/UX:** Built with Next.js 15 (Turbopack) and React 19, featuring deep navy/slate themes, subtle glassmorphism, responsive data tables, and zero cartoonish elements.

---

## 3. High-Level Architecture

```
                             ┌──────────────────────────────────────┐
                             │       Next.js 15 Web Dashboard       │
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
| **Frontend Framework** | [Next.js](https://nextjs.org/) | 15.1.0 | Modern App Router, Server Components & Turbopack |
| **Frontend Library** | [React](https://react.dev/) | 19.0.0 | Component runtime with Hooks & Suspense |
| **Frontend Language** | [TypeScript](https://www.typescriptlang.org/) | 5.x | End-to-end static typing and contract validation |
| **Styling** | Vanilla CSS + [Tailwind CSS](https://tailwindcss.com/) | 3.4.1 | Design system tokens, glassmorphism, responsive grids |
| **Backend Framework** | [FastAPI](https://fastapi.tiangolo.com/) | 0.115.0 | Asynchronous Python REST API with Pydantic v2 validation |
| **ASGI Server** | [Uvicorn](https://www.uvicorn.org/) | 0.30.0 | High-performance asynchronous server |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | 16 | Relational data store for scans, users, and findings |
| **ORM & Migrations** | [SQLAlchemy](https://www.sqlalchemy.org/) + [Alembic](https://alembic.sqlalchemy.org/) | 2.0.52 / 1.13.2 | Asyncpg-powered asynchronous database management |
| **Task Queue & Broker** | [Celery](https://docs.celeryq.dev/) + [Redis](https://redis.io/) | 5.4.0 / 7.2 | Distributed job execution and telemetry pub/sub |
| **Structured Logging** | [structlog](https://www.structlog.org/) | 24.x | JSON-formatted structured logs with automatic context injection |
| **Rate Limiting** | [SlowAPI](https://github.com/laurentS/slowapi) | 0.1.9 | Tiered IP and user rate limiting backed by Redis |
| **AI Intelligence** | [Google GenAI SDK](https://github.com/google/generative-ai-python) | 1.x (Gemini) | AI vulnerability analysis, mitigation patches & chat assistant |
| **Template Scanner** | [ProjectDiscovery Nuclei](https://github.com/projectdiscovery/nuclei) | v3.x | Community-curated vulnerability template matcher |
| **Dynamic Scanner** | [OWASP ZAP](https://www.zaproxy.org/) | 2.14+ | Spidering, crawling, and active web injection engine |
| **PDF Generation** | [ReportLab](https://www.reportlab.com/) | 4.2.5 | Native Python PDF rendering with CVSS charts |

---

## 5. Project Directory Structure

```
ethiovuln/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Automated GitHub Actions CI (pytest, lint, typecheck, build)
│       └── deploy-vps.yml            # Automated VPS Continuous Deployment (SSH + Docker Compose)
├── backend/
│   ├── alembic/                      # Database migration scripts & version revisions
│   ├── app/
│   │   ├── api/                      # REST routers (auth, scans, reports, settings, ai, ws)
│   │   ├── core/                     # Logging, rate limiting, security tokens, target verification
│   │   ├── models/                   # SQLAlchemy database models (User, Scan, Finding, ApiKey)
│   │   ├── schemas/                  # Pydantic v2 request/response schemas
│   │   ├── services/                 # Scan orchestration, Gemini AI integration, ReportLab PDF
│   │   ├── workers/                  # Celery tasks & engines (Nuclei, ZAP, Smart Fuzzer)
│   │   ├── config.py                 # Central environment & runtime configuration
│   │   ├── database.py               # Async SQLAlchemy engine & session factory
│   │   └── main.py                   # FastAPI app entrypoint, health checks & exception handlers
│   ├── tests/                        # Automated Pytest suite (198 test cases across 15 files)
│   ├── Dockerfile                    # Multi-stage production container
│   ├── render-start.sh               # Render entrypoint with automated database migrations
│   └── requirements.txt              # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/                      # Next.js 15 App Router pages (about, dashboard, pricing, etc.)
│   │   │   ├── dashboard/            # Overview, scans, reports, settings
│   │   │   │   └── scans/            # Scan history, new scan wizard, live telemetry [id]
│   │   │   ├── login/                # Sign in with password toggle & alert banner
│   │   │   ├── register/             # Registration with password strength meter
│   │   │   ├── globals.css           # Design tokens, color system, cyber animations
│   │   │   └── layout.tsx            # Global metadata, Inter & JetBrains Mono fonts
│   │   ├── components/               # Modular UI architecture
│   │   │   ├── ai/                   # AIChatDrawer, AIChatBubble, AIStatusBadge
│   │   │   ├── layout/               # Shell containers, section headers
│   │   │   ├── navigation/           # Navbar, Sidebar, PageNav
│   │   │   ├── reports/              # Report card & summary components
│   │   │   ├── scans/                # ConsoleStream, VulnerabilityAccordion, severity badges
│   │   │   └── ui/                   # Button, Card, Input, Alert, Badge, Skeleton
│   │   ├── hooks/                    # useAuth, useWebSocket custom state hooks
│   │   ├── lib/                      # Central API client, constants, CVSS calculators
│   │   └── types/                    # Shared TypeScript interfaces
│   ├── e2e/                          # Playwright end-to-end integration tests
│   ├── Dockerfile                    # Frontend multi-stage production container (Port 10000)
│   └── package.json                  # Frontend scripts and dependencies
├── docker-compose.yml                # Full local 6-container development topology
├── render.yaml                       # Render Infrastructure-as-Code Blueprint
├── MONITORING.md                     # Uptime monitoring setup guide (UptimeRobot / Health Check)
├── QUICKSTART.md                     # Step-by-step developer setup guide
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

### [Nuclei Engine (ProjectDiscovery)](https://github.com/projectdiscovery/nuclei)
- Executes over 8,000+ community YAML templates covering CVEs, exposed panels, leaked API tokens, and critical misconfigurations.
- High-speed async I/O scanning with low false-positive rates due to deterministic regex pattern matchers.

### [OWASP ZAP (Zed Attack Proxy)](https://www.zaproxy.org/)
- Performs traditional and AJAX crawling to spider modern single-page applications and multi-page portals.
- Injects active testing payloads for SQL Injection, Cross-Site Scripting (XSS), Path Traversal, and Remote Code Execution (RCE).

### Smart Content Discovery Fuzzer
- Concurrent directory brute-forcing checking 153+ sensitive paths (`.env`, `.git/HEAD`, `wp-config.php.bak`, `backup.zip`).
- Header audit examining Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and CORS policies.

### Mandatory Vulnerability Detection (INSA Bootcamp Requirements)
EthioVuln rigorously detects and reports on the four mandatory vulnerabilities:

1. **SQL Injection (SQLi) - [CWE-89](https://cwe.mitre.org/data/definitions/89.html)**
   - **Engine:** [OWASP ZAP](https://www.zaproxy.org/)
   - **Detection Mechanism:** Injects payloads (e.g., `' OR '1'='1`, time-based `WAITFOR`) to observe database errors or timing differences.
   - **CVSS v3.1 Range:** 7.2 - 10.0 (High - Critical)
   - **Remediation:** Parameterized queries, ORM usage, input sanitization.

2. **Cross-Site Scripting (XSS) - [CWE-79](https://cwe.mitre.org/data/definitions/79.html)**
   - **Engine:** [OWASP ZAP](https://www.zaproxy.org/) & [Nuclei](https://github.com/projectdiscovery/nuclei)
   - **Detection Mechanism:** Injects benign JS (e.g., `"><script>alert(1)</script>`) and checks for unsanitized reflection or stored execution.
   - **CVSS v3.1 Range:** 5.4 - 8.2 (Medium - High)
   - **Remediation:** Context-aware output encoding, DOMPurify, Content Security Policy (CSP).

3. **Cross-Site Request Forgery (CSRF) - [CWE-352](https://cwe.mitre.org/data/definitions/352.html)**
   - **Engine:** [OWASP ZAP](https://www.zaproxy.org/)
   - **Detection Mechanism:** Identifies state-changing requests lacking or improperly validating anti-CSRF tokens.
   - **CVSS v3.1 Range:** 4.3 - 8.8 (Medium - High)
   - **Remediation:** Synchronizer Token Pattern, server-side validation, `SameSite` cookie attributes.

4. **Missing Security Headers - [CWE-1021](https://cwe.mitre.org/data/definitions/1021.html) / [CWE-693](https://cwe.mitre.org/data/definitions/693.html)**
   - **Engine:** [Nuclei](https://github.com/projectdiscovery/nuclei)
   - **Detection Mechanism:** Passive analysis of HTTP responses for missing/weak `CSP`, `HSTS`, `X-Frame-Options`, and `X-Content-Type-Options`.
   - **CVSS v3.1 Range:** 2.6 - 5.3 (Low - Medium)
   - **Remediation:** Enforce `Strict-Transport-Security`, `Content-Security-Policy: default-src 'self'`, and anti-clickjacking headers.

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

## 9. REST API & Hardened Interactive Documentation

FastAPI generates standards-compliant OpenAPI 3.0 schemas for all system endpoints. EthioVuln implements security hardening across all documentation interfaces to avoid accidental exposure in production environments.

> **Interactive Documentation Endpoints:**  
> - **Swagger UI:** [`http://127.0.0.1:8000/api/docs`](http://127.0.0.1:8000/api/docs) — Interactive sandbox testing  
> - **ReDoc UI:** [`http://127.0.0.1:8000/api/redoc`](http://127.0.0.1:8000/api/redoc) — Deep technical reference & schema browser  
> - **OpenAPI Specification:** [`http://127.0.0.1:8000/api/openapi.json`](http://127.0.0.1:8000/api/openapi.json) — Machine-readable OpenAPI 3.0 spec  
> *(Note: Mounted under `/api/docs` and `/api/redoc` rather than standard root paths)*

### 🔒 API Documentation Hardening Architecture

In adherence to the **OWASP API Security Top 10 (API8:2023 Security Misconfiguration)**, exposing API schemas and interactive test consoles in public production environments poses significant reconnaissance risks. EthioVuln hardens this via:

1. **Environment-Controlled Docs Toggling:**
   - Documentation is conditionally mounted using `ENABLE_API_DOCS: bool` in `app/config.py`.
   - In production, setting `ENABLE_API_DOCS=false` cleanly disables `/api/docs`, `/api/redoc`, and `/api/openapi.json` (returns `404 Not Found`), denying attackers automated endpoint enumeration.

2. **Swagger UI Parameter Hardening:**
   - **`defaultModelsExpandDepth: -1`**: Hides data schema accordions by default, reducing client DOM overhead and mitigating schema scraping.
   - **`persistAuthorization: true`**: Retains user Bearer JWT tokens in browser storage across page reloads during authorized development.
   - **`displayRequestDuration: true`**: Computes request and response latency metrics directly in the Swagger UI.
   - **`filter: true`**: Enables instant real-time search across routes and tags.
   - **`syntaxHighlight.theme: "monokai"`**: Customized dark aesthetic aligned with EthioVuln platform styling.

3. **Standardized Security Definitions (OpenAPI Components):**
   - **`BearerAuth` (HTTP Bearer JWT):** Formats token authentication via `Authorization: Bearer <access_token>`.
   - **`ApiKeyAuth` (API Key Header):** Supports automation tokens via `X-API-Key: ev_live_<token>`.
   - **`OAuth2PasswordBearer`:** Integrated login flow for Swagger UI token acquisition at `/api/auth/login`.

### Core Endpoints Matrix

| Method | Endpoint | Category | Description | Auth Required |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Authentication | Register a new user account with bcrypt hash | No |
| `POST` | `/api/auth/login` | Authentication | OAuth2 form authentication for JWT token pair | No |
| `POST` | `/api/auth/refresh` | Authentication | Issue fresh access token using refresh token | Refresh Token |
| `GET` | `/api/auth/me` | Authentication | Fetch profile and permissions of caller | Bearer Token |
| `POST` | `/api/auth/accept-tos` | Authentication | Record legal Terms of Service acceptance | Bearer Token |
| `GET` | `/api/scans/` | Scans | Paginated scan assessment history | Bearer Token |
| `POST` | `/api/scans/` | Scans | SSRF-validated assessment dispatch | Bearer Token |
| `GET` | `/api/scans/{id}` | Scans | Inspect scan status, progress, and finding counts | Bearer Token |
| `POST` | `/api/scans/{id}/stop` | Scans | Cancel/abort an active running assessment | Bearer Token |
| `GET` | `/api/scans/{id}/vulnerabilities` | Scans | Query discovered vulnerabilities with severity filters | Bearer Token |
| `GET` | `/api/scans/{id}/report` | Reports | Generate and download executive PDF report | Bearer Token |
| `GET` | `/api/settings/profile` | Settings | Retrieve user profile and contact details | Bearer Token |
| `PATCH`| `/api/settings/profile` | Settings | Update user name, organization, or email | Bearer Token |
| `GET` | `/api/settings/preferences` | Settings | Fetch dashboard theme and scan defaults | Bearer Token |
| `PATCH`| `/api/settings/preferences` | Settings | Update notification and theme settings | Bearer Token |
| `GET` | `/api/settings/api-keys` | API Keys | List user-scoped API keys (max 5) | Bearer Token |
| `POST` | `/api/settings/api-keys` | API Keys | Generate a new SHA-256 hashed CI/CD API key | Bearer Token |
| `DELETE`| `/api/settings/api-keys/{key_id}`| API Keys | Revoke an active automation API key | Bearer Token |
| `GET` | `/api/settings/login-history` | Audit | Retrieve timestamped audit log of sign-in events | Bearer Token |
| `GET` | `/api/settings/subscription` | Settings | Inspect trial period, plan limits, and days left | Bearer Token |
| `POST` | `/api/settings/subscription/upgrade` | Settings | Upgrade subscription tier or renew plan | Bearer Token |
| `GET` | `/api/ai/status` | AI Intelligence | Check if Google GenAI (Gemini) is configured | Bearer Token (Optional) |
| `POST` | `/api/ai/ping` | AI Intelligence | Probe Gemini AI connectivity, measure latency & response | Bearer Token (Optional) |
| `POST` | `/api/ai/generate` | AI Intelligence | Request vulnerability explanation and guidance | Bearer Token (Optional) |
| `POST` | `/api/ai/chat` | AI Intelligence | Interactive multi-turn cyber security AI assistant | Bearer Token (Optional) |
| `POST` | `/api/ai/mitigate` | AI Intelligence | Generate code remediation patch & mitigation steps | Bearer Token (Optional) |
| `GET` | `/api/health` | Observability | Deep health probe verifying PostgreSQL & Redis connectivity | No |
| `GET` | `/` | System | Service metadata, status, and documentation links | No |

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

## 13. Local Development Installation Guide

EthioVuln is organized as a decoupled monorepo containing a **FastAPI backend** and a **Next.js 15 (React 19) frontend**.

### Prerequisites
- **Python:** 3.11+ (Python 3.11 – 3.14 compatible)
- **Node.js:** 20+ (Node 20, 22, or 24) & `npm`
- **PostgreSQL:** 16 (running natively on port `5432` or via Docker on port `5433`)
- **Redis:** 7+ (running on port `6379`)
- **Nuclei:** ProjectDiscovery Nuclei (`/usr/bin/nuclei` or in system `$PATH`)
- **Google Chrome / Chromium:** For automated Playwright E2E browser tests

---

### Step 1: Database & Redis (Docker Quickstart)
If you do not have native PostgreSQL and Redis instances running, launch them with Docker:
```bash
# Run PostgreSQL (port 5433) and Redis (port 6379)
docker-compose up -d postgres redis
```

---

### Step 2: Backend & Celery Worker Setup

Open a terminal for the backend:
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate a dedicated virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Copy and configure environment variables
cp ../.env.example .env
# Edit .env if using non-default credentials

# 5. Run database migrations to initialize tables
alembic upgrade head

# 6. Start the FastAPI development server (with hot reload)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
> The API server is now running at [`http://localhost:8000`](http://localhost:8000).  
> Interactive Swagger UI: [`http://localhost:8000/api/docs`](http://localhost:8000/api/docs)  
> Interactive ReDoc UI: [`http://localhost:8000/api/redoc`](http://localhost:8000/api/redoc)

In a separate terminal, launch the Celery task worker to process scanning jobs:
```bash
cd backend
source venv/bin/activate
celery -A app.workers.celery_app worker --loglevel=info --pool=solo
```

---

### Step 3: Frontend Setup (`npm run dev`)

Open a third terminal for the Next.js frontend:
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (use --legacy-peer-deps for React 19 peer resolution)
npm install --legacy-peer-deps

# 3. Launch Next.js Turbopack development server
npm run dev
```

> The EthioVuln Cyber Dashboard is now live at [`http://localhost:3000`](http://localhost:3000).

---

## 14. Docker Compose Setup

For single-command containerized deployment of the complete platform topology (PostgreSQL, Redis, OWASP ZAP, FastAPI Backend, Celery Worker, and Next.js Frontend):

```bash
# 1. Clone repository
git clone https://github.com/melakudeguale9-droid/ethiovuln.git
cd ethiovuln

# 2. Copy environment template
cp .env.example .env

# 3. Build and launch all 6 services in detached mode
docker-compose up --build -d
```

### Container Topology & Port Mappings

| Container Name | Service | Host Port | Internal Port | Healthcheck |
|---|---|---|---|---|
| `dast_frontend` | Next.js 15 Web Dashboard | `3000` | `10000` | HTTP GET `/` |
| `dast_backend` | FastAPI REST & WS Core | `8000` | `8000` | HTTP GET `/api/health` |
| `dast_worker` | Celery Background Scanner | — | — | Process Supervision |
| `dast_postgres` | PostgreSQL 16 Database | `5433` | `5432` | `pg_isready -U dast` |
| `dast_redis` | Redis 7 Message Broker & Cache | `6379` | `6379` | `redis-cli ping` |
| `dast_zap` | OWASP ZAP Daemon Engine | `8080` | `8080` | HTTP GET `/JSON/core/view/version` |

### Docker Lifecycle Commands

```bash
# Check status and health of all containers
docker-compose ps

# Stream unified logs across all services
docker-compose logs -f

# Stream logs for a specific service
docker-compose logs -f backend
docker-compose logs -f worker
docker-compose logs -f frontend

# Gracefully stop all containers
docker-compose down

# Stop and wipe persistent volume data (fresh reset)
docker-compose down -v
```

---

## 15. Environment Variables Reference

A centralized template is provided in [`.env.example`](.env.example). Copy this file to `.env` in the root and `backend/.env`.

| Variable | Description | Default / Example |
|---|---|---|
| `ENVIRONMENT` | Deployment environment (`development`, `staging`, `production`) | `development` |
| `DEBUG` | Enable debug logging & stack traces (False in production) | `True` |
| `ENABLE_API_DOCS` | Toggle Swagger UI & ReDoc (set `false` in production for hardening) | `True` |
| `DATABASE_URL` | Async PostgreSQL connection string (asyncpg) | `postgresql+asyncpg://dast:dast_secret@localhost:5433/dast_db` |
| `DATABASE_URL_SYNC` | Synchronous PostgreSQL connection string (psycopg2/alembic) | `postgresql://dast:dast_secret@localhost:5433/dast_db` |
| `REDIS_URL` | Redis URL for Celery message broker and caching | `redis://localhost:6379/0` |
| `SECRET_KEY` | Cryptographic secret for signing JWT access and refresh tokens | `min-32-char-random-cryptographic-key` |
| `JWT_ALGORITHM` | Algorithm used for JWT encoding | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifespan in minutes | `1440` (24 hours) |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifespan in days | `7` (7 days) |
| `ZAP_API_URL` | URL to the OWASP ZAP daemon API | `http://localhost:8080` |
| `ZAP_API_KEY` | Authentication key for ZAP daemon | `changeme` |
| `NUCLEI_PATH` | Path to Nuclei executable binary | `/usr/bin/nuclei` |
| `GEMINI_API_KEY` | Google GenAI API key for AI threat intelligence | *(Optional)* `AIzaSy...` |
| `GEMINI_MODEL` | Gemini AI model identifier | `gemini-3.5-flash-lite` |
| `FUZZER_THREADS` | Concurrency worker count for directory fuzzing engine | `30` |
| `FUZZER_TIMEOUT` | Request timeout for fuzzing probes in seconds | `5` |
| `BACKEND_URL` | Base URL of FastAPI backend | `http://localhost:8000` |
| `FRONTEND_URL` | Base URL of Next.js frontend | `http://localhost:3000` |
| `NEXT_PUBLIC_WS_URL` | Frontend WebSocket endpoint reachable from browser | `ws://localhost:8000` |

---

## 16. Comprehensive Testing Suite

EthioVuln maintains rigorous test automation spanning backend unit & integration tests, SSRF protection gates, AI service probes, API documentation hardening, frontend React Testing Library unit tests, and Playwright E2E browser tests.

### 1. Backend Testing (Pytest)

The backend test suite contains **198 automated tests** covering:
- **Authentication & RBAC:** Password hashing, timing-safe validation, JWT claims, refresh token rotation, failed-login transaction isolation (`test_auth.py`, `test_security.py`).
- **Authorization & Multi-Tenancy (IDOR):** Horizontal access control, resource ownership validation, cross-tenant scan isolation (`test_authorization_idor.py`).
- **SSRF Protection Gate:** IP CIDRs, RFC 1918 subnets, cloud metadata (`169.254.169.254`), loopback filters, DNS rebind checks (`test_target_verification.py`).
- **Deep Health & Observability:** Database (PostgreSQL) and Redis connectivity, connection pooling, degraded dependency reporting (`test_health.py`).
- **Structured Logging & Exception Handling:** Structlog JSON formatting, contextual metadata injection (`request_id`, `user_id`, `endpoint`), traceback logging, and sanitized 500 error responses (`test_logging_and_errors.py`).
- **Rate Limiting & Abuse Prevention:** SlowAPI tiered thresholds, Redis backends, rate limit header verification (`test_rate_limiting.py`).
- **API Documentation Hardening:** Validating `/api/docs`, `/api/redoc`, OpenAPI security components (`BearerAuth`, `ApiKeyAuth`), and production 404 lockout (`test_api_docs_hardening.py`).
- **AI Intelligence Probes:** Gemini API connectivity, latency benchmarks, ping probes, fallback handling (`test_ai_ping.py`).
- **Trial & Subscription Enforcement:** Subscription plan limits, trial expiration date math, 402 Payment Required gates (`test_trial_subscription.py`).
- **CVSS v3.1 & CWE Mappings:** Quantitative vector calculations and MITRE taxonomy validation (`test_cvss_cwe.py`).

```bash
cd backend
source venv/bin/activate
pytest -v
```
> **Status:** `198 / 198 passed (100% pass rate)`

---

### 2. Frontend Unit Testing (React Testing Library & Vitest)

Frontend component tests focus on real-time scan telemetry and finding interaction:
- **`ConsoleStream` Component:** Real-time log streaming, log level styling (`[INFO]`, `[WARN]`, `[ERROR]`), timestamps, terminal badges, and auto-scroll checkbox toggling.
- **`VulnerabilityAccordion` (Findings UI) Component:** Empty states, active `● LIVE STREAM` indicators, severity counters, accordion expansion (detailed definitions, impact analysis, remediation steps, and raw evidence inspection), and filter clearing.

```bash
cd frontend
# Run single test pass
npm run test

# Run interactive watch mode
npm run test:watch
```
> **Status:** `13 / 13 passed (100% pass rate)`

---

### 3. Frontend Integration & E2E Testing (Playwright)

End-to-end browser integration tests validate real-world user interactions:
- **2-Column Responsive Layout:** Verifies simultaneous rendering of Console Stream (5 cols) and Findings UI (7 cols).
- **Accordion Expansion:** Clicks a detected finding and verifies the detailed remediation, threat score, and HTTP proof-of-concept DOM nodes expand.
- **Severity Filtering:** Filters findings by severity pill and restores with "Clear Filter".
- **Live Stream Controls:** Toggles auto-scroll checkbox in the terminal viewer.

```bash
cd frontend
npm run test:e2e
```
> **Status:** `4 / 4 passed (100% pass rate)`

---

### 4. Full Quality Assurance Verification

Run the entire suite of checks across typing, linting, unit tests, and builds:
```bash
# Frontend type check
cd frontend && npm run test:typecheck

# Frontend linting
cd frontend && npm run lint

# Frontend production build
cd frontend && npm run build
```

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

## 18. Continuous Integration & Deployment (CI/CD)

EthioVuln features enterprise CI/CD automation implemented via GitHub Actions:

### Continuous Integration Pipeline (`.github/workflows/ci.yml`)
Triggers automatically on every `push` and `pull_request` to the `main` branch:
- **Backend Quality Job:**
  - Spins up containerized services: **PostgreSQL 16** (port 5432) and **Redis 7** (port 6379).
  - Installs Python 3.11 with pip caching.
  - Applies all database migrations with `alembic upgrade head`.
  - Executes the full **198 automated pytest suite**, verifying 100% pass rate.
- **Frontend Quality Job:**
  - Installs Node.js 20 with npm caching.
  - Verifies TypeScript contracts (`tsc --noEmit`).
  - Audits code quality with ESLint (`npm run lint`).
  - Executes Vitest component suites (`npm run test`).
  - Compiles optimized production bundle (`npm run build`).

### Continuous Deployment for VPS (`.github/workflows/deploy-vps.yml`)
- Triggers on `push` to `main`, strictly gated upon both CI test jobs completing successfully (`needs: [backend-test, frontend-test]`).
- Uses `appleboy/ssh-action` to establish encrypted SSH connections to the production VPS.
- Automatically pulls latest repository revisions and executes `docker-compose up -d --build` to safely update backend, worker, database, and frontend containers with zero downtime.

---

## 19. Render Deployment Guide

EthioVuln includes a Blueprint configuration ([`render.yaml`](render.yaml)) with `autoDeploy: true` on branch `main` for one-click deployment to [Render](https://render.com).

### Deployment Steps
1. Fork or push this repository to your GitHub account.
2. In the Render Dashboard, click **New +** → **Blueprint**.
3. Connect your repository.
4. Render will parse `render.yaml` and provision:
   - `ethiovuln-backend` (Web Service running FastAPI on Python 3.11)
   - `ethiovuln-frontend` (Web Service running Next.js 15 on Node.js)
   - `ethiovuln-redis` (Key-Value Store under `services:`)
   - `ethiovuln-db` (PostgreSQL 16 Database under `databases:`)
5. Click **Apply** to launch the services.

---

## 20. Render Free Tier vs. Local Docker Limitations

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

## 21. Security Engineering & Observability

- **Non-Root Containers:** Both backend and frontend Dockerfiles run under unprivileged system users (`appuser` / `nextjs`).
- **SQL Injection Prevention:** 100% of queries use SQLAlchemy parameterized async queries; raw SQL concatenation is strictly prohibited.
- **Content Security:** Strict HTTP headers configured in production (CSP, HSTS, X-Content-Type-Options, Frame-Options).
- **Data Privacy & Cryptography:** Passwords hashed with bcrypt; API keys stored strictly as SHA-256 hashes.
- **Structured JSON Logging:** Built with `structlog`. All requests and operations are emitted as structured JSON lines containing timestamp, level, `request_id`, authenticated `user_id`, client IP, HTTP method, and response status code.
- **Centralized Error Handling:** Global exception handler intercepts unhandled exceptions, records tracebacks into internal structured logs, and returns sanitized `500 Internal Server Error` JSON responses to clients, guaranteeing zero backend stack trace leakage.

---

## 22. System Health & Uptime Monitoring

EthioVuln provides a robust system health probe at `/api/health`:

- **Endpoint:** `GET /api/health` (No authentication required)
- **Deep Dependency Probing:**
  - **PostgreSQL Connectivity:** Verifies database connection pool and measures roundtrip query latency (`SELECT 1`).
  - **Redis Connectivity:** Issues a Redis `PING` command and measures latency in milliseconds.
- **Status Reporting:**
  - Returns HTTP `200 OK` with `{"status": "ok", "checks": {"database": {"status": "ok", "latency_ms": 1.2}, "redis": {"status": "ok", "latency_ms": 0.8}}}` when all dependencies are healthy.
  - Returns HTTP `503 Service Unavailable` with `{"status": "degraded"}` if any core dependency fails.
- **Uptime Monitoring Integration:** Can be connected to free monitoring services such as **UptimeRobot**, Better Stack, or Pingdom to receive instant email/SMS alerts if backend instances fail. Detailed step-by-step instructions are documented in [**`MONITORING.md`**](MONITORING.md).

---

## 23. Responsible Use & Ethics Policy

> **WARNING:**  
> EthioVuln is built exclusively for authorized penetration testing, vulnerability assessments, and academic security research.

- **Explicit Authorization:** Never launch scans against systems, domain names, or IP addresses without prior written authorization from the owner.
- **Service Disruption:** Active vulnerability fuzzing may cause unstable applications to crash. Always schedule scans during agreed maintenance windows.
- **Legal Compliance:** Unauthorized vulnerability scanning is illegal in many jurisdictions and may lead to criminal prosecution. The authors assume no liability for misuse of this tool.

---

## 24. Screenshots & Interface Previews

| View | Description | Key Features |
|---|---|---|
| **Security Operations Center** | Dashboard overview | Realistic metric cards, severity breakdown, posture summary |
| **Live Scan Telemetry** | Active scan monitor | Real-time console terminal, auto-scroll, severity accordions |
| **New Assessment Wizard** | Scan configuration | Profile cards (Full, Quick Recon, Custom), SSRF safety gate |
| **Executive Reports** | Reporting module | ReportLab PDF export, CVSS v3.1 scores, remediation advice |
| **Settings & API Keys** | Account control | SHA-256 hashed API keys, session details, login audit history |

---

## 25. Author & Social Links

EthioVuln is designed and engineered by **Melaku Deguale**.

- **Developer:** Melaku Deguale (Cyber Security Student & Security Researcher)
- **GitHub Repository:** [https://github.com/melakudeguale9-droid/ethiovuln](https://github.com/melakudeguale9-droid/ethiovuln)
- **Telegram Channel:** [https://t.me/melakucyber](https://t.me/melakucyber)
- **LinkedIn Profile:** [https://www.linkedin.com/in/melaku-deguale-7803ba416/](https://www.linkedin.com/in/melaku-deguale-7803ba416/)

---

## 26. License

This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for full terms and conditions.

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
