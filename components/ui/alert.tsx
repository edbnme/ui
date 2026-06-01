"use client";

/**
 * Alert - inline status banner for non-modal messages.
 *
 * This is a local semantic wrapper, not a Base UI primitive. Use it for
 * contextual status messages that sit near the related content. For transient
 * notifications use Toast; for blocking decisions use AlertDialog.
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
    "relative isolate w-full min-w-0 overflow-hidden rounded-2xl border px-4 py-3.5 text-sm",
    "border-[color:var(--alert-border)] bg-[var(--alert-surface)] text-[var(--alert-foreground)]",
    "shadow-[0_1px_0_color-mix(in_oklab,var(--foreground)_4%,transparent),0_18px_44px_-34px_var(--alert-shadow)]",
    "supports-[backdrop-filter]:backdrop-blur-xl",
    "after:pointer-events-none after:absolute after:inset-x-3 after:top-0 after:h-px after:bg-[color-mix(in_oklab,var(--alert-highlight)_72%,transparent)]",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4.5 [&>svg]:size-4 [&>svg]:shrink-0",
    "[&>svg]:text-[var(--alert-accent)]",
    "[&>svg~*]:pl-7 [&_code]:rounded-md [&_code]:bg-[var(--alert-code-surface)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px]",
  ],
  {
    variants: {
      variant: {
        default:
          "[--alert-accent:var(--foreground)] [--alert-border:color-mix(in_oklab,var(--border)_88%,var(--foreground)_12%)] [--alert-surface:color-mix(in_oklab,var(--background)_78%,var(--muted)_22%)] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_86%,var(--foreground))] [--alert-highlight:var(--background)] [--alert-shadow:var(--foreground)] [--alert-code-surface:color-mix(in_oklab,var(--muted)_45%,transparent)]",
        destructive:
          "[--alert-accent:var(--destructive)] [--alert-border:color-mix(in_oklab,var(--destructive)_24%,var(--border))] [--alert-surface:color-mix(in_oklab,var(--destructive)_7%,var(--background))] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_84%,var(--destructive))] [--alert-highlight:var(--background)] [--alert-shadow:var(--destructive)] [--alert-code-surface:color-mix(in_oklab,var(--destructive)_9%,transparent)]",
        success:
          "[--alert-accent:var(--chart-2)] [--alert-border:color-mix(in_oklab,var(--chart-2)_22%,var(--border))] [--alert-surface:color-mix(in_oklab,var(--chart-2)_7%,var(--background))] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_84%,var(--chart-2))] [--alert-highlight:var(--background)] [--alert-shadow:var(--chart-2)] [--alert-code-surface:color-mix(in_oklab,var(--chart-2)_9%,transparent)]",
        warning:
          "[--alert-accent:var(--chart-5)] [--alert-border:color-mix(in_oklab,var(--chart-5)_24%,var(--border))] [--alert-surface:color-mix(in_oklab,var(--chart-5)_8%,var(--background))] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_84%,var(--chart-5))] [--alert-highlight:var(--background)] [--alert-shadow:var(--chart-5)] [--alert-code-surface:color-mix(in_oklab,var(--chart-5)_10%,transparent)]",
        info: "[--alert-accent:var(--chart-3)] [--alert-border:color-mix(in_oklab,var(--chart-3)_22%,var(--border))] [--alert-surface:color-mix(in_oklab,var(--chart-3)_7%,var(--background))] [--alert-foreground:var(--foreground)] [--alert-muted:color-mix(in_oklab,var(--muted-foreground)_84%,var(--chart-3))] [--alert-highlight:var(--background)] [--alert-shadow:var(--chart-3)] [--alert-code-surface:color-mix(in_oklab,var(--chart-3)_9%,transparent)]",
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
  return (
    <div
      ref={ref}
      role={role}
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
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
        className
      )}
      {...props}
    />
  );
}
AlertDescription.displayName = "AlertDescription";

// ---- EXPORTS ----------------------------------------------------------------

export { Alert, AlertTitle, AlertDescription, alertVariants };
