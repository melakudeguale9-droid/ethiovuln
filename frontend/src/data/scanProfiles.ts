// EthioVuln — Assessment Scan Profiles & Presets

export interface ScanProfile {
  key: string;
  category: 'recommended' | 'quick' | 'custom';
  title: string;
  tag: string;
  badgeColor: string;
  description: string;
  engines: string[];
}

export const SCAN_PROFILES: ScanProfile[] = [
  {
    key: 'full',
    category: 'recommended',
    title: 'Full Vulnerability Assessment',
    tag: 'Recommended',
    badgeColor: '#00E5FF',
    description:
      'Complete end-to-end security audit. Executes DNS recon, directory discovery, OWASP ZAP active spidering, and 8,000+ Nuclei vulnerability signatures.',
    engines: ['Nuclei', 'OWASP ZAP', 'Directory Fuzzer', 'Header Auditor'],
  },
  {
    key: 'nuclei_only',
    category: 'quick',
    title: 'Quick Recon & CVE Scan',
    tag: 'Fast & Non-Invasive',
    badgeColor: '#10B981',
    description:
      'Rapid signature-based scan using Nuclei templates. Ideal for surface recon, checking for published CVEs, and identifying critical configuration leaks without active fuzzing.',
    engines: ['Nuclei Templates', 'DNS Verification', 'Exposure Checks'],
  },
  {
    key: 'zap_only',
    category: 'custom',
    title: 'Deep Spider & Active Scan',
    tag: 'Active Testing',
    badgeColor: '#6366F1',
    description:
      'Leverages the OWASP ZAP crawler to recursively map endpoints, test session management, and inject attack vectors across all discovered query parameters.',
    engines: ['OWASP ZAP Spider', 'Active Injection Engine'],
  },
  {
    key: 'nuclei_zap',
    category: 'custom',
    title: 'Dual Engine: Nuclei + ZAP',
    tag: 'Deep Audit',
    badgeColor: '#F59E0B',
    description:
      'Combined dynamic crawler and template verification. Simultaneously probes for complex OWASP Top 10 injection flaws and zero-day template matches.',
    engines: ['Nuclei Templates', 'OWASP ZAP Active'],
  },
  {
    key: 'fuzz_only',
    category: 'custom',
    title: 'Content Discovery & Fuzzing',
    tag: 'Endpoint Recon',
    badgeColor: '#0284C7',
    description:
      'Concurrent HTTP directory brute-forcing, sensitive file detection (.env, .git, backups), and security header audit (CSP, HSTS, CORS).',
    engines: ['Smart Fuzzer', 'Header Auditor'],
  },
];

export const SUPPORTED_VULN_CLASSES: string[] = [
  'SQL & NoSQL Injections',
  'Cross-Site Scripting (XSS)',
  'CORS Misconfigurations',
  'Exposed Environment Variables (.env)',
  'Missing Security Headers (HSTS, CSP)',
  'Unrestricted File Uploads',
  'Authentication & Session Weaknesses',
];
