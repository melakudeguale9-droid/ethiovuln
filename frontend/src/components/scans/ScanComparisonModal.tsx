'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

/* ─── Self-Contained SVG Icons (Zero External Dependency) ──────────────────── */
function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CloseIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ShieldIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ─── Type Definitions ──────────────────────────────────────────────────────── */
export interface ComparisonItem {
  code: string;
  title: string;
  description: string;
  lightSupported: boolean;
  lightNote: string;
  deepSupported: boolean;
  deepNote: string;
}

export interface ComparisonCategory {
  id: string;
  number: number;
  title: string;
  icon: string;
  badge: string;
  summary: string;
  items: ComparisonItem[];
}

/* ─── Complete 8-Vector Taxonomy Comparison Dataset (Light Theme) ──────────── */
export const PENTEST_COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    id: 'passive_scan',
    number: 1,
    title: 'Passive Scan',
    icon: '⚡',
    badge: 'Non-Invasive Surface',
    summary: 'Surface audits & header telemetry without injecting aggressive attack payloads.',
    items: [
      {
        code: '1.1.1',
        title: 'Content Security Policy (CSP) Check',
        description: 'Evaluates script-src, object-src, unsafe-inline & frame-ancestors restrictions.',
        lightSupported: true,
        lightNote: 'Validates header presence & basic syntax',
        deepSupported: true,
        deepNote: 'AST policy bypass simulation & script-src injection tests',
      },
      {
        code: '1.1.2',
        title: 'HTTP Strict Transport Security (HSTS) Check',
        description: 'Validates max-age duration, includeSubDomains & preload eligibility directives.',
        lightSupported: true,
        lightNote: 'Checks header existence and minimum 1-year max-age',
        deepSupported: true,
        deepNote: 'Preload list verification & SSL/TLS downgrade simulation',
      },
      {
        code: '1.1.3',
        title: 'X-Frame-Options & X-Content-Type-Options Audit',
        description: 'Audits Clickjacking defenses and strict MIME-sniffing prevention headers.',
        lightSupported: true,
        lightNote: 'Validates DENY/SAMEORIGIN and nosniff',
        deepSupported: true,
        deepNote: 'Automated iframe embedding POC & MIME-confusion testing',
      },
      {
        code: '1.2.1',
        title: 'Hardcoded API Keys & Secrets Detection',
        description: 'Identifies exposed AWS, OpenAI, Stripe, JWT & private authentication keys in source.',
        lightSupported: false,
        lightNote: 'Not scanned in light scan',
        deepSupported: true,
        deepNote: 'Full JS bundle unpacking & Shannon entropy pattern matching',
      },
      {
        code: '1.2.2',
        title: 'Comments with Sensitive Information Analysis',
        description: 'Extracts developer notes, internal credentials & staging URLs from source code.',
        lightSupported: false,
        lightNote: 'Inspects initial HTML only',
        deepSupported: true,
        deepNote: 'Recursive crawler AST parsing across all JS, CSS, and HTML assets',
      },
      {
        code: '1.2.3',
        title: 'Internal IP & Path Disclosure Audit',
        description: 'Detects internal RFC1918 addresses, physical file paths & server environments.',
        lightSupported: false,
        lightNote: 'Passive response header parsing only',
        deepSupported: true,
        deepNote: 'Stack trace elicitation via malformed parameters',
      },
    ],
  },
  {
    id: 'active_scan',
    number: 2,
    title: 'Active Vulnerability Scan',
    icon: '🔍',
    badge: 'OWASP Top 10 & CVEs',
    summary: 'Active payload injection covering OWASP Top 10, published CVEs, and authentication workflows.',
    items: [
      {
        code: '2.1.1',
        title: 'A01: Broken Access Control',
        description: 'Probes IDOR flaws, vertical privilege escalation & unauthenticated resource access.',
        lightSupported: false,
        lightNote: 'Cannot evaluate authorization passively',
        deepSupported: true,
        deepNote: 'Automated ID tampering & role privilege differential tests',
      },
      {
        code: '2.1.2',
        title: 'A02: Cryptographic Failures',
        description: 'Audits weak cipher suites, cleartext HTTP transmission & broken TLS handshakes.',
        lightSupported: true,
        lightNote: 'Detects cleartext HTTP and expired certificate',
        deepSupported: true,
        deepNote: 'Full SSL/TLS handshake matrix across TLS 1.0, 1.1 & weak ciphers',
      },
      {
        code: '2.1.3',
        title: 'A03: Injection (SQLi, Command, XPath, LDAP)',
        description: 'Injects active polyglot payloads to elicit syntax errors, sleep delays & data leaks.',
        lightSupported: false,
        lightNote: 'No attack payloads sent in light scan',
        deepSupported: true,
        deepNote: 'Multi-vector fuzzing with time-based, boolean & union SQLi',
      },
      {
        code: '2.1.4',
        title: 'A04: Insecure Design & Anti-Automation',
        description: 'Evaluates rate-limiting absence, credential stuffing gates & password recovery logic.',
        lightSupported: false,
        lightNote: 'Requires stateful multi-request interaction',
        deepSupported: true,
        deepNote: 'High-frequency burst testing & workflow logic fuzzing',
      },
      {
        code: '2.1.5',
        title: 'A05: Security Misconfiguration',
        description: 'Identifies verbose debug stack traces, default passwords & unhandled HTTP verbs.',
        lightSupported: true,
        lightNote: 'Detects exposed Server & X-Powered-By banners',
        deepSupported: true,
        deepNote: 'Probes hidden admin paths, debug routes & default configs',
      },
      {
        code: '2.1.6',
        title: 'A06: Vulnerable & Outdated Components',
        description: 'Correlates installed software versions with known vulnerabilities in CVE databases.',
        lightSupported: true,
        lightNote: 'Basic version banner extraction',
        deepSupported: true,
        deepNote: 'Retire.js client fingerprinting + 8,000+ Nuclei CVE signatures',
      },
      {
        code: '2.1.7',
        title: 'A07: Identification & Authentication Failures',
        description: 'Audits session fixation, brute force vulnerability & weak credential policies.',
        lightSupported: false,
        lightNote: 'Requires active authentication state',
        deepSupported: true,
        deepNote: 'Token fixation checks, dictionary attack & lockout verification',
      },
      {
        code: '2.1.8',
        title: 'A08: Software & Data Integrity Failures',
        description: 'Verifies Subresource Integrity (SRI) on CDNs and audits insecure deserialization.',
        lightSupported: true,
        lightNote: 'Checks script tags for integrity attribute',
        deepSupported: true,
        deepNote: 'Unsafe deserialization gadget probing (Java/PHP/Node.js)',
      },
      {
        code: '2.1.9',
        title: 'A09: Security Logging & Monitoring Failures',
        description: 'Tests whether aggressive scan probes trigger defensive rate-limiting and WAF alarms.',
        lightSupported: false,
        lightNote: 'Requires high-volume probe telemetry',
        deepSupported: true,
        deepNote: 'Threshold anomaly injection & WAF behavior verification',
      },
      {
        code: '2.1.10',
        title: 'A10: Server-Side Request Forgery (SSRF)',
        description: 'Probes internal RFC1918 subnets & AWS/GCP cloud metadata endpoints (169.254.169.254).',
        lightSupported: false,
        lightNote: 'Requires out-of-band listener server',
        deepSupported: true,
        deepNote: 'Out-of-band OAST DNS/HTTP callbacks + cloud metadata probe',
      },
      {
        code: '2.2.1',
        title: 'Software Version Fingerprinting',
        description: 'Fingerprints exact server, framework, reverse-proxy and database releases.',
        lightSupported: true,
        lightNote: 'Passive HTTP response header reading',
        deepSupported: true,
        deepNote: 'Favicon hash matching, asset hashes & endpoint signature diffing',
      },
      {
        code: '2.2.2',
        title: 'CPE & CVE Database Matching',
        description: 'Cross-checks detected software against the National Vulnerability Database (NVD).',
        lightSupported: false,
        lightNote: 'Limited to generic high-level server alerts',
        deepSupported: true,
        deepNote: 'Correlates CPEs with 8,000+ verified Nuclei CVE templates',
      },
      {
        code: '2.2.3',
        title: 'CVSS Severity Score Assessment',
        description: 'Calculates standardized CVSS v3.1 base score, attack vector, and CWE classification.',
        lightSupported: false,
        lightNote: 'Static informational severity flags only',
        deepSupported: true,
        deepNote: 'Formal CVSS v3.1 base score vector with reproduction curl',
      },
      {
        code: '2.3.1',
        title: 'Session Fixation & Hijacking Checks',
        description: 'Validates that session cookies are regenerated upon authentication & have Secure/HttpOnly.',
        lightSupported: true,
        lightNote: 'Checks Secure and HttpOnly cookie flags',
        deepSupported: true,
        deepNote: 'Pre/post-login session token rotation validation',
      },
      {
        code: '2.3.2',
        title: 'Weak Password Policies & Brute Force Testing',
        description: 'Evaluates lockouts, rate limiting, and complexity enforcement on login forms.',
        lightSupported: false,
        lightNote: 'No credential submission permitted in light scan',
        deepSupported: true,
        deepNote: 'Controlled rate-limit probing & dictionary lockout audit',
      },
      {
        code: '2.3.3',
        title: 'Insecure Password Reset & Recovery',
        description: 'Identifies predictable reset tokens and host-header injection during password recovery.',
        lightSupported: false,
        lightNote: 'Multi-step recovery flow not probed',
        deepSupported: true,
        deepNote: 'Host-header poisoning & token entropy analysis',
      },
    ],
  },
  {
    id: 'deep_recon',
    number: 3,
    title: 'Deep Recon & Fuzzing',
    icon: '🌐',
    badge: 'Content & Path Discovery',
    summary: 'Concurrent endpoint fuzzing, CORS auditing, hidden directory discovery, and server-side file inclusion.',
    items: [
      {
        code: '3.1.1',
        title: 'Wildcard Origin (*) Misconfiguration',
        description: 'Checks if Access-Control-Allow-Origin header allows unrestricted third-party domain reads.',
        lightSupported: true,
        lightNote: 'Reads ACAO header on static responses',
        deepSupported: true,
        deepNote: 'Injects arbitrary custom origin headers to verify reflection',
      },
      {
        code: '3.1.2',
        title: 'Null Origin Reflection Check',
        description: 'Tests if Origin: null is accepted, exposing local sandboxed iframe bypasses.',
        lightSupported: false,
        lightNote: 'Does not spoof request headers in light scan',
        deepSupported: true,
        deepNote: 'Sends Origin: null & checks response reflection',
      },
      {
        code: '3.1.3',
        title: 'Credential Leakage via Allow-Credentials Audit',
        description: 'Flags dangerous combination of Access-Control-Allow-Credentials: true with wildcards.',
        lightSupported: false,
        lightNote: 'Single-header passive check only',
        deepSupported: true,
        deepNote: 'Multi-header credential theft proof of concept',
      },
      {
        code: '3.2.1',
        title: 'JavaScript Libraries & Frameworks Version Audit',
        description: 'Scans imported client-side scripts (React, jQuery, Lodash, Angular) for known CVEs.',
        lightSupported: false,
        lightNote: 'Client scripts not parsed',
        deepSupported: true,
        deepNote: 'AST regex extraction and Retire.js vulnerability correlation',
      },
      {
        code: '3.2.2',
        title: 'CMS & Server Software Fingerprinting',
        description: 'Uncovers exact WordPress, Drupal, Joomla, Nginx & Apache version signatures.',
        lightSupported: true,
        lightNote: 'Checks meta generator tags',
        deepSupported: true,
        deepNote: 'Plugin, theme, and static asset fingerprint matching',
      },
      {
        code: '3.3.1',
        title: 'Server-Side Request Forgery (SSRF) Fuzzing',
        description: 'Fuzzes parameters accepting URLs with internal IPs (127.0.0.1, 10.0.0.0/8, 172.16.0.0/12).',
        lightSupported: false,
        lightNote: 'No payload injection in light scan',
        deepSupported: true,
        deepNote: 'Fuzzes query parameters with OAST webhooks and metadata IPs',
      },
      {
        code: '3.3.2',
        title: 'Local File Inclusion (LFI) Testing',
        description: 'Injects directory traversal sequences (../../../../etc/passwd, win.ini) to leak local files.',
        lightSupported: false,
        lightNote: 'No path traversal payloads sent',
        deepSupported: true,
        deepNote: 'Deep path traversal fuzzing with null-byte and URL-encoding bypasses',
      },
      {
        code: '3.3.3',
        title: 'Remote File Inclusion (RFI) Testing',
        description: 'Tests if parameters execute code loaded from remote external HTTP/SMB shares.',
        lightSupported: false,
        lightNote: 'No remote URL injection',
        deepSupported: true,
        deepNote: 'Safely probes external canary resources to verify execution',
      },
      {
        code: '3.4.1',
        title: 'Directory & Wordlist Brute-Forcing',
        description: 'High-speed enumeration of unlinked admin interfaces, dev portals, and APIs.',
        lightSupported: false,
        lightNote: 'No brute force queries sent in light scan',
        deepSupported: true,
        deepNote: 'Concurrent multi-threaded path fuzzing with 5,000+ sensitive paths',
      },
      {
        code: '3.4.2',
        title: 'Sensitive Backup & Config Files Discovery (.git, .env)',
        description: 'Detects exposed .git repositories, .env files, database dumps, and config backups.',
        lightSupported: false,
        lightNote: 'Does not probe hidden paths',
        deepSupported: true,
        deepNote: 'Verifies .git/HEAD, .env, docker-compose.yml & sql backups',
      },
    ],
  },
  {
    id: 'api_security',
    number: 4,
    title: 'API Security & Web Services',
    icon: '🔌',
    badge: 'OWASP API Top 10',
    summary: 'Targeted assessment for RESTful APIs and GraphQL endpoints matching OWASP API Top 10 standards.',
    items: [
      {
        code: '4.1.1',
        title: 'API1: Broken Object Level Authorization (BOLA)',
        description: 'Attempts to access other users’ records by manipulating IDs in REST API endpoints.',
        lightSupported: false,
        lightNote: 'Requires endpoint parameter mutation',
        deepSupported: true,
        deepNote: 'Permutates numeric, GUID & UUID parameters across CRUD verbs',
      },
      {
        code: '4.1.2',
        title: 'API2: Broken Authentication',
        description: 'Audits missing authentication checks, weak API keys, and unvalidated Bearer tokens.',
        lightSupported: false,
        lightNote: 'Does not test unauthorized API endpoints',
        deepSupported: true,
        deepNote: 'Strips Authorization headers & tests key reuse across endpoints',
      },
      {
        code: '4.1.3',
        title: 'API3: Broken Object Property Level Authorization (Mass Assignment)',
        description: 'Tests Mass Assignment vulnerabilities by injecting privileged JSON fields (isAdmin: true).',
        lightSupported: false,
        lightNote: 'No JSON payload modification',
        deepSupported: true,
        deepNote: 'Injects role, permissions, and billing flags into POST/PUT requests',
      },
      {
        code: '4.1.4',
        title: 'API4: Unrestricted Resource Consumption',
        description: 'Tests absence of execution timeouts, memory exhaustion, and excessive pagination limits.',
        lightSupported: false,
        lightNote: 'No heavy parameter fuzzing',
        deepSupported: true,
        deepNote: 'Tests ?limit=999999, large file uploads & concurrent batching',
      },
      {
        code: '4.1.5',
        title: 'API5: Broken Function Level Authorization (BFLA)',
        description: 'Attempts to invoke administrative routes (/api/v1/admin/*) using standard user permissions.',
        lightSupported: false,
        lightNote: 'No role differential testing',
        deepSupported: true,
        deepNote: 'Role permutation against administrative endpoints',
      },
      {
        code: '4.1.6',
        title: 'API6: Unrestricted Access to Sensitive Business Flows',
        description: 'Verifies anti-automation protections on checkout, coupon redemption, and bulk actions.',
        lightSupported: false,
        lightNote: 'Cannot automate business flows',
        deepSupported: true,
        deepNote: 'Sequential multi-request automation to identify business logic flaws',
      },
      {
        code: '4.1.7',
        title: 'API7: Server-Side Request Forgery in APIs',
        description: 'Fuzzes webhook registrations, image import URLs, and third-party integrations.',
        lightSupported: false,
        lightNote: 'No webhook endpoints probed',
        deepSupported: true,
        deepNote: 'OAST listener injection across webhook & export endpoints',
      },
      {
        code: '4.1.8',
        title: 'API8: Security Misconfiguration in APIs',
        description: 'Discovers unhandled HTTP methods (TRACE/PUT/DELETE) and exposed OpenAPI/Swagger specs.',
        lightSupported: true,
        lightNote: 'Identifies public swagger-ui.html and /v2/api-docs',
        deepSupported: true,
        deepNote: 'Parses OpenAPI spec and automatically maps all routes for active attack',
      },
      {
        code: '4.1.9',
        title: 'API9: Improper Inventory Management',
        description: 'Uncovers shadow, debug, and deprecated API versions (/v1/, /v2/, /beta/, /legacy/).',
        lightSupported: false,
        lightNote: 'Does not brute-force API paths',
        deepSupported: true,
        deepNote: 'Discovers unpatched older API versions running alongside current API',
      },
      {
        code: '4.1.10',
        title: 'API10: Unsafe Consumption of APIs',
        description: 'Fuzzes integration endpoints with malformed upstream JSON/XML data.',
        lightSupported: false,
        lightNote: 'No malformed payloads sent',
        deepSupported: true,
        deepNote: 'Simulates untrusted upstream microservice responses',
      },
      {
        code: '4.2.1',
        title: 'JWT "none" Algorithm Attack Check',
        description: 'Attempts to forge JWT tokens by modifying the header algorithm field to "none".',
        lightSupported: false,
        lightNote: 'Tokens not manipulated',
        deepSupported: true,
        deepNote: 'Crafts alg: none, None, NONE tokens with stripped signatures',
      },
      {
        code: '4.2.2',
        title: 'Weak HMAC Secret Brute-Forcing',
        description: 'Tests whether HS256 JWT tokens use dictionary secrets (secret, password, admin, 123456).',
        lightSupported: false,
        lightNote: 'No cryptographic cracking performed',
        deepSupported: true,
        deepNote: 'Offline dictionary verification using top 100k password list',
      },
      {
        code: '4.2.3',
        title: 'Missing Expiration & Claim Validation',
        description: 'Checks if server validates exp (expiration), nbf (not before), and iss (issuer) claims.',
        lightSupported: false,
        lightNote: 'Does not replay expired tokens',
        deepSupported: true,
        deepNote: 'Sends expired & manipulated claim tokens to verify rejection',
      },
      {
        code: '4.3.1',
        title: 'GraphQL Introspection Query Abuse Check',
        description: 'Queries __schema and __type to verify whether production schema introspection is disabled.',
        lightSupported: true,
        lightNote: 'Sends single introspection query to /graphql',
        deepSupported: true,
        deepNote: 'Full schema extraction and automated field attack mapping',
      },
      {
        code: '4.3.2',
        title: 'GraphQL Query Depth & Complexity Limit Testing',
        description: 'Tests whether backend rejects recursive cyclic queries (e.g., author { posts { author } }).',
        lightSupported: false,
        lightNote: 'No recursive queries sent',
        deepSupported: true,
        deepNote: 'Injects nested queries with depth > 15 to test resource limits',
      },
      {
        code: '4.3.3',
        title: 'GraphQL Batching & Denial of Service (DoS)',
        description: 'Tests if endpoint accepts multi-query arrays or alias overloading leading to server freeze.',
        lightSupported: false,
        lightNote: 'No batching tests sent',
        deepSupported: true,
        deepNote: 'Tests array batching and field alias multiplication limits',
      },
    ],
  },
  {
    id: 'advanced_injection',
    number: 5,
    title: 'Advanced Injection & Client-Side Attacks',
    icon: '💉',
    badge: 'Deep Exploit Proof',
    summary: 'Blind, Boolean, and Time-based SQLi, DOM/Stored XSS, and Server-Side Template Injection probes.',
    items: [
      {
        code: '5.1.1',
        title: 'Boolean-based & Time-based Blind SQLi',
        description: 'Injects conditional delay payloads (SLEEP(5), pg_sleep(5), WAITFOR DELAY) to verify SQLi.',
        lightSupported: false,
        lightNote: 'Light scan never delays HTTP connections',
        deepSupported: true,
        deepNote: 'Multi-database blind time verification (MySQL, Postgres, MSSQL, Oracle)',
      },
      {
        code: '5.1.2',
        title: 'Union-based & Error-based SQLi',
        description: 'Extracts database versions and column counts via UNION SELECT and syntax error triggers.',
        lightSupported: false,
        lightNote: 'No database exploit payloads sent',
        deepSupported: true,
        deepNote: 'Dynamic column enumeration & dialect error parsing',
      },
      {
        code: '5.1.3',
        title: 'NoSQL Operator Injection Testing',
        description: 'Injects MongoDB/CouchDB query operators ($ne, $gt, $where, $regex) into JSON parameters.',
        lightSupported: false,
        lightNote: 'No JSON manipulation',
        deepSupported: true,
        deepNote: 'Bypasses authentication filters using {"$ne": null} injection',
      },
      {
        code: '5.2.1',
        title: 'Stored XSS Audit',
        description: 'Submits unique canary strings into database fields and verifies persistent script execution.',
        lightSupported: false,
        lightNote: 'Light scan is non-invasive and does not submit form data',
        deepSupported: true,
        deepNote: 'Crawler-correlated canary verification across all rendered pages',
      },
      {
        code: '5.2.2',
        title: 'Reflected XSS Audit',
        description: 'Fuzzes URL query parameters with contextual HTML, JavaScript attribute, and event payloads.',
        lightSupported: false,
        lightNote: 'No XSS payloads injected in light scan',
        deepSupported: true,
        deepNote: 'Context-aware WAF bypass encoding with polyglot triggers',
      },
      {
        code: '5.2.3',
        title: 'DOM-based XSS Audit',
        description: 'Traces untrusted sources (location.hash, search, referrer) into dangerous sinks (innerHTML, eval).',
        lightSupported: false,
        lightNote: 'Requires headless browser execution engine',
        deepSupported: true,
        deepNote: 'Headless browser execution tracing taint flow through JavaScript DOM',
      },
      {
        code: '5.3.1',
        title: 'Template Engine Identification (SSTI)',
        description: 'Differentiates template engines using mathematical polyglots (${7*7}, {{7*7}}, <%= 7*7 %>).',
        lightSupported: false,
        lightNote: 'No template payloads injected',
        deepSupported: true,
        deepNote: 'Distinguishes Jinja2, Twig, Freemarker, Velocity, Smarty & ERB',
      },
      {
        code: '5.3.2',
        title: 'Remote Code Execution via SSTI Testing',
        description: 'Audits template engine sandbox escapes to prove code execution risks.',
        lightSupported: false,
        lightNote: 'No RCE payloads sent',
        deepSupported: true,
        deepNote: 'Benign proof-of-concept testing for object introspection escapes',
      },
    ],
  },
  {
    id: 'infra_security',
    number: 6,
    title: 'Infrastructure & Container Security',
    icon: '🐳',
    badge: 'Docker & Cloud Storage',
    summary: 'Docker daemon misconfigurations, cloud storage bucket permissions, and SSL/TLS cipher suite audits.',
    items: [
      {
        code: '6.1.1',
        title: 'Privileged Containers & Root User Checks',
        description: 'Detects container host leaks, missing user namespaces, and container breakout vectors.',
        lightSupported: false,
        lightNote: 'Cannot probe container metadata',
        deepSupported: true,
        deepNote: 'Identifies exposed /proc/self/cgroup, privileged capabilities & root execution',
      },
      {
        code: '6.1.2',
        title: 'Exposed Docker Daemon Socket (/var/run/docker.sock)',
        description: 'Audits exposed TCP ports 2375/2376 and web applications mounting the host Docker socket.',
        lightSupported: false,
        lightNote: 'No infrastructure port probing',
        deepSupported: true,
        deepNote: 'Tests Docker API /version & /containers/json unauthorized access',
      },
      {
        code: '6.2.1',
        title: 'Publicly Accessible AWS S3 / Azure Blob Storage',
        description: 'Extracts cloud storage links from frontend code and checks anonymous read permissions.',
        lightSupported: true,
        lightNote: 'Extracts referenced s3.amazonaws.com URLs in HTML',
        deepSupported: true,
        deepNote: 'Automated bucket permission testing (GET, LIST, HEAD requests)',
      },
      {
        code: '6.2.2',
        title: 'Misconfigured Bucket ACLs & Write Permissions',
        description: 'Tests whether AllUsers or AuthenticatedUsers have permission to upload/overwrite files.',
        lightSupported: false,
        lightNote: 'Does not test bucket write permissions',
        deepSupported: true,
        deepNote: 'Safely probes PUT/ACL permissions without modifying existing data',
      },
      {
        code: '6.3.1',
        title: 'Expired or Self-Signed Certificates Audit',
        description: 'Validates complete X.509 certificate trust chains, SAN hostnames, and expiration dates.',
        lightSupported: true,
        lightNote: 'Validates CA chain and certificate expiration date',
        deepSupported: true,
        deepNote: 'Audits Certificate Transparency logs, OCSP stapling & revocation',
      },
      {
        code: '6.3.2',
        title: 'Weak Ciphers & TLS 1.0/1.1 Protocol Support',
        description: 'Initiates handshakes to detect obsolete ciphers (RC4, 3DES, CBC) and legacy protocols.',
        lightSupported: false,
        lightNote: 'Checks default negotiated cipher only',
        deepSupported: true,
        deepNote: 'Full cipher enumeration testing SWEET32, POODLE, BEAST & DROWN vulnerabilities',
      },
    ],
  },
  {
    id: 'full_enterprise',
    number: 7,
    title: 'Full Enterprise Scan',
    icon: '🚀',
    badge: 'All Vectors Orchestration',
    summary: 'Automated end-to-end orchestration running all modules with consolidated CVSS v3.1 enterprise reporting.',
    items: [
      {
        code: '7.1.1',
        title: 'Full Automated Scan Orchestration (Run All Modules)',
        description: 'Parallel coordinated execution of Nuclei YAML templates, OWASP ZAP spidering & Smart Fuzzer.',
        lightSupported: false,
        lightNote: 'Light scan runs isolated 60s passive checks',
        deepSupported: true,
        deepNote: 'Coordinated execution of all 8 assessment vectors with adaptive rate pacing',
      },
      {
        code: '7.1.2',
        title: 'Consolidated Enterprise Severity Reporting',
        description: 'Unified executive summary, MITRE CWE mapping, reproduction curl commands, and PDF export.',
        lightSupported: false,
        lightNote: 'Basic on-screen summary without PDF export',
        deepSupported: true,
        deepNote: 'Full compliance-ready PDF export (SOC 2, ISO 27001, OWASP Top 10)',
      },
    ],
  },
  {
    id: 'custom_config',
    number: 8,
    title: 'Custom Configuration',
    icon: '⚙️',
    badge: 'Granular Scoping',
    summary: 'Granular parameter selection and custom rule tuning across all 14 individual assessment modules.',
    items: [
      {
        code: '8.1',
        title: 'Missing Security Headers (8.1.1)',
        description: 'Custom tuning for CSP, HSTS, X-Frame-Options & Permissions Policy audits.',
        lightSupported: true,
        lightNote: 'Header presence audit',
        deepSupported: true,
        deepNote: 'Full policy bypass validation',
      },
      {
        code: '8.2',
        title: 'Sensitive Data Exposure (8.2.1)',
        description: 'Selectable regex modules for API keys, secret tokens & internal path leaks.',
        lightSupported: false,
        lightNote: 'Not included in light scan',
        deepSupported: true,
        deepNote: 'Deep JS bundle AST extraction',
      },
      {
        code: '8.3',
        title: 'OWASP Top 10 Vulnerabilities (8.3.1)',
        description: 'Granular checkbox toggles for A01 through A10 vulnerability test suites.',
        lightSupported: false,
        lightNote: 'Active injection disabled',
        deepSupported: true,
        deepNote: 'Complete OWASP Top 10 active probe suite',
      },
      {
        code: '8.4',
        title: 'Known CVEs (8.4.1)',
        description: 'Filterable CVE severity filters (Critical, High, Medium, Low) and CVE year ranges.',
        lightSupported: false,
        lightNote: 'Banner matching only',
        deepSupported: true,
        deepNote: 'Full 8,000+ Nuclei CVE template library',
      },
      {
        code: '8.5',
        title: 'Authentication & Session Flaws (8.5.1)',
        description: 'Configurable login test credentials, session cookie names & brute force rates.',
        lightSupported: false,
        lightNote: 'Auth testing disabled',
        deepSupported: true,
        deepNote: 'Session fixation & brute force testing',
      },
      {
        code: '8.6',
        title: 'Insecure CORS Policies (8.6.1)',
        description: 'Custom allowed origin tests, null reflection, and credential leak audits.',
        lightSupported: true,
        lightNote: 'Static response audit',
        deepSupported: true,
        deepNote: 'Active origin spoofing probes',
      },
      {
        code: '8.7',
        title: 'Outdated & Vulnerable Components (8.7.1)',
        description: 'Client-side library vulnerability scanner with configurable Retire.js rules.',
        lightSupported: false,
        lightNote: 'Asset parsing disabled',
        deepSupported: true,
        deepNote: 'Automated JS library & CMS audit',
      },
      {
        code: '8.8',
        title: 'SSRF, LFI & RFI (8.8.1)',
        description: 'Configurable internal IP target ranges and custom out-of-band listener URLs.',
        lightSupported: false,
        lightNote: 'Payload injection disabled',
        deepSupported: true,
        deepNote: 'Server-side request & file inclusion fuzzing',
      },
      {
        code: '8.9',
        title: 'Hidden Directories & Admin Panels (8.9.1)',
        description: 'Custom wordlist upload, thread concurrency control (1-50 req/sec), and file extension filters.',
        lightSupported: false,
        lightNote: 'No path brute-forcing',
        deepSupported: true,
        deepNote: 'High-speed concurrent path discovery',
      },
      {
        code: '8.10',
        title: 'OWASP API Top 10 Flaws (8.10.1)',
        description: 'API authentication headers, OpenAPI/Swagger JSON upload & BOLA ID ranges.',
        lightSupported: false,
        lightNote: 'API fuzzing disabled',
        deepSupported: true,
        deepNote: 'Full OWASP API Top 10 attack suite',
      },
      {
        code: '8.11',
        title: 'JWT & Token Validation Weaknesses (8.11.1)',
        description: 'Configurable wordlists for secret cracking and alg: none attack variations.',
        lightSupported: false,
        lightNote: 'Crypto testing disabled',
        deepSupported: true,
        deepNote: 'JWT signature bypass & HMAC brute-force',
      },
      {
        code: '8.12',
        title: 'Advanced SQL & NoSQL Injection (8.12.1)',
        description: 'Selectable SQL dialects (Postgres, MySQL, SQLite, Oracle) and blind time thresholds.',
        lightSupported: false,
        lightNote: 'Injection testing disabled',
        deepSupported: true,
        deepNote: 'Blind, union, error & NoSQL injection suite',
      },
      {
        code: '8.13',
        title: 'Cross-Site Scripting (XSS) (8.13.1)',
        description: 'Configurable headless browser DOM audit, stored XSS canary strings & WAF bypass sets.',
        lightSupported: false,
        lightNote: 'XSS probing disabled',
        deepSupported: true,
        deepNote: 'DOM, Stored, and Reflected XSS suite',
      },
      {
        code: '8.14',
        title: 'Docker & Infrastructure Misconfigurations (8.14.1)',
        description: 'Targeted scanning for exposed Docker sockets, public AWS S3 buckets & weak TLS ciphers.',
        lightSupported: false,
        lightNote: 'Infra testing disabled',
        deepSupported: true,
        deepNote: 'Container & cloud storage exposure audits',
      },
    ],
  },
];

