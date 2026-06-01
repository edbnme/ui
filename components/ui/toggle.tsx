/**
 * Toggle — Pressable two-state button.
 *
 * Built on the Base UI `Toggle` primitive. Behaves like a checkbox in
 * button form — ideal for formatting controls (Bold / Italic), filter
 * chips, or any binary "on / off" action that reads better as a button
 * than a switch.
 *
 * Anatomy:
 * ```tsx
 * <ToggleRoot aria-label="Toggle bold">
 *   <BoldIcon />
 * </ToggleRoot>
 *
 * // Controlled
 * <ToggleRoot pressed={on} onPressedChange={setOn}>Bold</ToggleRoot>
 * ```
 *
 * Accessibility: renders a `<button>` with `aria-pressed` and
 * `data-pressed` attributes. Space / Enter toggles. Always provide an
 * `aria-label` for icon-only toggles.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/toggle
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/toggle
 * @registryDescription Pressable toggle button with on/off state.
 */

"use client";

import * as React from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---- VARIANTS ---------------------------------------------------------------

/**
 * Shared styling contract for `ToggleRoot` and `ToggleGroupItem`.
 *
 * @since 0.1.0
 */
const toggleVariants = cva(
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

export type ToggleRootProps = React.ComponentPropsWithoutRef<typeof Toggle> &
  VariantProps<typeof toggleVariants>;

/**
 * Standalone toggle button.
 *
 * Data attributes:
 * - `data-pressed` — present when pressed
 * - `data-disabled`
 *
 * @since 0.1.0
 */
function ToggleRoot({ className, variant, size, ...props }: ToggleRootProps) {
  return (
    <Toggle
      data-slot="toggle-root"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}
ToggleRoot.displayName = "ToggleRoot";

// ---- GROUP ROOT -------------------------------------------------------------

export type ToggleGroupRootProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroup
>;

/**
 * Convenience re-export of the coordinating `ToggleGroup`. Prefer the
 * dedicated `toggle-group` module for richer group usage — this export is
 * kept so the common "a few toggles in a row" pattern ships with just the
 * toggle import.
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

// ---- GROUP ITEM -------------------------------------------------------------

export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof Toggle> &
  VariantProps<typeof toggleVariants>;

/**
 * A toggle inside a `ToggleGroupRoot`. Looks up its pressed state from the
 * group via its `value` prop.
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
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}
ToggleGroupItem.displayName = "ToggleGroupItem";

// ---- EXPORTS ----------------------------------------------------------------

export { ToggleRoot, ToggleGroupRoot, ToggleGroupItem, toggleVariants };
