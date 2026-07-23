/**
 * observer.js — Single IntersectionObserver registry for reveal-on-
 * scroll. Every section across every stage should reuse this instead
 * of creating its own observer instance.
 */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
);

/** Register all [data-reveal] elements currently in the DOM. Safe to call multiple times. */
export function initReveal(root = document) {
  const targets = root.querySelectorAll('[data-reveal]:not(.is-revealed)');
  targets.forEach((el) => revealObserver.observe(el));
}
