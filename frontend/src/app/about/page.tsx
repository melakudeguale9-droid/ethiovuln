'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import {
  AboutHero,
  DeveloperProfile,
  TechnicalExpertise,
  SocialConnect,
  AboutFooter,
} from '@/components/about';
import styles from './about.module.css';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      {/* ─── Hero Banner with Shield Glow & Particles ─── */}
      <AboutHero />

      {/* ─── Researcher Profile & Expertise Section ──── */}
      <section className={styles.contentSection}>
        <div
          className={`glass-card ${styles.profileCard}`}
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {/* Rotating Avatar & Verified Researcher Info */}
          <DeveloperProfile />

          {/* 2-Column Grid: Expertise & Social Showcase */}
          <div className={styles.mainGrid}>
            <TechnicalExpertise />
            <SocialConnect />
          </div>
        </div>
      </section>

      {/* ─── About Footer ─────────────────────────────── */}
      <AboutFooter />
    </div>
  );
}
