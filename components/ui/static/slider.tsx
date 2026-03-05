"use client";

import * as React from "react";
import { Slider } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

// =============================================================================
// SLIDER ROOT
// =============================================================================

const SliderRoot = React.forwardRef<HTMLDivElement, Slider.Root.Props>(
  ({ className, ...props }, ref) => (
    <Slider.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    />
  )
);
SliderRoot.displayName = "SliderRoot";

// =============================================================================
// SLIDER CONTROL
// =============================================================================

const SliderControl = React.forwardRef<HTMLDivElement, Slider.Control.Props>(
  ({ className, ...props }, ref) => (
    <Slider.Control
      ref={ref}
      className={cn(
        "relative flex h-5 w-full touch-none select-none items-center",
        className
      )}
      {...props}
    />
  )
);
SliderControl.displayName = "SliderControl";

// =============================================================================
// SLIDER TRACK
// =============================================================================

const SliderTrack = React.forwardRef<HTMLDivElement, Slider.Track.Props>(
  ({ className, ...props }, ref) => (
    <Slider.Track
      ref={ref}
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    />
  )
);
SliderTrack.displayName = "SliderTrack";

// =============================================================================
// SLIDER INDICATOR
// =============================================================================

const SliderIndicator = React.forwardRef<
  HTMLDivElement,
  Slider.Indicator.Props
>(({ className, ...props }, ref) => (
  <Slider.Indicator
    ref={ref}
    className={cn("absolute h-full bg-primary", className)}
    {...props}
  />
));
SliderIndicator.displayName = "SliderIndicator";

// =============================================================================
// SLIDER THUMB
// =============================================================================

const SliderThumb = React.forwardRef<HTMLDivElement, Slider.Thumb.Props>(
  ({ className, ...props }, ref) => (
    <Slider.Thumb
      ref={ref}
      className={cn(
        "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
SliderThumb.displayName = "SliderThumb";

// =============================================================================
// SLIDER VALUE
// =============================================================================

const SliderValue = React.forwardRef<HTMLOutputElement, Slider.Value.Props>(
  ({ className, ...props }, ref) => (
    <Slider.Value
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
SliderValue.displayName = "SliderValue";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  SliderValue,
};

// Backward-compatible alias (formerly shared/)
export { SliderRoot as Slider };
