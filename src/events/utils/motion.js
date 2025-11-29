import { MOTION } from '../design-system';

// Motion Helper (P2.2)
export function getTransition(properties, speed = "normal") {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return "none";
  }
  const props = Array.isArray(properties) ? properties : [properties];
  return props.map(p => `${p} ${MOTION.duration[speed]} ${MOTION.easing.easeOut}`).join(", ");
}

// Reduced Motion Check
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}
