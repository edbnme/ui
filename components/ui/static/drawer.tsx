/**
 * Drawer — Bottom sheet / drawer component built on @base-ui/react Drawer.
 * Supports swipe-to-dismiss, snap points, and nested drawers.
 *
 * NEW in Base UI v1.2.0 — native swipe gesture support.
 *
 * @example
 * <DrawerRoot>
 *   <DrawerTrigger>Open Drawer</DrawerTrigger>
 *   <DrawerPortal>
 *     <DrawerBackdrop />
 *     <DrawerViewport>
 *       <DrawerPopup>
 *         <DrawerHandle />
 *         <DrawerContent>
 *           <DrawerTitle>Title</DrawerTitle>
 *           <DrawerDescription>Description</DrawerDescription>
 *         </DrawerContent>
 *         <DrawerClose>Close</DrawerClose>
 *       </DrawerPopup>
 *     </DrawerViewport>
 *   </DrawerPortal>
 * </DrawerRoot>
 *
 * @see https://base-ui.com/react/components/drawer
 */
"use client";

import * as React from "react";
import { DrawerPreview as Drawer } from "@base-ui/react/drawer";
import { cn } from "@/lib/utils";

// =============================================================================
// DRAWER ROOT
// =============================================================================

const DrawerRoot = Drawer.Root;

// =============================================================================
// DRAWER TRIGGER
// =============================================================================

const DrawerTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Drawer.Trigger>
>(({ className, ...props }, ref) => (
  <Drawer.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors select-none",
      "hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring active:bg-muted/80",
      className
    )}
    {...props}
  />
));
DrawerTrigger.displayName = "DrawerTrigger";

// =============================================================================
// DRAWER PORTAL
// =============================================================================

const DrawerPortal = Drawer.Portal;

// =============================================================================
// DRAWER BACKDROP
// =============================================================================

const DrawerBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Drawer.Backdrop>
>(({ className, ...props }, ref) => (
  <Drawer.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "data-swiping:duration-0",
      "data-starting-style:opacity-0 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
DrawerBackdrop.displayName = "DrawerBackdrop";

// =============================================================================
// DRAWER VIEWPORT
// =============================================================================

const DrawerViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Drawer.Viewport>
>(({ className, ...props }, ref) => (
  <Drawer.Viewport
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-end justify-center",
      className
    )}
    {...props}
  />
));
DrawerViewport.displayName = "DrawerViewport";

// =============================================================================
// DRAWER POPUP
// =============================================================================

const DrawerPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Drawer.Popup>
>(({ className, ...props }, ref) => (
  <Drawer.Popup
    ref={ref}
    className={cn(
      "w-full max-h-[85vh] rounded-t-2xl bg-background border border-border border-b-0 shadow-lg",
      "overflow-y-auto overscroll-contain",
      "transform-[translateY(var(--drawer-swipe-movement-y))]",
      "transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "data-swiping:select-none data-swiping:duration-0",
      "data-starting-style:translate-y-full data-ending-style:translate-y-full",
      className
    )}
    {...props}
  />
));
DrawerPopup.displayName = "DrawerPopup";

// =============================================================================
// DRAWER HANDLE (drag indicator)
// =============================================================================

const DrawerHandle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mx-auto mt-4 mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/30",
      className
    )}
    aria-hidden
    {...props}
  />
);
DrawerHandle.displayName = "DrawerHandle";

// =============================================================================
// DRAWER CONTENT
// =============================================================================

const DrawerContent = Drawer.Content;

// =============================================================================
// DRAWER TITLE
// =============================================================================

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof Drawer.Title>
>(({ className, ...props }, ref) => (
  <Drawer.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

// =============================================================================
// DRAWER DESCRIPTION
// =============================================================================

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Drawer.Description>
>(({ className, ...props }, ref) => (
  <Drawer.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

// =============================================================================
// DRAWER CLOSE
// =============================================================================

const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Drawer.Close>
>(({ className, ...props }, ref) => (
  <Drawer.Close
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors select-none",
      "hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring active:bg-muted/80",
      className
    )}
    {...props}
  />
));
DrawerClose.displayName = "DrawerClose";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  DrawerRoot,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerViewport,
  DrawerPopup,
  DrawerHandle,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
};
