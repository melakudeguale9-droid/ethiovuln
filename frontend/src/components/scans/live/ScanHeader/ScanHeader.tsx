import React from 'react';
import styles from './ScanHeader.module.css';

export interface ScanHeaderProps {
  targetDomain?: string;
  targetUrl?: string;
  isRunning: boolean;
  isCompleted: boolean;
  statusConfig: { label: string; color: string };
  onStopScan: () => void;
  onDownloadReport: () => void;
}

export function ScanHeader({
  targetDomain,
  targetUrl,
  isRunning,
  isCompleted,
  statusConfig,
  onStopScan,
  onDownloadReport,
}: ScanHeaderProps) {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.titleRow}>
          <h1 className={styles.domainTitle}>{targetDomain || 'Assessment'}</h1>
          <span
            className={styles.statusPill}
            style={{
              color: statusConfig.color,
              background: `${statusConfig.color}15`,
              border: `1px solid ${statusConfig.color}35`,
            }}
          >
            {isRunning && <span className={styles.pulseDot} />}
            {statusConfig.label.toUpperCase()}
          </span>
        </div>
        <p className={styles.targetUrl}>{targetUrl}</p>
      </div>

      <div className={styles.actionGroup}>
        {isRunning && (
          <button
            className={`btn-glow btn-glow-red ${styles.abortBtn}`}
            onClick={onStopScan}
          >
            Abort Scan
          </button>
        )}
        {isCompleted && (
          <button
            className={`btn-glow btn-glow-cyan ${styles.exportBtn}`}
            onClick={onDownloadReport}
          >
            ◧ Export PDF Report
          </button>
        )}
      </div>
    </div>
  );
}
