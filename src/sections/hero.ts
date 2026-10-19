import { gsap, ScrollTrigger } from '../core/scroll';
import { motionMedia, motionQuery, qualityTier } from '../core/perf';
import { requireEl } from '../core/dom';
import { PROFILE, SELF_HEAL_SCENARIOS } from '../data/content';
import type { InfraScene } from '../gl/InfraCore';

export function setupHero() {
  let scene: InfraScene | undefined;
  let loading: Promise<void> = Promise.resolve();
  const canvas = requireEl<HTMLCanvasElement>('#hero-canvas');
  if (qualityTier() !== 'low') {
    loading = import('../gl/InfraCore').then(async ({ createInfraCore }) => {
      scene = await createInfraCore(canvas, qualityTier());
    }).catch(() => { canvas.classList.remove('is-ready'); });
  }
  motionQuery.addEventListener('change', () => {
    scene?.dispose();
    scene = undefined;
  });
  document.addEventListener('infra:health', (event) => {
    const { scenario, state } = (event as CustomEvent<{
      scenario: typeof SELF_HEAL_SCENARIOS[number]; state: string;
    }>).detail;
    requireEl('#hud-node').textContent = `${scenario.code} / ${scenario.os}`;
    requireEl('#hud-state').textContent = state;
    requireEl('#hud-log').textContent = state === 'DEGRADED' ? scenario.issue
      : state === 'REMEDIATING' ? scenario.action
        : state === 'RESTORED' ? `Recovery complete / illustrative ${scenario.recoveryTime} cycle`
          : 'Fleet health simulation / not live production data';
    requireEl('#telemetry-hud').setAttribute('data-state', state.toLowerCase());
    requireEl('#hud-fleet').textContent = ['DEGRADED', 'REMEDIATING'].includes(state)
      ? '111 / 112 ONLINE' : '112 / 112 ONLINE';
  });
  gsap.matchMedia().add(`${motionMedia} and (min-width: 801px)`, () => {
    ScrollTrigger.create({
      trigger: '#about', start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (s) => scene?.setProgress(s.progress),
    });
  });
  const typed = requireEl('#typed-text');
  let phrase = 0;
  let index = 0;
  let backwards = false;
  let typeTimer: ReturnType<typeof setTimeout>;
  const type = () => {
    if (motionQuery.matches || document.hidden) {
      typeTimer = setTimeout(type, 1000);
      return;
    }
    const text = PROFILE.typedPhrases[phrase % PROFILE.typedPhrases.length]!;
    index += backwards ? -1 : 1;
    typed.textContent = text.slice(0, index);
    let delay = backwards ? 25 : 42;
    if (index === text.length) { backwards = true; delay = 2400; }
    if (index === 0) { backwards = false; phrase++; delay = 400; }
    typeTimer = setTimeout(type, delay);
  };
  if (!motionQuery.matches) typeTimer = setTimeout(type, 2000);
  motionQuery.addEventListener('change', () => {
    clearTimeout(typeTimer);
    if (motionQuery.matches) typed.textContent = PROFILE.typedPhrases[0];
    else type();
  });
  return loading;
}

export async function runPreloader(ready: Promise<unknown>) {
  let repeat = false;
  try { repeat = sessionStorage.getItem('infra-visited') === 'yes'; } catch { /* Storage may be disabled. */ }
  if (repeat || motionQuery.matches) return;
  document.body.classList.add('is-loading');
  const counter = requireEl('#preloader-counter');
  const fill = requireEl('#preloader-bar');
  const progress = { value: 0 };
  const setProgress = (value: number) => gsap.to(progress, {
    value, duration: .35, onUpdate: () => {
      counter.textContent = Math.round(progress.value).toString().padStart(3, '0');
      fill.style.width = `${progress.value}%`;
    },
  });
  setProgress(10);
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2400));
  await Promise.race([document.fonts.ready, timeout]);
  setProgress(40);
  await Promise.race([ready, timeout]);
  setProgress(100);
  requireEl('#preloader-status').textContent = 'INTERFACE READY';
  await new Promise<void>((resolve) => setTimeout(resolve, 450));
  gsap.to('#preloader', {
    clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'apple',
    onComplete: () => {
      document.body.classList.remove('is-loading');
      try { sessionStorage.setItem('infra-visited', 'yes'); } catch { /* Optional persistence. */ }
    },
  });
  gsap.from('.hero-badges, .hero-title, .hero-typewriter, .hero-description, .hero-cta-row, .hero-stats-grid', {
    y: 30, opacity: 0, duration: 1, stagger: .09, ease: 'apple',
  });
}
