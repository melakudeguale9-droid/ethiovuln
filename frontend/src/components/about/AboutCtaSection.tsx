'use client';

import React from 'react';
import Link from 'next/link';

export function AboutCtaSection() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full font-sans">
      <div className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0F172A] border border-cyan-500/40 text-center overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)] w-full max-w-full">
        {/* Decorative background glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[260px] pointer-events-none transform-gpu"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.12) 0%, rgba(0, 240, 255, 0) 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-full mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-base font-medium tracking-wide mb-6">
            <span>START SECURING YOUR ASSETS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-normal leading-relaxed mb-6">
            Automate Your Web Vulnerability Management
          </h2>

          <p className="text-gray-150 text-lg sm:text-xl font-normal leading-loose tracking-normal mb-10">
            Deploy an automated, tri-engine security assessment against your web applications in under 60
            seconds. Get verifiable proof-of-concept evidence, standardized CVSS v3.1 scoring, and
            actionable remediation roadmaps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/dashboard/scans/new"
              className="w-full sm:w-auto px-9 py-4 rounded-xl font-medium text-lg bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 !text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] transform hover:scale-105 transition-all duration-300 cursor-pointer tracking-normal"
            >
              Launch Assessment Wizard →
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto px-9 py-4 rounded-xl font-medium text-lg bg-[#0B0F19] hover:bg-slate-800 text-white border border-slate-700 hover:border-cyan-400 transition-all duration-300 cursor-pointer tracking-normal"
            >
              View Enterprise Pricing
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400">
            <span>Direct Security Inquiries: <a href="mailto:security@ethiovuln.io" className="text-cyan-400 font-mono hover:underline">security@ethiovuln.io</a></span>
            <span className="hidden sm:inline">•</span>
            <span>Responsible Disclosure: <a href="mailto:security@ethiovuln.io?subject=Vulnerability%20Disclosure" className="text-cyan-400 font-mono hover:underline">Safe Harbor Standard</a></span>
          </div>
        </div>
      </div>
    </section>
  );
}
