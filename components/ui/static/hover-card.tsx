/**
 * Hover Card — Preview card triggered by hover.
 * Built on @base-ui/react PreviewCard primitive.
 *
 * @example
 * <HoverCardRoot>
 *   <HoverCardTrigger>Hover me</HoverCardTrigger>
 *   <HoverCardPortal>
 *     <HoverCardPositioner>
 *       <HoverCardPopup>
 *         <HoverCardArrow />
 *         Card content
 *       </HoverCardPopup>
 *     </HoverCardPositioner>
 *   </HoverCardPortal>
 * </HoverCardRoot>
 *
 * @see https://base-ui.com/react/components/preview-card
 */
"use client";

import * as React from "react";
import { PreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@/lib/utils";

// ---- HOVER CARD ROOT --------------------------------------------------------

const HoverCardRoot = PreviewCard.Root;

// ---- HOVER CARD TRIGGER -----------------------------------------------------

const HoverCardTrigger = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof PreviewCard.Trigger>
>(({ className, ...props }, ref) => (
  <PreviewCard.Trigger
    ref={ref}
    className={cn(
      "cursor-pointer underline decoration-muted-foreground/40 underline-offset-4",
      "hover:decoration-foreground transition-colors",
      className
    )}
    {...props}
  />
));
HoverCardTrigger.displayName = "HoverCardTrigger";

// ---- HOVER CARD PORTAL ------------------------------------------------------

const HoverCardPortal = PreviewCard.Portal;

// ---- HOVER CARD POSITIONER --------------------------------------------------

const HoverCardPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PreviewCard.Positioner>
>(({ className, ...props }, ref) => (
  <PreviewCard.Positioner
    ref={ref}
    className={cn("z-50", className)}
    sideOffset={8}
    {...props}
  />
));
HoverCardPositioner.displayName = "HoverCardPositioner";

// ---- HOVER CARD POPUP -------------------------------------------------------

const HoverCardPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PreviewCard.Popup>
>(({ className, ...props }, ref) => (
  <PreviewCard.Popup
    ref={ref}
    className={cn(
      "w-72 rounded-lg border border-border bg-background p-4 shadow-md",
      "origin-(--transform-origin) transform-gpu",
      "transition-[scale,opacity] duration-200",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
      className
    )}
    {...props}
  />
));
HoverCardPopup.displayName = "HoverCardPopup";

// ---- HOVER CARD ARROW -------------------------------------------------------

const HoverCardArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PreviewCard.Arrow>
>(({ className, ...props }, ref) => (
  <PreviewCard.Arrow
    ref={ref}
    className={cn(
      "data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=right]:left-[-13px] data-[side=top]:bottom-[-8px]",
      className
    )}
    {...props}
  >
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.859 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66437 2.60207Z"
        className="fill-background"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5765 6.27318C17.0207 6.67083 17.5879 6.93172 18.1962 7H20V8H18.5765C17.5468 8 16.5936 7.63423 15.859 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V7H2.13172C2.72674 6.93172 3.29392 6.67083 3.73818 6.27318L8.99542 1.85876Z"
        className="fill-border"
      />
    </svg>
  </PreviewCard.Arrow>
));
HoverCardArrow.displayName = "HoverCardArrow";

// ---- HOVER CARD VIEWPORT (optional — for multi-trigger animated content transitions) -

const HoverCardViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PreviewCard.Viewport>
>(({ className, ...props }, ref) => (
  <PreviewCard.Viewport ref={ref} className={className} {...props} />
));
HoverCardViewport.displayName = "HoverCardViewport";

// ---- HOVER CARD BACKDROP ----------------------------------------------------

const HoverCardBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PreviewCard.Backdrop>
>(({ className, ...props }, ref) => (
  <PreviewCard.Backdrop
    ref={ref}
    className={cn("fixed inset-0 z-50", className)}
    {...props}
  />
));
HoverCardBackdrop.displayName = "HoverCardBackdrop";

// ---- HOVER CARD HANDLE ------------------------------------------------------

const HoverCardHandle = PreviewCard.Handle;
const createHoverCardHandle = PreviewCard.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardPositioner,
  HoverCardPopup,
  HoverCardArrow,
  HoverCardViewport,
  HoverCardBackdrop,
  HoverCardHandle,
  createHoverCardHandle,
};
