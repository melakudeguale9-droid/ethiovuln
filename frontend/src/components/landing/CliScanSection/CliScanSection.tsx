'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ─── Self-Contained SVG Icons ─────────────────────────────────────────────── */
function DownloadIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CopyIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Terminal Window Box with Line Numbers & Copy Button ──────────────────── */
interface CodeTerminalProps {
  lines: { num: number; content: React.ReactNode; rawText: string }[];
  headerRight?: React.ReactNode;
}

export function CodeTerminal({ lines, headerRight }: CodeTerminalProps) {
  const [copied, setCopied] = useState(false);

  const fullText = lines.map((l) => l.rawText).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl bg-[#090D16] border border-slate-800/80 overflow-hidden shadow-lg group">
      
      {/* Terminal Title Bar */}
      <div className="px-4 py-2.5 bg-[#0C111D] border-b border-slate-800/60 flex items-center justify-between">
        {/* macOS Traffic Lights */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        </div>

        {headerRight && <div>{headerRight}</div>}
      </div>

      {/* Code Area */}
      <div className="p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto scrollbar-none text-slate-300">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line) => (
              <tr key={line.num} className="hover:bg-slate-900/40">
                <td className="w-6 pr-4 text-right text-slate-600 select-none align-top font-mono text-[11px] sm:text-xs">
                  {line.num}
                </td>
                <td className="whitespace-pre align-top font-mono">
                  {line.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Copy Button (Pinned to Bottom-Right) */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code block"
        className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-sans font-medium border border-slate-700 flex items-center gap-1.5 transition-all shadow-md"
      >
        {copied ? (
          <>
            <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Copied</span>
          </>
        ) : (
          <>
            <CopyIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy</span>
          </>
        )}
      </button>

    </div>
  );
}

/**
 * CliTerminalCard
 * Reusable Right-Column Card for CLI installation instructions and usage examples.
 */
export function CliTerminalCard() {
  const [activeOs, setActiveOs] = useState<'linux' | 'macos' | 'windows'>('linux');
  const [activePkg, setActivePkg] = useState<'docker' | 'pip'>('docker');

  const getInstallLines = () => {
    switch (activeOs) {
      case 'linux':
        return [
          {
            num: 1,
            rawText: 'curl -s https://ethiovuln.com/cli-scan/linux/ev.zip -o /tmp/ev.zip',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">curl</span>{' '}
                <span className="text-slate-400">-s</span>{' '}
                <span className="text-amber-200">https://ethiovuln.com/cli-scan/linux/ev.zip</span>{' '}
                <span className="text-slate-400">-o</span>{' '}
                <span className="text-amber-200">/tmp/ev.zip</span>
              </>
            ),
          },
          {
            num: 2,
            rawText: 'unzip /tmp/ev.zip -d /tmp/ev',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">unzip</span>{' '}
                <span className="text-amber-200">/tmp/ev.zip</span>{' '}
                <span className="text-slate-400">-d</span>{' '}
                <span className="text-amber-200">/tmp/ev</span>
              </>
            ),
          },
          {
            num: 3,
            rawText: 'chmod +x /tmp/ev/main',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">chmod</span>{' '}
                <span className="text-slate-400">+x</span>{' '}
                <span className="text-amber-200">/tmp/ev/main</span>
              </>
            ),
          },
          {
            num: 4,
            rawText: 'sudo mv /tmp/ev/main /usr/local/bin/ev',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">sudo mv</span>{' '}
                <span className="text-amber-200">/tmp/ev/main</span>{' '}
                <span className="text-amber-200">/usr/local/bin/ev</span>
              </>
            ),
          },
        ];

      case 'macos':
        return [
          {
            num: 1,
            rawText: 'curl -s https://ethiovuln.com/cli-scan/macos/ev.zip -o /tmp/ev.zip',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">curl</span>{' '}
                <span className="text-slate-400">-s</span>{' '}
                <span className="text-amber-200">https://ethiovuln.com/cli-scan/macos/ev.zip</span>{' '}
                <span className="text-slate-400">-o</span>{' '}
                <span className="text-amber-200">/tmp/ev.zip</span>
              </>
            ),
          },
          {
            num: 2,
            rawText: 'unzip /tmp/ev.zip -d /tmp/ev',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">unzip</span>{' '}
                <span className="text-amber-200">/tmp/ev.zip</span>{' '}
                <span className="text-slate-400">-d</span>{' '}
                <span className="text-amber-200">/tmp/ev</span>
              </>
            ),
          },
          {
            num: 3,
            rawText: 'chmod +x /tmp/ev/main',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">chmod</span>{' '}
                <span className="text-slate-400">+x</span>{' '}
                <span className="text-amber-200">/tmp/ev/main</span>
              </>
            ),
          },
          {
            num: 4,
            rawText: 'sudo mv /tmp/ev/main /usr/local/bin/ev',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">sudo mv</span>{' '}
                <span className="text-amber-200">/tmp/ev/main</span>{' '}
                <span className="text-amber-200">/usr/local/bin/ev</span>
              </>
            ),
          },
        ];

      case 'windows':
        return [
          {
            num: 1,
            rawText: 'curl.exe -s https://ethiovuln.com/cli-scan/windows/ev.zip -o %TEMP%\\ev.zip',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">curl.exe</span>{' '}
                <span className="text-slate-400">-s</span>{' '}
                <span className="text-amber-200">https://ethiovuln.com/cli-scan/windows/ev.zip</span>{' '}
                <span className="text-slate-400">-o</span>{' '}
                <span className="text-amber-200">%TEMP%\ev.zip</span>
              </>
            ),
          },
          {
            num: 2,
            rawText: 'tar -xf %TEMP%\\ev.zip -C %LOCALAPPDATA%\\EthioVuln',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">tar</span>{' '}
                <span className="text-slate-400">-xf</span>{' '}
                <span className="text-amber-200">%TEMP%\ev.zip</span>{' '}
                <span className="text-slate-400">-C</span>{' '}
                <span className="text-amber-200">%LOCALAPPDATA%\EthioVuln</span>
              </>
            ),
          },
          {
            num: 3,
            rawText: 'setx PATH "%PATH%;%LOCALAPPDATA%\\EthioVuln"',
            content: (
              <>
                <span className="text-emerald-400 font-semibold">setx</span>{' '}
                <span className="text-slate-300">PATH</span>{' '}
                <span className="text-amber-200">&quot;%PATH%;%LOCALAPPDATA%\EthioVuln&quot;</span>
              </>
            ),
          },
        ];
    }
  };

  const getPkgLines = () => {
    if (activePkg === 'docker') {
      return [
        {
          num: 1,
          rawText: 'docker run --rm -it ethiovuln/ev-scan:latest run website_scanner https://ethiovuln-demo.internal:81/',
          content: (
            <>
              <span className="text-emerald-400 font-semibold">docker</span>{' '}
              <span className="text-slate-300">run</span>{' '}
              <span className="text-slate-400">--rm -it</span>{' '}
              <span className="text-rose-300">ethiovuln/ev-scan:latest</span>{' '}
              <span className="text-slate-300">run</span>{' '}
              <span className="text-slate-300">website_scanner</span>{' '}
              <span className="text-amber-200">https://ethiovuln-demo.internal:81/</span>
            </>
          ),
        },
      ];
    }
    return [
      {
        num: 1,
        rawText: 'pip install ethiovuln-scan && ev-scan run website_scanner https://ethiovuln-demo.internal:81/',
        content: (
          <>
            <span className="text-emerald-400 font-semibold">pip</span>{' '}
            <span className="text-slate-300">install</span>{' '}
            <span className="text-rose-300">ethiovuln-scan</span>{' '}
            <span className="text-slate-500">&amp;&amp;</span>{' '}
            <span className="text-emerald-400 font-semibold">ev-scan</span>{' '}
            <span className="text-slate-300">run</span>{' '}
            <span className="text-slate-300">website_scanner</span>{' '}
            <span className="text-amber-200">https://ethiovuln-demo.internal:81/</span>
          </>
        ),
      },
    ];
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
      {/* Tab Selector: Linux / macOS / Windows */}
      <div className="bg-[#090D16] p-2 rounded-2xl border border-slate-800 grid grid-cols-3 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveOs('linux')}
          className={`py-3 px-4 rounded-xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
            activeOs === 'linux'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Linux instructions
        </button>
        <button
          type="button"
          onClick={() => setActiveOs('macos')}
          className={`py-3 px-4 rounded-xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
            activeOs === 'macos'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          macOS instructions
        </button>
        <button
          type="button"
          onClick={() => setActiveOs('windows')}
          className={`py-3 px-4 rounded-xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
            activeOs === 'windows'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Windows instructions
        </button>
      </div>

      {/* 1. Installation */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-100">
          1. Installation
        </h3>

        <CodeTerminal lines={getInstallLines()} />

        {/* Docker / Pip Alternative Sub-Terminal */}
        <div className="pt-2 space-y-2.5">
          <p className="text-base text-slate-300">
            If you have docker or pip installed, you can use them to get ev-scan:
          </p>

          <CodeTerminal
            lines={getPkgLines()}
            headerRight={
              <div className="flex items-center gap-1.5 bg-[#080C14] p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActivePkg('docker')}
                  className={`px-3 py-1 rounded text-base font-mono font-bold transition-colors cursor-pointer ${
                    activePkg === 'docker'
                      ? 'bg-[#1C2333] text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  docker
                </button>
                <button
                  type="button"
                  onClick={() => setActivePkg('pip')}
                  className={`px-3 py-1 rounded text-base font-mono font-bold transition-colors cursor-pointer ${
                    activePkg === 'pip'
                      ? 'bg-[#1C2333] text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  pip
                </button>
              </div>
            }
          />
        </div>
      </div>

      {/* 2. Usage */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base sm:text-lg font-bold text-slate-100">
          2. Usage
        </h3>

        <p className="text-base text-slate-300">
          Quickstart: Run the following command in your terminal/command line to find the vulnerabilities of your website.
        </p>

        <CodeTerminal
          lines={[
            {
              num: 1,
              rawText: 'ev run website_scanner <target_url>',
              content: (
                <>
                  <span className="text-emerald-400 font-semibold">ev</span>{' '}
                  <span className="text-slate-300">run</span>{' '}
                  <span className="text-slate-300">website_scanner</span>{' '}
                  <span className="text-rose-300">&lt;target_url&gt;</span>
                </>
              ),
            },
          ]}
        />

        <p className="text-base text-slate-300 pt-1">
          You can learn more options with the -h flag:
        </p>

        <CodeTerminal
          lines={[
            {
              num: 1,
              rawText: 'ev -h',
              content: (
                <>
                  <span className="text-emerald-400 font-semibold">ev</span>{' '}
                  <span className="text-slate-400">-h</span>
                </>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

interface CliScanSectionProps {
  onOpenComparisonModal?: () => void;
}

export function CliScanSection({ onOpenComparisonModal }: CliScanSectionProps) {
  return (
    <section id="cli-scan" className="relative bg-[#090D16] py-16 sm:py-24 border-t border-slate-800">
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="flex items-start gap-6 lg:gap-10">
          
          {/* Vertical 10-Step Progress Rail (Dash 8 Active matching Screenshot) */}
          <div className="hidden sm:flex flex-col items-center gap-2.5 pt-4 select-none shrink-0" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className={`transition-all duration-300 rounded-full ${
                  i === 7
                    ? 'w-1.5 h-7 bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.7)]'
                    : 'w-1 h-3.5 bg-slate-700/60'
                }`}
              />
            ))}
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
            
            {/* Left Column: Headline, Description & Download CTAs */}
            <div className="lg:col-span-5 space-y-6 pt-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-normal leading-relaxed">
                Use this tool from your command line interface
              </h2>

              <p className="text-gray-150 text-base sm:text-lg leading-relaxed tracking-normal">
                If you prefer it, we also provide a CLI version of our Website Vulnerability Scanner. Through the EthioVuln CLI, you can run{' '}
                <button
                  type="button"
                  onClick={onOpenComparisonModal}
                  className="text-cyan-400 underline underline-offset-4 decoration-cyan-500/50 hover:text-cyan-300 hover:decoration-cyan-400 transition-colors font-bold cursor-pointer"
                >
                  Light scans
                </button>{' '}
                against your web apps and start gathering insights for your next move.
              </p>

              {/* Platform Download Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="/downloads/ethiovuln-cli-linux.tar.gz"
                  download
                  className="px-6 py-3 rounded-xl bg-[#141923] border border-slate-700/80 hover:border-slate-500 hover:bg-[#1C2333] text-slate-200 font-bold text-base transition-all inline-flex items-center gap-2.5 shadow-sm cursor-pointer"
                >
                  <DownloadIcon className="w-5 h-5 text-slate-400" />
                  <span>Linux</span>
                </a>

                <a
                  href="/downloads/ethiovuln-cli-darwin.tar.gz"
                  download
                  className="px-6 py-3 rounded-xl bg-[#141923] border border-slate-700/80 hover:border-slate-500 hover:bg-[#1C2333] text-slate-200 font-bold text-base transition-all inline-flex items-center gap-2.5 shadow-sm cursor-pointer"
                >
                  <DownloadIcon className="w-5 h-5 text-slate-400" />
                  <span>macOS</span>
                </a>
              </div>
            </div>

            {/* Right Column: Reusable Technical Terminal Instructions Card */}
            <div className="lg:col-span-7">
              <CliTerminalCard />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
