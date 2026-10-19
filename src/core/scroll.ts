import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { motionQuery } from './perf';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
let lenis: Lenis | undefined;

export function setupScroll() {
  const apply = () => {
    lenis?.destroy();
    lenis = undefined;
    if (!motionQuery.matches) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: { offset: -100 } });
      lenis.on('scroll', ScrollTrigger.update);
    }
  };
  apply();
  motionQuery.addEventListener('change', apply);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  gsap.to('#scroll-progress-bar', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: true },
  });
}

export function scrollToSection(target: string) {
  if (lenis) lenis.scrollTo(target, { offset: -100 });
  else document.querySelector(target)?.scrollIntoView({ behavior: 'instant' });
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.classList.toggle('modal-open', locked);
}
