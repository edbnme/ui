/**
 * Static Transitions Library
 *
 * CSS-only transition utilities for static components.
 * No motion/react dependency - uses pure CSS transitions and animations.
 *
 * @packageDocumentation
 */

// =============================================================================
// CSS EASING PRESETS
// Standard easing curves (no spring physics)
// =============================================================================

/**
 * CSS easing curves for transitions
 */
export const easingPresets = {
  /**
   * Ease In - Slow start, fast end
   * Good for: exit animations, elements leaving the screen
   */
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",

  /**
   * Ease Out - Fast start, slow end
   * Good for: entry animations, elements appearing
   */
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",

  /**
   * Ease In-Out - Slow start and end
   * Good for: smooth morphing, position changes
   */
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",

  /**
   * Linear - Constant speed
   * Good for: continuous animations (spinners, progress)
   */
  linear: "linear",

  /**
   * Ease - Browser default
   * Good for: general purpose animations
   */
  ease: "ease",
} as const;

// =============================================================================
// DURATION PRESETS
// =============================================================================

/**
 * Duration presets in milliseconds
 */
export const durationPresets = {
  /** Instant - 0ms (no animation) */
  instant: 0,
  /** Fast - 100ms (micro-interactions) */
  fast: 100,
  /** Normal - 200ms (standard transitions) */
  normal: 200,
  /** Slow - 300ms (larger UI changes) */
  slow: 300,
  /** Slower - 500ms (complex transitions) */
  slower: 500,
} as const;

// =============================================================================
// TRANSITION HELPERS
// =============================================================================

export type TransitionProperty =
  | "all"
  | "opacity"
  | "transform"
  | "background-color"
  | "border-color"
  | "box-shadow"
  | "color"
  | "width"
  | "height"
  | "max-height"
  | "max-width"
  | "padding"
  | "margin";

export type EasingType = keyof typeof easingPresets;
export type DurationType = keyof typeof durationPresets;

/**
 * Build a CSS transition string
 */
export function buildTransition(
  properties: TransitionProperty | TransitionProperty[],
  duration: DurationType | number = "normal",
  easing: EasingType = "easeOut"
): string {
  const props = Array.isArray(properties) ? properties : [properties];
  const durationMs =
    typeof duration === "number" ? duration : durationPresets[duration];
  const easingValue = easingPresets[easing];

  return props
    .map((prop) => `${prop} ${durationMs}ms ${easingValue}`)
    .join(", ");
}

/**
 * Common transition presets ready to use
 */
export const transitions = {
  /** Standard opacity fade */
  fade: buildTransition("opacity", "normal", "easeOut"),

  /** Transform (scale, translate) */
  transform: buildTransition("transform", "normal", "easeOut"),

  /** Fade + transform combined */
  fadeTransform: buildTransition(["opacity", "transform"], "normal", "easeOut"),

  /** Background color change (hover states) */
  background: buildTransition("background-color", "fast", "easeOut"),

  /** All properties (use sparingly) */
  all: buildTransition("all", "normal", "easeOut"),

  /** None - disable transitions */
  none: "none",
} as const;

// =============================================================================
// ANIMATION KEYFRAME DEFINITIONS (for reference/documentation)
// These are defined in static.css, this provides TypeScript constants
// =============================================================================

/**
 * Available CSS animation names (defined in static.css)
 */
export const animations = {
  /** Spinning animation for loaders */
  spin: "static-spin",
  /** Pulse animation for loading states */
  pulse: "static-pulse",
  /** Fade in animation */
  fadeIn: "fade-in",
  /** Fade out animation */
  fadeOut: "fade-out",
  /** Zoom in animation */
  zoomIn: "zoom-in-95",
  /** Zoom out animation */
  zoomOut: "zoom-out-95",
  /** Slide from top */
  slideFromTop: "slide-in-from-top-2",
  /** Slide from bottom */
  slideFromBottom: "slide-in-from-bottom-2",
  /** Slide from left */
  slideFromLeft: "slide-in-from-left-2",
  /** Slide from right */
  slideFromRight: "slide-in-from-right-2",
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get duration based on reduced motion preference
 * Returns 0 if user prefers reduced motion
 */
export function getAccessibleDuration(duration: DurationType | number): number {
  if (prefersReducedMotion()) return 0;
  return typeof duration === "number" ? duration : durationPresets[duration];
}

// =============================================================================
// BASE UI TRANSITION CLASS PRESETS
// Reusable Tailwind class strings for Base UI data-attribute animations
// =============================================================================

export const popupTransitionClasses = [
  "origin-[var(--transform-origin)]",
  "transition-[opacity,transform] duration-200",
  "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
].join(" ");

export const backdropTransitionClasses = [
  "fixed inset-0 bg-black/50",
  "transition-opacity duration-200",
  "data-[starting-style]:opacity-0",
  "data-[ending-style]:opacity-0",
].join(" ");

export function slideTransitionClasses(
  side: "top" | "right" | "bottom" | "left"
): string {
  const directionMap = {
    top: "data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full",
    right:
      "data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
    bottom:
      "data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
    left: "data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
  };
  return [
    "transition-[opacity,transform] duration-300",
    "data-[starting-style]:opacity-0",
    "data-[ending-style]:opacity-0",
    directionMap[side],
  ].join(" ");
}

export const panelTransitionClasses = [
  "overflow-hidden",
  "transition-[height] duration-200",
  "h-[var(--panel-height)]",
  "data-[starting-style]:h-0",
  "data-[ending-style]:h-0",
].join(" ");

export const indicatorTransitionClasses = [
  "transition-opacity duration-150",
  "data-[starting-style]:opacity-0",
  "data-[ending-style]:opacity-0",
].join(" ");
