export type PricingCategory = 'ai-pentests' | 'scanning-validation' | 'expert-services';
export type BillingCycle = 'monthly' | 'yearly';
export type Currency = 'USD' | 'ETB';

export interface AssetOption {
  assets: number;
  label: string;
  monthlyUsd: number;
  monthlyEtb: number;
  originalUsd?: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  discountBadge?: string;
  originalPriceUsd?: number;
  cbeAvailable?: boolean;
  isPopular?: boolean;
  accentColor: string;
  assetOptions: AssetOption[];
  defaultAssetIndex: number;
  buttonLabel: string;
  buttonHref: string;
  cloudOptionsText: string;
  whatsIncludedTitle?: string;
  features: string[];
}

export interface AddOnItem {
  id: string;
  title: string;
  description: string;
  price?: string;
}

export interface ComparisonItem {
  name: string;
  free: string | boolean;
  netscan: string | boolean;
  appscan: string | boolean;
  exploit: string | boolean;
  tooltip?: string;
}

export interface ComparisonCategory {
  title: string;
  count: number;
  items: ComparisonItem[];
}

/* ─── Scanning & Validation Plans ─────────────────────────────────────────── */
export const SCANNING_VALIDATION_PLANS: PricingPlan[] = [
  {
    id: 'netscan',
    name: 'NetScan',
    tagline: 'Best for infrastructure assessment, monitoring and recon',
    accentColor: '#38BDF8', // Cyan/Sky
    assetOptions: [
      { assets: 8, label: '8 assets', monthlyUsd: 59, monthlyEtb: 7500 },
      { assets: 16, label: '16 assets', monthlyUsd: 96, monthlyEtb: 12200 },
      { assets: 32, label: '32 assets', monthlyUsd: 175, monthlyEtb: 22200 },
      { assets: 64, label: '64 assets', monthlyUsd: 310, monthlyEtb: 39500 },
      { assets: 128, label: '128 assets', monthlyUsd: 540, monthlyEtb: 68900 },
    ],
    defaultAssetIndex: 1, // 16 assets ($96)
    cbeAvailable: true,
    buttonLabel: 'Select NetScan',
    buttonHref: '/dashboard/scans/new?plan=netscan',
    cloudOptionsText: 'Pay via Card, CBE (Commercial Bank of Ethiopia), or Telebirr',
    whatsIncludedTitle: "What's included:",
    features: [
      'Network scanning (discover 17,400+ CVEs)',
      'Cloud scanning (AWS, Azure, GCP vulnerabilities)',
      'Password auditing & weak credential checking',
      'Reconnaissance tools & perimeter mapping',
      'Limited web & API scanning',
    ],
  },
  {
    id: 'appscan',
    name: 'AppScan',
    tagline: 'Best for web application and API security testing',
    badge: 'Most Popular',
    isPopular: true,
    cbeAvailable: true,
    accentColor: '#F5A623', // Vibrant Gold
    assetOptions: [
      { assets: 5, label: '5 assets', monthlyUsd: 140, monthlyEtb: 17800 },
      { assets: 10, label: '10 assets', monthlyUsd: 240, monthlyEtb: 30500 },
      { assets: 20, label: '20 assets', monthlyUsd: 420, monthlyEtb: 53500 },
      { assets: 50, label: '50 assets', monthlyUsd: 850, monthlyEtb: 108000 },
      { assets: 100, label: '100 assets', monthlyUsd: 1450, monthlyEtb: 185000 },
    ],
    defaultAssetIndex: 0, // 5 assets ($140)
    buttonLabel: 'Select AppScan',
    buttonHref: '/dashboard/scans/new?plan=appscan',
    cloudOptionsText: 'Pay via Card, CBE (Commercial Bank of Ethiopia), or Telebirr',
    whatsIncludedTitle: 'Everything in NetScan, plus:',
    features: [
      'DAST scanning (beyond OWASP Top 10)',
      'Authenticated web application scans',
      'API scanning (REST, GraphQL, Swagger/OpenAPI)',
      'Wordpress & Drupal deep vulnerability scanners',
    ],
  },
  {
    id: 'exploit',
    name: 'Exploit',
    tagline: 'Best for self-driven penetration testing and risk validation',
    cbeAvailable: true,
    accentColor: '#F43F5E', // Rose/Crimson
    assetOptions: [
      { assets: 5, label: '5 assets', monthlyUsd: 190, monthlyEtb: 24200 },
      { assets: 10, label: '10 assets', monthlyUsd: 330, monthlyEtb: 42000 },
      { assets: 20, label: '20 assets', monthlyUsd: 580, monthlyEtb: 73900 },
      { assets: 50, label: '50 assets', monthlyUsd: 1150, monthlyEtb: 146000 },
      { assets: 100, label: '100 assets', monthlyUsd: 1950, monthlyEtb: 248000 },
    ],
    defaultAssetIndex: 0, // 5 assets ($190)
    buttonLabel: 'Select Exploit',
    buttonHref: '/dashboard/scans/new?plan=exploit',
    cloudOptionsText: 'Pay via Card, CBE (Commercial Bank of Ethiopia), or Telebirr',
    whatsIncludedTitle: 'Everything in AppScan, plus:',
    features: [
      'Automatic CVE exploiter (Sniper Engine)',
      'SQL Injection & XSS verified exploiters',
      'Pentest report generator add-on (Word DOCX, PDF, Google Doc)',
      'Import findings from Burp Suite and external scanners',
    ],
  },
];

