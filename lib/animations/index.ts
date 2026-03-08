/**
 * Animation System - Motion constants, utilities, and presets
 *
 * This module provides all animation-related utilities for the component library.
 * It integrates with the design tokens and respects user's reduced motion preferences.
 *
 * @packageDocumentation
 */

// Presets: spring configs, transitions, easings, durations
export { springPresets, transitions, easings, durations } from "./presets";

// Variant factories, gestures, drag config
export {
  createPressVariants,
  createHoverVariants,
  createModalVariants,
  createSlideVariants,
  createStaggerVariants,
  createStaggerItemVariants,
  createMorphingPopoverVariants,
  createBackdropVariants,
  createPopoverVariants,
  createDropdownVariants,
  createDropdownItemVariants,
  createIndicatorVariants,
  gestures,
  dragConfig,
} from "./variants";

// Utility functions
export {
  mergeVariants,
  getTransition,
  createLayoutId,
  getReducedMotionVariants,
} from "./utils";
