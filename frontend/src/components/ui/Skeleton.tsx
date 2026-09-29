// EthioVuln — Reusable Skeleton Loader Component
import React from 'react';

export interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  borderRadius?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

export function Skeleton({
  height = 20,
  width = '100%',
  borderRadius = 8,
  style,
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      style={{
        height,
        width,
        borderRadius,
        ...style,
      }}
    />
  );
}

export default Skeleton;
