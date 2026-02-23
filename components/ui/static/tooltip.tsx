"use client";

import * as React from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

// =============================================================================
// TOOLTIP PROVIDER
// =============================================================================

const TooltipProvider = Tooltip.Provider;

// =============================================================================
// TOOLTIP ROOT
// =============================================================================

const TooltipRoot = Tooltip.Root;

// =============================================================================
// TOOLTIP TRIGGER
// =============================================================================

const TooltipTrigger = Tooltip.Trigger;

// =============================================================================
// TOOLTIP PORTAL
// =============================================================================

const TooltipPortal = Tooltip.Portal;

// =============================================================================
// TOOLTIP POSITIONER
// =============================================================================

const TooltipPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Tooltip.Positioner>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Tooltip.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50", className)}
    {...props}
  />
));
TooltipPositioner.displayName = "TooltipPositioner";

// =============================================================================
// TOOLTIP POPUP
// =============================================================================

const TooltipPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Tooltip.Popup>
>(({ className, ...props }, ref) => (
  <Tooltip.Popup
    ref={ref}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
      "origin-(--transform-origin) transition-all duration-150",
      "data-starting-style:scale-90 data-starting-style:opacity-0",
      "data-ending-style:scale-90 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
TooltipPopup.displayName = "TooltipPopup";

// =============================================================================
// TOOLTIP ARROW
// =============================================================================

const TooltipArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Tooltip.Arrow>
>(({ className, ...props }, ref) => (
  <Tooltip.Arrow
    ref={ref}
    className={cn(
      "fill-primary",
      "data-side_bottom:rotate-180 data-side_left:rotate-90 data-side_right:-rotate-90",
      className
    )}
    {...props}
  >
    <svg width="10" height="5" viewBox="0 0 10 5" fill="currentColor">
      <path d="M0 5L5 0L10 5H0Z" />
    </svg>
  </Tooltip.Arrow>
));
TooltipArrow.displayName = "TooltipArrow";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  TooltipArrow,
};
