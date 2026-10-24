'use client';

import React from 'react';
import { SEVERITY_CONFIG } from '@/lib/constants';
import type { Severity, Vulnerability } from '@/types/vulnerability';
import styles from './SeverityCounters.module.css';

export interface SeverityCountersProps {
  groupedVulns: Record<Severity, Vulnerability[]>;
  selectedSeverity: Severity | 'all';
  onSelectSeverity: (sev: Severity | 'all') => void;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function createArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  if (endAngle <= startAngle) return '';
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export function SeverityCounters({
  groupedVulns,
  selectedSeverity,
  onSelectSeverity,
}: SeverityCountersProps) {
  const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

  // Overall risk level is determined by the highest severity finding with count > 0
  const overallRiskSeverity = severities.find((sev) => groupedVulns[sev].length > 0) || null;

  // Arc geometry: Center (80, 72), Radius 52, 230° to 490° (260° sweep, bottom open)
  const cx = 80;
  const cy = 72;
  const radius = 52;
  const startAngle = 230;
  const endAngle = 490;
  const totalSweep = 260;

  const bgTrackPath = createArc(cx, cy, radius, startAngle, endAngle);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {severities.map((sev) => {
          const cfg = SEVERITY_CONFIG[sev];
          const count = groupedVulns[sev].length;
          const isSelected = selectedSeverity === sev;
          const isOverallRisk = overallRiskSeverity === sev;

          const label = cfg.label.charAt(0).toUpperCase() + cfg.label.slice(1).toLowerCase();

          // Calculate active arc percentage based on findings count
          let pct = 0;
          if (count === 1) pct = 0.28;
          else if (count === 2) pct = 0.5;
          else if (count === 3) pct = 0.7;
          else if (count >= 4) pct = Math.min(0.85 + (count - 4) * 0.03, 1.0);

          const activeArcPath =
            pct > 0 ? createArc(cx, cy, radius, startAngle, startAngle + pct * totalSweep) : null;

          return (
            <div
              key={sev}
              role="button"
              tabIndex={0}
              onClick={() => onSelectSeverity(isSelected ? 'all' : sev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSeverity(isSelected ? 'all' : sev);
                }
              }}
              title={`Click to ${isSelected ? 'clear' : 'filter by'} ${label} findings`}
              className={`glass-card ${styles.card} ${isOverallRisk ? styles.overallRiskCard : ''} ${
                isSelected ? styles.selectedCard : ''
              }`}
              style={{
                borderColor: isOverallRisk || isSelected ? cfg.color : undefined,
                boxShadow: isOverallRisk
                  ? `0 0 24px ${cfg.color}30, 0 10px 25px -5px rgba(0, 0, 0, 0.5)`
                  : isSelected
                  ? `0 0 16px ${cfg.color}25`
                  : undefined,
                background: isOverallRisk
                  ? `linear-gradient(180deg, ${cfg.color}14 0%, rgba(17, 24, 39, 0.95) 100%)`
                  : undefined,
              }}
            >
              {/* Overall Risk or Filter Header Banner */}
              {isOverallRisk ? (
                <div className={styles.banner} style={{ background: cfg.color }}>
                  Overall risk level{isSelected ? ' · Active' : ''}
                </div>
              ) : isSelected ? (
                <div
                  className={styles.banner}
                  style={{
                    background: `${cfg.color}25`,
                    color: cfg.color,
                    borderBottom: `1px solid ${cfg.color}50`,
                  }}
                >
                  Filtered Active ✕
                </div>
              ) : (
                <div className={styles.bannerEmpty} />
              )}

              {/* Radial Gauge SVG */}
              <div className={styles.gaugeContainer}>
                <svg
                  className={styles.svg}
                  viewBox="0 0 160 132"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id={`glow-${sev}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="3"
                        floodColor={cfg.color}
                        floodOpacity="0.75"
                      />
                    </filter>
                  </defs>

                  {/* Background Track Arc */}
                  <path
                    d={bgTrackPath}
                    stroke="rgba(148, 163, 184, 0.18)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />

                  {/* Active Colored Arc */}
                  {activeArcPath && (
                    <path
                      d={activeArcPath}
                      stroke={cfg.color}
                      strokeWidth="7"
                      strokeLinecap="round"
                      filter={`url(#glow-${sev})`}
                    />
                  )}

                  {/* Centered Number Count */}
                  <text
                    x={cx}
                    y={cy - 4}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={styles.gaugeNumber}
                    fill={count > 0 ? '#FFFFFF' : '#94A3B8'}
                  >
                    {count}
                  </text>

                  {/* Subtitle Severity Label */}
                  <text
                    x={cx}
                    y={cy + 22}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={styles.gaugeLabel}
                    fill={isOverallRisk || isSelected ? cfg.color : '#94A3B8'}
                  >
                    {label}
                  </text>
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
