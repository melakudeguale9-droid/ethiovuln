'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Scan } from '@/types/scan';
import { PageNav } from '@/components/navigation/PageNav';
import { Alert } from '@/components/ui/Alert';

interface ScanProfile {
  key: string;
  category: 'recommended' | 'quick' | 'custom';
  title: string;
  tag: string;
  badgeColor: string;
  description: string;
  engines: string[];
}

const SCAN_PROFILES: ScanProfile[] = [
  {
    key: 'full',
    category: 'recommended',
    title: 'Full Vulnerability Assessment',
    tag: 'Recommended',
    badgeColor: '#00E5FF',
    description:
      'Complete end-to-end security audit. Executes DNS recon, directory discovery, OWASP ZAP active spidering, and 8,000+ Nuclei vulnerability signatures.',
    engines: ['Nuclei', 'OWASP ZAP', 'Directory Fuzzer', 'Header Auditor'],
  },
  {
    key: 'nuclei_only',
    category: 'quick',
    title: 'Quick Recon & CVE Scan',
    tag: 'Fast & Non-Invasive',
    badgeColor: '#10B981',
    description:
      'Rapid signature-based scan using Nuclei templates. Ideal for surface recon, checking for published CVEs, and identifying critical configuration leaks without active fuzzing.',
    engines: ['Nuclei Templates', 'DNS Verification', 'Exposure Checks'],
  },
  {
    key: 'zap_only',
    category: 'custom',
    title: 'Deep Spider & Active Scan',
    tag: 'Active Testing',
    badgeColor: '#6366F1',
    description:
      'Leverages the OWASP ZAP crawler to recursively map endpoints, test session management, and inject attack vectors across all discovered query parameters.',
    engines: ['OWASP ZAP Spider', 'Active Injection Engine'],
  },
  {
    key: 'nuclei_zap',
    category: 'custom',
    title: 'Dual Engine: Nuclei + ZAP',
    tag: 'Deep Audit',
    badgeColor: '#F59E0B',
    description:
      'Combined dynamic crawler and template verification. Simultaneously probes for complex OWASP Top 10 injection flaws and zero-day template matches.',
    engines: ['Nuclei Templates', 'OWASP ZAP Active'],
  },
  {
    key: 'fuzz_only',
    category: 'custom',
    title: 'Content Discovery & Fuzzing',
    tag: 'Endpoint Recon',
    badgeColor: '#0284C7',
    description:
      'Concurrent HTTP directory brute-forcing, sensitive file detection (.env, .git, backups), and security header audit (CSP, HSTS, CORS).',
    engines: ['Smart Fuzzer', 'Header Auditor'],
  },
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
    if (!targetUrl.trim()) {
      setError('Please provide a target URL');
      return;
    }
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      setError('Target URL must start with http:// or https://');
      return;
    }
    setError('');
    setShowDisclaimer(true);
  };

  const handleAcceptAndScan = async () => {
    if (!tosAccepted) {
      setError('You must acknowledge authorization and accept the Terms of Service');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (!user?.tos_accepted_at) {
        await api.acceptTos();
        await refreshUser();
      }
      const scan = (await api.createScan(targetUrl, scanType, true)) as Scan;
      window.location.href = `/dashboard/scans/${scan.id}`;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to launch vulnerability scan');
      setShowDisclaimer(false);
    } finally {
      setLoading(false);
    }
  };

  const selectedProfile = SCAN_PROFILES.find((p) => p.key === scanType) || SCAN_PROFILES[0];

  return (
    <div>
      <PageNav backHref="/dashboard/scans" backLabel="Scans" title="Launch Assessment" />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', marginBottom: 6 }}>
          New Vulnerability Assessment
        </h1>
        <p style={{ color: '#94A3B8', fontSize: 13 }}>
          Configure target parameters and choose an assessment profile for orchestrated security testing
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 24, alignItems: 'start' }}>
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {error && <Alert type="error">{error}</Alert>}

          {/* Target Input Card */}
          <div className="glass-card" style={{ padding: 28 }}>
            <label
              htmlFor="target-input"
              style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#F8FAFC' }}
            >
              TARGET APPLICATION URL
            </label>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input
                id="target-input"
                className="input-field"
                placeholder="https://app.example.com"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  padding: '13px 16px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#64748B' }}>
              <span style={{ color: '#00E5FF' }}>ℹ</span>
              <span>Must be a valid FQDN or public IP address where you have authorized testing permissions.</span>
            </div>
          </div>

          {/* Profile Selector Cards */}
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>
                Select Assessment Profile
              </h2>
              <p style={{ color: '#94A3B8', fontSize: 13 }}>
                Choose the scanning depth appropriate for your target environment and maintenance window
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SCAN_PROFILES.map((profile) => {
                const isSelected = scanType === profile.key;
                return (
                  <div
                    key={profile.key}
                    onClick={() => setScanType(profile.key)}
                    style={{
                      padding: '18px 20px',
                      borderRadius: 12,
                      cursor: 'pointer',
                      border: isSelected
                        ? `1px solid ${profile.badgeColor}`
                        : '1px solid rgba(148, 163, 184, 0.12)',
                      background: isSelected
                        ? `${profile.badgeColor}0A`
                        : 'rgba(5, 8, 17, 0.4)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type="radio"
                          name="scanType"
                          value={profile.key}
                          checked={isSelected}
                          onChange={() => setScanType(profile.key)}
                          style={{ accentColor: profile.badgeColor, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: 15, fontWeight: 700, color: isSelected ? profile.badgeColor : '#F8FAFC' }}>
                          {profile.title}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: `${profile.badgeColor}15`,
                          color: profile.badgeColor,
                          border: `1px solid ${profile.badgeColor}30`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {profile.tag}
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, marginLeft: 24, marginBottom: 12 }}>
                      {profile.description}
                    </p>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 24 }}>
                      {profile.engines.map((eng, idx) => (
                        <span key={idx} className="mono-tag" style={{ fontSize: 10 }}>
                          {eng}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 24 }}>
              <button
                className="btn-glow btn-glow-cyan"
                onClick={handleStartScan}
                style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 700 }}
              >
                Proceed to Launch {selectedProfile.title} →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: SSRF Security Gate Notice & Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Enhanced SSRF Protection Warning Box */}
          <div
            className="glass-card"
            style={{
              padding: 24,
              border: '1px solid rgba(0, 229, 255, 0.25)',
              background: 'rgba(0, 229, 255, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(0, 229, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  color: '#00E5FF',
                }}
              >
                🛡
              </div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>
                SSRF Protection Gate
              </h2>
            </div>

            <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6, marginBottom: 16 }}>
              All targets pass through an automated pre-flight security gateway to prevent Server-Side Request Forgery and internal network probing:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11 }}>
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: 'rgba(5, 8, 17, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                }}
              >
                <strong style={{ color: '#EF4444' }}>Blocked: Private CIDRs</strong>
                <div style={{ color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
                </div>
              </div>

              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: 'rgba(5, 8, 17, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                }}
              >
                <strong style={{ color: '#EF4444' }}>Blocked: Cloud Metadata</strong>
                <div style={{ color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  169.254.169.254 (AWS, GCP, Azure)
                </div>
              </div>

              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: 'rgba(5, 8, 17, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                }}
              >
                <strong style={{ color: '#EF4444' }}>Blocked: Local Loopback</strong>
                <div style={{ color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  127.0.0.1, localhost, 0.0.0.0
                </div>
              </div>

              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <strong style={{ color: '#10B981' }}>DNS Verification</strong>
                <div style={{ color: '#94A3B8', marginTop: 2 }}>
                  Pre-scan DNS resolution checks prevent DNS rebinding attacks.
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Standards */}
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 12 }}>
              Supported Vulnerability Classes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              {[
                'SQL & NoSQL Injections',
                'Cross-Site Scripting (XSS)',
                'CORS Misconfigurations',
                'Exposed Environment Variables (.env)',
                'Missing Security Headers (HSTS, CSP)',
                'Unrestricted File Uploads',
                'Authentication & Session Weaknesses',
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94A3B8' }}>
                  <span style={{ color: '#00E5FF', fontSize: 10 }}>◆</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="modal-overlay" onClick={() => setShowDisclaimer(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 20, color: '#F59E0B' }}>⚠</span>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC' }}>
                Legal Authorization & Responsibility
              </h2>
            </div>
            <p style={{ color: '#94A3B8', fontSize: 13, marginBottom: 18 }}>
              Please verify your authorization before executing automated security assessments
            </p>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: 10,
                padding: 16,
                marginBottom: 20,
                fontSize: 12,
                color: '#94A3B8',
                lineHeight: 1.7,
              }}
            >
              <ul style={{ paddingLeft: 18 }}>
                <li style={{ marginBottom: 6 }}>
                  You certify that you are the <strong style={{ color: '#F8FAFC' }}>owner</strong> or have{' '}
                  <strong style={{ color: '#F8FAFC' }}>explicit written authorization</strong> to assess{' '}
                  <span style={{ color: '#00E5FF', fontFamily: 'var(--font-mono)' }}>{targetUrl}</span>.
                </li>
                <li style={{ marginBottom: 6 }}>
                  Scanning unauthorized web systems is <strong style={{ color: '#EF4444' }}>strictly prohibited by law</strong>.
                </li>
                <li>Active testing may generate HTTP traffic that could alert target firewalls or monitoring systems.</li>
              </ul>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 24,
                cursor: 'pointer',
                padding: '12px 14px',
                borderRadius: 10,
                border: tosAccepted
                  ? '1px solid rgba(0, 229, 255, 0.3)'
                  : '1px solid rgba(148, 163, 184, 0.12)',
                background: tosAccepted ? 'rgba(0, 229, 255, 0.05)' : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={tosAccepted}
                onChange={(e) => setTosAccepted(e.target.checked)}
                style={{ accentColor: '#00E5FF', marginTop: 3 }}
              />
              <span style={{ fontSize: 13, color: '#F8FAFC' }}>
                I confirm explicit authorization to test this target and accept the EthioVuln Terms of Service.
              </span>
            </label>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn-outline"
                onClick={() => setShowDisclaimer(false)}
                style={{ flex: 1, padding: '11px 20px', fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                className="btn-glow btn-glow-cyan"
                onClick={handleAcceptAndScan}
                disabled={!tosAccepted || loading}
                style={{ flex: 1, padding: '11px 20px', fontSize: 13, opacity: tosAccepted ? 1 : 0.5 }}
              >
                {loading ? 'Initializing Engine...' : 'Launch Assessment →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
