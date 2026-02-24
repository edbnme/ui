/**
 * Tooltip Component
 *
 * A tooltip component with smooth animations and configurable positioning.
 * Provides additional context for UI elements on hover or focus.
 *
 * Built on Base UI Tooltip primitive.
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";
import { Slot } from "@/lib/primitives";

interface TooltipProviderProps extends React.ComponentProps<
  typeof TooltipPrimitive.Provider
> {
  delayDuration?: number;
}

function TooltipProvider({
  delayDuration = 0,
  children,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delayDuration}
      {...props}
    >
      {children}
    </TooltipPrimitive.Provider>
  );
}

function Tooltip({
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props}>
        {children}
      </TooltipPrimitive.Root>
    </TooltipProvider>
  );
}

interface TooltipTriggerProps extends React.ComponentProps<
  typeof TooltipPrimitive.Trigger
> {
  asChild?: boolean;
}

function TooltipTrigger({ asChild, children, ...props }: TooltipTriggerProps) {
  if (asChild) {
    return (
      <TooltipPrimitive.Trigger
        data-slot="tooltip-trigger"
        render={(triggerProps) => <Slot {...triggerProps}>{children}</Slot>}
        {...props}
      />
    );
  }
  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  );
}

interface TooltipContentProps extends Omit<
  React.ComponentProps<typeof TooltipPrimitive.Popup>,
  "sideOffset"
> {
  sideOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

function TooltipContent({
  className,
  sideOffset = 0,
  side = "top",
  align = "center",
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        sideOffset={sideOffset}
        side={side}
        align={align}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "bg-foreground text-background z-100 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
            "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150",
            "data-starting-style:opacity-0 data-starting-style:scale-95",
            "data-ending-style:opacity-0 data-ending-style:scale-95",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-100 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

TooltipProvider.displayName = "TooltipProvider";
Tooltip.displayName = "Tooltip";
TooltipTrigger.displayName = "TooltipTrigger";
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
