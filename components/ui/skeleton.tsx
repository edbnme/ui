/**
 * Skeleton — Loading placeholder that preserves layout while content is
 * being fetched.
 *
 * A pure-CSS component — an accent-colored rectangle with a gentle pulse
 * animation. Size and shape it with Tailwind utilities to match the real
 * content it stands in for. Preserving the real layout reduces cumulative
 * layout shift (CLS) and makes the loading state feel intentional rather
 * than empty.
 *
 * Anatomy:
 * ```tsx
 * <div className="space-y-3">
 *   <Skeleton className="h-8 w-48" />
 *   <Skeleton className="h-4 w-full" />
 *   <Skeleton className="h-4 w-3/4" />
 * </div>
 * ```
 *
 * Accessibility: a hidden `<div>` — announce loading state at the
 * container level instead, e.g. with `aria-busy="true"` on the parent or
 * a `<span className="sr-only">Loading…</span>` live region.
 *
 * Motion: the pulse respects `prefers-reduced-motion` automatically via
 * Tailwind's `animate-pulse` — no additional gating needed.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/skeleton
 * @registryDescription Loading placeholder with pulse animation.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type SkeletonProps = React.ComponentPropsWithoutRef<"div">;

/**
 * Loading placeholder.
 *
 * @since 0.1.0
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-accent motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
}
Skeleton.displayName = "Skeleton";

// ---- EXPORTS ----------------------------------------------------------------

export { Skeleton };
