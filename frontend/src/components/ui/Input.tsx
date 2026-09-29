// EthioVuln — Reusable Input Component
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, style, ...props }, ref) => {
    return (
      <div style={{ marginBottom: 14 }}>
        {label && (
          <label
            htmlFor={id}
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 500,
              color: '#94a3b8',
              marginBottom: 6,
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`input-field ${className}`.trim()}
          style={{
            borderColor: error ? '#ff4444' : undefined,
            ...style,
          }}
          {...props}
        />
        {error && (
          <p style={{ fontSize: 12, color: '#ff4444', marginTop: 4 }}>{error}</p>
        )}
        {helperText && !error && (
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
