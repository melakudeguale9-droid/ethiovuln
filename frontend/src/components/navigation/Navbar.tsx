// EthioVuln — Public Navigation Bar Component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Scan', href: '/dashboard/scans/new' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brandLink}>
        <div className={styles.logoIcon}>E</div>
        <span className={styles.brandText}>
          Ethio<span className={styles.brandHighlight}>Vuln</span>
        </span>
      </Link>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/login"
          className={`btn-glow btn-glow-cyan ${styles.signInBtn}`}
        >
          Sign In
        </Link>
      </nav>
    </header>
  );
}
