import { describe, expect, it } from 'vitest';
import { decodePhoneNumber, getMaskedPhonePreview, HERO_STATS, PROFILE } from '../src/data/content';

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
});
