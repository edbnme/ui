"use client";

import * as React from "react";
import { PreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@/lib/utils";

// =============================================================================
// PREVIEW CARD ROOT
// =============================================================================

const PreviewCardRoot = PreviewCard.Root;

// =============================================================================
// PREVIEW CARD TRIGGER
// =============================================================================

const PreviewCardTrigger = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithRef<typeof PreviewCard.Trigger>
>(({ className, ...props }, ref) => (
  <PreviewCard.Trigger
    ref={ref}
    className={cn(
      "text-primary underline decoration-primary/50 underline-offset-4",
      "hover:decoration-primary",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}
    {...props}
  />
));
PreviewCardTrigger.displayName = "PreviewCardTrigger";

// =============================================================================
// PREVIEW CARD PORTAL
// =============================================================================

const PreviewCardPortal = PreviewCard.Portal;

// =============================================================================
// PREVIEW CARD POSITIONER
// =============================================================================

const PreviewCardPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof PreviewCard.Positioner>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <PreviewCard.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50", className)}
    {...props}
  />
));
PreviewCardPositioner.displayName = "PreviewCardPositioner";

// =============================================================================
// PREVIEW CARD POPUP
// =============================================================================

const PreviewCardPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof PreviewCard.Popup>
>(({ className, ...props }, ref) => (
  <PreviewCard.Popup
    ref={ref}
    className={cn(
      "z-50 w-80 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      "origin-(--transform-origin) transition-all duration-200",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
PreviewCardPopup.displayName = "PreviewCardPopup";

// =============================================================================
// PREVIEW CARD ARROW
// =============================================================================

const PreviewCardArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof PreviewCard.Arrow>
>(({ className, ...props }, ref) => (
  <PreviewCard.Arrow
    ref={ref}
    className={cn(
      "relative -top-px -z-10",
      "[&>svg]:fill-popover [&>svg]:stroke-border",
      className
    )}
    {...props}
  />
));
PreviewCardArrow.displayName = "PreviewCardArrow";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  PreviewCardRoot,
  PreviewCardTrigger,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardArrow,
};
