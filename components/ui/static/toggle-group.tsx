/**
 * Toggle Group — Group of toggle buttons with single/multiple selection.
 * Built on @base-ui/react Toggle and ToggleGroup primitives.
 *
 * @example
 * <ToggleGroupRoot type="single">
 *   <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
 *   <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
 * </ToggleGroupRoot>
 *
 * @see https://base-ui.com/react/components/toggle-group
 */
"use client";

import * as React from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// ---- TOGGLE GROUP ITEM VARIANTS ---------------------------------------------

const toggleGroupItemVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background",
    "transition-colors",
    "hover:bg-muted hover:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-pressed:bg-accent data-pressed:text-accent-foreground",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2",
        lg: "h-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ---- TOGGLE GROUP ROOT ------------------------------------------------------

const ToggleGroupRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ToggleGroup>
>(({ className, ...props }, ref) => (
  <ToggleGroup
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));
ToggleGroupRoot.displayName = "ToggleGroupRoot";

// ---- TOGGLE GROUP ITEM ------------------------------------------------------

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof Toggle> &
    VariantProps<typeof toggleGroupItemVariants>
>(({ className, variant, size, ...props }, ref) => (
  <Toggle
    ref={ref}
    className={cn(toggleGroupItemVariants({ variant, size }), className)}
    {...props}
  />
));
ToggleGroupItem.displayName = "ToggleGroupItem";

// ---- EXPORTS ----------------------------------------------------------------

export { ToggleGroupRoot, ToggleGroupItem, toggleGroupItemVariants };
