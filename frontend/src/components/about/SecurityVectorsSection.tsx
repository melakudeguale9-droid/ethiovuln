'use client';

import React from 'react';
import Link from 'next/link';

interface VectorTier {
  tierNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  badgeBorder: string;
  badgeBg: string;
  description: string;
  targetScope: string;
  executionMode: string;
}

const SECURITY_TIERS: VectorTier[] = [
  {
    tierNumber: 'TIER 01',
    title: 'Passive Scan',
    subtitle: 'Non-Invasive Header Audits & Information Leakage',
    badge: 'Non-Invasive',
    accentColor: '#00E5FF',
    badgeBorder: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/10 text-cyan-400',
    description:
      'Evaluates application responses without sending aggressive attack vectors or altering server state. Conducts comprehensive audits of security headers including Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Frame-Options, secure cookie attributes (HttpOnly, Secure, SameSite), SSL/TLS cipher suite evaluations, and server version disclosures. Safe for immediate, zero-risk production auditing.',
    targetScope: 'Headers, TLS Config, Cookie Security, Sensitive Information Leakage',
    executionMode: 'Nuclei Template Engine (Non-Invasive Rules)',
  },
  {
    tierNumber: 'TIER 02',
    title: 'Active Scan',
    subtitle: 'Crawler Spidering & Dynamic Parameter Probing',
    badge: 'Dynamic Crawler',
    accentColor: '#6366F1',
    badgeBorder: 'border-indigo-500/30',
    badgeBg: 'bg-indigo-500/10 text-indigo-400',
    description:
      'Employs an intelligent web crawler that navigates links, forms, and client-side JavaScript routes to dynamically discover hidden application attack surfaces. Systematically analyzes user inputs, testing form submissions and URL parameters with benign probes to identify missing server-side sanitization, broken access controls, and runtime behavioral anomalies.',
    targetScope: 'DOM Navigation, Form Inputs, Session Handling, Dynamic Parameters',
    executionMode: 'OWASP ZAP Spider & Active Inspection Engine',
  },
  {
    tierNumber: 'TIER 03',
    title: 'Deep Recon',
    subtitle: 'Hidden Endpoints, Environment Files & Secret Leaks',
    badge: 'Heuristic Discovery',
    accentColor: '#10B981',
    badgeBorder: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/10 text-emerald-400',
    description:
      'Executes high-concurrency directory and file brute-forcing using an expansive dictionary of over 10,000 sensitive targets. Uncovers forgotten administration consoles, exposed .git repositories, leaky .env files, database backups (.sql, .dump), server diagnostic pages (phpinfo.php, server-status), and unreferenced staging routes that bypass standard perimeter defenses.',
    targetScope: '.env Files, .git Disclosures, Backup Archives, Admin Dashboards',
    executionMode: 'High-Speed Python/FastAPI Asynchronous Fuzzer',
  },
  {
    tierNumber: 'TIER 04',
    title: 'API Security',
    subtitle: 'RESTful, GraphQL & Microservice Validation',
    badge: 'API Top 10',
    accentColor: '#F59E0B',
    badgeBorder: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/10 text-amber-400',
    description:
      'Dedicated security analysis targeting modern web APIs against the OWASP API Security Top 10. Assesses endpoints for Broken Object Level Authorization (BOLA), mass assignment vulnerabilities, unauthenticated GraphQL introspection queries, missing rate limiting controls, and improper asset management across JSON/XML REST interfaces.',
    targetScope: 'REST Endpoints, GraphQL Introspection, BOLA Flaws, Rate Limiting',
    executionMode: 'Nuclei API Templates + ZAP API Probing Suites',
  },
  {
    tierNumber: 'TIER 05',
    title: 'Advanced Injection',
    subtitle: 'Critical Server-Side & Client-Side Exploit Proofs',
    badge: 'High Impact',
    accentColor: '#EC4899',
    badgeBorder: 'border-pink-500/30',
    badgeBg: 'bg-pink-500/10 text-pink-400',
    description:
      'Deep verification for high-severity input validation vulnerabilities. Systematically probes parameters for Cross-Site Scripting (XSS), SQL Injection (Boolean, Time-based, Error-based), Server-Side Template Injection (SSTI), OS Command Injection, and XML External Entity (XXE) attacks, generating non-destructive proof-of-concept evidence for development remediation.',
    targetScope: 'SQLi, XSS, SSTI, Remote Code Execution, XXE Injection',
    executionMode: 'Coordinated OWASP ZAP & Nuclei Active Payload Suites',
  },
  {
    tierNumber: 'TIER 06',
    title: 'Infrastructure Security',
    subtitle: 'Cloud Perimeters, DNS & CORS Configurations',
    badge: 'Cloud Perimeter',
    accentColor: '#8B5CF6',
    badgeBorder: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/10 text-purple-400',
    description:
      'Analyzes public-facing infrastructure for hazardous network and cloud misconfigurations. Inspects for wild-card Cross-Origin Resource Sharing (CORS) policies, open redirect chains, dangling DNS records susceptible to subdomain takeover, and exposed cloud storage buckets (AWS S3, Google Cloud Storage, Azure Blobs).',
    targetScope: 'CORS Misconfigs, Subdomain Takeovers, Open Redirects, Cloud Storage',
    executionMode: 'DNS Resolvers, Nuclei Cloud Checks & Custom Analyzers',
  },
  {
    tierNumber: 'TIER 07',
    title: 'Full Enterprise Scan',
    subtitle: 'Tri-Engine Coordinated Defense Assessment',
    badge: 'Flagship Pipeline',
    accentColor: '#EF4444',
    badgeBorder: 'border-red-500/30',
    badgeBg: 'bg-red-500/10 text-red-400',
    description:
      'The complete, defense-grade vulnerability assessment. Sequentially runs all three scanning engines—starting with pre-flight SSRF validation and Nuclei CVE template matching, continuing through OWASP ZAP active crawling and parameter injection, and completing with extensive directory fuzzing to compile an end-to-end audit report.',
    targetScope: 'Entire Web Application Perimeter, Logic, and Supporting Infrastructure',
    executionMode: 'Unified Nuclei + OWASP ZAP + Fuzzer Orchestration',
  },
  {
    tierNumber: 'TIER 08',
    title: 'Custom Configuration',
    subtitle: 'Targeted Engineering & Custom Scope Control',
    badge: 'Tailored Scope',
    accentColor: '#06B6D4',
    badgeBorder: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/10 text-cyan-400',
    description:
      'Gives DevSecOps engineers and security auditors total control over the assessment workflow. Enables selective check toggling across individual vulnerability modules, targeted CVE ID filters, customized HTTP request headers for authenticated scanning, adjustable thread concurrency limits, and custom request timeout thresholds.',
    targetScope: 'User-Defined Module Tree, Custom Authentication, Throttling Limits',
    executionMode: 'Dynamic Parameter Dispatcher via Celery Task Queue',
  },
];

