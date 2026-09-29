// EthioVuln — Reusable SectionHeader Component
import React from 'react';

export interface SectionHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export function SectionHeader({ icon, title, subtitle, action, style }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        ...style,
      }}
    >
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
          {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
          {title}
        </h2>
        {subtitle && <p style={{ fontSize: 13, color: '#64748b' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default SectionHeader;
