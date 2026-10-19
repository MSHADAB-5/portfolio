import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { el, requireEl } from '../core/dom';
import { gsap, ScrollTrigger } from '../core/scroll';
import { PIPELINE_STAGES } from '../data/content';
import { motionMedia } from '../core/perf';

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

export function setupPipeline() {
  const cards = requireEl('#pipeline-cards');
  PIPELINE_STAGES.forEach((stage) => {
    const card = el('article', 'pipeline-card');
    card.append(
      el('span', 'pipeline-step', stage.step),
      el('span', 'pipeline-tool', stage.tool),
      el('h3', 'pipeline-title', stage.title),
      el('p', 'pipeline-description', stage.description),
      el('code', 'pipeline-command', `$ ${stage.command}`),
    );
    cards.append(card);
  });
  gsap.matchMedia().add(`(min-width: 801px) and ${motionMedia}`, () => {
    const track = requireEl('#pipeline-track');
    const viewport = requireEl('#pipeline-viewport');
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth + 60);
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#pipeline-pin-wrap', start: 'top 12%', end: () => `+=${distance()}`,
        pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const active = Math.min(6, Math.floor(self.progress * 7));
          requireEl('#pipeline-stage-counter').textContent = `STAGE ${String(active + 1).padStart(2, '0')} / 07`;
          cards.querySelectorAll('.pipeline-card').forEach((card, i) => card.classList.toggle('is-active', i === active));
        },
      },
    });
    timeline.to(track, { x: () => -distance(), ease: 'none', duration: 1 }, 0)
      .from('#pipeline-wire-active', { drawSVG: '0%', duration: 1, ease: 'none' }, 0)
      .to('#pipeline-packet', {
        motionPath: { path: '#pipeline-wire-active', align: '#pipeline-wire-active', alignOrigin: [.5, .5] },
        duration: 1, ease: 'none',
      }, 0);
    return () => { cards.querySelectorAll('.pipeline-card').forEach((card) => card.classList.remove('is-active')); };
  });
  ScrollTrigger.refresh();
}
