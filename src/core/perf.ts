export type Quality = 'high' | 'medium' | 'low';
export const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

export function qualityTier(): Quality {
  const forced = new URLSearchParams(location.search).get('tier');
  if (motionQuery.matches || forced === 'low') return 'low';
  if (forced === 'medium') return 'medium';
  const nav = navigator as Navigator & { deviceMemory?: number };
  return !finePointer.matches || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4)
    || navigator.hardwareConcurrency <= 4 ? 'medium' : 'high';
}
