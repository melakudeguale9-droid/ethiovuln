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
        <div className="w-12 h-12 relative flex items-center justify-center shrink-0 mx-auto mb-2 transition-transform hover:scale-105">
          <svg className="w-12 h-12 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]" viewBox="0 0 36 36" fill="none">
            <path d="M18 3L4 9V17C4 25.5 10 32.5 18 34.5C26 32.5 32 25.5 32 17V9L18 3Z" fill="#111827" stroke="#1E293B" strokeWidth="2" />
            <path d="M18 4L5 9.5V17C5 24.8 10.6 31.4 18 33.3V4Z" fill="#0284C7" />
            <path d="M18 4L31 9.5V17C31 24.8 25.4 31.4 18 33.3V4Z" fill="#F8FAFC" />
            <path d="M18 9L11 13V17C11 21.5 14 25.5 18 27V9Z" fill="#00F0FF" />
            <circle cx="23" cy="18" r="2" fill="#E11D48" />
          </svg>
        </div>
      </Link>
      <h1 className={styles.title}>
        {titlePrefix} <span className="text-gradient">EthioVuln</span>
      </h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
