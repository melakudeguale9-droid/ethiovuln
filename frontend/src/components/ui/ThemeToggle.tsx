'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export interface ThemeToggleProps {
  id?: string;
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  id = 'theme-toggle',
  showLabel = false,
  className = '',
}: ThemeToggleProps) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const ariaLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const icon = isDark ? '☀' : '☾';
  const label = isDark ? 'Light mode' : 'Dark mode';

  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      aria-pressed={isDark}
      className={`btn btn-secondary inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${isDark
          ? 'bg-slate-800/80 border-slate-700/80 text-amber-300 hover:bg-slate-700/80 hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]'
          : 'bg-white/90 border-slate-200 text-indigo-900 hover:bg-slate-100 hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]'
        } ${className}`}
      title={ariaLabel}
    >
      <span
        className="theme-toggle-icon font-mono text-base leading-none transition-transform duration-300 transform group-hover:rotate-12"
        aria-hidden="true"
      >
        {mounted ? icon : '☾'}
      </span>
      {showLabel && (
        <span className="theme-toggle-label text-sm font-semibold tracking-wide">
          {mounted ? label : 'Theme'}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
