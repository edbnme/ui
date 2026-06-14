"use client";

/**
 * Alert - inline status banner for non-modal messages.
 *
 * This is a local semantic wrapper for contextual status messages that sit
 * near the related content. For transient notifications use Toast; for
 * blocking decisions use AlertDialog.
 *
 * Accessibility: renders `role="alert"` by default so assistive technology
 * announces urgent content when it appears. Override with `role="status"` for
 * non-urgent updates.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui - https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/alert
 * @registryDescription Inline status banners with default, destructive, success, warning, and info variants.
 * @registryCssVars
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ---- VARIANTS ---------------------------------------------------------------

/**
 * Styling contract for `Alert`. Five semantic tones: `default`,
 * `destructive`, `success`, `warning`, `info`.
 *
 * @since 0.1.0
 */
const alertVariants = cva(
  [
    "relative isolate w-full min-w-0 overflow-hidden rounded-2xl border px-4 py-3.5 text-sm outline-none",
    "border-[color:var(--alert-border)] bg-[var(--alert-surface)] text-[var(--alert-foreground)]",
    "shadow-sm transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none dark:shadow-none",
    "dark:[--alert-border:color-mix(in_oklab,var(--border)_90%,var(--alert-tone)_10%)] dark:[--alert-surface:color-mix(in_oklab,var(--background)_98%,var(--alert-tone)_2%)] dark:[--alert-muted:color-mix(in_oklab,var(--muted-foreground)_94%,var(--alert-tone)_6%)] dark:[--alert-mark-surface:color-mix(in_oklab,var(--background)_93%,var(--alert-tone)_7%)] dark:[--alert-code-surface:color-mix(in_oklab,var(--background)_96%,var(--alert-tone)_4%)] dark:[--alert-code-border:color-mix(in_oklab,var(--border)_90%,var(--alert-tone)_10%)]",
    "focus-visible:border-[color:var(--alert-accent)]",
    "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg]:size-6 [&>svg]:shrink-0",
    "[&>svg]:rounded-full [&>svg]:bg-[var(--alert-mark-surface)] [&>svg]:p-1 [&>svg]:text-[var(--alert-accent)]",
    "[&>svg~*]:pl-9 [&_code]:rounded-md [&_code]:border [&_code]:border-[color:var(--alert-code-border)] [&_code]:bg-[var(--alert-code-surface)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px]",
  ],
  {
    variants: {
      variant: {
        default:
          "[--alert-tone:var(--foreground)] [--alert-accent:var(--alert-tone)] [--alert-border:color-mix(in_oklab,var(--border)_84%,var(--alert-tone)_16%)] [--alert-surface:color-mix(in_oklab,var(--background)_96%,var(--alert-tone)_4%)] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_92%,var(--alert-tone)_8%)] [--alert-mark-surface:color-mix(in_oklab,var(--background)_90%,var(--alert-tone)_10%)] [--alert-code-surface:color-mix(in_oklab,var(--muted)_80%,var(--background)_20%)] [--alert-code-border:color-mix(in_oklab,var(--border)_88%,var(--alert-tone)_12%)]",
        destructive:
          "[--alert-tone:var(--destructive)] [--alert-accent:var(--alert-tone)] [--alert-border:color-mix(in_oklab,var(--border)_80%,var(--alert-tone)_20%)] [--alert-surface:color-mix(in_oklab,var(--background)_95%,var(--alert-tone)_5%)] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_90%,var(--alert-tone)_10%)] [--alert-mark-surface:color-mix(in_oklab,var(--background)_90%,var(--alert-tone)_10%)] [--alert-code-surface:color-mix(in_oklab,var(--background)_94%,var(--alert-tone)_6%)] [--alert-code-border:color-mix(in_oklab,var(--border)_84%,var(--alert-tone)_16%)]",
        success:
          "[--alert-tone:var(--chart-2)] [--alert-accent:var(--alert-tone)] [--alert-border:color-mix(in_oklab,var(--border)_80%,var(--alert-tone)_20%)] [--alert-surface:color-mix(in_oklab,var(--background)_95%,var(--alert-tone)_5%)] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_90%,var(--alert-tone)_10%)] [--alert-mark-surface:color-mix(in_oklab,var(--background)_90%,var(--alert-tone)_10%)] [--alert-code-surface:color-mix(in_oklab,var(--background)_94%,var(--alert-tone)_6%)] [--alert-code-border:color-mix(in_oklab,var(--border)_84%,var(--alert-tone)_16%)]",
        warning:
          "[--alert-tone:var(--chart-5)] dark:[--alert-tone:var(--chart-3)] [--alert-accent:var(--alert-tone)] [--alert-border:color-mix(in_oklab,var(--border)_78%,var(--alert-tone)_22%)] [--alert-surface:color-mix(in_oklab,var(--background)_94%,var(--alert-tone)_6%)] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_90%,var(--alert-tone)_10%)] [--alert-mark-surface:color-mix(in_oklab,var(--background)_88%,var(--alert-tone)_12%)] [--alert-code-surface:color-mix(in_oklab,var(--background)_93%,var(--alert-tone)_7%)] [--alert-code-border:color-mix(in_oklab,var(--border)_84%,var(--alert-tone)_16%)]",
        info: "[--alert-tone:var(--chart-3)] dark:[--alert-tone:var(--chart-1)] [--alert-accent:var(--alert-tone)] [--alert-border:color-mix(in_oklab,var(--border)_80%,var(--alert-tone)_20%)] [--alert-surface:color-mix(in_oklab,var(--background)_95%,var(--alert-tone)_5%)] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_90%,var(--alert-tone)_10%)] [--alert-mark-surface:color-mix(in_oklab,var(--background)_90%,var(--alert-tone)_10%)] [--alert-code-surface:color-mix(in_oklab,var(--background)_94%,var(--alert-tone)_6%)] [--alert-code-border:color-mix(in_oklab,var(--border)_84%,var(--alert-tone)_16%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ---- ROOT -------------------------------------------------------------------

export type AlertProps = React.ComponentPropsWithRef<"div"> &
  VariantProps<typeof alertVariants>;

/**
 * The alert container.
 *
 * @since 0.1.0
 */
function Alert({
  ref,
  className,
  variant,
  role = "alert",
  ...props
}: AlertProps) {
  const resolvedVariant = variant ?? "default";

  return (
    <div
      ref={ref}
      role={role}
      data-slot="alert"
      data-variant={resolvedVariant}
      className={cn(alertVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  );
}
Alert.displayName = "Alert";

// ---- TITLE ------------------------------------------------------------------

export type AlertTitleProps = React.ComponentPropsWithRef<"h5">;

/**
 * The alert heading. Renders an `h5` and accepts native heading props.
 *
 * @since 0.1.0
 */
function AlertTitle({ ref, className, ...props }: AlertTitleProps) {
  return (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn(
        "mb-1 text-[13px] font-semibold leading-5 text-[var(--alert-foreground)] [text-wrap:balance]",
        "forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    />
  );
}
AlertTitle.displayName = "AlertTitle";

// ---- DESCRIPTION ------------------------------------------------------------

export type AlertDescriptionProps = React.ComponentPropsWithRef<"div">;

/**
 * The body text. Nested `<p>` elements get comfortable line-height.
 *
 * @since 0.1.0
 */
function AlertDescription({ ref, className, ...props }: AlertDescriptionProps) {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        "text-[13px] leading-5 text-[var(--alert-muted)] [&_p]:leading-5 [&_span]:break-words",
        "forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    />
  );
}
AlertDescription.displayName = "AlertDescription";

// ---- EXPORTS ----------------------------------------------------------------

export { Alert, AlertTitle, AlertDescription, alertVariants };
