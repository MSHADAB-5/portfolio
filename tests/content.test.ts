import { describe, expect, it } from 'vitest';
import {
  AWARDS,
  decodePhoneNumber,
  EXPERIENCE_TIMELINE,
  getMaskedPhonePreview,
  HERO_STATS,
  ORBIT_TOOLS,
  PROFILE,
  PROJECTS,
} from '../src/data/content';

describe('content & phone obfuscation', () => {
  it('decodes phone number only at runtime via char codes', () => {
    const decoded = decodePhoneNumber();
    expect(decoded).toMatch(/^\+91-\d{10}$/);
    expect(decoded.endsWith('35')).toBe(true);
  });

  it('returns masked phone preview for initial DOM render', () => {
    const masked = getMaskedPhonePreview();
    expect(masked).toBe('+91-9741••••35');
    expect(masked).not.toBe(decodePhoneNumber());
  });

  it('preserves core profile and stat metrics', () => {
    expect(PROFILE.name).toBe('Mohammed Shadab');
    expect(HERO_STATS).toHaveLength(4);
    expect(HERO_STATS[0]?.value).toBe(100);
  });

  it('emphasizes ownership and keeps the static hero aligned with profile content', () => {
    const pages = import.meta.glob('../index.html', { query: '?raw', import: 'default', eager: true });
    const html = String(Object.values(pages)[0]).replace(/\s+/g, ' ').replaceAll('&amp;', '&');
    expect(html).toContain(PROFILE.headline);
    expect(html).toContain(PROFILE.subheadline);
    expect(html).toContain(PROFILE.manifesto);
    expect(PROFILE.subheadline).toContain('ADAS ECU test farm with 100+ benches');
    expect(PROFILE.subheadline).toContain('lead a team');
    expect(PROFILE.manifesto).toContain('prevent escalations');
    expect(HERO_STATS.find((stat) => stat.label === 'Engineers Led')?.value).toBe(2);
  });
});

describe('orbit tools', () => {
  it('has 18 entries including the six observability/AI additions', () => {
    expect(ORBIT_TOOLS).toHaveLength(18);
    const names = ORBIT_TOOLS.map((tool) => tool.name);
    for (const name of ['Grafana', 'Prometheus', 'Datadog', 'ELK Stack', 'Dozzle', 'Agentic AI']) {
      expect(names).toContain(name);
    }
  });

  it('uses an inline glyph or self-hosted svg for every tool', () => {
    for (const tool of ORBIT_TOOLS) {
      if (tool.iconUrl) {
        expect(tool.iconUrl).toMatch(/^icons\/[a-z0-9-]+\.svg$/);
      } else {
        expect(tool.svgPath?.trim()).toMatch(/^[Mm]\s*-?[\d.]/);
      }
    }
    expect(ORBIT_TOOLS.find((tool) => tool.name === 'Dozzle')?.iconUrl).toBe('icons/dozzle.svg');
    const dozzleIcon = import.meta.glob('../public/icons/dozzle.svg', {
      query: '?raw', import: 'default', eager: true,
    });
    expect(Object.values(dozzleIcon)[0]).toContain('viewBox="0 0 16 16"');
    const dozzleLicense = import.meta.glob('../public/icons/dozzle.LICENSE', {
      query: '?raw', import: 'default', eager: true,
    });
    expect(Object.values(dozzleLicense)[0]).toContain('Copyright (c) 2025 Amir Raminfar');
  });
});

describe('featured projects', () => {
  it('lists exactly four projects without the Germany deployment', () => {
    expect(PROJECTS).toHaveLength(4);
    expect(PROJECTS.map((project) => project.id)).not.toContain('germany-deployment');
  });

  it('keeps contiguous 01-04 index values', () => {
    expect(PROJECTS.map((project) => project.index)).toEqual(['01', '02', '03', '04']);
  });

  it('still covers the Sindelfingen deployment in the experience timeline', () => {
    const text = EXPERIENCE_TIMELINE.map((entry) => `${entry.title} ${entry.location} ${entry.description}`).join(' ');
    expect(text).toContain('Sindelfingen');
    expect(text).toContain('Germany');
  });
});

describe('awards & certifications', () => {
  it('includes the two undated recognition entries without a year property', () => {
    const imt = AWARDS.find((award) => award.title === 'Impact Mentor Training (IMT)');
    const istqb = AWARDS.find((award) => award.title.startsWith('ISTQB Certified Tester'));
    expect(imt).toBeDefined();
    expect(istqb).toBeDefined();
    expect(imt).not.toHaveProperty('year');
    expect(istqb).not.toHaveProperty('year');
  });

  it('keeps years on the existing dated awards', () => {
    const dated = AWARDS.filter((award) => 'year' in award);
    expect(dated.length).toBe(3);
    for (const award of dated) expect(award.year).toMatch(/^\d{4}$/);
  });
});

describe('source hygiene', () => {
  it('never embeds local certificate files or file URLs', () => {
    const sources = import.meta.glob('../src/**/*', { query: '?raw', import: 'default', eager: true });
    for (const source of Object.values(sources)) {
      expect(source).not.toContain('file:///');
      expect(source).not.toContain('IMT 2026 Certificate');
    }
  });
});
