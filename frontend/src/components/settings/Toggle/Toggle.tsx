import React from 'react';
import styles from './Toggle.module.css';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        className={styles.switch}
        style={{
          background: checked ? '#00ff88' : 'rgba(148, 163, 184, 0.2)',
        }}
      >
        <div
          className={styles.knob}
          style={{
            left: checked ? 23 : 3,
          }}
        />
      </div>
    </div>
  );
}
