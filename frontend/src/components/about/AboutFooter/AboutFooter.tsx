import React from 'react';
import styles from './AboutFooter.module.css';

export function AboutFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copyright}>
          © 2026 EthioVuln. Built for authorized security professionals.
        </p>
        <p className={styles.authorTag}>Built by Melaku Deguale</p>
      </div>
    </footer>
  );
}
