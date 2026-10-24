# 🛡️ EthioVuln — Final Defense Presentation Deck
## Information Network Security Administration (INSA) Cyber Security Bootcamp
### Capstone Project Defense — Option A: Web Application Security Products

---

## Slide 1: Title Slide
* **Project Name:** EthioVuln — Automated Web Vulnerability Assessment & Management Platform
* **Tagline:** Discover. Analyze. Secure.
* **Track:** Option A: Individual Product (Web Application Security Products)
* **Presenter:** Melaku Deguale (Cyber Security Student & Security Researcher)
* **Institution:** Information Network Security Administration (INSA)
* **Repository:** [https://github.com/melakudeguale9-droid/ethiovuln](https://github.com/melakudeguale9-droid/ethiovuln)
* **Date / Status:** Production-Ready MVP (202/202 Pytest + 17 Frontend = 219 Tests Passing)

> **Presenter Note:**  
> "Good morning/afternoon, esteemed mentors and members of the INSA technical defense committee. Today, I am proud to present EthioVuln, an automated Dynamic Application Security Testing (DAST) and vulnerability management platform engineered specifically to solve application security challenges in emerging digital economies."

---

## Slide 2: The Problem — Application Security in Emerging Markets
* **Prohibitive Licensing Costs:** Commercial DAST solutions (Burp Suite Pro, Acunetix, Qualys) demand $3,000 to $15,000+ USD annually, inaccessible due to severe foreign exchange (forex) constraints.
* **Acute Talent Shortage:** Growing engineering teams operate without dedicated DevSecOps or application security specialists.
* **Expanding Attack Surface:** Rapid digitization in fintech, e-commerce, and government leads to recurring injection flaws and critical misconfigurations.
* **Open-Source CLI Friction:** While tools like Nuclei and OWASP ZAP are capable, executing them manually via raw CLI scripts lacks real-time orchestration, live team telemetry, and executive reporting.

> **Presenter Note:**  
> "Ethiopian startups and digital agencies face a critical dilemma: enterprise tools cost too much foreign currency, security talent is scarce, and raw open-source tools require complex manual scripting. This creates substantial unaddressed security debt."

---

## Slide 3: The Solution — EthioVuln Platform
* **Automated Multi-Engine DAST:** Combines the lightning speed of Nuclei template matching with the depth of OWASP ZAP active crawling in a single unified workflow.
* **Real-Time Asynchronous Telemetry:** Scans run asynchronously in the background, streaming real-time console logs and percentage progress (0–100%) over WebSockets.
* **Mathematical Risk Scoring:** CVSS v3.1 quantitative severity vectors mapped directly to official MITRE CWE taxonomies.
* **AI-Powered Threat Assistant:** Integrated Google GenAI (Gemini) providing context-aware vulnerability explanations and automated code remediation patches.
* **Actionable Executive PDF Reports:** Compiles audit-ready PDF summaries featuring risk distribution matrices and developer remediation blueprints.
* **Localized Business Accessibility:** Built to support local payment rails (Telebirr, Chapa) priced in Ethiopian Birr (ETB).

> **Presenter Note:**  
> "EthioVuln bridges this gap by delivering an enterprise-grade, developer-friendly web security platform that is automated, localized, and actionable for both executives and software engineers."

---

## Slide 4: System Architecture & Decoupled Topology
* **Frontend Operations Dashboard:** Next.js 15 (React 19, Turbopack, Tailwind CSS 3.4) featuring a glassmorphic dark theme, terminal stream, and responsive finding accordions (Port 3000).
* **Core REST & WebSocket Engine:** FastAPI 0.115 (Python 3.11, Pydantic v2, Uvicorn ASGI) handling high-concurrency requests and telemetry (Port 8000).
* **Asynchronous Broker & Workers:** Celery 5.4 + Redis 7 distributed worker pool isolating CPU/network-intensive scans from HTTP request cycles.
* **Relational Database:** PostgreSQL 16 with asynchronous SQLAlchemy 2.0 and Alembic schema migrations (Port 5433).
* **Scanning Engines:** OWASP ZAP 2.14+ Daemon (Port 8080), ProjectDiscovery Nuclei v3.x, and custom Directory Fuzzer.

```
[ Next.js 15 UI ] ──REST / WebSockets──> [ FastAPI Core Engine ]
                                                │
                                    ┌───────────┴───────────┐
                                    ▼                       ▼
                           [ PostgreSQL 16 ]         [ Redis 7 Broker ]
                                                            │
                                                            ▼
                                                   [ Celery Workers ]
                                                            │
                                            ┌───────────────┼───────────────┐
                                            ▼               ▼               ▼
                                       [ Nuclei ]      [ OWASP ZAP ]   [ Fuzzer ]
```

> **Presenter Note:**  
> "The platform employs an asynchronous microservices topology. Long-running vulnerability probes are offloaded to Celery workers via Redis, ensuring the web dashboard and REST API remain blazing fast and completely non-blocking."

---

## Slide 5: INSA Mandatory Vulnerability Detections
EthioVuln rigorously detects and reports on all 4 required vulnerability classes:

1. **SQL Injection (SQLi) — CWE-89:**
   * *Engine:* OWASP ZAP & Parameter Fuzzer
   * *Mechanism:* Active boolean, union, and time-based blind payloads (`' OR '1'='1`, `pg_sleep(5)`).
   * *CVSS v3.1:* 7.2 – 10.0 (High – Critical)
   * *Remediation:* Parameterized queries, ORM usage (SQLAlchemy), strict input allowlisting.

2. **Cross-Site Scripting (XSS) — CWE-79:**
   * *Engine:* OWASP ZAP & ProjectDiscovery Nuclei
   * *Mechanism:* Reflected and stored script injections (`"><script>alert(1)</script>`).
   * *CVSS v3.1:* 5.4 – 8.2 (Medium – High)
   * *Remediation:* Context-aware HTML encoding, DOMPurify sanitization, restrictive Content Security Policy (CSP).

3. **Cross-Site Request Forgery (CSRF) — CWE-352:**
   * *Engine:* OWASP ZAP Spider & Active Form Prober
   * *Mechanism:* Crawls state-changing endpoints for missing anti-CSRF tokens or lax validation.
   * *CVSS v3.1:* 4.3 – 8.8 (Medium – High)
   * *Remediation:* Synchronizer Token Pattern, `SameSite=Lax/Strict`, and Origin verification.

4. **Missing Security Headers — CWE-1021 / CWE-693:**
   * *Engine:* Nuclei & Passive Header Analyzer
   * *Mechanism:* Audits missing `CSP`, `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`.
   * *CVSS v3.1:* 2.6 – 5.3 (Low – Medium)
   * *Remediation:* Enforce defensive HTTP response headers across all web servers and reverse proxies.

---

## Slide 6: Defense-in-Depth & SSRF Protection Gate
To prevent EthioVuln from being weaponized by adversaries to attack cloud providers or internal infrastructure:

* **3-Tier SSRF Safety Gate:**
  1. *Scheme Whitelist:* Strictly allows `http://` and `https://` only (blocks `file://`, `gopher://`, `dict://`).
  2. *DNS Resolution:* Resolves hostnames to underlying IPv4/IPv6 addresses before requests are made.
  3. *CIDR Filtering:* Drops all RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), local loopbacks (`127.0.0.0/8`), and cloud metadata IP (`169.254.169.254`).
