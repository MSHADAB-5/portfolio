import { el, requireEl } from '../core/dom';
import { scrollToSection } from '../core/scroll';
import { PROFILE } from '../data/content';
import { createDialog } from './dialog';
import { searchItems } from './search';

interface Action { label: string; keywords?: string; category: string; run: () => void }
export function setupPalette(openContact: () => void) {
  const root = requireEl('#palette-modal');
  const input = requireEl<HTMLInputElement>('#palette-input');
  const results = requireEl('#palette-results');
  const dialog = createDialog(root, input);
  input.maxLength = 100;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-controls', 'palette-results');
  input.setAttribute('aria-expanded', 'true');
  input.setAttribute('aria-autocomplete', 'list');
  const actions: Action[] = [
    ...[
      ['Overview', '#about'], ['Live terminal', '#terminal'], ['Delivery pipeline', '#pipeline'],
      ['Experience', '#experience'], ['Bengaluru to Sindelfingen', '#corridor'],
      ['Projects', '#projects'], ['Technical stack', '#skills'], ['Awards', '#awards'], ['Contact', '#contact'],
    ].map(([label, id]) => ({ label: `Go to ${label}`, category: 'NAVIGATE', run: () => scrollToSection(id!) })),
    { label: 'Open contact sheet', keywords: 'phone mobile email', category: 'CONNECT', run: openContact },
    { label: 'Copy email address', category: 'CONNECT', run: () => {
      void navigator.clipboard.writeText(PROFILE.email).then(() => {
        requireEl('#contact-toast').textContent = 'Email copied to clipboard.';
        openContact();
      }).catch(openContact);
    } },
    { label: 'Open LinkedIn', category: 'SOCIAL', run: () => { window.open(PROFILE.linkedinUrl, '_blank', 'noopener,noreferrer'); } },
    { label: 'Open GitHub', category: 'SOCIAL', run: () => { window.open(PROFILE.githubUrl, '_blank', 'noopener,noreferrer'); } },
    { label: 'Use reduced motion', category: 'PREFERENCES', run: () => {
      const url = new URL(location.href); url.searchParams.set('motion', 'reduce'); location.assign(url.href);
    } },
    { label: 'Motion: follow system setting', category: 'PREFERENCES', run: () => {
      const url = new URL(location.href); url.searchParams.delete('motion'); location.assign(url.href);
    } },
  ];
  let filtered: Action[] = [];
  let active = 0;
  const execute = (action: Action) => { dialog.close(); action.run(); };
  const highlight = () => {
    [...results.querySelectorAll('[role="option"]')].forEach((node, i) => node.setAttribute('aria-selected', String(i === active)));
    const selected = filtered.length ? results.children[active] : undefined;
    if (selected) {
      input.setAttribute('aria-activedescendant', selected.id);
      selected.scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  };
  const render = () => {
    filtered = searchItems(actions, input.value);
    active = 0;
    results.replaceChildren();
    filtered.forEach((action, i) => {
      const row = el('div', 'palette-item');
      row.id = `palette-result-${i}`;
      row.setAttribute('role', 'option');
      row.append(el('span', '', action.label), el('small', '', action.category));
      row.addEventListener('click', () => execute(action));
      row.addEventListener('pointermove', () => { active = i; highlight(); });
      results.append(row);
    });
    if (!filtered.length) {
      const empty = el('div', 'palette-empty', 'No matching commands.');
      empty.setAttribute('role', 'presentation');
      results.append(empty);
    }
    highlight();
  };
  const open = () => { input.value = ''; dialog.open(); render(); };
  input.addEventListener('input', render);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      active = (active + (event.key === 'ArrowDown' ? 1 : -1) + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1);
      highlight();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const action = filtered[active];
      if (action) execute(action);
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); if (dialog.isOpen) dialog.close(); else open();
    }
  });
  requireEl('#open-palette-btn').addEventListener('click', open);
  requireEl('#footer-cmd-btn').addEventListener('click', open);
}
