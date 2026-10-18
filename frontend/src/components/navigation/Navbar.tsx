'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ─── Inline Self-Contained SVG Icons ──────────────────────────────────────── */
function MegaphoneIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MenuIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* ─── Navigation Dropdown Data ──────────────────────────────────────────────── */
interface NavDropdownItem {
  title: string;
  desc: string;
  href: string;
  badge?: string;
}

interface NavSection {
  label: string;
  hasDropdown: boolean;
  href?: string;
  items?: NavDropdownItem[];
}

const NAV_MENU: NavSection[] = [
  {
    label: 'Product',
    hasDropdown: true,
    items: [
      {
        title: 'Website Vulnerability Scanner',
        desc: 'Comprehensive DAST for SQLi, XSS, SSRF & CVEs',
        href: '/dashboard/scans/new?mode=deep',
        badge: 'Core',
      },
      {
        title: 'Nuclei Template Engine',
        desc: '8,000+ community verified YAML vulnerability rules',
        href: '/dashboard/scans/new?engine=nuclei',
      },
      {
        title: 'OWASP ZAP Dynamic Spider',
        desc: 'Active crawler injection & deep session token analysis',
        href: '/dashboard/scans/new?engine=zap',
      },
      {
        title: 'Smart Discovery Fuzzer',
        desc: 'Sensitive endpoint, .env, and hidden file probing',
        href: '/dashboard/scans/new?engine=fuzzer',
      },
    ],
  },
  {
    label: 'Solutions',
    hasDropdown: true,
    items: [
      {
        title: 'DevSecOps & CI/CD Pipelines',
        desc: 'Automated headless scans for GitHub Actions & GitLab',
        href: '/dashboard/scans/new?mode=cli',
      },
      {
        title: 'SOC 2 & Compliance Auditing',
        desc: 'Evidence collection and automated security sign-offs',
        href: '/about',
        badge: 'Popular',
      },
      {
        title: 'Attack Surface Management',
        desc: 'Continuous perimeter monitoring and asset discovery',
        href: '/dashboard',
      },
    ],
  },
  {
    label: 'Pricing',
    hasDropdown: false,
    href: '/#pricing',
  },
  {
    label: 'Services',
    hasDropdown: true,
    items: [
      {
        title: 'Automated DAST Assessment',
        desc: 'Instant cloud scanning with zero manual setup',
        href: '/dashboard/scans/new',
      },
      {
        title: 'Executive PDF Reporting',
        desc: 'One-click compliance and remediation export',
        href: '/about',
      },
      {
        title: 'CVSS v3.1 Scoring Engine',
        desc: 'Standardized MITRE CWE severity scoring',
        href: '/about',
      },
    ],
  },
  {
    label: 'Company',
    hasDropdown: true,
    items: [
      {
        title: 'About EthioVuln',
        desc: 'Our mission and security engineering standards',
        href: '/about',
      },
      {
        title: 'Architecture & Pipeline',
        desc: 'Distributed scan orchestration and async worker nodes',
        href: '/about#architecture',
      },
      {
        title: 'Contact Security Team',
        desc: 'Responsible disclosure and operational support',
        href: 'mailto:security@ethiovuln.io',
      },
    ],
  },
  {
    label: 'Resources',
    hasDropdown: true,
    items: [
      {
        title: 'Vulnerability Taxonomy',
        desc: '8 core assessment vectors and check catalogs',
        href: '/#features',
      },
      {
        title: 'CLI Scanner Documentation',
        desc: 'Install curl script, Docker images, and flags',
        href: '/about',
      },
      {
        title: 'OWASP Top 10 Mapping',
        desc: 'Coverage matrix for top web vulnerabilities',
        href: '/about',
      },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full sticky top-0 z-50">
      
      {/* ─── Top Notification Banner (Exact Pentest-Tools Vibrant Orange) ──── */}
      <div className="bg-[#EE6C19] text-[#0C1019] px-4 sm:px-6 lg:px-10 xl:px-12 py-2.5 text-xs sm:text-[13px] font-medium border-b border-[#D85C0E] transition-all">
        <div className="w-full max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="p-1 rounded bg-black/10 inline-flex items-center justify-center shrink-0">
              <MegaphoneIcon className="w-3.5 h-3.5 text-[#0C1019]" />
            </span>
            <span className="font-semibold text-[#0C1019]">
              EthioVuln DAST Suite: Multi-tier vulnerability scanning across OWASP Top 10, CVE database, and API security vectors.
            </span>
          </div>

          <Link
            href="/dashboard/scans/new"
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md bg-black/15 hover:bg-black/25 text-[#0C1019] font-bold text-xs transition-colors border border-black/10 shadow-sm"
          >
            Start Free Assessment
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ─── Main Navbar (Pentest-Tools Dark Sleek Navigation) ─────────────── */}
      <header className="bg-[#0D121D]/95 backdrop-blur-md border-b border-[#1A2234] text-white px-4 sm:px-6 lg:px-10 xl:px-12 py-3">
        <div className="w-full max-w-[1560px] mx-auto flex items-center justify-between">
          
          {/* Left Brand Logo (Matching Screenshot) */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {/* Pentest-Tools Style Angled Dual-Tone Shield */}
            <div className="w-9 h-9 relative flex items-center justify-center transition-transform group-hover:scale-105">
              <svg className="w-9 h-9 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]" viewBox="0 0 36 36" fill="none">
                <path d="M18 3L4 9V17C4 25.5 10 32.5 18 34.5C26 32.5 32 25.5 32 17V9L18 3Z" fill="#111827" stroke="#1E293B" strokeWidth="2" />
                <path d="M18 4L5 9.5V17C5 24.8 10.6 31.4 18 33.3V4Z" fill="#0284C7" />
                <path d="M18 4L31 9.5V17C31 24.8 25.4 31.4 18 33.3V4Z" fill="#F8FAFC" />
                <path d="M18 9L11 13V17C11 21.5 14 25.5 18 27V9Z" fill="#00F0FF" />
                <circle cx="23" cy="18" r="2" fill="#E11D48" />
              </svg>
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                Ethio<span className="text-cyan-400">Vuln</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Pentest Suite
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_MENU.map((menu) => {
              const isDropdownOpen = activeDropdown === menu.label;

              if (!menu.hasDropdown) {
                return (
                  <Link
                    key={menu.label}
                    href={menu.href || '#'}
                    className="px-3 py-2 rounded-lg text-[14px] font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-colors"
                  >
                    {menu.label}
                  </Link>
                );
              }

              return (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(menu.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-lg text-[14px] font-medium flex items-center gap-1.5 transition-colors ${
                      isDropdownOpen
                        ? 'text-white bg-slate-800/60'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <span>{menu.label}</span>
                    <ChevronDownIcon
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Flyout */}
                  {isDropdownOpen && menu.items && (
                    <div className="absolute top-full left-0 mt-1 w-80 bg-[#101726] border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="space-y-1">
                        {menu.items.map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block p-2.5 rounded-lg hover:bg-slate-800/70 transition-colors group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">
                              {item.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Items (Book a demo, Log in, Start free trial) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Book a demo Link */}
            <Link
              href="/about#contact"
              className="px-3 py-2 text-[14px] font-medium text-slate-300 hover:text-white transition-colors"
            >
              Book a demo
            </Link>

            {/* Log in Button */}
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-[14px] font-medium text-slate-200 bg-[#1A2234] hover:bg-[#242F47] border border-[#2D3952] transition-colors"
            >
              Log in
            </Link>

            {/* Start free trial Button (Vivid Golden Amber from Screenshot 1) */}
            <Link
              href="/dashboard/scans/new"
              className="px-4 py-2 rounded-lg text-[14px] font-bold text-[#0C1019] bg-[#F5A623] hover:bg-[#E09419] shadow-md shadow-orange-500/20 transition-all transform hover:scale-[1.02]"
            >
              Start free trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

        </div>

        {/* ─── Mobile Drawer Menu ─────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-3 pb-4">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
              <Link
                href="/login"
                className="w-full py-2.5 text-center rounded-lg text-sm font-medium bg-[#1A2234] border border-[#2D3952] text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/dashboard/scans/new"
                className="w-full py-2.5 text-center rounded-lg text-sm font-bold text-slate-950 bg-[#F5A623]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start free trial
              </Link>
            </div>

            <div className="space-y-1">
              {NAV_MENU.map((item) => (
                <div key={item.label} className="py-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-2 mb-1">
                    {item.label}
                  </span>
                  {item.items ? (
                    item.items.map((sub, j) => (
                      <Link
                        key={j}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-1.5 text-sm text-slate-300 hover:text-cyan-400"
                      >
                        {sub.title}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href={item.href || '#'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-1.5 text-sm text-slate-300 hover:text-cyan-400"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
