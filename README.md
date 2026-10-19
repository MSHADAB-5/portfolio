# Mohammed Shadab / Platform Engineer

A static, scroll-driven DevOps portfolio with an adaptive Three.js infrastructure
scene, interactive terminal, command palette, and Mercedes-themed GT concept visualization.

## Local Development

Use Node 24 (see `.nvmrc`).

```sh
nvm use
npm ci
npm run dev
```

Open `http://localhost:5173/portfolio/`.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

The production preview is at `http://localhost:4173/portfolio/`.

## GitHub Pages

Set repository Settings > Pages > Source to **GitHub Actions**, then merge the
reviewed feature branch through a pull request. The deployment workflow publishes
`dist/` on pushes to `main`. No API keys, paid hosting, or backend is required.

The configured base path is `/portfolio/`. Update `vite.config.ts` and the canonical/
social URLs in `index.html` if the repository name or domain changes.

## Visuals And Accessibility

- Native semantic overview and career content, plus build-time no-JavaScript resume fallback.
- WebGL scenes load lazily, stop drawing offscreen/in background tabs, and have static fallbacks.
- `?tier=low` skips WebGL. `?motion=reduce` disables decorative motion; system reduced-motion settings also apply.
- Terminal commands are allowlisted simulations. They never execute OS commands or contact production services.
- Dialogs support Escape, focus trapping, background isolation, and focus restoration.
- Clipboard failures display a manual-copy alternative.
- The public phone is only masked, not secret; its old value remains in git history.

## Assets And Licenses

The car is original procedural geometry inspired by the proportions of a GT coupe,
not an official or licensed AMG GT model. Mercedes-Benz marks identify the
professional/automotive context; all trademarks belong to their respective owners.
The AI core, posters, and sharing image are locally generated; no downloaded car
models, HDR images, or paid asset services are used.

Dependencies are exact-pinned in `package.json`, with licenses included in their
packages. GSAP is free for this use under its custom Standard License (not OSI
open source). Three.js, Lenis, COBE, and Vite use MIT; postprocessing uses Zlib;
the self-hosted fonts use OFL-1.1.

To regenerate the committed 1200x630 social PNG, optionally use Python with Pillow:

```sh
python3 scripts/generate_social.py
```

## Verification Boundaries

Typecheck, unit tests, and production build run in CI. The tests cover command
parsing, search, content/phone masking, and procedural geometry. Visual rendering,
Safari/iOS behavior, keyboard walkthroughs, and Lighthouse scores still require
browser verification; unit tests do not replace those checks.