export function SecurityVectorsSection() {
  return (
    <section id="vectors" className="py-20 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full border-t border-slate-800/80 font-sans">
      {/* Section Header */}
      <div className="text-center w-full max-w-full mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-base font-medium tracking-wide mb-6">
          <span>THE 8 ASSESSMENT TIERS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-normal leading-relaxed mb-6">
          Core Security Vectors
        </h2>
        <p className="text-gray-150 text-lg sm:text-xl font-normal leading-loose tracking-normal">
          From non-invasive telemetry audits to deep injection exploitation, explore the standardized
          vulnerability assessment tiers engineered into EthioVuln.
        </p>
      </div>

      {/* Grid of the 8 Security Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-full">
        {SECURITY_TIERS.map((tier) => {
          return (
            <div
              key={tier.tierNumber}
              className="p-8 sm:p-9 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.12)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Tier Badge & Code */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-base font-mono font-medium text-white px-3.5 py-1 rounded bg-[#111827] border border-slate-700 tracking-wide">
                    {tier.tierNumber}
                  </span>
                  <span
                    className={`text-base font-mono font-medium px-3.5 py-1 rounded border tracking-wide ${tier.badgeBorder} ${tier.badgeBg}`}
                  >
                    {tier.badge}
                  </span>
                </div>

                {/* Tier Title & Subtitle */}
                <h3 className="text-2xl font-semibold text-white mb-2 leading-relaxed tracking-normal">
                  {tier.title}
                </h3>
                <h4 className="text-base sm:text-lg font-medium text-cyan-400 mb-4 tracking-normal">
                  {tier.subtitle}
                </h4>

                {/* Full In-Depth Description */}
                <p className="text-gray-150 text-base sm:text-lg font-normal leading-loose tracking-normal mb-6">
                  {tier.description}
                </p>
              </div>

              {/* Metadata Badges */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-start gap-3 text-base">
                  <span className="font-mono font-medium text-cyan-400 shrink-0 tracking-normal">Scope:</span>
                  <span className="text-gray-150 font-normal leading-relaxed tracking-normal">{tier.targetScope}</span>
                </div>
                <div className="flex items-start gap-3 text-base">
                  <span className="font-mono font-medium text-cyan-400 shrink-0 tracking-normal">Engine:</span>
                  <span className="text-cyan-300 font-mono text-base font-normal tracking-wide">{tier.executionMode}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch CTA Strip */}
      <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-[#111827] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left w-full max-w-full">
        <div>
          <h4 className="text-xl sm:text-2xl font-semibold text-white mb-2 tracking-normal leading-relaxed">
            Ready to test your target against these 8 vectors?
          </h4>
          <p className="text-gray-150 text-base sm:text-lg font-normal leading-relaxed tracking-normal">
            Launch an instant vulnerability scan with pre-flight SSRF protection in under 60 seconds.
          </p>
        </div>
        <Link
          href="/dashboard/scans/new"
          className="px-8 py-4 rounded-xl font-medium text-base sm:text-lg bg-gradient-to-r from-cyan-400 to-sky-500 !text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:scale-105 transition-all duration-300 shrink-0 cursor-pointer tracking-normal"
        >
          Configure Assessment →
        </Link>
      </div>
    </section>
  );
}
