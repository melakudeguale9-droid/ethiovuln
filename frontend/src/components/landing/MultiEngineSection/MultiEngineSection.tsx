'use client';

import React, { useState } from 'react';

export interface EngineSpec {
  label: string;
  val: string;
}

export interface EngineData {
  id: string;
  name: string;
  tag: string;
  badgeColor: string;
  accentHex: string;
  description: string;
  specs: EngineSpec[];
}

export const ENGINES: EngineData[] = [
  {
    id: 'nuclei',
    name: 'Nuclei Template Engine',
    tag: 'Template-Driven DAST',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    accentHex: '#00F0FF',
    description:
      'Fast and highly customizable vulnerability scanner executing community-curated YAML DSL templates across target hosts with parallel asynchronous I/O and near-zero false positive rates.',
    specs: [
      { label: 'Template Library', val: '8,000+ Verified YAML Rules' },
      { label: 'Detection Scope', val: 'CVEs, Misconfigurations & Exposures' },
      { label: 'Execution Engine', val: 'High-Concurrency Async Go I/O' },
      { label: 'False Positive Ratio', val: '< 0.5% with multi-condition matches' },
    ],
  },
  {
    id: 'zap',
    name: 'OWASP ZAP Engine',
    tag: 'Dynamic Active Scanner',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    accentHex: '#6366F1',
    description:
      'The industry-standard web application security engine. Systematically crawls traditional and modern AJAX frontends, automatically extracting auth tokens and probing for deep server logic vulnerabilities.',
    specs: [
      { label: 'Crawling Technology', val: 'Dynamic AJAX Spider & Form Analyzer' },
      { label: 'Injection Vectors', val: 'SQLi, Blind XSS, Command Injection' },
      { label: 'Session Management', val: 'Automated Cookie & CSRF Preservation' },
      { label: 'Compliance Mapping', val: 'OWASP Top 10 + CWE Risk Matrix' },
    ],
  },
  {
    id: 'fuzzer',
    name: 'Smart Fuzzing & Discovery',
    tag: 'Heuristic Reconnaissance',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    accentHex: '#10B981',
    description:
      'Custom Python/FastAPI discovery core that performs high-speed asynchronous directory fuzzing, exposed credential discovery, and dynamic soft-404 detection across targeted infrastructure perimeters.',
    specs: [
      { label: 'Dictionary Size', val: '10,000+ Curated Sensitive Paths' },
      { label: 'Detection Capabilities', val: '.env, .git, Admin Consoles, DB Backups' },
      { label: 'Engine Architecture', val: 'Python Asyncio & HTTP Fuzzing Core' },
      { label: 'Safety Guarantee', val: 'Non-Destructive & Anti-SSRF Constrained' },
    ],
  },
];

export function MultiEngineSection() {
  const [activeEngineId, setActiveEngineId] = useState<string>('nuclei');
  const currentEngine = ENGINES.find((e) => e.id === activeEngineId) ?? ENGINES[0];

  return (
    <section id="engines" className="py-24 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full border-t border-slate-800/60 font-sans">
      <div className="text-center mb-14">
        <span className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 rounded-full inline-block">
          Architecture Pipeline
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5 tracking-normal leading-relaxed">
          Multi-Engine Scanning Pipeline
        </h2>
        <p className="text-gray-150 text-lg sm:text-xl mt-4 w-full max-w-full mx-auto leading-relaxed tracking-normal font-normal">
          Combines signature scanning, crawler-based attack injection, and directory brute-forcing into a single coordinated stream.
        </p>
      </div>

      {/* Engine Switcher Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {ENGINES.map((engine) => {
          const isSelected = engine.id === activeEngineId;
          return (
            <button
              key={engine.id}
              type="button"
              onClick={() => setActiveEngineId(engine.id)}
              className={`px-7 py-3.5 rounded-xl text-lg sm:text-xl font-extrabold transition-all duration-300 border cursor-pointer ${isSelected
                ? 'bg-slate-800 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)] scale-105'
                : 'bg-[#111827] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
            >
              {engine.name}
            </button>
          );
        })}
      </div>

      {/* Engine Specs Display Card */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
          <div>
            <span className={`text-base sm:text-lg font-mono font-bold uppercase tracking-wider px-4 py-2 rounded border inline-block ${currentEngine.badgeColor}`}>
              {currentEngine.tag}
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">
              {currentEngine.name}
            </h3>
          </div>
          <div className="inline-flex items-center gap-3 text-base sm:text-lg font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-lg self-start sm:self-auto">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span>ENGINE STATUS: OPERATIONAL</span>
          </div>
        </div>

        <p className="text-slate-200 text-lg sm:text-xl leading-relaxed mb-8 font-normal">
          {currentEngine.description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {currentEngine.specs.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="text-base sm:text-lg font-bold text-slate-300 uppercase tracking-wider mb-2">
                {item.label}
              </div>
              <div className="text-lg sm:text-xl font-mono font-bold text-cyan-300">
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
