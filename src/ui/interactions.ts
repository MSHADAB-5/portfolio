import { gsap, ScrollTrigger } from '../core/scroll';
import { finePointer, motionMedia, motionQuery } from '../core/perf';
import { requireEl } from '../core/dom';

export function setupInteractions() {
  const header = requireEl('#site-header');
  header.addEventListener('focusin', () => header.classList.remove('nav-hidden'));
  const toggle = requireEl<HTMLButtonElement>('#nav-mobile-toggle');
  const links = requireEl('#nav-links');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('menu-open', open);
  });
  links.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      header.classList.remove('menu-open');
    }
  });
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (s) => header.classList.toggle('nav-hidden', s.direction === 1 && s.scroll() > 350
      && !header.contains(document.activeElement) && !header.classList.contains('menu-open')),
  });
  document.querySelectorAll<HTMLElement>('.nav-link').forEach((link) => {
    const section = document.getElementById(link.dataset.section ?? '');
    if (!section) return;
    ScrollTrigger.create({
      trigger: section, start: 'top 45%', end: 'bottom 45%',
      onToggle: ({ isActive }) => {
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      },
    });
  });

  gsap.matchMedia().add(`(hover: hover) and (pointer: fine) and ${motionMedia}`, () => {
    const dot = requireEl('#cursor-dot');
    const ring = requireEl('#cursor-ring');
    const label = requireEl('#cursor-label');
    const moveX = gsap.quickTo(ring, 'x', { duration: 0.25 });
    const moveY = gsap.quickTo(ring, 'y', { duration: 0.25 });
    const pointer = (event: PointerEvent) => {
      gsap.set(dot, { x: event.clientX, y: event.clientY });
      moveX(event.clientX);
      moveY(event.clientY);
      dot.classList.add('cursor-visible');
      ring.classList.add('cursor-visible');
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-cursor],button,a');
      ring.classList.toggle('cursor-active', Boolean(target));
      label.textContent = target?.dataset.cursor ?? '';
    };
    document.addEventListener('pointermove', pointer);
    const disposers: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>('[data-magnetic],[data-tilt]').forEach((node) => {
      const onMove = (e: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = Number(node.dataset.magnetic ?? 0);
        gsap.to(node, {
          x: x * strength, y: y * strength, duration: 0.5, ease: 'power3.out',
          rotateY: node.hasAttribute('data-tilt') ? x / rect.width * 5 : 0,
          rotateX: node.hasAttribute('data-tilt') ? -y / rect.height * 5 : 0,
          transformPerspective: 1000,
        });
      };
      const reset = () => gsap.to(node, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.7, ease: 'apple' });
      node.addEventListener('pointermove', onMove);
      node.addEventListener('pointerleave', reset);
      disposers.push(() => {
        node.removeEventListener('pointermove', onMove);
        node.removeEventListener('pointerleave', reset);
        reset();
      });
    });
    return () => {
      document.removeEventListener('pointermove', pointer);
      dot.classList.remove('cursor-visible');
      ring.classList.remove('cursor-visible');
      disposers.forEach((dispose) => dispose());
    };
  });

  if (finePointer.matches && !motionQuery.matches) {
    document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((node) => {
      node.addEventListener('pointermove', (event) => {
        const rect = node.getBoundingClientRect();
        node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      });
    });
  }
}
