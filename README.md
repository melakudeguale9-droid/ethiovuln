# 🛡️ EthioVuln

**Automated Web Vulnerability Assessment Platform**

> Discover. Analyze. Secure.

EthioVuln is a full-stack Dynamic Application Security Testing (DAST) platform that combines automated reconnaissance, web crawling, vulnerability scanning, fuzzing, and real-time monitoring into a single unified dashboard.

Built for security researchers, penetration testers, and developers who need a professional-grade tool for **authorized** security assessments.

---

## ✨ Features

- **Multi-engine scanning** — Nuclei, OWASP ZAP, and a custom fuzzer working together
- **Real-time monitoring** — WebSocket-based live scan progress and findings
- **Vulnerability detection** — SQLi, XSS, SSTI, SSRF, LFI, CORS, Open Redirect, Clickjacking, and more
- **PDF reports** — Downloadable executive summary reports with CVSS scores and CWE classifications
- **JWT authentication** — Secure login, role-based access, login history, and API keys
- **Multiple scan modes** — Full Scan, Nuclei-only, Discovery + Fuzzing, ZAP Spider, ZAP + Nuclei
- **Settings dashboard** — Preferences, API keys, login history, export, danger zone

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   Next.js Frontend  │  :3000
└──────────┬──────────┘
           │ REST + WebSocket
           ▼
┌─────────────────────┐
│   FastAPI Backend   │  :8000
└──────────┬──────────┘
           │
    ┌──────┼──────┐
    ▼      ▼      ▼
Postgres Redis Celery Worker
 :5433  :6379
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
 Nuclei    OWASP ZAP   Fuzzer
            :8080
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Database | PostgreSQL 16 |
| Task Queue | Celery 5, Redis 7 |
| Security Engines | Nuclei v3, OWASP ZAP, Custom Fuzzer |
| Auth | JWT (python-jose), bcrypt |
| Reports | ReportLab PDF |
| Containers | Docker, Docker Compose |

---

## ⚙️ Prerequisites

