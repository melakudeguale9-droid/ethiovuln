'use client';

import React from 'react';

export function HeroMissionSection() {
  return (
    <section className="relative pt-16 pb-24 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full overflow-hidden font-sans">
      {/* Background radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] pointer-events-none -z-10 transform-gpu"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.08) 0%, rgba(0, 240, 255, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-full text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-base font-medium tracking-wide shadow-[0_0_20px_rgba(0,240,255,0.15)] mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>MISSION &amp; PLATFORM VISION</span>
        </div>

        {/* Main Headline (Spacious tracking-normal, relaxed line-height, bright text-white) */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-normal leading-relaxed mb-8 w-full max-w-full">
          Next-Generation{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Automated DAST
          </span>{' '}
          Platform
        </h1>

        {/* Mission Statement (High-contrast text-gray-150, spacious leading-loose, tracking-normal) */}
        <p className="text-gray-150 text-lg sm:text-xl font-normal leading-loose tracking-normal w-full max-w-full mx-auto mb-14">
          EthioVuln bridges the gap between manual penetration testing and continuous security
          integration by unifying open-source security standards into an orchestrated,
          non-destructive web assessment pipeline. Built specifically to eliminate blind spots in
          modern cloud-native web architectures, EthioVuln empowers security researchers, DevSecOps
          teams, and compliance officers with automated vulnerability discovery, verified
          proof-of-concept evidence, and zero-false-positive CVSS v3.1 scoring—all without
          jeopardizing production availability.
        </p>

        {/* Core Mission Statement Quote Box */}
        <div className="w-full max-w-full relative text-left p-8 sm:p-12 rounded-2xl bg-[#0F172A] border border-cyan-500/30 border-l-4 border-l-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.12)] transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_45px_rgba(0,240,255,0.2)] mb-16">
          <div className="flex items-center gap-3 text-cyan-400 font-mono font-medium text-base uppercase tracking-wide mb-4">
            <span className="w-3 h-3 rounded-sm bg-cyan-400 shadow-[0_0_10px_#00F0FF]" />
            <span>Core Mission Statement</span>
          </div>

          <blockquote className="text-white text-xl sm:text-2xl font-normal leading-loose tracking-normal italic border-l-2 border-cyan-500/50 pl-6 py-2 mb-6 w-full">
            &ldquo;To democratize proactive cybersecurity intelligence by delivering automated,
            transparent, and non-destructive vulnerability assessments that protect vital digital
            infrastructures before threat actors exploit them.&rdquo;
          </blockquote>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-slate-800 text-base font-normal w-full">
            <span className="font-mono text-gray-150 tracking-normal">EthioVuln Engineering &amp; Offensive Security Charter</span>
            <span className="text-cyan-400 font-mono font-medium tracking-wide">EST. 2024 · ADDIS ABABA, ETHIOPIA</span>
          </div>
        </div>

        {/* Key Platform Highlights Strip (Bright text-white & text-gray-150, spacious line-height, tracking-normal) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left w-full max-w-full">
          <div className="p-6 sm:p-7 rounded-xl bg-[#111827] border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-medium text-cyan-400 font-mono tracking-wide mb-2">Tri-Engine</div>
            <div className="text-lg font-medium text-white tracking-normal mb-2">Coordinated Pipeline</div>
            <div className="text-base font-normal text-gray-150 leading-relaxed tracking-normal">
              Nuclei, ZAP spidering, and smart dictionary fuzzing.
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-xl bg-[#111827] border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-medium text-indigo-400 font-mono tracking-wide mb-2">8 Vectors</div>
            <div className="text-lg font-medium text-white tracking-normal mb-2">Full Attack Surface</div>
            <div className="text-base font-normal text-gray-150 leading-relaxed tracking-normal">
              Passive headers to deep authenticated injection.
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-xl bg-[#111827] border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-medium text-emerald-400 font-mono tracking-wide mb-2">Anti-SSRF</div>
            <div className="text-lg font-medium text-white tracking-normal mb-2">Pre-Flight Safety Gate</div>
            <div className="text-base font-normal text-gray-150 leading-relaxed tracking-normal">
              Strict RFC 1918, loopback, and cloud metadata filter.
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-xl bg-[#111827] border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-medium text-amber-400 font-mono tracking-wide mb-2">CVSS v3.1</div>
            <div className="text-lg font-medium text-white tracking-normal mb-2">Standardized Governance</div>
            <div className="text-base font-normal text-gray-150 leading-relaxed tracking-normal">
              Quantitative severity mapped directly to MITRE CWE.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
