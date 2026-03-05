"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

// =============================================================================
// INPUT
// =============================================================================

const InputRoot = React.forwardRef<HTMLInputElement, InputPrimitive.Props>(
  ({ className, ...props }, ref) => (
    <InputPrimitive
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
        "transition-colors",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
InputRoot.displayName = "InputRoot";

// =============================================================================
// EXPORTS
// =============================================================================

export { InputRoot };

// Backward-compatible alias (formerly shared/)
export { InputRoot as Input };
