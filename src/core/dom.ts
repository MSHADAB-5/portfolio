export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K, className = '', text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function requireEl<T extends Element = HTMLElement>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error('Required interface element is missing');
  return node;
}

export function visibleLoop(target: Element, frame: (seconds: number, delta: number) => void) {
  let inView = false;
  let raf = 0;
  let previous = 0;
  let elapsed = 0;
  const render = (now: number) => {
    const delta = previous ? Math.min((now - previous) / 1000, 0.06) : 0;
    previous = now;
    elapsed += delta;
    frame(elapsed, delta);
    raf = requestAnimationFrame(render);
  };
  const sync = () => {
    cancelAnimationFrame(raf);
    previous = 0;
    if (inView && !document.hidden) raf = requestAnimationFrame(render);
  };
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false;
    sync();
  });
  observer.observe(target);
  document.addEventListener('visibilitychange', sync);
  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    cancelAnimationFrame(raf);
  };
}
