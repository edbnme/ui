/**
 * Resizable — Draggable panel groups with resize handles.
 * Built on react-resizable-panels library.
 *
 * @example
 * <ResizablePanelGroup direction="horizontal">
 *   <ResizablePanel defaultSize={50}>Left</ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel defaultSize={50}>Right</ResizablePanel>
 * </ResizablePanelGroup>
 *
 * @see https://github.com/bvaughn/react-resizable-panels
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

// ---- RESIZABLE PANEL GROUP --------------------------------------------------

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PanelGroup>) {
  return (
    <PanelGroup
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}
ResizablePanelGroup.displayName = "ResizablePanelGroup";

// ---- RESIZABLE PANEL --------------------------------------------------------

const ResizablePanel = Panel;

// ---- RESIZABLE HANDLE -------------------------------------------------------

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <PanelResizeHandle
      className={cn(
        "bg-border relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
        "[&[data-resize-handle-active]]:bg-ring",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-border">
          <DotsSixVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </PanelResizeHandle>
  );
}

ResizableHandle.displayName = "ResizableHandle";

// ---- EXPORTS ----------------------------------------------------------------

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
