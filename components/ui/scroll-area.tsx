/**
 * ScrollArea - Custom scrollbars over a native scroll container.
 *
 * Built on the Base UI `ScrollArea` primitive. The primitive parts stay
 * available for exact composition, and the `ScrollArea` export provides a
 * polished default with edge cues, keyboard-focusable viewport, and both-axis
 * support.
 *
 * Anatomy:
 * ```tsx
 * <ScrollAreaRoot className="h-64 w-full">
 *   <ScrollAreaViewport>
 *     <ScrollAreaContent>Long content</ScrollAreaContent>
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
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui - https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/scroll-area
 * @upstream   Base UI v1.5.0 - https://base-ui.com/react/components/scroll-area
 * @registryDescription Native scroll area with custom scrollbars and edge cues.
 */

"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

import { cn } from "@/lib/utils";

function composeClassName<TProps extends { className?: unknown }>(
  baseClassName: string,
  className: TProps["className"]
): TProps["className"] {
  if (typeof className === "function") {
    return ((state: unknown) =>
      cn(
        baseClassName,
        (className as (state: unknown) => string)(state)
      )) as TProps["className"];
  }

  return cn(
    baseClassName,
    className as string | undefined
  ) as TProps["className"];
}

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type ScrollAreaCueSize = "tight" | "comfortable";
export type ScrollAreaCueEdge = "top" | "bottom" | "left" | "right";

// ---- ROOT -------------------------------------------------------------------

export type ScrollAreaRootProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
>;

/**
 * The outer container. Provides the positioning context for scrollbars and
 * exposes Base UI overflow data attributes.
 *
 * @since 0.1.0
 */
const ScrollAreaRoot = React.forwardRef<HTMLDivElement, ScrollAreaRootProps>(
  ({ className, ...props }, ref) => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="scroll-area-root"
      className={composeClassName<ScrollAreaRootProps>(
        cn(
          "group/scroll-area relative overflow-hidden rounded-[inherit]",
          "focus-within:ring-2 focus-within:ring-ring/30",
          "[--scroll-area-cue-surface:var(--background)]"
        ),
        className
      )}
      {...props}
    />
  )
);
ScrollAreaRoot.displayName = "ScrollAreaRoot";

// ---- VIEWPORT ---------------------------------------------------------------

export type ScrollAreaViewportProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Viewport
>;

/**
 * The actual scrollable region. All scroll interactions happen here.
 *
 * @since 0.1.0
 */
const ScrollAreaViewport = React.forwardRef<
  HTMLDivElement,
  ScrollAreaViewportProps
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    data-slot="scroll-area-viewport"
    className={composeClassName<ScrollAreaViewportProps>(
      cn(
        "h-full w-full rounded-[inherit] outline-none",
        "focus-visible:outline-none"
      ),
      className
    )}
    {...props}
  />
));
ScrollAreaViewport.displayName = "ScrollAreaViewport";

// ---- CONTENT ----------------------------------------------------------------

export type ScrollAreaContentProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Content
>;

/**
 * Content wrapper measured by Base UI for overflow and thumb sizing.
 *
 * @since 0.1.0
 */
const ScrollAreaContent = React.forwardRef<
  HTMLDivElement,
  ScrollAreaContentProps
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Content
    ref={ref}
    data-slot="scroll-area-content"
    className={composeClassName<ScrollAreaContentProps>(
      "min-w-full",
      className
    )}
    {...props}
  />
));
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
const ScrollAreaScrollbar = React.forwardRef<
  HTMLDivElement,
  ScrollAreaScrollbarProps
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    className={composeClassName<ScrollAreaScrollbarProps>(
      cn(
        "z-20 flex touch-none select-none",
        "opacity-0 transition-[opacity,background-color] duration-200 ease-out",
        "pointer-events-none motion-reduce:transition-none",
        "data-[hovering]:pointer-events-auto data-[scrolling]:pointer-events-auto",
        "data-[hovering]:opacity-100 data-[scrolling]:opacity-100",
        "group-hover/scroll-area:pointer-events-auto group-hover/scroll-area:opacity-100",
        "group-focus-within/scroll-area:pointer-events-auto group-focus-within/scroll-area:opacity-100",
        orientation === "vertical"
          ? "h-full w-2.5 border-l border-l-transparent p-px"
          : "h-2.5 flex-col border-t border-t-transparent p-px"
      ),
      className
    )}
    {...props}
  />
));
ScrollAreaScrollbar.displayName = "ScrollAreaScrollbar";

