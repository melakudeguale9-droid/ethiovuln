import React from 'react';
import { SUPPORTED_VULN_CLASSES } from '@/data/scanProfiles';
import styles from './SsrfGateNotice.module.css';

export function SsrfGateNotice() {
  return (
    <div className={styles.wrapper}>
      {/* SSRF Protection Gate Box */}
      <div className={`glass-card ${styles.gateCard}`}>
        <div className={styles.header}>
          <div className={styles.shieldIcon}>🛡</div>
          <h2 className={styles.title}>SSRF Protection Gate</h2>
        </div>

        <p className={styles.description}>
          All targets pass through an automated pre-flight security gateway to prevent Server-Side Request Forgery and internal network probing:
        </p>

        <div className={styles.gateList}>
          <div className={styles.blockedItem}>
            <div className={styles.blockedTitle}>Blocked: Private CIDRs</div>
            <div className={styles.blockedDetail}>10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</div>
          </div>

          <div className={styles.blockedItem}>
            <div className={styles.blockedTitle}>Blocked: Cloud Metadata</div>
            <div className={styles.blockedDetail}>169.254.169.254 (AWS, GCP, Azure)</div>
          </div>

          <div className={styles.blockedItem}>
            <div className={styles.blockedTitle}>Blocked: Local Loopback</div>
            <div className={styles.blockedDetail}>127.0.0.1, localhost, 0.0.0.0</div>
          </div>

          <div className={styles.verifiedItem}>
            <div className={styles.verifiedTitle}>DNS Verification</div>
            <div className={styles.verifiedDetail}>
              Pre-scan DNS resolution checks prevent DNS rebinding attacks.
            </div>
          </div>
        </div>
      </div>

      {/* Supported Classes */}
      <div className={`glass-card ${styles.classesCard}`}>
        <h3 className={styles.classesTitle}>Supported Vulnerability Classes</h3>
        <div className={styles.classesList}>
          {SUPPORTED_VULN_CLASSES.map((item, idx) => (
            <div key={idx} className={styles.classItem}>
              <span className={styles.bullet}>◆</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
