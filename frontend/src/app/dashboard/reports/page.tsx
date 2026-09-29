'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { SEVERITY_CONFIG } from '@/lib/constants';
import { PageNav } from '@/components/navigation/PageNav';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { ReportCard, type ReportEntry } from '@/components/reports/ReportCard';

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
      const data = (await api.listReports()) as ReportEntry[];
      setReports(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(report: ReportEntry) {
    setDownloading(report.scan_id);
    try {
      const blob = await api.downloadReport(report.scan_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EthioVuln_Report_${report.target_domain}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to download report');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div>
      <PageNav
        backHref="/dashboard"
        backLabel="Overview"
        title="Reports"
        nextHref="/dashboard/scans/new"
        nextLabel="New Scan"
      />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
          <span className="text-gradient">◧ Reports</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>
          Download PDF vulnerability assessment reports for completed scans
        </p>
      </div>

      {/* Error */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={80} borderRadius={12} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && reports.length === 0 && (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>
            No reports yet
          </div>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
            Reports are generated automatically when a scan completes.
          </p>
          <Link
            href="/dashboard/scans/new"
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              borderRadius: 10,
              background: 'rgba(0,255,136,0.15)',
              border: '1px solid rgba(0,255,136,0.3)',
              color: '#00ff88',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            🔍 Run a Scan
          </Link>
        </div>
      )}

      {/* Reports table */}
      {!loading && reports.length > 0 && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 80px 80px 80px 200px',
              padding: '12px 20px',
              borderBottom: '1px solid rgba(148,163,184,0.1)',
              fontSize: 11,
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: '0.05em',
            }}
          >
            <span>TARGET</span>
            <span style={{ color: SEVERITY_CONFIG.critical.color }}>CRIT</span>
            <span style={{ color: SEVERITY_CONFIG.high.color }}>HIGH</span>
            <span style={{ color: SEVERITY_CONFIG.medium.color }}>MED</span>
            <span style={{ color: SEVERITY_CONFIG.low.color }}>LOW</span>
            <span>ACTION</span>
          </div>

          {reports.map((report, i) => (
            <ReportCard
              key={report.scan_id}
              report={report}
              onDownload={handleDownload}
              isDownloading={downloading === report.scan_id}
              isLast={i === reports.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
