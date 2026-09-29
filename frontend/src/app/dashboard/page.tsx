'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { SCAN_STATUS_CONFIG, SEVERITY_CONFIG, SCAN_TYPE_LABELS } from '@/lib/constants';
import type { Scan, ScanListResponse } from '@/types/scan';
import { SeverityBadge } from '@/components/scans/SeverityBadge';
import { ScanStatusBadge } from '@/components/scans/ScanStatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await api.listScans(1, 50)) as ScanListResponse;
        setScans(data.scans || []);
      } catch (e) {
        console.error('Failed to load dashboard scans:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Strict user data calculations
  const totalScans = scans.length;
  const uniqueTargets = new Set(scans.map((s) => s.target_domain).filter(Boolean)).size;
  const activeScans = scans.filter((s) => s.status === 'running' || s.status === 'verifying').length;
  const totalVulns = scans.reduce((sum, s) => sum + (s.total_vulnerabilities || 0), 0);
  const totalCritical = scans.reduce((sum, s) => sum + (s.critical_count || 0), 0);
  const totalHigh = scans.reduce((sum, s) => sum + (s.high_count || 0), 0);
  const totalMedium = scans.reduce((sum, s) => sum + (s.medium_count || 0), 0);
  const totalLow = scans.reduce((sum, s) => sum + (s.low_count || 0), 0);
  const totalInfo = scans.reduce((sum, s) => sum + (s.info_count || 0), 0);

  const severityBreakdown = [
    { label: 'Critical', count: totalCritical, color: '#EF4444' },
    { label: 'High', count: totalHigh, color: '#F59E0B' },
    { label: 'Medium', count: totalMedium, color: '#3B82F6' },
    { label: 'Low', count: totalLow, color: '#10B981' },
    { label: 'Info', count: totalInfo, color: '#0284C7' },
  ];
  const maxSeverity = Math.max(...severityBreakdown.map((d) => d.count), 1);

  return (
    <div>
      {/* Top Header & Quick Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 10px #10B981',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#00E5FF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Security Operations Center
            </span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Dashboard Overview
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 13, marginTop: 2 }}>
            Real-time assessment telemetry and vulnerability tracking across all targets
          </p>
        </div>

        {/* Quick Action Bar */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href="/dashboard/scans/new"
            className="btn-glow btn-glow-cyan"
            style={{ fontSize: 13, padding: '9px 18px' }}
          >
            ＋ Launch Scan
          </Link>
          <Link
            href="/dashboard/reports"
            className="btn-outline"
            style={{ fontSize: 13, padding: '9px 16px' }}
          >
            ◧ View Reports
          </Link>
          <Link
            href="/dashboard/settings"
            className="btn-outline"
            style={{ fontSize: 13, padding: '9px 16px' }}
          >
            ⚙ Settings
          </Link>
        </div>
      </div>

      {/* Realistic Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: 'Total Scans',
            value: totalScans,
            color: '#00E5FF',
            desc: 'Completed assessments',
          },
          {
            label: 'Unique Targets',
            value: uniqueTargets,
            color: '#6366F1',
            desc: 'Secured domains',
          },
          {
            label: 'Active Scans',
            value: activeScans,
            color: activeScans > 0 ? '#10B981' : '#94A3B8',
            desc: activeScans > 0 ? 'In-progress jobs' : 'Queue idle',
            pulse: activeScans > 0,
          },
          {
            label: 'Total Findings',
            value: totalVulns,
            color: totalVulns > 0 ? '#F59E0B' : '#94A3B8',
            desc: 'Aggregated vulnerabilities',
          },
          {
            label: 'Critical Vulnerabilities',
            value: totalCritical,
            color: totalCritical > 0 ? '#EF4444' : '#64748B',
            desc: 'Requires immediate action',
            pulse: totalCritical > 0,
          },
        ].map((card, i) => (
          <div
            key={i}
            className="glass-card"
            style={{
              padding: '18px 20px',
              border: `1px solid ${card.color}25`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {card.pulse && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: card.color,
                  boxShadow: `0 0 8px ${card.color}`,
                }}
              />
            )}
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {card.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: card.color, fontFamily: 'var(--font-mono)', margin: '8px 0 4px', lineHeight: 1 }}>
              {loading ? '—' : card.value}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Analytics & Distribution Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)',
          gap: 20,
          marginBottom: 28,
        }}
      >
        {/* Severity Distribution */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>
              Severity Breakdown
            </h2>
            <span className="mono-tag" style={{ fontSize: 11 }}>
              {totalVulns} Total
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
            </div>
          ) : totalVulns === 0 ? (
            <div style={{ padding: '30px 10px', textAlign: 'center', color: '#64748B', fontSize: 13 }}>
              No vulnerabilities identified across your assessments yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {severityBreakdown.map((item) => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.label}</span>
                    <span style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{item.count}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 3,
                        width: `${(item.count / maxSeverity) * 100}%`,
                        background: item.color,
                        transition: 'width 0.6s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Target Posture Summary */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>
              Security Posture Summary
            </h2>
            <span className="mono-tag" style={{ fontSize: 11, color: '#10B981' }}>
              Verified
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 8,
                background: 'rgba(5, 8, 17, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>Clean Assessments</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>Scans with 0 critical or high findings</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                {scans.filter((s) => s.status === 'completed' && s.critical_count === 0 && s.high_count === 0).length}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 8,
                background: 'rgba(5, 8, 17, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>At-Risk Targets</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>Targets with active critical vulnerabilities</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: totalCritical > 0 ? '#EF4444' : '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                {scans.filter((s) => s.critical_count > 0).length}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 8,
                background: 'rgba(5, 8, 17, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>Pipeline Ready</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>SSRF protection & rate-limiting enabled</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#00E5FF' }}>ACTIVE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans Table / Empty State */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>Recent Security Scans</h2>
            <p style={{ color: '#64748B', fontSize: 12 }}>Latest vulnerability assessments executed on your account</p>
          </div>
          {scans.length > 0 && (
            <Link
              href="/dashboard/scans"
              style={{ color: '#00E5FF', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
            >
              View all history →
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={46} />
            ))}
          </div>
        ) : scans.length === 0 ? (
          /* Clean Cyber Empty State */
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px dashed rgba(148, 163, 184, 0.15)',
              borderRadius: 12,
              background: 'rgba(5, 8, 17, 0.3)',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(0, 229, 255, 0.08)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#00E5FF',
                marginBottom: 16,
              }}
            >
              🛡
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', marginBottom: 6 }}>
              No Security Scans Yet
            </h3>
            <p style={{ color: '#94A3B8', fontSize: 13, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.6 }}>
              You haven&apos;t launched any vulnerability assessments. Configure your first authorized target domain to start uncovering vulnerabilities.
            </p>
            <Link
              href="/dashboard/scans/new"
              className="btn-glow btn-glow-cyan"
              style={{ fontSize: 14, padding: '10px 24px' }}
            >
              Launch First Scan →
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Target Domain</th>
                  <th>Scan Type</th>
                  <th>Status</th>
                  <th>Severity Highlights</th>
                  <th>Total Vulns</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scans.slice(0, 7).map((scan) => (
                  <tr key={scan.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{scan.target_domain}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#64748B',
                          fontFamily: 'var(--font-mono)',
                          maxWidth: 240,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {scan.target_url}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: '#94A3B8' }}>
                      {SCAN_TYPE_LABELS[scan.scan_type] || scan.scan_type}
                    </td>
                    <td>
                      <ScanStatusBadge status={scan.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {scan.critical_count > 0 && <SeverityBadge severity="critical" count={scan.critical_count} />}
                        {scan.high_count > 0 && <SeverityBadge severity="high" count={scan.high_count} />}
                        {scan.medium_count > 0 && <SeverityBadge severity="medium" count={scan.medium_count} />}
                        {scan.critical_count === 0 && scan.high_count === 0 && scan.medium_count === 0 && (
                          <span style={{ fontSize: 11, color: '#64748B' }}>Clean</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: scan.total_vulnerabilities > 0 ? '#F59E0B' : '#94A3B8' }}>
                      {scan.total_vulnerabilities}
                    </td>
                    <td style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>
                      {new Date(scan.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        href={`/dashboard/scans/${scan.id}`}
                        style={{ color: '#00E5FF', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
