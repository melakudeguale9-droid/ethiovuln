// EthioVuln — Scan Status Badge Component
import React from 'react';
import { SCAN_STATUS_CONFIG } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import type { ScanStatus } from '@/types/scan';

export interface ScanStatusBadgeProps {
  status: ScanStatus | string;
  style?: React.CSSProperties;
}

export function ScanStatusBadge({ status, style }: ScanStatusBadgeProps) {
  const config = SCAN_STATUS_CONFIG[status] || { label: status, color: '#94a3b8' };
  const isLive = status === 'running' || status === 'verifying';

  return (
    <Badge color={config.color} dot={isLive} style={style}>
      {config.label}
    </Badge>
  );
}

export default ScanStatusBadge;
