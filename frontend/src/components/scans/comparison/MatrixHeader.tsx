'use client';

import React from 'react';

export interface MatrixHeaderProps {
  onClose: () => void;
}

export function MatrixHeader({ onClose }: MatrixHeaderProps) {
  return (
    <div className="px-7 py-6 bg-[#0F172A] border-b border-slate-800 flex items-start justify-between gap-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-amber-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-normal leading-relaxed">
            Enable Deep Scans: Light vs Deep comparison matrix
          </h2>

          <span className="text-base font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Enterprise DAST Matrix
          </span>
          <span className="text-base font-semibold px-3.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            CVSS v3.1 Verified
          </span>
        </div>

        <p className="text-base sm:text-lg text-slate-300 max-w-5xl leading-relaxed">
          <strong className="text-slate-100">Light scan</strong> performs non-intrusive surface checks in ~60 seconds.
          Upgrade to <strong className="text-amber-400">Deep scan</strong> to unlock recursive crawling, active injection fuzzing (SQLi, XSS, SSRF), and exploit verification across all 8 assessment categories.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-3 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all flex items-center justify-center flex-shrink-0"
        aria-label="Close comparison matrix"
      >
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
