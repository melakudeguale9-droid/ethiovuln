// EthioVuln — Platform Architecture, Mission & Research About Page

import type { Metadata } from 'next';
import { Navbar } from '@/components/navigation/Navbar';
import { LandingFooter } from '@/components/landing/Footer';
import {
  HeroMissionSection,
  EnginePipelineSection,
  SecurityVectorsSection,
  DeveloperProfileSection,
  AboutCtaSection,
} from '@/components/about';

export const metadata: Metadata = {
  title: 'About EthioVuln — Next-Generation Automated DAST Platform',
  description:
    'Discover EthioVuln: our mission to democratize proactive cybersecurity intelligence, our tri-engine DAST orchestration pipeline (Nuclei, OWASP ZAP, Smart Fuzzer), the 8 enterprise assessment vectors, and lead security researcher Melaku Deguale.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-150 font-sans tracking-normal selection:bg-cyan-500/25 selection:text-cyan-200 flex flex-col justify-between w-full max-w-full overflow-x-hidden min-w-0">
      {/* ─── Global Cyber Navigation ───────────────────────────────────────── */}
      <Navbar />

      {/* ─── Main Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden min-w-0">
        {/* 1. Hero & Mission Section */}
        <HeroMissionSection />

        {/* 2. Architecture & Engine Pipeline Section */}
        <EnginePipelineSection />

        {/* 3. Core Security Vectors (The 8 Tiers Overview) */}
        <SecurityVectorsSection />

        {/* 4. Developer & Researcher Profile Section */}
        <DeveloperProfileSection />

        {/* 5. Closing Call to Action */}
        <AboutCtaSection />
      </main>

      {/* ─── Global Footer ─────────────────────────────────────────────────── */}
      <LandingFooter />
    </div>
  );
}
