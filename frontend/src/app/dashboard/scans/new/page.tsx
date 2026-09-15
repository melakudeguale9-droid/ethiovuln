'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Scan } from '@/types/scan';

const SCAN_PHASES = [
  {
    key: 'full',
    icon: '🔥',
    label: 'Full Scan',
    subtitle: 'All phases — most thorough',
    desc: 'Recon + Content Discovery + Crawling + Vuln Scan + Fuzzing',
    color: '#00ff88',
    badge: 'RECOMMENDED',
  },
  {
    key: 'nuclei_only',
    icon: '🔎',
    label: 'Phase 4: Nuclei CVE Scan',
    subtitle: 'Known CVEs & misconfigs',
    desc: 'Template-based scanning using Nuclei — detects known vulnerabilities',
    color: '#0088ff',
    badge: 'FAST',
  },
  {
    key: 'fuzz_only',
    icon: '🌐',
    label: 'Phase 2+5: Discovery & Fuzzing',
    subtitle: 'Directories, headers, XSS, SQLi, CORS',
    desc: 'Content discovery + parameter fuzzing + security header checks',
    color: '#8b5cf6',
    badge: 'THOROUGH',
  },
  {
    key: 'zap_only',
    icon: '🧠',
    label: 'Phase 3: ZAP Spider + Active Scan',
    subtitle: 'Deep crawling & active testing',
    desc: 'OWASP ZAP spider crawls all pages then runs active vulnerability tests',
    color: '#FFB020',
    badge: 'DEEP',
  },
  {
    key: 'nuclei_zap',
    icon: '💥',
    label: 'Phase 3+4: ZAP + Nuclei',
    subtitle: 'Combined active + template scan',
    desc: 'ZAP active scan combined with Nuclei template detection',
    color: '#ff4444',
    badge: 'ADVANCED',
  },
];

const QUICK_TESTS = [
  { label: '💉 SQL Injection', scanType: 'fuzz_only', category: 'Injection' },
  { label: '🌐 XSS Testing', scanType: 'fuzz_only', category: 'XSS' },
  { label: '🔐 Session Issues', scanType: 'fuzz_only', category: 'Auth' },
  { label: '🧱 Server-Side Vulns', scanType: 'nuclei_only', category: 'Server' },
  { label: '🔌 API Vulnerabilities', scanType: 'nuclei_zap', category: 'API' },
  { label: '🔑 Access Control', scanType: 'fuzz_only', category: 'Access' },
  { label: '📂 File Exposure', scanType: 'fuzz_only', category: 'File' },
  { label: '🧠 Business Logic', scanType: 'full', category: 'Logic' },
  { label: '⚙️ Misconfiguration', scanType: 'nuclei_only', category: 'Config' },
  { label: '🚀 Full Pentest', scanType: 'full', category: 'Full' },
];

const PHASE_INFO = [
  { icon: '🔍', phase: 'PHASE 1', name: 'Recon', tools: 'Nuclei, Headers, DNS', color: '#00ff88' },
  { icon: '🌐', phase: 'PHASE 2', name: 'Content Discovery', tools: 'Dir fuzzing, 153+ paths', color: '#0088ff' },
  { icon: '🧠', phase: 'PHASE 3', name: 'Crawling', tools: 'OWASP ZAP Spider', color: '#8b5cf6' },
  { icon: '🔎', phase: 'PHASE 4', name: 'Vuln Scanning', tools: 'Nuclei CVEs, SQLi, XSS', color: '#FFB020' },
  { icon: '💥', phase: 'PHASE 5', name: 'Fuzzing', tools: 'Params, Headers, CORS', color: '#ff4444' },
  { icon: '🧾', phase: 'PHASE 6', name: 'Reporting', tools: 'PDF + JSON report', color: '#00d4ff' },
];

