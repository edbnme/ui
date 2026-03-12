/**
 * Animation Utilities - Helper functions for motion variants
 *
 * Utility functions for combining variants, handling reduced motion,
 * and generating layout IDs.
 *
 * @packageDocumentation
 */

import type { Transition, Variants } from "motion/react";
import { transitions } from "./presets";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Combines multiple variant objects into one
 *
 * @param variants - Variants to merge
 * @returns Combined variants object
 */
export function mergeVariants(...variants: Variants[]): Variants {
  return variants.reduce((acc, variant) => ({ ...acc, ...variant }), {});
}

/**
 * Returns appropriate transition based on reduced motion preference
 *
 * @param transition - The desired transition
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns The appropriate transition
 */
export function getTransition(
  transition: Transition,
  prefersReducedMotion: boolean
): Transition {
  if (prefersReducedMotion) {
    return transitions.reduced;
  }
  return transition;
}

/**
 * Generates a layoutId for shared element transitions
 *
 * @param prefix - Component type prefix
 * @param id - Unique identifier
 * @returns A stable layoutId string
 */
export function createLayoutId(prefix: string, id: string | number): string {
  return `${prefix}-${id}`;
}

/**
 * Gets variants that respect reduced motion preference
 *
 * @param variants - Original variants
 * @param prefersReducedMotion - Whether user prefers reduced motion
 * @returns Modified variants with instant transitions if needed
 */
export function getReducedMotionVariants(
  variants: Variants,
  prefersReducedMotion: boolean
): Variants {
  if (!prefersReducedMotion) {
    return variants;
  }

  // Return variants with instant state changes, no animation properties
  const reducedVariants: Variants = {};

  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === "object" && value !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { transition, ...visualProps } = value as Record<string, unknown>;
      // Cast to Variant since we're just removing the transition property
      reducedVariants[key] = visualProps as Variants[string];
    } else {
      reducedVariants[key] = value;
    }
  }

  return reducedVariants;
}
