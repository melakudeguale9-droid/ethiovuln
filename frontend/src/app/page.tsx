'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SCAN_TAXONOMY } from '@/data/scanTaxonomy';
import { Navbar } from '@/components/navigation/Navbar';
import { ScanComparisonModal } from '@/components/scans/ScanComparisonModal';
import { HeroSection } from '@/components/landing/HeroSection';
import { SampleReportSection } from '@/components/landing/SampleReportSection/SampleReportSection';
import { MultiEngineSection } from '@/components/landing/MultiEngineSection';
import { VectorsTaxonomySection } from '@/components/landing/VectorsTaxonomySection';
import { CliScanSection } from '@/components/landing/CliScanSection/CliScanSection';
import { FaqSection } from '@/components/landing/FaqSection/FaqSection';
import { NextToolsSection } from '@/components/landing/NextToolsSection/NextToolsSection';
import { AiIntelligenceSection } from '@/components/landing/AiIntelligenceSection';
import { LandingFooter } from '@/components/landing/Footer';

function ArrowRightIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const TELEMETRY_CARDS = [
  { label: 'Vulnerability Engine', value: 'Nuclei v3 + ZAP 2.14', tag: 'Dual Core' },
  { label: 'Template Signatures', value: '8,000+ Community Definitions', tag: 'Continuous' },
  { label: 'Assessment Standards', value: 'CVSS v3.1 & OWASP Top 10', tag: 'Standardized' },
  { label: 'Exploit Accuracy', value: '< 0.5% False Positives', tag: 'Verified' },
];

type ScanMode = 'light' | 'deep' | 'cli';

/* ─── Main Landing Page Component ─────────────────────────────────────────── */
export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ScanMode>('light');
  const [selectedVectorId, setSelectedVectorId] = useState<string>('full_enterprise');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonCategory, setComparisonCategory] = useState<string>('all');
  const [targetUrl, setTargetUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleLaunchScan = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = targetUrl.trim();
    if (!clean) {
      setUrlError('Please enter a target URL or IP address');
      return;
    }
    setUrlError('');
    const fullTarget = clean.startsWith('http') ? clean : `https://${clean}`;
    const modeParam = activeTab === 'light' ? 'passive_scan' : selectedVectorId;
    router.push(`/dashboard/scans/new?target=${encodeURIComponent(fullTarget)}&mode=${modeParam}`);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-cyan-500/25 selection:text-cyan-200 w-full max-w-full overflow-x-hidden min-w-0">

      {/* ─── Global Cyber Navigation Header ───────────────────────────────── */}
      <Navbar />

      {/* ─── Interactive Hero Section ─────────────────────────────────────── */}
      <HeroSection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedVectorId={selectedVectorId}
        setSelectedVectorId={setSelectedVectorId}
        targetUrl={targetUrl}
        setTargetUrl={setTargetUrl}
        urlError={urlError}
        setUrlError={setUrlError}
        onLaunchScan={handleLaunchScan}
        onOpenComparison={(catId) => {
          setComparisonCategory(catId || selectedVectorId);
          setIsComparisonOpen(true);
        }}
        scanTaxonomy={SCAN_TAXONOMY}
      >
        {/* ─── Telemetry Metrics Ribbon ────────────────────────────────────── */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TELEMETRY_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#111827] border border-slate-800 text-left transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <span className="text-base font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {card.tag}
                </span>
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </HeroSection>

      {/* ─── Documented Evidence & Sample Report Preview ─────────────────── */}
      <SampleReportSection />

      {/* ─── Modular Multi-Engine Scanning Pipeline ──────────────────────── */}
      <MultiEngineSection />

      {/* ─── 8 Assessment Vectors & Coverage Taxonomy ────────────────────── */}
      <VectorsTaxonomySection
        onOpenComparisonModal={() => {
          setComparisonCategory('all');
          setIsComparisonOpen(true);
        }}
      />

      {/* ─── Headless Command Line Interface (CLI Scan) ──────────────────── */}
      <CliScanSection
        onOpenComparisonModal={() => {
          setComparisonCategory('all');
          setIsComparisonOpen(true);
        }}
      />

      {/* ─── Frequently Asked Questions Knowledge Base ───────────────────── */}
      <FaqSection />

      {/* ─── Next Steps: Assessment Tool Catalog ─────────────────────────── */}
      <NextToolsSection />

      {/* ─── Google Gemini AI Security Intelligence ──────────────────────── */}
      <AiIntelligenceSection />

      {/* ─── Call to Action Panel ─────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full">
        <div className="p-10 rounded-2xl bg-[#111827] border border-slate-700 text-center relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-cyan-400">
          <div className="relative z-10 w-full max-w-full mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-normal leading-relaxed">
              Ready to Secure Your Web Applications?
            </h2>
            <p className="text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal mb-8">
              Launch active vulnerabilities checks, detect sensitive data exposure, and generate verifiable CVSS v3.1 reports in minutes.
            </p>
            <Link
              href="/dashboard/scans/new"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-extrabold text-base sm:text-lg bg-gradient-to-r from-cyan-400 to-sky-500 !text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <span className="!text-slate-950 font-extrabold tracking-normal">Launch Assessment Suite</span>
              <ArrowRightIcon className="w-5 h-5 !text-slate-950" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Global Enterprise Footer ────────────────────────────────────── */}
      <LandingFooter />

      {/* ─── Scan Depth Comparison Matrix Modal ──────────────────────────── */}
      <ScanComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        initialCategoryId={comparisonCategory}
        onSelectMode={(modeId) => {
          setSelectedVectorId(modeId);
          setActiveTab('deep');
        }}
      />
    </div>
  );
}
