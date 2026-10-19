import { gsap, ScrollTrigger } from './scroll';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(CustomEase, SplitText);
CustomEase.create('apple', '0.16,1,0.3,1');
export { SplitText };

export function setupReveals() {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => {
      gsap.from(node, {
        y: 35, opacity: 0, duration: 0.9, ease: 'apple',
        scrollTrigger: { trigger: node, start: 'top 92%', once: true },
      });
    });
    const copy = document.querySelector('#manifesto-copy');
    const split = copy ? SplitText.create(copy, { type: 'words', aria: 'auto' }) : undefined;
    if (split) {
      gsap.fromTo(split.words, { color: '#41434c' }, {
        color: '#f5f5f7', stagger: 0.08, ease: 'none',
        scrollTrigger: { trigger: copy, start: 'top 78%', end: 'bottom 35%', scrub: 0.5 },
      });
    }
    return () => split?.revert();
  });
  ScrollTrigger.refresh();
}
