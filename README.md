# 🛡️ EthioVuln

**Automated Web Vulnerability Assessment Platform**

> Discover. Analyze. Secure.

EthioVuln is a full-stack Dynamic Application Security Testing (DAST) platform that combines automated reconnaissance, web crawling, vulnerability scanning, fuzzing, and real-time monitoring into a single unified dashboard.

Built for security researchers, penetration testers, and developers who need a professional-grade tool for authorized security assessments.

---

## ✨ Features

- **Multi-engine scanning** — Nuclei, OWASP ZAP, and a custom fuzzer working together
- **Real-time monitoring** — WebSocket-based live scan progress and findings
- **Vulnerability detection** — SQLi, reflected XSS, CSRF form weaknesses, missing security headers, SSTI, SSRF, LFI, CORS, Open Redirect, Clickjacking, and more
- **PDF reports** — Downloadable executive summary reports with CVSS scores and CWE classifications
- **JWT authentication** — Secure login, role-based access control, and SSRF protection
- **Multiple scan modes** — Full scan, Nuclei-only, Discovery + Fuzzing, ZAP Spider, ZAP + Nuclei

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   Next.js Frontend  │
└──────────┬──────────┘
           │ REST + WebSocket
           ▼
┌─────────────────────┐
│   FastAPI Backend   │
└──────────┬──────────┘
           │
    ┌──────┼──────┐
    ▼      ▼      ▼
Postgres Redis Celery
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
 Nuclei    OWASP ZAP   Fuzzer
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| Database | PostgreSQL 16 |
| Task Queue | Celery, Redis |
| Security Engines | Nuclei v3, OWASP ZAP, Custom Fuzzer |
| Auth | JWT, bcrypt |
| Reports | WeasyPrint, Jinja2 |

---

## ⚙️ Prerequisites

| Tool | Version |
|---|---|
| Docker | 20+ |
| Docker Compose | v2 |
| Python | 3.10+ |
| Node.js | 18+ |
| Nuclei | v3+ |

Install on Kali / Debian:
```bash
sudo apt install -y docker.io docker-compose nuclei
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker $USER && newgrp docker
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/melakudeguale9-droid/ethiovuln.git
cd ethiovuln
```

### 2. Start infrastructure

```bash
docker-compose up -d
```

Starts PostgreSQL, Redis, and OWASP ZAP. Wait ~60 seconds for ZAP to become healthy.

### 3. Configure the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql+asyncpg://dast:dast_secret@localhost:5432/dast_db
DATABASE_URL_SYNC=postgresql://dast:dast_secret@localhost:5432/dast_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-long-random-secret-key
ZAP_API_KEY=changeme
NUCLEI_PATH=/usr/bin/nuclei
DEBUG=true
```

### 4. Run database migrations and seed admin

```bash
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

## 🌐 Access

| Service | URL |
|---|---|
| Dashboard | http://localhost:3000 |
| API Docs | http://localhost:8000/api/docs |
| API ReDoc | http://localhost:8000/api/redoc |
| ZAP API | http://localhost:8080 |

Default admin credentials (change after first login):
- **Email:** set during `python -m app.seed_admin`
- **Password:** `Admin@1234`

---

## 📁 Project Structure

```
ethiovuln/
├── backend/
│   ├── app/
│   │   ├── api/          # REST API routes (auth, scans, reports, websocket)
│   │   ├── core/         # Security utilities, target verification
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── services/     # PDF report generation
│   │   ├── workers/      # Celery tasks, Nuclei, ZAP, fuzzer engines
│   │   └── utils/        # CVSS scoring, CWE mapping
│   ├── alembic/          # Database migrations
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── app/          # Next.js App Router pages
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom React hooks (WebSocket)
│       ├── lib/          # API client, constants, utilities
│       └── types/        # TypeScript type definitions
│
├── docker-compose.yml    # PostgreSQL, Redis, OWASP ZAP
├── .env.example
├── docs/              # Architecture, business plan, report, and presentation materials
└── README.md
```

---

## 🎯 Scan Modes

| Mode | Description |
|---|---|
| Full Scan | Runs all engines sequentially |
| Nuclei Scan | Template-based vulnerability detection only |
| Discovery + Fuzzing | Endpoint discovery and custom fuzzing |
| ZAP Spider | Web crawling and passive scanning |
| ZAP + Nuclei | Crawling combined with template scanning |

---

## 🔒 Security & Legal Disclaimer

EthioVuln is intended **only for authorized security testing**.

Do not scan websites, servers, APIs, or infrastructure without **explicit written permission** from the owner. The author is not responsible for any damage, unauthorized access, or legal consequences resulting from misuse.

**Only test systems you own or have explicit authorization to assess.**

## 🧪 Validation

Run backend checks from the `backend` directory:

```bash
pytest -q
python -m compileall -q app alembic
alembic check
```

Run frontend checks from the `frontend` directory:

```bash
npm ci
npm run lint
npm run build
```

The scanner's custom fuzzer includes focused checks for SQL injection, reflected
XSS, missing security headers, CSRF weaknesses in same-origin state-changing
forms, CORS, clickjacking, information disclosure, and sensitive paths. Nuclei
and OWASP ZAP add template-based and active/passive coverage when configured.

---

## 🗺️ Roadmap

- [x] Web dashboard
- [x] JWT authentication
- [x] Nuclei integration
- [x] OWASP ZAP integration
- [x] Custom fuzzer
- [x] Real-time WebSocket monitoring
- [x] PDF vulnerability reports
- [x] CVSS v3.1 scoring
- [x] CWE classification
- [ ] AI-assisted vulnerability analysis
- [ ] Automated remediation recommendations
- [ ] Multi-user team support
- [ ] Cloud deployment guide
- [ ] Advanced API security testing

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome. Please open an issue before submitting a pull request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Melaku Deguale**
- GitHub: [@melakudeguale9-droid](https://github.com/melakudeguale9-droid)
- YouTube: [EthioVuln Channel](https://www.youtube.com/channel/UC5AyGUzC06A0QKIkqlMyn1g)

---

> Discover. Analyze. Secure.
