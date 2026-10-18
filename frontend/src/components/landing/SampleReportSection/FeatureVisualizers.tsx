'use client';

import React from 'react';

/**
 * Visualizer for Stage 2: Authenticated Scanning
 */
export function AuthVisualizer() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto bg-[#0D121F] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Authenticated Session Active</span>
        </div>
        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-400">Bearer JWT</span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
          <span className="text-slate-500 text-[10px] block">Authorization Header</span>
          <p className="text-cyan-300 text-[11px] truncate mt-0.5">
            Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMDk4MmEiLCJyb2xlIjoiYWRtaW4iLCJ0ZW5hbnQiOiJldGhpb3Z1bG4ifQ
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
            <span className="text-slate-500 block text-[10px]">Session Cookie</span>
            <span className="text-emerald-400 font-bold">_ev_session=92b1a8...</span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
            <span className="text-slate-500 block text-[10px]">CSRF Protection</span>
            <span className="text-emerald-400 font-bold">X-CSRF-Token: Active</span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 text-[11px] text-slate-300 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>Crawled Authenticated Endpoints:</span>
            <span className="text-white font-bold">42 routes</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Admin Portal Surfaces Audited:</span>
            <span className="text-cyan-400 font-bold">100% complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Visualizer for Stage 3: Out-of-Band (OOB) Vulnerability Detection
 */
export function OobVisualizer() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto bg-[#0D121F] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-semibold text-slate-200">OOB Listener Interceptor</span>
        </div>
        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
          oob.ethiovuln.internal
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-rose-400 font-bold">● BLIND SSRF DETECTED</span>
            <span className="text-slate-500 text-[10px]">2 sec ago</span>
          </div>
          <p className="text-slate-300">
            Target fired DNS resolution for <span className="text-amber-300">payload-8392.oob.ethiovuln.internal</span>
          </p>
          <div className="text-[10px] text-slate-500 pt-1">
            Origin IP: 196.188.42.11 (Internal Cloud Metadata Gateway)
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-emerald-400 font-bold">● HTTP Interaction Callback</span>
            <span className="text-slate-500 text-[10px]">14 sec ago</span>
          </div>
          <p className="text-slate-300">
            Out-of-band reverse HTTP GET received on port 443 with probe identifier #9921
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Visualizer for Stage 4: OWASP Top 10 Matrix
 */
export function OwaspVisualizer() {
  const items = [
    { code: 'A01', name: 'Broken Access Control', count: '14 checks', active: true },
    { code: 'A02', name: 'Cryptographic Failures', count: '8 checks', active: true },
    { code: 'A03', name: 'Injection (SQLi/Command)', count: '22 checks', active: true },
    { code: 'A04', name: 'Insecure Design', count: '6 checks', active: true },
    { code: 'A05', name: 'Security Misconfiguration', count: '18 checks', active: true },
    { code: 'A06', name: 'Vulnerable Components', count: '11 checks', active: true },
  ];

  return (
    <div className="relative w-full max-w-[560px] mx-auto bg-[#0D121F] border border-slate-800 rounded-2xl p-6 shadow-2xl text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 font-mono">
        <span className="font-semibold text-slate-200">OWASP Top 10 Coverage Engine</span>
        <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          100% Aligned
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-400 font-bold text-xs">{item.code}</span>
              <span className="text-[10px] font-mono text-slate-500">{item.count}</span>
            </div>
            <p className="text-slate-300 font-medium text-[11px] mt-1 truncate">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Visualizer for Stage 5: Zero False Positives / Verified Exploit Proof
 */
export function ProofVisualizer() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto bg-[#0D121F] border border-slate-800 rounded-2xl p-5 shadow-2xl font-mono text-[11px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-bold text-slate-200">Execution Proof & Payload Diff</span>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
          CONFIRMED 100%
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-500 text-[10px] block mb-1">Injected Payload:</span>
          <code className="text-rose-400 block bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
            &apos; UNION SELECT 1, @@version, user() --
          </code>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-500 text-[10px] block mb-1">Extracted Server Signature:</span>
          <code className="text-emerald-400 block bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20">
            MySQL 8.0.35-Debian | root@127.0.0.1
          </code>
        </div>
      </div>
    </div>
  );
}

/**
 * Visualizer for Stage 6: Modern SPA Crawler
 */
export function CrawlerVisualizer() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto bg-[#0D121F] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
        <span className="font-semibold text-slate-200">Headless Browser SPA Crawler</span>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
          Chromium Engine
        </span>
      </div>

      <div className="mt-4 space-y-2.5 text-[11px]">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="text-slate-300">Dynamic DOM Routes Discovered:</span>
          <span className="text-cyan-400 font-bold">148 pages</span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="text-slate-300">JavaScript Event Listeners Audited:</span>
          <span className="text-emerald-400 font-bold">512 triggers</span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="text-slate-300">Client-Side Frameworks Detected:</span>
          <span className="text-white font-bold">Next.js, React 19, Tailwind</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Visualizer for Stage 7: Executive & Compliance Reporting
 */
export function ReportingVisualizer() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto bg-[#0D121F] border border-slate-800 rounded-2xl p-6 shadow-2xl text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 font-mono">
        <span className="font-semibold text-slate-200">White-Label Executive PDF</span>
        <span className="text-cyan-400 font-bold text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          Ready to Export
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5 text-center font-mono">
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[10px] block">PDF Report</span>
          <span className="text-cyan-400 font-bold text-sm block mt-1">.PDF</span>
        </div>
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[10px] block">Raw Data</span>
          <span className="text-amber-400 font-bold text-sm block mt-1">.JSON</span>
        </div>
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[10px] block">Auditor Sheet</span>
          <span className="text-emerald-400 font-bold text-sm block mt-1">.CSV</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Visualizer for Stage 8: CI/CD & DevSecOps
 */
export function CicdVisualizer() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto bg-[#0D121F] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
        <span className="font-semibold text-slate-200">CI/CD Pipeline Gatekeeper</span>
        <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          BUILD PASS
        </span>
      </div>

      <div className="mt-4 bg-slate-950/90 p-3.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
        <div className="text-slate-400">$ ethiovuln-cli scan --target staging.app --fail-on critical</div>
        <div className="text-cyan-400">▶ Initializing automated DAST suite...</div>
        <div className="text-slate-300">✔ 0 Critical vulnerabilities found. Gate passed.</div>
      </div>
    </div>
  );
}

/**
 * Visualizer for Stage 9: Continuous Monitoring
 */
export function MonitoringVisualizer() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto bg-[#0D121F] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Continuous Scheduled Scanner</span>
        </div>
        <span className="text-cyan-400 font-bold text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          Every 24h
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-500 text-[10px] block">Next Scheduled Run:</span>
          <span className="text-white font-bold block mt-1">Tomorrow, 02:00 AM UTC</span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-500 text-[10px] block">Alert Channel:</span>
          <span className="text-cyan-400 font-bold block mt-1">Slack #security-ops</span>
        </div>
      </div>
    </div>
  );
}
