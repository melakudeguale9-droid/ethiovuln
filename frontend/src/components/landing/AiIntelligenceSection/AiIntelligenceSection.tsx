'use client';

import React from 'react';
import Link from 'next/link';

export function AiIntelligenceSection() {
  return (
    <section id="ai-intelligence" className="py-24 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full border-t border-slate-800/60 font-sans">
      <div className="text-center mb-16">
        <span className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 rounded-full inline-flex items-center gap-2">
          <span>✨</span>
          <span>Google GenAI Powered</span>
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5 tracking-normal leading-relaxed">
          Gemini AI Security Intelligence
        </h2>
        <p className="text-gray-150 text-lg sm:text-xl mt-4 w-full max-w-full mx-auto leading-relaxed tracking-normal font-normal">
          Automate vulnerability triage, eliminate false positives, and generate instant code remediation patches using Google Gemini.
        </p>
      </div>

      {/* 3-Column AI Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1 */}
        <div className="p-8 rounded-2xl bg-[#111827] border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl group">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Live Latency &amp; Health Probing</h3>
          <p className="text-slate-200 text-base leading-relaxed">
            Real-time authenticated round-trip latency benchmarking against FastAPI with sub-second model response feedback.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-8 rounded-2xl bg-[#111827] border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl group">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-transform">
            🛡️
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Automated Remediation Code</h3>
          <p className="text-slate-200 text-base leading-relaxed">
            Provides drop-in, syntax-highlighted code fixes in Python, Go, Node.js, and SQL for SQLi, SSRF, XSS, and IDOR flaws.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-8 rounded-2xl bg-[#111827] border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-transform">
            💬
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Interactive Security Advisor</h3>
          <p className="text-slate-200 text-base leading-relaxed">
            Persistent multi-turn conversational chat assistant ready to analyze OWASP risks, explain CVEs, and guide patch deployments.
          </p>
        </div>
      </div>

      {/* Interactive Callout Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0c1527] to-slate-900/90 border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              Model: gemini-3.5-flash-lite · Ready
            </span>
          </div>
          <h4 className="text-2xl font-bold text-white">Experience AI Security Advisory Now</h4>
          <p className="text-slate-300 text-base">
            Click to launch the persistent AI Advisor or use the floating assistant dock at the bottom of the screen.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-ai-chat'));
              }
            }}
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/50 transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <span>✨</span>
            <span>Launch AI Advisor</span>
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </section>
  );
}
