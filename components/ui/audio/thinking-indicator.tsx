"use client";


/**
 * Thinking Indicator
 * @registryCategory chat
 */

import * as React from "react";
import { motion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { springPresets } from "@/lib/motion";

// ---- TYPES ------------------------------------------------------------------

interface ThinkingIndicatorProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof thinkingIndicatorVariants> {
  /** Label text shown alongside the indicator */
  label?: string;
}

// ---- VARIANTS ---------------------------------------------------------------

const thinkingIndicatorVariants = cva(
  "inline-flex items-center gap-2 text-sm text-muted-foreground",
  {
    variants: {
      variant: {
        dots: "",
        pulse: "",
        shimmer: "",
      },
      size: {
        sm: "text-xs gap-1.5",
        md: "text-sm gap-2",
        lg: "text-base gap-2.5",
      },
    },
    defaultVariants: {
      variant: "dots",
      size: "md",
    },
  }
);

// ---- SUB-COMPONENTS ---------------------------------------------------------

const dotSizes = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-2.5 h-2.5" };

function DotsIndicator({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dotSize = dotSizes[size];

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn("rounded-full bg-muted-foreground/40", dotSize)}
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1.0,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function PulseIndicator({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const ringSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  const ringSize = ringSizes[size];

  return (
    <div className={cn("relative", ringSize)}>
      <motion.div
        className="absolute inset-0 rounded-full border-[1.5px] border-muted-foreground/25"
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0.75 rounded-full bg-muted-foreground/35" />
    </div>
  );
}

function ShimmerIndicator({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const widths = { sm: "w-16", md: "w-24", lg: "w-32" };
  const heights = { sm: "h-1", md: "h-1.5", lg: "h-2" };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-muted",
        widths[size],
        heights[size]
      )}
    >
      <motion.div
        className="absolute inset-y-0 w-1/3 rounded-full bg-muted-foreground/30"
        animate={{ x: ["-100%", "400%"] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// ---- COMPONENT --------------------------------------------------------------

function ThinkingIndicator({
  variant = "dots",
  size = "md",
  label,
  className,
  ...props
}: ThinkingIndicatorProps) {
  const resolvedSize = size ?? "md";
  const indicators = {
    dots: <DotsIndicator size={resolvedSize} />,
    pulse: <PulseIndicator size={resolvedSize} />,
    shimmer: <ShimmerIndicator size={resolvedSize} />,
  };

  return (
    <div
      data-slot="thinking-indicator"
      className={cn(thinkingIndicatorVariants({ variant, size }), className)}
      role="status"
      aria-label={label || "Thinking"}
      {...props}
    >
      {indicators[variant ?? "dots"]}
      {label && <span>{label}</span>}
    </div>
  );
}

ThinkingIndicator.displayName = "ThinkingIndicator";

export { ThinkingIndicator, thinkingIndicatorVariants };
export type { ThinkingIndicatorProps };
