// EthioVuln — Reusable Badge Component
import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  dot?: boolean;
  style?: React.CSSProperties;
}

export function Badge({ children, color = '#94a3b8', dot = false, style }: BadgeProps) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: color,
        background: `${color}18`,
        border: `1px solid ${color}35`,
        padding: '3px 10px',
        borderRadius: 9999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        letterSpacing: 0.5,
        ...style,
      }}
    >
      {dot && (
        <span
          className="pulse-dot"
          style={{ width: 6, height: 6, background: color, borderRadius: '50%' }}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
