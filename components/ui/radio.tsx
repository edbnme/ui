/**
 * Radio — Single-choice selection from a group of options.
 *
 * Built on Base UI's `RadioGroup` (the coordinating container) plus the
 * individual `Radio` primitive. Handles roving tab-index, Arrow key
 * navigation (with Home / End and optional looping), form integration,
 * and full ARIA wiring.
 *
 * Anatomy:
 * ```tsx
 * <RadioGroupRoot defaultValue="standard">
 *   <RadioItem value="standard" label="Standard shipping" />
 *   <RadioItem value="express" label="Express shipping" />
 *   <RadioItem value="overnight" label="Overnight shipping" />
 * </RadioGroupRoot>
 * ```
 *
 * Composing manually (when you need richer item layouts):
 * ```tsx
 * <RadioGroupRoot>
 *   <label className="flex items-start gap-3">
 *     <RadioRoot value="a">
 *       <RadioIndicator />
 *     </RadioRoot>
 *     <div>
 *       <div className="text-sm font-medium">Option A</div>
 *       <div className="text-xs text-muted-foreground">Description…</div>
 *     </div>
 *   </label>
 * </RadioGroupRoot>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/radio
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/radio
 * @registrySlug radio-group
 * @registryDescription Radio group with accessible keyboard navigation.
 * @registryTitle Radio Group
 */

"use client";

import * as React from "react";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";

import { cn } from "@/lib/utils";

// ---- GROUP ROOT -------------------------------------------------------------

export type RadioGroupRootProps = React.ComponentPropsWithoutRef<
  typeof RadioGroup
>;

/**
 * The coordinating container. Owns the selected value and manages roving
 * focus across child `RadioRoot`s. Use `defaultValue` for uncontrolled
 * state or `value` + `onValueChange` for controlled.
 *
 * @since 0.1.0
 */
function RadioGroupRoot({ className, ...props }: RadioGroupRootProps) {
  return (
    <RadioGroup
      data-slot="radio-group-root"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}
RadioGroupRoot.displayName = "RadioGroupRoot";

// ---- RADIO ROOT -------------------------------------------------------------

export type RadioRootProps = React.ComponentPropsWithoutRef<typeof Radio.Root>;

/**
 * A single radio circle. When selected, `data-checked` is present and the
 * ring fills with `bg-primary`. Use directly for bespoke layouts; most
 * callers will prefer `RadioItem` for the common "circle + label" pattern.
 *
 * Data attributes:
 * - `data-checked`, `data-unchecked`
 * - `data-disabled`, `data-readonly`, `data-required`
 *
 * @since 0.3.0
 */
function RadioRoot({ className, children, ...props }: RadioRootProps) {
  return (
    <Radio.Root
      data-slot="radio-root"
      className={cn(
        "peer flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary shadow-sm",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "data-checked:border-primary data-checked:bg-primary",
        className
      )}
      {...props}
    >
      {children}
    </Radio.Root>
  );
}
RadioRoot.displayName = "RadioRoot";

// ---- INDICATOR --------------------------------------------------------------

export type RadioIndicatorProps = React.ComponentPropsWithoutRef<
  typeof Radio.Indicator
>;

/**
 * The inner dot that appears when the radio is selected. Only mounted by
 * Base UI while `data-checked` is on, so enter / exit transitions hook
 * into `data-starting-style` / `data-ending-style` automatically.
 *
 * @since 0.1.0
 */
function RadioIndicator({ className, ...props }: RadioIndicatorProps) {
  return (
    <Radio.Indicator
      data-slot="radio-indicator"
      className={cn(
        "flex items-center justify-center",
        "transition-opacity duration-150 ease-out motion-reduce:transition-none",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
    </Radio.Indicator>
  );
}
RadioIndicator.displayName = "RadioIndicator";

// ---- ITEM (label + radio sugar) --------------------------------------------

export type RadioItemProps = React.ComponentPropsWithoutRef<
  typeof Radio.Root
> & {
  /** Short text shown next to the radio. Falls back to `children`. */
  label?: React.ReactNode;
};

/**
 * Convenience pairing of `<label>` + `RadioRoot` + `RadioIndicator` for the
 * default "circle on the left, text on the right" layout. Pass a `label`
 * prop for simple text, or `children` for richer content.
 *
 * @since 0.1.0
 */
function RadioItem({ className, label, children, ...props }: RadioItemProps) {
  return (
    <label
      data-slot="radio-item"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none",
        "data-disabled:cursor-not-allowed data-disabled:opacity-70"
      )}
    >
      <RadioRoot className={className} {...props}>
        <RadioIndicator />
      </RadioRoot>
      {label ?? children}
    </label>
  );
}
RadioItem.displayName = "RadioItem";

// ---- EXPORTS ----------------------------------------------------------------

export { RadioGroupRoot, RadioRoot, RadioIndicator, RadioItem };
