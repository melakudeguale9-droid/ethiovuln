'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ArchitectureStep {
  step: string;
  name: string;
  role: string;
  tech: string;
  details: string;
  specs: string[];
}

const ARCHITECTURE_PIPELINE: ArchitectureStep[] = [
  {
    step: '01',
    name: 'Next.js Client',
    role: 'Frontend Presentation & Telemetry',
    tech: 'Next.js 15+ App Router · TypeScript · Tailwind CSS',
    details:
      'Responsive cyber-dark interface managing multi-mode scan wizards, granular module configuration, live WebSocket console streams, and SVG donut risk visualizations.',
    specs: ['Real-time WebSocket Terminal', 'Granular 8-Tier Mode Selector', 'Interactive CVSS Analytics'],
  },
  {
    step: '02',
    name: 'FastAPI Backend',
    role: 'High-Throughput API Gateway',
    tech: 'Python 3.12+ · FastAPI · Async SQLAlchemy · Pydantic',
    details:
      'Asynchronous REST API providing strict endpoint validation, JWT token lifecycle management, rate limiting, and target ingress sanitization.',
    specs: ['Async Non-blocking Handlers', 'SlowAPI Adaptive Rate Limiting', 'Bearer JWT Auth & Role Access'],
  },
  {
    step: '03',
    name: 'Celery / Redis Workers',
    role: 'Distributed Task Queue & State',
    tech: 'Celery 5.4 · Redis 7 In-Memory Broker',
    details:
      'Decoupled task execution pipeline dispatching long-running vulnerability assessments, managing timeouts, and broadcasting real-time progress events.',
    specs: ['Fault-tolerant Job Queues', 'Real-time WebSocket Push', 'Concurrent Scan Isolation'],
  },
  {
    step: '04',
    name: 'ZAP & Nuclei Scanners',
    role: 'Offensive Detection Engines',
    tech: 'Nuclei v3 Engine · OWASP ZAP 2.14 Daemon · Smart Fuzzer',
    details:
      'Dual-core dynamic inspection combining template signature matching against 8,000+ CVE definitions with active crawler spidering and payload injection.',
    specs: ['8,000+ YAML CVE Signatures', 'Active Spider & Parameter Injection', 'Automated Directory & .env Fuzzing'],
  },
  {
    step: '05',
    name: 'PostgreSQL Database',
    role: 'Relational Findings & State Store',
    tech: 'PostgreSQL 16 · Asyncpg Driver · Alembic Migrations',
    details:
      'Persistent data layer storing normalized vulnerability findings, CVSS v3.1 vector calculations, user preferences, and cryptographic report timestamps.',
    specs: ['Normalized Vulnerability Schema', 'CVSS v3.1 Vector Matrix', 'Historical Trend Analytics'],
  },
];

const SECURITY_PILLARS = [
  {
    title: 'Automated DAST (Dynamic Testing)',
    tag: 'Black-Box Analysis',
    desc: 'Analyzes running web applications from an external perspective without requiring source code access. Discovers runtime authorization bypasses, misconfigurations, and injection vulnerabilities in real-world scenarios.',
    icon: '⚡',
  },
  {
    title: 'SSRF Security Gates',
    tag: 'Pre-Flight Protection',
    desc: 'Strict multi-tier target validation prevents weaponization of scanner nodes. Automatically resolves DNS and strictly bars private RFC 1918 subnets, cloud metadata APIs (169.254.169.254), and localhost loopbacks.',
    icon: '🛡️',
  },
  {
    title: 'CVSS v3.1 & CWE Standardization',
    tag: 'Risk Governance',
    desc: 'All findings undergo automated deduplication, normalization, and scoring against the CVSS v3.1 qualitative rating system, directly correlated with authoritative MITRE CWE definitions.',
    icon: '📊',
  },
  {
    title: 'Executive PDF Compliance Reports',
    tag: 'Audit Ready',
    desc: 'Generates board-level and engineering-focused PDF deliverables containing risk posture breakdowns, exact trigger parameters, and step-by-step developer remediation guidance.',
    icon: '📑',
  },
];

