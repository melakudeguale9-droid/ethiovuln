import React from 'react';
import styles from './PasswordStrengthMeter.module.css';

export interface PasswordStrengthMeterProps {
  score: number;
  label: string;
  color: string;
}

export function PasswordStrengthMeter({ score, label, color }: PasswordStrengthMeterProps) {
  if (score === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.barsRow}>
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={styles.bar}
            style={{
              backgroundColor: level <= score ? color : undefined,
            }}
          />
        ))}
      </div>
      <div className={styles.label} style={{ color }}>
        {label}
      </div>
    </div>
  );
}
