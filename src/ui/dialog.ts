import { gsap, lockScroll } from '../core/scroll';
import { motionQuery } from '../core/perf';

let active: ReturnType<typeof createDialog> | undefined;

export function createDialog(root: HTMLElement, initialFocus: HTMLElement) {
  let previousFocus: HTMLElement | null = null;
  let inertSiblings: { node: HTMLElement; wasInert: boolean }[] = [];
  const dialog = {
    get isOpen() { return root.classList.contains('is-open'); },
    open() {
      if (dialog.isOpen) return;
      active?.close();
      previousFocus = document.activeElement as HTMLElement | null;
      active = dialog;
      root.classList.add('is-open');
      root.setAttribute('aria-hidden', 'false');
      inertSiblings = [...document.body.children].filter((node): node is HTMLElement => node instanceof HTMLElement && node !== root)
        .map((node) => ({ node, wasInert: node.inert }));
      inertSiblings.forEach(({ node }) => { node.inert = true; });
      lockScroll(true);
      initialFocus.focus({ preventScroll: true });
      if (!motionQuery.matches) gsap.fromTo(root.firstElementChild, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'apple' });
    },
    close() {
      if (!dialog.isOpen) return;
      inertSiblings.forEach(({ node, wasInert }) => { node.inert = wasInert; });
      inertSiblings = [];
      lockScroll(false);
      active = undefined;
      previousFocus?.focus({ preventScroll: true });
      if (root.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur();
      root.classList.remove('is-open');
      root.setAttribute('aria-hidden', 'true');
    },
  };
  root.addEventListener('click', (e) => { if (e.target === root) dialog.close(); });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
    if (event.key !== 'Tab') return;
    const focusable = [...root.querySelectorAll<HTMLElement>('button:not(:disabled),input,a[href],[tabindex="0"]')]
      .filter((node) => node.offsetParent !== null);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  });
  return dialog;
}
