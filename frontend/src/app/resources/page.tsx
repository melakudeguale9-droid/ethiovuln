// EthioVuln — Dedicated Security Resources & Knowledge Base Page

import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { LandingFooter } from '@/components/landing/Footer';
import { ResourcesSection } from '@/components/landing/ResourcesSection';

export const metadata: Metadata = {
  title: 'Security Resources & Developer Documentation — EthioVuln Suite',
  description:
    'Comprehensive cybersecurity developer resources: vulnerability taxonomy standards, headless CLI scanner documentation, OWASP Top 10 matrix, OpenAPI Swagger schemas, and code remediation blueprints.',
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1">
        <ResourcesSection />

        <section className="py-20 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full">
          <div className="p-10 sm:p-14 rounded-3xl bg-[#111827] border border-slate-700 text-center relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-cyan-400">
            <div className="relative z-10 w-full max-w-full mx-auto">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full inline-block mb-4">
                Developer Integration
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 tracking-normal leading-relaxed">
                Automate Security Across Your CI/CD Pipelines
              </h2>
              <p className="text-gray-300 text-base sm:text-xl leading-relaxed tracking-normal mb-8 max-w-4xl mx-auto">
                Integrate automated vulnerability scanning directly into your GitHub Actions, GitLab CI, or terminal workflows. Get verifiable exit codes, SARIF reports, and drop-in code fixes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard/scans/new"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-base sm:text-lg bg-gradient-to-r from-cyan-400 to-sky-500 !text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] transform hover:scale-105 transition-all duration-300 cursor-pointer tracking-normal"
                >
                  Launch Live Assessment →
                </Link>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base sm:text-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
                >
                  Open Swagger API Docs ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
