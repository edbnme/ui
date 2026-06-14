"use client";

/**
 * Badge - compact inline status or count indicator.
 *
 * A pure-CSS component for short labels: counts, statuses, tags, and
 * categories. Use sparingly so badges keep their visual priority.
 *
 * @registryDescription Compact status indicator with solid semantic variants.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ---- VARIANTS ---------------------------------------------------------------

const badgeVariants = cva(
  [
    "inline-flex max-w-full shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border font-medium tabular-nums",
    "border-[color:var(--badge-border)] bg-[var(--badge-surface)] text-[var(--badge-foreground)] shadow-sm dark:shadow-none",
    "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "aria-disabled:pointer-events-none aria-disabled:opacity-60 data-disabled:pointer-events-none data-disabled:opacity-60",
    "forced-colors:border-[ButtonBorder] forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] forced-colors:shadow-none",
    "[&>svg]:size-[0.9em] [&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "[--badge-border:color-mix(in_oklab,var(--primary)_88%,var(--background)_12%)] [--badge-surface:var(--primary)] [--badge-foreground:var(--primary-foreground)]",
        secondary:
          "[--badge-border:color-mix(in_oklab,var(--border)_72%,var(--foreground)_28%)] [--badge-surface:color-mix(in_oklab,var(--secondary)_86%,var(--foreground)_14%)] [--badge-foreground:var(--secondary-foreground)]",
        destructive:
          "[--badge-border:color-mix(in_oklab,var(--destructive)_84%,var(--background)_16%)] [--badge-surface:var(--destructive)] [--badge-foreground:var(--destructive-foreground)]",
        outline:
          "[--badge-border:var(--border)] [--badge-surface:var(--background)] [--badge-foreground:var(--foreground)]",
        success:
          "[--badge-tone:var(--chart-2)] [--badge-border:color-mix(in_oklab,var(--border)_78%,var(--badge-tone)_22%)] [--badge-surface:color-mix(in_oklab,var(--background)_92%,var(--badge-tone)_8%)] [--badge-foreground:color-mix(in_oklab,var(--foreground)_80%,var(--badge-tone)_20%)]",
        warning:
          "[--badge-tone:var(--chart-5)] [--badge-border:color-mix(in_oklab,var(--border)_76%,var(--badge-tone)_24%)] [--badge-surface:color-mix(in_oklab,var(--background)_91%,var(--badge-tone)_9%)] [--badge-foreground:color-mix(in_oklab,var(--foreground)_82%,var(--badge-tone)_18%)] dark:[--badge-tone:var(--chart-3)]",
        info: "[--badge-tone:var(--chart-3)] [--badge-border:color-mix(in_oklab,var(--border)_78%,var(--badge-tone)_22%)] [--badge-surface:color-mix(in_oklab,var(--background)_92%,var(--badge-tone)_8%)] [--badge-foreground:color-mix(in_oklab,var(--foreground)_80%,var(--badge-tone)_20%)] dark:[--badge-tone:var(--chart-1)]",
      },
      size: {
        sm: "h-5 px-2 text-[11px] leading-none",
        md: "h-6 px-2.5 text-xs leading-none",
        lg: "h-7 px-3 text-sm leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// ---- ROOT -------------------------------------------------------------------

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    const resolvedVariant = variant ?? "default";
    const resolvedSize = size ?? "md";

    return (
      <div
        ref={ref}
        data-slot="badge"
        data-variant={resolvedVariant}
        data-size={resolvedSize}
        className={cn(
          badgeVariants({ variant: resolvedVariant, size: resolvedSize }),
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

// ---- EXPORTS ----------------------------------------------------------------

export { Badge, badgeVariants };
