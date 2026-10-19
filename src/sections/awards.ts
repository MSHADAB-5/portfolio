import { el, requireEl } from '../core/dom';
import { AWARDS } from '../data/content';

export function renderAwards() {
  const list = requireEl('#awards-list');
  AWARDS.forEach((award) => {
    const row = el('article', 'award-row');
    row.setAttribute('data-spotlight', '');
    row.setAttribute('data-reveal', '');
    const copy = el('div', 'award-copy');
    copy.append(el('div', 'award-badge', award.badge), el('h3', '', award.title), el('p', '', award.description), el('div', 'award-org', award.org));
    const year = el('span', award.year ? 'award-year' : 'award-year award-year-cert', award.year ?? 'CERT');
    row.append(year, copy, el('span', 'award-symbol', '↗'));
    list.append(row);
  });
}
