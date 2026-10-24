// EthioVuln — Root Layout

import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './ethiovuln-light-theme.css';
import './ethiovuln-dark-theme.css';
import { ThemeProvider } from '@/hooks/useTheme';
import { PublicAiWidget } from '@/components/ai';


export const metadata: Metadata = {
  title: {
    default: 'EthioVuln — Automated Web Vulnerability Assessment Platform',
    template: '%s | EthioVuln',
  },
  description: 'EthioVuln is an automated web vulnerability assessment platform integrating Nuclei, OWASP ZAP, and custom fuzzing engines with real-time telemetry and PDF reporting.',
  keywords: ['EthioVuln', 'DAST', 'vulnerability scanner', 'penetration testing', 'Nuclei', 'OWASP ZAP', 'security testing', 'Ethiopia', 'web security'],
  authors: [{ name: 'Melaku Deguale', url: 'https://github.com/melakudeguale9-droid' }],
  creator: 'Melaku Deguale',
  metadataBase: new URL('http://localhost:3000'),

  // ── Open Graph (Facebook, LinkedIn, Telegram previews) ──────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    siteName: 'EthioVuln',
    title: 'EthioVuln — Automated Web Vulnerability Assessment',
    description: 'Discover, analyze, and secure web applications with Nuclei, OWASP ZAP, and custom fuzzing engines from a single dashboard.',
    images: [
      {
        url: '/shield-icon.png',
        width: 512,
        height: 512,
        alt: 'EthioVuln Shield Logo',
      },
    ],
  },

  // ── Twitter / X Card ────────────────────────────────────────────────────
  twitter: {
    card: 'summary',
    title: 'EthioVuln — Automated Web Vulnerability Assessment',
    description: 'Discover, analyze, and secure web applications with Nuclei, OWASP ZAP, and custom fuzzing engines.',
    images: ['/shield-icon.png'],
    creator: '@melakudeguale',
  },

  // ── Favicon ──────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/shield-icon.png', type: 'image/png' },
    ],
    apple: '/shield-icon.png',
    shortcut: '/shield-icon.png',
  },

  // ── Robots ───────────────────────────────────────────────────────────────
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans overflow-x-hidden w-full max-w-full" suppressHydrationWarning>
      <body className="bg-[#090D16] text-slate-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden w-full max-w-[100vw] min-w-0" suppressHydrationWarning>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var STORAGE_KEY = 'ethiovuln-theme';
                  var saved = localStorage.getItem(STORAGE_KEY);
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = (saved === 'dark' || saved === 'light') ? saved : (systemDark ? 'dark' : 'light');
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme;
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script src="/theme-toggle.js" strategy="afterInteractive" />
        <ThemeProvider>
          <div className="animated-bg" />
          <div className="relative z-[1] w-full max-w-full overflow-x-hidden min-w-0">
            {children}
          </div>
          <PublicAiWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
