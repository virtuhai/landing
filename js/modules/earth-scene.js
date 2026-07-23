/**
 * earth-scene.js — Draws the "night earth" horizon band beneath the
 * Hero on a <canvas>. No photography is fetched or bundled: the
 * sphere, atmospheric rim light and city-light clusters are all
 * generated at runtime, keeping this section a static, license-free
 * asset with a tiny footprint.
 *
 * The layout is static once drawn (redrawn only on resize), so this
 * has no ongoing animation loop and nothing to pause for
 * prefers-reduced-motion.
 */

import { CONFIG } from '../config.js';

/** Small deterministic PRNG so the city-light layout is stable across reloads. */
function mulberry32(seed) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawSphere(ctx, width, height) {
  const radius = width * 0.95;
  const centerX = width / 2;
  const centerY = height + radius * 0.35;

  const gradient = ctx.createRadialGradient(
    centerX, centerY - radius * 0.6, radius * 0.1,
    centerX, centerY, radius
  );
  gradient.addColorStop(0, '#0a1730');
  gradient.addColorStop(0.55, '#060d1c');
  gradient.addColorStop(1, '#020509');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  return { centerX, centerY, radius };
}

function drawRimLight(ctx, width, height, sphere) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(sphere.centerX, sphere.centerY, sphere.radius, 0, Math.PI * 2);
  ctx.clip();

  const rim = ctx.createRadialGradient(
    sphere.centerX, sphere.centerY, sphere.radius - 6,
    sphere.centerX, sphere.centerY, sphere.radius + 2
  );
  rim.addColorStop(0, 'rgba(46, 139, 255, 0)');
  rim.addColorStop(1, 'rgba(88, 170, 255, 0.55)');

  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawCityLights(ctx, width, height, sphere, rand) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(sphere.centerX, sphere.centerY, sphere.radius, 0, Math.PI * 2);
  ctx.clip();

  for (let i = 0; i < CONFIG.earth.clusterCount; i += 1) {
    const clusterX = rand() * width;
    const clusterY = height - rand() * height * 0.65;
    const dotsInCluster = 6 + Math.floor(rand() * 14);

    for (let d = 0; d < dotsInCluster; d += 1) {
      const angle = rand() * Math.PI * 2;
      const dist = rand() * width * 0.03;
      const x = clusterX + Math.cos(angle) * dist;
      const y = clusterY + Math.sin(angle) * dist * 0.6;
      const dotRadius = 0.6 + rand() * 1.3;

      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = rand() > 0.15
        ? 'rgba(255, 179, 92, 0.85)'  // warm city light
        : 'rgba(120, 180, 255, 0.7)'; // occasional cool light
      ctx.fill();
    }
  }
  ctx.restore();
}

export function initEarthScene(canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function render() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Re-seeded on every render so resizing doesn't shift the
    // cluster layout relative to the visible frame.
    const rand = mulberry32(CONFIG.earth.seed);

    const sphere = drawSphere(ctx, width, height);
    drawRimLight(ctx, width, height, sphere);
    drawCityLights(ctx, width, height, sphere, rand);
  }

  render();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(render, 150);
  }, { passive: true });
}
