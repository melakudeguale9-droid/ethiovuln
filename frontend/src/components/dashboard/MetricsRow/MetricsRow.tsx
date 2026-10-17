import React from 'react';
import styles from './MetricsRow.module.css';

export interface MetricsRowProps {
  loading: boolean;
  totalScans: number;
  activeScans: number;
  totalVulns: number;
  criticalHighCount: number;
  uniqueTargets: number;
}

export function MetricsRow({
  loading,
  totalScans,
  activeScans,
  totalVulns,
  criticalHighCount,
  uniqueTargets,
}: MetricsRowProps) {
  return (
    <div className={styles.grid}>
      {/* Total Scans Card */}
      <div className={styles.card}>
        <div className={styles.label}>Total Scans</div>
        <div className={styles.value}>{loading ? '—' : totalScans}</div>
        <div className={styles.subtext}>
          {activeScans > 0 ? (
            <>
              <span className={styles.pulseGreen} /> {activeScans} active assessments
            </>
          ) : (
            'All scans completed'
          )}
        </div>
      </div>

      {/* Vulnerabilities Found Card */}
      <div className={styles.card}>
        <div className={styles.label}>Vulnerabilities Found</div>
        <div className={styles.value}>{loading ? '—' : totalVulns}</div>
        <div className={styles.subtext}>Aggregate security issues</div>
      </div>

      {/* Critical & High Risks Card */}
      <div className={`${styles.card} ${styles.criticalCard}`}>
        <div className={styles.glowBlob} />
        <div className={styles.label}>Critical & High Risks</div>
        <div className={`${styles.value} ${styles.criticalValue}`}>
          {loading ? '—' : criticalHighCount}
        </div>
        <div className={`${styles.subtext} ${styles.criticalSubtext}`}>
          Immediate remediation required
        </div>
      </div>

      {/* Target Domains Card */}
      <div className={styles.card}>
        <div className={styles.label}>Target Domains</div>
        <div className={styles.value}>{loading ? '—' : uniqueTargets}</div>
        <div className={styles.subtext}>Unique audited targets</div>
      </div>
    </div>
  );
}
