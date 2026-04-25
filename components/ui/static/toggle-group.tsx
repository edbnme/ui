/**
 * ToggleGroup — Coordinating container for a set of toggles.
 *
 * Built on Base UI's `ToggleGroup`. Supports `single` (one pressed at a
 * time — radio-like behavior) and `multiple` (any combination) selection
 * modes. Manages roving focus, Arrow-key navigation, and Space / Enter
 * activation across its items automatically.
 *
 * Anatomy:
 * ```tsx
 * <ToggleGroupRoot defaultValue={["left"]}>
 *   <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft /></ToggleGroupItem>
 *   <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter /></ToggleGroupItem>
 *   <ToggleGroupItem value="right" aria-label="Align right"><AlignRight /></ToggleGroupItem>
 * </ToggleGroupRoot>
 * ```
 *
 * Accessibility: the group has `role="group"` and each item reports its
 * pressed state via `aria-pressed`. Provide an `aria-label` on the group
 * itself if its purpose isn't obvious from surrounding context.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/toggle-group
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/toggle-group
 * @registryDescription Exclusive or multi-select toggle buttons for switching between options.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---- VARIANTS ---------------------------------------------------------------

/**
 * Styling contract for `ToggleGroupItem`. Kept in-module (rather than
 * imported from `./toggle`) so this file has no upstream coupling — making
 * it safe to copy into another codebase.
 *
 * @since 0.1.0
 */
const toggleGroupItemVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background",
    "transition-colors duration-150 ease-out motion-reduce:transition-none",
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

// ---- ROOT -------------------------------------------------------------------

export type ToggleGroupRootProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroup
>;

/**
 * The coordinating container.
 *
 * Props of note:
 * - `value` / `defaultValue` — array of pressed item values
 * - `onValueChange(value: string[])` — controlled callback
 * - `toggleMultiple` — when `false`, behaves as a single-selection group
 *
 * @since 0.1.0
 */
function ToggleGroupRoot({ className, ...props }: ToggleGroupRootProps) {
  return (
    <ToggleGroup
      data-slot="toggle-group-root"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}
ToggleGroupRoot.displayName = "ToggleGroupRoot";

// ---- ITEM -------------------------------------------------------------------

export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof Toggle> &
  VariantProps<typeof toggleGroupItemVariants>;

/**
 * A single toggle inside the group.
 *
 * @since 0.1.0
 */
function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  return (
    <Toggle
      data-slot="toggle-group-item"
      className={cn(toggleGroupItemVariants({ variant, size }), className)}
      {...props}
    />
  );
}
ToggleGroupItem.displayName = "ToggleGroupItem";

// ---- EXPORTS ----------------------------------------------------------------

export { ToggleGroupRoot, ToggleGroupItem, toggleGroupItemVariants };
