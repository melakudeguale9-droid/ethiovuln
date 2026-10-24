import React from 'react';
import Link from 'next/link';
import styles from './DashboardHeader.module.css';

export function DashboardHeader() {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.badgeRow}>
          <span className={styles.pulseDot} />
          <span className={styles.badgeText}>Live Telemetry</span>
        </div>
        <h1 className={styles.title}>Security Overview</h1>
        <p className={styles.subtitle}>
          Real-time vulnerability telemetry across target domains
        </p>
      </div>

      <div className={styles.actions}>
        <Link href="/dashboard/scans/new" className={styles.launchBtn}>
          ＋ Launch Scan
        </Link>
        <Link href="/dashboard/reports" className={styles.reportsBtn}>
          ◧ Reports
        </Link>
      </div>
    </div>
  );
}
