// EthioVuln — Root Layout

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Enterprise Security Suite — Cyber Security Scanner Web Application',
    template: '%s | Enterprise Security Suite',
  },
  description: 'Enterprise Security Suite (EthioVuln) is an automated web vulnerability assessment platform integrating Nuclei, OWASP ZAP, and custom fuzzing engines with real-time telemetry and PDF reporting.',
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

import { SpotlightBackground } from '@/components/ui/SpotlightBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <div className="animated-bg" />
        <SpotlightBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
