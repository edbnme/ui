/**
 * Progress — Progress bar for tracking async operation completion.
 * Built on @base-ui/react Progress primitive.
 *
 * @example
 * <ProgressRoot value={60}>
 *   <ProgressLabel>Loading...</ProgressLabel>
 *   <ProgressTrack>
 *     <ProgressIndicator />
 *   </ProgressTrack>
 *   <ProgressValue />
 * </ProgressRoot>
 *
 * @see https://base-ui.com/react/components/progress
 */
"use client";

import * as React from "react";
import { Progress } from "@base-ui/react/progress";
import { cn } from "@/lib/utils";

// =============================================================================
// PROGRESS ROOT
// =============================================================================

const ProgressRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Progress.Root>
>(({ className, ...props }, ref) => (
  <Progress.Root
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
ProgressRoot.displayName = "ProgressRoot";

// =============================================================================
// PROGRESS TRACK
// =============================================================================

const ProgressTrack = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Progress.Track>
>(({ className, ...props }, ref) => (
  <Progress.Track
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  />
));
ProgressTrack.displayName = "ProgressTrack";

// =============================================================================
// PROGRESS INDICATOR
// =============================================================================

const ProgressIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Progress.Indicator>
>(({ className, ...props }, ref) => (
  <Progress.Indicator
    ref={ref}
    className={cn("h-full w-full flex-1 bg-primary transition-all", className)}
    {...props}
  />
));
ProgressIndicator.displayName = "ProgressIndicator";

// =============================================================================
// PROGRESS LABEL (for screen readers)
// =============================================================================

const ProgressLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-sm font-medium text-foreground", className)}
    {...props}
  />
));
ProgressLabel.displayName = "ProgressLabel";

// =============================================================================
// PROGRESS VALUE
// =============================================================================

const ProgressValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-sm font-medium text-muted-foreground", className)}
    {...props}
  />
));
ProgressValue.displayName = "ProgressValue";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ProgressRoot,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
};
