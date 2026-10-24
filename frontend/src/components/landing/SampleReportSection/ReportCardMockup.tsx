'use client';

import React, { useState } from 'react';

function FlagIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ZapIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

/**
 * ReportCardMockup
 * Replicates the Pentest-Tools Stage 1 Light Executive Report preview card:
 * - Clean white card with subtle borders
 * - Risk rating breakdown chart
 * - Confirmed finding table row for Remote File Inclusion (RFI)
 */
export function ReportCardMockup() {
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  return (
    <div className="relative w-full max-w-[620px] mx-auto select-none">
      {/* Base White Sheet (Report Background) */}
      <div className="relative bg-white text-slate-900 rounded-2xl p-5 sm:p-7 shadow-2xl border border-slate-200">
        
        {/* Report Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-3">
            {/* Pentest-Tools Style Angled Shield */}
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
                <path d="M18 3L4 9V17C4 25.5 10 32.5 18 34.5C26 32.5 32 25.5 32 17V9L18 3Z" fill="#111827" stroke="#1E293B" strokeWidth="2" />
                <path d="M18 4L5 9.5V17C5 24.8 10.6 31.4 18 33.3V4Z" fill="#0284C7" />
                <path d="M18 4L31 9.5V17C31 24.8 25.4 31.4 18 33.3V4Z" fill="#0F172A" />
                <path d="M18 9L11 13V17C11 21.5 14 25.5 18 27V9Z" fill="#00F0FF" />
                <circle cx="23" cy="18" r="2" fill="#E11D48" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-normal text-slate-900 leading-none block">
                Ethio<span className="text-cyan-600">Vuln</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Pentest Suite
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-700 block">
              Website Vulnerability Scanner Report
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              REF: EV-2026-90214
            </span>
          </div>
        </div>

        {/* Elevated Summary Card (Exact Match to Floating Box) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-lg mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3 pb-2 border-b border-slate-100">
            Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
            
            {/* Overall Risk Level */}
            <div className="md:col-span-3 border-r-0 md:border-r border-slate-100 pr-0 md:pr-3">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Overall risk level:
              </span>
              <div className="inline-block px-3 py-1.5 rounded-md bg-[#DC2626] text-white font-extrabold text-xs shadow-sm">
                Critical
              </div>
            </div>

            {/* Risk Ratings Bar Chart */}
            <div className="md:col-span-5 border-r-0 md:border-r border-slate-100 pr-0 md:pr-3 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Risk ratings:
              </span>
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-slate-600">Critical:</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded overflow-hidden">
                    <div className="bg-[#DC2626] h-full w-[20%]" />
                  </div>
                  <span className="font-bold text-[#DC2626]">3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-slate-600">High:</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded overflow-hidden">
                    <div className="bg-[#EA580C] h-full w-[20%]" />
                  </div>
                  <span className="font-bold text-[#EA580C]">3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-slate-600">Medium:</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded overflow-hidden">
                    <div className="bg-[#F59E0B] h-full w-[26%]" />
                  </div>
                  <span className="font-bold text-[#F59E0B]">4</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-slate-600">Low:</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded overflow-hidden">
                    <div className="bg-[#0284C7] h-full w-[45%]" />
                  </div>
                  <span className="font-bold text-[#0284C7]">14</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-slate-600">Info:</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded overflow-hidden">
                    <div className="bg-[#10B981] h-full w-[85%]" />
                  </div>
                  <span className="font-bold text-[#10B981]">51</span>
                </div>
              </div>
            </div>

            {/* Scan Information Meta */}
            <div className="md:col-span-4 space-y-1 font-mono text-[10px] text-slate-600">
              <span className="text-[11px] font-sans font-semibold text-slate-500 block mb-1">
                Scan information:
              </span>
              <div className="flex justify-between">
                <span className="text-slate-400">Start time:</span>
                <span>Feb 12, 2025 / 10:00:42 UTC+02</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Finish time:</span>
                <span>Feb 12, 2025 / 10:45:13 UTC+02</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scan duration:</span>
                <span>44 min, 31 sec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tests performed:</span>
                <span className="font-bold text-slate-800">75/75</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">Scan status:</span>
                <span className="bg-[#10B981] text-white px-2 py-0.5 rounded text-[9px] font-bold">
                  Finished
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Findings Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Findings
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Showing confirmed exploit proof
            </span>
          </div>

          {/* Finding Item Row: Remote File Inclusion */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
            
            {/* Finding Title Bar */}
            <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlagIcon className="w-3.5 h-3.5 text-[#DC2626]" />
                <span className="font-bold text-xs text-slate-900">
                  Remote File Inclusion
                </span>
              </div>
              <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500 text-emerald-700 bg-emerald-50 uppercase">
                CONFIRMED
              </span>
            </div>

            {/* Finding Details Table */}
            <div className="p-3.5 text-[11px] grid grid-cols-12 gap-3 bg-white">
              <div className="col-span-3 font-mono text-slate-400 font-semibold text-[10px] uppercase">
                URL
              </div>
              <div className="col-span-2 font-mono text-slate-400 font-semibold text-[10px] uppercase">
                Method
              </div>
              <div className="col-span-2 font-mono text-slate-400 font-semibold text-[10px] uppercase">
                Vulnerable Parameter
              </div>
              <div className="col-span-4 font-mono text-slate-400 font-semibold text-[10px] uppercase">
                Evidence
              </div>
              <div className="col-span-1 font-mono text-slate-400 font-semibold text-[10px] uppercase text-right">
                Replay
              </div>

              {/* Data Row */}
              <div className="col-span-3 font-mono text-cyan-600 truncate" title="https://target-app.ethiovuln.io/vulnerabilities/rfi">
                https://target-app.ethiovuln.io/vulnerabilities/rfi
              </div>
              <div className="col-span-2 font-mono font-bold text-slate-800">
                GET
              </div>
              <div className="col-span-2 font-mono text-slate-700">
                page (Query Parameter)
              </div>
              <div className="col-span-4 text-slate-600 leading-snug">
                Injecting the remote file URL resulted in the content of the remote file being present in the response.{' '}
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(!showEvidenceModal)}
                  className="text-cyan-600 font-semibold hover:underline"
                >
                  Request / Response
                </button>
              </div>
              <div className="col-span-1 text-right">
                <button
                  type="button"
                  title="Replay Attack with CURL"
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-flex items-center justify-center"
                >
                  <ZapIcon className="w-3 h-3 text-cyan-600" />
                </button>
              </div>
            </div>

            {/* Collapsible Risk Description */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Risk description:</strong> The risk varies greatly, depending on the behaviour of programming language used on the server. Remote File Execution gives remote attackers the ability to run arbitrary code on the target host.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
