import React from 'react';
import { DEVELOPER_BIO } from '@/data/aboutData';
import styles from './DeveloperProfile.module.css';

export function DeveloperProfile() {
  return (
    <div className={styles.profileHeader}>
      <div className={styles.avatarRing}>
        <img
          src="/profile.png"
          alt={DEVELOPER_BIO.name}
          className={styles.avatarImage}
        />
        <div className={styles.spinningBorder} />
      </div>

      <div>
        <h2 className={styles.nameHeading}>
          <span>{DEVELOPER_BIO.name}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.bioGradient}>Professional Bio</span>
        </h2>
        <p className={styles.roleTitle}>{DEVELOPER_BIO.title}</p>
        <p className={styles.certTitle}>{DEVELOPER_BIO.subtitle}</p>

        {/* Status Badge */}
        <div className={styles.statusPill}>
          <span className={styles.pulseDot} />
          <span className={styles.statusText}>{DEVELOPER_BIO.availabilityStatus}</span>
        </div>
      </div>
    </div>
  );
}
