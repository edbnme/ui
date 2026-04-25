/**
 * CheckboxGroup — Coordinating container for a set of related checkboxes.
 *
 * Built on Base UI's `CheckboxGroup` primitive. Unlike `RadioGroup` (which
 * tracks a single value), `CheckboxGroup` tracks an **array** of selected
 * values — pass `value` / `defaultValue` as `string[]`. Handles the
 * parent/indeterminate relationship automatically when you use a pilot
 * checkbox with `allValues`.
 *
 * Anatomy:
 * ```tsx
 * <CheckboxGroupRoot defaultValue={["email"]}>
 *   <CheckboxGroupLabel>Notify me about…</CheckboxGroupLabel>
 *   <CheckboxGroupItem value="email" label="Product updates" />
 *   <CheckboxGroupItem value="sms" label="Delivery alerts" />
 *   <CheckboxGroupItem value="push" label="In-app notifications" />
 * </CheckboxGroupRoot>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/checkbox-group
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/checkbox-group
 * @registryDescription Grouped checkboxes with shared label and accessible parent state.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import { Checkbox } from "@base-ui/react/checkbox";
import { Check } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type CheckboxGroupRootProps = React.ComponentPropsWithoutRef<
  typeof CheckboxGroup
>;

/**
 * The coordinating container. Owns the selected values array and applies
 * the parent/child indeterminate logic when `allValues` is provided on a
 * pilot checkbox.
 *
 * Props of note:
 * - `value` / `defaultValue` — `string[]` of selected item values
 * - `onValueChange(value: string[])` — controlled callback
 * - `allValues` — list of all possible values (enables pilot mode)
 *
 * @since 0.1.0
 */
function CheckboxGroupRoot({ className, ...props }: CheckboxGroupRootProps) {
  return (
    <CheckboxGroup
      data-slot="checkbox-group-root"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}
CheckboxGroupRoot.displayName = "CheckboxGroupRoot";

// ---- ITEM -------------------------------------------------------------------

export type CheckboxGroupItemProps = React.ComponentPropsWithoutRef<
  typeof Checkbox.Root
> & {
  /** Short text shown next to the checkbox. Falls back to `children`. */
  label?: React.ReactNode;
};

/**
 * Convenience pairing of a `<label>` + `Checkbox.Root` + check glyph.
 * Looks up its checked state from the enclosing `CheckboxGroupRoot` by
 * matching `value`.
 *
 * @since 0.1.0
 */
function CheckboxGroupItem({
  className,
  label,
  children,
  ...props
}: CheckboxGroupItemProps) {
  return (
    <label
      data-slot="checkbox-group-item"
      className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      <Checkbox.Root
        data-slot="checkbox-group-item-input"
        className={cn(
          "peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary shadow-sm",
          "transition-colors duration-150 ease-out motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-checked:bg-primary data-checked:text-primary-foreground",
          "data-indeterminate:bg-primary data-indeterminate:text-primary-foreground",
          className
        )}
        {...props}
      >
        <Checkbox.Indicator
          data-slot="checkbox-group-item-indicator"
          className="flex items-center justify-center text-current"
        >
          <Check aria-hidden className="h-3 w-3" weight="bold" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label ?? children}
    </label>
  );
}
CheckboxGroupItem.displayName = "CheckboxGroupItem";

// ---- LABEL ------------------------------------------------------------------

export type CheckboxGroupLabelProps =
  React.LabelHTMLAttributes<HTMLLabelElement>;

/**
 * Convenience heading for the group — usually precedes the items and names
 * the collective choice (e.g., "Notify me about…").
 *
 * @since 0.1.0
 */
function CheckboxGroupLabel({ className, ...props }: CheckboxGroupLabelProps) {
  return (
    <label
      data-slot="checkbox-group-label"
      className={cn(
        "text-sm font-medium leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}
CheckboxGroupLabel.displayName = "CheckboxGroupLabel";

// ---- EXPORTS ----------------------------------------------------------------

export { CheckboxGroupRoot, CheckboxGroupItem, CheckboxGroupLabel };
