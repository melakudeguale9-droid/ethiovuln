'use client';

import React from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import {
  HeroSection,
  MetricsGrid,
  EngineShowcase,
  WorkflowSection,
  CtaSection,
  LandingFooter,
} from '@/components/landing';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      {/* ─── Hero Section with Security Telemetry Metrics ─── */}
      <HeroSection>
        <MetricsGrid />
      </HeroSection>

      {/* ─── Engine Telemetry Pipeline Showcase ──────────── */}
      <EngineShowcase />

      {/* ─── Four-Phase Workflow Steps ───────────────────── */}
      <WorkflowSection />

      {/* ─── Call to Action Panel ────────────────────────── */}
      <CtaSection />

      {/* ─── Footer with Socials & Platform Metadata ──────── */}
      <LandingFooter />
    </div>
  );
}
