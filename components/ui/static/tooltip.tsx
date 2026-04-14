/**
 * Tooltip — Informational popup shown on hover/focus.
 * Built on @base-ui/react Tooltip primitive.
 *
 * @example
 * <TooltipProvider>
 *   <TooltipRoot>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipPortal>
 *       <TooltipPositioner>
 *         <TooltipPopup>Helpful info</TooltipPopup>
 *       </TooltipPositioner>
 *     </TooltipPortal>
 *   </TooltipRoot>
 * </TooltipProvider>
 *
 * @see https://base-ui.com/react/components/tooltip
 */
"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

// ---- TOOLTIP PROVIDER -------------------------------------------------------

const TooltipProvider = TooltipPrimitive.Provider;

// ---- TOOLTIP ROOT -----------------------------------------------------------

const TooltipRoot = TooltipPrimitive.Root;

// ---- TOOLTIP TRIGGER --------------------------------------------------------

const TooltipTrigger = TooltipPrimitive.Trigger;

// ---- TOOLTIP PORTAL ---------------------------------------------------------

const TooltipPortal = TooltipPrimitive.Portal;

// ---- TOOLTIP POSITIONER -----------------------------------------------------

const TooltipPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Positioner>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50", className)}
    {...props}
  />
));
TooltipPositioner.displayName = "TooltipPositioner";

// ---- TOOLTIP POPUP ----------------------------------------------------------

const TooltipPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Popup
    ref={ref}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
      "origin-(--transform-origin) transform-gpu transition-[scale,opacity] duration-150",
      "data-[instant]:duration-0",
      "data-starting-style:scale-90 data-starting-style:opacity-0",
      "data-ending-style:scale-90 data-ending-style:opacity-0",
      "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
      className
    )}
    {...props}
  />
));
TooltipPopup.displayName = "TooltipPopup";

// ---- TOOLTIP ARROW ----------------------------------------------------------

const TooltipArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
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
  </TooltipPrimitive.Arrow>
));
TooltipArrow.displayName = "TooltipArrow";

// ---- TOOLTIP VIEWPORT (optional — for multi-trigger animated content transitions) -

const TooltipViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Viewport ref={ref} className={className} {...props} />
));
TooltipViewport.displayName = "TooltipViewport";

// ---- TOOLTIP HANDLE ---------------------------------------------------------

const TooltipHandle = TooltipPrimitive.Handle;
const createTooltipHandle = TooltipPrimitive.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  TooltipArrow,
  TooltipViewport,
  TooltipHandle,
  createTooltipHandle,
};

// Backward-compatible aliases (formerly shared/)
const Tooltip = TooltipRoot;
const TooltipContent = TooltipPopup;
export { Tooltip, TooltipContent };
