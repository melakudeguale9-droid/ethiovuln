'use client';

import React from 'react';
import Link from 'next/link';

export function EnterpriseBanner() {
  return (
    <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E1528] via-[#131D36] to-[#1E2945] border border-slate-800 p-8 sm:p-12 shadow-2xl">
        {/* Subtle decorative security line grid in background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
            <line x1="0" y1="40" x2="400" y2="40" stroke="#00F0FF" strokeWidth="12" strokeDasharray="30 20" strokeLinecap="round" />
            <line x1="0" y1="80" x2="400" y2="80" stroke="#F5A623" strokeWidth="12" strokeDasharray="50 30" strokeLinecap="round" />
            <line x1="0" y1="120" x2="400" y2="120" stroke="#0284C7" strokeWidth="12" strokeDasharray="40 25" strokeLinecap="round" />
            <line x1="0" y1="160" x2="400" y2="160" stroke="#F43F5E" strokeWidth="12" strokeDasharray="60 40" strokeLinecap="round" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-normal leading-relaxed">
              Custom plans
            </h3>
            <p className="text-gray-150 text-base sm:text-lg font-normal leading-relaxed tracking-normal">
              For organizations with enterprise-level security needs, private VPC deployments, air-gapped on-premise instances, and custom SLA agreements.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/about#contact"
              className="inline-block py-3.5 px-8 rounded-xl font-bold text-base bg-[#18233C] hover:bg-[#202E50] border border-slate-700 text-white transition-all transform hover:scale-[1.02] shadow-lg"
            >
              Ask for a custom offer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