export default function AboutPage() {
  const [selectedArchStep, setSelectedArchStep] = useState<number>(0);
  const activeStep = ARCHITECTURE_PIPELINE[selectedArchStep];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* ─── Sticky Cyber Navigation ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050811]/85 border-b border-slate-800/80 px-6 lg:px-12 py-4 flex items-center justify-between transition-all duration-300">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-extrabold text-lg shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-300">
            🛡️
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors duration-300">
              Ethio<span className="text-cyan-400">Vuln</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Architecture
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/dashboard/scans/new"
            className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
          >
            Scan Dashboard
          </Link>
          <Link
            href="/about"
            className="text-cyan-400 font-semibold transition-all duration-300"
          >
            About
          </Link>
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* ─── Hero & Mission Section ───────────────────────────────────────── */}
      <section className="pt-20 pb-16 px-6 lg:px-12 max-w-6xl mx-auto text-center">
        <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.15)]">
          Platform Architecture & Mission
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-6 mb-6 tracking-tight">
          Next-Generation{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Automated DAST
          </span>{' '}
          Platform
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-12">
          EthioVuln bridges the gap between manual penetration testing and continuous security integration by unifying open-source security standards into an orchestrated, non-destructive web assessment pipeline.
        </p>

        {/* Mission Card */}
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-left max-w-4xl mx-auto transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-3 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
            Core Mission Statement
          </div>
          <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic border-l-2 border-cyan-500/60 pl-4 py-1">
            "To democratize proactive cybersecurity intelligence by delivering automated, transparent, and non-destructive vulnerability assessments that protect vital digital infrastructures before threat actors exploit them."
          </p>
        </div>
      </section>

      {/* ─── System Architecture Pipeline Breakdown ───────────────────────── */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            Pipeline Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            System Architecture & Data Flow
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            From client-side target submission to distributed engine scanning and report persistence.
          </p>
        </div>

        {/* Pipeline Steps Indicator (Next.js -> FastAPI -> Celery -> Scanners -> PostgreSQL) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {ARCHITECTURE_PIPELINE.map((stage, idx) => {
            const isSelected = selectedArchStep === idx;
            return (
              <button
                key={stage.step}
                onClick={() => setSelectedArchStep(idx)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] -translate-y-1'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="text-[11px] font-mono font-bold text-cyan-400 mb-1">
                  STAGE {stage.step}
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {stage.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Stage Deep Dive Card */}
        <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(0,240,255,0.18)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                PIPELINE STAGE {activeStep.step}
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                {activeStep.name}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-1">
                {activeStep.role}
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              {activeStep.tech}
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            {activeStep.details}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {activeStep.specs.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF]" />
                <span className="text-xs font-semibold text-slate-200">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Security Pillars & SSRF Gate Section ─────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Engineering Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Security Pillars & Validation Gates
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Ensuring responsible testing, ethical governance, and resilient execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECURITY_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{pillar.icon}</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {pillar.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Authorized Security Research Credentials ─────────────────────── */}
      <section className="py-16 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-900/80 border border-slate-800 transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-3xl font-extrabold text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.35)] shrink-0">
              MD
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Security Researcher</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">Melaku Deguale</h3>
              <p className="text-xs sm:text-sm font-semibold text-cyan-400 mb-3">
                Ethical Hacker & Offensive Security Engineer
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                Specializing in vulnerability research, dynamic application security testing (DAST), automated threat detection pipelines, and OWASP Top 10 mitigation. Lead architect of the EthioVuln automated scanning platform.
              </p>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <a
                  href="https://t.me/melakucyber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-400 transition-all duration-300 flex items-center gap-2"
                >
                  <span>Telegram</span> ↗
                </a>
                <a
                  href="https://github.com/melakudeguale9-droid/ethiovuln"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-400 transition-all duration-300 flex items-center gap-2"
                >
                  <span>GitHub Repository</span> ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/melaku-deguale-7803ba416/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-400 transition-all duration-300 flex items-center gap-2"
                >
                  <span>LinkedIn Profile</span> ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 py-10 px-6 lg:px-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">EthioVuln</span>
            <span>·</span>
            <span>Automated Dynamic Application Security Testing</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <Link href="/dashboard/scans/new" className="hover:text-cyan-400 transition-colors">
              New Scan
            </Link>
            <Link href="/login" className="hover:text-cyan-400 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
