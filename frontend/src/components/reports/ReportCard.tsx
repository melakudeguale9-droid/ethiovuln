// EthioVuln — Reusable Report Row / Card Component
'use client';

import React from 'react';
import Link from 'next/link';
import { SEVERITY_CONFIG } from '@/lib/constants';

export interface ReportEntry {
  scan_id: string;
  target_url: string;
  target_domain: string;
  completed_at: string | null;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  info_count: number;
}

export interface ReportCardProps {
  report: ReportEntry;
  onDownload: (report: ReportEntry) => void;
  isDownloading: boolean;
  isLast?: boolean;
}

export function ReportCard({ report, onDownload, isDownloading, isLast = false }: ReportCardProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px 80px 80px 80px 200px',
        padding: '16px 20px',
        borderBottom: isLast ? 'none' : '1px solid rgba(148, 163, 184, 0.06)',
        alignItems: 'center',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Target Domain & URL */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 2 }}>
          {report.target_domain}
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#64748b',
            fontFamily: 'var(--font-mono)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 320,
          }}
        >
          {report.target_url}
        </div>
        <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
          {report.completed_at ? new Date(report.completed_at).toLocaleString() : '—'}
        </div>
      </div>

      {/* Severity counts */}
      <span style={{ fontSize: 14, fontWeight: 700, color: SEVERITY_CONFIG.critical.color }}>
        {report.critical_count}
      </span>
      <span style={{ fontSize: 14, fontWeight: 700, color: SEVERITY_CONFIG.high.color }}>
        {report.high_count}
      </span>
      <span style={{ fontSize: 14, fontWeight: 700, color: SEVERITY_CONFIG.medium.color }}>
        {report.medium_count}
      </span>
      <span style={{ fontSize: 14, fontWeight: 700, color: SEVERITY_CONFIG.low.color }}>
        {report.low_count}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => onDownload(report)}
          disabled={isDownloading}
          style={{
            padding: '7px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: isDownloading ? 'wait' : 'pointer',
            background: 'rgba(0, 136, 255, 0.15)',
            border: '1px solid rgba(0, 136, 255, 0.3)',
            color: '#00d4ff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isDownloading) e.currentTarget.style.background = 'rgba(0, 136, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            if (!isDownloading) e.currentTarget.style.background = 'rgba(0, 136, 255, 0.15)';
          }}
        >
          {isDownloading ? (
            <>
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>⬇</span>
              <span>PDF</span>
            </>
          )}
        </button>

        <Link
          href={`/dashboard/scans/${report.scan_id}`}
          style={{
            padding: '7px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: '#94a3b8',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f1f5f9';
            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.12)';
          }}
        >
          View Scan →
        </Link>
      </div>
    </div>
  );
}

export default ReportCard;
