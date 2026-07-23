/** Global configuration constants shared between frontend modules. */

export const CONFIG = Object.freeze({
  theme: {
    default: 'dark',
    storageKey: 'virtuhai:theme',
  },
  locale: {
    default: 'en',
    storageKey: 'virtuhai:language',
  },
  motion: {
    reducedQuery: '(prefers-reduced-motion: reduce)',
  },
  nav: {
    desktopBreakpoint: 1180,
  },
});
