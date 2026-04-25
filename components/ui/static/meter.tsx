/**
 * Meter — Displays a value within a known range (disk usage, signal
 * strength, score).
 *
 * Built on the Base UI `Meter` primitive. Distinct from `Progress`: a
 * meter reports a *static* measurement, not a *changing* operation. Use
 * `Progress` for uploads; use `Meter` for "12 GB of 16 GB used".
 *
 * Anatomy:
 * ```tsx
 * <MeterRoot value={75}>
 *   <div className="flex items-baseline justify-between">
 *     <MeterLabel>Storage</MeterLabel>
 *     <MeterValue>75%</MeterValue>
 *   </div>
 *   <MeterTrack>
 *     <MeterIndicator />
 *   </MeterTrack>
 * </MeterRoot>
 * ```
 *
 * Accessibility: `MeterRoot` renders as ARIA `meter`. Provide a label via
 * `MeterLabel` (a plain `<label>`) or `aria-label`. Values outside
 * `[min..max]` are clamped.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/meter
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/meter
 * @registryDescription Visual indicator for scalar measurements within a known range.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Meter } from "@base-ui/react/meter";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type MeterRootProps = React.ComponentPropsWithoutRef<typeof Meter.Root>;

/**
 * The coordinating container.
 *
 * Props of note:
 * - `value: number` (required)
 * - `min?: number` (default `0`)
 * - `max?: number` (default `100`)
 * - `getAriaValueText?: (value) => string`
 *
 * @since 0.1.0
 */
function MeterRoot({ className, ...props }: MeterRootProps) {
  return (
    <Meter.Root
      data-slot="meter-root"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}
MeterRoot.displayName = "MeterRoot";

// ---- LABEL ------------------------------------------------------------------

export type MeterLabelProps = React.ComponentPropsWithoutRef<"label">;

/**
 * Text label. Plain `<label>` so it composes freely (inside or outside
 * `MeterRoot`). For explicit association use `htmlFor` with the meter's
 * `id`.
 *
 * @since 0.1.0
 */
function MeterLabel({ className, ...props }: MeterLabelProps) {
  return (
    <label
      data-slot="meter-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}
MeterLabel.displayName = "MeterLabel";

// ---- TRACK ------------------------------------------------------------------

export type MeterTrackProps = React.ComponentPropsWithoutRef<typeof Meter.Track>;

/**
 * The background rail. Host for `MeterIndicator`.
 *
 * @since 0.1.0
 */
function MeterTrack({ className, ...props }: MeterTrackProps) {
  return (
    <Meter.Track
      data-slot="meter-track"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    />
  );
}
MeterTrack.displayName = "MeterTrack";

// ---- INDICATOR --------------------------------------------------------------

export type MeterIndicatorProps = React.ComponentPropsWithoutRef<
  typeof Meter.Indicator
>;

/**
 * The filled portion. Animates width smoothly between value updates;
 * disabled under `prefers-reduced-motion`.
 *
 * @since 0.1.0
 */
function MeterIndicator({ className, ...props }: MeterIndicatorProps) {
  return (
    <Meter.Indicator
      data-slot="meter-indicator"
      className={cn(
        "h-full bg-primary",
        "transition-[width] duration-300 ease-out motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  );
}
MeterIndicator.displayName = "MeterIndicator";

// ---- VALUE ------------------------------------------------------------------

export type MeterValueProps = React.ComponentPropsWithoutRef<"span">;

/**
 * Numeric display of the current value.
 *
 * @since 0.1.0
 */
function MeterValue({ className, ...props }: MeterValueProps) {
  return (
    <span
      data-slot="meter-value"
      className={cn(
        "text-sm font-medium text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  );
}
MeterValue.displayName = "MeterValue";

// ---- EXPORTS ----------------------------------------------------------------

export { MeterRoot, MeterLabel, MeterTrack, MeterIndicator, MeterValue };
