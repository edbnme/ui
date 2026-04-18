"use client";


/**
 * Token Counter
 * @registryCategory chat
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

interface TokenCounterProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof tokenCounterVariants> {
  /** Number of tokens used */
  used: number;
  /** Maximum token limit */
  limit: number;
  /** Model name to display */
  model?: string;
  /** Cost per 1K tokens (for cost display) */
  costPer1k?: number;
  /** Whether to show the progress bar */
  showProgress?: boolean;
  /** Format function for token numbers */
  formatNumber?: (n: number) => string;
}

// ---- VARIANTS ---------------------------------------------------------------

const tokenCounterVariants = cva("inline-flex items-center gap-3 text-sm", {
  variants: {
    size: {
      sm: "text-xs gap-2",
      md: "text-sm gap-3",
      lg: "text-base gap-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ---- HELPERS ----------------------------------------------------------------

function defaultFormatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function getUsageColor(percentage: number): string {
  if (percentage >= 90) return "bg-destructive";
  if (percentage >= 75) return "bg-amber-500";
  return "bg-primary";
}

function getUsageTextColor(percentage: number): string {
  if (percentage >= 90) return "text-destructive";
  if (percentage >= 75) return "text-amber-500";
  return "text-muted-foreground";
}

// ---- COMPONENT --------------------------------------------------------------

function TokenCounter({
  used,
  limit,
  model,
  costPer1k,
  showProgress = true,
  formatNumber = defaultFormatNumber,
  size = "md",
  className,
  ...props
}: TokenCounterProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const cost = costPer1k ? (used / 1000) * costPer1k : null;

  const progressWidths = { sm: "w-16", md: "w-24", lg: "w-32" };
  const progressHeights = { sm: "h-1", md: "h-1.5", lg: "h-2" };

  return (
    <div
      data-slot="token-counter"
      className={cn(tokenCounterVariants({ size }), className)}
      role="meter"
      aria-valuenow={used}
      aria-valuemin={0}
      aria-valuemax={limit}
      aria-label={`Token usage: ${used} of ${limit}`}
      {...props}
    >
      {model && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-mono">
          {model}
        </span>
      )}

      <span
        className={cn("font-mono tabular-nums", getUsageTextColor(percentage))}
      >
        {formatNumber(used)}
        <span className="text-muted-foreground/50">
          {" "}
          / {formatNumber(limit)}
        </span>
      </span>

      {showProgress && (
        <div
          className={cn(
            "relative overflow-hidden rounded-full bg-muted",
            progressWidths[size || "md"],
            progressHeights[size || "md"]
          )}
        >
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
              getUsageColor(percentage)
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {cost !== null && (
        <span className="text-muted-foreground/50 font-mono tabular-nums">
          ${cost.toFixed(4)}
        </span>
      )}
    </div>
  );
}

TokenCounter.displayName = "TokenCounter";

export { TokenCounter, tokenCounterVariants };
export type { TokenCounterProps };
