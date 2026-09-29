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

### 3.1 SQL Injection (SQLi)
- **Detection Mechanism:** The scanner injects common SQL payloads (e.g., `' OR '1'='1`, `UNION SELECT`) into input fields and URL parameters. It analyzes HTTP responses for database error messages or time delays indicative of successful injection.
- **Remediation:** Always use parameterized queries or prepared statements. Employ Object-Relational Mapping (ORM) frameworks to abstract SQL query construction. Validate and sanitize all user inputs.

### 3.2 Cross-Site Scripting (XSS)
- **Detection Mechanism:** The scanner submits benign JavaScript payloads (e.g., `<script>alert(1)</script>`) into inputs and checks if the payload is reflected unsanitized in the HTTP response (Reflected XSS) or stored and rendered on subsequent pages (Stored XSS).
- **Remediation:** Implement strict context-aware output encoding. Sanitize HTML input using established libraries (e.g., DOMPurify). Utilize Content Security Policy (CSP) headers to restrict script execution sources.

### 3.3 Cross-Site Request Forgery (CSRF)
- **Detection Mechanism:** The scanner identifies state-changing operations (e.g., POST, PUT, DELETE requests) that lack anti-CSRF tokens in headers or form bodies.
- **Remediation:** Implement robust anti-CSRF tokens (Synchronizer Token Pattern) for all state-changing requests. Ensure tokens are tied to the user's session and validated on the server side. Utilize `SameSite` cookie attributes.

### 3.4 Missing Security Headers
- **Detection Mechanism:** The scanner analyzes HTTP response headers for the presence and correct configuration of critical security headers.
- **Remediation:**
  - **CSP (Content-Security-Policy):** Define approved sources for content (scripts, styles, images) to mitigate XSS and data injection attacks.
  - **HSTS (Strict-Transport-Security):** Enforce secure (HTTPS) connections to the server, protecting against protocol downgrade attacks.
  - **X-Frame-Options:** Prevent clickjacking by restricting how the site can be embedded in `<iframe>`, `<frame>`, or `<object>` elements.

## 4. Advanced Security Features
### 4.1 SSRF Protection Gate (3-Tier)
To prevent Server-Side Request Forgery (SSRF) during the scanning process itself, EthioVuln implements a 3-tier protection gate:
1. **Input Validation:** Strict URL parsing and validation against a whitelist of allowed schemes (http, https).
2. **DNS Resolution & Filtering:** Resolving the target hostname and ensuring the IP address does not fall within reserved, loopback, or internal network ranges (e.g., 127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, 169.254.169.254).
3. **Network Level Restrictions:** Utilizing egress firewall rules and network namespaces to restrict the scanner's outbound connections solely to authorized external targets.

### 4.2 CVSS v3.1 Scoring Logic
Vulnerabilities are dynamically scored using the Common Vulnerability Scoring System (CVSS) v3.1 framework. The system calculates the Base Score based on factors such as Attack Vector, Attack Complexity, Privileges Required, User Interaction, and impacts on Confidentiality, Integrity, and Availability. This standardized scoring helps users prioritize remediation efforts based on actual risk severity.
