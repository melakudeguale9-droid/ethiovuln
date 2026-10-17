import React from 'react';
import { SEVERITY_CONFIG } from '@/lib/constants';
import type { Severity, Vulnerability } from '@/types/vulnerability';
import styles from './SeverityCounters.module.css';

export interface SeverityCountersProps {
  groupedVulns: Record<Severity, Vulnerability[]>;
  selectedSeverity: Severity | 'all';
  onSelectSeverity: (sev: Severity | 'all') => void;
}

export function SeverityCounters({
  groupedVulns,
  selectedSeverity,
  onSelectSeverity,
}: SeverityCountersProps) {
  const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

  return (
    <div className={styles.grid}>
      {severities.map((sev) => {
        const cfg = SEVERITY_CONFIG[sev];
        const count = groupedVulns[sev].length;
        const isSelected = selectedSeverity === sev;

        return (
          <div
            key={sev}
            onClick={() => onSelectSeverity(isSelected ? 'all' : sev)}
            className={`glass-card ${styles.card}`}
            style={{
              borderColor: isSelected ? cfg.color : undefined,
              borderTop: `3px solid ${cfg.color}`,
              background: isSelected ? `${cfg.color}10` : undefined,
            }}
          >
            <div className={styles.count} style={{ color: cfg.color }}>
              {count}
            </div>
            <div className={styles.label}>{cfg.label}</div>
          </div>
        );
      })}
    </div>
  );
}
