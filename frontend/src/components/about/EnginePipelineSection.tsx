'use client';

import React, { useState } from 'react';

interface EngineDetails {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  badgeClass: string;
  description: string;
  capabilities: string[];
}

const ENGINES: EngineDetails[] = [
  {
    id: 'nuclei',
    name: 'Nuclei Template Engine',
    tagline: 'YAML-Based Vulnerability Signatures',
    badge: 'High-Speed Template DAST',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    description:
      'Nuclei drives fast and targeted vulnerability scanning through community-curated, verified YAML DSL templates. Powered by an asynchronous Go I/O core, Nuclei scans targets with massive parallel efficiency while maintaining a strictly validated false-positive rate of under 0.5%. It maps incoming responses against known CVE signatures, exposed admin consoles, token leaks, and zero-day disclosures across HTTP, DNS, and TLS protocols.',
    capabilities: [
      '8,000+ community & enterprise verified YAML rule definitions',
      'Protocol-level DSL matching across HTTP, DNS, SSL/TLS, and WebSockets',
      'High-concurrency async Go engine with granular rate-throttling controls',
      'Zero-footprint signature testing preventing database pollution and denial of service',
    ],
  },
  {
    id: 'zap',
    name: 'OWASP ZAP Active Spidering & Fuzzing Core',
    tagline: 'Automated AJAX Crawling & Dynamic Injection Probing',
    badge: 'Dynamic Active DAST',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    description:
      'The industry standard for active web application security testing. OWASP ZAP functions as a dual-phase assessment core: it dynamically crawls modern JavaScript/AJAX single-page applications and legacy web architectures, automatically discovers input vectors, handles CSRF tokens, and injects active security test payloads targeting SQL Injection, Cross-Site Scripting (Reflected, Stored, and DOM-based), Path Traversal, and SSRF flaws.',
    capabilities: [
      'Dual-mode spidering combining traditional HTML parsers and headless AJAX crawlers',
      'Automated session authentication, cookie preservation, and anti-CSRF token extraction',
      'Dynamic payload injection suites compliant with the OWASP Top 10 threat matrix',
      'Deep parameter fuzzing across forms, URL queries, and nested JSON request bodies',
    ],
  },
  {
    id: 'fuzzer',
    name: 'Smart Discovery & Custom Payload Engine',
    tagline: 'Heuristic Directory Fuzzing & Secret Exposure Detection',
    badge: 'Heuristic Reconnaissance',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    description:
      'Developed natively within the EthioVuln platform, this custom high-concurrency discovery module audits server perimeters for sensitive leaked artifacts that conventional crawlers miss. It systematically scans for exposed .env files, .git repository objects, forgotten backup archives (.zip, .sql, .bak), server diagnostic tools (phpinfo.php, Spring Actuator endpoints), and unversioned staging routes.',
    capabilities: [
      'Curated dictionary of 10,000+ sensitive paths, backup extensions, and hidden APIs',
      'Intelligent wildcard 404 detection and dynamic soft-404 filtering algorithms',
      'High-speed asynchronous Python (Asyncio & AIOHTTP) execution pipeline',
      'Regex-based secret extraction for AWS access keys, JWTs, and database credentials',
    ],
  },
];

const TECHNICAL_SPECS = [
  {
    code: 'GATE-01',
    title: 'Pre-Flight Anti-SSRF Validation Gateway',
    tag: 'Zero-Trust Safety Barrier',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description:
      'Before any engine fires a single network packet, the target URL is routed through a mandatory multi-tier validation gateway. The system resolves domain DNS in real-time, verifying dual-stack IPv4/IPv6 addresses against strict IP blocking policies. The gateway categorically bars private RFC 1918 subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), cloud metadata APIs (169.254.169.254), and local loopback interfaces (127.0.0.1, ::1), thoroughly neutralizing server-side request forgery risks.',
    features: [
      'DNS Rebinding Protection via Real-Time Resolution',
      'RFC 1918 & Cloud Metadata (169.254.169.254) Blacklist',
      'Dual-Stack IPv4 / IPv6 Strict Boundary Enforcement',
    ],
  },
  {
    code: 'NORM-02',
    title: 'CVSS v3.1 Scoring & Taxonomy Normalization',
    tag: 'Quantitative Risk Governance',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description:
      'Heterogeneous outputs from Nuclei, OWASP ZAP, and custom fuzzers are ingested into an automated normalization pipeline. Findings are deduplicated, enriched with quantitative CVSS v3.1 vector calculations (Attack Vector, Attack Complexity, Privileges Required, User Interaction, Scope, Confidentiality, Integrity, Availability), and cross-referenced with authoritative MITRE CWE definitions to produce clear, audit-ready risk scoring.',
    features: [
      'Base, Temporal & Environmental CVSS v3.1 Calculations',
      'Direct Mapping to MITRE CWE & OWASP Top 10 Standards',
      'Automated Cross-Engine Finding Deduplication & Proof Storage',
    ],
  },
  {
    code: 'REPT-03',
    title: 'Executive & Developer PDF Reporting Engine',
    tag: 'Audit-Ready Deliverables',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    description:
      'EthioVuln compiles comprehensive, publication-quality executive and technical audit reports using ReportLab. Reports feature executive risk posture summaries, severity distribution donut charts, complete vulnerability descriptions, reproducible HTTP request/response evidence, and prioritized step-by-step developer remediation guidance with cryptographic scan completion timestamps.',
    features: [
      'Executive Summary Cards for C-Suite & Board Stakeholders',
      'Actionable Remediation Blueprints with Code-Level Guidance',
      'Cryptographic SHA-256 Timestamping & Audit Verification',
    ],
  },
];

