"use client";

import * as React from "react";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { cn } from "@/lib/utils";

// =============================================================================
// SCROLL AREA ROOT
// =============================================================================

const ScrollAreaRoot = React.forwardRef<HTMLDivElement, ScrollArea.Root.Props>(
  ({ className, ...props }, ref) => (
    <ScrollArea.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  )
);
ScrollAreaRoot.displayName = "ScrollAreaRoot";

// =============================================================================
// SCROLL AREA VIEWPORT
// =============================================================================

const ScrollAreaViewport = React.forwardRef<
  HTMLDivElement,
  ScrollArea.Viewport.Props
>(({ className, ...props }, ref) => (
  <ScrollArea.Viewport
    ref={ref}
    className={cn("h-full w-full", className)}
    {...props}
  />
));
ScrollAreaViewport.displayName = "ScrollAreaViewport";

// =============================================================================
// SCROLL AREA SCROLLBAR
// =============================================================================

const ScrollAreaScrollbar = React.forwardRef<
  HTMLDivElement,
  ScrollArea.Scrollbar.Props
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollArea.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical"
        ? "h-full w-2.5 border-l border-l-transparent p-px"
        : "h-2.5 flex-col border-t border-t-transparent p-px",
      className
    )}
    {...props}
  />
));
ScrollAreaScrollbar.displayName = "ScrollAreaScrollbar";

// =============================================================================
// SCROLL AREA THUMB
// =============================================================================

const ScrollAreaThumb = React.forwardRef<
  HTMLDivElement,
  ScrollArea.Thumb.Props
>(({ className, ...props }, ref) => (
  <ScrollArea.Thumb
    ref={ref}
    className={cn("relative flex-1 rounded-full bg-border", className)}
    {...props}
  />
));
ScrollAreaThumb.displayName = "ScrollAreaThumb";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
};
