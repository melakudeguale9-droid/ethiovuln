// EthioVuln — Vulnerability Severity Badge Component
import React from 'react';
import { SEVERITY_CONFIG } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import type { Severity } from '@/types/vulnerability';

export interface SeverityBadgeProps {
  severity: Severity | string;
  count?: number;
  style?: React.CSSProperties;
}

export function SeverityBadge({ severity, count, style }: SeverityBadgeProps) {
  const norm = (severity || 'info').toLowerCase() as keyof typeof SEVERITY_CONFIG;
  const config = SEVERITY_CONFIG[norm] || SEVERITY_CONFIG.info;

  return (
    <Badge color={config.color} style={style}>
      {config.label}{count !== undefined ? ` (${count})` : ''}
    </Badge>
  );
}

export default SeverityBadge;