/* ─── AI Pentests Category Plans (75% Special Discount) ─────────────────── */
export const AI_PENTEST_PLANS: PricingPlan[] = [
  {
    id: 'ai-starter',
    name: 'AI Recon Agent',
    tagline: 'Autonomous AI assistant for external attack surface discovery',
    discountBadge: '75% OFF',
    originalPriceUsd: 100,
    cbeAvailable: true,
    accentColor: '#818CF8',
    assetOptions: [
      { assets: 5, label: '5 assets', monthlyUsd: 25, monthlyEtb: 3200, originalUsd: 100 },
      { assets: 15, label: '15 assets', monthlyUsd: 55, monthlyEtb: 7040, originalUsd: 220 },
      { assets: 30, label: '30 assets', monthlyUsd: 95, monthlyEtb: 12160, originalUsd: 380 },
    ],
    defaultAssetIndex: 0,
    buttonLabel: 'Select AI Recon ($25/mo)',
    buttonHref: '/dashboard/scans/new?mode=ai-recon',
    cloudOptionsText: 'Pay via Card, CBE (Commercial Bank of Ethiopia), or Telebirr',
    whatsIncludedTitle: "What's included:",
    features: [
      'Automated OSINT & technology fingerprinting',
      'LLM-assisted attack surface reasoning',
      'Zero false-positive verification loops',
      'Real-time Slack & Discord alerts',
    ],
  },
  {
    id: 'ai-pentester',
    name: 'Autonomous AI Pentester',
    tagline: 'Full end-to-end autonomous exploit validation with AI Copilot',
    badge: 'Most Popular',
    discountBadge: '75% OFF',
    originalPriceUsd: 180,
    cbeAvailable: true,
    isPopular: true,
    accentColor: '#00F0FF',
    assetOptions: [
      { assets: 10, label: '10 targets', monthlyUsd: 45, monthlyEtb: 5760, originalUsd: 180 },
      { assets: 25, label: '25 targets', monthlyUsd: 95, monthlyEtb: 12160, originalUsd: 380 },
      { assets: 50, label: '50 targets', monthlyUsd: 165, monthlyEtb: 21120, originalUsd: 660 },
    ],
    defaultAssetIndex: 0,
    buttonLabel: 'Select AI Pentester ($45/mo)',
    buttonHref: '/dashboard/scans/new?mode=ai-pentest',
    cloudOptionsText: 'Pay via Card, CBE (Commercial Bank of Ethiopia), or Telebirr',
    whatsIncludedTitle: 'Everything in AI Recon, plus:',
    features: [
      'Multi-step chained exploit validation',
      'Dynamic bypass for modern WAFs (Cloudflare, AWS WAF)',
      'Custom remediation patch generation with code diffs',
      'Executive board-ready AI summaries',
    ],
  },
  {
    id: 'ai-enterprise',
    name: 'AI Red Team Swarm',
    tagline: 'Coordinated swarm of specialized adversarial AI agents',
    badge: 'Enterprise Tier',
    discountBadge: '75% OFF',
    originalPriceUsd: 400,
    cbeAvailable: true,
    accentColor: '#A855F7',
    assetOptions: [
      { assets: 50, label: '50 targets', monthlyUsd: 100, monthlyEtb: 12800, originalUsd: 400 },
      { assets: 100, label: '100 targets', monthlyUsd: 195, monthlyEtb: 24960, originalUsd: 780 },
    ],
    defaultAssetIndex: 0,
    buttonLabel: 'Select AI Swarm ($100/mo)',
    buttonHref: '/dashboard/scans/new?mode=ai-swarm',
    cloudOptionsText: 'Pay via Card, CBE (Commercial Bank of Ethiopia), or Telebirr',
    whatsIncludedTitle: 'Everything in AI Pentester, plus:',
    features: [
      'Multi-vector social engineering & credential spray testing',
      'Custom AI rulebook alignment with corporate policies',
      'Private cloud deployment for sensitive internal networks',
      'Dedicated security researcher oversight',
    ],
  },
];

