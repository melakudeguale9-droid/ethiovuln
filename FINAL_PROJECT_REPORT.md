# <div align="center" style="background: linear-gradient(135deg, #0B1120 0%, #0F172A 50%, #1E293B 100%); border: 2px solid #0284C7; border-radius: 12px; padding: 28px 20px; margin-bottom: 24px; box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.25);"><h1 style="color: #F8FAFC; margin: 0; font-size: 2.1em; letter-spacing: 0.5px;">ETHIOVULN: AN AUTOMATED WEB APPLICATION VULNERABILITY SCANNER</h1><p style="color: #38BDF8; margin: 10px 0 0 0; font-size: 1.15em; font-weight: 600;">Comprehensive Final Capstone Project Report & Academic Defense Thesis</p><div style="margin-top: 14px;"><span style="background-color: #0284C7; color: #FFFFFF; padding: 4px 10px; border-radius: 20px; font-size: 0.82em; font-weight: bold; margin-right: 6px;">INSA Cyber Security Bootcamp</span><span style="background-color: #10B981; color: #FFFFFF; padding: 4px 10px; border-radius: 20px; font-size: 0.82em; font-weight: bold; margin-right: 6px;">219 Automated Tests Passing</span><span style="background-color: #6366F1; color: #FFFFFF; padding: 4px 10px; border-radius: 20px; font-size: 0.82em; font-weight: bold;">Production Grade v1.0.0</span></div></div>

---

### <span style="color: #0284C7;">📋 Academic Project Metadata</span>

<div style="background-color: #F8FAFC; border: 1.5px solid #0284C7; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">

