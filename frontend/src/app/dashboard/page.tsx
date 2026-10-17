'use client';

import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import {
  DashboardHeader,
  MetricsRow,
  AnalyticsSection,
  AttackVectors,
  RecentScans,
} from '@/components/dashboard';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const {
    scans,
    loading,
    totalScans,
    uniqueTargets,
    activeScans,
    totalVulns,
    totalCritical,
    totalHigh,
    criticalHighCount,
    totalMedium,
    totalLow,
    severityBreakdown,
    donutSegments,
  } = useDashboardData();

  return (
    <div className={styles.pageWrapper}>
      {/* ─── Top Header & Quick Action Bar ──────────────────────── */}
      <DashboardHeader />

      {/* ─── Top Metrics Row (Total, Vulns, Critical, Targets) ───── */}
      <MetricsRow
        loading={loading}
        totalScans={totalScans}
        activeScans={activeScans}
        totalVulns={totalVulns}
        criticalHighCount={criticalHighCount}
        uniqueTargets={uniqueTargets}
      />

      {/* ─── Visual Analytics (Velocity Curve & Severity Donut) ──── */}
      <AnalyticsSection
        totalVulns={totalVulns}
        donutSegments={donutSegments}
        severityBreakdown={severityBreakdown}
      />

      {/* ─── Top Attack Vectors (INSA Mandatory Scope) ──────────── */}
      <AttackVectors
        totalCritical={totalCritical}
        totalHigh={totalHigh}
        totalMedium={totalMedium}
        totalLow={totalLow}
      />

      {/* ─── Recent Assessments Table ───────────────────────────── */}
      <RecentScans scans={scans} loading={loading} />
    </div>
  );
}
