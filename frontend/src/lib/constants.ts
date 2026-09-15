// EthioVuln — API Constants

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL ?? '';

export const SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', color: '#FF0040', bg: 'rgba(255,0,64,0.15)', border: 'rgba(255,0,64,0.3)' },
  high:     { label: 'HIGH',     color: '#FF4444', bg: 'rgba(255,68,68,0.15)', border: 'rgba(255,68,68,0.3)' },
  medium:   { label: 'MEDIUM',   color: '#FFB020', bg: 'rgba(255,176,32,0.15)', border: 'rgba(255,176,32,0.3)' },
  low:      { label: 'LOW',      color: '#44BB44', bg: 'rgba(68,187,68,0.15)', border: 'rgba(68,187,68,0.3)' },
  info:     { label: 'INFO',     color: '#4488FF', bg: 'rgba(68,136,255,0.15)', border: 'rgba(68,136,255,0.3)' },
} as const;

export const SCAN_TYPE_LABELS: Record<string, string> = {
  full: 'Full Scan (Nuclei + ZAP + Fuzzer)',
  nuclei_only: 'Nuclei Only (Template Scan)',
  zap_only: 'ZAP Only (Spider + Active Scan)',
  fuzz_only: 'Fuzzer Only (Directory Scan)',
  nuclei_zap: 'Nuclei + ZAP',
};

export const SCAN_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: '#94a3b8' },
  verifying: { label: 'Verifying', color: '#FFB020' },
  running:   { label: 'Running',   color: '#00ff88' },
  completed: { label: 'Completed', color: '#44BB44' },
  failed:    { label: 'Failed',    color: '#FF0040' },
  cancelled: { label: 'Cancelled', color: '#94a3b8' },
};
