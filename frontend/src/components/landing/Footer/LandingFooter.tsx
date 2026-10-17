import React from 'react';
import Link from 'next/link';
import { SOCIAL_LINKS, APP_TAGLINE } from '@/lib/constants';
import styles from './LandingFooter.module.css';

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <div className={styles.brandRow}>
            <div className={styles.logoIcon}>E</div>
            <span className={styles.brandName}>
              Ethio<span className={styles.brandHighlight}>Vuln</span>
            </span>
          </div>
          <p className={styles.tagline}>
            {APP_TAGLINE}. Enterprise-grade dynamic vulnerability testing engineered for security professionals and development teams.
          </p>
          <div className={styles.author}>
            Built by <strong className={styles.authorHighlight}>Melaku Deguale</strong>
          </div>
        </div>

        {/* Quick Links Group */}
        <div className={styles.linksGroup}>
          <div>
            <div className={styles.colTitle}>Platform</div>
            <div className={styles.linksList}>
              <Link href="/dashboard/scans/new" className={styles.link}>
                Launch Scan
              </Link>
              <Link href="/dashboard/reports" className={styles.link}>
                Vulnerability Reports
              </Link>
              <Link href="/about" className={styles.link}>
                Architecture & Docs
              </Link>
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <div className={styles.colTitle}>Connect</div>
            <div className={styles.linksList}>
              <a
                href={SOCIAL_LINKS.github.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                GitHub Repository
              </a>
              <a
                href={SOCIAL_LINKS.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Telegram Channel
              </a>
              <a
                href={SOCIAL_LINKS.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.copyright}>
          © 2026 EthioVuln. Built for authorized security testing and defensive research.
        </div>
        <div className={styles.versionTag}>v1.0.0 · Core Active</div>
      </div>
    </footer>
  );
}
