/**
 * Popover — CSS-only popover (no motion animations).
 * Built on @base-ui/react Popover primitive.
 *
 * @example
 * <PopoverRoot>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverPortal>
 *     <PopoverPositioner>
 *       <PopoverPopup>
 *         <PopoverTitle>Settings</PopoverTitle>
 *         <PopoverDescription>Configure options</PopoverDescription>
 *       </PopoverPopup>
 *     </PopoverPositioner>
 *   </PopoverPortal>
 * </PopoverRoot>
 *
 * @see https://base-ui.com/react/components/popover
 */
"use client";

import * as React from "react";
import { Popover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

// =============================================================================
// POPOVER ROOT
// =============================================================================

const PopoverRoot = Popover.Root;

// =============================================================================
// POPOVER TRIGGER
// =============================================================================

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  Popover.Trigger.Props
>(({ className, ...props }, ref) => (
  <Popover.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background",
      "transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
PopoverTrigger.displayName = "PopoverTrigger";

// =============================================================================
// POPOVER PORTAL
// =============================================================================

const PopoverPortal = Popover.Portal;
PopoverPortal.displayName = "PopoverPortal";

// =============================================================================
// POPOVER BACKDROP
// =============================================================================

const PopoverBackdrop = React.forwardRef<
  HTMLDivElement,
  Popover.Backdrop.Props
>(({ className, ...props }, ref) => (
  <Popover.Backdrop
    ref={ref}
    className={cn("fixed inset-0 z-50", className)}
    {...props}
  />
));
PopoverBackdrop.displayName = "PopoverBackdrop";

// =============================================================================
// POPOVER POSITIONER
// =============================================================================

const PopoverPositioner = React.forwardRef<
  HTMLDivElement,
  Popover.Positioner.Props
>(({ className, ...props }, ref) => (
  <Popover.Positioner ref={ref} className={cn("z-50", className)} {...props} />
));
PopoverPositioner.displayName = "PopoverPositioner";

// =============================================================================
// POPOVER POPUP
// =============================================================================

const PopoverPopup = React.forwardRef<HTMLDivElement, Popover.Popup.Props>(
  ({ className, ...props }, ref) => (
    <Popover.Popup
      ref={ref}
      className={cn(
        "z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "origin-(--transform-origin) transition-all duration-150",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        className
      )}
      {...props}
    />
  )
);
PopoverPopup.displayName = "PopoverPopup";

// =============================================================================
// POPOVER ARROW
// =============================================================================

const PopoverArrow = React.forwardRef<HTMLDivElement, Popover.Arrow.Props>(
  ({ className, ...props }, ref) => (
    <Popover.Arrow
      ref={ref}
      className={cn(
        "relative -top-px -z-10",
        "[&>svg]:fill-popover [&>svg]:stroke-border",
        className
      )}
      {...props}
    />
  )
);
PopoverArrow.displayName = "PopoverArrow";

// =============================================================================
// POPOVER TITLE
// =============================================================================

const PopoverTitle = React.forwardRef<HTMLHeadingElement, Popover.Title.Props>(
  ({ className, ...props }, ref) => (
    <Popover.Title
      ref={ref}
      className={cn("font-medium leading-none", className)}
      {...props}
    />
  )
);
PopoverTitle.displayName = "PopoverTitle";

// =============================================================================
// POPOVER DESCRIPTION
// =============================================================================

const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  Popover.Description.Props
>(({ className, ...props }, ref) => (
  <Popover.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
PopoverDescription.displayName = "PopoverDescription";

// =============================================================================
// POPOVER CLOSE
// =============================================================================

const PopoverClose = React.forwardRef<HTMLButtonElement, Popover.Close.Props>(
  ({ className, ...props }, ref) => (
    <Popover.Close
      ref={ref}
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
        "transition-opacity hover:opacity-100",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  )
);
PopoverClose.displayName = "PopoverClose";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverBackdrop,
  PopoverPositioner,
  PopoverPopup,
  PopoverArrow,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
};
