import React from 'react';
import Link from 'next/link';
import styles from './CtaSection.module.css';

export function CtaSection() {
  return (
    <section className={styles.section}>
      <div className={`glass-card ${styles.panel}`}>
        <h2 className={styles.title}>Empower Your Security Posture</h2>
        <p className={styles.subtitle}>
          Deploy comprehensive, multi-engine vulnerability assessments on authorized targets in seconds.
        </p>
        <div className={styles.buttonGroup}>
          <Link
            href="/register"
            className={`btn-glow btn-glow-cyan ${styles.primaryBtn}`}
          >
            Create Free Account →
          </Link>
          <Link
            href="/login"
            className={`btn-outline ${styles.secondaryBtn}`}
          >
            Sign In to Console
          </Link>
        </div>
      </div>
    </section>
  );
}
