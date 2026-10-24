// EthioVuln — Footer Navigation & Project Trust Badges

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface TrustBadgeItem {
  id: string;
  title: string;
  description: string;
  href?: string;
  badgeType: 'insa' | 'owasp' | 'engine' | 'research';
}

/* ─── Footer Links: Row 1 ──────────────────────────────────────────────────── */
export const FOOTER_ROW_1: FooterColumn[] = [
  {
    title: 'TOOLS & ENGINES',
    links: [
      { label: 'Reconnaissance tools', href: '/dashboard/scans/new?focus=recon' },
      { label: 'Web vulnerability scanner', href: '/dashboard/scans/new' },
      { label: 'Deep exploit probing', href: '/dashboard/scans/new?type=deep' },
      { label: 'Scan history & telemetry', href: '/dashboard/scans' },
    ],
  },
  {
    title: 'RESOURCES & DOCS',
    links: [
      { label: 'Security documentation hub', href: '/resources' },
      { label: 'Vulnerability taxonomy standards', href: '/resources' },
      { label: 'Headless CLI scanner guide', href: '/resources' },
      { label: 'API reference (OpenAPI / ReDoc)', href: '/resources' },
      { label: 'Developer code patch recipes', href: '/resources' },
    ],
  },
  {
    title: 'RESEARCH & MISSION',
    links: [
      { label: 'About EthioVuln platform', href: '/about' },
      { label: 'Tri-engine architecture', href: '/about#architecture' },
      { label: 'Cyber security student profile', href: '/about#developer' },
      { label: '8 security assessment vectors', href: '/about#vectors' },
      { label: 'Responsible disclosure policy', href: '/about#contact' },
    ],
  },
  {
    title: 'SOLUTIONS & PRICING',
    links: [
      { label: 'National infrastructure defense', href: '/solutions' },
      { label: 'Security assessment services', href: '/services' },
      { label: 'Executive & developer PDF reports', href: '/dashboard/reports' },
      { label: 'CBE Birr & enterprise plans', href: '/pricing' },
      { label: 'Launch assessment wizard', href: '/dashboard/scans/new' },
    ],
  },
];

/* ─── Footer Links: Row 2 ──────────────────────────────────────────────────── */
export const FOOTER_ROW_2: FooterColumn[] = [
  {
    title: 'VULNERABILITY COVERAGE',
    links: [
      { label: 'SQL Injection (SQLi) audit', href: '/dashboard/scans/new?focus=sqli' },
      { label: 'Cross-Site Scripting (XSS) analysis', href: '/dashboard/scans/new?focus=xss' },
      { label: 'Server-Side Request Forgery (SSRF)', href: '/dashboard/scans/new?focus=ssrf' },
      { label: 'Sensitive file & credential leaks', href: '/dashboard/scans/new?focus=recon' },
      { label: 'Security headers & TLS configuration', href: '/dashboard/scans/new?focus=headers' },
      { label: 'Broken authentication checks', href: '/dashboard/scans/new?focus=auth' },
    ],
  },
  {
    title: 'CORE CAPABILITIES',
    links: [
      { label: 'Pre-flight anti-SSRF gateway', href: '/about#architecture' },
      { label: 'Nuclei YAML template matching', href: '/about#architecture' },
      { label: 'OWASP ZAP active crawler spider', href: '/about#architecture' },
      { label: 'Smart directory & secret fuzzer', href: '/about#architecture' },
      { label: 'Real-time WebSocket event stream', href: '/dashboard/scans' },
    ],
  },
  {
    title: 'GOVERNANCE & STANDARDS',
    links: [
      { label: 'OWASP Top 10 matrix compliance', href: '/resources' },
      { label: 'CVSS v3.1 quantitative severity scoring', href: '/resources' },
      { label: 'MITRE CWE-658 correlation standards', href: '/resources' },
      { label: 'RFC 1918 private subnet filter', href: '/about#architecture' },
      { label: 'Safe harbor security research policy', href: '/about#contact' },
    ],
  },
  {
    title: 'CONNECT & VERIFIED CHANNELS',
    links: [
      { label: 'Telegram: @melakucyber', href: 'https://t.me/melakucyber' },
      { label: 'GitHub: melakudeguale9-droid', href: 'https://github.com/melakudeguale9-droid/ethiovuln' },
      { label: 'LinkedIn: Melaku Deguale', href: 'https://www.linkedin.com/in/melaku-deguale-7803ba416/' },
      { label: 'Direct contact: security@ethiovuln.io', href: 'mailto:security@ethiovuln.io' },
    ],
  },
];

/* ─── Trust Badges ─────────────────────────────────────────────────────────── */
export const TRUST_BADGES: TrustBadgeItem[] = [
  {
    id: 'insa-center',
    badgeType: 'insa',
    title: 'INSA Cyber Talent Center',
    description: 'Trained and mentored under advanced offensive security and defensive engineering programs at the INSA Cyber Talent Center.',
    href: '/about#developer',
  },
  {
    id: 'owasp-standard',
    badgeType: 'owasp',
    title: 'OWASP Top 10 & CVSS Standard',
    description: 'Engineered for quantitative severity scoring aligning directly with the OWASP Top 10, MITRE CWE-658, and CVSS v3.1 criteria.',
    href: '/resources',
  },
  {
    id: 'tri-engine',
    badgeType: 'engine',
    title: 'Tri-Engine Orchestration Pipeline',
    description: 'Unifying high-speed Nuclei YAML matching, OWASP ZAP dynamic crawler spidering, and Celery asynchronous task queues.',
    href: '/about#architecture',
  },
  {
    id: 'research-project',
    badgeType: 'research',
    title: 'Cyber Security Student Research',
    description: 'Engineered by Cyber Security Student Melaku Deguale to advance proactive, automated vulnerability management across Ethiopian web assets.',
    href: '/about#developer',
  },
];