* **Timing-Attack Proof Authentication:** Executes dummy bcrypt hash verifications for non-existent users to keep response latencies identical.
* **Isolated Subtransactions:** Failed login attempts and account lockouts are committed in isolated database sub-transactions that never roll back during 401 exceptions.
* **SHA-256 Hashed API Keys:** Headless CI/CD keys are never stored in plaintext and are capped at 5 per user.

---

## Slide 7: AI Threat Intelligence & Assistant (Gemini)
* **Interactive Cyber Assistant:** Built-in floating `AIChatDrawer` allowing developers to ask natural language questions about detected vulnerabilities directly from the scan console.
* **Automated Code Remediation:** `/api/ai/mitigate` generates language-specific secure code patches tailored to the target's technology stack.
* **Roundtrip Latency Probing:** `/api/ai/ping` benchmarks Gemini API connectivity, response latency (ms), and model readiness.
* **Cost & Abuse Protection:** Strictly rate-limited via SlowAPI backed by Redis to prevent API quota exhaustion.

---

## Slide 8: Real-Time Telemetry & Executive PDF Reports
* **Live WebSocket Log Streaming:** Streams live color-coded terminal telemetry (`[INFO]`, `[WARN]`, `[VULN]`), phase progress indicators, and percentage counters (0–100%) to `ws://127.0.0.1:8000/api/ws/scans/{id}`.
* **Publication-Ready PDF Generator:** Powered by ReportLab, rendering:
  * Executive cover page with assessment metadata and target domain.
  * Quantitative CVSS risk distribution table with color-coded severity pills.
  * Discovered vulnerabilities catalog table with CWE mappings and engines.
  * Detailed technical finding cards with affected URLs, proof-of-concept evidence, and developer code remediation blueprints.
  * Dynamic `NumberedCanvas` with confidential running headers and "Page X of Y" footers.