// ---- THUMB ------------------------------------------------------------------

export type ScrollAreaThumbProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Thumb
>;

/**
 * The draggable thumb. Size is computed by Base UI from the viewport/content
 * ratio.
 *
 * @since 0.1.0
 */
const ScrollAreaThumb = React.forwardRef<HTMLDivElement, ScrollAreaThumbProps>(
  ({ className, ...props }, ref) => (
    <ScrollAreaPrimitive.Thumb
      ref={ref}
      data-slot="scroll-area-thumb"
      className={composeClassName<ScrollAreaThumbProps>(
        cn(
          "relative flex-1 rounded-full bg-border/80",
          "transition-colors duration-150 hover:bg-foreground/30 active:bg-foreground/40"
        ),
        className
      )}
      {...props}
    />
  )
);
ScrollAreaThumb.displayName = "ScrollAreaThumb";

// ---- CORNER -----------------------------------------------------------------

export type ScrollAreaCornerProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Corner
>;

/**
 * The square where vertical and horizontal scrollbars meet.
 *
 * @since 0.1.0
 */
const ScrollAreaCorner = React.forwardRef<
  HTMLDivElement,
  ScrollAreaCornerProps
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Corner
    ref={ref}
    data-slot="scroll-area-corner"
    className={composeClassName<ScrollAreaCornerProps>(
      "bg-border/60",
      className
    )}
    {...props}
  />
));
ScrollAreaCorner.displayName = "ScrollAreaCorner";

// ---- EDGE CUE ---------------------------------------------------------------

export interface ScrollAreaEdgeCueProps extends React.ComponentPropsWithoutRef<"div"> {
  edge: ScrollAreaCueEdge;
  cueSize?: ScrollAreaCueSize;
  chevron?: boolean;
  visible?: boolean;
}

const cueSizeClass: Record<
  ScrollAreaCueEdge,
  Record<ScrollAreaCueSize, string>
> = {
  top: { tight: "h-8", comfortable: "h-[60px]" },
  bottom: { tight: "h-8", comfortable: "h-[60px]" },
  left: { tight: "w-8", comfortable: "w-[60px]" },
  right: { tight: "w-8", comfortable: "w-[60px]" },
};

const cuePlacementClass: Record<ScrollAreaCueEdge, string> = {
  top: "inset-x-0 top-0 items-start justify-center pt-2",
  bottom: "inset-x-0 bottom-0 items-end justify-center pb-2",
  left: "inset-y-0 left-0 items-center justify-start pl-2",
  right: "inset-y-0 right-0 items-center justify-end pr-2",
};

const cueVisibilityClass: Record<ScrollAreaCueEdge, string> = {
  top: "group-data-[overflow-y-start]/scroll-area:opacity-100",
  bottom: "group-data-[overflow-y-end]/scroll-area:opacity-100",
  left: "group-data-[overflow-x-start]/scroll-area:opacity-100",
  right: "group-data-[overflow-x-end]/scroll-area:opacity-100",
};

const cueGradient: Record<ScrollAreaCueEdge, string> = {
  top: "linear-gradient(to bottom, var(--scroll-area-cue-surface, var(--background)) 0%, transparent 100%)",
  bottom:
    "linear-gradient(to top, var(--scroll-area-cue-surface, var(--background)) 0%, transparent 100%)",
  left: "linear-gradient(to right, var(--scroll-area-cue-surface, var(--background)) 0%, transparent 100%)",
  right:
    "linear-gradient(to left, var(--scroll-area-cue-surface, var(--background)) 0%, transparent 100%)",
};

const chevronClass: Record<ScrollAreaCueEdge, string> = {
  top: "border-l border-t rotate-45",
  bottom: "border-r border-b rotate-45",
  left: "border-l border-b rotate-45",
  right: "border-r border-t rotate-45",
};

