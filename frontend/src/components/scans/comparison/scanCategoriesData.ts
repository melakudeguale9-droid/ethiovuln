// EthioVuln — 8 Core Scan Categories Data & Comparison Taxonomy
// High-contrast, accessibility-verified dataset for Light vs Deep scan matrix

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface ComparisonCheckItem {
  code: string;
  title: string;
  description: string;
  lightSupported: boolean;
  lightNote: string;
  deepSupported: boolean;
  deepNote: string;
  severity: SeverityLevel;
  cwe?: string;
  engine: string;
}

export interface ScanCategoryData {
  id: string;
  number: number;
  title: string;
  icon: string;
  badge: string;
  color: string;
  accentBg: string;
  summary: string;
  backendEngine: 'nuclei_only' | 'zap_only' | 'fuzz_only' | 'nuclei_zap' | 'full';
  items: ComparisonCheckItem[];
}

export const SCAN_CATEGORIES_DATA: ScanCategoryData[] = [
  // ─── Category 1: Passive Scan ─────────────────────────────────────────────
  {
    id: 'passive_scan',
    number: 1,
    title: 'Passive Scan',
    icon: '⚡',
    badge: 'Non-Invasive Surface',
    color: '#00E5FF',
    accentBg: 'rgba(0, 229, 255, 0.12)',
    summary: 'Rapid HTTP header evaluation and source inspection without injecting offensive attack payloads.',
    backendEngine: 'nuclei_only',
    items: [
      {
        code: '1.1',
        title: 'Missing Security Headers (CSP, HSTS, X-Frame-Options)',
        description: 'Evaluates Content-Security-Policy directives, Strict-Transport-Security max-age, X-Frame-Options anti-clickjacking, and MIME nosniff headers.',
        lightSupported: true,
        lightNote: 'Basic passive presence check on HTTP response headers',
        deepSupported: true,
        deepNote: 'Full AST policy bypass verification, iframe clickjacking simulation, and SSL downgrade probing',
        severity: 'Medium',
        cwe: 'CWE-1021 / CWE-693',
        engine: 'Nuclei & Header Auditor',
      },
      {
        code: '1.2',
        title: 'Sensitive Data Exposure & API Keys in Source',
        description: 'Detects hardcoded secrets, AWS/OpenAI tokens, internal IP addresses, staging URLs, and developer credentials leaked in client bundles.',
        lightSupported: true,
        lightNote: 'Scans initial root HTML and top-level response headers',
        deepSupported: true,
        deepNote: 'Unpacks all JavaScript chunks, sourcemaps, Shannon entropy scanner, and regex token matchers',
        severity: 'High',
        cwe: 'CWE-200 / CWE-312',
        engine: 'Nuclei & Secret Matcher',
      },
    ],
  },

  // ─── Category 2: Active Vulnerability Scan ───────────────────────────────
  {
    id: 'active_scan',
    number: 2,
    title: 'Active Vulnerability Scan',
    icon: '🔍',
    badge: 'OWASP Top 10 Active',
    color: '#38BDF8',
    accentBg: 'rgba(56, 189, 248, 0.12)',
    summary: 'Dynamic application crawler injecting test payloads to discover OWASP Top 10 flaws and known CVEs.',
    backendEngine: 'zap_only',
    items: [
      {
        code: '2.1',
        title: 'OWASP Top 10 Vulnerabilities (A01 to A10)',
        description: 'Systematically probes for Broken Access Control, Cryptographic Failures, Insecure Design, Security Misconfiguration, and Vulnerable Outdated Components.',
        lightSupported: false,
        lightNote: 'Omitted to avoid intrusive active fuzzing on quick runs',
        deepSupported: true,
        deepNote: 'Full active crawl spidering all HTML forms, input vectors, headers, and parameterized requests',
        severity: 'Critical',
        cwe: 'OWASP A01:2021 - A10:2021',
        engine: 'OWASP ZAP Engine',
      },
      {
        code: '2.2',
        title: 'Known CVEs & Software Version Matching',
        description: 'Correlates exposed server signatures, application frameworks, and third-party libraries against 8,000+ public vulnerability databases (NVD).',
        lightSupported: true,
        lightNote: 'Server banner and meta generator tag inspection',
        deepSupported: true,
        deepNote: 'Exact library fingerprinting, patch-level diffing, and proof-of-concept exploit verification',
        severity: 'High',
        cwe: 'CWE-1395',
        engine: 'Nuclei Template Engine',
      },
      {
        code: '2.3',
        title: 'Authentication & Session Flaws Audit',
        description: 'Inspects cookie security flags (HttpOnly, Secure, SameSite), session token randomness, fixation vulnerabilities, and unauthenticated endpoint access.',
        lightSupported: false,
        lightNote: 'Requires session state tracking and active parameter manipulation',
        deepSupported: true,
        deepNote: 'Multi-step login spider, token replay fuzzing, and concurrent session termination verification',
        severity: 'High',
        cwe: 'CWE-384 / CWE-287',
        engine: 'OWASP ZAP & Custom Fuzzer',
      },
    ],
  },

  // ─── Category 3: Deep Recon & Fuzzing ────────────────────────────────────
  {
    id: 'deep_recon',
    number: 3,
    title: 'Deep Recon & Fuzzing',
    icon: '🌐',
    badge: 'Heuristic Directory Fuzzing',
    color: '#6366F1',
    accentBg: 'rgba(99, 102, 241, 0.12)',
    summary: 'Concurrent directory brute-forcing, CORS misconfiguration analysis, and server-side file inclusion audits.',
    backendEngine: 'fuzz_only',
    items: [
      {
        code: '3.1',
        title: 'Insecure CORS Policies & Wildcard Checks',
        description: 'Tests Access-Control-Allow-Origin headers with arbitrary origins, null values, and wildcard credentials reflecting private user resources.',
        lightSupported: true,
        lightNote: 'Checks default Access-Control-Allow-Origin header response',
        deepSupported: true,
        deepNote: 'Origin reflection attack injection, preflight OPTIONS fuzzing, and credentialed CORS leakage test',
        severity: 'Medium',
        cwe: 'CWE-942',
        engine: 'Header Auditor & ZAP',
      },
      {
        code: '3.2',
        title: 'Outdated & Vulnerable Components Detection',
        description: 'Discovers abandoned plugins, unpatched CMS modules, legacy build artifacts, and deprecated client-side scripts with known exploits.',
        lightSupported: true,
        lightNote: 'Scans well-known asset paths (e.g. /wp-includes, /vendor)',
        deepSupported: true,
        deepNote: 'Comprehensive asset tree crawling and hash-based version identification across all sub-resources',
        severity: 'High',
        cwe: 'CWE-1104',
        engine: 'Nuclei v3 & Fuzzer',
      },
      {
        code: '3.3',
        title: 'SSRF, LFI & RFI Server-Side Attack Fuzzing',
        description: 'Fuzzes file-handling parameters with directory traversal sequences (../../etc/passwd) and server-side request forgery URLs.',
        lightSupported: false,
        lightNote: 'Requires parameter fuzzing and active payload injection',
        deepSupported: true,
        deepNote: 'Comprehensive path traversal wordlists, loopback SSRF triggers, and timing discrepancy checks',
        severity: 'Critical',
        cwe: 'CWE-918 / CWE-22',
        engine: 'Smart Fuzzer & ZAP',
      },
      {
        code: '3.4',
        title: 'Hidden Directories & Admin Panels Brute-forcing',
        description: 'Discovers unlinked admin portals, staging environments, backup archives (.zip, .bak), and sensitive git repositories (.git/HEAD).',
        lightSupported: false,
        lightNote: 'Checks top 10 most common paths only',
        deepSupported: true,
        deepNote: 'High-speed concurrent brute-forcing across 153+ high-probability sensitive directory paths',
        severity: 'High',
        cwe: 'CWE-538 / CWE-548',
        engine: 'Smart Discovery Fuzzer',
      },
    ],
  },

  // ─── Category 4: API Security & Web Services ─────────────────────────────
  {
    id: 'api_security',
    number: 4,
    title: 'API Security & Web Services',
    icon: '🔌',
    badge: 'OWASP API Top 10',
    color: '#0EA5E9',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    summary: 'Audits REST, JSON-RPC, and GraphQL APIs for Broken Object Level Authorization, mass assignment, and weak JWT tokens.',
    backendEngine: 'zap_only',
    items: [
      {
        code: '4.1',
        title: 'OWASP API Top 10 Flaws (BOLA & Mass Assignment)',
        description: 'Tests parameter tampering on object identifiers (IDs) to access unauthorized records and checks for unexpected property updates.',
        lightSupported: false,
        lightNote: 'Requires stateful API request parsing and session simulation',
        deepSupported: true,
        deepNote: 'Automatic API schema discovery, ID sequential substitution, and mass assignment payload injections',
        severity: 'Critical',
        cwe: 'API1:2023 / API3:2023',
        engine: 'OWASP ZAP API Scanner',
      },
      {
        code: '4.2',
        title: 'JWT & Token Validation Weaknesses',
        description: 'Analyzes Bearer tokens for weak HMAC keys, algorithm confusion (alg: none), missing expiration claims, and signature verification bypasses.',
        lightSupported: false,
        lightNote: 'Bearer tokens not audited in unauthenticated quick runs',
        deepSupported: true,
        deepNote: 'JWT header forging (alg: none, RS256 to HS256), expired token replay, and signature stripping attacks',
        severity: 'High',
        cwe: 'CWE-347 / CWE-287',
        engine: 'Nuclei & Custom Fuzzer',
      },
      {
        code: '4.3',
        title: 'GraphQL Security & Introspection Audit',
        description: 'Identifies open GraphQL endpoints (/graphql), audits enabled schema introspection queries, and tests against batching and depth exhaustion attacks.',
        lightSupported: true,
        lightNote: 'Basic GET/POST probe on /graphql and /api/graphql',
        deepSupported: true,
        deepNote: 'Full schema introspection retrieval, nested field depth attack, and denial of service load simulation',
        severity: 'Medium',
        cwe: 'CWE-200 / CWE-400',
        engine: 'Nuclei & GraphQL Fuzzer',
      },
    ],
  },

  // ─── Category 5: Advanced Injection & Client-Side Attacks ─────────────────
  {
    id: 'advanced_injection',
    number: 5,
    title: 'Advanced Injection & Client-Side Attacks',
    icon: '💉',
    badge: 'Injection Payloads',
    color: '#EF4444',
    accentBg: 'rgba(239, 68, 68, 0.12)',
    summary: 'In-depth injection testing for SQLi, Cross-Site Scripting (Reflected, Stored, DOM), and Server-Side Template Injection.',
    backendEngine: 'nuclei_zap',
    items: [
      {
        code: '5.1',
        title: 'Advanced SQL & NoSQL Injection Testing',
        description: 'Injects active SQL error, boolean, union, and time-based sleep payloads into URL parameters, POST request bodies, and custom headers.',
        lightSupported: false,
        lightNote: 'Excluded from light scans to avoid unintended database locking',
        deepSupported: true,
        deepNote: 'Multi-dialect injection testing (PostgreSQL, MySQL, SQLite, MongoDB) with automated timing verification',
        severity: 'Critical',
        cwe: 'CWE-89 / CWE-943',
        engine: 'OWASP ZAP Active Fuzzer',
      },
      {
        code: '5.2',
        title: 'Cross-Site Scripting (XSS - Stored, Reflected, DOM)',
        description: 'Delivers benign JavaScript payloads across all discovered input fields, inspecting responses for unencoded reflections and persistent executions.',
        lightSupported: false,
        lightNote: 'Requires crawler form submission and active payload delivery',
        deepSupported: true,
        deepNote: 'Context-aware injection into HTML attributes, scripts, DOM sinks, and stored persistence verification',
        severity: 'High',
        cwe: 'CWE-79',
        engine: 'OWASP ZAP & Nuclei',
      },
      {
        code: '5.3',
        title: 'Server-Side Template Injection (SSTI)',
        description: 'Probes template rendering engines (Jinja2, Twig, Freemarker, Velocity) using mathematical expressions (${7*7}, {{7*7}}) to detect code execution.',
        lightSupported: false,
        lightNote: 'Active template payload injection is deep-only',
        deepSupported: true,
        deepNote: 'Polyglot template payload injection and remote code execution sandbox escape analysis',
        severity: 'Critical',
        cwe: 'CWE-1336 / CWE-94',
        engine: 'Nuclei Template Engine',
      },
    ],
  },

  // ─── Category 6: Infrastructure & Container Security ─────────────────────
  {
    id: 'infrastructure',
    number: 6,
    title: 'Infrastructure & Container Security',
    icon: '🐳',
    badge: 'Cloud & Perimeter Audit',
    color: '#10B981',
    accentBg: 'rgba(160, 185, 129, 0.12)',
    summary: 'Audits host container security, publicly readable cloud buckets, and TLS/SSL configuration weaknesses.',
    backendEngine: 'nuclei_only',
    items: [
      {
        code: '6.1',
        title: 'Docker Container Misconfigurations',
        description: 'Identifies exposed Docker daemon TCP ports (2375/2376), unauthenticated container registries, and privilege escalation vulnerabilities.',
        lightSupported: true,
        lightNote: 'Checks default Docker daemon HTTP response on standard ports',
        deepSupported: true,
        deepNote: 'Port probe verification, registry API introspection, and container escape vulnerability checks',
        severity: 'Critical',
        cwe: 'CWE-284',
        engine: 'Nuclei Engine',
      },
      {
        code: '6.2',
        title: 'Cloud Storage Bucket & File Exposure',
        description: 'Tests target domain associations against public AWS S3 buckets, Azure Blob Storage, and GCP Storage for unauthenticated read/write permissions.',
        lightSupported: true,
        lightNote: 'Subdomain DNS CNAME resolution and common bucket names',
        deepSupported: true,
        deepNote: 'Bucket permutation discovery, ACL listing, and anonymous write permission verification',
        severity: 'High',
        cwe: 'CWE-200 / CWE-732',
        engine: 'Nuclei & Cloud Fuzzer',
      },
      {
        code: '6.3',
        title: 'SSL/TLS Certificate & Cipher Weaknesses',
        description: 'Audits certificate expiration dates, revoked certificates, self-signed chains, and weak deprecated cipher suites (TLS 1.0, 1.1, RC4, 3DES).',
        lightSupported: true,
        lightNote: 'Standard TLS handshake validation and expiration alerts',
        deepSupported: true,
        deepNote: 'Complete cipher suite enumeration, Heartbleed/POODLE testing, and OCSP stapling verification',
        severity: 'Medium',
        cwe: 'CWE-326 / CWE-327',
        engine: 'TLS Analyzer & Nuclei',
      },
    ],
  },

  // ─── Category 7: Full Enterprise Scan ────────────────────────────────────
  {
    id: 'full_enterprise',
    number: 7,
    title: 'Full Enterprise Scan',
    icon: '🚀',
    badge: 'All Engines Combined',
    color: '#A855F7',
    accentBg: 'rgba(168, 85, 247, 0.12)',
    summary: 'Orchestrates the entire scanning pipeline: Nuclei 8,000+ templates, ZAP spider crawl, and high-concurrency fuzzers simultaneously.',
    backendEngine: 'full',
    items: [
      {
        code: '7.1',
        title: 'Comprehensive Full Scan Orchestration & Reporting',
        description: 'Executes all dynamic attack modules in synchronized sequence, generates full CVSS v3.1 vector calculations, and exports audit-ready executive PDF reports.',
        lightSupported: false,
        lightNote: 'Combines multiple engines requiring full multi-core queue execution',
        deepSupported: true,
        deepNote: 'Full unified execution of Nuclei + ZAP + Smart Fuzzer + ReportLab automated PDF compilation',
        severity: 'Critical',
        cwe: 'Enterprise Comprehensive',
        engine: 'All Engines (Nuclei + ZAP + Fuzzer + ReportLab)',
      },
    ],
  },

  // ─── Category 8: Custom Configuration ────────────────────────────────────
  {
    id: 'custom_config',
    number: 8,
    title: 'Custom Configuration',
    icon: '⚙️',
    badge: 'Granular Control',
    color: '#F5A623',
    accentBg: 'rgba(245, 166, 35, 0.12)',
    summary: 'Allows DevSecOps engineers to fine-tune audit boundaries, customize parameters, and toggle individual rules for targeted testing.',
    backendEngine: 'nuclei_zap',
    items: [
      {
        code: '8.1',
        title: 'Custom Granular Parameter Selection & Rule Tuning',
        description: 'Select specific vulnerability modules, exclude delicate endpoints, inject custom authorization tokens, and adjust rate limits.',
        lightSupported: false,
        lightNote: 'Preset configurations used for standard light scans',
        deepSupported: true,
        deepNote: 'Complete granular control over individual scanning plugins, request concurrency, and custom headers',
        severity: 'Info',
        cwe: 'Custom Rule Set',
        engine: 'Configurable Execution Pipeline',
      },
    ],
  },
];

// Computed total checks count across all categories
export const TOTAL_CHECKS_COUNT = SCAN_CATEGORIES_DATA.reduce(
  (acc, cat) => acc + cat.items.length,
  0
);

export const LIGHT_SUPPORTED_CHECKS_COUNT = SCAN_CATEGORIES_DATA.reduce(
  (acc, cat) => acc + cat.items.filter((item) => item.lightSupported).length,
  0
);

export const DEEP_EXCLUSIVE_CHECKS_COUNT = TOTAL_CHECKS_COUNT - LIGHT_SUPPORTED_CHECKS_COUNT;
