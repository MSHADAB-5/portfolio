import { el, requireEl } from '../core/dom';
import { gsap } from '../core/scroll';
import { motionMedia, motionQuery } from '../core/perf';
import { TERMINAL_BOOT_SCRIPT } from '../data/content';
import { completeCommand, MAX_COMMAND_LENGTH, runCommand } from '../terminal/commands';

export function setupTerminal(openContact: () => void) {
  const body = requireEl('#terminal-body');
  const input = requireEl<HTMLInputElement>('#terminal-input');
  const form = requireEl<HTMLFormElement>('#terminal-form');
  const history: string[] = [];
  let historyIndex = 0;
  let draft = '';
  let timer: ReturnType<typeof setTimeout> | undefined;
  let scriptIndex = 0;
  let demoActive = false;
  input.maxLength = MAX_COMMAND_LENGTH;
  // Announce user-command results, not every line of the decorative demo.
  body.setAttribute('aria-live', 'off');
  const status = el('div', 'sr-only');
  status.setAttribute('role', 'status');
  form.append(status);
  const append = (text: string, tone = 'output') => {
    body.append(el('div', `terminal-line line-${tone}`, text || '\u00a0'));
    while (body.children.length > 300) body.firstElementChild?.remove();
    body.scrollTop = body.scrollHeight;
  };
  const stop = () => {
    clearTimeout(timer);
    demoActive = false;
  };
  const step = () => {
    if (!demoActive) return;
    if (!document.hidden) {
      const line = TERMINAL_BOOT_SCRIPT[scriptIndex++];
      if (!line) { stop(); return; }
      append(`${line.prompt ?? ''}${line.text}`, line.type);
    }
    timer = setTimeout(step, TERMINAL_BOOT_SCRIPT[scriptIndex]?.type === 'cmd' ? 400 : 110);
  };
  const run = (value: string) => {
    stop();
    const result = runCommand(value, history);
    if (value.trim()) {
      history.push(value);
      if (history.length > 50) history.shift();
    }
    historyIndex = history.length;
    if (result.action === 'clear') body.replaceChildren();
    else {
      append(`shadab@portfolio:~$ ${value}`, 'cmd');
      result.lines.forEach((line) => append(line, result.tone));
    }
    status.textContent = result.lines.join(' ').slice(0, 600);
    if (result.action === 'contact') openContact();
    input.value = '';
  };
  const start = () => {
    stop();
    scriptIndex = 0;
    body.replaceChildren();
    append('ILLUSTRATIVE OPS DEMO / NOT CONNECTED TO PRODUCTION', 'warn');
    demoActive = true;
    step();
  };
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    if (!motionQuery.matches) start();
    else append('Interactive shell ready. Type help to explore.', 'info');
    observer.disconnect();
  }, { threshold: 0.2 });
  observer.observe(body);
  form.addEventListener('submit', (event) => { event.preventDefault(); run(input.value); });
  input.addEventListener('focus', stop);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') input.blur();
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === history.length) draft = input.value;
      historyIndex = Math.max(0, Math.min(history.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
      input.value = history[historyIndex] ?? draft;
    }
    if (event.key === 'Tab') {
      const matches = completeCommand(input.value);
      if (matches.length === 1) { event.preventDefault(); input.value = matches[0]!; }
      else if (input.value) append(matches.join('  '), 'info');
    }
  });
  document.querySelectorAll<HTMLButtonElement>('[data-cmd]').forEach((button) => {
    button.addEventListener('click', () => run(button.dataset.cmd ?? ''));
  });
  requireEl('#terminal-replay-btn').addEventListener('click', start);
  requireEl('#terminal-skip-btn').addEventListener('click', () => {
    stop(); append('Demo paused. Type help for commands.', 'info'); input.focus({ preventScroll: true });
  });
  motionQuery.addEventListener('change', () => { if (motionQuery.matches) stop(); });
  gsap.matchMedia().add(motionMedia, () => {
    gsap.from('#terminal-window', {
      rotationX: 28, scale: .88, transformPerspective: 1600, transformOrigin: 'center bottom',
      scrollTrigger: { trigger: '#terminal-stage', start: 'top 95%', end: 'top 35%', scrub: 1 },
    });
  });
}
