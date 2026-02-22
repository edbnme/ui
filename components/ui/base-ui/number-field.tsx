"use client";

import * as React from "react";
import { NumberField } from "@base-ui/react/number-field";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "@phosphor-icons/react";

// =============================================================================
// NUMBER FIELD ROOT
// =============================================================================

const NumberFieldRoot = React.forwardRef<
  HTMLDivElement,
  NumberField.Root.Props
>(({ className, ...props }, ref) => (
  <NumberField.Root
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
));
NumberFieldRoot.displayName = "NumberFieldRoot";

// =============================================================================
// NUMBER FIELD GROUP
// =============================================================================

const NumberFieldGroup = React.forwardRef<
  HTMLDivElement,
  NumberField.Group.Props
>(({ className, ...props }, ref) => (
  <NumberField.Group ref={ref} className={cn("flex", className)} {...props} />
));
NumberFieldGroup.displayName = "NumberFieldGroup";

// =============================================================================
// NUMBER FIELD DECREMENT
// =============================================================================

const NumberFieldDecrement = React.forwardRef<
  HTMLButtonElement,
  NumberField.Decrement.Props
>(({ className, children, ...props }, ref) => (
  <NumberField.Decrement
    ref={ref}
    className={cn(
      "flex h-9 w-9 items-center justify-center",
      "rounded-l-md border border-r-0 border-input bg-muted",
      "text-muted-foreground select-none",
      "hover:bg-accent hover:text-accent-foreground",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children || <Minus className="h-4 w-4" />}
  </NumberField.Decrement>
));
NumberFieldDecrement.displayName = "NumberFieldDecrement";

// =============================================================================
// NUMBER FIELD INPUT
// =============================================================================

const NumberFieldInput = React.forwardRef<
  HTMLInputElement,
  NumberField.Input.Props
>(({ className, ...props }, ref) => (
  <NumberField.Input
    ref={ref}
    className={cn(
      "h-9 w-16 border border-input bg-transparent text-center text-sm tabular-nums",
      "focus:z-10 focus:outline-none focus:ring-1 focus:ring-ring",
      className
    )}
    {...props}
  />
));
NumberFieldInput.displayName = "NumberFieldInput";

// =============================================================================
// NUMBER FIELD INCREMENT
// =============================================================================

const NumberFieldIncrement = React.forwardRef<
  HTMLButtonElement,
  NumberField.Increment.Props
>(({ className, children, ...props }, ref) => (
  <NumberField.Increment
    ref={ref}
    className={cn(
      "flex h-9 w-9 items-center justify-center",
      "rounded-r-md border border-l-0 border-input bg-muted",
      "text-muted-foreground select-none",
      "hover:bg-accent hover:text-accent-foreground",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children || <Plus className="h-4 w-4" />}
  </NumberField.Increment>
));
NumberFieldIncrement.displayName = "NumberFieldIncrement";

// =============================================================================
// NUMBER FIELD SCRUB AREA
// =============================================================================

const NumberFieldScrubArea = React.forwardRef<
  HTMLDivElement,
  NumberField.ScrubArea.Props
>(({ className, ...props }, ref) => (
  <NumberField.ScrubArea
    ref={ref}
    className={cn("cursor-ew-resize", className)}
    {...props}
  />
));
NumberFieldScrubArea.displayName = "NumberFieldScrubArea";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldScrubArea,
};
