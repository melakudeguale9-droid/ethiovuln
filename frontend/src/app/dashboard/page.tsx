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

  const totalScans = scans.length;
  const uniqueTargets = new Set(scans.map((s) => s.target_domain).filter(Boolean)).size;
  const activeScans = scans.filter((s) => s.status === 'running' || s.status === 'verifying').length;
  const totalVulns = scans.reduce((sum, s) => sum + (s.total_vulnerabilities || 0), 0);
  const totalCritical = scans.reduce((sum, s) => sum + (s.critical_count || 0), 0);
  const totalHigh = scans.reduce((sum, s) => sum + (s.high_count || 0), 0);
  const criticalHighCount = totalCritical + totalHigh;
  const totalMedium = scans.reduce((sum, s) => sum + (s.medium_count || 0), 0);
  const totalLow = scans.reduce((sum, s) => sum + (s.low_count || 0), 0);
  const totalInfo = scans.reduce((sum, s) => sum + (s.info_count || 0), 0);

  const severityBreakdown = [
    { label: 'Critical', count: totalCritical, color: '#EF4444' }, // red-500
    { label: 'High', count: totalHigh, color: '#F59E0B' }, // amber-500
    { label: 'Medium', count: totalMedium, color: '#3B82F6' }, // blue-500
    { label: 'Low', count: totalLow, color: '#10B981' }, // emerald-500
    { label: 'Info', count: totalInfo, color: '#0EA5E9' }, // sky-500
  ];
  
  // Calculate SVG donut chart dashes (Total circumference ~ 100 for r=15.915)
  let cumulativeOffset = 0;
  const totalVulnsForChart = totalVulns > 0 ? totalVulns : 1; // avoid div by 0
  const donutSegments = severityBreakdown.map((item) => {
    const percentage = (item.count / totalVulnsForChart) * 100;
    const dasharray = `${percentage} ${100 - percentage}`;
    const dashoffset = 25 - cumulativeOffset;
    cumulativeOffset += percentage;
    return { ...item, percentage, dasharray, dashoffset };
  });

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
            <span className="text-[11px] font-bold text-cyan-400 tracking-widest uppercase">
              Security Operations Center
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time assessment telemetry and vulnerability tracking across all targets
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/scans/new"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            ＋ Launch Scan
          </Link>
          <Link
            href="/dashboard/reports"
            className="px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-300 text-sm font-medium rounded-lg transition-all"
          >
            ◧ View Reports
          </Link>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Scans */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm relative overflow-hidden">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Total Scans</div>
          <div className="text-2xl font-bold text-white mb-1">{loading ? '—' : totalScans}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            {activeScans > 0 ? (
              <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {activeScans} active assessments</>
            ) : (
              'All scans completed'
            )}
          </div>
        </div>
        {/* Vulnerabilities Found */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm relative overflow-hidden">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Vulnerabilities Found</div>
          <div className="text-2xl font-bold text-white mb-1">{loading ? '—' : totalVulns}</div>
          <div className="text-xs text-slate-500">Aggregate security issues</div>
        </div>
        {/* Critical & High Risks */}
        <div className="rounded-2xl border border-rose-900/30 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Critical & High Risks</div>
          <div className="text-2xl font-bold text-rose-500 mb-1">{loading ? '—' : criticalHighCount}</div>
          <div className="text-xs text-rose-400/80">Immediate remediation required</div>
        </div>
        {/* Target Domains */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm relative overflow-hidden">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Target Domains</div>
          <div className="text-2xl font-bold text-white mb-1">{loading ? '—' : uniqueTargets}</div>
          <div className="text-xs text-slate-500">Unique audited targets</div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        
        {/* Vulnerability Trends */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm flex flex-col">
          <h2 className="text-white text-sm font-semibold mb-4">Assessment Velocity</h2>
          <div className="flex-1 relative w-full min-h-[160px] flex items-end">
            {/* SVG Trendline Mock */}
            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q20,60 40,70 T80,40 T100,20 L100,100 L0,100 Z" fill="url(#gradientFill)" />
              <path d="M0,80 Q20,60 40,70 T80,40 T100,20" fill="none" stroke="url(#gradientLine)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute bottom-2 left-2 text-xs text-slate-500">30 Days Trend</div>
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm">
          <h2 className="text-white text-sm font-semibold mb-4">Severity Breakdown</h2>
          <div className="flex items-center justify-center mb-4">
            <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
              {totalVulns === 0 ? (
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1E293B" strokeWidth="4" />
              ) : (
                donutSegments.map((segment) => (
                  segment.percentage > 0 && (
                    <circle
                      key={segment.label}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="4"
                      strokeDasharray={segment.dasharray}
                      strokeDashoffset={segment.dashoffset}
                    />
                  )
                ))
              )}
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {severityBreakdown.map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-400">{item.label}</span>
                </div>
                <span className="text-slate-300 font-mono">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Attack Vectors (INSA Mandatory) */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm mb-8">
        <h2 className="text-white text-sm font-semibold mb-4">Top Vulnerability Classes (INSA Scope)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'SQL Injection', val: totalCritical > 0 ? 45 : 0, color: 'bg-rose-500' },
            { label: 'Cross-Site Scripting', val: totalHigh > 0 ? 65 : 0, color: 'bg-amber-500' },
            { label: 'CSRF', val: totalMedium > 0 ? 30 : 0, color: 'bg-blue-500' },
            { label: 'Security Headers', val: totalLow > 0 ? 80 : 0, color: 'bg-emerald-500' }
          ].map((vector) => (
            <div key={vector.label} className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-medium">{vector.label}</span>
                <span className="text-xs text-slate-300 font-mono">{vector.val}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${vector.color} rounded-full`} style={{ width: `${vector.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Assessments Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-white text-sm font-semibold">Recent Assessments</h2>
            <p className="text-slate-400 text-xs mt-1">Latest vulnerability scans on your account</p>
          </div>
          {scans.length > 0 && (
            <Link href="/dashboard/scans" className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">
              View All →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={50} />
            ))}
          </div>
        ) : scans.length === 0 ? (
          <div className="py-12 px-6 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center text-xl mb-4">
              🛡
            </div>
            <h3 className="text-white text-sm font-semibold mb-2">No Assessments Found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">
              You haven&apos;t launched any vulnerability assessments yet. Configure your first authorized target domain to begin.
            </p>
            <Link
              href="/dashboard/scans/new"
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold rounded-lg transition-all inline-block shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              Start New Assessment →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-3 px-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Target Domain</th>
                  <th className="py-3 px-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-slate-400 text-xs font-medium uppercase tracking-wider">Severity Breakdown</th>
                  <th className="py-3 px-4 text-slate-400 text-xs font-medium uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {scans.slice(0, 7).map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-white text-sm font-medium">{scan.target_domain}</div>
                      <div className="text-slate-500 text-xs font-mono truncate max-w-[200px]">{scan.target_url}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <ScanStatusBadge status={scan.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 items-center">
                        {scan.critical_count > 0 && <SeverityBadge severity="critical" count={scan.critical_count} />}
                        {scan.high_count > 0 && <SeverityBadge severity="high" count={scan.high_count} />}
                        {scan.medium_count > 0 && <SeverityBadge severity="medium" count={scan.medium_count} />}
                        {scan.critical_count === 0 && scan.high_count === 0 && scan.medium_count === 0 && (
                          <span className="text-slate-500 text-xs">Clean</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/dashboard/scans/${scan.id}`} className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">
                        View Report
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
