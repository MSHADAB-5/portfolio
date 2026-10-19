import { el } from '../core/dom';
import { finePointer, motionQuery, qualityTier } from '../core/perf';

function shouldLoadModel() {
  if (qualityTier() !== 'high' || !finePointer.matches) return false;
  const connection = (navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean };
  }).connection;
  return !connection?.saveData && !['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '');
}

function creditLink(label: string, href: string) {
  const link = el('a', 'fleet-credit-link', label);
  link.href = href;
  link.target = '_blank';
  link.rel = 'noreferrer';
  return link;
}

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
  stage.setAttribute('aria-label', '2023 Mercedes-AMG ONE model by Ddiaz Design, licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0');
  const brand = el('div', 'fleet-brand');
  const wordmark = el('div', 'fleet-brand-copy');
  wordmark.append(el('span', '', 'MERCEDES-BENZ'), el('small', '', 'ENGINEERING / CONNECTED ENVIRONMENTS'));
  brand.append(mercedesMark(), wordmark);
  const fallback = el('img', 'fleet-fallback');
  fallback.src = `${import.meta.env.BASE_URL}models/amg-one-poster.png`;
  fallback.alt = '';
  const canvas = el('canvas', 'fleet-canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const status = el('div', 'fleet-scan-label');
  status.setAttribute('aria-hidden', 'true');
  status.append(el('span', 'fleet-scan-dot'), el('span', 'fleet-scan-status', 'ENVIRONMENT HEALTH / NOMINAL'));
  const credits = el('div', 'fleet-credits');
  credits.append(
    document.createTextNode('3D model: '),
    creditLink('Ddiaz Design', 'https://sketchfab.com/ddiaz-design'),
    document.createTextNode(' · '),
    creditLink('Sketchfab source', 'https://sketchfab.com/3d-models/2023-mercedes-benz-amg-one-0f75e0705a1f455585813859d901458a'),
    document.createTextNode(' · '),
    creditLink('CC BY-NC-SA 4.0', 'https://creativecommons.org/licenses/by-nc-sa/4.0/'),
    document.createTextNode(' · Modified: normalized, reframed and relit'),
  );
  stage.append(brand, fallback, canvas, status, credits);
  let dispose: (() => void) | undefined;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting || !shouldLoadModel()) return;
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
