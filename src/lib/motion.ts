/**
 * Shared motion config — timing, easing, and stagger values.
 * Used by the transition sequence player and available for future component animations.
 */

export const MOTION = {
  duration: {
    instant: 100,
    fast: 150,
    normal: 250,
    slow: 400,
    sequence: 600,
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    enter: "cubic-bezier(0, 0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  stagger: {
    item: 50,
    section: 100,
  },
} as const;

export type Duration = keyof typeof MOTION.duration;
export type Easing = keyof typeof MOTION.easing;
