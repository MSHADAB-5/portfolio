import { requireEl } from '../core/dom';
import { qualityTier } from '../core/perf';

export function setupFooter() {
  const clock = requireEl('#footer-clock');
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const update = () => { if (!document.hidden) clock.textContent = formatter.format(new Date()); };
  update(); setInterval(update, 1000);
  const canvas = requireEl<HTMLCanvasElement>('#footer-shader-canvas');
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    observer.disconnect();
    if (qualityTier() !== 'low') {
      void import('../gl/Footer').then(({ mountFooter }) => mountFooter(canvas)).catch(() => { canvas.style.opacity = '0'; });
    }
  }, { rootMargin: '200px' });
  observer.observe(canvas);
}
