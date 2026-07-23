# VIRTUHAI — Landing Page

Static site: HTML5 / CSS3 / vanilla JS (ES modules) / SVG / JSON. No build step, no framework.

## Running locally

**Do not open `index.html` directly via `file://`.** Chrome (and every other
evergreen browser) blocks `<script type="module">` from loading under the
`file://` origin — that's a browser security restriction, not a bug in this
project — so navigation, the theme toggle, and the mobile menu will silently
not work if you just double-click the file. It will work correctly once
deployed to any real HTTP(S) host (Brave1, Netlify, Vercel, S3, etc.).

For local development, serve the folder over HTTP instead:

```bash
# Python (already on most systems, incl. Windows via python.org installer)
cd virtuhai
python -m http.server 8000
# → open http://localhost:8000

# or Node, no install required
cd virtuhai
npx serve .
```

Then open the printed `http://localhost:...` URL — not a `D:/...` path.

## Pending asset: earth horizon image

The Hero's bottom band currently renders as a flat `--color-void` panel
(`.hero__earth` in `css/components/hero.css`) waiting on a real photo/render.
Drop your file at:

```
virtuhai/assets/images/earth-horizon.webp
```

Spec:
- **Format:** WebP preferred (JPG is fine — tell me and I'll swap the one
  `background-image` line in `hero.css`)
- **Aspect ratio:** ~16:5 (band renders `min-height:200px` / `max-height:420px`,
  full viewport width)
- **Size:** ~2400×750px minimum so it stays sharp on large monitors; more if
  you want retina headroom
- **Content:** Earth's night horizon curve, city lights, viewed from orbit —
  matches the reference mockups
- **Weight budget:** keep it compressed to roughly 200–400 KB (it's the
  heaviest single asset on the page — a Lighthouse-100 target doesn't leave
  much room here)

No other code changes needed on my end once the file exists at that path —
`background-size: cover; background-position: top center;` is already wired
up, with `background-color: var(--color-void)` as the fallback so there's
never a broken-image glyph in the meantime.

## Icon sprite

Icons are inlined directly inside `index.html` (right after `<body>`) rather
than loaded from `assets/icons/sprite.svg` via `<use href="external.svg#id">`
— that pattern also breaks under `file://`, and inlining removes an HTTP
request in production too. `assets/icons/sprite.svg` on disk stays the
source of truth; if you add or edit an icon, copy the updated `<symbol>`
block back into `index.html` manually (no build step to automate this).
