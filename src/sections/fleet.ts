import { el } from '../core/dom';
import { motionQuery, qualityTier } from '../core/perf';

function mercedesMark() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 40 40');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('fleet-brand-mark');
  const circle = document.createElementNS(svg.namespaceURI, 'circle');
  circle.setAttribute('cx', '20'); circle.setAttribute('cy', '20'); circle.setAttribute('r', '17');
  circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', 'currentColor'); circle.setAttribute('stroke-width', '1.3');
  const star = document.createElementNS(svg.namespaceURI, 'path');
  star.setAttribute('d', 'M20 3.8 22.3 18.7 34 28.2 20 22.8 6 28.2 17.7 18.7Z');
  star.setAttribute('fill', 'currentColor');
  svg.append(circle, star);
  return svg;
}

export function createFleetVisual() {
  const stage = el('div', 'fleet-visual');
  stage.setAttribute('aria-label', 'Mercedes-themed GT-inspired concept car with illustrative diagnostic scan');
  const brand = el('div', 'fleet-brand');
  const wordmark = el('div', 'fleet-brand-copy');
  wordmark.append(el('span', '', 'MERCEDES-BENZ'), el('small', '', 'ENGINEERING / CONNECTED ENVIRONMENTS'));
  brand.append(mercedesMark(), wordmark);
  const fallback = el('img', 'fleet-fallback');
  fallback.src = `${import.meta.env.BASE_URL}gt-concept.svg`;
  fallback.alt = '';
  const canvas = el('canvas', 'fleet-canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const status = el('div', 'fleet-scan-label');
  status.setAttribute('aria-hidden', 'true');
  status.append(el('span', 'fleet-scan-dot'), el('span', 'fleet-scan-status', 'ENVIRONMENT HEALTH / SIMULATION'));
  stage.append(brand, fallback, canvas, status,
    el('span', 'fleet-concept-label', 'GT-INSPIRED CONCEPT / NOT AN OFFICIAL VEHICLE MODEL'));
  let dispose: (() => void) | undefined;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting || qualityTier() === 'low') return;
    observer.disconnect();
    void import('../gl/Fleet').then(async ({ mountFleet }) => {
      if (!motionQuery.matches) dispose = await mountFleet(canvas, stage);
    }).catch(() => { stage.classList.remove('is-ready'); });
  }, { rootMargin: '250px' });
  observer.observe(stage);
  motionQuery.addEventListener('change', () => {
    if (motionQuery.matches) { dispose?.(); dispose = undefined; stage.classList.remove('is-ready'); }
  });
  return stage;
}
