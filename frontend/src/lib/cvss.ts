// EthioVuln — Client-side CVSS Severity Utilities

import { Severity } from '@/types/vulnerability';
import { SEVERITY_CONFIG } from './constants';

export function getSeverityConfig(severity: Severity) {
  return SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;
}

export function scoreToSeverity(score: number): Severity {
  if (score >= 9.0) return 'critical';
  if (score >= 7.0) return 'high';
  if (score >= 4.0) return 'medium';
  if (score > 0.0) return 'low';
  return 'info';
}

export function getCweUrl(cweId: string | null): string {
  if (!cweId) return '';
  const numeric = cweId.replace('CWE-', '').trim();
  return `https://cwe.mitre.org/data/definitions/${numeric}.html`;
}

export function formatCvssScore(score: number): string {
  return score.toFixed(1);
}

export function getSeverityWeight(severity: Severity): number {
  const weights: Record<Severity, number> = {
    critical: 5,
    high: 4,
    medium: 3,
    low: 2,
    info: 1,
  };
  return weights[severity] || 0;
}
