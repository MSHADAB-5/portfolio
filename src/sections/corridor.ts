import { requireEl } from '../core/dom';
import { qualityTier } from '../core/perf';

export function setupCorridor() {
  const canvas = requireEl<HTMLCanvasElement>('#cobe-canvas');
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    observer.disconnect();
    if (qualityTier() !== 'low') {
      void import('../gl/Globe').then(({ mountGlobe }) => mountGlobe(canvas)).catch(() => {
        canvas.classList.remove('is-ready');
      });
    }
  }, { rootMargin: '400px' });
  observer.observe(canvas);
}