/* ─── Props Interface ──────────────────────────────────────────────────────── */
export interface ScanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryId?: string;
  onSelectMode?: (modeId: string) => void;
}

/* ─── Pentest-Tools Exact Light Theme Comparison Modal Component ───────────── */
export function ScanComparisonModal({
  isOpen,
  onClose,
  initialCategoryId = 'all',
  onSelectMode,
}: ScanComparisonModalProps) {
  const [selectedCatId, setSelectedCatId] = useState<string>(initialCategoryId);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered categories based on selected category tab and search query
  const filteredCategories = useMemo(() => {
    return PENTEST_COMPARISON_CATEGORIES.map((cat) => {
      if (selectedCatId !== 'all' && cat.id !== selectedCatId) {
        return null;
      }

      const matchedItems = cat.items.filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.deepNote.toLowerCase().includes(q)
        );
      });

      if (matchedItems.length === 0) return null;

      return {
        ...cat,
        items: matchedItems,
      };
    }).filter(Boolean) as ComparisonCategory[];
  }, [selectedCatId, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-black/75 transition-all animate-fadeIn"
      onClick={onClose}
    >
      {/* ─── Pure White Card Container (Matching Pentest-Tools) ──────────────── */}
      <div
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden relative text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Modal Header (Pure White Surface) ───────────────────────────── */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <ShieldIcon className="w-5 h-5 text-amber-600" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-normal">
                Enable Deep Scans
              </h2>
              <span className="ml-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Full Exploit Proof
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
              Light scan gives you surface results in 60s. Upgrade to Deep Scan to prove exploitability, uncover high-risk CVEs, and scan authenticated workflows across all 8 assessment categories.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-transparent"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Controls Ribbon (Search & Category Selector) ────────────────── */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCatId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedCatId === 'all'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              All 8 Vectors
            </button>
            {PENTEST_COMPARISON_CATEGORIES.map((cat) => {
              const isSelected = selectedCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${isSelected
                    ? 'bg-amber-400 text-gray-950 font-bold shadow-sm'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  <span>{cat.icon}</span>
                  <span>0{cat.number}. {cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search checks, CVEs, OWASP..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* ─── Scrollable Table Body ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white">

          {/* Table Header Row (Pentest-Tools Style) */}
          <div className="sticky top-0 z-20 grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-700">
            <div className="col-span-12 sm:col-span-6 md:col-span-6">
              Testing areas
            </div>
            <div className="col-span-6 sm:col-span-3 md:col-span-3 text-left">
              <span className="inline-flex items-center gap-1.5 text-gray-700">
                Light scan
              </span>
            </div>
            <div className="col-span-6 sm:col-span-3 md:col-span-3 text-left">
              <span className="inline-flex items-center gap-1.5 text-gray-900 font-extrabold">
                Deep scan
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                  RECOMMENDED
                </span>
              </span>
            </div>
          </div>

          {/* Category Sections */}
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-sm">No security checks match &ldquo;{searchQuery}&rdquo;.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCatId('all');
                }}
                className="mt-3 text-xs font-semibold text-amber-700 hover:underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="divide-y divide-gray-100">
                {/* Category Group Header Band */}
                <div className="px-6 py-3 bg-gray-50/80 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-l-4 border-amber-400">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{category.icon}</span>
                    <h3 className="text-sm font-extrabold text-gray-900">
                      0{category.number}. {category.title}
                    </h3>
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      — {category.summary}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200 shadow-2xs self-start sm:self-auto">
                    {category.badge}
                  </span>
                </div>

                {/* Sub-Check Rows */}
                {category.items.map((item) => (
                  <div
                    key={item.code}
                    className="grid grid-cols-12 gap-4 px-6 py-3.5 hover:bg-gray-50/70 transition-colors text-xs items-center"
                  >
                    {/* Column 1: Testing Area & Code */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                          {item.code}
                        </span>
                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-normal pr-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Column 2: Light Scan Status */}
                    <div className="col-span-6 sm:col-span-3 md:col-span-3">
                      {item.lightSupported ? (
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-900 border border-gray-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            <CheckIcon className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <span className="font-bold text-gray-900 block text-[11px]">
                              Supported
                            </span>
                            <span className="text-[10px] text-gray-500 block leading-tight">
                              {item.lightNote}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-gray-400">
                          <span className="w-5 h-5 rounded-full bg-gray-50 text-gray-400 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                            <CrossIcon className="w-3 h-3" />
                          </span>
                          <div>
                            <span className="font-medium text-gray-400 block text-[11px]">
                              Deep scan only
                            </span>
                            <span className="text-[10px] text-gray-400 block leading-tight">
                              {item.lightNote}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Column 3: Deep Scan Status */}
                    <div className="col-span-6 sm:col-span-3 md:col-span-3">
                      {item.deepSupported ? (
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            <CheckIcon className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <span className="font-bold text-emerald-900 block text-[11px]">
                              Full Exploit Proof
                            </span>
                            <span className="text-[10px] text-gray-600 block leading-tight">
                              {item.deepNote}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-gray-400">
                          <span className="w-5 h-5 rounded-full bg-gray-50 text-gray-400 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                            <CrossIcon className="w-3 h-3" />
                          </span>
                          <div>
                            <span className="font-medium text-gray-400 block text-[11px]">
                              Excluded
                            </span>
                            <span className="text-[10px] text-gray-400 block leading-tight">
                              {item.deepNote}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* ─── Modal Footer with Perks Checklist & Amber CTA Button ────────── */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-5 text-xs">

          {/* Perks Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-gray-700 text-xs w-full md:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Cancel anytime during 7-day trial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>All 8 assessment vectors included</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Zero false-positive exploit validation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Executive & technical PDF reports</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-2 transition-colors order-2 sm:order-1"
            >
              Continue with free Light scan
            </button>

            <Link
              href="/dashboard/scans/new?mode=full_enterprise&trial=true"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-950 font-extrabold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5 order-1 sm:order-2"
            >
              Start 7-day free trial
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
