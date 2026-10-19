import createGlobe from 'cobe';
import { visibleLoop } from '../core/dom';
import { PROFILE } from '../data/content';
import { motionQuery } from '../core/perf';

export function mountGlobe(canvas: HTMLCanvasElement) {
  let phi = 4.9;
  let target = 4.9;
  let dragging = false;
  let lastX = 0;
  const { bengaluru: blr, sindelfingen: str } = PROFILE.coordinates;
  const ratio = Math.min(devicePixelRatio, 1.5);
  const size = canvas.getBoundingClientRect().width;
  const globe = createGlobe(canvas, {
    width: size * ratio, height: size * ratio, devicePixelRatio: ratio,
    phi, theta: .25, dark: 1, diffuse: 1.5, scale: .95, opacity: 1,
    mapSamples: 13000, mapBrightness: 6, mapBaseBrightness: .05,
    baseColor: [.28, .35, .46], markerColor: [.25, .7, 1], glowColor: [.06, .12, .2],
    markers: [
      { location: [blr.lat, blr.lng], size: .07 },
      { location: [str.lat, str.lng], size: .07, color: [.18, .85, .5] },
    ],
    arcs: [{ from: [blr.lat, blr.lng], to: [str.lat, str.lng] }],
    arcColor: [.22, .7, 1], arcWidth: .7, arcHeight: .3,
  });
  canvas.classList.add('is-ready');
  const resize = new ResizeObserver(() => {
    const width = canvas.getBoundingClientRect().width * ratio;
    globe.update({ width, height: width });
  });
  resize.observe(canvas);
  canvas.addEventListener('pointerdown', (event) => {
    dragging = true; lastX = event.clientX; canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    target += (event.clientX - lastX) * .005;
    lastX = event.clientX;
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-globe-focus]');
  const focus = (name: string) => {
    target = name === 'sindelfingen' ? 6.1 : 4.9;
    buttons.forEach((button) => {
      const active = button.dataset.globeFocus === name;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  buttons.forEach((button) => {
    button.addEventListener('click', () => focus(button.dataset.globeFocus ?? 'bengaluru'));
  });
  focus('bengaluru');
  const stop = visibleLoop(canvas, (_, delta) => {
    if (motionQuery.matches) return;
    phi += (target - phi) * (1 - Math.exp(-delta * 4));
    globe.update({ phi });
  });
  const loss = () => { stop(); canvas.classList.remove('is-ready'); };
  canvas.addEventListener('webglcontextlost', loss);
}