| Specification Attribute | Candidate & Academic Details |
|:---|:---|
| **Project Title** | <span style="color: #0F172A; font-weight: bold;">EthioVuln — Automated Web Application Vulnerability Scanner & Management Platform</span> |
| **Author / Candidate** | <span style="color: #0369A1; font-weight: bold;">Melaku Deguale Abi</span> |
| **Student ID** | <span style="background-color: #E0F2FE; color: #0284C7; padding: 3px 10px; border-radius: 6px; font-weight: bold; border: 1px solid #BAE6FD;">CTC-5584-26</span> |
| **Submission Track / Group** | <span style="background-color: #F1F5F9; color: #334155; padding: 3px 10px; border-radius: 6px; font-weight: 600;">Individual (Option A: Web Application Security Products)</span> |
| **Institution** | <span style="color: #0F172A; font-weight: bold;">Information Network Security Administration (INSA) Cyber Security Bootcamp</span> |
| **Academic Department** | Department of Cyber Defense & Practical Security Research |
| **Evaluators** | Bootcamp Technical Mentors & Examination Defense Committee |
| **System Verification** | <span style="background-color: #DCFCE7; color: #15803D; padding: 3px 10px; border-radius: 6px; font-weight: bold; border: 1px solid #86EFAC;">✓ 219 Passing Automated Tests (202 Pytest, 13 Vitest, 4 Playwright)</span> |
| **Portal Constraints** | <span style="background-color: #FEF3C7; color: #92400E; padding: 3px 10px; border-radius: 6px; font-weight: bold; border: 1px solid #FDE68A;">File Size Target: 4.8MB – 5.0MB (Calibrated 4.90 MB)</span> |
| **Source Repository** | [GitHub: melakudeguale9-droid/ethiovuln](https://github.com/melakudeguale9-droid/ethiovuln) |
| **Defense Date** | October 2026 |

</div>

---

## <span style="color: #0284C7; border-bottom: 2.5px solid #0284C7; padding-bottom: 4px; display: inline-block;">🛡️ 1. Abstract</span>

Web application vulnerabilities represent the foremost vector for unauthorized data exfiltration, system compromise, and denial-of-service across modern cloud architectures. While automated Dynamic Application Security Testing (DAST) is foundational to DevSecOps, commercial enterprise solutions impose prohibitive recurring licensing fees (<span style="background-color: #FEE2E2; color: #991B1B; padding: 2px 7px; border-radius: 4px; font-weight: bold; border: 1px solid #FCA5A5;">$3,000–$15,000+/year USD</span>) that alienate regional startups, software development agencies, and educational institutions in emerging economies. Conversely, disjointed open-source command-line tools require fragmented orchestration, lack real-time visual progress monitoring, offer no centralized concurrency management, and fail to generate executive-ready compliance documentation.

This capstone project presents **EthioVuln**, an end-to-end, automated web application vulnerability scanning and management platform. EthioVuln synthesizes the active spidering and injection fuzzing capabilities of the **OWASP Zed Attack Proxy (ZAP)** with the high-throughput YAML signature-matching engine of **ProjectDiscovery Nuclei** into a horizontally scalable, containerized architecture. Built using a modern **Next.js 16/15** and **Tailwind CSS** frontend paired with a high-performance **FastAPI (Python 3.11)** asynchronous backend, the platform offloads intensive security audits to distributed **Celery** workers coordinated via **Redis** message brokers and backed by **PostgreSQL 16**.

<div style="background-color: #F0F9FF; border-left: 5px solid #0284C7; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.08);">
<h4 style="color: #0369A1; margin-top: 0; margin-bottom: 10px; font-size: 1.05em;">💡 Core Technological Innovations</h4>

1. <span style="color: #0284C7; font-weight: bold;">Bi-Directional WebSocket Telemetry:</span> Streams sub-second console terminal logs, stage progression indicators, and dynamic finding discoveries directly to an interactive browser operations console.
2. <span style="color: #0284C7; font-weight: bold;">Standardized CVSS v3.1 Scoring & MITRE CWE Mapping:</span> Automatically derives mathematical risk base scores and links vulnerabilities to industry-standard taxonomies.
3. <span style="color: #0284C7; font-weight: bold;">3-Tier SSRF Protection Gate:</span> Enforces scheme validation, DNS resolution, and private/link-local CIDR filtering to prevent scanner weaponization.
4. <span style="color: #0284C7; font-weight: bold;">Automated Executive & Developer PDF Reporting:</span> Compiles multi-page, publication-grade vulnerability audit reports with visual CVSS distribution charts and code-level remediation blueprints via Python ReportLab.
5. <span style="color: #0284C7; font-weight: bold;">Generative AI Remediation Copilot:</span> Integrates Google Gemini LLM API to generate context-aware root cause analysis and immediate framework patch recommendations.

</div>

Empirical evaluation against standard vulnerable testbeds (<span style="color: #0284C7; font-weight: bold;">OWASP Juice Shop</span> and <span style="color: #0284C7; font-weight: bold;">Acunetix Vulnweb</span>) demonstrated high audit throughput, zero worker starvation, reliable telemetry, and <span style="background-color: #DCFCE7; color: #15803D; padding: 2px 8px; border-radius: 4px; font-weight: bold;">100% detection accuracy</span> for mandatory vulnerability classes—specifically SQL Injection (CWE-89), Cross-Site Scripting (CWE-79), Cross-Site Request Forgery (CWE-352), and Missing Security Headers (CWE-1021/693). The system is verified by a test suite of <span style="background-color: #DCFCE7; color: #15803D; padding: 2px 8px; border-radius: 4px; font-weight: bold;">219 passing tests</span> (202 Pytest backend tests, 13 Vitest frontend tests, and 4 Playwright E2E browser tests).

---

## <span style="color: #0284C7; border-bottom: 2.5px solid #0284C7; padding-bottom: 4px; display: inline-block;">🎯 2. Introduction & Problem Statement</span>

### <span style="color: #0369A1;">2.1 Background & Context</span>
The rapid acceleration of software delivery pipelines has made web applications the dominant interface for electronic commerce, financial technology, and government services. However, rapid release cycles often outpace manual security assessments. Attackers continuously exploit vulnerabilities cataloged in the OWASP Top 10 to compromise database layers, hijack authenticated user sessions, and pivot into internal enterprise perimeters.

Dynamic Application Security Testing (DAST) assesses web applications from an external perspective without requiring access to source code. By analyzing HTTP request-response patterns, fuzzing input parameters, and probing API endpoints, DAST simulates real-world adversaries to detect exploitable flaws prior to production deployment.

### <span style="color: #0369A1;">2.2 Problem Statement</span>
Organizations and software engineering teams operating in emerging digital economies confront severe operational challenges when adopting dynamic security auditing:

<div style="background-color: #FFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px 18px; margin: 16px 0;">

* <span style="background-color: #FEE2E2; color: #991B1B; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #FCA5A5;">PROHIBITIVE LICENSING COSTS</span> <b style="color: #0F172A;">Commercial Enterprise Paywalls:</b> Industry-standard commercial scanners (e.g., Burp Suite Enterprise, Acunetix, Qualys, Rapid7) require recurring foreign currency subscriptions exceeding thousands of dollars annually. For regional startups, small-to-medium enterprises (SMEs), and academic labs, these costs present an insurmountable barrier to continuous security testing.
* <span style="background-color: #FFEDD5; color: #C2410C; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #FDBA74;">OPERATIONAL DISCONNECT</span> <b style="color: #0F172A;">Fragmented Open-Source CLI Tools:</b> High-quality open-source security utilities exist—most notably OWASP ZAP and ProjectDiscovery Nuclei. However, operating these tools in isolation requires intricate shell scripting, lacks persistent multi-user scan history, provides no unified vulnerability deduplication, and cannot stream live execution telemetry to non-security stakeholders.
* <span style="background-color: #FEF3C7; color: #B45309; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #FCD34D;">SECURITY EXPOSURE</span> <b style="color: #0F172A;">Scanner Weaponization & SSRF Vulnerabilities:</b> Traditional web scanners allow arbitrary URL inputs. If exposed within internal networks or cloud environments without rigorous validation, malicious actors can exploit the scanner as a proxy to execute Server-Side Request Forgery (SSRF) attacks against cloud metadata endpoints (`http://169.254.169.254/`) or private RFC 1918 subnets.
* <span style="background-color: #DBEAFE; color: #1D4ED8; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #93C5FD;">SUBJECTIVE METRICS</span> <b style="color: #0F172A;">Unstandardized Severity Scoring:</b> Many lightweight scanning scripts assign arbitrary "High", "Medium", or "Low" labels to findings without objective mathematical backing, creating ambiguity for development teams prioritizing bug fixes.
* <span style="background-color: #F3E8FF; color: #6D28D9; padding: 2px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #D8B4FE;">THE REPORTING DIVIDE</span> <b style="color: #0F172A;">Non-Actionable Raw Outputs:</b> Executive decision-makers require aggregated risk metrics and compliance postures, while software engineers require exact HTTP evidence, CVSS vectors, and framework-specific code patches. Standard CLI tools output unstructured text or raw JSON files that fail both audiences.

</div>

### <span style="color: #0369A1;">2.3 Project Objectives</span>
The primary goal of the **EthioVuln** project is to design, implement, and validate an automated, open-source-driven web application vulnerability scanning and management platform. Specific technical objectives include:

<div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 14px 18px; margin: 16px 0;">

1. <span style="color: #0284C7; font-weight: bold;">[OBJ-01] Engine Orchestration:</span> Integrate OWASP ZAP (spidering and injection fuzzing) and Nuclei (8,000+ CVE template matches) into an automated asynchronous execution pipeline.
2. <span style="color: #0284C7; font-weight: bold;">[OBJ-02] Responsive User Interface:</span> Engineer an intuitive Next.js web operations console featuring glassmorphic cyber aesthetics, real-time telemetry, and scan configuration profiles.
3. <span style="color: #0284C7; font-weight: bold;">[OBJ-03] Decoupled Asynchronous Processing:</span> Implement a Celery and Redis worker topology to decouple intensive scans from the web API, preventing HTTP gateway timeouts and worker starvation.
4. <span style="color: #0284C7; font-weight: bold;">[OBJ-04] Active Defense Gateways:</span> Implement a 3-tier SSRF validation gate to inspect target URLs before queuing.
5. <span style="color: #0284C7; font-weight: bold;">[OBJ-05] Deterministic Risk Scoring:</span> Integrate the FIRST CVSS v3.1 mathematical scoring algorithm mapped directly to MITRE CWE catalogs.
6. <span style="color: #0284C7; font-weight: bold;">[OBJ-06] Executive PDF Compilation:</span> Build an automated ReportLab report generator producing publication-ready PDF documents featuring severity breakdown matrices and actionable developer remediation blueprints.
7. <span style="color: #0284C7; font-weight: bold;">[OBJ-07] Conversational AI Copilot:</span> Integrate the Google Gemini LLM API to provide real-time vulnerability root-cause analysis and automated code mitigation patch generation.

</div>

---

## <span style="color: #0284C7; border-bottom: 2.5px solid #0284C7; padding-bottom: 4px; display: inline-block;">🏗️ 3. System Architecture & Methodology</span>

### <span style="color: #0369A1;">3.1 Architectural Overview</span>
EthioVuln is engineered according to a decoupled, multi-tier microservices architecture orchestrated via Docker Compose. The platform isolates long-running, resource-intensive security scans into dedicated background worker containers, preserving sub-second responsiveness for the REST API and user interface.

<div style="background-color: #0B1120; border: 2px solid #1E293B; border-radius: 10px; padding: 16px; margin: 20px 0; box-shadow: 0 8px 16px rgba(0,0,0,0.4);">
<div style="padding-bottom: 10px; border-bottom: 1px solid #1E293B; margin-bottom: 12px; font-family: monospace; font-size: 0.85em;">
  <span style="color: #EF4444; font-size: 1.2em;">●</span>
  <span style="color: #F59E0B; font-size: 1.2em;">●</span>
  <span style="color: #10B981; font-size: 1.2em;">●</span>
  <span style="color: #38BDF8; margin-left: 10px; font-weight: bold;">ETHIOVULN // DISTRIBUTED MICROSERVICES ARCHITECTURE TOPOLOGY</span>
</div>

```
+------------------------------------------------------------------------+
|                   Next.js Web Dashboard (Port 3000)                    |
|             (React 19 / TypeScript / Tailwind CSS / WebSockets)        |
+-----------------------------------+------------------------------------+
                                    |
                     REST API       |   WebSocket Telemetry
                     (/api/*)       |   (/api/ws/scans/{id})
                                    v
+------------------------------------------------------------------------+
|                      FastAPI Core REST Engine                          |
|               (Python 3.11 / Pydantic v2 / Port 8000)                  |
+---------------------------+--------------------------------+-----------+
                            |                                |
   Asyncpg / SQLAlchemy     |                      Redis Pub/Sub &
   Relational ORM           |                      Celery Message Broker
                            v                                v
+------------------------+                      +------------------------+
|  PostgreSQL Database   |                      |      Redis Server      |
|      (Port 5433)       |                      |      (Port 6379)       |
+------------------------+                      +------------+-----------+
                                                             |
                                                             v
                                                +------------------------+
                                                |   Celery Scan Worker   |
                                                +------------+-----------+
                                                             |
                       +-------------------------------------+-----------------------------------+
                       v                                     v                                   v
            +---------------------+               +---------------------+             +---------------------+
            |    Nuclei Engine    |               |      OWASP ZAP      |             |    Smart Fuzzer     |
            | (8,000+ Templates)  |               |     (Port 8080)     |             |  (Dirs & Headers)   |
            +---------------------+               +---------------------+             +---------------------+
```

</div>

### <span style="color: #0369A1;">3.2 Technology Stack Matrix</span>

<div style="margin: 18px 0; overflow-x: auto;">

| Architectural Layer | Technology Selected | Version | Functional Responsibility |
|:---|:---|:---:|:---|
| **Frontend Framework** | <span style="background-color: #000000; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">Next.js (App Router)</span> | `16 / 15` | Server-rendered UI shell, client routes, responsive data grids |
| **Frontend Library** | <span style="background-color: #0284C7; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">React & TypeScript</span> | `19.0.0 / 5.x` | Reactive UI components, strict compile-time type validation |
| **Styling Engine** | <span style="background-color: #06B6D4; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">Tailwind CSS</span> | `3.4.1` | Glassmorphic design tokens, cyber status badges, fluid layouts |
| **Backend REST API** | <span style="background-color: #059669; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">FastAPI (Python)</span> | `0.115.0` | High-concurrency async endpoints, OpenAPI auto-documentation |
| **ASGI Web Server** | <span style="background-color: #4B5563; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">Uvicorn / Asyncio</span> | `0.30.0` | High-performance asynchronous HTTP & WebSocket event loops |
| **Task Queue & Broker** | <span style="background-color: #DC2626; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">Celery + Redis</span> | `5.4.0 / 7.2` | Asynchronous job queuing, worker isolation, Pub/Sub telemetry |
| **Database & ORM** | <span style="background-color: #2563EB; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">PostgreSQL + SQLAlchemy</span> | `16 / 2.0.52` | ACID relational storage, asyncpg driver, Alembic migrations |
| **Active DAST Scanner** | <span style="background-color: #0369A1; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">OWASP ZAP Daemon</span> | `2.14+` | Traditional/AJAX web spidering, parameter injection fuzzing |
| **Template Scanner** | <span style="background-color: #4F46E5; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">ProjectDiscovery Nuclei</span> | `v3.2.0` | YAML template matching across 8,000+ known CVEs & exposures |
| **PDF Report Compiler** | <span style="background-color: #D97706; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">Python ReportLab</span> | `4.2.5 / 5.1` | Native multi-page PDF generation with CVSS risk charts |
| **AI Threat Copilot** | <span style="background-color: #7C3AED; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">Google GenAI (Gemini)</span> | `1.x` | AI-powered root-cause analysis & code remediation patches |
| **Containerization** | <span style="background-color: #0284C7; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">Docker & Compose</span> | `Multi-Stage` | 6-container topology with non-root security privileges |
| **Operating Environment**| <span style="background-color: #374151; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.88em;">Kali Linux / Ubuntu</span> | `Rolling / LTS` | Security runtime, network tools, and evaluation environment |

</div>

### <span style="color: #0369A1;">3.3 Security & Risk Scoring Methodology</span>

#### <span style="color: #0284C7;">3.3.1 Mathematical CVSS v3.1 Scoring Algorithm</span>
To prevent arbitrary severity inflation, EthioVuln implements the official FIRST Common Vulnerability Scoring System (CVSS v3.1) base metric equation:

<div style="background-color: #F8FAFC; border: 2px solid #0284C7; border-radius: 8px; padding: 18px 24px; margin: 18px 0; box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.1);">

<p style="font-size: 1.15em; font-weight: bold; color: #0F172A; margin-top: 0;">
  <span style="color: #0284C7;">Formula:</span> BaseScore = RoundUp( min(Impact + Exploitability, 10.0) )
</p>

* **Exploitability Sub-Score:**
  $$\text{Exploitability} = 8.22 \times \text{AV} \times \text{AC} \times \text{PR} \times \text{UI}$$
  * <span style="background-color: #E0F2FE; color: #0369A1; padding: 2px 6px; border-radius: 4px; font-weight: bold;">AV (Attack Vector):</span> Network (0.85), Adjacent (0.62), Local (0.55), Physical (0.20)
  * <span style="background-color: #E0E7FF; color: #4338CA; padding: 2px 6px; border-radius: 4px; font-weight: bold;">AC (Attack Complexity):</span> Low (0.77), High (0.44)
  * <span style="background-color: #F3E8FF; color: #6D28D9; padding: 2px 6px; border-radius: 4px; font-weight: bold;">PR (Privileges Required):</span> None (0.85), Low (0.62), High (0.27)
  * <span style="background-color: #FCE7F3; color: #BE185D; padding: 2px 6px; border-radius: 4px; font-weight: bold;">UI (User Interaction):</span> None (0.85), Required (0.62)

* **Impact Sub-Score:**
  $$\text{Impact} = 1 - [ (1 - \text{C}) \times (1 - \text{I}) \times (1 - \text{A}) ]$$
  * <span style="background-color: #DCFCE7; color: #15803D; padding: 2px 6px; border-radius: 4px; font-weight: bold;">C (Confidentiality Impact):</span> High (0.56), Low (0.22), None (0.00)
  * <span style="background-color: #DCFCE7; color: #15803D; padding: 2px 6px; border-radius: 4px; font-weight: bold;">I (Integrity Impact):</span> High (0.56), Low (0.22), None (0.00)
  * <span style="background-color: #DCFCE7; color: #15803D; padding: 2px 6px; border-radius: 4px; font-weight: bold;">A (Availability Impact):</span> High (0.56), Low (0.22), None (0.00)

</div>

Every detected finding receives a standardized vector string (e.g., `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`) and is mapped to its official MITRE Common Weakness Enumeration (CWE) identifier.

#### <span style="color: #0284C7;">3.3.2 3-Tier SSRF Protection Gate</span>
To safeguard the scanner from being weaponized against internal cloud infrastructure, all target URLs submitted to `POST /api/scans/` pass through a three-stage validation pipeline:

<div style="background-color: #0B1120; border: 2px solid #1E293B; border-radius: 10px; padding: 16px; margin: 18px 0; color: #38BDF8;">

```
[Target URL Input]
       │
       ▼
[Tier 1: Protocol Scheme Gate] ──► Reject if protocol is not http:// or https://
       │
       ▼
[Tier 2: DNS Resolution Gate] ───► Resolve hostname to IPv4/IPv6 socket addresses
       │
       ▼
[Tier 3: CIDR Subnet Filter] ────► Discard RFC 1918, loopback, and cloud metadata IPs:
                                   • 10.0.0.0/8 (Private Network)
                                   • 172.16.0.0/12 (Private Network)
                                   • 192.168.0.0/16 (Private Network)
                                   • 127.0.0.0/8 (Localhost Loopback)
                                   • 169.254.169.254 (Cloud Instance Metadata Service)
                                   • 0.0.0.0/8 (Current Network)
       │
       ▼
[Target Validated] ──────────────► Enqueue Job into Celery Task Broker
```

</div>

---

## <span style="color: #0284C7; border-bottom: 2.5px solid #0284C7; padding-bottom: 4px; display: inline-block;">⚙️ 4. Implementation (Frontend, Backend, and Scanner Integration)</span>

### <span style="color: #0369A1;">4.1 Frontend Implementation (Next.js & Tailwind CSS)</span>
The EthioVuln user interface is implemented using the **Next.js App Router** with React 19, TypeScript, and Tailwind CSS. The design embraces a sleek glassmorphic cyber security aesthetic featuring high-contrast typography, responsive status badges, and real-time data visualizers.

<div align="center" style="margin: 22px 0;">
  <img src="assets/report_images/01_landing_hero.png" alt="Figure 1: EthioVuln Modern Landing Interface & Scan Vector Selector" style="border: 2px solid #0284C7; border-radius: 8px; max-width: 100%; box-shadow: 0 8px 16px rgba(0,0,0,0.15);" />
  <p style="color: #0369A1; font-size: 0.9em; font-weight: bold; margin-top: 8px;">📷 Figure 1: EthioVuln Modern Landing Interface & Scan Vector Selector (Light / Deep / CLI Modes)</p>
</div>

#### Real-Time Security Operations Dashboard
The frontend operations console utilizes the custom `useScanTelemetry` hook to merge REST status polling with live WebSocket streaming from `ws://localhost:8000/api/ws/scans/{id}`. As Celery workers publish finding events to Redis channels, the browser displays real-time execution logs and dynamically populates the vulnerability findings accordion without requiring page refreshes.

<div align="center" style="margin: 22px 0;">
  <img src="assets/report_images/02_dashboard_telemetry.png" alt="Figure 2: Real-Time Security Operations Dashboard" style="border: 2px solid #0284C7; border-radius: 8px; max-width: 100%; box-shadow: 0 8px 16px rgba(0,0,0,0.15);" />
  <p style="color: #0369A1; font-size: 0.9em; font-weight: bold; margin-top: 8px;">📷 Figure 2: Real-Time Security Operations Dashboard with Telemetry Velocity Spline & Severity Breakdown Donut</p>
</div>

#### Scan History & Pre-Flight Verification
The historical audit catalog tracks all completed and active assessments, aggregating discovered vulnerability counts by severity tiers and providing instant access to live replays and compliance reports.

<div align="center" style="margin: 22px 0;">
  <img src="assets/report_images/03_scan_history.png" alt="Figure 3: Historical Audit Catalog" style="border: 2px solid #0284C7; border-radius: 8px; max-width: 100%; box-shadow: 0 8px 16px rgba(0,0,0,0.15);" />
  <p style="color: #0369A1; font-size: 0.9em; font-weight: bold; margin-top: 8px;">📷 Figure 3: Historical Audit Catalog with Automated Severity Aggregations & Status Tracking</p>
</div>

<div align="center" style="margin: 22px 0;">
  <img src="assets/report_images/04_new_scan_ssrf_gate.png" alt="Figure 4: Scan Configuration Modal with SSRF Gate" style="border: 2px solid #0284C7; border-radius: 8px; max-width: 100%; box-shadow: 0 8px 16px rgba(0,0,0,0.15);" />
  <p style="color: #0369A1; font-size: 0.9em; font-weight: bold; margin-top: 8px;">📷 Figure 4: Scan Configuration Modal with 3-Tier SSRF Protection Gate Guardrails</p>
</div>

### <span style="color: #0369A1;">4.2 Backend Implementation (FastAPI & PostgreSQL)</span>
The core REST API is powered by FastAPI running on Python 3.11 with asynchronous event loops managed by Uvicorn. Data access is structured through SQLAlchemy 2.0 using the `asyncpg` driver for non-blocking PostgreSQL operations.

<div style="background-color: #F8FAFC; border-left: 4px solid #0284C7; padding: 12px 18px; margin: 16px 0;">

* <b style="color: #0F172A;">Normalized Relational Models:</b> Comprehensive schemas defining `users`, `scans`, `vulnerabilities`, `user_preferences`, `api_keys`, and `login_history`.
* <b style="color: #0F172A;">Database Migrations:</b> Version-controlled database schema management using Alembic.
* <b style="color: #0F172A;">Authentication & Cryptography:</b> Secure JSON Web Tokens (HS256 JWT) with auto-refresh cycles, bcrypt password hashing, and dummy hash timing-attack countermeasures.
* <b style="color: #0F172A;">Resilient Error Sanitization:</b> Structured JSON logging via `structlog` with automated exception masking and context injection.
* <b style="color: #0F172A;">Deep System Health Endpoint (`/api/health`):</b> Verifies PostgreSQL read/write latency, Redis connectivity, Celery worker responsiveness, and ZAP daemon availability.

</div>

### <span style="color: #0369A1;">4.3 Scanner Integration & Celery Worker Pipeline</span>
Security audits are executed by Celery worker processes listening to the Redis message queue. The execution workflow coordinates three complementary assessment engines:

<div style="background-color: #0B1120; border: 2px solid #1E293B; border-radius: 10px; padding: 16px; margin: 18px 0; color: #38BDF8;">

```
[Celery Scan Task Initiated]
             │
             ├───────────────────────────┐
             ▼                           ▼
    [Nuclei YAML Engine]        [OWASP ZAP Daemon]
    • 8,000+ CVE Signatures     • Traditional Web Spider
    • Misconfiguration Probes   • AJAX Crawling Engine
    • Passive Header Analyzers  • Active Parameter Fuzzing
             │                           │
             └─────────────┬─────────────┘
                           ▼
               [Smart Parameter Fuzzer]
               • SQLi Error & Blind Probes
               • XSS Reflection Probes
               • Sensitive Path Traversal
                           ▼
             [Vulnerability Aggregation]
             • Deduplication by URL & Hash
             • CVSS v3.1 Score Calculation
             • MITRE CWE Catalog Matching
                           ▼
             [Database Persistence & Pub/Sub]
             • Async PostgreSQL Insert
             • WebSocket Broadcast Event
```

</div>

1. **OWASP ZAP Client Integration:** Communicates with the ZAP daemon on port 8080 via the REST API client (`zaproxy`). Initiates traditional spidering, performs AJAX crawling for single-page applications, and executes active injection scans on discovered URL parameters.
2. **ProjectDiscovery Nuclei Integration:** Invokes the standalone Nuclei binary with targeted template profiles, parsing newline-delimited JSON (NDJSON) output in real time.
3. **Smart Parameter Fuzzer & Header Analyzer:** A lightweight Python fuzzing engine that injects targeted payloads into query parameters and form fields while passively inspecting response headers for security omissions.

---

## <span style="color: #0284C7; border-bottom: 2.5px solid #0284C7; padding-bottom: 4px; display: inline-block;">📊 5. Results (WebSockets Live Logging & PDF Reporting)</span>

### <span style="color: #0369A1;">5.1 Real-Time WebSocket Telemetry & Live Logging</span>
EthioVuln delivers sub-second visibility into scan progression through an event-driven WebSocket pipeline (`/api/ws/scans/{id}`). As workers execute scan phases, telemetry messages are published to Redis channels and broadcast directly to connected browser clients:

<div style="background-color: #0B1120; border: 1.5px solid #1E293B; border-radius: 8px; padding: 14px; margin: 14px 0;">

```json
{
  "type": "log",
  "stage": "vulnerability_scanning",
  "level": "INFO",
  "message": "[ZAP] Active scanning endpoint: https://target.domain/api/v1/login",
  "progress": 65,
  "timestamp": "2026-10-25T10:15:30Z"
}
```

</div>

When a vulnerability is identified, a `vulnerability_found` event triggers immediate UI updates, incrementing severity counters and appending the finding to the live accordion without requiring manual page refreshes.

### <span style="color: #0369A1;">5.2 Executive PDF Report Generation</span>
EthioVuln features an automated PDF compiler built with Python ReportLab (`pdf_generator.py`). The compiler formats scan telemetry into an audit-ready executive document containing:
* **Branded Cover & Metadata Grid:** Displays target domain, scan profile, completion timestamp, and overall security posture.
* **Executive Severity Matrix & Distribution Chart:** Tabulates findings across Critical, High, Medium, Low, and Informational tiers with visual risk bars.
* **Vulnerability Catalog Overview:** Numbered table linking titles, severity badges, CVSS scores, and detection sources, with repeating table headers across page breaks.
* **Technical Remediation Blueprints:** Individual technical cards detailing affected endpoints, MITRE CWE IDs, complete CVSS v3.1 vector strings, sanitized raw evidence payloads, and code-level remediation steps.

<div align="center" style="margin: 22px 0;">
  <img src="assets/report_images/05_pdf_executive_summary.png" alt="Figure 5: Executive Security Assessment PDF Summary" style="border: 2px solid #0284C7; border-radius: 8px; max-width: 100%; box-shadow: 0 8px 16px rgba(0,0,0,0.15);" />
  <p style="color: #0369A1; font-size: 0.9em; font-weight: bold; margin-top: 8px;">📷 Figure 5: Executive Security Assessment PDF Summary & CVSS Metric Posture Overview</p>
</div>

<div align="center" style="margin: 22px 0;">
  <img src="assets/report_images/06_pdf_vulnerability_catalog.png" alt="Figure 6: Discovered Vulnerabilities Multi-Page Audit Catalog" style="border: 2px solid #0284C7; border-radius: 8px; max-width: 100%; box-shadow: 0 8px 16px rgba(0,0,0,0.15);" />
  <p style="color: #0369A1; font-size: 0.9em; font-weight: bold; margin-top: 8px;">📷 Figure 6: Discovered Vulnerabilities Multi-Page Audit Catalog with Severity Tagging</p>
</div>

<div align="center" style="margin: 22px 0;">
  <img src="assets/report_images/07_finding_detail_xss.png" alt="Figure 7: Deep Vulnerability Definition for XSS" style="border: 2px solid #0284C7; border-radius: 8px; max-width: 100%; box-shadow: 0 8px 16px rgba(0,0,0,0.15);" />
  <p style="color: #0369A1; font-size: 0.9em; font-weight: bold; margin-top: 8px;">📷 Figure 7: Deep Vulnerability Definition & CVSS v3.1 Vector Breakdown for Cross-Site Scripting (CWE-79)</p>
</div>

<div align="center" style="margin: 22px 0;">
  <img src="assets/report_images/08_remediation_blueprint.png" alt="Figure 8: Proof-of-Concept Raw Payload Evidence" style="border: 2px solid #0284C7; border-radius: 8px; max-width: 100%; box-shadow: 0 8px 16px rgba(0,0,0,0.15);" />
  <p style="color: #0369A1; font-size: 0.9em; font-weight: bold; margin-top: 8px;">📷 Figure 8: Proof-of-Concept Raw Payload Evidence and Developer Remediation Blueprints</p>
</div>

### <span style="color: #0369A1;">5.3 Testbed Evaluation & Findings Matrix</span>
EthioVuln was rigorously tested against industry-standard vulnerable environments: **OWASP Juice Shop** (Node.js/Angular) and **Acunetix Vulnweb** (`http://testphp.vulnweb.com/`).

<div style="margin: 18px 0; overflow-x: auto;">

| Target Application | Vulnerability Identified | Severity & CVSS | CWE Classification | Detection Engine | Validated Remediation |
|:---|:---|:---:|:---:|:---|:---|
| `testphp.vulnweb.com` | **SQL Injection** (`artists.php?artist=1`) | <span style="background-color: #FEE2E2; color: #991B1B; padding: 3px 8px; border-radius: 5px; font-weight: bold; border: 1.5px solid #F87171;">CRITICAL (9.8)</span> | <span style="background-color: #F1F5F9; color: #334155; padding: 2px 6px; border-radius: 4px; font-weight: 600;">CWE-89</span> | ZAP & Smart Fuzzer | Parameterized queries & ORM mapping |
| `testphp.vulnweb.com` | **Reflected XSS** (`search.php?test=`) | <span style="background-color: #FFEDD5; color: #C2410C; padding: 3px 8px; border-radius: 5px; font-weight: bold; border: 1.5px solid #FB923C;">HIGH (8.2)</span> | <span style="background-color: #F1F5F9; color: #334155; padding: 2px 6px; border-radius: 4px; font-weight: 600;">CWE-79</span> | ZAP & Nuclei | Context-aware HTML entity encoding |
| `testphp.vulnweb.com` | **Cross-Site Request Forgery (CSRF)** | <span style="background-color: #FEF3C7; color: #B45309; padding: 3px 8px; border-radius: 5px; font-weight: bold; border: 1.5px solid #FBBF24;">MEDIUM (5.4)</span> | <span style="background-color: #F1F5F9; color: #334155; padding: 2px 6px; border-radius: 4px; font-weight: 600;">CWE-352</span> | ZAP Active Spider | Anti-CSRF tokens & SameSite cookies |
| `Localhost / Juice Shop`| **Missing Content Security Policy** | <span style="background-color: #FEF3C7; color: #B45309; padding: 3px 8px; border-radius: 5px; font-weight: bold; border: 1.5px solid #FBBF24;">MEDIUM (4.3)</span> | <span style="background-color: #F1F5F9; color: #334155; padding: 2px 6px; border-radius: 4px; font-weight: 600;">CWE-1021</span> | Passive Analyzer | Strict `Content-Security-Policy` header |
| `Localhost / Juice Shop`| **Missing HSTS Header** | <span style="background-color: #DCFCE7; color: #15803D; padding: 3px 8px; border-radius: 5px; font-weight: bold; border: 1.5px solid #4ADE80;">LOW (3.1)</span> | <span style="background-color: #F1F5F9; color: #334155; padding: 2px 6px; border-radius: 4px; font-weight: 600;">CWE-693</span> | Nuclei Engine | `Strict-Transport-Security` preload |
| `testphp.vulnweb.com` | **Directory Traversal / Leak** | <span style="background-color: #FFEDD5; color: #C2410C; padding: 3px 8px; border-radius: 5px; font-weight: bold; border: 1.5px solid #FB923C;">HIGH (7.5)</span> | <span style="background-color: #F1F5F9; color: #334155; padding: 2px 6px; border-radius: 4px; font-weight: 600;">CWE-22</span> | Smart Fuzzer | Input validation & path normalization |

</div>

### <span style="color: #0369A1;">5.4 Automated Test Verification Metrics</span>
To ensure production-grade reliability, the codebase is validated by a multi-tier automated test suite:

<div style="background: linear-gradient(135deg, #064E3B 0%, #065F46 100%); border: 2px solid #10B981; border-radius: 10px; padding: 18px 22px; margin: 18px 0; color: #FFFFFF; box-shadow: 0 6px 12px rgba(16, 185, 129, 0.2);">
  <h3 style="color: #6EE7B7; margin-top: 0; margin-bottom: 8px;">✓ 219 Passing Automated Tests — Verification Scorecard</h3>
  <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
    <span style="background-color: #047857; color: #ECFDF5; padding: 4px 12px; border-radius: 6px; font-weight: bold;">Backend Pytest: 202 / 202 Passing (100%)</span>
    <span style="background-color: #047857; color: #ECFDF5; padding: 4px 12px; border-radius: 6px; font-weight: bold;">Frontend Vitest: 13 / 13 Passing (100%)</span>
    <span style="background-color: #047857; color: #ECFDF5; padding: 4px 12px; border-radius: 6px; font-weight: bold;">Playwright E2E: 4 / 4 Passing (100%)</span>
  </div>
</div>

<div style="background-color: #0B1120; border: 2px solid #1E293B; border-radius: 10px; padding: 16px; margin: 18px 0; color: #38BDF8;">

```
Automated Test Verification Suite (219 Total Passing Tests)
├── Backend Pytest Suite: 202 / 202 Passing (100% Pass Rate)
│   ├── test_ai_ping.py .................................. [  2%]
│   ├── test_api_docs_hardening.py ....................... [  5%]
│   ├── test_auth.py ..................................... [  7%]
│   ├── test_authorization_idor.py ....................... [ 10%]
│   ├── test_config.py ................................... [ 17%]
│   ├── test_cvss_cwe.py ................................. [ 41%]
│   ├── test_endpoints.py ................................ [ 46%]
│   ├── test_health.py ................................... [ 48%]
│   ├── test_integration.py .............................. [ 51%]
│   ├── test_logging_and_errors.py ....................... [ 53%]
│   ├── test_pdf_report.py ............................... [ 56%]
│   ├── test_rate_limiting.py ............................ [ 62%]
│   ├── test_schemas.py .................................. [ 72%]
│   ├── test_security.py ................................. [ 80%]
│   ├── test_target_verification.py ...................... [ 95%]
│   └── test_trial_subscription.py ....................... [100%]
├── Frontend Vitest Suite: 13 / 13 Passing
│   ├── constants.test.ts (2 tests)
│   ├── ConsoleStream.test.tsx (5 tests)
│   └── VulnerabilityAccordion.test.tsx (6 tests)
└── Playwright E2E Browser Suite: 4 / 4 Passing
    └── live-scan-stream.spec.ts (4 end-to-end integration flows)
```

</div>

---

## <span style="color: #0284C7; border-bottom: 2.5px solid #0284C7; padding-bottom: 4px; display: inline-block;">🚀 6. Conclusion & Future Work</span>

### <span style="color: #0369A1;">6.1 Project Conclusion</span>
The **EthioVuln** project successfully achieves its objective of automating web application vulnerability scanning and reporting by synthesizing leading open-source security tools into a unified, high-performance platform. By combining OWASP ZAP's active crawling with Nuclei's rapid signature scanning, EthioVuln delivers enterprise-level DAST auditing without the burdensome costs of proprietary software. 

The platform effectively eliminates the operational disconnect between security tools and engineering teams through sub-second WebSocket telemetry, objective CVSS v3.1 mathematical scoring, automated executive PDF compilation, and an AI-driven remediation copilot. With an end-to-end containerized deployment and a comprehensive automated test suite of **219 passing tests**, EthioVuln provides a robust, accessible, and production-ready solution for continuous security assessment.

### <span style="color: #0369A1;">6.2 Future Work & Roadmap</span>
Future engineering iterations will expand EthioVuln across several key capabilities:

<div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 16px 20px; margin: 18px 0;">

1. <span style="background-color: #E0F2FE; color: #0284C7; padding: 2px 7px; border-radius: 4px; font-weight: bold; font-size: 0.85em;">AUTOMATION</span> <b style="color: #0F172A;">Automated Recurring Scans:</b> Implement cron-based scheduling to allow organizations to perform continuous regression scans and attack surface tracking.
2. <span style="background-color: #FEF3C7; color: #D97706; padding: 2px 7px; border-radius: 4px; font-weight: bold; font-size: 0.85em;">NOTIFICATIONS</span> <b style="color: #0F172A;">Multi-Channel Alerting:</b> Integrate native webhook dispatchers for Telegram, Discord, Slack, and email notifications on critical vulnerability discoveries.
3. <span style="background-color: #F3E8FF; color: #7C3AED; padding: 2px 7px; border-radius: 4px; font-weight: bold; font-size: 0.85em;">AUTHENTICATION</span> <b style="color: #0F172A;">Authenticated Session Recording:</b> Support complex authentication sequences via recorded Playwright browser macros and OAuth2 session token injection.
4. <span style="background-color: #DCFCE7; color: #16A34A; padding: 2px 7px; border-radius: 4px; font-weight: bold; font-size: 0.85em;">SECURITY GOVERNANCE</span> <b style="color: #0F172A;">Multi-Tenant Role-Based Access Control (RBAC):</b> Introduce organizational workspaces with granular access roles (Owner, Security Analyst, Read-Only Auditor).
5. <span style="background-color: #FEE2E2; color: #DC2626; padding: 2px 7px; border-radius: 4px; font-weight: bold; font-size: 0.85em;">DEVSECOPS</span> <b style="color: #0F172A;">CI/CD Integration Plugins:</b> Publish pre-built GitHub Actions and GitLab CI runners allowing developers to enforce security gates directly in automated build pipelines.

</div>

---

## <span style="color: #0284C7; border-bottom: 2.5px solid #0284C7; padding-bottom: 4px; display: inline-block;">📚 7. Academic References & Bibliography</span>

1. **OWASP Foundation.** (2021). *OWASP Top Ten Web Application Security Risks*. Open Web Application Security Project. [https://owasp.org/Top10/](https://owasp.org/Top10/)
2. **FIRST.** (2019). *Common Vulnerability Scoring System v3.1: Specification Document*. Forum of Incident Response and Security Teams. [https://www.first.org/cvss/v3.1/specification-document](https://www.first.org/cvss/v3.1/specification-document)
3. **MITRE Corporation.** (2024). *Common Weakness Enumeration (CWE) Catalog*. [https://cwe.mitre.org/](https://cwe.mitre.org/)
4. **ProjectDiscovery.** (2024). *Nuclei: Fast and Customizable Vulnerability Scanner Based on Simple YAML Templates*. [https://github.com/projectdiscovery/nuclei](https://github.com/projectdiscovery/nuclei)
5. **OWASP Zed Attack Proxy (ZAP).** (2024). *ZAP User Guide & API Documentation*. [https://www.zaproxy.org/docs/](https://www.zaproxy.org/docs/)
6. **Tiangolo, S.** (2024). *FastAPI Framework: High Performance Modern Python Web APIs*. [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
7. **Vercel.** (2024). *Next.js 16 & 15 Architecture & App Router Specifications*. [https://nextjs.org/docs](https://nextjs.org/docs)
8. **ReportLab Europe Ltd.** (2024). *ReportLab PDF Generation User Guide (Version 4.x/5.x)*. [https://www.reportlab.com/docs/](https://www.reportlab.com/docs/)
