"""
EthioVuln — Advanced Bug Bounty Fuzzer
Covers: SQLi, XSS, SSTI, SSRF, CORS, Headers, LFI, Open Redirect, Clickjacking
"""

import logging
import random
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin, quote, urlparse, parse_qs, urlencode, urlunparse
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

from app.config import get_settings
from app.utils.cwe_mapping import get_cwe_info

settings = get_settings()
logger = logging.getLogger(__name__)

# ─── WAF Evasion: Rotate User-Agents ─────────────────────────────────────────
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
]

# ─── Payloads ────────────────────────────────────────────────────────────────

SQLI_PAYLOADS = [
    "'",
    "\"",
    "' OR '1'='1",
    "' OR 1=1--",
    "' OR 1=1#",
    "1' ORDER BY 1--",
    "admin'--",
    "' UNION SELECT NULL--",
    "1 AND 1=1",
    "1 AND 1=2",
]

SQLI_ERRORS = [
    # MySQL
    "you have an error in your sql syntax",
    "warning: mysql",
    "mysql_fetch_array",
    "mysql_fetch_assoc",
    "mysql_num_rows",
    "mysql_fetch",
    "supplied argument is not a valid mysql",
    # Generic SQL
    "sql syntax",
    "syntax error",
    "unclosed quotation mark",
    "quoted string not properly terminated",
    "invalid query",
    "division by zero",
    # Oracle
    "ora-",
    "oracle error",
    # PostgreSQL
    "pg_query",
    "pg_exec",
    "postgresql",
    # MSSQL
    "mssql_",
    "microsoft sql",
    "odbc sql server",
    "odbc_",
    # SQLite
    "sqlite_",
    "sqlite error",
    # General
    "supplied argument is not",
    "db2 sql error",
    "jdbc",
]

XSS_PAYLOADS = [
    "<script>alert(1)</script>",
    '"><script>alert(1)</script>',
    "'><script>alert(1)</script>",
    "<img src=x onerror=alert(1)>",
    "<svg onload=alert(1)>",
    '"><img src=x onerror=alert(1)>',
    "javascript:alert(1)",
    "<body onload=alert(1)>",
]

SSTI_PAYLOADS = ["{{7*7}}", "${7*7}", "<%= 7*7 %>", "#{7*7}"]

SSRF_PAYLOADS = ["http://127.0.0.1", "http://localhost", "http://169.254.169.254",
                 "http://169.254.169.254/latest/meta-data/",
                 "http://[::1]", "http://0.0.0.0"]

LFI_PAYLOADS = ["../etc/passwd", "../../etc/passwd", "../../../etc/passwd",
                "C:\\Windows\\win.ini"]

OPEN_REDIRECT_PAYLOADS = ["https://evil.com", "//evil.com", "/\\evil.com",
                           "https://evil.com%2F", "@evil.com", "evil.com"]

SSTI_DETECT = ["49", "{{", "error", "jinja", "twig", "freemarker"]

COMMON_PARAMS = ["id", "user", "page", "q", "search", "url", "redirect",
                 "name", "input", "file", "lang", "view", "action"]

SENSITIVE_PATHS = [
    "/.env", "/.env.local", "/.env.production", "/.env.backup",
    "/config.yml", "/config.json", "/config.php", "/settings.py",
    "/wp-config.php", "/web.config", "/appsettings.json",
    "/.git/config", "/.git/HEAD", "/.gitignore",
    "/admin", "/admin/", "/administrator", "/admin/login",
    "/wp-admin", "/wp-login.php", "/phpmyadmin",
    "/swagger.json", "/swagger-ui.html", "/api-docs", "/openapi.json", "/graphql",
    "/backup.zip", "/backup.sql", "/db.sql", "/database.sql",
    "/robots.txt", "/sitemap.xml",
    "/phpinfo.php", "/info.php", "/.htaccess",
    "/actuator/env", "/actuator/health",
    "/server-status", "/server-info",
    "/api/v1/users", "/api/v1/admin", "/api/users", "/api/admin",
    "/metrics", "/health", "/healthcheck",
    "/.dockerenv", "/Dockerfile",
]

INTERESTING_STATUS_CODES = {200, 201, 301, 302, 307, 308, 401, 403}
SENSITIVE_STATUS_CODES = {200, 201}


