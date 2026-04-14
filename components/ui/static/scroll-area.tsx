/**
 * ScrollArea — Custom scrollbar overlay for scrollable content.
 * Built on @base-ui/react ScrollArea primitive.
 *
 * @example
 * <ScrollArea className="h-64">
 *   <ScrollAreaViewport>Long content...</ScrollAreaViewport>
 *   <ScrollBar orientation="vertical" />
 * </ScrollArea>
 *
 * @see https://base-ui.com/react/components/scroll-area
 */
"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@/lib/utils";

// ---- SCROLL AREA ROOT -------------------------------------------------------

const ScrollAreaRoot = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Root.Props
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  />
));
ScrollAreaRoot.displayName = "ScrollAreaRoot";

// ---- SCROLL AREA VIEWPORT ---------------------------------------------------

const ScrollAreaViewport = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Viewport.Props
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={cn("h-full w-full", className)}
    {...props}
  />
));
ScrollAreaViewport.displayName = "ScrollAreaViewport";

// ---- SCROLL AREA CONTENT ----------------------------------------------------

const ScrollAreaContent = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Content.Props
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Content
    ref={ref}
    className={cn("table", className)}
    {...props}
  />
));
ScrollAreaContent.displayName = "ScrollAreaContent";

// ---- SCROLL AREA SCROLLBAR --------------------------------------------------

const ScrollAreaScrollbar = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Scrollbar.Props
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
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

// ---- SCROLL AREA THUMB ------------------------------------------------------

const ScrollAreaThumb = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Thumb.Props
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Thumb
    ref={ref}
    className={cn("relative flex-1 rounded-full bg-border", className)}
    {...props}
  />
));
ScrollAreaThumb.displayName = "ScrollAreaThumb";

// ---- SCROLL AREA CORNER -----------------------------------------------------

const ScrollAreaCorner = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Corner.Props
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Corner
    ref={ref}
    className={cn("bg-border", className)}
    {...props}
  />
));
ScrollAreaCorner.displayName = "ScrollAreaCorner";

// ---- EXPORTS ----------------------------------------------------------------

export {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
};

// Backward-compatible aliases (formerly shared/)
export { ScrollAreaRoot as ScrollArea };
export { ScrollAreaScrollbar as ScrollBar };
