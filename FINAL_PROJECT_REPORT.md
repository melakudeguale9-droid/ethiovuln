# EthioVuln - Final Project Report

## 1. Introduction
EthioVuln is a comprehensive capstone project developed for the INSA Cyber Security Bootcamp. It is an automated Dynamic Application Security Testing (DAST) platform designed to identify and help remediate common web application vulnerabilities.

## 2. Architecture
The system employs a robust, scalable architecture:
- **Frontend:** Built with Next.js 16, providing a responsive and intuitive user interface for managing scans and viewing reports.
- **Backend:** Powered by FastAPI, offering high-performance, asynchronous RESTful APIs.
- **Task Management:** Utilizes Celery and Redis to handle long-running, resource-intensive vulnerability scans asynchronously without blocking the main application.
- **Database:** PostgreSQL is used for reliable and persistent storage of user data, scan configurations, and vulnerability reports.

## 3. Vulnerability Detection and Remediation
EthioVuln specifically targets critical vulnerabilities outlined in the bootcamp requirements:

### 3.1 SQL Injection (SQLi) - CWE-89
- **Detection Engine:** OWASP ZAP (Active Scanner)
- **Detection Mechanism & Payloads:** The scanner identifies input vectors (URL parameters, forms, headers) and injects active SQL payloads (e.g., `' OR '1'='1`, `UNION SELECT null, version()--`, `WAITFOR DELAY '0:0:5'`). It analyzes HTTP responses for database error reflections or time delays indicative of blind SQLi.
- **CVSS v3.1 Score Range:** 7.2 (High) - 10.0 (Critical)
- **Exact Remediation Advice:** Always use parameterized queries or prepared statements. Employ Object-Relational Mapping (ORM) frameworks to abstract SQL query construction. Validate and sanitize all user inputs using strict allowlists.

### 3.2 Cross-Site Scripting (XSS) - CWE-79
- **Detection Engine:** OWASP ZAP and Nuclei
- **Detection Mechanism & Payloads:** The scanner submits benign JavaScript payloads (e.g., `"><script>alert('XSS')</script>`, `<img src=x onerror=prompt(1)>`) into inputs and checks if the payload is reflected unsanitized in the HTTP response (Reflected XSS) or stored and rendered on subsequent pages (Stored XSS).
- **CVSS v3.1 Score Range:** 5.4 (Medium) - 8.2 (High)
- **Exact Remediation Advice:** Implement strict context-aware output encoding. Sanitize HTML input using established libraries (e.g., DOMPurify). Utilize strong Content Security Policy (CSP) headers to restrict script execution sources.

### 3.3 Cross-Site Request Forgery (CSRF) - CWE-352
- **Detection Engine:** OWASP ZAP (Passive & Active)
- **Detection Mechanism & Payloads:** The scanner identifies state-changing operations (e.g., POST, PUT, DELETE requests) that lack anti-CSRF tokens in headers or form bodies, or improperly validate them. It attempts to submit forms without the token or with an invalid token to confirm vulnerability.
- **CVSS v3.1 Score Range:** 4.3 (Medium) - 8.8 (High)
- **Exact Remediation Advice:** Implement robust anti-CSRF tokens (Synchronizer Token Pattern) for all state-changing requests. Ensure tokens are cryptographically secure, tied to the user's session, and validated on the server side. Utilize `SameSite=Lax` or `SameSite=Strict` cookie attributes.

### 3.4 Missing Security Headers - CWE-1021 / CWE-693
- **Detection Engine:** Nuclei (Template matching)
- **Detection Mechanism & Payloads:** The scanner passively analyzes HTTP response headers for the absence or misconfiguration of critical security headers like `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, and `X-Content-Type-Options`.
- **CVSS v3.1 Score Range:** 2.6 (Low) - 5.3 (Medium)
- **Exact Remediation Advice:**
  - **CSP:** Define approved sources for content to mitigate XSS (`Content-Security-Policy: default-src 'self'`).
  - **HSTS:** Enforce HTTPS connections (`Strict-Transport-Security: max-age=31536000; includeSubDomains`).
  - **X-Frame-Options:** Prevent clickjacking (`X-Frame-Options: DENY` or `SAMEORIGIN`).
  - **X-Content-Type-Options:** Prevent MIME sniffing (`X-Content-Type-Options: nosniff`).

## 4. Advanced Security Features
### 4.1 SSRF Protection Gate (3-Tier)
To prevent Server-Side Request Forgery (SSRF) during the scanning process itself, EthioVuln implements a 3-tier protection gate:
1. **Input Validation:** Strict URL parsing and validation against a whitelist of allowed schemes (http, https).
2. **DNS Resolution & Filtering:** Resolving the target hostname and ensuring the IP address does not fall within reserved, loopback, or internal network ranges (e.g., 127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, 169.254.169.254).
3. **Network Level Restrictions:** Utilizing egress firewall rules and network namespaces to restrict the scanner's outbound connections solely to authorized external targets.

### 4.2 CVSS v3.1 Scoring Logic
Vulnerabilities are dynamically scored using the Common Vulnerability Scoring System (CVSS) v3.1 framework. The system calculates the Base Score based on factors such as Attack Vector, Attack Complexity, Privileges Required, User Interaction, and impacts on Confidentiality, Integrity, and Availability. This standardized scoring helps users prioritize remediation efforts based on actual risk severity.