def make_finding(
    title: str,
    desc: str,
    severity: str,
    cvss: float,
    cwe_id: str,
    url: str,
    evidence: str,
    param: str = "",
    payload: str = "",
    req: str = "",
    resp: str = "",
    remediation: str = "",
    template_id: str = "fuzzer",
):
    cwe_info = get_cwe_info(cwe_id)
    cvss_vectors = {
        "critical": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
        "high": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
        "medium": "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N",
        "low": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
        "info": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N",
    }
    cvss_vec = cvss_vectors.get(severity.lower(), "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N")

    # Format structured request_data
    if not req:
        req_lines = [f"Target: {url}"]
        if param:
            req_lines.append(f"Param: {param}")
        if payload:
            req_lines.append(f"Payload: {payload}")
        req = "\n".join(req_lines)

    # Format structured non-malicious verification details
    evidence_parts = []
    if param:
        evidence_parts.append(f"Affected Item: {param}")
    if payload:
        evidence_parts.append(f"Tested Payload: {payload}")
    if evidence_parts and "Affected Item" not in evidence:
        evidence = f"{' | '.join(evidence_parts)}\n\nVerification Evidence:\n{evidence}"

    return {
        "title": title,
        "description": desc,
        "severity": severity,
        "cvss_score": cvss,
        "cvss_vector": cvss_vec,
        "cwe_id": cwe_id,
        "cwe_name": cwe_info.get("name", ""),
        "url": url,
        "target_url": url,
        "affected_parameter": param,
        "evidence": evidence,
        "request_data": req,
        "response_data": resp[:600] if resp else "",
        "remediation": remediation,
        "reference_urls": f"https://cwe.mitre.org/data/definitions/{cwe_id.replace('CWE-', '')}.html" if cwe_id else "",
        "source": "fuzzer",
        "template_id": template_id,
    }


