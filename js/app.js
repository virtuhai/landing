/**
 * app.js — Entry point. Wires up every module needed by the sections
 * currently built (header navigation + Hero). Later stages register
 * themselves here without touching what's already wired.
 */

import { initThemeSwitcher } from './modules/theme-switcher.js';
import { initNavigation } from './modules/navigation.js';
import { initReveal } from './modules/observer.js';
import { initDashboard } from './modules/dashboard.js';
import { initI18n } from './modules/i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initNavigation();
  initReveal();
  initDashboard();
  initI18n();
});
