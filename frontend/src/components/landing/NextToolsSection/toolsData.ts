export interface ToolItem {
  id: string;
  name: string;
  category: 'most-used' | 'recon' | 'scanners' | 'exploit';
  bgColor: string; // e.g. '#E5832E'
  hasFreeLightBadge: boolean;
  href: string;
  iconType: 'spider' | 'network' | 'target' | 'eye' | 'terminal' | 'sniper' | 'dns' | 'ssl' | 'cloud' | 'api' | 'zap';
}

export interface ToolCategory {
  id: 'most-used' | 'recon' | 'scanners' | 'exploit';
  label: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: 'most-used', label: 'Most used' },
  { id: 'recon', label: 'Recon tools' },
  { id: 'scanners', label: 'Vulnerability scanners' },
  { id: 'exploit', label: 'Exploit tools' },
];

export const TOOLS_DATA: ToolItem[] = [
  /* ─── Most Used ──────────────────────────────────────────────────────────── */
  {
    id: 'website-scanner',
    name: 'Website Scanner',
    category: 'most-used',
    bgColor: '#E5832E',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new',
    iconType: 'spider',
  },
  {
    id: 'network-scanner',
    name: 'Network Scanner',
    category: 'most-used',
    bgColor: '#D97706',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=network',
    iconType: 'network',
  },
  {
    id: 'subdomain-finder',
    name: 'Subdomain Finder',
    category: 'most-used',
    bgColor: '#0EA5E9',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=subdomain',
    iconType: 'target',
  },
  {
    id: 'port-scanner',
    name: 'Port Scanner',
    category: 'most-used',
    bgColor: '#06B6D4',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=port',
    iconType: 'eye',
  },
  {
    id: 'url-fuzzer',
    name: 'URL Fuzzer',
    category: 'most-used',
    bgColor: '#38BDF8',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=fuzz',
    iconType: 'terminal',
  },
  {
    id: 'sniper-exploiter',
    name: 'Sniper: Auto-Exploiter',
    category: 'most-used',
    bgColor: '#E11D48',
    hasFreeLightBadge: false,
    href: '/dashboard/scans/new?type=deep',
    iconType: 'sniper',
  },

  /* ─── Recon Tools ────────────────────────────────────────────────────────── */
  {
    id: 'subdomain-recon',
    name: 'Subdomain Finder',
    category: 'recon',
    bgColor: '#0EA5E9',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=subdomain',
    iconType: 'target',
  },
  {
    id: 'port-recon',
    name: 'Port Scanner',
    category: 'recon',
    bgColor: '#06B6D4',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=port',
    iconType: 'eye',
  },
  {
    id: 'dns-recon',
    name: 'DNS Zone Audit',
    category: 'recon',
    bgColor: '#3B82F6',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=dns',
    iconType: 'dns',
  },
  {
    id: 'ssl-recon',
    name: 'SSL/TLS Analyzer',
    category: 'recon',
    bgColor: '#10B981',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=ssl',
    iconType: 'ssl',
  },
  {
    id: 'url-recon',
    name: 'URL Fuzzer & Spider',
    category: 'recon',
    bgColor: '#38BDF8',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=fuzz',
    iconType: 'terminal',
  },
  {
    id: 'whois-recon',
    name: 'Network Intel',
    category: 'recon',
    bgColor: '#8B5CF6',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=whois',
    iconType: 'network',
  },

  /* ─── Vulnerability Scanners ─────────────────────────────────────────────── */
  {
    id: 'web-vuln',
    name: 'Website Scanner',
    category: 'scanners',
    bgColor: '#E5832E',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new',
    iconType: 'spider',
  },
  {
    id: 'net-vuln',
    name: 'Network Scanner',
    category: 'scanners',
    bgColor: '#D97706',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=network',
    iconType: 'network',
  },
  {
    id: 'api-vuln',
    name: 'REST API Auditor',
    category: 'scanners',
    bgColor: '#6366F1',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=api',
    iconType: 'api',
  },
  {
    id: 'cloud-vuln',
    name: 'Cloud Misconfig Scan',
    category: 'scanners',
    bgColor: '#0284C7',
    hasFreeLightBadge: false,
    href: '/dashboard/scans/new?type=cloud',
    iconType: 'cloud',
  },
  {
    id: 'cve-vuln',
    name: 'CVE Database Matcher',
    category: 'scanners',
    bgColor: '#14B8A6',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=cve',
    iconType: 'target',
  },
  {
    id: 'cms-vuln',
    name: 'CMS Security Audit',
    category: 'scanners',
    bgColor: '#F59E0B',
    hasFreeLightBadge: true,
    href: '/dashboard/scans/new?type=cms',
    iconType: 'terminal',
  },

  /* ─── Exploit Tools ──────────────────────────────────────────────────────── */
  {
    id: 'sniper-auto',
    name: 'Sniper: Auto-Exploiter',
    category: 'exploit',
    bgColor: '#E11D48',
    hasFreeLightBadge: false,
    href: '/dashboard/scans/new?type=deep',
    iconType: 'sniper',
  },
  {
    id: 'sqli-exploit',
    name: 'SQLi Proof Assistant',
    category: 'exploit',
    bgColor: '#DC2626',
    hasFreeLightBadge: false,
    href: '/dashboard/scans/new?type=sqli',
    iconType: 'terminal',
  },
  {
    id: 'xss-exploit',
    name: 'XSS Verifier Engine',
    category: 'exploit',
    bgColor: '#EA580C',
    hasFreeLightBadge: false,
    href: '/dashboard/scans/new?type=xss',
    iconType: 'spider',
  },
  {
    id: 'oob-exploit',
    name: 'OOB Listener Probe',
    category: 'exploit',
    bgColor: '#D97706',
    hasFreeLightBadge: false,
    href: '/dashboard/scans/new?type=oob',
    iconType: 'target',
  },
  {
    id: 'auth-exploit',
    name: 'Auth Bypass Tester',
    category: 'exploit',
    bgColor: '#9333EA',
    hasFreeLightBadge: false,
    href: '/dashboard/scans/new?type=auth',
    iconType: 'eye',
  },
  {
    id: 'header-exploit',
    name: 'Payload Replayer',
    category: 'exploit',
    bgColor: '#0284C7',
    hasFreeLightBadge: false,
    href: '/dashboard/scans/new?type=replay',
    iconType: 'zap',
  },
];
