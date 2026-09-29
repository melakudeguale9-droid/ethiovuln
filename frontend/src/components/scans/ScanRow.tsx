// EthioVuln — Reusable Scan Row Component
import React from 'react';
import Link from 'next/link';
import { SCAN_TYPE_LABELS } from '@/lib/constants';
import { ScanStatusBadge } from '@/components/scans/ScanStatusBadge';
import type { Scan } from '@/types/scan';

export interface ScanRowProps {
  scan: Scan;
}

export function ScanRow({ scan }: ScanRowProps) {
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{scan.target_domain}</div>
        <div
          style={{
            fontSize: 11,
            color: '#64748B',
            fontFamily: 'var(--font-mono)',
            maxWidth: 220,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {scan.target_url}
        </div>
      </td>
      <td style={{ color: '#94A3B8', fontSize: 12 }}>
        {SCAN_TYPE_LABELS[scan.scan_type] || scan.scan_type}
      </td>
      <td>
        <ScanStatusBadge status={scan.status} />
      </td>
      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{scan.total_vulnerabilities}</td>
      <td style={{ color: scan.critical_count > 0 ? '#EF4444' : '#64748B', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
        {scan.critical_count}
      </td>
      <td style={{ color: scan.high_count > 0 ? '#F59E0B' : '#64748B', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
        {scan.high_count}
      </td>
      <td style={{ color: '#94A3B8', fontSize: 12, whiteSpace: 'nowrap' }}>
        {new Date(scan.created_at).toLocaleDateString()}
      </td>
      <td>
        <Link
          href={`/dashboard/scans/${scan.id}`}
          style={{ color: '#00E5FF', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
        >
          View →
        </Link>
      </td>
    </tr>
  );
}

export default ScanRow;