export default function NewScanPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [targetUrl, setTargetUrl] = useState('');
  const [scanType, setScanType] = useState('full');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartScan = () => {
    if (!targetUrl.trim()) { setError('Please enter a target URL'); return; }
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      setError('URL must start with http:// or https://'); return;
    }
    setError('');
    setShowDisclaimer(true);
  };

  const handleAcceptAndScan = async () => {
    if (!tosAccepted) { setError('You must accept the Terms of Service'); return; }
    setLoading(true);
    setError('');
    try {
      if (!user?.tos_accepted_at) { await api.acceptTos(); await refreshUser(); }
      const scan = await api.createScan(targetUrl, scanType, true) as Scan;
      // Force hard navigation to new scan page
      window.location.href = `/dashboard/scans/${scan.id}`;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start scan');
      setShowDisclaimer(false);
    } finally {
      setLoading(false);
    }
  };

  const selectedPhase = SCAN_PHASES.find(p => p.key === scanType);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
          <span className="text-gradient">🔍 New Vulnerability Scan</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Configure and launch a multi-phase security assessment</p>
      </div>

      {/* Phase Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 28 }}>
        {PHASE_INFO.map((p, i) => (
          <div key={i} style={{
            padding: '12px 8px', borderRadius: 10, textAlign: 'center',
            background: 'rgba(0,0,0,0.3)', border: `1px solid ${p.color}30`,
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{p.icon}</div>
            <div style={{ fontSize: 9, color: p.color, fontWeight: 700, letterSpacing: '0.05em' }}>{p.phase}</div>
            <div style={{ fontSize: 11, color: '#f1f5f9', fontWeight: 600, marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 9, color: '#64748b' }}>{p.tools}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Left — Main Form */}
        <div className="glass-card" style={{ padding: 28 }}>
          {error && (
            <div style={{
              background: 'rgba(255,0,64,0.1)', border: '1px solid rgba(255,0,64,0.3)',
              borderRadius: 10, padding: '10px 16px', marginBottom: 20, color: '#ff4444', fontSize: 14,
            }}>{error}</div>
          )}

          {/* URL Input */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#94a3b8' }}>
              TARGET URL
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 16, color: '#64748b',
              }}>🌐</span>
              <input
                className="input-field"
                placeholder="https://example.com"
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                style={{ paddingLeft: 40, fontFamily: 'monospace', fontSize: 14 }}
              />
            </div>

            {/* Quick Tests */}
            <div style={{ marginTop: 10 }}>
              <span style={{ fontSize: 11, color: '#64748b', marginRight: 8 }}>⚡ Quick test:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {QUICK_TESTS.map((qt, i) => {
                  const isActive = scanType === qt.scanType && targetUrl === '';
                  return (
                    <button key={i} onClick={() => setScanType(qt.scanType)} style={{
                      padding: '5px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                      background: scanType === qt.scanType ? 'rgba(0,255,136,0.15)' : 'rgba(0,136,255,0.1)',
                      border: scanType === qt.scanType ? '1px solid rgba(0,255,136,0.5)' : '1px solid rgba(0,136,255,0.3)',
                      color: scanType === qt.scanType ? '#00ff88' : '#0088ff', fontWeight: 600,
                      transition: 'all 0.2s',
                    }}>{qt.label}</button>
                  );
                })}
              </div>
              <p style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>
                ⚡ Click a category to select the best scan type for that vulnerability class
              </p>
            </div>
          </div>

          {/* Scan Type */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#94a3b8' }}>
              SCAN TYPE
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SCAN_PHASES.map(phase => (
                <label key={phase.key} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                  border: scanType === phase.key ? `1px solid ${phase.color}50` : '1px solid rgba(148,163,184,0.1)',
                  background: scanType === phase.key ? `${phase.color}08` : 'transparent',
                }}>
                  <input type="radio" name="scanType" value={phase.key}
                    checked={scanType === phase.key} onChange={e => setScanType(e.target.value)}
                    style={{ accentColor: phase.color }} />
                  <span style={{ fontSize: 20 }}>{phase.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: scanType === phase.key ? phase.color : '#f1f5f9' }}>
                        {phase.label}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: `${phase.color}20`, color: phase.color, letterSpacing: '0.05em',
                      }}>{phase.badge}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{phase.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button className="btn-glow btn-glow-green" onClick={handleStartScan}
            style={{ width: '100%', fontSize: 15, padding: '14px 24px' }}>
            🔍 Start {selectedPhase?.label || 'Scan'}
          </button>
        </div>

        {/* Right — Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Selected scan info */}
          {selectedPhase && (
            <div style={{
              padding: 20, borderRadius: 14,
              background: `${selectedPhase.color}08`,
              border: `1px solid ${selectedPhase.color}30`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{selectedPhase.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: selectedPhase.color, marginBottom: 4 }}>
                {selectedPhase.label}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>{selectedPhase.subtitle}</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{selectedPhase.desc}</div>
            </div>
          )}

          {/* What gets detected */}
          <div style={{ padding: 20, borderRadius: 14, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(148,163,184,0.1)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>🎯 Detects</div>
            {[
              { icon: '🟥', label: 'SQL Injection', sev: 'Critical' },
              { icon: '🟧', label: 'XSS (Reflected/Stored)', sev: 'High' },
              { icon: '🟨', label: 'CORS Misconfiguration', sev: 'High' },
              { icon: '🟩', label: 'Exposed .env / secrets', sev: 'High' },
              { icon: '🟦', label: 'Missing Security Headers', sev: 'Medium' },
              { icon: '🟪', label: 'Open Directories', sev: 'Medium' },
              { icon: '⬛', label: 'Known CVEs (Nuclei)', sev: 'Various' },
              { icon: '⚪', label: 'Admin Panel Exposure', sev: 'Medium' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.icon} {item.label}</span>
                <span style={{ fontSize: 10, color: '#64748b' }}>{item.sev}</span>
              </div>
            ))}
          </div>

          {/* Output formats */}
          <div style={{ padding: 20, borderRadius: 14, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(148,163,184,0.1)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>🧾 Output</div>
            {[
              { icon: '📄', label: 'PDF Report', desc: 'Executive summary' },
              { icon: '📊', label: 'Live Dashboard', desc: 'Real-time findings' },
              { icon: '🔔', label: 'Severity Scores', desc: 'CVSS + CWE mapped' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="modal-overlay" onClick={() => setShowDisclaimer(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#f1f5f9' }}>
              ⚠ Security Disclaimer & Terms of Service
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>Please read and accept before proceeding</p>
            <div style={{
              background: 'rgba(255,176,32,0.08)', border: '1px solid rgba(255,176,32,0.2)',
              borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13, color: '#94a3b8',
              lineHeight: 1.7, maxHeight: 260, overflowY: 'auto',
            }}>
              <p style={{ fontWeight: 600, color: '#FFB020', marginBottom: 8 }}>IMPORTANT LEGAL NOTICE</p>
              <ul style={{ paddingLeft: 20 }}>
                <li style={{ marginBottom: 6 }}>You are the <strong style={{ color: '#f1f5f9' }}>authorized owner</strong> or have <strong style={{ color: '#f1f5f9' }}>explicit written permission</strong> to test this target.</li>
                <li style={{ marginBottom: 6 }}>Unauthorized scanning is <strong style={{ color: '#ff4444' }}>illegal</strong> and may result in criminal prosecution.</li>
                <li style={{ marginBottom: 6 }}>This tool performs <strong style={{ color: '#f1f5f9' }}>active security testing</strong> which may disrupt target services.</li>
                <li style={{ marginBottom: 6 }}>You accept <strong style={{ color: '#f1f5f9' }}>full responsibility</strong> for any consequences.</li>
                <li>Results should be verified by a qualified security professional.</li>
              </ul>
            </div>
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24,
              cursor: 'pointer', padding: '12px 16px', borderRadius: 12,
              border: tosAccepted ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(148,163,184,0.1)',
              background: tosAccepted ? 'rgba(0,255,136,0.05)' : 'transparent',
            }}>
              <input type="checkbox" checked={tosAccepted} onChange={e => setTosAccepted(e.target.checked)}
                style={{ accentColor: '#00ff88', marginTop: 2 }} />
              <span style={{ fontSize: 13, color: '#f1f5f9' }}>
                I confirm authorization to scan <strong style={{ color: '#00ff88' }}>{targetUrl}</strong> and accept the Terms of Service.
              </span>
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-outline" onClick={() => setShowDisclaimer(false)}
                style={{ flex: 1, padding: '12px 24px' }}>Cancel</button>
              <button className="btn-glow btn-glow-green" onClick={handleAcceptAndScan}
                disabled={!tosAccepted || loading}
                style={{ flex: 1, padding: '12px 24px', opacity: tosAccepted ? 1 : 0.5 }}>
                {loading ? 'Launching...' : `🔍 Launch ${selectedPhase?.label}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
