'use client';

import React, { useState, useMemo } from 'react';
import type { SeverityItem, DonutSegment } from '@/hooks/useDashboardData';
import styles from './AnalyticsSection.module.css';

export interface AnalyticsSectionProps {
  totalVulns: number;
  donutSegments: DonutSegment[];
  severityBreakdown: SeverityItem[];
}

type Timeframe = '7D' | '24H' | '30D';
type CurveStyle = 'spline' | 'wave' | 'stepped';

interface DataPoint {
  label: string;
  value: number;
  rate: number; // req/s or metric
}

const TIMEFRAME_DATA: Record<Timeframe, { points: DataPoint[]; avgRate: string; change: string }> = {
  '7D': {
    avgRate: '42.8 scans/day',
    change: '+24.6%',
    points: [
      { label: 'Mon', value: 28, rate: 3.4 },
      { label: 'Tue', value: 45, rate: 5.6 },
      { label: 'Wed', value: 38, rate: 4.8 },
      { label: 'Thu', value: 72, rate: 9.1 },
      { label: 'Fri', value: 60, rate: 7.5 },
      { label: 'Sat', value: 84, rate: 10.6 },
      { label: 'Sun', value: 98, rate: 12.3 },
    ],
  },
  '24H': {
    avgRate: '18.2 req/sec',
    change: '+15.2%',
    points: [
      { label: '00:00', value: 16, rate: 2.0 },
      { label: '04:00', value: 22, rate: 2.8 },
      { label: '08:00', value: 58, rate: 7.2 },
      { label: '12:00', value: 86, rate: 10.8 },
      { label: '16:00', value: 96, rate: 12.0 },
      { label: '20:00', value: 70, rate: 8.8 },
      { label: 'Now', value: 82, rate: 10.2 },
    ],
  },
  '30D': {
    avgRate: '218 scans/wk',
    change: '+31.8%',
    points: [
      { label: 'Week 1', value: 32, rate: 4.0 },
      { label: 'Week 2', value: 56, rate: 7.0 },
      { label: 'Week 3', value: 48, rate: 6.0 },
      { label: 'Week 4', value: 76, rate: 9.5 },
      { label: 'Week 5', value: 94, rate: 11.8 },
    ],
  },
};

