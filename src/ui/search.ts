export function searchScore(label: string, query: string): number {
  const text = label.toLowerCase();
  const needle = query.trim().toLowerCase().slice(0, 100);
  if (!needle) return 1;
  const exact = text.indexOf(needle);
  if (exact >= 0) return 1000 - exact - text.length * .01;
  let cursor = 0;
  let span = 0;
  for (const char of needle) {
    const next = text.indexOf(char, cursor);
    if (next < 0) return -1;
    span += next - cursor;
    cursor = next + 1;
  }
  return 100 - span;
}

export function searchItems<T extends { label: string; keywords?: string }>(items: readonly T[], query: string): T[] {
  return items.map((item) => ({ item, score: searchScore(`${item.label} ${item.keywords ?? ''}`, query) }))
    .filter(({ score }) => score >= 0).sort((a, b) => b.score - a.score).map(({ item }) => item);
}
