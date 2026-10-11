// EthioVuln — Live Scan View Page
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { SEVERITY_CONFIG, SCAN_STATUS_CONFIG } from '@/lib/constants';
import { getCweUrl, formatCvssScore } from '@/lib/cvss';
import type { Scan } from '@/types/scan';
import type { Vulnerability, Severity } from '@/types/vulnerability';
import { PageNav } from '@/components/navigation/PageNav';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ScanDetailPage() {
  const params = useParams();
  const scanId = params.id as string;
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedVuln, setExpandedVuln] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'all'>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(id);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const extractParameter = (vuln: Vulnerability): string | null => {
    if (vuln.affected_parameter) return vuln.affected_parameter;
    if (vuln.request_data) {
      const m = vuln.request_data.match(/Param(?:eter)?:\s*([^\r\n]+)/i);
      if (m) return m[1].trim();
    }
    if (vuln.evidence) {
      const m = vuln.evidence.match(/Affected Item:\s*([^\r\n|]+)/i);
      if (m) return m[1].trim();
    }
    return null;
  };

  const extractPayload = (vuln: Vulnerability): string | null => {
    if (vuln.request_data) {
      const m = vuln.request_data.match(/Payload:\s*([^\r\n]+)/i);
      if (m) return m[1].trim();
    }
    if (vuln.evidence) {
      const m = vuln.evidence.match(/Tested Payload:\s*([^\r\n|]+)/i);
      if (m) return m[1].trim();
    }
    return null;
  };

  const ws = useWebSocket(scanId);

  // Fetch scan data - poll every 3 seconds while running
  useEffect(() => {
    const fetchScan = async () => {
      try {
        const data = (await api.getScan(scanId)) as Scan;
        setScan(data);
      } catch (e) {
        console.error('Failed to poll scan:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchScan();
    const interval = setInterval(fetchScan, 3000);
    return () => clearInterval(interval);
  }, [scanId]);

  // Auto-scroll logs when enabled
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [ws.logs, autoScroll]);

  const status = (scan?.status || ws.status || 'pending').toLowerCase();
  const isCompleted = status === 'completed';
  const progress = isCompleted ? 100 : (ws.progress > 0 ? ws.progress : (scan?.progress ?? 0));
  const statusConfig = SCAN_STATUS_CONFIG[status] || { label: status, color: '#94A3B8' };
  const isRunning = status === 'running' || status === 'verifying' || status === 'pending';

  const rawVulns: Vulnerability[] = ws.vulnerabilities.length > 0
    ? ws.vulnerabilities
    : (scan as any)?.vulnerabilities || [];

  // Group findings by severity
  const groupedVulns = {
    critical: rawVulns.filter((v) => v.severity === 'critical'),
    high:     rawVulns.filter((v) => v.severity === 'high'),
    medium:   rawVulns.filter((v) => v.severity === 'medium'),
    low:      rawVulns.filter((v) => v.severity === 'low'),
    info:     rawVulns.filter((v) => v.severity === 'info'),
  };

  const filteredVulns = selectedSeverity === 'all'
    ? rawVulns
    : groupedVulns[selectedSeverity];

  const handleStopScan = async () => {
    if (!isRunning) return;
    try {
      await api.stopScan(scanId);
      ws.disconnect();
    } catch (e) {
      console.warn('Failed to stop scan:', e);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await api.downloadReport(scanId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EthioVuln_Report_${scan?.target_domain || 'assessment'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download PDF:', e);
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton width={320} height={36} style={{ marginBottom: 16 }} />
        <Skeleton height={140} style={{ marginBottom: 16 }} />
        <Skeleton height={400} />
      </div>
    );
  }

  return (
    <div>
      <PageNav
        backHref="/dashboard/scans"
        backLabel="Scans"
        title={scan?.target_domain || 'Scan Telemetry'}
      />

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              {scan?.target_domain}
            </h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: statusConfig.color,
                background: `${statusConfig.color}15`,
                padding: '4px 10px',
                borderRadius: 9999,
                border: `1px solid ${statusConfig.color}35`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                letterSpacing: '0.04em',
              }}
            >
              {isRunning && <span className="pulse-dot" style={{ width: 6, height: 6 }} />}
              {statusConfig.label.toUpperCase()}
            </span>
          </div>
          <p style={{ color: '#64748B', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            {scan?.target_url}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {isRunning && (
            <button
              className="btn-glow btn-glow-red"
              onClick={handleStopScan}
              style={{ fontSize: 13, padding: '8px 18px' }}
            >
              Abort Scan
            </button>
          )}
          {status === 'completed' && (
            <button
              className="btn-glow btn-glow-cyan"
              onClick={handleDownloadReport}
              style={{ fontSize: 13, padding: '8px 18px' }}
            >
              ◧ Export PDF Report
            </button>
          )}
        </div>
      </div>

      {/* Progress & Stage Telemetry */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>Current Stage:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#00E5FF', fontFamily: 'var(--font-mono)' }}>
              {isCompleted ? 'Assessment Completed' : (ws.stage || (isRunning ? 'Initializing Engine Execution' : 'Assessment Completed'))}
            </span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
            {progress}%
          </span>
        </div>
        <div className="progress-bar-track" style={{ height: 8 }}>
          <div
            className="progress-bar-fill transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </div>
      </div>

      {/* Severity Filter Counters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {(['critical', 'high', 'medium', 'low', 'info'] as Severity[]).map((sev) => {
          const cfg = SEVERITY_CONFIG[sev];
          const count = groupedVulns[sev].length;
          const isSelected = selectedSeverity === sev;

          return (
            <div
              key={sev}
              onClick={() => setSelectedSeverity(isSelected ? 'all' : sev)}
              className="glass-card"
              style={{
                padding: '14px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                border: isSelected ? `1px solid ${cfg.color}` : '1px solid rgba(148, 163, 184, 0.1)',
                borderTop: `3px solid ${cfg.color}`,
                background: isSelected ? `${cfg.color}10` : undefined,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, color: cfg.color, fontFamily: 'var(--font-mono)' }}>
                {count}
              </div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.04em', marginTop: 2 }}>
                {cfg.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analysis Grid: Terminal Logs + Grouped Findings */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1fr) minmax(380px, 1.2fr)',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Live Terminal & Log Stream */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}>
                Console Stream
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: ws.connected ? '#10B981' : '#64748B',
                  background: ws.connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: ws.connected ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(100, 116, 139, 0.2)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {ws.connected ? '● LIVE' : '○ IDLE'}
              </span>
            </div>

            {/* Auto-Scroll Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11, color: '#94A3B8' }}>
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                style={{ accentColor: '#00E5FF' }}
              />
              Auto-scroll
            </label>
          </div>

          <div
            ref={logContainerRef}
            className="log-stream"
            style={{ height: 420, overflowY: 'auto' }}
          >
            {ws.logs.length === 0 ? (
              <div style={{ color: '#64748B', textAlign: 'center', paddingTop: 60, fontSize: 12 }}>
                Waiting for engine logs...
              </div>
            ) : (
              ws.logs.map((log, i) => (
                <div key={i} className={`log-line log-${log.level}`} style={{ fontSize: 11 }}>
                  <span style={{ color: '#475569', marginRight: 8, userSelect: 'none' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Grouped Vulnerabilities Accordion / List */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>
                Vulnerability Findings ({filteredVulns.length})
              </h2>
              {selectedSeverity !== 'all' && (
                <span style={{ fontSize: 11, color: '#94A3B8' }}>
                  Filtered to {selectedSeverity.toUpperCase()}{' '}
                  <button
                    onClick={() => setSelectedSeverity('all')}
                    style={{ background: 'none', border: 'none', color: '#00E5FF', cursor: 'pointer', fontSize: 11, padding: 0 }}
                  >
                    (Clear filter)
                  </button>
                </span>
              )}
            </div>
            <span className="mono-tag" style={{ fontSize: 11 }}>
              CVSS v3.1
            </span>
          </div>

          <div style={{ maxHeight: 420, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredVulns.length === 0 ? (
              <div style={{ color: '#64748B', textAlign: 'center', paddingTop: 60, fontSize: 13 }}>
                {isRunning
                  ? 'Active findings will populate as detection engines conclude probing...'
                  : 'No vulnerabilities identified in this category.'}
              </div>
            ) : (
              filteredVulns.map((vuln: Vulnerability, i: number) => {
                const sevCfg = SEVERITY_CONFIG[vuln.severity as Severity] || SEVERITY_CONFIG.info;
                const isExpanded = expandedVuln === `${i}`;
                const param = extractParameter(vuln);
                const payload = extractPayload(vuln);
                const targetUrl = vuln.target_url || vuln.url;

                return (
                  <div
                    key={vuln.id || i}
                    style={{
                      borderRadius: 10,
                      border: isExpanded ? `1px solid ${sevCfg.color}60` : '1px solid rgba(148, 163, 184, 0.12)',
                      borderLeft: `4px solid ${sevCfg.color}`,
                      background: isExpanded ? 'rgba(8, 14, 28, 0.75)' : 'rgba(5, 8, 17, 0.45)',
                      overflow: 'hidden',
                      transition: 'all 0.25s ease-out',
                      boxShadow: isExpanded ? `0 4px 20px -2px ${sevCfg.color}15` : 'none',
                    }}
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setExpandedVuln(isExpanded ? null : `${i}`)}
                      style={{
                        padding: '14px 18px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 14,
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>
                            {vuln.title}
                          </span>
                          {param && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: '#00E5FF',
                                background: 'rgba(0, 229, 255, 0.1)',
                                border: '1px solid rgba(0, 229, 255, 0.3)',
                                padding: '1px 7px',
                                borderRadius: 4,
                                fontFamily: 'var(--font-mono)',
                              }}
                            >
                              param: {param}
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: 11,
                            color: '#64748B',
                            fontFamily: 'var(--font-mono)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span style={{ color: '#94A3B8', fontWeight: 600 }}>{vuln.source?.toUpperCase()}</span>
                          <span>·</span>
                          <span style={{ color: '#CBD5E1' }}>{targetUrl}</span>
                        </div>
                      </div>

                      {/* Right-hand badges & toggle */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span className={`badge badge-${vuln.severity}`}>{sevCfg.label}</span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: sevCfg.color,
                            fontFamily: 'var(--font-mono)',
                            background: `${sevCfg.color}12`,
                            padding: '3px 8px',
                            borderRadius: 6,
                            border: `1px solid ${sevCfg.color}30`,
                          }}
                        >
                          {formatCvssScore(vuln.cvss_score || 0)}
                        </span>
                        {vuln.cwe_id && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: '#94A3B8',
                              background: 'rgba(148, 163, 184, 0.1)',
                              padding: '3px 7px',
                              borderRadius: 6,
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {vuln.cwe_id}
                          </span>
                        )}
                        <span
                          style={{
                            color: isExpanded ? '#00E5FF' : '#64748B',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 6px',
                          }}
                        >
                          {isExpanded ? '▲ Hide' : '▼ View'}
                        </span>
                      </div>
                    </div>

                    {/* Accordion Expansion Body */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: '16px 20px',
                          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                          background: 'rgba(0, 0, 0, 0.35)',
                          fontSize: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 16,
                        }}
                      >
                        {/* 1. Vulnerable Endpoint & Affected Parameter Box */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 12,
                            padding: 12,
                            borderRadius: 8,
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(148, 163, 184, 0.12)',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>
                              Vulnerable Endpoint
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  color: '#38BDF8',
                                  fontFamily: 'var(--font-mono)',
                                  wordBreak: 'break-all',
                                }}
                              >
                                {targetUrl}
                              </span>
                              <button
                                onClick={() => copyToClipboard(targetUrl, `url-${i}`)}
                                style={{
                                  background: 'rgba(56, 189, 248, 0.1)',
                                  border: '1px solid rgba(56, 189, 248, 0.3)',
                                  color: '#38BDF8',
                                  fontSize: 10,
                                  borderRadius: 4,
                                  padding: '2px 6px',
                                  cursor: 'pointer',
                                  flexShrink: 0,
                                }}
                              >
                                {copiedField === `url-${i}` ? '✓ Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>
                              Affected Parameter / Header
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: param ? '#F59E0B' : '#94A3B8',
                                  fontFamily: 'var(--font-mono)',
                                  background: param ? 'rgba(245, 158, 11, 0.1)' : 'rgba(148, 163, 184, 0.08)',
                                  border: param ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(148, 163, 184, 0.15)',
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                }}
                              >
                                {param || 'HTTP Request Body / URI Context'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Technical Classification & Severity Breakdown */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 16,
                            padding: '10px 14px',
                            background: 'rgba(5, 8, 17, 0.5)',
                            borderRadius: 8,
                            border: '1px solid rgba(148, 163, 184, 0.08)',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 700, marginRight: 6 }}>
                              Severity:
                            </span>
                            <span style={{ fontWeight: 800, color: sevCfg.color, textTransform: 'uppercase' }}>
                              {vuln.severity} ({formatCvssScore(vuln.cvss_score || 0)})
                            </span>
                          </div>

                          {vuln.cwe_id && (
                            <div>
                              <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 700, marginRight: 6 }}>
                                CWE ID:
                              </span>
                              <a
                                href={getCweUrl(vuln.cwe_id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 700 }}
                              >
                                {vuln.cwe_id} {vuln.cwe_name ? `(${vuln.cwe_name})` : ''} ↗
                              </a>
                            </div>
                          )}

                          {vuln.cvss_vector && (
                            <div style={{ flex: 1, minWidth: 200 }}>
                              <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 700, marginRight: 6 }}>
                                CVSS Vector:
                              </span>
                              <code style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                                {vuln.cvss_vector}
                              </code>
                            </div>
                          )}
                        </div>

                        {/* 3. Detailed Vulnerability Explanation */}
                        {vuln.description && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>
                              Detailed Vulnerability Explanation
                            </div>
                            <p style={{ color: '#F1F5F9', lineHeight: 1.6, margin: 0 }}>
                              {vuln.description}
                            </p>
                          </div>
                        )}

                        {/* 4. Verification Evidence & Proof of Concept */}
                        {(vuln.evidence || vuln.request_data || payload) && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                                Non-Malicious Verification Evidence & Trigger Context
                              </span>
                              {vuln.evidence && (
                                <button
                                  onClick={() => copyToClipboard(vuln.evidence || '', `ev-${i}`)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#00E5FF',
                                    fontSize: 11,
                                    cursor: 'pointer',
                                    padding: 0,
                                  }}
                                >
                                  {copiedField === `ev-${i}` ? '✓ Copied' : 'Copy Evidence'}
                                </button>
                              )}
                            </div>
                            <div
                              style={{
                                background: '#020617',
                                border: '1px solid rgba(148, 163, 184, 0.12)',
                                color: '#10B981',
                                padding: 12,
                                borderRadius: 6,
                                fontSize: 11,
                                fontFamily: 'var(--font-mono)',
                                maxHeight: 150,
                                overflowY: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                              }}
                            >
                              {vuln.evidence || vuln.request_data}
                            </div>
                          </div>
                        )}

                        {/* 5. Recommended Developer Fix & Remediation */}
                        {vuln.remediation && (
                          <div
                            style={{
                              padding: 14,
                              borderRadius: 8,
                              background: 'rgba(16, 185, 129, 0.06)',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              borderLeft: '4px solid #10B981',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <span style={{ fontSize: 13 }}>🛡️</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>
                                Recommended Developer Remediation & Secure Coding Guidance
                              </span>
                            </div>
                            <div
                              style={{
                                color: '#CBD5E1',
                                fontSize: 11,
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'inherit',
                              }}
                            >
                              {vuln.remediation}
                            </div>
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