/* ─── Expert Services Plans ──────────────────────────────────────────────── */
export const EXPERT_SERVICES_PLANS: PricingPlan[] = [
  {
    id: 'expert-audit',
    name: 'Web App Pentest',
    tagline: 'CREST & OSCP-certified offensive security experts testing your app',
    accentColor: '#F59E0B',
    assetOptions: [
      { assets: 1, label: '1 Web Application', monthlyUsd: 1500, monthlyEtb: 191000 },
      { assets: 3, label: '3 Web Applications', monthlyUsd: 3800, monthlyEtb: 484000 },
    ],
    defaultAssetIndex: 0,
    buttonLabel: 'Book Application Pentest',
    buttonHref: '/about#contact',
    cloudOptionsText: 'Billed per engagement',
    whatsIncludedTitle: 'Scope includes:',
    features: [
      'Manual business logic vulnerability testing',
      'Authentication & session authorization bypasses',
      'Interactive debrief with developers',
      'Free re-test within 30 days',
    ],
  },
  {
    id: 'expert-cloud',
    name: 'Cloud & API Assessment',
    tagline: 'Deep architecture, microservices, and cloud configuration audit',
    badge: 'Comprehensive',
    isPopular: true,
    accentColor: '#10B981',
    assetOptions: [
      { assets: 1, label: '1 Cloud Environment', monthlyUsd: 2200, monthlyEtb: 280000 },
      { assets: 3, label: 'Multi-Cloud Architecture', monthlyUsd: 5500, monthlyEtb: 700000 },
    ],
    defaultAssetIndex: 0,
    buttonLabel: 'Book Cloud Assessment',
    buttonHref: '/about#contact',
    cloudOptionsText: 'Billed per engagement',
    whatsIncludedTitle: 'Scope includes:',
    features: [
      'AWS / Azure / GCP IAM & privilege escalation audits',
      'Microservice REST & GraphQL API fuzzing',
      'Kubernetes & container breakout audits',
      'Executive compliance report (SOC 2, ISO 27001, PCI-DSS)',
    ],
  },
  {
    id: 'expert-retainer',
    name: 'Dedicated Security Retainer',
    tagline: 'Continuous offensive security partner embedded in your release cycle',
    accentColor: '#EC4899',
    assetOptions: [
      { assets: 1, label: 'Quarterly Audits + Retainer', monthlyUsd: 3200, monthlyEtb: 408000 },
    ],
    defaultAssetIndex: 0,
    buttonLabel: 'Inquire for Retainer',
    buttonHref: '/about#contact',
    cloudOptionsText: 'Annual contract / Quarterly billing',
    whatsIncludedTitle: 'Scope includes:',
    features: [
      'Continuous weekly delta scans & monthly manual checks',
      'Emergency zero-day advisory & triage support within 4 hours',
      'Direct Slack channel with senior security engineers',
      'Assistance with vendor security questionnaires',
    ],
  },
];

/* ─── Included in All Plans ──────────────────────────────────────────────── */
export const INCLUDED_IN_ALL = [
  { title: 'API access', desc: 'Automate scans via REST API and CI/CD pipelines (GitHub Actions, GitLab, Jenkins)' },
  { title: 'Unlimited rescans', desc: 'Perform unlimited re-tests on all verified network and web application targets' },
  { title: 'Scan automation & alerts', desc: 'Set up recurring schedules with real-time Slack, Discord, and webhook notifications' },
  { title: 'Team access (unlimited members)', desc: 'Invite all your developers and DevOps engineers with custom role permissions' },
  { title: 'Integrations with key ecosystem tools', desc: 'Seamlessly export to Jira, AWS, Vanta, Nucleus Security, Microsoft Teams, and Webhooks' },
];

