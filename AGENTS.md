# Portfolio — Project Guide

Interactive 3D & scroll-driven portfolio for **Mohammed Shadab** (Platform Engineer at Mercedes-Benz R&D India), hosted at `https://mshadab-5.github.io/portfolio/`.

## Stack

- **Bundler:** Vite 8 + vanilla TypeScript (strict)
- **Motion:** GSAP 3.15 (`ScrollTrigger`, `SplitText`, `ScrambleTextPlugin`, `DrawSVGPlugin`, `MotionPathPlugin`, `CustomEase`) + Lenis 1.3.26 smooth scroll
- **3D & Shaders:** Three.js 0.186.1 (`InstancedMesh`, custom GLSL shaders) + `postprocessing` 6.39.5 (`BloomEffect`, `VignetteEffect`) + `cobe` 2.0.1 WebGL globe
- **Fonts:** Self-hosted `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono` with system SF Pro priority stack on Apple devices

## Commands

- Use Node 24 (`nvm use`) for the supported toolchain. This machine's Node 25 runs the checks but is outside Vitest's supported engine range.
- `npm ci` — Install the locked dependencies
- `npm run dev` — Start local Vite dev server
- `npm run typecheck` — Run TypeScript strict type checking (`tsc --noEmit`)
- `npm test` — Run Vitest unit tests (`tests/`)
- `npm run build` — Typecheck and build production bundle into `dist/` (with `base: '/portfolio/'`)
- `npm run preview` — Preview production bundle locally (`http://localhost:4173/portfolio/`)

## Deployment

GitHub Actions workflow `.github/workflows/deploy.yml` builds and publishes `./dist` to GitHub Pages on push to `main`. Ensure **Settings → Pages → Source** is set to **GitHub Actions**.

## Architecture & Conventions

- Structured portfolio content lives in `src/data/content.ts`; overview, contact, and timeline markup is also present in `index.html`.
- Never use `innerHTML` with user input (e.g., in the interactive terminal or command palette); construct DOM nodes with `document.createElement` and `textContent`.
- The phone is masked until explicitly revealed. This is scraper friction, not secrecy: determined visitors can decode the client bundle, and the old number remains in git history.
- WebGL scenes (`src/gl/InfraCore.ts` and `src/gl/Globe.ts`) are dynamically imported and automatically pause when off-viewport or when `document.hidden` is true, and respect `prefers-reduced-motion: reduce` and `?tier=low`.
- The fleet visualization uses an original GT-inspired procedural car, not an official AMG GT model. Mercedes-Benz marks are used for professional context; no third-party car model or photo is bundled.
- `?motion=reduce` disables decorative motion; `?tier=low` skips WebGL. Animated telemetry is illustrative, not a real production feed.
