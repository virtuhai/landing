/**
 * navigation.js — Mobile hamburger menu: open/close state, icon swap,
 * body scroll lock, and closing on link-click / outside-click / Escape.
 * Desktop nav needs no JS — it's plain CSS (see navigation.css).
 */

function setMenuState(toggleBtn, menu, isOpen) {
  toggleBtn.setAttribute('aria-expanded', String(isOpen));
  toggleBtn.classList.toggle('is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';

  if (isOpen) {
    // Let the browser paint the closed state first; the next frame then
    // animates both the panel and the hamburger-to-close transition.
    menu.hidden = false;
    window.requestAnimationFrame(() => {
      if (toggleBtn.classList.contains('is-open')) menu.classList.add('is-open');
    });
  } else {
    menu.classList.remove('is-open');
  }

  if (!isOpen) {
    // Remove from layout once the close transition finishes so it
    // can't be tabbed into while invisible.
    window.setTimeout(() => {
      if (!menu.classList.contains('is-open')) menu.hidden = true;
    }, 300);
  }
}

export function initNavigation() {
  const toggleBtn = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggleBtn || !menu) return;

  let isOpen = false;

  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    setMenuState(toggleBtn, menu, isOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      isOpen = false;
      setMenuState(toggleBtn, menu, false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      isOpen = false;
      setMenuState(toggleBtn, menu, false);
      toggleBtn.focus();
    }
  });

  // Collapse the mobile menu automatically if the viewport grows
  // into the desktop breakpoint while it's open.
  window.addEventListener('resize', () => {
    if (isOpen && window.innerWidth >= 960) {
      isOpen = false;
      setMenuState(toggleBtn, menu, false);
    }
  }, { passive: true });
}
