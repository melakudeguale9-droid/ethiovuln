'use client';

import React from 'react';
import Link from 'next/link';
import { INCLUDED_IN_ALL, OPTIONAL_ADD_ONS } from './pricingData';

function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function AllPlansIncluded() {
  return (
    <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-10">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ─── Left Side: Included in all plans (Screenshot 3) ────────────── */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-normal leading-relaxed">
              Included in all plans:
            </h3>

            <div className="space-y-4">
              {INCLUDED_IN_ALL.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <span className="p-1 rounded-full bg-cyan-500/15 text-cyan-400 shrink-0 mt-0.5">
                    <CheckIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-extrabold text-white text-base">
                      {item.title}
                    </span>{' '}
                    <span className="text-gray-150 text-base leading-relaxed tracking-normal">
                      {item.desc.replace(item.title, '')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Side: Optional add-ons (Screenshot 3) ────────────────── */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 lg:pl-6 lg:border-l lg:border-slate-800">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-normal leading-relaxed mb-5">
                Optional add-ons
              </h3>

              <div className="flex flex-col gap-3">
                {OPTIONAL_ADD_ONS.map((addon) => (
                  <div
                    key={addon.id}
                    className="p-3.5 px-5 rounded-2xl bg-[#0F172A] border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="text-base font-bold text-white tracking-normal">
                      {addon.title}
                    </div>
                    <div className="text-sm text-gray-150 mt-1 leading-relaxed tracking-normal">
                      {addon.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button (Continue with a free trial - Screenshot 3) */}
            <div className="pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-block py-3.5 px-8 rounded-xl font-bold text-base text-center bg-slate-200 hover:bg-white text-slate-950 transition-all shadow-md transform hover:scale-[1.01]"
              >
                Continue with a free trial
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
