import React from 'react';
import Link from 'next/link';
import styles from './DashboardHeader.module.css';

export function DashboardHeader() {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.badgeRow}>
          <span className={styles.pulseDot} />
          <span className={styles.badgeText}>Security Operations Center</span>
        </div>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <p className={styles.subtitle}>
          Real-time assessment telemetry and vulnerability tracking across all targets
        </p>
      </div>

      <div className={styles.actions}>
        <Link href="/dashboard/scans/new" className={styles.launchBtn}>
          ＋ Launch Scan
        </Link>
        <Link href="/dashboard/reports" className={styles.reportsBtn}>
          ◧ View Reports
        </Link>
      </div>
    </div>
  );
}
