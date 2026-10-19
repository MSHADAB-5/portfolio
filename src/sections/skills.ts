import { el, requireEl, visibleLoop } from '../core/dom';
import { motionQuery } from '../core/perf';
import { ORBIT_TOOLS, SKILL_CATEGORIES } from '../data/content';

export function setupSkills() {
  const matrix = requireEl('#skills-matrix');
  SKILL_CATEGORIES.forEach((category, index) => {
    const block = el('article', 'skill-category');
    block.append(el('div', 'skill-category-index', `0${index + 1} / CAPABILITY`), el('h3', '', category.title), el('p', 'skill-category-caption', category.caption));
    const chips = el('div', 'skill-chips');
    category.items.forEach((item) => {
      const chip = el('div', 'skill-chip');
      chip.append(el('span', '', item.name));
      if (item.tier) chip.append(el('span', `skill-tier tier-${item.tier.toLowerCase()}`, item.tier));
      chips.append(chip);
    });
    block.append(chips);
    matrix.append(block);
  });
  const stage = requireEl('#orbit-stage');
  const sphere = requireEl('#orbit-sphere');
  const compactOrbit = matchMedia('(max-width: 800px)');
  stage.tabIndex = 0;
  const updateOrbitLabel = () => stage.setAttribute('aria-label', compactOrbit.matches
    ? 'Toolchain tools. Select a tool to inspect its domain.'
    : 'Toolchain sphere. Drag or use arrow keys to rotate. Tab through tools to select.');
  updateOrbitLabel();
  const tools = ORBIT_TOOLS.map((tool, i) => {
    const button = el('button', 'orbit-tool');
    button.type = 'button';
    button.setAttribute('aria-label', `${tool.name} / ${tool.category}`);
    button.style.setProperty('--tool-color', tool.color);
    if (tool.iconUrl) {
      const icon = el('img', 'orbit-tool-image');
      icon.src = `${import.meta.env.BASE_URL}${tool.iconUrl}`;
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
      button.append(icon);
    } else if (tool.svgPath) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', tool.svgPath);
      svg.append(path);
      button.append(svg);
    }
    button.append(el('span', '', tool.name));
    const select = () => { requireEl('#orbit-active-label').textContent = `${tool.name} / ${tool.category}`; };
    button.addEventListener('click', select);
    button.addEventListener('focus', select);
    sphere.append(button);
    const y = 1 - (i / (ORBIT_TOOLS.length - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    return { button, x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
  });
  let rx = .25;
  let ry = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velocity = 0;
  const render = () => {
    if (compactOrbit.matches) {
      tools.forEach(({ button }) => {
        button.style.transform = '';
        button.style.opacity = '';
        button.style.zIndex = '';
      });
      return;
    }
    const radius = Math.min(stage.clientWidth * .42, 220);
    tools.forEach(({ button, x, y, z }) => {
      const a = x * Math.cos(ry) + z * Math.sin(ry);
      const b = -x * Math.sin(ry) + z * Math.cos(ry);
      const c = y * Math.cos(rx) - b * Math.sin(rx);
      const depth = y * Math.sin(rx) + b * Math.cos(rx);
      button.style.transform = `translate3d(${a * radius}px,${c * radius}px,${depth * radius}px) translate(-50%,-50%) scale(${.78 + (depth + 1) * .11})`;
      button.style.opacity = String(.28 + (depth + 1) * .36);
      button.style.zIndex = String(Math.round((depth + 1) * 100));
    });
  };
  stage.addEventListener('pointerdown', (e) => {
    if (compactOrbit.matches) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    if (!(e.target as HTMLElement).closest('button')) stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    velocity = (e.clientX - lastX) * .006;
    ry += velocity; rx += (e.clientY - lastY) * .003;
    lastX = e.clientX; lastY = e.clientY;
    render();
  });
  window.addEventListener('pointerup', () => { dragging = false; });
  stage.addEventListener('pointercancel', () => { dragging = false; });
  stage.addEventListener('keydown', (event) => {
    if (compactOrbit.matches) return;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') ry -= .15;
    if (event.key === 'ArrowRight') ry += .15;
    if (event.key === 'ArrowUp') rx -= .15;
    if (event.key === 'ArrowDown') rx += .15;
    render();
  });
  new ResizeObserver(render).observe(stage);
  compactOrbit.addEventListener('change', () => { updateOrbitLabel(); render(); });
  render();
  visibleLoop(stage, (_, delta) => {
    if (motionQuery.matches || dragging || stage.contains(document.activeElement)) return;
    ry += delta * .08 + velocity * delta * 8;
    velocity *= Math.exp(-delta * 4);
    render();
  });
}
