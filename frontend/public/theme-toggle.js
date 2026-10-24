/*
 * EthioVuln — Dark/Light Theme Toggle
 * Works with ethiovuln-light-theme.css.
 *
 * Required button example:
 * <button id="theme-toggle" class="btn btn-secondary" type="button"
 *         aria-label="Switch to dark mode" aria-pressed="false">
 *   <span class="theme-toggle-icon" aria-hidden="true">☾</span>
 *   <span class="theme-toggle-label">Dark mode</span>
 * </button>
 */

(() => {
  'use strict';

  const STORAGE_KEY = 'ethiovuln-theme';
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  // These variables complement the Light Theme variables already in the CSS file.
  const darkTheme = {
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
    '--color-danger-soft': '#450a0a'
  };

  const lightTheme = {
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
    '--color-danger-soft': '#fef2f2'
  };

  function applyVariables(theme) {
    Object.entries(theme).forEach(([name, value]) => {
      root.style.setProperty(name, value);
    });
  }

  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return systemTheme.matches ? 'dark' : 'light';
  }

  function updateToggle(theme) {
    const isDark = theme === 'dark';
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const toggleButtons = document.querySelectorAll('#theme-toggle, .theme-toggle-btn');
    toggleButtons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
      );

      const toggleIcon = btn.querySelector('.theme-toggle-icon');
      const toggleLabel = btn.querySelector('.theme-toggle-label');

      if (toggleIcon) toggleIcon.textContent = isDark ? '☀' : '☾';
      if (toggleLabel) toggleLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
    });
  }

  function applyTheme(theme, save = false) {
    applyVariables(theme === 'dark' ? darkTheme : lightTheme);
    updateToggle(theme);
    if (save) localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply the saved/system preference immediately when the script loads.
  applyTheme(getSavedTheme());

  // Click delegation supporting both static and dynamic React buttons
  document.addEventListener('click', (event) => {
    const target = event.target;
    const btn = target && target.closest ? target.closest('#theme-toggle, .theme-toggle-btn') : null;
    if (btn) {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    }
  });

  // Follow system changes only when the user has not selected a preference.
  systemTheme.addEventListener('change', (event) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });

  // Export globally for programmatic control
  window.ethiovulnTheme = {
    applyTheme,
    getSavedTheme,
    toggle: () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    }
  };
})();
