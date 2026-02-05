/**
 * Shimmering Text Component
 *
 * An animated text component that creates a shimmering effect by sequentially
 * animating each character's color. Perfect for "slide to unlock" style UIs.
 *
 * Credits: Original implementation by @ncdai (https://chanhdai.com/components/slide-to-unlock)
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export type ShimmeringTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  /** The text content to display with the shimmering effect */
  text: string;
  /** Duration (in seconds) for each character's shimmer animation cycle */
  duration?: number;
  /** Controls whether the animation is stopped */
  isStopped?: boolean;
};

// =============================================================================
// SHIMMERING TEXT COMPONENT
// =============================================================================

/**
 * ShimmeringText - Animated text with per-character color shimmer
 *
 * Creates a wave-like shimmer effect across text by animating each character's
 * color with a slight delay, producing an elegant "traveling light" effect.
 *
 * @example
 * ```tsx
 * <ShimmeringText text="slide to unlock" />
 *
 * // With controlled state
 * <ShimmeringText
 *   text="slide to unlock"
 *   isStopped={isDragging}
 *   duration={1.5}
 * />
 * ```
 */
export function ShimmeringText({
  text,
  duration = 1,
  isStopped = false,
  className,
  ...props
}: ShimmeringTextProps) {
  const createCharVariants = React.useCallback(
    (charIndex: number): Variants => ({
      running: {
        color: ["var(--color)", "var(--shimmering-color)", "var(--color)"],
        transition: {
          duration,
          repeat: Infinity,
          repeatType: "loop" as const,
          repeatDelay: text.length * 0.05,
          delay: (charIndex * duration) / text.length,
          ease: "easeInOut",
        },
      },
      stopped: {
        color: "var(--color)",
        transition: {
          duration: duration * 0.5,
          ease: "easeOut",
        },
      },
    }),
    [duration, text.length],
  );

  return (
    <motion.span
      data-slot="shimmering-text"
      className={cn(
        "inline-block select-none",
        "[--color:var(--color-zinc-400)] [--shimmering-color:var(--color-zinc-950)]",
        "dark:[--color:var(--color-zinc-600)] dark:[--shimmering-color:var(--color-zinc-50)]",
        className,
      )}
      {...props}
    >
      {text?.split("")?.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial="stopped"
          animate={isStopped ? "stopped" : "running"}
          variants={createCharVariants(i)}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

ShimmeringText.displayName = "ShimmeringText";