class DirectoryFuzzer:
    def __init__(self, threads=None, timeout=None, rate_limit=None):
        self.threads = threads or settings.FUZZER_THREADS
        self.timeout = timeout or settings.FUZZER_TIMEOUT
        self.rate_limit = rate_limit or settings.FUZZER_RATE_LIMIT
        self._stop_flag = False

    def _make_session(self):
        """Create a fresh session with a random User-Agent for WAF evasion."""
        session = requests.Session()
        adapter = requests.adapters.HTTPAdapter(
            pool_connections=20, pool_maxsize=20, max_retries=0
        )
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        session.headers.update({
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "close",
        })
        session.verify = False
        return session

    @property
    def session(self):
        """Return a session with rotated User-Agent each time."""
        return self._make_session()

    def stop(self):
        self._stop_flag = True

    # ── Security Headers ──────────────────────────────────────────────────────
    def _check_security_headers(self, base_url, log_fn=None):
        findings = []
        if log_fn:
            log_fn(f"[PROBING] Target: {base_url} | Param: Headers | Module: Security Headers")
        try:
            sess = self.session
            resp = sess.get(base_url, timeout=self.timeout, allow_redirects=True)
            if log_fn:
                log_fn(f"[INFO] Evaluated Security Headers on {base_url}: Status {resp.status_code}")
            headers = {k.lower(): v for k, v in resp.headers.items()}
            checks = [
                ("x-frame-options", "Missing X-Frame-Options Header",
                 "Clickjacking protection missing. Attacker can embed target in a malicious iframe to hijack user clicks.",
                 "medium", 4.3, "CWE-1021",
                 "Configure web server or reverse proxy with: X-Frame-Options: DENY or SAMEORIGIN.\nIn Nginx: add_header X-Frame-Options \"SAMEORIGIN\" always;"),
                ("x-content-type-options", "Missing X-Content-Type-Options Header",
                 "MIME sniffing protection disabled. Browsers may execute non-executable files as scripts.",
                 "low", 3.1, "CWE-693",
                 "Add HTTP header: X-Content-Type-Options: nosniff.\nIn Express: app.use(helmet.noSniff());\nIn Nginx: add_header X-Content-Type-Options \"nosniff\" always;"),
                ("strict-transport-security", "Missing HTTP Strict Transport Security (HSTS)",
                 "Connections can be downgraded to plaintext HTTP via SSL stripping attacks.",
                 "medium", 4.3, "CWE-319",
                 "Enforce HTTPS by adding: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"),
                ("content-security-policy", "Missing Content-Security-Policy (CSP)",
                 "No CSP header enforced — Cross-Site Scripting (XSS) and data injection attacks have higher blast radius.",
                 "medium", 5.4, "CWE-693",
                 "Implement a strict Content-Security-Policy header restricting script-src, object-src, and base-uri.\nExample: Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';"),
                ("x-xss-protection", "Missing X-XSS-Protection Header",
                 "Legacy browser XSS audit filter not explicitly configured.",
                 "low", 3.1, "CWE-693",
                 "Set: X-XSS-Protection: 1; mode=block or rely on modern Content-Security-Policy."),
                ("referrer-policy", "Missing Referrer-Policy Header",
                 "Sensitive path parameters or tokens in URLs may leak to external third-party sites in Referer headers.",
                 "low", 2.0, "CWE-200",
                 "Configure: Referrer-Policy: strict-origin-when-cross-origin"),
                ("permissions-policy", "Missing Permissions-Policy Header",
                 "Browser device capabilities (camera, microphone, geolocation) are not restricted.",
                 "low", 2.0, "CWE-693",
                 "Configure: Permissions-Policy: camera=(), microphone=(), geolocation=()"),
            ]
            for header, title, desc, sev, cvss, cwe, rem in checks:
                if header not in headers:
                    findings.append(make_finding(
                        title, desc, sev, cvss, cwe, base_url,
                        f"Missing required response header '{header}' across HTTP response.",
                        param=f"Header: {header}",
                        req=f"GET {base_url}\nMissing Header: {header}",
                        resp=str(dict(resp.headers))[:300],
                        remediation=rem,
                        template_id=f"header-{header}",
                    ))
                    if log_fn:
                        log_fn(f"[DETECTED] {sev.upper()} finding logged: {title}")
        except Exception as e:
            logger.debug(f"Header check error: {e}")
        return findings

    # ── CORS ──────────────────────────────────────────────────────────────────
    def _check_cors(self, base_url, log_fn=None):
        findings = []
        if log_fn:
            log_fn(f"[PROBING] Target: {base_url} | Param: Origin | Module: CORS Policy")
        try:
            sess = self.session
            resp = sess.get(base_url, timeout=self.timeout, headers={"Origin": "https://evil.com"})
            if log_fn:
                log_fn(f"[INFO] Evaluated CORS Policy on {base_url}: Status {resp.status_code}")
            acao = resp.headers.get("Access-Control-Allow-Origin", "")
            acac = resp.headers.get("Access-Control-Allow-Credentials", "")
            if "evil.com" in acao or acao == "*":
                sev = "high" if acac.lower() == "true" else "medium"
                remediation = (
                    "1. Whitelist specific trusted origins explicitly in CORS headers instead of echoing requested Origin.\n"
                    "2. Never combine Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true.\n"
                    "3. Validate requested origin against an exact strict domain list server-side."
                )
                findings.append(make_finding(
                    "CORS Misconfiguration",
                    "Server dynamically reflects arbitrary untrusted Origin header or allows wildcard cross-origin access.",
                    sev, 7.5 if sev == "high" else 5.3, "CWE-942", base_url,
                    f"Reflected ACAO: {acao} | ACAC: {acac}",
                    param="Header: Origin",
                    payload="Origin: https://evil.com",
                    req=f"GET {base_url}\nOrigin: https://evil.com",
                    resp=f"Access-Control-Allow-Origin: {acao}\nAccess-Control-Allow-Credentials: {acac}",
                    remediation=remediation,
                    template_id="cors-misconfiguration",
                ))
                if log_fn:
                    log_fn(f"[DETECTED] {sev.upper()} finding logged: CORS Misconfiguration on {base_url}")
        except Exception as e:
            logger.debug(f"CORS check error: {e}")
        return findings

    # ── XSS ───────────────────────────────────────────────────────────────────
    def _check_xss(self, base_url, log_fn=None):
        findings = []
        found_params = set()
        parsed = urlparse(base_url)
        existing_params = parse_qs(parsed.query)
        all_params = list(existing_params.keys()) + [p for p in COMMON_PARAMS if p not in existing_params]
        try:
            for param in all_params[:8]:
                if param in found_params:
                    continue
                for payload in XSS_PAYLOADS[:4]:
                    test_params = dict(existing_params)
                    test_params[param] = [payload]
                    flat_params = {k: v[0] if isinstance(v, list) else v for k, v in test_params.items()}
                    if existing_params:
                        new_query = urlencode(flat_params)
                        test_url = urlunparse(parsed._replace(query=new_query))
                    else:
                        test_url = f"{base_url}?{param}={quote(payload)}"

                    if log_fn:
                        log_fn(f"[PROBING] Target: {base_url} | Param: {param} | Module: Reflected XSS")

                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout)
                        if log_fn:
                            log_fn(f"[INFO] Evaluated Reflected XSS on {base_url}?{param}: Status {resp.status_code}")

                        reflected = (
                            payload in resp.text and
                            "&lt;" not in resp.text.split(payload)[0][-10:] if payload in resp.text else False
                        )
                        if reflected:
                            found_params.add(param)
                            remediation = (
                                "1. Context-Aware Output Encoding:\n"
                                "   Encode user input before rendering into HTML context (e.g., htmlspecialchars() in PHP, escape in Jinja2).\n"
                                "2. Strict Content Security Policy:\n"
                                "   Deploy CSP headers that disallow unsafe-inline scripts.\n"
                                "3. Use safe modern frameworks that auto-escape (e.g. React, Angular, Vue)."
                            )
                            findings.append(make_finding(
                                f"Reflected XSS in '{param}'",
                                f"Untrusted input supplied to parameter '{param}' was reflected verbatim without contextual sanitization.",
                                "high", 7.2, "CWE-79", test_url,
                                f"Payload '{payload}' was reflected unencoded in HTTP response body.",
                                param=param,
                                payload=payload,
                                req=f"GET {test_url}\nParam: {param}\nPayload: {payload}",
                                resp=resp.text[:400],
                                remediation=remediation,
                                template_id="xss-reflected",
                            ))
                            if log_fn:
                                log_fn(f"[DETECTED] HIGH finding logged: Reflected XSS in '{param}'")
                            break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"XSS check error: {e}")
        return findings

    # ── SQL Injection ─────────────────────────────────────────────────────────
    def _check_sqli(self, base_url, log_fn=None):
        findings = []
        found_params = set()
        parsed = urlparse(base_url)
        existing_params = parse_qs(parsed.query)
        all_params = list(existing_params.keys()) + [p for p in COMMON_PARAMS if p not in existing_params]

        try:
            for param in all_params[:8]:
                if param in found_params:
                    continue
                for payload in SQLI_PAYLOADS[:5]:
                    test_params = dict(existing_params)
                    test_params[param] = [payload]
                    flat_params = {k: v[0] if isinstance(v, list) else v for k, v in test_params.items()}
                    if existing_params:
                        new_query = urlencode(flat_params)
                        test_url = urlunparse(parsed._replace(query=new_query))
                    else:
                        test_url = f"{base_url}?{param}={quote(payload)}"

                    if log_fn:
                        log_fn(f"[PROBING] Target: {base_url} | Param: {param} | Module: SQL Injection")

                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout)
                        if log_fn:
                            log_fn(f"[INFO] Evaluated SQL Injection on {base_url}?{param}: Status {resp.status_code}")

                        body_lower = resp.text.lower()
                        matched_error = next((e for e in SQLI_ERRORS if e in body_lower), None)
                        if matched_error:
                            found_params.add(param)
                            remediation = (
                                "1. Parameterized Queries / Prepared Statements:\n"
                                "   Always bind user input as SQL query parameters. Never concatenate raw strings into SQL.\n"
                                "   - Python: cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))\n"
                                "   - PHP PDO: $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?'); $stmt->execute([$id]);\n"
                                "2. Use Object-Relational Mapping (ORM) safely without raw SQL clauses.\n"
                                "3. Enforce least-privilege access for database accounts."
                            )
                            findings.append(make_finding(
                                f"SQL Injection in '{param}'",
                                f"Database error syntax was triggered when injecting input into parameter '{param}'.",
                                "critical", 9.8, "CWE-89", test_url,
                                f"SQL error signature '{matched_error}' detected in response body.",
                                param=param,
                                payload=payload,
                                req=f"GET {test_url}\nParam: {param}\nPayload: {payload}",
                                resp=resp.text[:400],
                                remediation=remediation,
                                template_id="sqli-error-based",
                            ))
                            if log_fn:
                                log_fn(f"[DETECTED] CRITICAL finding logged: SQL Injection in '{param}'")
                            break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"SQLi check error: {e}")
        return findings

    # ── SSTI ──────────────────────────────────────────────────────────────────
    def _check_ssti(self, base_url, log_fn=None):
        findings = []
        try:
            for param in COMMON_PARAMS[:4]:
                for payload in SSTI_PAYLOADS[:3]:
                    test_url = f"{base_url}?{param}={quote(payload)}"
                    if log_fn:
                        log_fn(f"[PROBING] Target: {base_url} | Param: {param} | Module: SSTI")
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout)
                        if log_fn:
                            log_fn(f"[INFO] Evaluated SSTI on {base_url}?{param}: Status {resp.status_code}")

                        if "49" in resp.text and "7*7" in payload:
                            remediation = (
                                "1. Never concatenate untrusted user input directly into template strings.\n"
                                "2. Pass parameters as template context variables, not raw template templates.\n"
                                "3. Use sandbox mode in template engines (e.g. Jinja2 SandboxedEnvironment)."
                            )
                            findings.append(make_finding(
                                f"Server-Side Template Injection (SSTI) in '{param}'",
                                "Arithmetic template expression was evaluated server-side, indicating remote code execution risk.",
                                "critical", 9.8, "CWE-94", test_url,
                                f"Template expression {payload} was evaluated to 49 in response.",
                                param=param,
                                payload=payload,
                                req=f"GET {test_url}\nParam: {param}\nPayload: {payload}",
                                resp=resp.text[:400],
                                remediation=remediation,
                                template_id="ssti-detection",
                            ))
                            if log_fn:
                                log_fn(f"[DETECTED] CRITICAL finding logged: SSTI in '{param}'")
                            break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"SSTI check error: {e}")
        return findings

    # ── Open Redirect ─────────────────────────────────────────────────────────
    def _check_open_redirect(self, base_url, log_fn=None):
        findings = []
        redirect_params = ["redirect", "url", "next", "return", "goto", "returnUrl", "redirectTo"]
        try:
            for param in redirect_params[:5]:
                for payload in OPEN_REDIRECT_PAYLOADS[:3]:
                    test_url = f"{base_url}?{param}={quote(payload)}"
                    if log_fn:
                        log_fn(f"[PROBING] Target: {base_url} | Param: {param} | Module: Open Redirect")
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout, allow_redirects=False)
                        if log_fn:
                            log_fn(f"[INFO] Evaluated Open Redirect on {base_url}?{param}: Status {resp.status_code}")

                        location = resp.headers.get("Location", "")
                        if "evil.com" in location or resp.status_code in (301, 302, 307):
                            if "evil.com" in location:
                                remediation = (
                                    "1. Avoid user-controlled redirect destinations where possible.\n"
                                    "2. Validate redirect URLs against a strict domain allowlist.\n"
                                    "3. Enforce relative-only paths (e.g. ensure destination begins with a single /)."
                                )
                                findings.append(make_finding(
                                    f"Open Redirect in '{param}'",
                                    "Application allows arbitrary external URLs in redirect parameters, enabling phishing campaigns.",
                                    "medium", 6.1, "CWE-601", test_url,
                                    f"HTTP status {resp.status_code} with Location header redirecting to {location}",
                                    param=param,
                                    payload=payload,
                                    req=f"GET {test_url}\nParam: {param}\nPayload: {payload}",
                                    resp=f"Location: {location}",
                                    remediation=remediation,
                                    template_id="open-redirect",
                                ))
                                if log_fn:
                                    log_fn(f"[DETECTED] MEDIUM finding logged: Open Redirect in '{param}'")
                                break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"Open redirect check error: {e}")
        return findings

    # ── LFI ───────────────────────────────────────────────────────────────────
    def _check_lfi(self, base_url, log_fn=None):
        findings = []
        file_params = ["file", "path", "page", "include", "template", "view", "doc"]
        lfi_indicators = ["root:x:", "[boot loader]", "for 16-bit app support", "daemon:x:", "bin:x:"]
        try:
            for param in file_params[:4]:
                for payload in LFI_PAYLOADS[:4]:
                    test_url = f"{base_url}?{param}={quote(payload)}"
                    if log_fn:
                        log_fn(f"[PROBING] Target: {base_url} | Param: {param} | Module: Local File Inclusion")
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout)
                        if log_fn:
                            log_fn(f"[INFO] Evaluated Local File Inclusion on {base_url}?{param}: Status {resp.status_code}")

                        for indicator in lfi_indicators:
                            if indicator in resp.text:
                                remediation = (
                                    "1. Never pass user-controllable input directly to file opening functions.\n"
                                    "2. Use path canonicalization (realpath) and verify target is within an allowed root directory.\n"
                                    "3. Maintain a strict whitelist of permitted file identifiers."
                                )
                                findings.append(make_finding(
                                    f"Local File Inclusion (LFI) in '{param}'",
                                    "Path traversal sequence allowed unauthorized retrieval of local server filesystem contents.",
                                    "critical", 9.1, "CWE-22", test_url,
                                    f"Indicator '{indicator}' found in HTTP response body.",
                                    param=param,
                                    payload=payload,
                                    req=f"GET {test_url}\nParam: {param}\nPayload: {payload}",
                                    resp=resp.text[:400],
                                    remediation=remediation,
                                    template_id="lfi-detection",
                                ))
                                if log_fn:
                                    log_fn(f"[DETECTED] CRITICAL finding logged: LFI in '{param}'")
                                break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"LFI check error: {e}")
        return findings

    # ── SSRF ──────────────────────────────────────────────────────────────────
    def _check_ssrf(self, base_url, log_fn=None):
        findings = []
        ssrf_params = ["url", "src", "href", "path", "dest", "redirect", "uri", "link", "fetch"]
        try:
            for param in ssrf_params[:4]:
                for payload in SSRF_PAYLOADS[:3]:
                    test_url = f"{base_url}?{param}={quote(payload)}"
                    if log_fn:
                        log_fn(f"[PROBING] Target: {base_url} | Param: {param} | Module: SSRF")
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=5)
                        if log_fn:
                            log_fn(f"[INFO] Evaluated SSRF on {base_url}?{param}: Status {resp.status_code}")

                        if resp.status_code == 200 and len(resp.text) > 50:
                            if any(x in resp.text.lower() for x in ["ami-id", "instance-id", "local", "127", "metadata"]):
                                remediation = (
                                    "1. Enforce strict destination URL whitelisting.\n"
                                    "2. Block connections to private address spaces (RFC 1918) and cloud metadata services (169.254.169.254).\n"
                                    "3. Use a dedicated egress proxy with strict access control."
                                )
                                findings.append(make_finding(
                                    f"Server-Side Request Forgery (SSRF) in '{param}'",
                                    "Server was induced to issue outbound requests to internal infrastructure or metadata services.",
                                    "critical", 9.1, "CWE-918", test_url,
                                    f"Internal service / metadata indicator matched in response body.",
                                    param=param,
                                    payload=payload,
                                    req=f"GET {test_url}\nParam: {param}\nPayload: {payload}",
                                    resp=resp.text[:400],
                                    remediation=remediation,
                                    template_id="ssrf-detection",
                                ))
                                if log_fn:
                                    log_fn(f"[DETECTED] CRITICAL finding logged: SSRF in '{param}'")
                                break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"SSRF check error: {e}")
        return findings

    # ── Clickjacking ──────────────────────────────────────────────────────────
    def _check_clickjacking(self, base_url, log_fn=None):
        findings = []
        if log_fn:
            log_fn(f"[PROBING] Target: {base_url} | Param: Framing | Module: Clickjacking Defense")
        try:
            sess = self.session
            resp = sess.get(base_url, timeout=self.timeout)
            if log_fn:
                log_fn(f"[INFO] Evaluated Clickjacking Defense on {base_url}: Status {resp.status_code}")
            headers = {k.lower(): v for k, v in resp.headers.items()}
            xfo = headers.get("x-frame-options", "")
            csp = headers.get("content-security-policy", "")
            if not xfo and "frame-ancestors" not in csp:
                remediation = (
                    "1. Set HTTP response header: X-Frame-Options: SAMEORIGIN or DENY.\n"
                    "2. Configure Content-Security-Policy with frame-ancestors directive: frame-ancestors 'self';."
                )
                findings.append(make_finding(
                    "Clickjacking Protection Missing",
                    "Web application lacks framing restrictions, permitting embedding in iframes for UI redressing attacks.",
                    "medium", 4.3, "CWE-1021", base_url,
                    "Neither X-Frame-Options nor CSP frame-ancestors directive present in response.",
                    param="Header: X-Frame-Options",
                    req=f"GET {base_url}",
                    remediation=remediation,
                    template_id="clickjacking",
                ))
                if log_fn:
                    log_fn(f"[DETECTED] MEDIUM finding logged: Clickjacking Protection Missing")
        except Exception as e:
            logger.debug(f"Clickjacking check error: {e}")
        return findings

    # ── Information Disclosure ────────────────────────────────────────────────
    def _check_info_disclosure(self, base_url, log_fn=None):
        findings = []
        if log_fn:
            log_fn(f"[PROBING] Target: {base_url} | Param: Server Banners | Module: Information Disclosure")
        try:
            sess = self.session
            resp = sess.get(base_url, timeout=self.timeout)
            if log_fn:
                log_fn(f"[INFO] Evaluated Information Disclosure on {base_url}: Status {resp.status_code}")
            headers = {k.lower(): v for k, v in resp.headers.items()}
            server = headers.get("server", "")
            powered = headers.get("x-powered-by", "")
            if server:
                findings.append(make_finding(
                    "Server Technology Banner Disclosure",
                    f"Server header exposes runtime infrastructure details: {server}",
                    "low", 2.0, "CWE-200", base_url,
                    f"Revealed header: Server: {server}",
                    param="Header: Server",
                    req=f"GET {base_url}",
                    resp=f"Server: {server}",
                    remediation="Disable or sanitize Server banner token in web server configuration (e.g. server_tokens off; in Nginx).",
                    template_id="info-server-header",
                ))
                if log_fn:
                    log_fn(f"[DETECTED] LOW finding logged: Server Technology Banner Disclosure")
            if powered:
                findings.append(make_finding(
                    "Framework Disclosure via X-Powered-By",
                    f"X-Powered-By header exposes backend application runtime: {powered}",
                    "low", 2.0, "CWE-200", base_url,
                    f"Revealed header: X-Powered-By: {powered}",
                    param="Header: X-Powered-By",
                    req=f"GET {base_url}",
                    resp=f"X-Powered-By: {powered}",
                    remediation="Remove X-Powered-By header in application server settings (e.g. app.disable('x-powered-by') in Express).",
                    template_id="info-powered-by",
                ))
                if log_fn:
                    log_fn(f"[DETECTED] LOW finding logged: Framework Disclosure via X-Powered-By")
        except Exception as e:
            logger.debug(f"Info disclosure check error: {e}")
        return findings

    # ── Directory Fuzzing ─────────────────────────────────────────────────────
    def _check_path(self, base_url, path, log_fn=None):
        if self._stop_flag:
            return None
        url = urljoin(base_url.rstrip("/") + "/", path.lstrip("/"))
        if log_fn:
            log_fn(f"[PROBING] Target: {url} | Param: Path | Module: Directory Fuzzing")
        try:
            sess = self.session
            resp = sess.get(url, timeout=self.timeout, allow_redirects=False)
            status_code = resp.status_code
            content_length = len(resp.content)
            if log_fn:
                log_fn(f"[INFO] Evaluated Directory Fuzzing on {url}: Status {status_code}")

            if status_code in (401, 403):
                severity, cvss_score, cwe_id = self._classify_path(path, status_code)
                cwe_info = get_cwe_info(cwe_id)
                finding = make_finding(
                    f"Protected Resource: {path}",
                    f"Restricted endpoint '{path}' identified on server (HTTP {status_code}). Access controls should be verified.",
                    severity, cvss_score, cwe_id, url,
                    f"HTTP status {status_code} returned for protected resource.",
                    param=f"Endpoint: {path}",
                    req=f"GET {url}",
                    resp=f"HTTP/{status_code}",
                    remediation=self._get_remediation(path),
                    template_id="fuzz-protected",
                )
                if log_fn:
                    log_fn(f"[DETECTED] {severity.upper()} finding logged: Protected Resource: {path}")
                return finding

            if status_code in (200, 201) and content_length > 0:
                severity, cvss_score, cwe_id = self._classify_path(path, status_code)
                evidence = f"HTTP {status_code} | Content-Length: {content_length} bytes.\nVerification Preview:\n{resp.text[:300]}"
                finding = make_finding(
                    f"Exposed Sensitive Resource: {path}",
                    self._get_description(path, status_code),
                    severity, cvss_score, cwe_id, url,
                    evidence,
                    param=f"Endpoint: {path}",
                    req=f"GET {url}",
                    resp=f"HTTP/{status_code} Content-Length: {content_length}",
                    remediation=self._get_remediation(path),
                    template_id="fuzz-dir",
                )
                if log_fn:
                    log_fn(f"[DETECTED] {severity.upper()} finding logged: Exposed Sensitive Resource: {path}")
                return finding

            return None
        except Exception:
            return None

    def _classify_path(self, path, status_code):
        p = path.lower()
        if ".env" in p or "credentials" in p:
            return ("high", 7.5, "CWE-200") if status_code in SENSITIVE_STATUS_CODES else ("medium", 5.3, "CWE-200")
        if any(x in p for x in [".git/", ".svn/", ".sql", "dump", "backup"]):
            return ("high", 7.5, "CWE-538") if status_code in SENSITIVE_STATUS_CODES else ("medium", 5.3, "CWE-538")
        if any(x in p for x in ["admin", "phpmyadmin", "manager", "console"]):
            return ("medium", 5.3, "CWE-425") if status_code in SENSITIVE_STATUS_CODES else ("low", 3.7, "CWE-425")
        if any(x in p for x in ["phpinfo", "debug", "actuator", "server-status"]):
            return ("medium", 5.3, "CWE-200") if status_code in SENSITIVE_STATUS_CODES else ("low", 3.7, "CWE-200")
        if status_code == 403:
            return "info", 0.0, "CWE-200"
        return "low", 2.0, "CWE-200"

    def _get_description(self, path, status_code):
        p = path.lower()
        s = "accessible" if status_code in SENSITIVE_STATUS_CODES else "detected"
        if ".env" in p:
            return f"Configuration/environment file '{path}' is publicly {s} (HTTP {status_code}). May expose secrets and database passwords."
        if ".git" in p:
            return f"Version control directory '{path}' is {s} (HTTP {status_code}). Source repository history is at risk of exposure."
        if "admin" in p:
            return f"Administrative interface '{path}' is {s} (HTTP {status_code}). Must be protected with strong authentication and network limits."
        if "backup" in p or ".sql" in p:
            return f"Database dump/backup archive '{path}' is publicly {s} (HTTP {status_code})."
        return f"Sensitive endpoint '{path}' is accessible (HTTP {status_code})."

    def _get_remediation(self, path):
        p = path.lower()
        if ".env" in p:
            return "1. Move sensitive .env files outside public web root.\n2. Block dotfile requests (.env, .git) in web server config.\n3. Rotate exposed application secrets immediately."
        if ".git" in p:
            return "1. Remove .git directories from web root deployment.\n2. In Nginx: location ~ /\\.git { deny all; return 404; }"
        if "admin" in p:
            return "1. Restrict administrative portals behind corporate VPN or IP allowlist.\n2. Enforce Multi-Factor Authentication (MFA)."
        return "Restrict public access to this path and review web server configuration rules."

    # ── Main Run ──────────────────────────────────────────────────────────────
    def run_scan(
        self,
        target,
        wordlist=None,
        progress_callback=None,
        on_step_start=None,
        on_step_complete=None,
        on_finding=None,
        on_log=None,
    ):
        self._stop_flag = False
        paths = wordlist or SENSITIVE_PATHS
        total_paths = len(paths)
        findings = []

        logger.info(f"Starting fuzzer with {self.threads} threads against {target} ({total_paths} paths)")

        fuzzer_checks = [
            ("Checking security headers...", "Security headers", lambda: self._check_security_headers(target, on_log)),
            ("Checking CORS configuration...", "CORS configuration", lambda: self._check_cors(target, on_log)),
            ("Checking for Clickjacking...", "Clickjacking protection", lambda: self._check_clickjacking(target, on_log)),
            ("Checking information disclosure...", "Information disclosure", lambda: self._check_info_disclosure(target, on_log)),
            ("Testing for Reflected XSS...", "Reflected XSS", lambda: self._check_xss(target, on_log)),
            ("Testing for SQL Injection...", "SQL Injection", lambda: self._check_sqli(target, on_log)),
            ("Testing for SSTI...", "Server-Side Template Injection", lambda: self._check_ssti(target, on_log)),
            ("Testing for Open Redirect...", "Open Redirect", lambda: self._check_open_redirect(target, on_log)),
            ("Testing for LFI...", "Local File Inclusion", lambda: self._check_lfi(target, on_log)),
            ("Testing for SSRF...", "Server-Side Request Forgery", lambda: self._check_ssrf(target, on_log)),
        ]
        total_steps = len(fuzzer_checks) + 1
        current_step = 0

        for stage_prompt, check_label, check_fn in fuzzer_checks:
            if self._stop_flag:
                break

            if on_step_start:
                on_step_start(stage_prompt)
            elif progress_callback:
                progress = int((current_step / total_steps) * 100)
                progress_callback(progress, stage_prompt)

            try:
                check_findings = check_fn() or []
            except Exception as e:
                logger.error(f"Error in {check_label} check: {e}")
                check_findings = []

            for f in check_findings:
                findings.append(f)
                if on_finding:
                    on_finding(f)

            current_step += 1
            progress = int((current_step / total_steps) * 100)
            completed_msg = f"{check_label} check complete ({len(check_findings)} findings)"

            if on_step_complete:
                on_step_complete(completed_msg, check_findings)
            elif progress_callback:
                progress_callback(progress, completed_msg)

        # Directory fuzzing step
        if not self._stop_flag:
            dir_stage_prompt = f"Directory fuzzing ({total_paths} paths)..."
            if on_step_start:
                on_step_start(dir_stage_prompt)
            elif progress_callback:
                progress = int((current_step / total_steps) * 100)
                progress_callback(progress, dir_stage_prompt)

            completed_paths = 0
            with ThreadPoolExecutor(max_workers=self.threads) as executor:
                futures = {executor.submit(self._check_path, target, path, on_log): path for path in paths}
                for future in as_completed(futures):
                    if self._stop_flag:
                        executor.shutdown(wait=False, cancel_futures=True)
                        break
                    completed_paths += 1
                    try:
                        result = future.result()
                    except Exception as e:
                        logger.debug(f"Path fuzz error: {e}")
                        result = None

                    if result:
                        findings.append(result)
                        if on_finding:
                            on_finding(result)

            current_step += 1
            progress = int((current_step / total_steps) * 100)
            completed_msg = f"Directory fuzzing complete ({completed_paths}/{total_paths} paths checked)"

            if on_step_complete:
                on_step_complete(completed_msg, [])
            elif progress_callback:
                progress_callback(progress, completed_msg)

        logger.info(f"Fuzzer completed: {len(findings)} findings from {total_paths} paths")
        return findings


directory_fuzzer = DirectoryFuzzer()
