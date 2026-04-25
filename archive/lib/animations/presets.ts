/**
 * Animation Presets - Spring configurations, transitions, and easing curves
 *
 * Core animation constants for the component library.
 * Integrates with design tokens and provides consistent animation behavior.
 *
 * @packageDocumentation
 */

import type { Transition } from "motion/react";
import { durations } from "../tokens";

// ---- SPRING PRESETS ---------------------------------------------------------

/**
 * Spring presets for consistent animations across the library.
 * Each preset is tuned for specific interaction types.
 *
 * @example
 * ```tsx
 * import { springPresets } from '@/lib/animations';
 *
 * <motion.button transition={springPresets.snappy} />
 * ```
 */
export const springPresets = {
  /**
   * Snappy - Quick, responsive (buttons, toggles, small interactions)
   * High stiffness + high damping = fast and controlled
   */
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 1,
  },

  /**
   * Bouncy - Playful, attention-grabbing (notifications, toasts)
   * Medium stiffness + lower damping = visible bounce
   */
  bouncy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
    mass: 1,
  },

  /**
   * Smooth - Slow, graceful transitions (modals, sheets)
   * Lower stiffness + higher damping = elegant movement
   */
  smooth: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
    mass: 1,
  },

  /**
   * Gentle - Subtle, background animations (fades, micro-interactions)
   * Very low stiffness + high damping = barely perceptible
   */
  gentle: {
    type: "spring" as const,
    stiffness: 150,
    damping: 30,
    mass: 1,
  },

  /**
   * Interactive - Drag and gesture responses
   * Balanced for real-time input tracking
   */
  interactive: {
    type: "spring" as const,
    stiffness: 500,
    damping: 35,
    mass: 0.8,
  },

  /**
   * Morphing - For layoutId shared element transitions
   * Zero bounce for clean morphing
   */
  morphing: {
    type: "spring" as const,
    bounce: 0,
    duration: 0.5,
  },
} as const;

// ---- TRANSITION PRESETS -----------------------------------------------------

/**
 * Transition presets for various component types.
 *
 * @example
 * ```tsx
 * <motion.div transition={transitions.modal} />
 * ```
 */
export const transitions = {
  /** Standard transition using snappy spring */
  default: springPresets.snappy as Transition,

  /** For modal/dialog opening animations */
  modal: springPresets.smooth as Transition,

  /** For dropdown/popover appearance */
  popover: {
    ...springPresets.snappy,
    duration: 0.2,
  } as Transition,

  /** For morphing popover with layoutId */
  morphingPopover: {
    type: "spring" as const,
    bounce: 0.05,
    duration: 0.3,
  } as Transition,

  /** For sheet slide-in animations */
  sheet: {
    ...springPresets.smooth,
    damping: 28,
  } as Transition,

  /** For button press feedback */
  button: {
    ...springPresets.interactive,
    duration: 0.1,
  } as Transition,

  /** For icon state changes */
  icon: {
    ...springPresets.bouncy,
    duration: 0.3,
  } as Transition,

  /** For staggered list items */
  stagger: {
    staggerChildren: 0.03,
    delayChildren: 0.05,
  } as Transition,

  /** Fast fade for overlays/backdrops */
  fade: {
    type: "tween" as const,
    duration: 0.15,
    ease: "easeOut",
  } as Transition,

  /** Reduced motion fallback - instant */
  reduced: {
    type: "tween" as const,
    duration: 0,
  } as Transition,

  /** Content fade in after morph */
  contentFade: {
    duration: 0.25,
    delay: 0.15,
    ease: [0.32, 0.72, 0, 1] as const,
  } as Transition,

  /** Backdrop fade */
  backdrop: {
    duration: 0.25,
    ease: "easeOut" as const,
  } as Transition,
} as const;

// ---- EASING FUNCTIONS -------------------------------------------------------

/**
 * Easing curves for tween animations.
 * Use these when spring physics isn't appropriate.
 */
export const easings = {
  /** Standard ease curve */
  standard: [0.25, 0.1, 0.25, 1] as const,
  /** Acceleration curve */
  easeIn: [0.42, 0, 1, 1] as const,
  /** Deceleration curve */
  easeOut: [0, 0, 0.58, 1] as const,
  /** Emphasized movement */
  emphasis: [0.33, 1, 0.68, 1] as const,
  /** Linear - no easing */
  linear: [0, 0, 1, 1] as const,
  /** Overshoot - slight bounce at end */
  overshoot: [0.34, 1.56, 0.64, 1] as const,
} as const;

// ---- DURATION CONSTANTS -----------------------------------------------------

export { durations };
