// EthioVuln — Comprehensive Scan Assessment Taxonomy & Hierarchy

export interface SubCheck {
  id: string;
  name: string;
  code: string;
}

export interface AssessmentSubCategory {
  id: string;
  code: string;
  title: string;
  checks: SubCheck[];
}

export interface AssessmentCategory {
  id: string;
  number: number;
  title: string;
  icon: string;
  color: string;
  tag: string;
  description: string;
  backendEngine: 'full' | 'nuclei_only' | 'zap_only' | 'fuzz_only' | 'nuclei_zap';
  subCategories: AssessmentSubCategory[];
}

export interface CustomModuleOption {
  id: string;
  code: string;
  title: string;
  categoryNumber: number;
  description: string;
  defaultChecked: boolean;
}

export const SCAN_TAXONOMY: AssessmentCategory[] = [
  {
    id: 'passive_scan',
    number: 1,
    title: 'Passive Scan',
    icon: '⚡',
    color: '#00E5FF',
    tag: 'Non-Invasive',
    description: 'Header audits and sensitive exposure detection without injecting attack payloads.',
    backendEngine: 'nuclei_only',
    subCategories: [
      {
        id: 'security_headers',
        code: '1.1',
        title: 'Missing Security Headers',
        checks: [
          { id: 'csp_check', code: '1.1.1', name: 'Content Security Policy (CSP) Check' },
          { id: 'hsts_check', code: '1.1.2', name: 'HTTP Strict Transport Security (HSTS) Check' },
          { id: 'xframe_check', code: '1.1.3', name: 'X-Frame-Options & X-Content-Type-Options Audit' },
        ],
      },
      {
        id: 'sensitive_exposure',
        code: '1.2',
        title: 'Sensitive Data Exposure',
        checks: [
          { id: 'api_keys_detection', code: '1.2.1', name: 'Hardcoded API Keys & Secrets Detection' },
          { id: 'html_comments_analysis', code: '1.2.2', name: 'Comments with Sensitive Information Analysis' },
          { id: 'ip_path_disclosure', code: '1.2.3', name: 'Internal IP & Path Disclosure Audit' },
        ],
      },
    ],
  },
  {
    id: 'active_scan',
    number: 2,
    title: 'Active Vulnerability Scan',
    icon: '🔍',
    color: '#6366F1',
    tag: 'Deep Probing',
    description: 'Systematic injection and verification across the OWASP Top 10, published CVEs, and authentication workflows.',
    backendEngine: 'nuclei_zap',
    subCategories: [
      {
        id: 'owasp_top_10',
        code: '2.1',
        title: 'OWASP Top 10 Vulnerabilities',
        checks: [
          { id: 'a01_broken_access', code: '2.1.1', name: 'A01: Broken Access Control' },
          { id: 'a02_crypto_failures', code: '2.1.2', name: 'A02: Cryptographic Failures' },
          { id: 'a03_injection', code: '2.1.3', name: 'A03: Injection' },
          { id: 'a04_insecure_design', code: '2.1.4', name: 'A04: Insecure Design' },
          { id: 'a05_misconfig', code: '2.1.5', name: 'A05: Security Misconfiguration' },
          { id: 'a06_outdated_components', code: '2.1.6', name: 'A06: Vulnerable and Outdated Components' },
          { id: 'a07_auth_failures', code: '2.1.7', name: 'A07: Identification and Authentication Failures' },
          { id: 'a08_integrity_failures', code: '2.1.8', name: 'A08: Software and Data Integrity Failures' },
          { id: 'a09_logging_failures', code: '2.1.9', name: 'A09: Security Logging and Monitoring Failures' },
          { id: 'a10_ssrf', code: '2.1.10', name: 'A10: Server-Side Request Forgery (SSRF)' },
        ],
      },
      {
        id: 'known_cves',
        code: '2.2',
        title: 'Known CVEs (Common Vulnerabilities and Exposures)',
        checks: [
          { id: 'version_fingerprint', code: '2.2.1', name: 'Software Version Fingerprinting' },
          { id: 'cpe_cve_matching', code: '2.2.2', name: 'CPE and CVE Database Matching' },
          { id: 'cvss_scoring', code: '2.2.3', name: 'CVSS Severity Score Assessment' },
        ],
      },
      {
        id: 'auth_session_flaws',
        code: '2.3',
        title: 'Authentication & Session Flaws',
        checks: [
          { id: 'session_hijacking', code: '2.3.1', name: 'Session Fixation & Hijacking Checks' },
          { id: 'brute_force_policy', code: '2.3.2', name: 'Weak Password Policies & Brute Force Testing' },
          { id: 'insecure_recovery', code: '2.3.3', name: 'Insecure Password Reset & Recovery Mechanisms' },
        ],
      },
    ],
  },
  {
    id: 'deep_recon',
    number: 3,
    title: 'Deep Recon & Fuzzing',
    icon: '🌐',
    color: '#10B981',
    tag: 'Reconnaissance',
    description: 'Concurrent path brute-forcing, CORS policy auditing, component fingerprinting, and LFI/RFI probing.',
    backendEngine: 'fuzz_only',
    subCategories: [
      {
        id: 'cors_policies',
        code: '3.1',
        title: 'Insecure CORS Policies',
        checks: [
          { id: 'wildcard_origin', code: '3.1.1', name: 'Wildcard Origin (*) Misconfiguration' },
          { id: 'null_origin_reflection', code: '3.1.2', name: 'Null Origin Reflection Check' },
          { id: 'allow_credentials_audit', code: '3.1.3', name: 'Credential Leakage via Allow-Credentials Audit' },
        ],
      },
      {
        id: 'outdated_components',
        code: '3.2',
        title: 'Outdated & Vulnerable Components',
        checks: [
          { id: 'js_library_audit', code: '3.2.1', name: 'JavaScript Libraries & Frameworks Version Audit' },
          { id: 'cms_fingerprinting', code: '3.2.2', name: 'CMS & Server Software Fingerprinting' },
        ],
      },
      {
        id: 'server_side_attacks',
        code: '3.3',
        title: 'SSRF, LFI & RFI (Server-Side Attacks)',
        checks: [
          { id: 'ssrf_fuzzing', code: '3.3.1', name: 'Server-Side Request Forgery (SSRF) Fuzzing' },
          { id: 'lfi_testing', code: '3.3.2', name: 'Local File Inclusion (LFI) Testing' },
          { id: 'rfi_testing', code: '3.3.3', name: 'Remote File Inclusion (RFI) Testing' },
        ],
      },
      {
        id: 'hidden_directories',
        code: '3.4',
        title: 'Hidden Directories & Admin Panels',
        checks: [
          { id: 'dir_bruteforce', code: '3.4.1', name: 'Directory & Wordlist Brute-Forcing' },
          { id: 'sensitive_backup_discovery', code: '3.4.2', name: 'Sensitive Backup & Config Files Discovery (.git, .env)' },
        ],
      },
    ],
  },
  {
    id: 'api_security',
    number: 4,
    title: 'API Security & Web Services',
    icon: '🔌',
    color: '#F59E0B',
    tag: 'API Endpoints',
    description: 'Targeted assessment for RESTful APIs and GraphQL endpoints matching OWASP API Top 10 standards.',
    backendEngine: 'zap_only',
    subCategories: [
      {
        id: 'owasp_api_top_10',
        code: '4.1',
        title: 'OWASP API Top 10 Flaws',
        checks: [
          { id: 'api1_bola', code: '4.1.1', name: 'API1: Broken Object Level Authorization (BOLA)' },
          { id: 'api2_broken_auth', code: '4.1.2', name: 'API2: Broken Authentication' },
          { id: 'api3_bopla', code: '4.1.3', name: 'API3: Broken Object Property Level Authorization' },
          { id: 'api4_resource_consumption', code: '4.1.4', name: 'API4: Unrestricted Resource Consumption' },
          { id: 'api5_bfla', code: '4.1.5', name: 'API5: Broken Function Level Authorization' },
          { id: 'api6_business_flows', code: '4.1.6', name: 'API6: Unrestricted Access to Sensitive Business Flows' },
          { id: 'api7_ssrf', code: '4.1.7', name: 'API7: Server-Side Request Forgery (SSRF)' },
          { id: 'api8_misconfig', code: '4.1.8', name: 'API8: Security Misconfiguration' },
          { id: 'api9_inventory', code: '4.1.9', name: 'API9: Improper Inventory Management' },
          { id: 'api10_unsafe_consumption', code: '4.1.10', name: 'API10: Unsafe Consumption of APIs' },
        ],
      },
      {
        id: 'jwt_validation',
        code: '4.2',
        title: 'JWT & Token Validation Weaknesses',
        checks: [
          { id: 'none_alg_attack', code: '4.2.1', name: 'None Algorithm Attack Check' },
          { id: 'weak_hmac_secret', code: '4.2.2', name: 'Weak HMAC Secret Brute-Forcing' },
          { id: 'missing_exp_claim', code: '4.2.3', name: 'Missing Expiration & Claim Validation' },
        ],
      },
      {
        id: 'graphql_security',
        code: '4.3',
        title: 'GraphQL Security Audit',
        checks: [
          { id: 'introspection_abuse', code: '4.3.1', name: 'Introspection Query Abuse Check' },
          { id: 'query_depth_limit', code: '4.3.2', name: 'Query Depth & Complexity Limit Testing' },
          { id: 'batching_dos', code: '4.3.3', name: 'Batching & Denial of Service (DoS) Vulnerabilities' },
        ],
      },
    ],
  },
  {
    id: 'advanced_injection',
    number: 5,
    title: 'Advanced Injection & Client-Side Attacks',
    icon: '💉',
    color: '#EC4899',
    tag: 'Deep Exploit',
    description: 'Blind, Boolean, and Time-based SQLi, DOM/Stored XSS, and Server-Side Template Injection probes.',
    backendEngine: 'zap_only',
    subCategories: [
      {
        id: 'sql_nosql_injection',
        code: '5.1',
        title: 'Advanced SQL & NoSQL Injection',
        checks: [
          { id: 'blind_sqli', code: '5.1.1', name: 'Boolean-based & Time-based Blind SQLi' },
          { id: 'union_sqli', code: '5.1.2', name: 'Union-based & Error-based SQLi' },
          { id: 'nosql_operator', code: '5.1.3', name: 'NoSQL Operator Injection Testing' },
        ],
      },
      {
        id: 'cross_site_scripting',
        code: '5.2',
        title: 'Cross-Site Scripting (XSS)',
        checks: [
          { id: 'stored_xss', code: '5.2.1', name: 'Stored XSS Audit' },
          { id: 'reflected_xss', code: '5.2.2', name: 'Reflected XSS Audit' },
          { id: 'dom_xss', code: '5.2.3', name: 'DOM-based XSS Audit' },
        ],
      },
      {
        id: 'ssti_injection',
        code: '5.3',
        title: 'Server-Side Template Injection (SSTI)',
        checks: [
          { id: 'template_engine_id', code: '5.3.1', name: 'Template Engine Identification (Jinja2, Twig, etc.)' },
          { id: 'rce_ssti_testing', code: '5.3.2', name: 'Remote Code Execution via SSTI Testing' },
        ],
      },
    ],
  },
  {
    id: 'infra_security',
    number: 6,
    title: 'Infrastructure & Container Security',
    icon: '🐳',
    color: '#0284C7',
    tag: 'Infrastructure',
    description: 'Docker container misconfigurations, cloud bucket permissions, and SSL/TLS cipher suite audits.',
    backendEngine: 'nuclei_only',
    subCategories: [
      {
        id: 'docker_misconfig',
        code: '6.1',
        title: 'Docker Container Misconfigurations',
        checks: [
          { id: 'privileged_container', code: '6.1.1', name: 'Privileged Containers & Root User Checks' },
          { id: 'exposed_docker_sock', code: '6.1.2', name: 'Exposed Docker Daemon Socket (/var/run/docker.sock)' },
        ],
      },
      {
        id: 'cloud_storage_exposure',
        code: '6.2',
        title: 'Cloud Storage Bucket & File Exposure',
        checks: [
          { id: 'public_buckets', code: '6.2.1', name: 'Publicly Accessible AWS S3 / Azure Blob Storage' },
          { id: 'bucket_acls', code: '6.2.2', name: 'Misconfigured Bucket ACLs & Permissions' },
        ],
      },
      {
        id: 'tls_cipher_audit',
        code: '6.3',
        title: 'SSL/TLS Certificate & Cipher Weaknesses',
        checks: [
          { id: 'expired_self_signed', code: '6.3.1', name: 'Expired or Self-Signed Certificates Audit' },
          { id: 'weak_ciphers', code: '6.3.2', name: 'Weak Ciphers & TLS 1.0/1.1 Protocol Support' },
        ],
      },
    ],
  },
  {
    id: 'full_enterprise',
    number: 7,
    title: 'Full Enterprise Scan',
    icon: '🚀',
    color: '#10B981',
    tag: 'Recommended',
    description: 'Complete automated orchestration running all 6 assessment modules with unified executive reporting.',
    backendEngine: 'full',
    subCategories: [
      {
        id: 'comprehensive_assessment',
        code: '7.1',
        title: 'Comprehensive Assessment',
        checks: [
          { id: 'full_orchestration', code: '7.1.1', name: 'Full Automated Scan Orchestration (Run All Modules)' },
          { id: 'enterprise_reporting', code: '7.1.2', name: 'Consolidated Enterprise Severity Reporting' },
        ],
      },
    ],
  },
  {
    id: 'custom_config',
    number: 8,
    title: 'Custom Configuration',
    icon: '⚙️',
    color: '#F43F5E',
    tag: 'Granular',
    description: 'Customize specific checks and modules (8.1 through 8.14) to tailor testing to your scope.',
    backendEngine: 'nuclei_zap',
    subCategories: [
      {
        id: 'custom_headers',
        code: '8.1',
        title: 'Missing Security Headers (8.1.1)',
        checks: [
          { id: 'custom_8_1_1', code: '8.1.1', name: 'Missing Security Headers Audit' },
        ],
      },
      {
        id: 'custom_exposure',
        code: '8.2',
        title: 'Sensitive Data Exposure (8.2.1)',
        checks: [
          { id: 'custom_8_2_1', code: '8.2.1', name: 'Sensitive Data Exposure Detection' },
        ],
      },
      {
        id: 'custom_owasp',
        code: '8.3',
        title: 'OWASP Top 10 Vulnerabilities (8.3.1)',
        checks: [
          { id: 'custom_8_3_1', code: '8.3.1', name: 'OWASP Top 10 Vulnerabilities Test Suite' },
        ],
      },
      {
        id: 'custom_cves',
        code: '8.4',
        title: 'Known CVEs (8.4.1)',
        checks: [
          { id: 'custom_8_4_1', code: '8.4.1', name: 'Known CVEs Fingerprint & Matcher' },
        ],
      },
      {
        id: 'custom_auth',
        code: '8.5',
        title: 'Authentication & Session Flaws (8.5.1)',
        checks: [
          { id: 'custom_8_5_1', code: '8.5.1', name: 'Authentication & Session Flaws Verification' },
        ],
      },
      {
        id: 'custom_cors',
        code: '8.6',
        title: 'Insecure CORS Policies (8.6.1)',
        checks: [
          { id: 'custom_8_6_1', code: '8.6.1', name: 'Insecure CORS Policy Audit' },
        ],
      },
      {
        id: 'custom_components',
        code: '8.7',
        title: 'Outdated & Vulnerable Components (8.7.1)',
        checks: [
          { id: 'custom_8_7_1', code: '8.7.1', name: 'Outdated & Vulnerable Components Check' },
        ],
      },
      {
        id: 'custom_ssrf_lfi',
        code: '8.8',
        title: 'SSRF, LFI & RFI (8.8.1)',
        checks: [
          { id: 'custom_8_8_1', code: '8.8.1', name: 'SSRF, LFI & RFI Server-Side Attacks' },
        ],
      },
      {
        id: 'custom_hidden_dirs',
        code: '8.9',
        title: 'Hidden Directories & Admin Panels (8.9.1)',
        checks: [
          { id: 'custom_8_9_1', code: '8.9.1', name: 'Hidden Directories & Admin Panels Discovery' },
        ],
      },
      {
        id: 'custom_api_top10',
        code: '8.10',
        title: 'OWASP API Top 10 Flaws (8.10.1)',
        checks: [
          { id: 'custom_8_10_1', code: '8.10.1', name: 'OWASP API Top 10 Flaws Audit' },
        ],
      },
      {
        id: 'custom_jwt',
        code: '8.11',
        title: 'JWT & Token Validation Weaknesses (8.11.1)',
        checks: [
          { id: 'custom_8_11_1', code: '8.11.1', name: 'JWT & Token Validation Security Check' },
        ],
      },
      {
        id: 'custom_sqli',
        code: '8.12',
        title: 'Advanced SQL & NoSQL Injection (8.12.1)',
        checks: [
          { id: 'custom_8_12_1', code: '8.12.1', name: 'Advanced SQL & NoSQL Injection Suite' },
        ],
      },
      {
        id: 'custom_xss',
        code: '8.13',
        title: 'Cross-Site Scripting (XSS) (8.13.1)',
        checks: [
          { id: 'custom_8_13_1', code: '8.13.1', name: 'Cross-Site Scripting (XSS) Probes' },
        ],
      },
      {
        id: 'custom_infra',
        code: '8.14',
        title: 'Docker & Infrastructure Misconfigurations (8.14.1)',
        checks: [
          { id: 'custom_8_14_1', code: '8.14.1', name: 'Docker & Infrastructure Misconfiguration Audit' },
        ],
      },
    ],
  },
];

