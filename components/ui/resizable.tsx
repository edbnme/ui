﻿/**
 * Resizable — Draggable panel groups with resize handles.
 * Built on the `react-resizable-panels` library.
 *
 * Composes three pieces: `ResizablePanelGroup` (the horizontal or
 * vertical container), `ResizablePanel` (an individual panel with a
 * default size), and `ResizableHandle` (the draggable divider). Pass
 * `withHandle` to render a small grip affordance on the divider.
 *
 * Anatomy:
 * ```tsx
 * <ResizablePanelGroup direction="horizontal">
 *   <ResizablePanel defaultSize={50}>Left</ResizablePanel>
 *   <ResizableHandle withHandle />
 *   <ResizablePanel defaultSize={50}>Right</ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/resizable
 * @upstream   react-resizable-panels — https://github.com/bvaughn/react-resizable-panels
 * @registryDescription Resizable panel groups with drag handles for flexible layouts.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import { DotsSixVertical } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- PANEL GROUP ------------------------------------------------------------

export type ResizablePanelGroupProps = React.ComponentPropsWithoutRef<
  typeof PanelGroup
>;

/**
 * Horizontal or vertical container for panels. Set `direction` to
 * `"horizontal"` or `"vertical"`.
 *
 * @since 0.1.0
 */
function ResizablePanelGroup({
  className,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}
ResizablePanelGroup.displayName = "ResizablePanelGroup";

// ---- PANEL ------------------------------------------------------------------

/**
 * A single resizable panel. Direct re-export from `react-resizable-panels` —
 * accepts `defaultSize`, `minSize`, `maxSize`, and `order`.
 *
 * @since 0.1.0
 */
const ResizablePanel = Panel;

// ---- HANDLE -----------------------------------------------------------------

export type ResizableHandleProps = React.ComponentPropsWithoutRef<
  typeof PanelResizeHandle
> & {
  /** Render a visible grip affordance on the divider. */
  withHandle?: boolean;
};

/**
 * Draggable divider between panels. Pass `withHandle` to show a grip
 * icon for better discoverability.
 *
 * @since 0.1.0
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizableHandleProps) {
  return (
    <PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "bg-border relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
        "[&[data-resize-handle-active]]:bg-ring",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          data-slot="resizable-handle-grip"
          className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-border"
        >
          <DotsSixVertical className="h-2.5 w-2.5" aria-hidden />
        </div>
      )}
    </PanelResizeHandle>
  );
}
ResizableHandle.displayName = "ResizableHandle";

// ---- EXPORTS ----------------------------------------------------------------

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
