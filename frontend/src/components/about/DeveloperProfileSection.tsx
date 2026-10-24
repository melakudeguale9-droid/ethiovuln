'use client';

import React from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';

interface ExpertiseArea {
  title: string;
  tag: string;
  description: string;
  skills: string[];
}

const EXPERTISE_AREAS: ExpertiseArea[] = [
  {
    title: 'Offensive Security & Exploit Research',
    tag: 'Offensive Operations',
    description:
      'Deep vulnerability research and active exploitation verification across the OWASP Top 10 and WASC threat categories. Specializes in SQL Injection, Cross-Site Scripting, SSRF mitigation, and broken access controls.',
    skills: ['OWASP Top 10 Verification', 'PoC Exploit Development', 'SSRF Neutralization', 'Black-Box DAST Probing'],
  },
  {
    title: 'Backend Systems & Security Automation',
    tag: 'Python & Distributed Systems',
    description:
      'Architecting resilient, high-concurrency backend services and automated assessment engines using Python, FastAPI, and asynchronous task queues. Engineered the core distributed pipeline of EthioVuln.',
    skills: ['FastAPI & Asyncio', 'Celery & Redis Worker Queues', 'PostgreSQL & Asyncpg', 'Dynamic Payload Fuzzing'],
  },
  {
    title: 'Security Telemetry & CVSS Visualization',
    tag: 'Telemetry & UI Systems',
    description:
      'Designing high-contrast cyber telemetry consoles, real-time WebSocket scan monitors, interactive module wizards, and dynamic CVSS v3.1 severity distribution dashboards.',
    skills: ['Real-Time Scan Telemetry', 'CVSS v3.1 Scoring Matrix', 'Interactive Module Wizard', 'WebSocket Event Streaming'],
  },
  {
    title: 'INSA Cyber Talent & Specialized Training',
    tag: 'Accredited Training',
    description:
      'Participant in advanced national cybersecurity talent training programs at the INSA Cyber Talent Center (Information Network Security Administration) alongside intensive offensive security bootcamps.',
    skills: ['INSA Cyber Talent Center', 'Hands-On CTF Probing', 'Security Policy & Ethics', 'Infrastructure Auditing'],
  },
];

export function DeveloperProfileSection() {
  return (
    <section id="developer" className="py-20 px-4 sm:px-8 lg:px-14 xl:px-20 w-full max-w-full border-t border-slate-800/80 font-sans">
      {/* Section Header */}
      <div className="text-center w-full max-w-full mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-base font-medium tracking-wide mb-6">
          <span>RESEARCH &amp; LEADERSHIP</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-normal leading-relaxed mb-6">
          Cyber Security Student &amp; Research Profile
        </h2>
        <p className="text-gray-100 text-lg sm:text-xl font-normal leading-loose tracking-normal">
          Behind the engineering and security research of the EthioVuln platform.
        </p>
      </div>

      {/* Profile Master Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] border border-cyan-500/30 shadow-[0_0_35px_rgba(0,240,255,0.12)] transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_45px_rgba(0,240,255,0.2)] mb-16 w-full max-w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-10">
          {/* Avatar / Photo with Pulsing Status */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(0,240,255,0.4)] border-2 border-cyan-400/70 ring-4 ring-cyan-500/20 bg-[#0A1020] group">
              <img
                src="/images/melaku-profile.jpg?v=2"
                alt="Melaku Deguale — Cyber Security Student & Security Researcher"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-3.5 py-1 rounded-full bg-slate-950 border border-emerald-500/50 flex items-center gap-2 shadow-lg z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono text-base font-medium tracking-wide">ONLINE</span>
            </div>
          </div>

          {/* Core Info & Bio */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-5">
              <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-base font-medium tracking-wide">
                Cyber Security Student
              </span>
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-base font-medium tracking-wide">
                INSA Cyber Talent Center Participant
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-base font-medium tracking-wide">
                Security Researcher
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-normal leading-relaxed mb-2">
              Melaku Deguale
            </h3>
            <p className="text-lg sm:text-xl font-medium text-cyan-400 tracking-normal mb-6">
              Cyber Security Student &amp; Security Researcher
            </p>

            <p className="text-gray-150 text-lg sm:text-xl font-normal leading-loose tracking-normal mb-8">
              Melaku Deguale is a passionate Cyber Security Student and Security Researcher
              specializing in dynamic application security testing (DAST), automated vulnerability
              discovery, and threat mitigation. Having participated in advanced national cybersecurity
              training programs through the{' '}
              <strong className="text-cyan-300 font-medium">INSA Cyber Talent Center</strong>{' '}
              (Information Network Security Administration) alongside intensive offensive security
              bootcamps, Melaku bridges the critical divide between offensive security testing and
              robust defensive engineering. As the lead researcher and creator of EthioVuln, he engineered
              the tri-engine orchestration pipeline using Python, FastAPI, Next.js, and TypeScript to
              empower organizations with automated, high-fidelity security intelligence.
            </p>

            {/* Social & Connect Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href={SOCIAL_LINKS.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-[#111827] border border-cyan-500/30 hover:border-cyan-400 text-base sm:text-lg font-medium text-white shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center gap-2 cursor-pointer tracking-normal"
              >
                <span>Telegram: @melakucyber</span>
                <span className="text-cyan-400">↗</span>
              </a>

              <a
                href={SOCIAL_LINKS.github.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-[#111827] border border-slate-700 hover:border-cyan-400 text-base sm:text-lg font-medium text-white transition-all duration-300 flex items-center gap-2 cursor-pointer tracking-normal"
              >
                <span>GitHub Repository</span>
                <span className="text-cyan-400">↗</span>
              </a>

              <a
                href={SOCIAL_LINKS.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-[#111827] border border-slate-700 hover:border-cyan-400 text-base sm:text-lg font-medium text-white transition-all duration-300 flex items-center gap-2 cursor-pointer tracking-normal"
              >
                <span>LinkedIn Profile</span>
                <span className="text-cyan-400">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Technical Pillars of Expertise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-full">
        {EXPERTISE_AREAS.map((area, idx) => (
          <div
            key={idx}
            className="p-8 sm:p-9 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="inline-block px-3.5 py-1.5 rounded bg-slate-900 border border-slate-800 font-mono text-base font-medium text-cyan-400 tracking-wide mb-4">
                {area.tag}
              </div>
              <h4 className="text-xl sm:text-2xl font-semibold text-white tracking-normal leading-relaxed mb-3">
                {area.title}
              </h4>
              <p className="text-gray-150 text-base sm:text-lg font-normal leading-loose tracking-normal mb-6">
                {area.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-3">
              {area.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-4 py-1.5 rounded-md bg-[#111827] border border-slate-800 text-base font-normal text-gray-150 tracking-normal"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
