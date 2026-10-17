import React from 'react';
import styles from './TargetInputCard.module.css';

export interface TargetInputCardProps {
  targetUrl: string;
  onChangeTargetUrl: (url: string) => void;
}

export function TargetInputCard({ targetUrl, onChangeTargetUrl }: TargetInputCardProps) {
  return (
    <div className={`glass-card ${styles.card}`}>
      <label htmlFor="target-input" className={styles.label}>
        TARGET APPLICATION URL
      </label>
      <div className={styles.inputWrapper}>
        <input
          id="target-input"
          className={`input-field ${styles.input}`}
          placeholder="https://app.example.com"
          value={targetUrl}
          onChange={(e) => onChangeTargetUrl(e.target.value)}
        />
      </div>
      <div className={styles.hintRow}>
        <span className={styles.infoIcon}>ℹ</span>
        <span>Must be a valid FQDN or public IP address where you have authorized testing permissions.</span>
      </div>
    </div>
  );
}
