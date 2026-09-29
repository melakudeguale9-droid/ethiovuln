'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { SOCIAL_LINKS, APP_NAME, APP_TAGLINE } from '@/lib/constants';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'nuclei' | 'zap' | 'fuzzer'>('nuclei');

  useEffect(() => {
    setMounted(true);
  }, []);

  const pipelineEngines = {
    nuclei: {
      name: 'Nuclei Template Engine',
      tag: 'Template-Driven DAST',
      color: '#00E5FF',
      specs: [
        { label: 'Template Library', val: '8,000+ Verified YAML Rules' },
        { label: 'Detection Scope', val: 'CVEs, Misconfigs, Exposures' },
        { label: 'Execution Speed', val: 'Multi-target Async I/O' },
        { label: 'False Positive Ratio', val: '< 0.5% with strict matching' },
      ],
      description:
        'Fast and customizable vulnerability scanner based on simple YAML DSL. Automatically executes thousands of community-curated vulnerability templates against target endpoints.',
    },
    zap: {
      name: 'OWASP ZAP Engine',
      tag: 'Dynamic Active Scanner',
      color: '#6366F1',
      specs: [
        { label: 'Spidering Mode', val: 'Traditional + AJAX Crawler' },
        { label: 'Active Attacks', val: 'SQLi, XSS, Path Traversal' },
        { label: 'Standards Support', val: 'OWASP Top 10 / WASC Threat' },
        { label: 'Session Handling', val: 'Automated Token Extraction' },
      ],
      description:
        'The gold standard in web application penetration testing. Deeply spiders URLs and systematically injects attack payloads to uncover severe application logic vulnerabilities.',
    },
    fuzzer: {
      name: 'Smart Discovery Fuzzer',
      tag: 'Recon & Content Discovery',
      color: '#10B981',
      specs: [
        { label: 'Wordlist Precision', val: 'High-probability sensitive paths' },
        { label: 'Header Audits', val: 'HSTS, CSP, CORS, Permissions' },
        { label: 'Sensitive Exposures', val: '.env, .git, backups, admin panels' },
        { label: 'Rate Adaptation', val: 'Automatic backoff on throttling' },
      ],
      description:
        'Proprietary concurrent HTTP probing engine designed to identify hidden subdirectories, unindexed configuration files, and critical security header omissions.',
    },
  };

  const workflowSteps = [
    {
      step: '01',
      title: 'Target Input & SSRF Gate',
      desc: 'Strict multi-tier URL validation. Automatically resolves DNS and blocks private CIDR blocks (RFC 1918), AWS metadata endpoints (169.254.169.254), and local loopbacks.',
      badge: 'Security Gate',
      color: '#00E5FF',
    },
    {
      step: '02',
      title: 'Multi-Engine Discovery',
      desc: 'Orchestrated execution of Nuclei template matching, OWASP ZAP spidering, and intelligent endpoint fuzzing running concurrently via background queues.',
      badge: 'Active Scan',
      color: '#6366F1',
    },
    {
      step: '03',
      title: 'CVSS v3.1 & CWE Scoring',
      desc: 'Raw findings are normalized, deduplicated, and scored using CVSS v3.1 vector calculations with direct mappings to MITRE CWE definitions.',
      badge: 'Analysis',
      color: '#F59E0B',
    },
    {
      step: '04',
      title: 'Executive PDF Export',
      desc: 'Generate executive summary reports with severity breakdown charts, technical reproduction steps, and actionable remediation guidelines.',
      badge: 'Reporting',
      color: '#10B981',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <Navbar />

      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          paddingTop: 120,
          paddingBottom: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div style={{ maxWidth: 940, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Honest Platform Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 16px',
              borderRadius: 9999,
              border: '1px solid rgba(0, 229, 255, 0.25)',
              background: 'rgba(0, 229, 255, 0.04)',
              marginBottom: 28,
              fontSize: 12,
              fontWeight: 600,
              color: '#00E5FF',
              letterSpacing: '0.04em',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 10px #10B981',
              }}
            />
            <span>Application Core Active</span>
            <span style={{ color: 'rgba(148, 163, 184, 0.4)' }}>|</span>
            <span style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              Worker Queues via Redis
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 68px)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: '-0.03em',
            }}
          >
            <span className="text-gradient">Automated Dynamic</span>
            <br />
            <span style={{ color: '#F8FAFC' }}>Application Security Testing</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: '#94A3B8',
              maxWidth: 700,
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            Orchestrate <strong style={{ color: '#F8FAFC' }}>Nuclei</strong> vulnerability templates,{' '}
            <strong style={{ color: '#F8FAFC' }}>OWASP ZAP</strong> active spidering, and custom web fuzzing from an
            enterprise-grade security dashboard with real-time telemetry.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 48,
            }}
          >
            <Link
              href="/register"
              className="btn-glow btn-glow-cyan"
              style={{ padding: '14px 34px', fontSize: 15, fontWeight: 700 }}
            >
              Start Security Assessment →
            </Link>
            <Link
              href="/about"
              className="btn-outline"
              style={{ padding: '14px 28px', fontSize: 15 }}
            >
              Platform Architecture & Bio
            </Link>
          </div>

          {/* Security Telemetry Metric Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
              maxWidth: 820,
              margin: '0 auto',
            }}
          >
            {[
              { label: 'Vulnerability Engine', value: 'Nuclei v3 + ZAP 2.14', tag: 'Dual Core' },
              { label: 'Template Signatures', value: '8,000+ Community Definitions', tag: 'Continuous' },
              { label: 'Assessment Standards', value: 'CVSS v3.1 & OWASP Top 10', tag: 'Standardized' },
            ].map((card, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: '14px 18px',
                  textAlign: 'left',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {card.label}
                  </span>
                  <span className="mono-tag" style={{ fontSize: 10, color: '#00E5FF' }}>{card.tag}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Engine Telemetry Showcase ─────────────────────────────── */}
      <section
        style={{
          padding: '80px 24px',
          maxWidth: 1140,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 700,
              color: '#00E5FF',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}
          >
            Architecture Pipeline
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#F8FAFC', marginBottom: 12 }}>
            Multi-Engine Scanning Pipeline
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 16, maxWidth: 580, margin: '0 auto' }}>
            Combines signature scanning, crawler-based attack injection, and directory brute forcing into a single coordinated stream.
          </p>
        </div>

        {/* Engine Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          {(['nuclei', 'zap', 'fuzzer'] as const).map((key) => {
            const isSelected = activeTab === key;
            const engine = pipelineEngines[key];
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '10px 22px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected
                    ? `1px solid ${engine.color}`
                    : '1px solid rgba(148, 163, 184, 0.12)',
                  background: isSelected ? `${engine.color}15` : 'rgba(13, 21, 39, 0.4)',
                  color: isSelected ? engine.color : '#94A3B8',
                  transition: 'all 0.2s',
                }}
              >
                {engine.name}
              </button>
            );
          })}
        </div>

        {/* Selected Engine Display Card */}
        {(() => {
          const current = pipelineEngines[activeTab];
          return (
            <div
              className="glass-card"
              style={{
                padding: '36px 32px',
                border: `1px solid ${current.color}35`,
                boxShadow: `0 8px 30px ${current.color}10`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: current.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {current.tag}
                  </span>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', marginTop: 4 }}>
                    {current.name}
                  </h3>
                </div>
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: '#94A3B8',
                  }}
                >
                  ENGINE STATUS: <span style={{ color: '#10B981', fontWeight: 700 }}>AVAILABLE</span>
                </div>
              </div>

              <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 820 }}>
                {current.description}
              </p>

              {/* Specs Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 14,
                }}
              >
                {current.specs.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 10,
                      background: 'rgba(5, 8, 17, 0.5)',
                      border: '1px solid rgba(148, 163, 184, 0.08)',
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ─── Workflow Steps Section ───────────────────────────────── */}
      <section
        style={{
          padding: '80px 24px',
          maxWidth: 1140,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#00E5FF',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}
          >
            End-To-End Execution
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#F8FAFC', marginBottom: 12 }}>
            Four-Phase Assessment Flow
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
            Structured pipeline ensuring safe ingestion, deep inspection, standardized severity scoring, and executive reporting.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {workflowSteps.map((wf, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: '28px 24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      fontWeight: 800,
                      color: wf.color,
                    }}
                  >
                    {wf.step}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: `${wf.color}15`,
                      color: wf.color,
                      border: `1px solid ${wf.color}30`,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {wf.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', marginBottom: 10 }}>
                  {wf.title}
                </h3>
                <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>
                  {wf.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Call to Action Panel ─────────────────────────────────── */}
      <section
        style={{
          padding: '60px 24px 100px',
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: '56px 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#F8FAFC', marginBottom: 14 }}>
            Empower Your Security Posture
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 16, maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Deploy comprehensive, multi-engine vulnerability assessments on authorized targets in seconds.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              className="btn-glow btn-glow-cyan"
              style={{ padding: '14px 36px', fontSize: 15, fontWeight: 700 }}
            >
              Create Free Account →
            </Link>
            <Link
              href="/login"
              className="btn-outline"
              style={{ padding: '14px 28px', fontSize: 15 }}
            >
              Sign In to Console
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Polished Footer with Socials ──────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          background: 'rgba(7, 11, 20, 0.95)',
          padding: '48px 48px 32px',
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 40,
            marginBottom: 36,
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #00E5FF, #6366F1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#070B14',
                  fontSize: 14,
                }}
              >
                E
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#F8FAFC' }}>
                Ethio<span style={{ color: '#00E5FF' }}>Vuln</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, marginBottom: 16 }}>
              {APP_TAGLINE}. Enterprise-grade dynamic vulnerability testing engineered for security professionals and development teams.
            </p>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              Built by <strong style={{ color: '#F8FAFC' }}>Melaku Deguale</strong>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                Platform
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/dashboard/scans/new" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 13 }}>
                  Launch Scan
                </Link>
                <Link href="/dashboard/reports" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 13 }}>
                  Vulnerability Reports
                </Link>
                <Link href="/about" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 13 }}>
                  Architecture & Docs
                </Link>
              </div>
            </div>

            {/* Social & Contact */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                Connect
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a
                  href={SOCIAL_LINKS.github.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 13 }}
                >
                  GitHub Repository
                </a>
                <a
                  href={SOCIAL_LINKS.telegram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 13 }}
                >
                  Telegram Channel
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 13 }}
                >
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            borderTop: '1px solid rgba(148, 163, 184, 0.08)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 12, color: '#64748B' }}>
            © 2026 EthioVuln. Built for authorized security testing and defensive research.
          </div>
          <div style={{ fontSize: 12, color: '#00E5FF', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            v1.0.0 · Core Active
          </div>
        </div>
      </footer>
    </div>
  );
}
