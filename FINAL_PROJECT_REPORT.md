# 🛡️ INSA CYBER SECURITY BOOTCAMP
## FINAL CAPSTONE PROJECT REPORT

> **Individual Capstone Defense Document — Option A: Web Application Security Products**

| Project Attribute | Details |
|:---|:---|
| **Project Title** | **EthioVuln — Automated Web Vulnerability Assessment & Management Platform** |
| **Track / Option** | Option A: Individual Product (Web Application Security Products) |
| **Developer** | Melaku Deguale (Ethical Hacker & Security Researcher) |
| **Institution** | Information Network Security Administration (INSA) Cyber Security Bootcamp |
| **Target Audience** | Bootcamp Mentors, Security Evaluators & Technical Defense Committee |
| **Version & Status** | Version 1.0.0 (Production-Ready MVP — 131/131 Tests Passing) |
| **Repository** | [GitHub: melakudeguale9-droid/ethiovuln](https://github.com/melakudeguale9-droid/ethiovuln) |

---

## 1. Executive Summary

Web application vulnerabilities continue to represent one of the primary attack vectors threatening modern digital infrastructure. The **EthioVuln** platform was designed, engineered, and evaluated as an end-to-end, automated Dynamic Application Security Testing (DAST) suite and vulnerability management solution tailored for emerging tech ecosystems, startups, and software development agencies.

The primary objective was to deliver a scalable, containerized, and secure auditing platform capable of:
1. Crawling target endpoints and actively executing multi-engine vulnerability assessments.
2. Detecting the mandatory OWASP Top 10 vulnerabilities—specifically **SQL Injection (SQLi)**, **Cross-Site Scripting (XSS)**, **Cross-Site Request Forgery (CSRF)**, and **Missing HTTP Security Headers**.
3. Dynamically scoring identified risks using standardized **CVSS v3.1** vectors linked to official **MITRE CWE** definitions.
4. Safeguarding the scanning infrastructure through a dedicated **3-Tier SSRF Protection Gate**.
5. Compiling audit-ready **executive PDF reports** with severity matrices and code-level developer remediation blueprints.

The system was evaluated against industry-standard vulnerable targets (OWASP Juice Shop and Acunetix Vulnweb), proving high audit throughput, zero worker starvation, reliable telemetry, and high detection accuracy.

---

## 2. Project Background & Problem Statement

Organizations and startups operating in emerging digital economies face an acute security dilemma:

* **Prohibitive Licensing Costs:** Commercial enterprise scanners (such as Burp Suite Professional, Acunetix, or Qualys) require substantial foreign currency subscription fees ($3,000–$15,000+/year) that local startups and SMEs cannot afford.
* **Scarcity of Specialized Personnel:** Dedicated penetration testers and DevSecOps engineers are scarce and costly, leaving development teams to deploy code with critical security debt.
* **Operational Disconnect in Open-Source CLI Tools:** While tools like OWASP ZAP and Nuclei are powerful, running them via terminal scripts lacks unified orchestration, real-time visual monitoring, concurrency management, and consolidated reporting for non-security stakeholders.

**EthioVuln** directly resolves these bottlenecks by providing a containerized, unified DAST pipeline that combines the speed of template matching, the depth of active crawling, and an intuitive Next.js web operations console.

---

## 3. System Architecture & Technical Stack

The platform is designed around a decoupled, microservices-oriented architecture orchestrated via Docker Compose. Intensive security audits are isolated into asynchronous worker queues to ensure the user interface and REST API remain responsive.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js 16 Web Dashboard (Port 3000)                 │
│              (React 19 / Turbopack / Tailwind CSS / WebSockets)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                     REST API       │   WebSocket Telemetry
                     (/api/*)       │   (/api/ws/scans/{id})
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      FastAPI Core REST Engine                          │
│               (Python 3.11 / Pydantic v2 / Port 8000)                  │
└───────────┬────────────────────────────────────────────────┬───────────┘
            │                                                │
   Asyncpg / SQLAlchemy                               Redis Pub/Sub &
   Relational ORM                                     Celery Message Broker
            ▼                                                ▼
┌────────────────────────┐                      ┌────────────────────────┐
│  PostgreSQL Database   │                      │      Redis Server      │
│      (Port 5433)       │                      │      (Port 6379)       │
└────────────────────────┘                      └────────────┬───────────┘
                                                             │
                                                             ▼
                                                ┌────────────────────────┐
                                                │   Celery Scan Worker   │
                                                └────────────┬───────────┘
                                                             │
                       ┌─────────────────────────────────────┼──────────────────────────────────┐
                       ▼                                     ▼                                  ▼
            ┌─────────────────────┐               ┌─────────────────────┐            ┌─────────────────────┐
            │    Nuclei Engine    │               │      OWASP ZAP      │            │    Smart Fuzzer     │
            │ (8,000+ Templates)  │               │     (Port 8080)     │            │  (Dirs & Headers)   │
            └─────────────────────┘               └─────────────────────┘            └─────────────────────┘
```

### Comprehensive Technical Stack

| Layer | Technology | Version | Purpose in EthioVuln |
|:---|:---|:---|:---|
| **Frontend Framework** | Next.js (App Router) | 16.2.3 | Server-rendered shell, glassmorphic UI, responsive data tables |
| **Frontend Library** | React & TypeScript | 19.x / 5.x | Reactive UI components, strict compile-time type validation |
| **Styling System** | Vanilla CSS + Tailwind | 4.x | Design tokens, glowing status indicators, responsive mobile drawers |
| **Backend Framework** | FastAPI | 0.115.6 | Asynchronous high-throughput REST API with OpenAPI documentation |
| **Asynchronous Engine** | Uvicorn / Asyncio | 0.34.0 | Non-blocking event loop execution |
| **Task Queue & Broker**| Celery + Redis | 5.4.0 / 7.2 | Distributed job distribution and WebSocket pub/sub telemetry |
| **Database & ORM** | PostgreSQL + SQLAlchemy | 16 / 2.0.36 | Relational store for users, scans, findings, and Alembic migrations |
| **Crawling Engine** | OWASP ZAP Daemon | 2.14+ | Traditional and AJAX spidering, active injection fuzzing |
| **Template Scanner** | ProjectDiscovery Nuclei | v3.x | Deterministic YAML template matching across 8,000+ CVEs |
| **PDF Generation** | Python ReportLab | 4.2.5 | Native programmatic PDF rendering with CVSS charts |
| **Containerization** | Docker & Compose | Multi-Stage | 5-container topology with non-root security privileges |

---

## 4. Methodology & Implementation Lifecycle

The development was structured into four two-week engineering sprints aligned with the INSA Cyber Security Bootcamp curriculum:

```
 Sprint 1: Weeks 1–2           Sprint 2: Weeks 3–4           Sprint 3: Weeks 5–6           Sprint 4: Weeks 7–8
┌───────────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐
│ • Architecture Design │     │ • ZAP & Nuclei Pipe   │     │ • Next.js 16 UI       │     │ • Juice Shop Audits   │
│ • Docker Topology     │ ──► │ • CVSS v3.1 Engine    │ ──► │ • WebSocket Terminal  │ ──► │ • Pytest (131 Tests)  │
│ • Database & Alembic  │     │ • SSRF Security Gate  │     │ • ReportLab PDF Export│     │ • Hardening & Defense │
└───────────────────────┘     └───────────────────────┘     └───────────────────────┘     └───────────────────────┘
```

### Phase 1: Planning, Research & Environment Setup (Weeks 1–2)
* Evaluated scanning architectures and designed the asynchronous Celery/Redis worker pipeline.
* Configured local testing environments, multi-container Docker Compose definitions, and non-root execution policies.
* Architected normalized relational database schemas (`users`, `scans`, `vulnerabilities`, `settings`, `api_keys`, `login_history`) and initialized Alembic migration version control.

### Phase 2: Core Engine Development & Security Controls (Weeks 3–4)
* Integrated the **OWASP ZAP Daemon API** for automated crawling and parameter fuzzing.
* Integrated the **ProjectDiscovery Nuclei** binary for rapid vulnerability signature identification.
* Engineered custom high-concurrency directory fuzzing (153+ sensitive paths) and passive security header analyzers.
* Implemented the **3-Tier SSRF Protection Gate** to validate all scan target inputs before queuing.
* Built dynamic **CVSS v3.1 mathematical scoring** and mapped vulnerabilities to official **MITRE CWE** IDs.

### Phase 3: Dashboard Integration & Executive PDF Reporting (Weeks 5–6)
* Engineered the Next.js 16 frontend with deep navy/slate glassmorphic aesthetics, profile selectors, and responsive navigation.
* Implemented bi-directional **WebSocket telemetry** streaming live terminal logs, phase indicators, and percentage progress (0–100%) without page refreshing.
* Built the automated **ReportLab PDF generator** producing executive cover pages, risk distribution matrices, and developer remediation blueprints.
* Implemented user authentication with HS256 JWT tokens, bcrypt password hashing, timing-attack countermeasures, and SHA-256 hashed API keys.

### Phase 4: Testing, Refinement & Capstone Delivery (Weeks 7–8)
* Conducted comprehensive validation against live testbeds (**OWASP Juice Shop** and **Acunetix Vulnweb**).
* Built an automated test suite comprising **131 unit and integration tests** in `pytest` verifying all critical endpoints, security controls, and calculations.
* Cleaned and optimized repository hygiene, eliminated duplicate artifacts, and finalized technical defense documentation.

---

## 5. Detailed Vulnerability Detection & Remediation (INSA Mandatory)

EthioVuln rigorously detects and reports on all mandatory vulnerability classes specified in the INSA Bootcamp curriculum:

### 5.1 SQL Injection (SQLi) — CWE-89
* **Detection Engine:** OWASP ZAP (Active Scanner) & Smart Parameter Fuzzer
* **Detection Mechanism & Payloads:**
  * Injects active boolean and union payloads into query parameters and form fields:
    ```sql
    ' OR '1'='1
    ' UNION SELECT null, version()--
    1' ORDER BY 1--
    ```
  * Injects time-based blind SQL injection payloads:
    ```sql
    WAITFOR DELAY '0:0:5'
    '; SELECT pg_sleep(5);--
    ```
  * Inspects HTTP response bodies for database driver exceptions (PostgreSQL, MySQL, SQLite, MSSQL) or evaluates differential response timings.
* **CVSS v3.1 Severity Range:** 7.2 (High) – 10.0 (Critical)
* **Exact Developer Remediation:**
  * Always use parameterized queries (prepared statements) across all database adapters.
  * Utilize modern Object-Relational Mapping (ORM) frameworks like SQLAlchemy.
  * Enforce strict input validation using allowlists and reject raw SQL string concatenation.

### 5.2 Cross-Site Scripting (XSS) — CWE-79
* **Detection Engine:** OWASP ZAP & ProjectDiscovery Nuclei
* **Detection Mechanism & Payloads:**
  * Submits benign JavaScript payloads into user inputs, URL parameters, and headers:
    ```html
    "><script>alert('EthioVuln-XSS')</script>
    <img src=x onerror=alert(1)>
    javascript:alert(document.domain)
    ```
  * Analyzes HTTP responses to verify whether injected payloads are reflected unsanitized (Reflected XSS) or stored in database entities and rendered on subsequent requests (Stored XSS).
* **CVSS v3.1 Severity Range:** 5.4 (Medium) – 8.2 (High)
* **Exact Developer Remediation:**
  * Implement context-aware output encoding (HTML, JavaScript, CSS, and URL encoding).
  * Sanitize rich HTML user inputs using battle-tested libraries such as DOMPurify.
  * Deploy a strict Content Security Policy (`Content-Security-Policy: default-src 'self'`).

### 5.3 Cross-Site Request Forgery (CSRF) — CWE-352
* **Detection Engine:** OWASP ZAP (Passive & Active Spider)
* **Detection Mechanism & Payloads:**
  * Crawls HTML forms and identifies state-changing HTTP operations (POST, PUT, DELETE) lacking anti-CSRF token fields or headers.
  * Submits state-changing requests with omitted, malformed, or replay tokens to confirm server-side validation enforcement.
* **CVSS v3.1 Severity Range:** 4.3 (Medium) – 8.8 (High)
* **Exact Developer Remediation:**
  * Implement the Synchronizer Token Pattern (anti-CSRF tokens tied to user sessions).
  * Configure cookies with `SameSite=Lax` or `SameSite=Strict` and `Secure; HttpOnly` attributes.
  * Verify `Origin` and `Referer` headers on all incoming state-changing requests.

### 5.4 Missing Security Headers — CWE-1021 / CWE-693
* **Detection Engine:** Nuclei Engine & Custom Passive Header Analyzer
* **Detection Mechanism:** Passively inspects HTTP response headers for missing, weak, or misconfigured security directives.
* **CVSS v3.1 Severity Range:** 2.6 (Low) – 5.3 (Medium)
* **Exact Developer Remediation:**
  * **Content-Security-Policy (CSP):** `Content-Security-Policy: default-src 'self'; script-src 'self'`
  * **HTTP Strict Transport Security (HSTS):** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  * **X-Frame-Options (Clickjacking):** `X-Frame-Options: DENY` or `SAMEORIGIN`
  * **X-Content-Type-Options (MIME-Sniffing):** `X-Content-Type-Options: nosniff`
  * **Referrer-Policy:** `Referrer-Policy: strict-origin-when-cross-origin`

---

## 6. Advanced Security Hardening Features

### 6.1 3-Tier SSRF Protection Gate
To prevent EthioVuln from being weaponized by attackers to probe cloud provider metadata endpoints or internal private subnets, every target URL submitted to `POST /api/scans/` passes through a strict 3-tier safety gate before being dispatched to the Celery queue:

```
[Target URL Input]
       │
       ▼
[Tier 1: Scheme Gate] ───────── Reject if not http:// or https://
       │
       ▼
[Tier 2: DNS Resolution] ────── Resolve hostname to IPv4/IPv6 addresses
       │
       ▼
[Tier 3: CIDR Filter] ───────── Block reserved, loopback & private subnets:
                                • 10.0.0.0/8 (RFC 1918)
                                • 172.16.0.0/12 (RFC 1918)
                                • 192.168.0.0/16 (RFC 1918)
                                • 127.0.0.0/8 (Loopback / Localhost)
                                • 169.254.169.254 (Cloud Metadata Service)
                                • 0.0.0.0/8 (Current Network)
       │
       ▼
[Target Validated] ──────────── Enqueue to Celery Task Queue
```

### 6.2 Mathematical CVSS v3.1 Scoring Logic
Instead of arbitrary severity labels, EthioVuln dynamically computes CVSS v3.1 Base Scores using the official FIRST equation based on standard metrics:
* **Exploitability Sub-Score:** Attack Vector (AV), Attack Complexity (AC), Privileges Required (PR), User Interaction (UI).
* **Impact Sub-Score:** Confidentiality (C), Integrity (I), Availability (A) impact.
* **Vector String Generation:** Formats complete vectors (e.g., `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`) for standardized audit reporting.

### 6.3 Authentication & Session Security
* **Timing-Attack Countermeasure:** Performs dummy bcrypt password hash comparisons for non-existent users so that request latency does not leak account registration status.
* **Isolated Transaction Auditing:** Failed login attempts and account lockouts are committed in nested database sub-transactions to guarantee audit records persist even during 401 exceptions.
* **Scoped API Keys:** User-managed API keys are hashed with SHA-256 and restricted to a maximum of 5 active keys per account.

---

## 7. Security Evaluation & Scan Results

### Test Environment & Targets
The platform was thoroughly evaluated against two standard vulnerable environments:
1. **OWASP Juice Shop:** Modern single-page application (Node.js/Angular) containing complex business logic and injection flaws.
2. **Acunetix Vulnweb Testbed (`http://testphp.vulnweb.com`):** Classic multi-page PHP application containing classic injection points.

### Live Audit Findings Matrix

| Target Application | Vulnerability Identified | Severity (CVSS v3.1) | CWE Mapping | Detection Engine | Remediation Generated |
|:---|:---|:---|:---|:---|:---|
| **testphp.vulnweb.com** | SQL Injection (`artists.php?artist=1`) | **Critical (9.8)** | CWE-89 | OWASP ZAP / Fuzzer | Parameterized query sample |
| **testphp.vulnweb.com** | Reflected XSS (`search.php?test=`) | **High (7.5)** | CWE-79 | OWASP ZAP & Nuclei | Context-aware HTML encoding |
| **testphp.vulnweb.com** | Cross-Site Request Forgery | **Medium (5.4)** | CWE-352 | OWASP ZAP Spider | Anti-CSRF token verification |
| **Juice Shop / Localhost**| Missing Content Security Policy | **Medium (4.3)** | CWE-1021 | Passive Header Analyzer | Restrictive CSP template |
| **Juice Shop / Localhost**| Missing HSTS Header | **Low (3.1)** | CWE-693 | Nuclei Engine | HSTS max-age directive |
| **testphp.vulnweb.com** | Directory Traversal / Exposed File | **High (7.5)** | CWE-22 | Smart Content Fuzzer | File path access restriction |

### Audit Deliverables Output
Every assessment successfully produced:
* **Live Console Logs:** Real-time color-coded console logs streamed via WebSockets with progress tracking.
* **Interactive Web Table:** Sortable findings grid with severity badges, affected URLs, and vulnerability details.
* **Executive PDF Report:** Comprehensive multi-page PDF generated via ReportLab featuring executive summaries, CVSS score distribution bar charts, and code remediation steps.

---

## 8. Engineering Challenges & Architectural Solutions

| Challenge Encountered | Root Cause | Implemented Solution |
|:---|:---|:---|
| **1. Service Latency During Scans** | Running intensive DAST scans synchronously locked the HTTP server and blocked user requests. | Decoupled all audit routines into Celery background tasks with Redis pub/sub message brokers and WebSocket status updates. |
| **2. Scanner Weaponization (SSRF)** | Malicious users could input `http://169.254.169.254` to steal cloud credentials via the scanner. | Built a 3-tier SSRF validation gate that performs pre-scan scheme checks, DNS resolution, and private RFC 1918/link-local CIDR blocking. |
| **3. Subjective Vulnerability Severity** | Basic scanners assign arbitrary High/Medium labels without objective justification. | Built a CVSS v3.1 vector calculator deriving mathematically sound base scores mapped directly to MITRE CWE catalogs. |
| **4. Docker Port & Memory Contention** | Coordinating 5 containers (Postgres, Redis, ZAP, FastAPI, Next.js) created port collisions and ZAP memory spikes. | Mapped explicit host ports (`5433:5432`, `8080:8080`), configured isolated bridge networks, and tuned JVM memory arguments in `docker-compose.yml`. |
| **5. Dual-Audience Reporting Need** | C-level managers need visual risk summaries, while software developers need exact code-level fixes. | Designed a dual-section PDF generator with high-level executive charts on page one and code remediation blueprints in the technical appendix. |

---

## 9. Capstone Deliverables Checklist

All required capstone deliverables for Option A have been completed, verified, and packaged:

* [x] **Production Source Code:** Full-stack codebase hosted on GitHub with multi-container Docker orchestration.
* [x] **Technical Documentation:** Comprehensive architecture diagrams, setup instructions, and endpoint references in [`README.md`](file:///home/Melaku/Downloads/ethiovuln-main/README.md).
* [x] **Automated Test Suite:** 131/131 passing `pytest` unit and integration tests verifying security controls and calculation algorithms.
* [x] **Business Plan:** Commercialization strategy, market analysis, and SaaS freemium monetization model in [`BUSINESS_PLAN.md`](file:///home/Melaku/Downloads/ethiovuln-main/BUSINESS_PLAN.md).
* [x] **Presentation Deck:** Executive slide deck outline for final capstone defense in [`PRESENTATION_SLIDES.md`](file:///home/Melaku/Downloads/ethiovuln-main/PRESENTATION_SLIDES.md).
* [x] **Working Product Demo:** Functional UI with live target scanning, WebSocket terminal telemetry, and ReportLab PDF compilation.

---

## 10. Conclusion & Future Roadmap

The **EthioVuln** capstone project successfully fulfilled all evaluation requirements outlined in Option A of the INSA Cyber Security Bootcamp curriculum. The platform demonstrates that enterprise-grade DAST capabilities can be made accessible, automated, and cost-effective for regional development teams without sacrificing technical rigor.

### Future Roadmap
1. **Automated Recurring Scans:** Cron-based continuous security monitoring and change detection.
2. **Alerting Channels:** Native incident notifications via Telegram bots, Discord webhooks, and email.
3. **AI-Assisted False-Positive Pruning:** LLM-assisted verification of findings and automated code pull request generation.
4. **CI/CD Integration:** Official GitHub Actions and GitLab CI integrations for automated security gating in deployment pipelines.
