import React from 'react';
import styles from './AttackVectors.module.css';

export interface AttackVectorsProps {
  totalCritical: number;
  totalHigh: number;
  totalMedium: number;
  totalLow: number;
}

export function AttackVectors({
  totalCritical,
  totalHigh,
  totalMedium,
  totalLow,
}: AttackVectorsProps) {
  const vectors = [
    { label: 'SQL Injection', val: totalCritical > 0 ? 45 : 0, color: '#ef4444' },
    { label: 'Cross-Site Scripting', val: totalHigh > 0 ? 65 : 0, color: '#f59e0b' },
    { label: 'CSRF', val: totalMedium > 0 ? 30 : 0, color: '#3b82f6' },
    { label: 'Security Headers', val: totalLow > 0 ? 80 : 0, color: '#10b981' },
  ];

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Top Vulnerability Classes (INSA Scope)</h2>
      <div className={styles.grid}>
        {vectors.map((vector) => (
          <div key={vector.label} className={styles.vectorItem}>
            <div className={styles.vectorHeader}>
              <span className={styles.vectorLabel}>{vector.label}</span>
              <span className={styles.vectorVal}>{vector.val}%</span>
            </div>
            <div className={styles.track}>
              <div
                className={styles.bar}
                style={{ width: `${vector.val}%`, backgroundColor: vector.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