---

## Slide 9: Enterprise Observability & System Monitoring
* **Structured JSON Logging:** Built with `structlog`. Every HTTP request and scan event automatically captures `request_id`, authenticated `user_id`, client IP, endpoint, and HTTP response code.
* **Centralized Error Handling:** Global exception handler intercepts unhandled exceptions, logs full tracebacks to internal security logs, and returns sanitized `500 Internal Server Error` responses without leaking backend stack traces.
* **Deep Multi-Dependency Health Probe (`/api/health`):**
  * Checks live PostgreSQL connection pool and queries `SELECT 1` with latency measurement.
  * Pings Redis message broker and records roundtrip latency.
  * Returns HTTP 200 (`status: "ok"`) or HTTP 503 (`status: "degraded"`).
* **Third-Party Monitoring Integration:** Configured for free 24/7 uptime monitoring and incident alerting via UptimeRobot (documented in `MONITORING.md`).

---

## Slide 10: Testing, Quality Assurance & CI/CD Pipeline
* **Backend Automated Pytest Suite:**
  * **202 automated tests passing (100% pass rate)** spanning auth, RBAC, IDOR, SSRF gate, CVSS math, AI ping, rate limiting, structured logging, health probes, and PDF compilation.
* **Frontend Quality Assurance:**
  * **13 Vitest / React Testing Library tests:** Testing terminal streams, auto-scroll, severity counters, and live filters.
  * **4 Playwright E2E browser tests:** Verifying 2-column layout, accordion expansion, and real-time finding interactions.
  * **TypeScript & ESLint validation:** Strict zero-warning static contract compliance.
* **Continuous Integration (`.github/workflows/ci.yml`):** Runs containerized Postgres + Redis services and executes the full 219 test suite on push and PR.
* **Continuous Deployment for VPS (`.github/workflows/deploy-vps.yml`):** Automatically executes zero-downtime `docker-compose up -d --build` updates on the production VPS gated upon CI passing.

---

## Slide 11: Business Model & Commercial Strategy
* **Freemium SaaS Tiering:**
  * *Community Tier (Free):* 3 scans/month, passive headers, online dashboard (designed for students and open source).
  * *Pro Tier (Local Subscription):* Unlimited scans, dual-engine active scans, executive PDF downloads, CI/CD API keys. Billed locally in ETB via Telebirr and Chapa.
  * *Enterprise / On-Premise:* Air-gapped on-premise Docker deployment within private VPCs for banks, fintechs, and government agencies.
* **Target Segments:**
  * Software Development Agencies (pre-deployment sign-off).
  * Fintech & E-commerce Startups (PCI-DSS & baseline hygiene).
  * Educational Institutions & Public Agencies.
* **Competitive Moat:** Unified dual-engine architecture, zero CLI barrier, localized billing, and built-in AI remediation assistant.

---

## Slide 12: Live Demonstration & Audit Results
* **Test Environments Evaluated:**
  * *OWASP Juice Shop:* Modern Angular/Node.js SPA testbed.
  * *Acunetix Vulnweb (`testphp.vulnweb.com`):* Classic multi-page application.
* **Demonstrated Findings:**
  * Identified SQL Injection in `artists.php?artist=1` (CVSS 9.8 Critical).
  * Identified Reflected XSS in search parameters (CVSS 7.5 High).
  * Detected missing Content-Security-Policy & HSTS headers (CVSS 4.3 Medium).
  * Verified SSRF Protection Gate blocking internal loopback and cloud metadata attacks.
  * Downloaded executive PDF report with developer code fixes.

---

## Slide 13: Conclusion, Future Roadmap & Defense Q&A
* **Project Milestone:** Successfully fulfilled all Capstone Option A requirements, delivering a production-ready, fully tested DAST platform.
* **Future Roadmap:**
  * *Phase 2:* Scheduled recurring cron scans and instant Telegram bot alert notifications.
  * *Phase 3:* Authenticated session crawling macros and in-dashboard custom Nuclei template studio.
  * *Phase 4:* Regional expansion across East African tech hubs (Kenya, Rwanda).
* **Thank You!**
  * Developer: Melaku Deguale
  * Contact: [https://t.me/melakucyber](https://t.me/melakucyber) | [LinkedIn](https://www.linkedin.com/in/melaku-deguale-7803ba416/)
  * Questions & Technical Defense Discussion.
