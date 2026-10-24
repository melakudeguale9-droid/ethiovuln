// EthioVuln — Dark/Light Theme Context & Hook
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'dark' | 'light';

export const DARK_THEME_VARS: Record<string, string> = {
  '--bg-page': '#0f172a',
  '--bg-surface': '#111827',
  '--bg-muted': '#1e293b',
  '--bg-sidebar': '#020617',
  '--text-heading': '#f8fafc',
  '--text-body': '#cbd5e1',
  '--text-muted': '#94a3b8',
  '--text-on-dark': '#e2e8f0',
  '--border': '#334155',
  '--border-strong': '#475569',
  '--color-primary-soft': '#172554',
  '--color-cyan-soft': '#083344',
  '--color-success-soft': '#052e16',
  '--color-warning-soft': '#451a03',
  '--color-danger-soft': '#450a0a',
};

export const LIGHT_THEME_VARS: Record<string, string> = {
  '--bg-page': '#f8fafc',
  '--bg-surface': '#ffffff',
  '--bg-muted': '#f1f5f9',
  '--bg-sidebar': '#0f172a',
  '--text-heading': '#0f172a',
  '--text-body': '#334155',
  '--text-muted': '#64748b',
  '--text-on-dark': '#e2e8f0',
  '--border': '#e2e8f0',
  '--border-strong': '#cbd5e1',
  '--color-primary-soft': '#eff6ff',
  '--color-cyan-soft': '#ecfeff',
  '--color-success-soft': '#f0fdf4',
  '--color-warning-soft': '#fffbeb',
  '--color-danger-soft': '#fef2f2',
};

export const STORAGE_KEY = 'ethiovuln-theme';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeVariables(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const vars = theme === 'dark' ? DARK_THEME_VARS : LIGHT_THEME_VARS;
  Object.entries(vars).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    let initialTheme: Theme = 'dark';
    if (saved === 'dark' || saved === 'light') {
      initialTheme = saved;
    } else if (systemTheme.matches) {
      initialTheme = 'dark';
    } else {
      initialTheme = 'light';
    }

    setThemeState(initialTheme);
    applyThemeVariables(initialTheme);
    setMounted(true);

    // Follow system preference changes only when user hasn't explicitly set a preference
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const nextTheme: Theme = e.matches ? 'dark' : 'light';
        setThemeState(nextTheme);
        applyThemeVariables(nextTheme);
      }
    };

    systemTheme.addEventListener('change', handleSystemChange);
    return () => {
      systemTheme.removeEventListener('change', handleSystemChange);
    };
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyThemeVariables(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
