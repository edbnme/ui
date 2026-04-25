/**
 * Animation Variants - Factory functions for motion component variants
 *
 * Creates reusable animation variants for common UI patterns.
 * Includes gesture presets and drag configuration.
 *
 * @packageDocumentation
 */

import type { Variants } from "motion/react";
import { springPresets, easings } from "./presets";

// ---- VARIANT FACTORIES ------------------------------------------------------

/**
 * Creates scale variants for press/tap interactions
 *
 * @param scale - The scale to apply when pressed (default: 0.97)
 * @returns Variants object for motion components
 *
 * @example
 * ```tsx
 * const pressVariants = createPressVariants(0.95);
 * <motion.button variants={pressVariants} whileTap="pressed" />
 * ```
 */
export function createPressVariants(scale = 0.97): Variants {
  return {
    idle: { scale: 1 },
    pressed: { scale },
  };
}

/**
 * Creates hover scale variants
 *
 * @param scale - The scale to apply when hovered (default: 1.02)
 * @returns Variants object for motion components
 */
export function createHoverVariants(scale = 1.02): Variants {
  return {
    idle: { scale: 1 },
    hovered: { scale },
  };
}

/**
 * Creates fade + scale variants for modal-like components
 *
 * @param options - Configuration for initial and exit scales
 * @returns Variants for enter/exit animations
 *
 * @example
 * ```tsx
 * const modalVariants = createModalVariants({ initialScale: 0.9 });
 * <motion.div variants={modalVariants} initial="initial" animate="animate" exit="exit" />
 * ```
 */
export function createModalVariants(options?: {
  initialScale?: number;
  exitScale?: number;
}): Variants {
  const { initialScale = 0.95, exitScale = 0.95 } = options ?? {};

  return {
    initial: {
      opacity: 0,
      scale: initialScale,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: exitScale,
    },
  };
}

/**
 * Creates slide variants for sheets/drawers
 *
 * @param side - The side the sheet slides from
 * @returns Variants for enter/exit animations
 */
export function createSlideVariants(
  side: "top" | "right" | "bottom" | "left"
): Variants {
  const transforms: Record<
    string,
    { x?: string | number; y?: string | number }
  > = {
    top: { y: "-100%" },
    right: { x: "100%" },
    bottom: { y: "100%" },
    left: { x: "-100%" },
  };

  return {
    initial: { ...transforms[side], opacity: 0 },
    animate: { x: 0, y: 0, opacity: 1 },
    exit: { ...transforms[side], opacity: 0 },
  };
}

/**
 * Creates staggered children variants for lists
 *
 * @param options - Configuration for stagger timing
 * @returns Variants for parent container
 */
export function createStaggerVariants(options?: {
  staggerChildren?: number;
  delayChildren?: number;
}): Variants {
  const { staggerChildren = 0.03, delayChildren = 0.05 } = options ?? {};

  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerChildren / 2,
        staggerDirection: -1,
      },
    },
  };
}

/**
 * Creates item variants for staggered lists
 *
 * @param options - Configuration for item animation
 * @returns Variants for list items
 */
export function createStaggerItemVariants(options?: {
  y?: number;
  scale?: number;
}): Variants {
  const { y = 10, scale = 0.95 } = options ?? {};

  return {
    initial: { opacity: 0, y, scale },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: y / 2, scale },
  };
}

/**
 * Creates morphing popover variants with blur
 *
 * @param options - Configuration for morph animation
 * @returns Variants for morphing components
 */
export function createMorphingPopoverVariants(options?: {
  initialScale?: number;
  exitScale?: number;
  initialBlur?: number;
  exitBlur?: number;
}): Variants {
  const {
    initialScale = 0.9,
    exitScale = 0.95,
    initialBlur = 10,
    exitBlur = 10,
  } = options ?? {};

  return {
    initial: {
      opacity: 0,
      scale: initialScale,
      filter: `blur(${initialBlur}px)`,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: exitScale,
      filter: `blur(${exitBlur}px)`,
      transition: {
        duration: 0.2,
      },
    },
  };
}

/**
 * Creates backdrop/overlay variants
 *
 * @returns Variants for backdrop elements
 */
export function createBackdropVariants(): Variants {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
}

/**
 * Creates origin-aware scale variants for popovers/dropdowns
 *
 * @param options - Configuration for popover animation
 * @returns Variants for popover components
 */
export function createPopoverVariants(options?: {
  initialScale?: number;
  originX?: number;
  originY?: number;
}): Variants {
  const { initialScale = 0.95, originX = 0.5, originY = 0 } = options ?? {};

  return {
    initial: {
      opacity: 0,
      scale: initialScale,
      originX,
      originY,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: initialScale,
    },
  };
}

/**
 * Creates dropdown menu variants with blur and stagger
 *
 * @returns Variants for dropdown menus
 */
export function createDropdownVariants(): Variants {
  return {
    initial: {
      opacity: 0,
      scale: 0.92,
      y: -12,
      filter: "blur(12px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        ...springPresets.smooth,
        stiffness: 260,
        damping: 32,
        mass: 1.02,
        delayChildren: 0.08,
        staggerChildren: 0.035,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: -6,
      filter: "blur(6px)",
      transition: {
        type: "tween",
        duration: 0.18,
        ease: easings.easeIn,
      },
    },
  };
}

/**
 * Creates dropdown item variants with blur
 *
 * @returns Variants for dropdown menu items
 */
export function createDropdownItemVariants(): Variants {
  return {
    initial: {
      opacity: 0,
      y: -6,
      scale: 0.98,
      filter: "blur(6px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: {
      opacity: 0,
      y: -4,
      scale: 0.98,
      filter: "blur(4px)",
      transition: {
        duration: 0.14,
        ease: easings.easeIn,
      },
    },
  };
}

/**
 * Creates check/indicator variants with bounce
 *
 * @returns Variants for checkbox/radio indicators
 */
export function createIndicatorVariants(): Variants {
  return {
    initial: {
      scale: 0.6,
      opacity: 0,
      rotate: -8,
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        ...springPresets.bouncy,
        stiffness: 460,
        damping: 28,
        mass: 0.9,
      },
    },
    exit: {
      scale: 0.6,
      opacity: 0,
      rotate: 8,
      transition: {
        duration: 0.16,
        ease: easings.easeIn,
      },
    },
  };
}

// ---- GESTURE PRESETS --------------------------------------------------------

/**
 * Gesture presets for interactive elements.
 *
 * @example
 * ```tsx
 * <motion.button {...gestures.button} />
 * ```
 */
export const gestures = {
  /** Standard button tap feedback */
  button: {
    whileTap: { scale: 0.97 },
    whileHover: { scale: 1.02 },
  },

  /** Subtle press for secondary actions */
  subtle: {
    whileTap: { scale: 0.99 },
  },

  /** Icon button feedback */
  iconButton: {
    whileTap: { scale: 0.9 },
    whileHover: { scale: 1.1 },
  },

  /** Card hover effect */
  card: {
    whileHover: { scale: 1.02, y: -4 },
    transition: springPresets.smooth,
  },

  /** List item hover */
  listItem: {
    whileHover: { x: 4 },
    transition: springPresets.snappy,
  },
} as const;

// ---- DRAG CONFIGURATION -----------------------------------------------------

/**
 * Drag configurations for swipeable components.
 */
export const dragConfig = {
  /** Sheet swipe-to-dismiss threshold */
  sheet: {
    dismissThreshold: 100,
    velocityThreshold: 500,
  },

  /** Drag constraints for bounded elements */
  bounded: {
    elastic: 0.1,
    power: 0.8,
  },
} as const;
