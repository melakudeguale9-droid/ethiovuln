import React from 'react';
import Link from 'next/link';
import styles from './BrandHeader.module.css';

export interface BrandHeaderProps {
  titlePrefix: string;
  subtitle: string;
}

export function BrandHeader({ titlePrefix, subtitle }: BrandHeaderProps) {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logoLink}>
        <div className={styles.logoBadge}>E</div>
      </Link>
      <h1 className={styles.title}>
        {titlePrefix} <span className="text-gradient">EthioVuln</span>
      </h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
