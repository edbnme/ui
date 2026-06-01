/**
 * Badge — Small inline status or count indicator.
 *
 * A pure-CSS component (no Base UI primitive needed) for short labels:
 * counts, statuses, tags, categories. Use sparingly — badges compete with
 * body copy for attention, so reserve them for information the user needs
 * to notice at a glance.
 *
 * Anatomy:
 * ```tsx
 * <Badge>Default</Badge>
 * <Badge variant="secondary">Beta</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline" size="sm">New</Badge>
 * ```
 *
 * Accessibility: renders a `<div>` by default — purely visual. When a
 * badge communicates dynamic state (e.g., unread count), wrap it in a
 * `<span aria-live="polite">` or use `aria-label` on the parent control
 * so screen readers announce changes.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/badge
 * @registryDescription Small status indicator with variant styles.
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---- VARIANTS ---------------------------------------------------------------

/**
 * Styling contract for `Badge`.
 *
 * @since 0.1.0
 */
const badgeVariants = cva(
  [
    "inline-flex items-center rounded-full border border-border font-semibold",
    "transition-colors duration-150 ease-out motion-reduce:transition-none",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// ---- ROOT -------------------------------------------------------------------

export type BadgeProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof badgeVariants>;

/**
 * The badge itself. Pass any children — an icon, text, or a combination.
 *
 * @since 0.1.0
 */
function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
Badge.displayName = "Badge";

// ---- EXPORTS ----------------------------------------------------------------

export { Badge, badgeVariants };
