export type Quality = 'high' | 'medium' | 'low';
const requestedReduction = new URLSearchParams(location.search).get('motion') === 'reduce';
export const motionQuery = matchMedia(requestedReduction ? '(min-width: 0px)' : '(prefers-reduced-motion: reduce)');
export const motionMedia = requestedReduction ? '(max-width: 0px)' : '(prefers-reduced-motion: no-preference)';
document.documentElement.classList.toggle('motion-reduced', requestedReduction);
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

export function qualityTier(): Quality {
  const forced = new URLSearchParams(location.search).get('tier');
  if (motionQuery.matches || forced === 'low') return 'low';
  if (forced === 'medium') return 'medium';
  const nav = navigator as Navigator & { deviceMemory?: number };
  return !finePointer.matches || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4)
    || navigator.hardwareConcurrency <= 4 ? 'medium' : 'high';
}
