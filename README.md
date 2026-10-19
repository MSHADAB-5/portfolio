# Mohammed Shadab / Platform Engineer

A static, scroll-driven DevOps portfolio with an adaptive Three.js infrastructure
scene, interactive terminal, command palette, and a lazily loaded Mercedes-AMG ONE model.

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

The fleet tile uses a user-selected 2023 Mercedes-AMG ONE model by Ddiaz Design,
hosted on Sketchfab under CC BY-NC-SA 4.0. The model is modified for scale,
orientation, framing, and lighting; visible attribution and license links appear
with the model. Its source listing says it derives from Need for Speed Mobile, so
the uploader's underlying rights are not independently established. Review that
provenance before any commercial use. The 9,991,620-byte (9.53 MiB) GLB has 36
embedded PNGs up to 4096px; naïve RGBA decoding is about 78.8 MiB, or 105 MiB
with a full mip chain before driver overhead. It loads only near the tile on
high-tier desktop connections; mobile, reduced-motion, low-tier, data-saver, and
slow-network visits use the locally rendered model poster instead.

Model source: https://sketchfab.com/3d-models/2023-mercedes-benz-amg-one-0f75e0705a1f455585813859d901458a
Creator: https://sketchfab.com/ddiaz-design
License: https://creativecommons.org/licenses/by-nc-sa/4.0/

The AI core, model poster, and sharing image are locally generated. No runtime
request is made to the model host or to an HDR image service.

Dependencies are exact-pinned in `package.json`, with licenses included in their
packages. GSAP is free for this use under its custom Standard License (not OSI
open source). Three.js, Lenis, COBE, and Vite use MIT; postprocessing uses Zlib;
the self-hosted fonts use OFL-1.1. The Grafana, Prometheus, Datadog, and Elastic
Stack orbit icons are inlined from Simple Icons (simple-icons@15.21.0, CC0-1.0).
The Dozzle mark is the official upstream 16px SVG from
[amir20/dozzle](https://github.com/amir20/dozzle/blob/main/assets/logo-16.svg) under
MIT, with its notice in `public/icons/dozzle.LICENSE`; the Agentic AI glyph is an
original drawing.

To regenerate the committed 1200x630 social PNG, optionally use Python with Pillow:

```sh
python3 scripts/generate_social.py
```

## Verification Boundaries

Typecheck, unit tests, and production build run in CI. The tests cover command
parsing, search, content/phone masking, GLB integrity, and model normalization. Visual rendering,
Safari/iOS behavior, keyboard walkthroughs, and Lighthouse scores still require
browser verification; unit tests do not replace those checks.
