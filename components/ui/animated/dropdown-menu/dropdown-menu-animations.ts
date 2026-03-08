/**
 * DropdownMenu animation presets — Spring transitions, motion variants, and
 * timing constants for the dropdown menu system.
 * @module dropdown-menu/dropdown-menu-animations
 */
import type { Transition, Variants } from "motion/react";

// =============================================================================
// ANIMATION CONSTANTS & VARIANTS
// =============================================================================

/**
 * PREMIUM ANIMATION SYSTEM
 * - Refined spring physics for natural, premium feel
 * - Smooth ease curves for exits
 * - No jank or stuttering
 */

/** Primary spring transition - natural feel */
export const menuTransition: Transition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
  mass: 0.9,
};

/** Item transition - quick and responsive */
export const itemTransitionConfig: Transition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.8,
};

/** Indicator pop transition */
export const indicatorTransition: Transition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 28,
  mass: 0.6,
};

/** Sub-menu reveal transition */
export const subContentTransition: Transition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 0.85,
};

/**
 * Premium exit curve - smooth deceleration
 */
export const exitEase = [0.32, 0, 0.67, 0] as const;

/**
 * Default variants for dropdown content
 */
export const DEFAULT_MENU_VARIANTS: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: -6,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...menuTransition,
      staggerChildren: 0.025,
      delayChildren: 0.015,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -3,
    transition: {
      type: "tween" as const,
      duration: 0.15,
      ease: exitEase,
    },
  },
};

/**
 * Variants for sub-menu content
 */
export const subMenuVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.97,
    x: -6,
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      ...subContentTransition,
      staggerChildren: 0.02,
      delayChildren: 0.01,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    x: -3,
    transition: {
      type: "tween" as const,
      duration: 0.12,
      ease: exitEase,
    },
  },
};

/**
 * Variants for individual menu items
 */
export const itemVariants: Variants = {
  initial: {
    opacity: 0,
    y: -3,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    transition: {
      type: "tween" as const,
      duration: 0.1,
      ease: exitEase,
    },
  },
};

/**
 * Variants for checkbox/radio indicators
 */
export const indicatorVariants: Variants = {
  initial: {
    scale: 0.5,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0.5,
    opacity: 0,
    transition: {
      type: "tween" as const,
      duration: 0.08,
      ease: exitEase,
    },
  },
};