| Tool | Version | Install |
|---|---|---|
| Python | 3.11+ | `sudo apt install python3.11` |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Docker | 20+ | `sudo apt install docker.io` |
| Docker Compose | v2 | `sudo apt install docker-compose` |
| Nuclei | v3+ | `sudo apt install nuclei` or [releases](https://github.com/projectdiscovery/nuclei/releases) |

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/melakudeguale9-droid/ethiovuln.git
cd ethiovuln
```

### 2. Start infrastructure (PostgreSQL + Redis + ZAP)

```bash
docker-compose up -d postgres redis zap
```

Wait ~60 seconds for ZAP to become healthy.

### 3. Configure the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql+asyncpg://dast:dast_secret@localhost:5433/dast_db
DATABASE_URL_SYNC=postgresql://dast:dast_secret@localhost:5433/dast_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-strong-random-secret-key-min-32-chars
ZAP_API_KEY=changeme
NUCLEI_PATH=/usr/bin/nuclei
DEBUG=true
```

### 4. Run database migrations and seed admin

```bash
cd backend
source venv/bin/activate
alembic upgrade head
python -m app.seed_admin
```

### 5. Start backend services

**Terminal 1 — API server:**
```bash
cd backend && source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Celery worker:**
```bash
cd backend && source venv/bin/activate
celery -A app.workers.celery_app worker --loglevel=info --pool=solo
```

### 6. Start the frontend

**Terminal 3:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker (Full Stack)

Run the complete stack with Docker Compose:

```bash
# First time — build images (takes 5-10 min)
docker-compose build

# Start all services
docker-compose up -d

# Watch logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop everything
docker-compose down
```

> **Note:** The first `docker-compose up` automatically runs migrations and seeds the admin user.

---

## 🌐 Access

| Service | URL |
|---|---|
| Dashboard | http://localhost:3000 |
| API Docs (Swagger) | http://localhost:8000/api/docs |
| API ReDoc | http://localhost:8000/api/redoc |
| ZAP API | http://localhost:8080 |

---

## 🔑 Default Credentials

After running `python -m app.seed_admin`:

| Field | Value |
|---|---|
| Email | `melaku@gmail.com` |
| Password | `Admin@1234` |

> **Change your password immediately after first login** via Settings → Security.

---

## 🔒 Environment Variables

All configuration lives in `backend/.env`. Required variables:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Async PostgreSQL URL | `postgresql+asyncpg://dast:dast_secret@localhost:5433/dast_db` |
| `DATABASE_URL_SYNC` | Sync PostgreSQL URL (Celery) | `postgresql://dast:dast_secret@localhost:5433/dast_db` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `SECRET_KEY` | JWT signing key (min 32 chars) | `your-random-secret` |
| `ZAP_API_KEY` | OWASP ZAP API key | `changeme` |
| `NUCLEI_PATH` | Path to Nuclei binary | `/usr/bin/nuclei` |
| `DEBUG` | Enable debug logging | `true` / `false` |

---

## 🎯 Scan Modes

| Mode | Engines | Use Case |
|---|---|---|
| **Full Scan** | Nuclei + ZAP + Fuzzer | Most thorough — use for complete assessments |
| **Nuclei Scan** | Nuclei only | Fast CVE/template-based detection |
| **ZAP Spider** | ZAP only | Deep crawling and active scanning |
| **Discovery + Fuzzing** | Custom Fuzzer | Directory/endpoint discovery |
| **ZAP + Nuclei** | ZAP + Nuclei | Combined crawl + template detection |

---

## 📊 Scan Flow

```
1. Enter target URL (must be authorized)
2. Accept Terms of Service
3. Select scan mode
4. Scan launches via Celery background worker
5. Live logs stream via WebSocket
6. Findings appear in real-time on scan detail page
7. Scan completes → PDF report available for download
```

---

## 🔒 Security Features

- **SSRF Protection** — Three-tier target verification blocks scanning of private/internal IPs, localhost, and reserved address ranges
- **Rate Limiting** — All endpoints rate-limited via SlowAPI
- **JWT Authentication** — Access + refresh token flow with configurable expiry
- **Password Hashing** — bcrypt with proper truncation handling
- **Login History** — All login attempts recorded (success + failure)
- **API Keys** — Personal programmatic access keys with SHA-256 hashing

---

## 📁 Project Structure

```
ethiovuln/
├── backend/
│   ├── app/
│   │   ├── api/            # REST API routes (auth, scans, reports, websocket, settings)
│   │   ├── core/           # Security utilities, target verification
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # PDF report generation (ReportLab)
│   │   ├── workers/        # Celery tasks, Nuclei, ZAP, fuzzer engines
│   │   └── utils/          # CVSS scoring, CWE mapping
│   ├── alembic/            # Database migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env                # Local config (not committed)
│
├── frontend/
│   └── src/
│       ├── app/            # Next.js App Router pages
│       │   ├── page.tsx                        # Landing page
│       │   ├── login/                          # Login
│       │   ├── register/                       # Register
│       │   ├── about/                          # About developer
│       │   └── dashboard/                      # Protected dashboard
│       │       ├── page.tsx                    # Overview / SOC
│       │       ├── scans/                      # Scan list + detail + new
│       │       ├── reports/                    # PDF report downloads
│       │       └── settings/                   # Account settings
│       ├── components/     # Reusable UI components
│       ├── hooks/          # useAuth, useWebSocket
│       ├── lib/            # API client, settingsApi, constants, cvss
│       └── types/          # TypeScript type definitions
│
├── docker-compose.yml      # Full stack: postgres, redis, zap, backend, worker, frontend
├── .env.example            # Example environment file
└── README.md
```

---

## 🗄️ Database Migrations

```bash
# Apply all migrations
alembic upgrade head

# Create a new migration
alembic revision --autogenerate -m "description"

# Rollback one step
alembic downgrade -1
```

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
source venv/bin/activate
pytest tests/ -v

# Test API health
curl http://localhost:8000/api/health

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"melaku@gmail.com","password":"Admin@1234"}'
```

---

## 🚨 Security & Legal Disclaimer

EthioVuln is intended **only for authorized security testing**.

Do not scan websites, servers, APIs, or infrastructure without **explicit written permission** from the owner. Unauthorized scanning is illegal under most jurisdictions. The author is not responsible for any damage, unauthorized access, or legal consequences resulting from misuse.

**Only test systems you own or have explicit authorization to assess.**

---

## 🗺️ Roadmap

- [x] Web dashboard
- [x] JWT authentication + API keys
- [x] Nuclei integration
- [x] OWASP ZAP integration
- [x] Custom fuzzer
- [x] Real-time WebSocket monitoring
- [x] PDF vulnerability reports (ReportLab)
- [x] CVSS v3.1 scoring
- [x] CWE classification
- [x] Docker full-stack deployment
- [x] Login history & settings
- [ ] AI-assisted vulnerability analysis
- [ ] Automated remediation recommendations
- [ ] Multi-user team support
- [ ] Cloud deployment guide

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome. Please open an issue before submitting a pull request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Melaku Deguale** — Ethical Hacker & Security Researcher

- GitHub: [@melakudeguale9-droid](https://github.com/melakudeguale9-droid)
- Telegram: [InfoSecureTech](https://t.me/InfoSecureTech)
- YouTube: [EthioVuln Channel](https://www.youtube.com/channel/UC5AyGUzC06A0QKIkqlMyn1g)

---

> Discover. Analyze. Secure.
