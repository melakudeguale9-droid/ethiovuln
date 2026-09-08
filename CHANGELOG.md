# Changelog

All notable changes to EthioVuln are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] — 2026-09-09

### Added
- Rate limiting on API endpoints (login: 5/min, register: 10/min, scan creation: 10/min, global: 200/min)
- Custom 404 Not Found page matching the dark cyber theme
- Custom runtime error page with error digest display and retry button
- Environment validation on startup — warns in debug mode, exits in production for insecure configs
- Open Graph and Twitter Card meta tags for rich social media previews
- Favicon using the EthioVuln shield icon
- Dynamic page title template (`%s | EthioVuln`)
- `LICENSE` (MIT), `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md` project files
- Responsible disclosure policy and security scope in `SECURITY.md`

### Changed
- Rebranded all `DAST Platform` references to `EthioVuln` across frontend, backend, config, and env files
- Navbar logo letter updated from `D` to `E`
- Updated `README.md` with professional structure, correct setup instructions, and author links
- Upgraded `requests` from `2.32.0` (yanked, CVE-2024-35195) to `2.32.3`
- Default `NUCLEI_PATH` changed from Windows path to `/usr/bin/nuclei` (Linux)
- Default `DATABASE_URL` corrected to match Docker Compose credentials (`dast:dast_secret@localhost:5432`)
- Social media links on About page updated to author's GitHub and YouTube

### Fixed
- Corrupted syntax in `seed_admin.py` (stray JSON blob embedded in Python code)
- Author name updated from `Mulugeta Ababi` to `Melaku Deguale` across all pages

### Security
- Added `dump.rdb` and `*.rdb` to `.gitignore` to prevent Redis data from being committed
- Added `*.pdf` to `.gitignore` to prevent generated reports from being committed
- `SECRET_KEY` insecure default detection at startup

---

## [1.0.0] — 2026-08-01

### Added
- Full-stack DAST platform with Next.js 16 frontend and FastAPI backend
- JWT authentication with bcrypt password hashing and role-based access control
- PostgreSQL database with SQLAlchemy async ORM and Alembic migrations
- Celery + Redis task queue for background scan execution
- Nuclei v3 integration for template-based vulnerability detection
- OWASP ZAP integration for web crawling and active scanning
- Custom fuzzer covering SQLi, XSS, SSTI, SSRF, LFI, CORS, Open Redirect, Clickjacking
- Five scan modes: Full Scan, Nuclei-only, Discovery + Fuzzing, ZAP Spider, ZAP + Nuclei
- Real-time WebSocket scan monitoring with live progress and findings
- PDF vulnerability reports with CVSS v3.1 scoring and CWE classification
- Target verification and SSRF protection before scan execution
- Dashboard with scan history, vulnerability statistics, and severity breakdown
- Docker Compose setup for PostgreSQL, Redis, and OWASP ZAP
- Admin user seeding script

---

## Upcoming

- AI-assisted vulnerability analysis
- Automated remediation recommendations
- Multi-user team support
- Cloud deployment guide
- Advanced API security testing
