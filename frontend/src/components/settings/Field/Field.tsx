import React from 'react';
import styles from './Field.module.css';

export interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}
