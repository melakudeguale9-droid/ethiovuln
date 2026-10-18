'use client';

import React from 'react';

/**
 * 8-Point Golden Star Marker (for crosshair ticks)
 */
function ReticleStar({ cx, cy, size = 12 }: { cx: number; cy: number; size?: number }) {
  const r = size / 2;
  const d = r * 0.707;
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <line x1={0} y1={-r} x2={0} y2={r} stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
      <line x1={-r} y1={0} x2={r} y2={0} stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
      <line x1={-d} y1={-d} x2={d} y2={d} stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
      <line x1={-d} y1={d} x2={d} y2={-d} stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={0} cy={0} r={1.5} fill="#FEF08A" />
    </g>
  );
}

/**
 * CyberKeyIllustration
 * Replicates the Pentest-Tools glowing cyber key graphic from Stage 2:
 * - Technical rounded wireframe container with circuit trace
 * - Glowing concentric amber/red node in top-right corner
 * - Angled key silhouette with dual stepped bitts/teeth
 * - Luminous 8-point golden asterisk core
 * - Concentric reticle rings, target arcs, and crosshair axes
 */
export function CyberKeyIllustration({ className = '' }: { className?: string }) {
  // Center coordinates for the key bow (head)
  const cx = 250;
  const cy = 190;
  const headR = 54;

  return (
    <div className={`relative w-full max-w-[560px] mx-auto select-none ${className}`}>
      
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 520 420"
        className="w-full h-auto drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="neonRedGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="14" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neonGoldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="keyOutlineGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <radialGradient id="keyHeadRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#D97706" stopOpacity="0.22" />
            <stop offset="85%" stopColor="#B45309" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nodeCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFA4A4" stopOpacity="1" />
            <stop offset="40%" stopColor="#EF4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B91C1C" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="keyStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#818CF8" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#FB7185" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="keyBodyFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#291515" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1F120E" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* ─── Outer Wireframe Container Border ──────────────────────────────── */}
        <rect
          x="16"
          y="16"
          width="488"
          height="388"
          rx="22"
          fill="#0C1019"
          fillOpacity="0.6"
          stroke="#1E293B"
          strokeWidth="1.2"
        />

        {/* Top Circuit Trace Line connecting to Glowing Node */}
        <path
          d="M 16 38 H 472"
          stroke="#334155"
          strokeWidth="1.2"
          strokeOpacity="0.8"
        />

        {/* ─── Top-Right Glowing Concentric Node ─────────────────────────────── */}
        <g transform="translate(472, 38)">
          {/* Outermost faint ripple */}
          <circle cx="0" cy="0" r="16" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.25" />
          {/* Middle glowing ring */}
          <circle cx="0" cy="0" r="10" stroke="#EF4444" strokeWidth="1.4" strokeOpacity="0.65" />
          {/* Intense red glow aura */}
          <circle cx="0" cy="0" r="6" fill="url(#nodeCoreGlow)" filter="url(#neonRedGlow)" />
          {/* Core pinpoint */}
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
        </g>

        {/* ─── Surrounding Crosshair Axes ────────────────────────────────────── */}
        <g stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.35">
          {/* Vertical axis */}
          <line x1={cx} y1={75} x2={cx} y2={315} />
          {/* Horizontal axis */}
          <line x1={120} y1={cy} x2={380} y2={cy} />
          {/* Diagonal axes */}
          <line x1={cx - 100} y1={cy - 58} x2={cx + 100} y2={cy + 58} />
          <line x1={cx - 65} y1={cy + 95} x2={cx + 65} y2={cy - 95} />
        </g>

        {/* Reticle Star Markers on Axis Tips */}
        <ReticleStar cx={cx} cy={75} size={14} />
        <ReticleStar cx={cx - 100} cy={cy - 58} size={13} />
        <ReticleStar cx={380} cy={cy} size={14} />
        <ReticleStar cx={cx + 48} cy={cy + 78} size={13} />

        {/* ─── Orbital Reticle Arcs ─────────────────────────────────────────── */}
        {/* Inner Segmented Coral/Pink Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={76}
          stroke="#FB7185"
          strokeWidth="1.5"
          strokeDasharray="24 16 12 16"
          strokeOpacity="0.65"
          fill="none"
        />

        {/* Middle Cyan Segmented Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={88}
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeDasharray="36 120"
          strokeDashoffset="15"
          strokeOpacity="0.75"
          fill="none"
        />

        {/* Outer Fine Tick Ring */}
        <circle
          cx={cx}
          cy={cy}
          r={98}
          stroke="#F43F5E"
          strokeWidth="1"
          strokeDasharray="6 28"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* ─── Cyber Key Solid Body & Stepped Teeth ─────────────────────────── */}
        {/*
          Key path starts at head circle perimeter, goes down-left, forms stepped teeth,
          and returns into the head circle.
        */}
        <g filter="url(#keyOutlineGlow)">
          {/* Solid Translucent Dark Fill */}
          <path
            d={`
              M ${cx - 36} ${cy - 38}
              L 125 258
              Q 115 268 115 282
              L 115 330
              Q 115 340 125 340
              L 155 340
              L 155 315
              L 182 315
              L 182 288
              L 210 288
              L 210 260
              Q 222 245 238 238
              Z
            `}
            fill="url(#keyBodyFill)"
          />

          {/* Neon Dual-Tone Outer Stroke */}
          <path
            d={`
              M ${cx - 36} ${cy - 38}
              L 125 258
              Q 115 268 115 282
              L 115 330
              Q 115 340 125 340
              L 155 340
              L 155 315
              L 182 315
              L 182 288
              L 210 288
              L 210 260
            `}
            stroke="url(#keyStrokeGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Inner Cyan Highlight Edge (along shaft top) */}
          <path
            d="M 210 152 L 122 262 Q 118 268 118 280 L 118 328"
            stroke="#38BDF8"
            strokeWidth="1.2"
            strokeOpacity="0.75"
            fill="none"
          />

          {/* Inner Coral Highlight Edge (along teeth base) */}
          <path
            d="M 120 338 L 153 338 L 153 313 L 180 313 L 180 286 L 208 286"
            stroke="#FB7185"
            strokeWidth="1.2"
            strokeOpacity="0.75"
            fill="none"
          />
        </g>

        {/* ─── Key Head Circle (Bow) ────────────────────────────────────────── */}
        {/* Radial Warm Glow Fill */}
        <circle
          cx={cx}
          cy={cy}
          r={headR}
          fill="url(#keyHeadRadial)"
        />

        {/* Outer Circular Rim */}
        <circle
          cx={cx}
          cy={cy}
          r={headR}
          stroke="#F59E0B"
          strokeWidth="1.6"
          strokeOpacity="0.6"
        />

        {/* Inner Dashed White/Gold Reticle */}
        <circle
          cx={cx}
          cy={cy}
          r={headR - 5}
          stroke="#FEF3C7"
          strokeWidth="1"
          strokeDasharray="2 3"
          strokeOpacity="0.4"
        />

        {/* ─── Center 8-Point Golden Asterisk ───────────────────────────────── */}
        <g filter="url(#neonGoldGlow)">
          {/* Subtle star shine flare behind asterisk */}
          <polygon
            points={`
              ${cx},${cy - 28} ${cx + 7},${cy - 7}
              ${cx + 28},${cy} ${cx + 7},${cy + 7}
              ${cx},${cy + 28} ${cx - 7},${cy + 7}
              ${cx - 28},${cy} ${cx - 7},${cy - 7}
            `}
            fill="#FDE68A"
            fillOpacity="0.25"
          />

          {/* 4 Crossing Thick Bars (8 arms) */}
          {/* Vertical Bar */}
          <line
            x1={cx}
            y1={cy - 25}
            x2={cx}
            y2={cy + 25}
            stroke="#FDE68A"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Horizontal Bar */}
          <line
            x1={cx - 25}
            y1={cy}
            x2={cx + 25}
            y2={cy}
            stroke="#FDE68A"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Diagonal 45° */}
          <line
            x1={cx - 18}
            y1={cy - 18}
            x2={cx + 18}
            y2={cy + 18}
            stroke="#FDE68A"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          {/* Diagonal -45° */}
          <line
            x1={cx - 18}
            y1={cy + 18}
            x2={cx + 18}
            y2={cy - 18}
            stroke="#FDE68A"
            strokeWidth="6.5"
            strokeLinecap="round"
          />

          {/* Warm Amber Center Dot */}
          <circle cx={cx} cy={cy} r="3" fill="#FFFBEB" />
        </g>
      </svg>
    </div>
  );
}
