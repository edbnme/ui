/**
 * Checkbox — Binary selection input with indeterminate state.
 *
 * Built on the Base UI `Checkbox` primitive. Supports controlled /
 * uncontrolled state, the W3C tri-state pattern (`indeterminate`), native
 * form integration via a hidden `<input>`, and full keyboard/ARIA wiring.
 *
 * Anatomy:
 * ```tsx
 * <label className="flex items-center gap-2">
 *   <CheckboxRoot>
 *     <CheckboxIndicator />
 *   </CheckboxRoot>
 *   <CheckboxLabel>I agree to the terms</CheckboxLabel>
 * </label>
 * ```
 *
 * Indeterminate (parent of a partially-checked group):
 * ```tsx
 * <CheckboxRoot indeterminate>
 *   <CheckboxIndicator indeterminate />
 * </CheckboxRoot>
 * ```
 *
 * Accessibility: `CheckboxRoot` renders a `<button>` with the appropriate
 * `role="checkbox"` and `aria-checked` (true / false / "mixed") managed
 * automatically. When nested inside a `<label>`, click-to-focus works on
 * the label text.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/checkbox
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/checkbox
 * @registryDescription Accessible checkbox with indeterminate state support.
 */

"use client";

import * as React from "react";
import { Checkbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type CheckboxRootProps = React.ComponentPropsWithoutRef<
  typeof Checkbox.Root
> & {
  /** When `true`, renders the checkbox in the W3C mixed/indeterminate state. */
  indeterminate?: boolean;
};

/**
 * The clickable checkbox itself — a square surface that fills with the
 * primary color on check / indeterminate. Exposes the following data
 * attributes that callers can target in custom styles:
 *
 * - `data-checked` — on when `checked === true`
 * - `data-unchecked` — on when `checked === false`
 * - `data-indeterminate` — on when mixed
 * - `data-disabled`, `data-readonly`, `data-required`
 *
 * @since 0.1.0
 */
function CheckboxRoot({
  className,
  indeterminate,
  ...props
}: CheckboxRootProps) {
  return (
    <Checkbox.Root
      data-slot="checkbox-root"
      indeterminate={indeterminate}
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
    />
  );
}
CheckboxRoot.displayName = "CheckboxRoot";

// ---- INDICATOR --------------------------------------------------------------

export type CheckboxIndicatorProps = React.ComponentPropsWithoutRef<
  typeof Checkbox.Indicator
> & {
  /** Render the dash (minus) glyph instead of the check. */
  indeterminate?: boolean;
};

/**
 * The glyph that appears when the checkbox is checked. Base UI only mounts
 * this element while `data-checked` (or `data-indeterminate`) is present,
 * so the enter/exit transitions are automatic.
 *
 * Data attributes:
 * - `data-starting-style`, `data-ending-style` — for fade / scale animations
 *
 * @since 0.1.0
 */
function CheckboxIndicator({
  className,
  indeterminate,
  ...props
}: CheckboxIndicatorProps) {
  return (
    <Checkbox.Indicator
      data-slot="checkbox-indicator"
      className={cn(
        "flex items-center justify-center text-current",
        "transition-opacity duration-150 ease-out motion-reduce:transition-none",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    >
      {indeterminate ? (
        <Minus aria-hidden className="h-3 w-3" weight="bold" />
      ) : (
        <Check aria-hidden className="h-3 w-3" weight="bold" />
      )}
    </Checkbox.Indicator>
  );
}
CheckboxIndicator.displayName = "CheckboxIndicator";

// ---- LABEL ------------------------------------------------------------------

export type CheckboxLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

/**
 * Convenience `<label>` styled to pair with `CheckboxRoot` via the `peer`
 * helper — when the checkbox is disabled, the label dims automatically.
 *
 * @since 0.1.0
 */
function CheckboxLabel({ className, ...props }: CheckboxLabelProps) {
  return (
    <label
      data-slot="checkbox-label"
      className={cn(
        "text-sm font-medium leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}
CheckboxLabel.displayName = "CheckboxLabel";

// ---- GROUP ------------------------------------------------------------------

export type CheckboxGroupProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Layout helper for stacking related checkboxes (e.g., "Notify me about…"
 * preference lists). No coordinating state — use multiple independent
 * `CheckboxRoot`s and manage selection in a single array if you need it.
 *
 * @since 0.1.0
 */
function CheckboxGroup({ className, ...props }: CheckboxGroupProps) {
  return (
    <div
      data-slot="checkbox-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}
CheckboxGroup.displayName = "CheckboxGroup";

// ---- EXPORTS ----------------------------------------------------------------

export { CheckboxRoot, CheckboxIndicator, CheckboxLabel, CheckboxGroup };
