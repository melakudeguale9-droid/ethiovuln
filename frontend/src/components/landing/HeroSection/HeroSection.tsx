import React from 'react';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export interface HeroSectionProps {
  children?: React.ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.heroContainer}>
        {/* Platform Status Badge */}
        <div className={styles.statusBadge}>
          <span className={styles.pulseDot} />
          <span>Application Core Active</span>
          <span className={styles.divider}>|</span>
          <span className={styles.monoNote}>Worker Queues via Redis</span>
        </div>

        {/* Main Headline */}
        <h1 className={styles.headline}>
          <span className="text-gradient">Automated Dynamic</span>
          <br />
          <span className={styles.subheadline}>Application Security Testing</span>
        </h1>

        {/* Subtitle */}
        <p className={styles.description}>
          Orchestrate <strong className={styles.highlight}>Nuclei</strong> vulnerability templates,{' '}
          <strong className={styles.highlight}>OWASP ZAP</strong> active spidering, and custom web fuzzing from an
          enterprise-grade security dashboard with real-time telemetry.
        </p>

        {/* Action CTAs */}
        <div className={styles.ctaGroup}>
          <Link
            href="/register"
            className={`btn-glow btn-glow-cyan ${styles.primaryCta}`}
          >
            Start Security Assessment →
          </Link>
          <Link
            href="/about"
            className={`btn-outline ${styles.secondaryCta}`}
          >
            Platform Architecture & Bio
          </Link>
        </div>

        {/* Telemetry Metric Badges or children */}
        {children}
      </div>
    </section>
  );
}
