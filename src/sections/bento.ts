import { el, requireEl } from '../core/dom';
import { gsap } from '../core/scroll';
import { motionQuery } from '../core/perf';

export function createStatusGrid(count = 56): HTMLElement {
  const grid = el('div', 'node-status-grid');
  grid.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < count; i++) {
    const node = el('span', i === 26 ? 'status-node healing-node' : 'status-node');
    node.style.setProperty('--i', String(i));
    grid.append(node);
  }
  return grid;
}

export function renderBento() {
  const grid = requireEl('#bento-grid');
  const items = [
    { kind: 'fleet', label: '01 / FLEET AUTOMATION', value: '100+', title: 'Environments. One orchestration layer.', body: 'Provisioning, configuration and lifecycle management across Linux, Windows and QNX. Powered by Ansible and AWX.' },
    { kind: 'programs', label: '02 / DELIVERY AT SCALE', value: '10+', title: 'Vehicle programs supported.', body: 'CI/CD workflows that connect platform operations to critical engineering delivery.' },
    { kind: 'patents', label: '03 / INNOVATION', value: '3*', title: 'Ideas beyond the playbook.', body: 'Patent pipeline: two in review, one in filing with the IP team. Department Innovation SPOC.' },
    { kind: 'chatops', label: '04 / AI-AUGMENTED OPERATIONS', value: 'AI', title: 'Less noise. More context.', body: 'Azure OpenAI turns operational alerts into actionable summaries inside Microsoft Teams.' },
    { kind: 'award', label: '05 / RECOGNITION', value: '2025', title: 'Achievement of Excellence.', body: 'Recognized at Mercedes-Benz for resolving critical pipeline and infrastructure escalations.' },
  ];
  items.forEach((item) => {
    const card = el('article', `bento-card bento-${item.kind}`);
    card.setAttribute('data-spotlight', '');
    card.setAttribute('data-tilt', '');
    card.setAttribute('data-reveal', '');
    card.append(el('span', 'bento-label', item.label));
    if (item.kind === 'fleet') card.append(createStatusGrid());
    card.append(el('div', 'bento-value', item.value), el('h3', 'bento-title', item.title), el('p', 'bento-desc', item.body));
    if (item.kind === 'chatops') card.prepend(el('div', 'bento-ai-orb'));
    grid.append(card);
  });
  if (!motionQuery.matches) {
    document.querySelectorAll<HTMLElement>('.stat-counter').forEach((node) => {
      const target = Number(node.dataset.count);
      const state = { n: 0 };
      gsap.to(state, {
        n: target, duration: 1.8, ease: 'power3.out',
        onUpdate: () => { node.textContent = String(Math.round(state.n)); },
        scrollTrigger: { trigger: node, start: 'top 98%', once: true },
      });
    });
  }
}
