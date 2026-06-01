/**
 * Progress — Determinate or indeterminate progress indicator.
 *
 * Built on the Base UI `Progress` primitive. Use for operations whose
 * remaining duration is known (uploads, multi-step forms) or loosely
 * known (indeterminate, when you have no percentage to report).
 *
 * Anatomy:
 * ```tsx
 * <ProgressRoot value={percent}>
 *   <div className="flex items-baseline justify-between">
 *     <ProgressLabel>Uploading…</ProgressLabel>
 *     <ProgressValue>{percent}%</ProgressValue>
 *   </div>
 *   <ProgressTrack>
 *     <ProgressIndicator />
 *   </ProgressTrack>
 * </ProgressRoot>
 * ```
 *
 * Indeterminate: pass `value={null}` to `ProgressRoot` — the indicator
 * shows a stripe animation. Respect `prefers-reduced-motion`.
 *
 * Accessibility: `ProgressRoot` is the ARIA `progressbar`. Wire a label
 * via `ProgressLabel` (plain text element) or `aria-label`. Values
 * outside [0..max] are clamped.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/progress
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/progress
 * @registryDescription Progress bar with determinate and indeterminate states.
 */

"use client";

import * as React from "react";
import { Progress } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type ProgressRootProps = React.ComponentPropsWithoutRef<
  typeof Progress.Root
>;

/**
 * The coordinating container. Provides the ARIA role and contextual
 * value to `ProgressTrack` and `ProgressIndicator`.
 *
 * Props of note:
 * - `value: number | null` — current value; `null` = indeterminate
 * - `min?: number` (default `0`)
 * - `max?: number` (default `100`)
 * - `getAriaValueText?: (value) => string`
 *
 * @since 0.1.0
 */
function ProgressRoot({ className, ...props }: ProgressRootProps) {
  return (
    <Progress.Root
      data-slot="progress-root"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}
ProgressRoot.displayName = "ProgressRoot";

// ---- TRACK ------------------------------------------------------------------

export type ProgressTrackProps = React.ComponentPropsWithoutRef<
  typeof Progress.Track
>;

/**
 * The background rail. Host for `ProgressIndicator`.
 *
 * @since 0.1.0
 */
function ProgressTrack({ className, ...props }: ProgressTrackProps) {
  return (
    <Progress.Track
      data-slot="progress-track"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    />
  );
}
ProgressTrack.displayName = "ProgressTrack";

// ---- INDICATOR --------------------------------------------------------------

export type ProgressIndicatorProps = React.ComponentPropsWithoutRef<
  typeof Progress.Indicator
>;

/**
 * The filled portion. Animates its width smoothly between value updates;
 * motion is disabled under `prefers-reduced-motion`.
 *
 * Data attributes:
 * - `data-indeterminate` — present when `value={null}`
 * - `data-complete` — present at 100%
 *
 * @since 0.1.0
 */
function ProgressIndicator({ className, ...props }: ProgressIndicatorProps) {
  return (
    <Progress.Indicator
      data-slot="progress-indicator"
      className={cn(
        "h-full bg-primary",
        "transition-[width] duration-300 ease-out motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  );
}
ProgressIndicator.displayName = "ProgressIndicator";

// ---- LABEL ------------------------------------------------------------------

export type ProgressLabelProps = React.ComponentPropsWithoutRef<"span">;

/**
 * Text label for the progress bar. Kept as a plain `<span>` so it composes
 * freely — rendering it inside or outside `ProgressRoot` both work.
 *
 * @since 0.1.0
 */
function ProgressLabel({ className, ...props }: ProgressLabelProps) {
  return (
    <span
      data-slot="progress-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}
ProgressLabel.displayName = "ProgressLabel";

// ---- VALUE ------------------------------------------------------------------

export type ProgressValueProps = React.ComponentPropsWithoutRef<"span">;

/**
 * Numeric display of the current value. Pass the formatted string as
 * children — e.g. `{`${percent}%`}`.
 *
 * @since 0.1.0
 */
function ProgressValue({ className, ...props }: ProgressValueProps) {
  return (
    <span
      data-slot="progress-value"
      className={cn(
        "text-sm font-medium text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  );
}
ProgressValue.displayName = "ProgressValue";

// ---- EXPORTS ----------------------------------------------------------------

export {
  ProgressRoot,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
};