export const CUSTOM_CONFIG_OPTIONS: CustomModuleOption[] = [
  { id: 'mod_8_1', code: '8.1', title: 'Missing Security Headers (8.1.1)', categoryNumber: 1, description: 'Audits CSP, HSTS, X-Frame-Options & X-Content-Type-Options', defaultChecked: true },
  { id: 'mod_8_2', code: '8.2', title: 'Sensitive Data Exposure (8.2.1)', categoryNumber: 1, description: 'Detects hardcoded API keys, sensitive comments & internal IP disclosures', defaultChecked: true },
  { id: 'mod_8_3', code: '8.3', title: 'OWASP Top 10 Vulnerabilities (8.3.1)', categoryNumber: 2, description: 'Active tests for Broken Access, Crypto, Injection, Design & SSRF', defaultChecked: true },
  { id: 'mod_8_4', code: '8.4', title: 'Known CVEs (8.4.1)', categoryNumber: 2, description: 'Software fingerprinting and CVE database vulnerability correlation', defaultChecked: true },
  { id: 'mod_8_5', code: '8.5', title: 'Authentication & Session Flaws (8.5.1)', categoryNumber: 2, description: 'Session hijacking, brute force vulnerability & recovery audits', defaultChecked: true },
  { id: 'mod_8_6', code: '8.6', title: 'Insecure CORS Policies (8.6.1)', categoryNumber: 3, description: 'Wildcard origins (*), null reflections & credential leak checks', defaultChecked: true },
  { id: 'mod_8_7', code: '8.7', title: 'Outdated & Vulnerable Components (8.7.1)', categoryNumber: 3, description: 'Client-side JS library versions & CMS version vulnerability analysis', defaultChecked: true },
  { id: 'mod_8_8', code: '8.8', title: 'SSRF, LFI & RFI (8.8.1)', categoryNumber: 3, description: 'Server-side request forgery, local & remote file inclusion fuzzing', defaultChecked: true },
  { id: 'mod_8_9', code: '8.9', title: 'Hidden Directories & Admin Panels (8.9.1)', categoryNumber: 3, description: 'Wordlist path brute-force and backup/env discovery', defaultChecked: true },
  { id: 'mod_8_10', code: '8.10', title: 'OWASP API Top 10 Flaws (8.10.1)', categoryNumber: 4, description: 'BOLA, broken auth, resource consumption & API business logic testing', defaultChecked: true },
  { id: 'mod_8_11', code: '8.11', title: 'JWT & Token Validation Weaknesses (8.11.1)', categoryNumber: 4, description: 'None algorithm abuse, weak HMAC secret brute-force & claims verification', defaultChecked: true },
  { id: 'mod_8_12', code: '8.12', title: 'Advanced SQL & NoSQL Injection (8.12.1)', categoryNumber: 5, description: 'Boolean, time-based blind, union-based SQLi & NoSQL operators', defaultChecked: true },
  { id: 'mod_8_13', code: '8.13', title: 'Cross-Site Scripting (XSS) (8.13.1)', categoryNumber: 5, description: 'Stored, Reflected, and DOM-based injection vector checks', defaultChecked: true },
  { id: 'mod_8_14', code: '8.14', title: 'Docker & Infrastructure Misconfigurations (8.14.1)', categoryNumber: 6, description: 'Privileged container checks, cloud storage ACLs & weak TLS ciphers', defaultChecked: true },
];