/**
 * Non-interactive edge fade that appears while more content is available in
 * the given direction.
 *
 * @since 0.3.0
 */
const ScrollAreaEdgeCue = React.forwardRef<
  HTMLDivElement,
  ScrollAreaEdgeCueProps
>(
  (
    {
      className,
      cueSize = "comfortable",
      chevron = true,
      edge,
      visible,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      aria-hidden="true"
      data-edge={edge}
      data-slot="scroll-area-edge-cue"
      data-visible={visible ? "true" : undefined}
      className={cn(
        "pointer-events-none absolute z-10 flex text-foreground/45",
        "opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none",
        visible === undefined
          ? cueVisibilityClass[edge]
          : "data-[visible=true]:opacity-100",
        cuePlacementClass[edge],
        cueSizeClass[edge][cueSize],
        className
      )}
      style={{ backgroundImage: cueGradient[edge], ...style }}
      {...props}
    >
      {chevron ? (
        <span
          className={cn(
            "block size-2.5 border-current opacity-70",
            chevronClass[edge]
          )}
        />
      ) : null}
    </div>
  )
);
ScrollAreaEdgeCue.displayName = "ScrollAreaEdgeCue";

// ---- COMPOSED SCROLL AREA ---------------------------------------------------

export interface ScrollAreaProps extends Omit<ScrollAreaRootProps, "children"> {
  children?: React.ReactNode;
  orientation?: ScrollAreaOrientation;
  scrollFade?: boolean;
  chevron?: boolean;
  cueSize?: ScrollAreaCueSize;
  viewportClassName?: string;
  contentClassName?: string;
}

/**
 * Composed scroll area with viewport, content, scrollbars, corner, and edge
 * cues wired together.
 *
 * @since 0.3.0
 */
const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      className,
      orientation = "vertical",
      scrollFade = true,
      chevron = true,
      cueSize = "comfortable",
      viewportClassName,
      contentClassName,
      overflowEdgeThreshold = 8,
      ...props
    },
    ref
  ) => {
    const hasVerticalScrollbar = orientation !== "horizontal";
    const hasHorizontalScrollbar = orientation !== "vertical";

    return (
      <ScrollAreaRoot
        ref={ref}
        className={className}
        overflowEdgeThreshold={overflowEdgeThreshold}
        {...props}
      >
        <ScrollAreaViewport
          tabIndex={0}
          className={cn("focus-visible:outline-none", viewportClassName)}
        >
          <ScrollAreaContent
            className={cn(
              hasHorizontalScrollbar ? "w-max min-w-full" : "min-w-full",
              contentClassName
            )}
          >
            {children}
          </ScrollAreaContent>
        </ScrollAreaViewport>

        {scrollFade ? (
          <>
            {hasVerticalScrollbar ? (
              <>
                <ScrollAreaEdgeCue
                  edge="top"
                  cueSize={cueSize}
                  chevron={chevron}
                />
                <ScrollAreaEdgeCue
                  edge="bottom"
                  cueSize={cueSize}
                  chevron={chevron}
                />
              </>
            ) : null}
            {hasHorizontalScrollbar ? (
              <>
                <ScrollAreaEdgeCue
                  edge="left"
                  cueSize={cueSize}
                  chevron={chevron}
                />
                <ScrollAreaEdgeCue
                  edge="right"
                  cueSize={cueSize}
                  chevron={chevron}
                />
              </>
            ) : null}
          </>
        ) : null}

        {hasVerticalScrollbar ? (
          <ScrollAreaScrollbar keepMounted orientation="vertical">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
        ) : null}
        {hasHorizontalScrollbar ? (
          <ScrollAreaScrollbar keepMounted orientation="horizontal">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
        ) : null}
        {hasVerticalScrollbar && hasHorizontalScrollbar ? (
          <ScrollAreaCorner />
        ) : null}
      </ScrollAreaRoot>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

// ---- EXPORTS ----------------------------------------------------------------

export {
  ScrollArea,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
  ScrollAreaEdgeCue,
};

/**
 * Backward-compatible alias for the scrollbar part.
 *
 * @deprecated prefer `ScrollAreaScrollbar`.
 */
export { ScrollAreaScrollbar as ScrollBar };
