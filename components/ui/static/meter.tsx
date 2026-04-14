/**
 * Meter — Displays a value within a known range (e.g., disk usage, signal strength).
 * Built on @base-ui/react Meter primitive.
 *
 * @example
 * <MeterRoot value={75}>
 *   <MeterLabel>Storage</MeterLabel>
 *   <MeterTrack>
 *     <MeterIndicator />
 *   </MeterTrack>
 *   <MeterValue />
 * </MeterRoot>
 *
 * @see https://base-ui.com/react/components/meter
 */
"use client";

import * as React from "react";
import { Meter } from "@base-ui/react/meter";
import { cn } from "@/lib/utils";

// ---- METER ROOT -------------------------------------------------------------

const MeterRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Meter.Root>
>(({ className, ...props }, ref) => (
  <Meter.Root
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
MeterRoot.displayName = "MeterRoot";

// ---- METER LABEL ------------------------------------------------------------

const MeterLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium text-foreground", className)}
    {...props}
  />
));
MeterLabel.displayName = "MeterLabel";

// ---- METER TRACK ------------------------------------------------------------

const MeterTrack = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Meter.Track>
>(({ className, ...props }, ref) => (
  <Meter.Track
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  />
));
MeterTrack.displayName = "MeterTrack";

// ---- METER INDICATOR --------------------------------------------------------

const MeterIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Meter.Indicator>
>(({ className, ...props }, ref) => (
  <Meter.Indicator
    ref={ref}
    className={cn("h-full bg-primary transition-[width]", className)}
    {...props}
  />
));
MeterIndicator.displayName = "MeterIndicator";

// ---- METER VALUE ------------------------------------------------------------

const MeterValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-sm font-medium text-muted-foreground", className)}
    {...props}
  />
));
MeterValue.displayName = "MeterValue";

// ---- EXPORTS ----------------------------------------------------------------

export { MeterRoot, MeterLabel, MeterTrack, MeterIndicator, MeterValue };
