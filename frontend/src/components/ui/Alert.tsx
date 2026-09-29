// EthioVuln — Reusable Alert Component
import React from 'react';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  msg?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Alert({ type = 'error', msg, children, style }: AlertProps) {
  const styles: Record<string, { bg: string; border: string; color: string; prefix: string }> = {
    error: {
      bg: 'rgba(255, 0, 64, 0.08)',
      border: 'rgba(255, 0, 64, 0.3)',
      color: '#ff4444',
      prefix: '✗ ',
    },
    success: {
      bg: 'rgba(0, 255, 136, 0.08)',
      border: 'rgba(0, 255, 136, 0.3)',
      color: '#00ff88',
      prefix: '✓ ',
    },
    warning: {
      bg: 'rgba(255, 176, 32, 0.08)',
      border: 'rgba(255, 176, 32, 0.3)',
      color: '#ffb020',
      prefix: '⚠ ',
    },
    info: {
      bg: 'rgba(0, 136, 255, 0.08)',
      border: 'rgba(0, 136, 255, 0.3)',
      color: '#00d4ff',
      prefix: 'ℹ ',
    },
  };

  const current = styles[type];

  return (
    <div
      style={{
        background: current.bg,
        border: `1px solid ${current.border}`,
        borderRadius: 10,
        padding: '10px 16px',
        marginBottom: 16,
        color: current.color,
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
    >
      <span>{current.prefix}</span>
      <div style={{ flex: 1 }}>{msg || children}</div>
    </div>
  );
}

export default Alert;
