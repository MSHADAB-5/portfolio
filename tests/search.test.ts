import { describe, expect, it } from 'vitest';
import { searchItems, searchScore } from '../src/ui/search';
describe('command palette search', () => {
  const items = [{ label: 'Go to Experience' }, { label: 'Open contact sheet', keywords: 'phone' }, { label: 'Open GitHub' }];
  it('returns all entries for empty query', () => expect(searchItems(items, '')).toEqual(items));
  it('ignores case and supports fuzzy matching', () => {
    expect(searchItems(items, 'EXPERIENCE')[0]).toEqual(items[0]);
    expect(searchItems(items, 'gthb')[0]).toEqual(items[2]);
  });
  it('searches keyword aliases', () => expect(searchItems(items, 'phone')[0]).toEqual(items[1]));
  it('handles arbitrary strings without regex evaluation', () => {
    expect(searchItems(items, '[]*<script>')).toEqual([]);
    expect(searchScore('Experience', 'not-here')).toBe(-1);
  });
});
