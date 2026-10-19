import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { gsap, ScrollTrigger } from '../core/scroll';
import { el, requireEl } from '../core/dom';
import { EXPERIENCE_TIMELINE } from '../data/content';

gsap.registerPlugin(ScrambleTextPlugin);

export function setupExperience() {
  const cards = document.querySelectorAll<HTMLElement>('.experience-card');
  cards.forEach((card, i) => {
    const highlights = EXPERIENCE_TIMELINE[i]?.highlights;
    const list = el('ul', 'exp-highlights');
    highlights?.forEach((text) => list.append(el('li', '', text)));
    card.append(list);
  });
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card, start: 'top 65%', end: 'bottom 35%',
        onEnter: () => activate(card),
        onEnterBack: () => activate(card),
      });
    });
    gsap.to('#experience-rail-fill', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '#experience-list', start: 'top 60%', end: 'bottom 50%', scrub: true },
    });
  });
  function activate(card: HTMLElement) {
    gsap.to('#experience-year-display', {
      duration: .7, scrambleText: { text: card.dataset.year ?? '', chars: '0123456789', speed: .5 },
    });
    requireEl('#experience-date-display').textContent = card.dataset.date ?? '';
    requireEl('#experience-loc-display').textContent = card.dataset.location ?? '';
    cards.forEach((node) => node.classList.toggle('is-active', node === card));
  }
}
