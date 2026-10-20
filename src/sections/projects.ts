import { el, requireEl } from '../core/dom';
import { gsap } from '../core/scroll';
import { PROJECTS, type ProjectItem } from '../data/content';
import { createStatusGrid } from './bento';
import { motionMedia } from '../core/perf';

function projectVisual(project: ProjectItem) {
  const visual = el('div', `project-visual visual-${project.visualType}`);
  visual.setAttribute('aria-hidden', 'true');
  visual.append(el('span', 'visual-caption', 'WORKFLOW SKETCH / ILLUSTRATIVE'));
  if (project.visualType === 'ansible-yaml') {
    const code = el('div', 'code-sketch');
    const lines = [
      ['comment', '# deploy.yml / environment lifecycle'],
      ['key', '- name: Provision & configure'],
      ['value', '  hosts: platform_environments'],
      ['value', '  gather_facts: true'],
      ['key', '  roles:'],
      ['value', '    - provision'],
      ['value', '    - configure'],
      ['value', '    - health_check'],
      ['comment', '# Linux / Windows / QNX'],
    ];
    lines.forEach(([tone, line], i) => {
      const row = el('div', `code-line code-${tone}`);
      row.append(el('span', 'line-num', String(i + 1).padStart(2, '0')), el('span', '', line));
      code.append(row);
    });
    visual.append(code, el('div', 'code-result', '✓ Provision → Configure → Validate'));
  } else if (project.visualType === 'chatops-bot') {
    visual.append(
      el('div', 'chat-bubble chat-user', 'Summarize the environment alert.'),
      el('div', 'chat-identity', 'OPS COPILOT / AZURE OPENAI'),
      el('div', 'chat-bubble chat-bot', 'A health probe detected a degraded environment. The alert is summarized and routed to the appropriate automation workflow.'),
      el('div', 'chat-action', 'Review alert → Trigger playbook'),
    );
  } else if (project.visualType === 'self-healing') {
    visual.append(el('div', 'heal-state', 'DETECT → DIAGNOSE → RECOVER'), createStatusGrid(64), el('div', 'code-result', 'Autonomous recovery / service restart → re-provision'));
  } else {
    visual.append(el('div', 'patent-count', '03*'));
    const list = el('div', 'patent-states');
    list.append(el('span', '', '02 / In jury review'), el('span', '', '01 / In grant pipeline'));
    visual.append(list);
  }
  return visual;
}

export function setupProjects() {
  const stack = requireEl('#projects-stack');
  PROJECTS.forEach((project) => {
    const card = el('article', 'project-card');
    card.style.setProperty('--project-accent', project.accent);
    const copy = el('div', 'project-copy');
    copy.append(
      el('span', 'project-eyebrow', `${project.index} / ${project.eyebrow}`),
      el('h3', 'project-title', project.title),
      el('p', 'project-subtitle', project.subtitle),
      el('p', 'project-desc', project.description),
    );
    const tags = el('div', 'project-tags');
    project.tags.forEach((tag) => tags.append(el('span', 'mono-tag', tag)));
    copy.append(tags);
    card.append(copy, projectVisual(project));
    stack.append(card);
  });
  gsap.matchMedia().add(motionMedia, () => {
    const cards = [...stack.querySelectorAll<HTMLElement>('.project-card')];
    cards.forEach((card) => {
      const copy = card.querySelector<HTMLElement>('.project-copy')!;
      const visual = card.querySelector<HTMLElement>('.project-visual')!;
      gsap.timeline({
        defaults: { ease: 'power3.out', clearProps: 'transform,opacity,visibility' },
        scrollTrigger: { trigger: card, start: 'top 82%', once: true },
      })
        .fromTo(card, { y: 56, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .9 })
        .fromTo(copy.children, { y: 20, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: .65, stagger: .075,
        }, .12)
        .fromTo(visual, { x: 36, autoAlpha: 0 }, {
          x: 0, autoAlpha: 1, duration: .85,
        }, .24);
    });
  });
}
