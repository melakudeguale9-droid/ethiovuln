// EthioVuln — Reusable Card Component
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  danger?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, danger = false, className = '', style, ...props }: CardProps) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        background: 'rgba(17, 24, 39, 0.8)',
        border: `1px solid ${danger ? 'rgba(255, 0, 64, 0.25)' : 'rgba(148, 163, 184, 0.1)'}`,
        borderRadius: 16,
        padding: 24,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
