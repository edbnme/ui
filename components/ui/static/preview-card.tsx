/**
 * PreviewCard — Hover-triggered preview card (like GitHub user cards).
 * Built on @base-ui/react PreviewCard primitive.
 *
 * @example
 * <PreviewCardRoot>
 *   <PreviewCardTrigger href="/user">@username</PreviewCardTrigger>
 *   <PreviewCardPortal>
 *     <PreviewCardPositioner>
 *       <PreviewCardPopup>Profile preview</PreviewCardPopup>
 *     </PreviewCardPositioner>
 *   </PreviewCardPortal>
 * </PreviewCardRoot>
 *
 * @see https://base-ui.com/react/components/preview-card
 */
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
      "origin-(--transform-origin) transform-gpu transition-[scale,opacity] duration-200",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
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
// PREVIEW CARD VIEWPORT (optional — for multi-trigger animated content transitions)
// =============================================================================

const PreviewCardViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof PreviewCard.Viewport>
>(({ className, ...props }, ref) => (
  <PreviewCard.Viewport ref={ref} className={className} {...props} />
));
PreviewCardViewport.displayName = "PreviewCardViewport";

// =============================================================================
// PREVIEW CARD BACKDROP
// =============================================================================

const PreviewCardBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof PreviewCard.Backdrop>
>(({ className, ...props }, ref) => (
  <PreviewCard.Backdrop
    ref={ref}
    className={cn("fixed inset-0 z-50", className)}
    {...props}
  />
));
PreviewCardBackdrop.displayName = "PreviewCardBackdrop";

// =============================================================================
// PREVIEW CARD HANDLE
// =============================================================================

const PreviewCardHandle = PreviewCard.Handle;
const createPreviewCardHandle = PreviewCard.createHandle;

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
  PreviewCardViewport,
  PreviewCardBackdrop,
  PreviewCardHandle,
  createPreviewCardHandle,
};
