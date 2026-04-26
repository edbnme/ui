"use client";

/**
 * Shimmering Text Audio
 * @registryDescription Motion-aware shimmering text for generated speech, transcript, and response pending states.
 * @registrySlug audio-shimmering-text
 * @registryCategory display
 */

import { useMemo, useRef } from "react";
import { motion, useInView, type UseInViewOptions } from "motion/react";
import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

interface ShimmeringTextProps {
  /** Text to display with shimmer effect */
  text: string;
  /** Animation duration in seconds. Default: 2 */
  duration?: number;
  /** Delay before starting animation. Default: 0 */
  delay?: number;
  /** Whether to repeat the animation. Default: true */
  repeat?: boolean;
  /** Pause duration between repeats in seconds. Default: 0.5 */
  repeatDelay?: number;
  /** Custom className */
  className?: string;
  /** Whether to start animation when component enters viewport. Default: true */
  startOnView?: boolean;
  /** Whether to animate only once. Default: false */
  once?: boolean;
  /** Margin for in-view detection (rootMargin) */
  inViewMargin?: UseInViewOptions["margin"];
  /** Shimmer spread multiplier. Default: 2 */
  spread?: number;
  /** Base text color */
  color?: string;
  /** Shimmer gradient color */
  shimmerColor?: string;
}

// ---- COMPONENT --------------------------------------------------------------

function ShimmeringText({
  text,
  duration = 2,
  delay = 0,
  repeat = true,
  repeatDelay = 0.5,
  className,
  startOnView = true,
  once = false,
  inViewMargin,
  spread = 2,
  color,
  shimmerColor,
}: ShimmeringTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: inViewMargin });

  const dynamicSpread = useMemo(() => {
    return text.length * spread;
  }, [text, spread]);

  const shouldAnimate = !startOnView || isInView;

  return (
    <motion.span
      ref={ref}
      data-slot="shimmering-text"
      className={cn(
        "relative inline-block bg-size-[250%_100%,auto] bg-clip-text text-transparent",
        "[--base-color:var(--muted-foreground)] [--shimmer-color:var(--foreground)]",
        "[background-repeat:no-repeat,padding-box]",
        "[--shimmer-bg:linear-gradient(90deg,transparent_calc(50%-var(--spread)),var(--shimmer-color),transparent_calc(50%+var(--spread)))]",
        "dark:[--base-color:var(--muted-foreground)] dark:[--shimmer-color:var(--foreground)]",
        className
      )}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          ...(color && { "--base-color": color }),
          ...(shimmerColor && { "--shimmer-color": shimmerColor }),
          backgroundImage: `var(--shimmer-bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
      initial={{
        backgroundPosition: "100% center",
        opacity: 0,
      }}
      animate={
        shouldAnimate
          ? {
              backgroundPosition: "0% center",
              opacity: 1,
            }
          : {}
      }
      transition={{
        backgroundPosition: {
          repeat: repeat ? Infinity : 0,
          duration,
          delay,
          repeatDelay,
          ease: "linear",
        },
        opacity: {
          duration: 0.3,
          delay,
        },
      }}
    >
      {text}
    </motion.span>
  );
}

ShimmeringText.displayName = "ShimmeringText";

export { ShimmeringText };
export type { ShimmeringTextProps };
