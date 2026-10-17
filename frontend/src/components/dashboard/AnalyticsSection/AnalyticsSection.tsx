import React from 'react';
import type { SeverityItem, DonutSegment } from '@/hooks/useDashboardData';
import styles from './AnalyticsSection.module.css';

export interface AnalyticsSectionProps {
  totalVulns: number;
  donutSegments: DonutSegment[];
  severityBreakdown: SeverityItem[];
}

export function AnalyticsSection({
  totalVulns,
  donutSegments,
  severityBreakdown,
}: AnalyticsSectionProps) {
  return (
    <div className={styles.grid}>
      {/* Assessment Velocity Chart */}
      <div className={styles.velocityCard}>
        <h2 className={styles.cardTitle}>Assessment Velocity</h2>
        <div className={styles.trendContainer}>
          <svg className={styles.trendSvg} preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,80 Q20,60 40,70 T80,40 T100,20 L100,100 L0,100 Z" fill="url(#gradientFill)" />
            <path
              d="M0,80 Q20,60 40,70 T80,40 T100,20"
              fill="none"
              stroke="url(#gradientLine)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className={styles.trendBadge}>30 Days Trend</div>
        </div>
      </div>

      {/* Severity Breakdown Donut Chart */}
      <div className={styles.breakdownCard}>
        <h2 className={styles.cardTitle}>Severity Breakdown</h2>
        <div className={styles.donutWrapper}>
          <svg viewBox="0 0 36 36" className={styles.donutSvg}>
            {totalVulns === 0 ? (
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1E293B" strokeWidth="4" />
            ) : (
              donutSegments.map(
                (segment) =>
                  segment.percentage > 0 && (
                    <circle
                      key={segment.label}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="4"
                      strokeDasharray={segment.dasharray}
                      strokeDashoffset={segment.dashoffset}
                    />
                  )
              )
            )}
          </svg>
        </div>
        <div className={styles.legendGrid}>
          {severityBreakdown.map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <div className={styles.legendLeft}>
                <div className={styles.legendDot} style={{ backgroundColor: item.color }} />
                <span className={styles.legendLabel}>{item.label}</span>
              </div>
              <span className={styles.legendCount}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