export function AnalyticsSection({
  totalVulns,
  donutSegments,
  severityBreakdown,
}: AnalyticsSectionProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('7D');
  const [curveStyle, setCurveStyle] = useState<CurveStyle>('spline');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const currentDataset = TIMEFRAME_DATA[timeframe];
  const points = currentDataset.points;

  // ViewBox dimensions: 700 width, 180 height
  const width = 700;
  const height = 180;
  const padLeft = 40;
  const padRight = 40;
  const padTop = 25;
  const padBottom = 30;

  // Compute coordinate mapping
  const coords = useMemo(() => {
    const usableW = width - padLeft - padRight;
    const usableH = height - padTop - padBottom;
    const maxVal = Math.max(...points.map((p) => p.value), 100);

    return points.map((p, i) => {
      const x = padLeft + (i / (points.length - 1)) * usableW;
      const y = height - padBottom - (p.value / maxVal) * usableH;
      return { x, y, ...p };
    });
  }, [points]);

  // Generate SVG path based on selected curve style
  const { linePath, areaPath } = useMemo(() => {
    if (coords.length < 2) return { linePath: '', areaPath: '' };

    let line = '';

    if (curveStyle === 'stepped') {
      line = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const midX = (coords[i].x + coords[i + 1].x) / 2;
        line += ` L ${midX} ${coords[i].y} L ${midX} ${coords[i + 1].y} L ${coords[i + 1].x} ${coords[i + 1].y}`;
      }
    } else if (curveStyle === 'wave') {
      line = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const cx = (p1.x + p2.x) / 2;
        line += ` Q ${p1.x + (cx - p1.x) * 0.5} ${p1.y - 15}, ${cx} ${(p1.y + p2.y) / 2} T ${p2.x} ${p2.y}`;
      }
    } else {
      // Smooth Catmull-Rom Spline
      line = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i === 0 ? 0 : i - 1];
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const p3 = coords[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        line += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
    }

    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    const groundY = height - padBottom + 8;
    const area = `${line} L ${lastX} ${groundY} L ${firstX} ${groundY} Z`;

    return { linePath: line, areaPath: area };
  }, [coords, curveStyle]);

  const activePoint = hoveredIdx !== null ? coords[hoveredIdx] : coords[coords.length - 1];

  return (
    <div className={styles.grid}>
      {/* ─── Assessment Velocity Card ─────────────────────────── */}
      <div className={styles.velocityCard}>
        <div className={styles.velocityHeader}>
          <div className={styles.titleArea}>
            <h2 className={styles.cardTitle}>Assessment Velocity</h2>
            <span className={styles.velocityBadge}>
              <span>▲</span>
              <span>{currentDataset.change}</span>
            </span>
            <span className={styles.velocityMeta}>({currentDataset.avgRate})</span>
          </div>

          {/* Interactive Controls */}
          <div className={styles.controlsRow}>
            {/* Curve Style Selector */}
            <select
              value={curveStyle}
              onChange={(e) => setCurveStyle(e.target.value as CurveStyle)}
              className={styles.styleSelect}
              title="Change Line Curve Style"
            >
              <option value="spline">⚡ Smooth Spline</option>
              <option value="wave">🌊 Cyber Wave</option>
              <option value="stepped">📊 Stepped Pulse</option>
            </select>

            {/* Timeframe Buttons */}
            <div className={styles.timeframeTabs}>
              {(['7D', '24H', '30D'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => {
                    setTimeframe(tf);
                    setHoveredIdx(null);
                  }}
                  className={`${styles.timeframeTab} ${timeframe === tf ? styles.timeframeTabActive : ''}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className={styles.chartContainer}>
          {/* Active Hover / Peak Tooltip */}
          {activePoint && (
            <div className={styles.tooltipBox}>
              <span style={{ color: '#00e5ff', fontWeight: 700 }}>{activePoint.label}</span>
              <span style={{ color: '#94a3b8' }}>·</span>
              <span>
                <strong style={{ color: '#ffffff' }}>{activePoint.value}</strong> assessments
              </span>
              <span style={{ color: '#10b981' }}>({activePoint.rate} req/s)</span>
            </div>
          )}

          <svg className={styles.trendSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              {/* Neon Glow Filter */}
              <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Area Gradient */}
              <linearGradient id="velocityAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.28" />
                <stop offset="60%" stopColor="#0284C7" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#090D16" stopOpacity="0.0" />
              </linearGradient>

              {/* Line Stroke Gradient */}
              <linearGradient id="velocityLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="65%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            {/* Subtle Grid Guidelines */}
            {[45, 85, 125].map((gy, i) => (
              <line
                key={i}
                x1={padLeft - 10}
                y1={gy}
                x2={width - padRight + 10}
                y2={gy}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.7"
              />
            ))}

            {/* Gradient Area Under Curve */}
            {areaPath && <path d={areaPath} fill="url(#velocityAreaGradient)" />}

            {/* Glowing Neon Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="url(#velocityLineGradient)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#cyberGlow)"
              />
            )}

            {/* Interactive Data Point Dots */}
            {coords.map((pt, idx) => {
              const isHovered = hoveredIdx === idx || (hoveredIdx === null && idx === coords.length - 1);
              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Invisible larger hover hit area */}
                  <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />

                  {/* Outer pulse aura if active */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="8"
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="1.5"
                      strokeOpacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values="7;13;7"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-opacity"
                        values="0.8;0.2;0.8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Inner glowing dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5.5 : 3.5}
                    fill={isHovered ? '#FFFFFF' : '#00F0FF'}
                    stroke={isHovered ? '#00F0FF' : '#090D16'}
                    strokeWidth="2"
                    style={{ transition: 'all 0.15s ease' }}
                  />
                </g>
              );
            })}
          </svg>

          {/* X-Axis Timeline Markers */}
          <div className={styles.xAxisRow}>
            {points.map((pt, i) => {
              const isActive = hoveredIdx === i || (hoveredIdx === null && i === points.length - 1);
              return (
                <span
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`${styles.xAxisLabel} ${isActive ? styles.xAxisLabelActive : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {pt.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Severity Breakdown Donut Chart ───────────────────── */}
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

export default AnalyticsSection;
