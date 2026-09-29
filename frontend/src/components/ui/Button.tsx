// EthioVuln — Reusable Button Component
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  let variantClass = 'btn-glow btn-glow-green';
  if (variant === 'danger') {
    variantClass = 'btn-glow btn-glow-red';
  } else if (variant === 'secondary') {
    variantClass = 'btn-glow btn-glow-blue';
  } else if (variant === 'ghost') {
    variantClass = '';
  }

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    ...style,
  };

  return (
    <button
      className={`${variantClass} ${className}`.trim()}
      disabled={disabled || loading}
      style={baseStyle}
      {...props}
    >
      {loading ? (
        <>
          <span className="pulse-dot" style={{ width: 6, height: 6 }} />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