export function EnginePipelineSection() {
  const [activeEngineId, setActiveEngineId] = useState<string>('nuclei');
  const activeEngine = ENGINES.find((e) => e.id === activeEngineId) || ENGINES[0];

  return (
    <section id="architecture" className="py-20 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full border-t border-slate-800/80 font-sans">
      {/* Section Header */}
      <div className="text-center w-full max-w-full mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-base font-medium tracking-wide mb-6">
          <span>DISTRIBUTED SCANNING CORE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-normal leading-relaxed mb-6">
          Architecture &amp; Engine Pipeline
        </h2>
        <p className="text-gray-150 text-lg sm:text-xl font-normal leading-loose tracking-normal">
          How EthioVuln coordinates YAML signature matching, dynamic crawler spidering, and
          heuristic fuzzing into an asynchronous distributed worker pipeline.
        </p>
      </div>

      {/* Tri-Engine Tab Selector */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mb-12">
        {ENGINES.map((engine) => {
          const isSelected = engine.id === activeEngineId;
          return (
            <button
              key={engine.id}
              type="button"
              onClick={() => setActiveEngineId(engine.id)}
              className={`px-7 sm:px-9 py-4 rounded-xl font-medium text-base sm:text-lg tracking-normal transition-all duration-300 border cursor-pointer ${isSelected
                  ? 'bg-[#111827] border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.25)] scale-[1.02]'
                  : 'bg-[#0F172A] border-slate-800 text-gray-150 hover:text-white hover:border-slate-700'
                }`}
            >
              {engine.name.split(' ')[0]} {engine.name.split(' ')[1] || ''}
            </button>
          );
        })}
      </div>

      {/* Active Engine Card */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#0F172A] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all duration-300 mb-20 w-full max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
          <div>
            <div className={`inline-block px-4 py-1.5 rounded-lg border font-mono text-base font-medium tracking-wide mb-3 ${activeEngine.badgeClass}`}>
              {activeEngine.badge}
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-normal leading-relaxed">
              {activeEngine.name}
            </h3>
            <p className="text-base sm:text-lg font-medium text-cyan-400 tracking-normal mt-1">
              {activeEngine.tagline}
            </p>
          </div>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-base font-medium tracking-wide self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PIPELINE ENGINE: ACTIVE</span>
          </div>
        </div>

        <p className="text-gray-150 text-lg sm:text-xl font-normal leading-loose tracking-normal mb-8">
          {activeEngine.description}
        </p>

        {/* Engine Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeEngine.capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-xl bg-[#111827] border border-slate-800/80 flex items-start gap-4 hover:border-cyan-500/30 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                ✓
              </div>
              <span className="text-base sm:text-lg font-normal text-gray-150 leading-relaxed tracking-normal">
                {cap}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications Subheading */}
      <div className="text-center w-full max-w-full mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-base font-medium tracking-wide mb-4">
          <span>PIPELINE HARDENING &amp; GOVERNANCE</span>
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-normal leading-relaxed">
          Technical Specifications &amp; Safeguards
        </h3>
      </div>

      {/* 3 Technical Specifications Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full">
        {TECHNICAL_SPECS.map((spec) => (
          <div
            key={spec.code}
            className="p-8 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-mono font-medium text-cyan-400 bg-slate-900 px-3 py-1 rounded border border-slate-800 tracking-wide">
                  {spec.code}
                </span>
                <span className={`text-base font-mono font-medium px-3 py-1 rounded border tracking-wide ${spec.badgeClass}`}>
                  {spec.tag}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-semibold text-white mb-4 leading-relaxed tracking-normal">
                {spec.title}
              </h4>

              <p className="text-gray-150 text-base sm:text-lg font-normal leading-loose tracking-normal mb-6">
                {spec.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              {spec.features.map((feat, fIdx) => (
                <div key={fIdx} className="flex items-center gap-3 text-base font-normal text-gray-150 tracking-normal">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF]" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
