# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x (current) | ✅ Yes |

---

## Reporting a Vulnerability

If you discover a security vulnerability in EthioVuln, please **do not open a public GitHub issue**.

Instead, report it responsibly by contacting:

**Email:** melaku@gmail.com  
**GitHub:** [@melakudeguale9-droid](https://github.com/melakudeguale9-droid)

Please include in your report:
- A description of the vulnerability
- Steps to reproduce it
- The potential impact
- Any suggested fix (optional)

---

## Response Timeline

| Stage | Timeframe |
|---|---|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix or mitigation | Within 30 days (critical issues prioritized) |
| Public disclosure | After fix is released |

---

## Scope

The following are **in scope** for security reports:

- Authentication and authorization bypass
- SQL injection or database exposure
- Remote code execution
- SSRF vulnerabilities in the scan engine
- Sensitive data exposure via API
- JWT token weaknesses
- XSS in the dashboard frontend

The following are **out of scope**:

- Vulnerabilities in third-party tools (Nuclei, OWASP ZAP) — report those to their respective maintainers
- Social engineering attacks
- Physical security issues
- Denial of service via intentional resource exhaustion

---

## Responsible Disclosure

EthioVuln is a security testing tool. We take the security of the platform itself seriously. We ask that you:

- Give us reasonable time to fix the issue before public disclosure
- Avoid accessing or modifying other users' data during testing
- Do not perform denial-of-service attacks against the project infrastructure

We appreciate responsible disclosure and will credit researchers who report valid vulnerabilities.

---

## Legal Notice

EthioVuln is intended for **authorized security testing only**. Any use of this tool against systems without explicit permission is illegal and unethical. The author is not responsible for misuse.
