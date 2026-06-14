/**
 * Toggle Group - Premium solid grouped toggle controls.
 *
 * Built on Base UI ToggleGroup v1.5.0 with Base UI Toggle items. The
 * wrapper preserves group value arrays, multiple/single mode, refs, render
 * composition, state className, state style, orientation, roving focus, and
 * data attributes.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.1.0
 * @docs https://ui.edbn.me/docs/components/toggle-group
 * @upstream https://base-ui.com/react/components/toggle-group
 * @registryDescription Premium solid toggle group with exclusive or multi-select state.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type StateClassName<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

function composeClassName<State>(
  baseClassName: string,
  className: StateClassName<State>
) {
  if (typeof className === "function") {
    return (state: State) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

// ---- VARIANTS ---------------------------------------------------------------

const toggleGroupItemVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background",
    "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
    "hover:bg-muted hover:text-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-pressed:bg-accent data-pressed:text-accent-foreground data-pressed:shadow-sm",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        solid:
          "border border-border bg-background shadow-sm hover:bg-muted data-pressed:border-primary/40",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2",
        lg: "h-10 px-3",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ---- ROOT -------------------------------------------------------------------

export type ToggleGroupRootProps = ToggleGroup.Props & {
  ref?: React.Ref<HTMLDivElement>;
};

function ToggleGroupRoot({ className, ...props }: ToggleGroupRootProps) {
  return (
    <ToggleGroup
      data-slot="toggle-group-root"
      className={composeClassName<ToggleGroup.State>(
        cn(
          "flex items-center gap-1 rounded-lg border border-border/70 bg-background p-1 shadow-sm",
          "data-orientation-vertical:flex-col data-orientation-vertical:items-stretch",
          "data-disabled:opacity-50 data-multiple:ring-1 data-multiple:ring-border/50"
        ),
        className
      )}
      {...props}
    />
  );
}
ToggleGroupRoot.displayName = "ToggleGroupRoot";

// ---- ITEM -------------------------------------------------------------------

export type ToggleGroupItemProps = Toggle.Props &
  VariantProps<typeof toggleGroupItemVariants> & {
    ref?: React.Ref<HTMLButtonElement>;
  };

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  return (
    <Toggle
      data-slot="toggle-group-item"
      className={composeClassName<Toggle.State>(
        toggleGroupItemVariants({ variant, size }),
        className
      )}
      {...props}
    />
  );
}
ToggleGroupItem.displayName = "ToggleGroupItem";

// ---- EXPORTS ----------------------------------------------------------------

export { ToggleGroupRoot, ToggleGroupItem, toggleGroupItemVariants };
