// EthioVuln — Central Application Constants

export const APP_NAME = 'EthioVuln';
export const APP_TAGLINE = 'Automated Web Vulnerability Assessment Platform';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL ?? '';

// ─── Public Social & Creator Links ──────────────────────────────────────────
export const SOCIAL_LINKS = {
  telegram: {
    label: 'Telegram',
    username: 'melakucyber',
    url: 'https://t.me/melakucyber',
  },
  linkedin: {
    label: 'LinkedIn',
    username: 'melaku-deguale-7803ba416',
    url: 'https://www.linkedin.com/in/melaku-deguale-7803ba416/',
  },
  github: {
    label: 'GitHub',
    username: 'melakudeguale9-droid',
    url: 'https://github.com/melakudeguale9-droid',
    repoUrl: 'https://github.com/melakudeguale9-droid/ethiovuln',
  },
} as const;

// ─── Navigation Definitions ──────────────────────────────────────────────────
export const PUBLIC_NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/dashboard/scans/new', label: 'Scan' },
  { href: '/about', label: 'About' },
] as const;

export interface DashboardNavItem {
  href: string;
  icon: string;
  label: string;
  children?: { href: string; icon?: string; label: string }[];
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: '/dashboard', icon: '◆', label: 'Overview' },
  { href: '/dashboard/scans', icon: '⬡', label: 'Scans' },
  { href: '/dashboard/scans/new', icon: '＋', label: 'New Scan' },
  { href: '/dashboard/reports', icon: '◧', label: 'Reports' },
  {
    href: '/dashboard/settings',
    icon: '⚙',
    label: 'Settings',
    children: [
      { href: '/dashboard/settings?tab=profile', icon: '👤', label: 'Profile' },
      { href: '/dashboard/settings?tab=billing', icon: '💳', label: 'Billing & Plans' },
      { href: '/dashboard/settings?tab=security', icon: '🔑', label: 'Security' },
      { href: '/dashboard/settings?tab=scans', icon: '🔍', label: 'Scan Prefs' },
      { href: '/dashboard/settings?tab=workspaces', icon: '🏢', label: 'Workspaces' },
      { href: '/dashboard/settings?tab=vpn', icon: '🛡️', label: 'VPN Profiles' },
      { href: '/dashboard/settings?tab=notifications', icon: '🔔', label: 'Notifications' },
      { href: '/dashboard/settings?tab=wordlists', icon: '📋', label: 'Wordlists' },
      { href: '/dashboard/settings?tab=dashboard', icon: '📊', label: 'Dashboard' },
      { href: '/dashboard/settings?tab=reports', icon: '📄', label: 'Reports' },
      { href: '/dashboard/settings?tab=apikeys', icon: '🌐', label: 'API Keys' },
      { href: '/dashboard/settings?tab=danger', icon: '⚠️', label: 'Danger Zone' },
    ],
  },
];

// ─── Security Severity & Scan Config ────────────────────────────────────────
export const SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', color: '#EF4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.35)' },
  high: { label: 'HIGH', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)' },
  medium: { label: 'MEDIUM', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.35)' },
  low: { label: 'LOW', color: '#10B981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.35)' },
  info: { label: 'INFO', color: '#0284C7', bg: 'rgba(2,132,199,0.15)', border: 'rgba(2,132,199,0.35)' },
} as const;

export const SCAN_TYPE_LABELS: Record<string, string> = {
  full: 'Full Scan (Nuclei + ZAP + Fuzzer)',
  nuclei_only: 'Nuclei Only (Template Scan)',
  zap_only: 'ZAP Only (Spider + Active Scan)',
  fuzz_only: 'Fuzzer Only (Directory Scan)',
  nuclei_zap: 'Nuclei + ZAP',
};

export const SCAN_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: '#94A3B8' },
  verifying: { label: 'Verifying', color: '#F59E0B' },
  running: { label: 'Running', color: '#00E5FF' },
  completed: { label: 'Completed', color: '#10B981' },
  failed: { label: 'Failed', color: '#EF4444' },
  cancelled: { label: 'Cancelled', color: '#64748B' },
};
