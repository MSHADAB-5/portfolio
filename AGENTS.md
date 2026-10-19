# Portfolio — Project Guide

Interactive 3D & scroll-driven portfolio for **Mohammed Shadab** (Platform Engineer at Mercedes-Benz R&D India), hosted at `https://mshadab-5.github.io/portfolio/`.

## Stack

- **Bundler:** Vite 8 + vanilla TypeScript (strict)
- **Motion:** GSAP 3.15 (`ScrollTrigger`, `SplitText`, `ScrambleTextPlugin`, `DrawSVGPlugin`, `MotionPathPlugin`, `Flip`, `Observer`, `CustomEase`) + Lenis 1.3.26 smooth scroll
- **3D & Shaders:** Three.js 0.186.1 (`InstancedMesh`, custom GLSL shaders) + `postprocessing` 6.39.5 (`BloomEffect`, `VignetteEffect`) + `cobe` 2.0.1 WebGL globe
- **Fonts:** Self-hosted `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono` with system SF Pro priority stack on Apple devices

## Commands

- `npm install` — Install dependencies
- `npm run dev` — Start local Vite dev server
- `npm run typecheck` — Run TypeScript strict type checking (`tsc --noEmit`)
- `npm test` — Run Vitest unit tests (`tests/`)
- `npm run build` — Typecheck and build production bundle into `dist/` (with `base: '/portfolio/'`)
- `npm run preview` — Preview production bundle locally (`http://localhost:4173/portfolio/`)

## Deployment

GitHub Actions workflow `.github/workflows/deploy.yml` builds and publishes `./dist` to GitHub Pages on push to `main`. Ensure **Settings → Pages → Source** is set to **GitHub Actions**.

## Architecture & Conventions

- All portfolio copy and structured data live in `src/data/content.ts`.
- Never use `innerHTML` with user input (e.g., in the interactive terminal or command palette); construct DOM nodes with `document.createElement` and `textContent`.
- Phone number is stored split/encoded in `src/data/content.ts` and only assembled on explicit user click ("Reveal") so plain-text scrapers do not harvest it from `dist/index.html`.
- WebGL scenes (`src/gl/InfraCore.ts` and `src/gl/Globe.ts`) are dynamically imported and automatically pause when off-viewport or when `document.hidden` is true, and respect `prefers-reduced-motion: reduce` and `?tier=low`.
