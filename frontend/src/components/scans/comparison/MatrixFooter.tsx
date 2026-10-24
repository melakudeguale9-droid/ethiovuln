'use client';

import React from 'react';
import Link from 'next/link';

export interface MatrixFooterProps {
  onClose: () => void;
  onSelectMode?: (modeId: string) => void;
}

export function MatrixFooter({ onClose, onSelectMode }: MatrixFooterProps) {
  const handleLaunchDeep = () => {
    if (onSelectMode) {
      onSelectMode('full_enterprise');
    }
    onClose();
  };

  return (
    <div className="px-7 py-5 bg-[#0F172A] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
      {/* Metric Callout */}
      <div className="flex flex-wrap items-center gap-4 text-base text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span>
            Light: <strong className="text-slate-100">7 Surface Checks</strong> (~60s)
          </span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span>
            Deep: <strong className="text-amber-300">All 20 Exploit Proofs</strong> (Full PoC & CVSS v3.1)
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-xl text-base font-semibold text-slate-300 hover:text-slate-100 bg-[#090D16] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
        >
          Close Matrix
        </button>

        <Link
          href="/dashboard/scans/new?mode=full_enterprise"
          onClick={handleLaunchDeep}
          className="px-7 py-3 rounded-xl text-base sm:text-lg font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2.5"
        >
          <span>🚀 Launch Deep Scan Now</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