export const OPTIONAL_ADD_ONS: AddOnItem[] = [
  { id: 'internal', title: 'Internal network scanning', description: 'Deploy light-weight agent inside private subnets and VPCs' },
  { id: 'branded', title: 'Branded reports & emails', description: 'Customize executive reports with your corporate logo and brand styling' },
  { id: 'pentest-doc', title: 'Pentest report generator', description: 'Export findings directly to editable Word (.docx) and Google Docs templates' },
];

/* ─── Detailed Comparison Matrix ─────────────────────────────────────────── */
export const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    title: 'Attack surface mapping & recon tools',
    count: 8,
    items: [
      { name: 'Open ports & services discovery', free: 'limited', netscan: true, appscan: true, exploit: true },
      { name: 'Subdomain & domain discovery', free: 'limited', netscan: true, appscan: true, exploit: true },
      { name: 'Virtual host discovery', free: 'limited', netscan: true, appscan: true, exploit: true },
      { name: 'URL fuzzing & parameter discovery', free: 'limited', netscan: true, appscan: true, exploit: true },
      { name: 'Technology & WAF fingerprinting', free: 'limited', netscan: true, appscan: true, exploit: true },
      { name: 'Google hacking & indexed leaks', free: 'limited', netscan: true, appscan: true, exploit: true },
      { name: 'SSL/TLS configuration & cipher auditing', free: 'limited', netscan: true, appscan: true, exploit: true },
      { name: 'DNS zone transfer & DNSSEC verification', free: 'limited', netscan: true, appscan: true, exploit: true },
    ],
  },
  {
    title: 'Vulnerability scanning tools',
    count: 7,
    items: [
      { name: 'Network vulnerability scanning (detect 17,400+ CVEs)', free: 'limited', netscan: true, appscan: true, exploit: true },
      { name: 'Website vulnerability scanning (OWASP Top 10)', free: 'limited', netscan: 'limited', appscan: true, exploit: true },
      { name: 'API vulnerability scanning (REST & GraphQL)', free: false, netscan: 'limited', appscan: true, exploit: true },
      { name: 'CMS vulnerability scanning (WordPress, Drupal, Joomla)', free: false, netscan: 'limited', appscan: true, exploit: true },
      { name: 'Cloud security posture (AWS, Azure, GCP)', free: false, netscan: true, appscan: true, exploit: true },
      { name: 'Weak credential & default password auditing', free: 'limited', netscan: true, appscan: true, exploit: true },
      { name: 'Dynamic active spider & crawler fuzzer', free: false, netscan: 'limited', appscan: true, exploit: true },
    ],
  },
  {
    title: 'Exploitation & Risk Validation',
    count: 5,
    items: [
      { name: 'Sniper automatic CVE exploiter', free: false, netscan: false, appscan: false, exploit: true },
      { name: 'SQL Injection proof-of-concept verification', free: false, netscan: false, appscan: false, exploit: true },
      { name: 'Cross-Site Scripting (XSS) exploit validator', free: false, netscan: false, appscan: false, exploit: true },
      { name: 'Out-of-Band (OAST) listener verification', free: false, netscan: false, appscan: true, exploit: true },
      { name: 'Import findings from Burp Suite & external tools', free: false, netscan: false, appscan: false, exploit: true },
    ],
  },
  {
    title: 'Reporting, Automation & Management',
    count: 6,
    items: [
      { name: 'Executive PDF vulnerability reports', free: 'Watermarked', netscan: true, appscan: true, exploit: true },
      { name: 'Standardized CVSS v3.1 & MITRE CWE scoring', free: true, netscan: true, appscan: true, exploit: true },
      { name: 'Editable report export (Word DOCX & Google Docs)', free: false, netscan: false, appscan: false, exploit: true },
      { name: 'Automated scan scheduling & monitoring alerts', free: false, netscan: true, appscan: true, exploit: true },
      { name: 'CI/CD API integration & webhook triggers', free: false, netscan: true, appscan: true, exploit: true },
      { name: 'Unlimited team members with role-based access', free: '1 user', netscan: true, appscan: true, exploit: true },
    ],
  },
];
