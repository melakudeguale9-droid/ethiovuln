// EthioVuln — Live Scan View Page

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { SEVERITY_CONFIG, SCAN_STATUS_CONFIG } from '@/lib/constants';
import { getCweUrl, formatCvssScore } from '@/lib/cvss';
import type { Scan } from '@/types/scan';
import type { Vulnerability, Severity } from '@/types/vulnerability';
import { useRef } from 'react';

export default function ScanDetailPage() {
  const params = useParams();
  const scanId = params.id as string;
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedVuln, setExpandedVuln] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const ws = useWebSocket(scanId);

  // Fetch scan data - poll every 3 seconds when running
  useEffect(() => {
    const fetchScan = async () => {
      try {
        const data = await api.getScan(scanId) as Scan;
        setScan(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchScan();
    // Poll every 3s always so DB status always reflects
    const interval = setInterval(fetchScan, 3000);
    return () => clearInterval(interval);
  }, [scanId]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [ws.logs]);

  // Always use DB data as source of truth, WS adds live logs/vulns
  const progress = scan?.progress || ws.progress || 0;
  const status = scan?.status || ws.status || 'pending';
  const statusConfig = SCAN_STATUS_CONFIG[status] || { label: status, color: '#94a3b8' };
  const isRunning = status === 'running' || status === 'verifying' || status === 'pending';
  const displayVulns = ws.vulnerabilities.length > 0
    ? ws.vulnerabilities
    : (scan as any)?.vulnerabilities || [];

  const handleStopScan = async () => {
    if (!isRunning) return; // Don't try to stop already finished scans
    try {
      await api.stopScan(scanId);
      ws.disconnect();
    } catch (e) {
      // Ignore "cannot stop" errors - scan may have already finished
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await api.downloadReport(scanId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DAST_Report_${scan?.target_domain || 'scan'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ width: 300, height: 36, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 200, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 400 }} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            <span className="text-gradient">{scan?.target_domain}</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 13, fontFamily: 'var(--font-mono)' }}>{scan?.target_url}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{
            fontSize: 12, fontWeight: 600, color: statusConfig.color,
            background: `${statusConfig.color}15`, padding: '6px 14px',
            borderRadius: 9999, border: `1px solid ${statusConfig.color}30`,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {isRunning && <span className="pulse-dot" style={{ width: 6, height: 6 }} />}
            {statusConfig.label}
          </span>
          {isRunning && (
            <button className="btn-glow btn-glow-red" onClick={handleStopScan} style={{ fontSize: 13, padding: '8px 16px' }}>
              Stop Scan
            </button>
          )}
          {status === 'completed' && (
            <button className="btn-glow btn-glow-green" onClick={handleDownloadReport} style={{ fontSize: 13, padding: '8px 16px' }}>
              ◧ Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>
            {ws.stage || 'Scan Progress'}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#00ff88' }}>{progress}%</span>
        </div>
        <div className="progress-bar-track" style={{ height: 10 }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {(['critical', 'high', 'medium', 'low', 'info'] as Severity[]).map(sev => {
          const cfg = SEVERITY_CONFIG[sev];
          const countsMap: Record<string, number> = scan ? {
            critical: scan.critical_count, high: scan.high_count,
            medium: scan.medium_count, low: scan.low_count, info: scan.info_count,
          } : {};
          const count = ws.vulnerabilities.filter(v => v.severity === sev).length || countsMap[sev] || 0;
          return (
            <div key={sev} className="glass-card" style={{
              padding: '14px 16px', textAlign: 'center',
              borderTop: `3px solid ${cfg.color}`,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: cfg.color }}>{count}</div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
                {cfg.label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Live Log Stream */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>Live Scan Logs</h2>
            {ws.connected && <span style={{ fontSize: 11, color: '#00ff88', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6 }} /> Connected
            </span>}
          </div>
          <div ref={logContainerRef} className="log-stream" style={{ height: 350 }}>
            {ws.logs.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', paddingTop: 40 }}>
                Waiting for scan logs...
              </div>
            ) : (
              ws.logs.map((log, i) => (
                <div key={i} className={`log-line log-${log.level}`}>
                  <span style={{ color: '#64748b', marginRight: 8 }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vulnerability Table */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 12 }}>
            Findings ({displayVulns.length})
          </h2>
          <div style={{ maxHeight: 390, overflowY: 'auto' }}>
            {displayVulns.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', paddingTop: 40 }}>
                {isRunning ? 'Vulnerabilities will appear here as they are found...' : 'No vulnerabilities found'}
              </div>
            ) : (
              displayVulns.map((vuln: Vulnerability, i: number) => {
                const sevCfg = SEVERITY_CONFIG[vuln.severity as Severity] || SEVERITY_CONFIG.info;
                const isExpanded = expandedVuln === `${i}`;
                return (
                  <div key={i} style={{
                    borderBottom: '1px solid rgba(148,163,184,0.1)',
                    padding: '10px 0',
                  }}>
                    <div
                      onClick={() => setExpandedVuln(isExpanded ? null : `${i}`)}
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#f1f5f9', marginBottom: 2 }}>
                          {vuln.title}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>
                          {vuln.source?.toUpperCase()} · {vuln.url?.substring(0, 50)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`badge badge-${vuln.severity}`}>{sevCfg.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: sevCfg.color }}>
                          {formatCvssScore(vuln.cvss_score || 0)}
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{ marginTop: 10, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8, fontSize: 13 }}>
                        {vuln.description && <p style={{ color: '#94a3b8', marginBottom: 8 }}>{vuln.description}</p>}
                        {vuln.cwe_id && (
                          <p style={{ marginBottom: 4 }}>
                            <strong style={{ color: '#64748b' }}>CWE:</strong>{' '}
                            <a href={getCweUrl(vuln.cwe_id)} target="_blank" rel="noopener" style={{ color: '#0088ff', textDecoration: 'none' }}>
                              {vuln.cwe_id} — {vuln.cwe_name}
                            </a>
                          </p>
                        )}
                        {vuln.cvss_vector && (
                          <p style={{ marginBottom: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#64748b' }}>
                            {vuln.cvss_vector}
                          </p>
                        )}
                        {vuln.evidence && (
                          <div style={{ marginTop: 8 }}>
                            <strong style={{ color: '#64748b', fontSize: 12 }}>Evidence:</strong>
                            <div className="evidence-box" style={{
                              background: '#0d1117', color: '#00ff88', padding: 10, borderRadius: 6, fontSize: 11,
                              fontFamily: 'var(--font-mono)', maxHeight: 120, overflow: 'auto', marginTop: 4,
                            }}>
                              {vuln.evidence}
                            </div>
                          </div>
                        )}
                        {vuln.remediation && (
                          <div style={{
                            marginTop: 8, padding: 10, background: 'rgba(68,187,68,0.05)',
                            borderLeft: '3px solid #44bb44', borderRadius: 4, fontSize: 12, color: '#94a3b8',
                          }}>
                            <strong style={{ color: '#44bb44' }}>Remediation:</strong>
                            <pre style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{vuln.remediation}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
