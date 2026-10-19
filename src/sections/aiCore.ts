import { el } from '../core/dom';
import { motionQuery, qualityTier } from '../core/perf';

export function createAICore() {
  const stage = el('div', 'ai-core-stage');
  stage.setAttribute('aria-hidden', 'true');
  const fallback = el('div', 'ai-core-fallback');
  fallback.append(el('span', 'ai-core-layer layer-bottom'), el('span', 'ai-core-layer layer-middle'),
    el('span', 'ai-core-layer layer-top'), el('span', 'ai-core-die', 'AI'));
  const canvas = el('canvas', 'ai-core-canvas');
  stage.append(fallback, canvas, el('span', 'ai-core-caption', 'INFERENCE / ORCHESTRATION'));
  let dispose: (() => void) | undefined;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting || qualityTier() === 'low') return;
    observer.disconnect();
    void import('../gl/AICore').then(async ({ mountAICore }) => {
      if (!motionQuery.matches) dispose = await mountAICore(canvas, stage);
    }).catch(() => { stage.classList.remove('is-ready'); });
  }, { rootMargin: '250px' });
  observer.observe(stage);
  motionQuery.addEventListener('change', () => {
    if (motionQuery.matches) {
      dispose?.(); dispose = undefined;
      stage.classList.remove('is-ready');
    }
  });
  return stage;
}
