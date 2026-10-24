// EthioVuln — Dedicated Enterprise Assessment Services Page

import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { LandingFooter } from '@/components/landing/Footer';
import { ServicesSection } from '@/components/landing/ServicesSection';

export const metadata: Metadata = {
  title: 'Enterprise Pentesting & Assessment Services — EthioVuln Suite',
  description:
    'Full-spectrum cybersecurity assessment services: automated DAST dynamic scanning, executive & compliance PDF reporting, CVSS v3.1 risk scoring, and continuous attack surface monitoring.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-200 w-full max-w-full overflow-x-hidden min-w-0">
      <Navbar />

      <main className="flex-1 w-full max-w-full overflow-x-hidden min-w-0">
        <ServicesSection />

        <section className="py-20 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full">
          <div className="p-10 sm:p-14 rounded-3xl bg-[#111827] border border-slate-700 text-center relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-cyan-400">
            <div className="relative z-10 w-full max-w-full mx-auto">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full inline-block mb-4">
                Instant Provisioning
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 tracking-normal leading-relaxed">
                Ready to Initiate a High-Impact Assessment?
              </h2>
              <p className="text-gray-300 text-base sm:text-xl leading-relaxed tracking-normal mb-8 max-w-4xl mx-auto">
                Launch automated vulnerability checks across your web applications, APIs, and infrastructure perimeters. Get comprehensive evidence packages, developer curl proofs, and certified CVSS scores.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard/scans/new"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-base sm:text-lg bg-gradient-to-r from-cyan-400 to-sky-500 !text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] transform hover:scale-105 transition-all duration-300 cursor-pointer tracking-normal"
                >
                  Start Free Assessment →
                </Link>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base sm:text-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
                >
                  Explore Assessment Tiers
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
