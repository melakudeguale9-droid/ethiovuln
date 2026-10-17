// EthioVuln — Landing Page Data & Definitions

export interface PipelineEngine {
  name: string;
  tag: string;
  color: string;
  specs: { label: string; val: string }[];
  description: string;
}

export const PIPELINE_ENGINES: Record<'nuclei' | 'zap' | 'fuzzer', PipelineEngine> = {
  nuclei: {
    name: 'Nuclei Template Engine',
    tag: 'Template-Driven DAST',
    color: '#00E5FF',
    specs: [
      { label: 'Template Library', val: '8,000+ Verified YAML Rules' },
      { label: 'Detection Scope', val: 'CVEs, Misconfigs, Exposures' },
      { label: 'Execution Speed', val: 'Multi-target Async I/O' },
      { label: 'False Positive Ratio', val: '< 0.5% with strict matching' },
    ],
    description:
      'Fast and customizable vulnerability scanner based on simple YAML DSL. Automatically executes thousands of community-curated vulnerability templates against target endpoints.',
  },
  zap: {
    name: 'OWASP ZAP Engine',
    tag: 'Dynamic Active Scanner',
    color: '#6366F1',
    specs: [
      { label: 'Spidering Mode', val: 'Traditional + AJAX Crawler' },
      { label: 'Active Attacks', val: 'SQLi, XSS, Path Traversal' },
      { label: 'Standards Support', val: 'OWASP Top 10 / WASC Threat' },
      { label: 'Session Handling', val: 'Automated Token Extraction' },
    ],
    description:
      'The gold standard in web application penetration testing. Deeply spiders URLs and systematically injects attack payloads to uncover severe application logic vulnerabilities.',
  },
  fuzzer: {
    name: 'Smart Discovery Fuzzer',
    tag: 'Recon & Content Discovery',
    color: '#10B981',
    specs: [
      { label: 'Wordlist Precision', val: 'High-probability sensitive paths' },
      { label: 'Header Audits', val: 'HSTS, CSP, CORS, Permissions' },
      { label: 'Sensitive Exposures', val: '.env, .git, backups, admin panels' },
      { label: 'Rate Adaptation', val: 'Automatic backoff on throttling' },
    ],
    description:
      'Proprietary concurrent HTTP probing engine designed to identify hidden subdirectories, unindexed configuration files, and critical security header omissions.',
  },
};

export interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
  badge: string;
  color: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: '01',
    title: 'Target Input & SSRF Gate',
    desc: 'Strict multi-tier URL validation. Automatically resolves DNS and blocks private CIDR blocks (RFC 1918), AWS metadata endpoints (169.254.169.254), and local loopbacks.',
    badge: 'Security Gate',
    color: '#00E5FF',
  },
  {
    step: '02',
    title: 'Multi-Engine Discovery',
    desc: 'Orchestrated execution of Nuclei template matching, OWASP ZAP spidering, and intelligent endpoint fuzzing running concurrently via background queues.',
    badge: 'Active Scan',
    color: '#6366F1',
  },
  {
    step: '03',
    title: 'CVSS v3.1 & CWE Scoring',
    desc: 'Raw findings are normalized, deduplicated, and scored using CVSS v3.1 vector calculations with direct mappings to MITRE CWE definitions.',
    badge: 'Analysis',
    color: '#F59E0B',
  },
  {
    step: '04',
    title: 'Executive PDF Export',
    desc: 'Generate executive summary reports with severity breakdown charts, technical reproduction steps, and actionable remediation guidelines.',
    badge: 'Reporting',
    color: '#10B981',
  },
];

export interface MetricCardData {
  label: string;
  value: string;
  tag: string;
}

export const METRIC_CARDS: MetricCardData[] = [
  { label: 'Vulnerability Engine', value: 'Nuclei v3 + ZAP 2.14', tag: 'Dual Core' },
  { label: 'Template Signatures', value: '8,000+ Community Definitions', tag: 'Continuous' },
  { label: 'Assessment Standards', value: 'CVSS v3.1 & OWASP Top 10', tag: 'Standardized' },
];
