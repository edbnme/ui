/**
 * ScrollArea — Custom scrollbars over a natively-scrolling region.
 *
 * Built on the Base UI `ScrollArea` primitive. Gives you on-brand
 * scrollbars without sacrificing native scroll physics (inertia,
 * wheel acceleration, touch momentum). The underlying element still
 * scrolls natively — we only style the scrollbar track and thumb.
 *
 * Anatomy:
 * ```tsx
 * <ScrollAreaRoot className="h-64 w-full">
 *   <ScrollAreaViewport>
 *     <ScrollAreaContent>
 *       … long content …
 *     </ScrollAreaContent>
 *   </ScrollAreaViewport>
 *   <ScrollAreaScrollbar orientation="vertical">
 *     <ScrollAreaThumb />
 *   </ScrollAreaScrollbar>
 *   <ScrollAreaScrollbar orientation="horizontal">
 *     <ScrollAreaThumb />
 *   </ScrollAreaScrollbar>
 *   <ScrollAreaCorner />
 * </ScrollAreaRoot>
 * ```
 *
 * Accessibility: the viewport is a real scrollable region, so keyboard
 * scrolling (Arrow keys, PageUp / Down, Home / End, Space) and screen
 * reader navigation work without any extra wiring. The custom scrollbar
 * is purely visual.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/scroll-area
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/scroll-area
 * @registryDescription Custom scrollbar container with cross-browser styling.
 */

"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type ScrollAreaRootProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
>;

/**
 * The outer container. Provides the positioning context for scrollbars.
 *
 * @since 0.1.0
 */
function ScrollAreaRoot({ className, ...props }: ScrollAreaRootProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area-root"
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  );
}
ScrollAreaRoot.displayName = "ScrollAreaRoot";

// ---- VIEWPORT ---------------------------------------------------------------

export type ScrollAreaViewportProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Viewport
>;

/**
 * The actual scrollable region. All scroll interactions happen here —
 * content should be direct children or nested inside `ScrollAreaContent`.
 *
 * @since 0.1.0
 */
function ScrollAreaViewport({ className, ...props }: ScrollAreaViewportProps) {
  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={cn("h-full w-full rounded-[inherit]", className)}
      {...props}
    />
  );
}
ScrollAreaViewport.displayName = "ScrollAreaViewport";

// ---- CONTENT ----------------------------------------------------------------

export type ScrollAreaContentProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Content
>;

/**
 * Optional content wrapper. Uses `display: table` so intrinsic width is
 * measured correctly for horizontal-scroll cases.
 *
 * @since 0.1.0
 */
function ScrollAreaContent({ className, ...props }: ScrollAreaContentProps) {
  return (
    <ScrollAreaPrimitive.Content
      data-slot="scroll-area-content"
      className={cn("table", className)}
      {...props}
    />
  );
}
ScrollAreaContent.displayName = "ScrollAreaContent";

// ---- SCROLLBAR --------------------------------------------------------------

export type ScrollAreaScrollbarProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Scrollbar
>;

/**
 * The scrollbar track. Orientation determines which axis it controls.
 *
 * @since 0.1.0
 */
function ScrollAreaScrollbar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaScrollbarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        orientation === "vertical"
          ? "h-full w-2.5 border-l border-l-transparent p-px"
          : "h-2.5 flex-col border-t border-t-transparent p-px",
        className
      )}
      {...props}
    />
  );
}
ScrollAreaScrollbar.displayName = "ScrollAreaScrollbar";

// ---- THUMB ------------------------------------------------------------------

export type ScrollAreaThumbProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Thumb
>;

/**
 * The draggable thumb. Size is computed by Base UI from viewport /
 * content ratio.
 *
 * @since 0.1.0
 */
function ScrollAreaThumb({ className, ...props }: ScrollAreaThumbProps) {
  return (
    <ScrollAreaPrimitive.Thumb
      data-slot="scroll-area-thumb"
      className={cn(
        "relative flex-1 rounded-full bg-border",
        "hover:bg-border/80",
        className
      )}
      {...props}
    />
  );
}
ScrollAreaThumb.displayName = "ScrollAreaThumb";

// ---- CORNER -----------------------------------------------------------------

export type ScrollAreaCornerProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Corner
>;

/**
 * The small square where vertical and horizontal scrollbars meet. Only
 * renders when both scrollbars are visible.
 *
 * @since 0.1.0
 */
function ScrollAreaCorner({ className, ...props }: ScrollAreaCornerProps) {
  return (
    <ScrollAreaPrimitive.Corner
      data-slot="scroll-area-corner"
      className={cn("bg-border", className)}
      {...props}
    />
  );
}
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

/**
 * Backward-compatible aliases — before the static-variant split these
 * were the primary names.
 *
 * @deprecated prefer the namespaced forms (`ScrollAreaRoot`, `ScrollAreaScrollbar`).
 */
export { ScrollAreaRoot as ScrollArea, ScrollAreaScrollbar as ScrollBar };
