/**
 * theme-switcher.js — Dark/light theme toggle.
 * Reads a stored preference (or system preference on first visit),
 * applies it to <html data-theme="...">, and keeps every toggle
 * instance on the page (desktop header + mobile menu) in sync.
 */

import { CONFIG } from '../config.js';

function getStoredTheme() {
  try {
    return window.localStorage.getItem(CONFIG.theme.storageKey);
  } catch {
    return null; // localStorage may be blocked (private mode, etc.)
  }
}

function storeTheme(theme) {
  try {
    window.localStorage.setItem(CONFIG.theme.storageKey, theme);
  } catch {
    // Silently ignore — theme just won't persist across visits.
  }
}

function getSystemTheme() {
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

function applyTheme(theme, toggles) {
  document.documentElement.setAttribute('data-theme', theme);

  toggles.forEach((group) => {
    group.querySelectorAll('[data-theme-option]').forEach((btn) => {
      const isActive = btn.dataset.themeOption === theme;
      btn.setAttribute('aria-pressed', String(isActive));
    });
  });
}

export function initThemeSwitcher() {
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  if (toggles.length === 0) return;

  const initialTheme = getStoredTheme() || getSystemTheme();
  applyTheme(initialTheme, toggles);

  toggles.forEach((group) => {
    group.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-theme-option]');
      if (!btn) return;

      const nextTheme = btn.dataset.themeOption;
      applyTheme(nextTheme, toggles);
      storeTheme(nextTheme);
    });
  });
}
