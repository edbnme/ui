/**
 * Alert — Inline status banner for non-modal messages.
 *
 * A pure-CSS component (no Base UI primitive — `role="alert"` and ARIA
 * live-region semantics are handled by the element itself). Use for
 * contextual status messages that appear alongside content, not as a
 * blocking modal. For transient notifications prefer `Toast`.
 *
 * Anatomy:
 * ```tsx
 * <Alert variant="success">
 *   <CheckCircleIcon />
 *   <AlertTitle>Saved</AlertTitle>
 *   <AlertDescription>Your changes were saved successfully.</AlertDescription>
 * </Alert>
 * ```
 *
 * Accessibility: renders `role="alert"` — screen readers announce the
 * content when it mounts or updates. For non-urgent status messages,
 * consider `role="status"` instead by overriding the role prop. Always
 * pair icons with readable text or an `aria-label`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/alert
 * @registryDescription Feedback alerts with 5 variants: default, destructive, success, warning, and info.
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---- VARIANTS ---------------------------------------------------------------

/**
 * Styling contract for `Alert`. Five semantic tones: `default`,
 * `destructive`, `success`, `warning`, `info`. Automatic dark-mode
 * adjustments included.
 *
 * @since 0.1.0
 */
const alertVariants = cva(
  [
    "relative w-full rounded-lg border border-border px-4 py-3 text-sm",
    // Icon positioning: leading icon absolutely placed; content indented.
    "[&>svg+div]:translate-y-[-3px]",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    "[&>svg]:text-foreground",
    "[&>svg~*]:pl-7",
  ],
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500",
        warning:
          "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500",
        info: "border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ---- ROOT -------------------------------------------------------------------

export type AlertProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof alertVariants>;

/**
 * The alert container.
 *
 * @since 0.1.0
 */
function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}
Alert.displayName = "Alert";

// ---- TITLE ------------------------------------------------------------------

export type AlertTitleProps = React.ComponentPropsWithoutRef<"h5">;

/**
 * The alert heading. Renders an `<h5>` by default so it fits into the
 * surrounding heading hierarchy — override with the `as` prop pattern (or
 * just a custom element) if you need a different level.
 *
 * @since 0.1.0
 */
function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}
AlertTitle.displayName = "AlertTitle";

// ---- DESCRIPTION ------------------------------------------------------------

export type AlertDescriptionProps = React.ComponentPropsWithoutRef<"div">;

/**
 * The body text. Nested `<p>` elements get comfortable line-height.
 *
 * @since 0.1.0
 */
function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}
AlertDescription.displayName = "AlertDescription";

// ---- EXPORTS ----------------------------------------------------------------

export { Alert, AlertTitle, AlertDescription, alertVariants };
