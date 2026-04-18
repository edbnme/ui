/**
 * Fieldset — Groups related form fields with an accessible legend.
 * Built on `@base-ui/react` `Fieldset`.
 *
 * Use to visually + semantically group a handful of related inputs (e.g.
 * shipping address, notification preferences). Render multiple
 * `FieldRoot`s inside a `FieldsetRoot` for consistent spacing.
 *
 * Anatomy:
 * ```tsx
 * <FieldsetRoot>
 *   <FieldsetLegend>Personal information</FieldsetLegend>
 *   <FieldRoot name="firstName">…</FieldRoot>
 *   <FieldRoot name="lastName">…</FieldRoot>
 * </FieldsetRoot>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/fieldset
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/fieldset
 * @registryDescription Semantic form grouping with accessible legend for related fields.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Fieldset } from "@base-ui/react/fieldset";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type FieldsetRootProps = React.ComponentPropsWithoutRef<
  typeof Fieldset.Root
>;

/**
 * The fieldset container (renders a native `<fieldset>` by default).
 *
 * @since 0.1.0
 */
function FieldsetRoot({ className, ...props }: FieldsetRootProps) {
  return (
    <Fieldset.Root
      data-slot="fieldset"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}
FieldsetRoot.displayName = "FieldsetRoot";

// ---- LEGEND -----------------------------------------------------------------

export type FieldsetLegendProps = React.ComponentPropsWithoutRef<
  typeof Fieldset.Legend
>;

/**
 * Accessible legend for the fieldset. Renders a native `<legend>` so
 * screen readers announce it when focus enters any child control.
 *
 * @since 0.1.0
 */
function FieldsetLegend({ className, ...props }: FieldsetLegendProps) {
  return (
    <Fieldset.Legend
      data-slot="fieldset-legend"
      className={cn(
        "text-sm font-medium leading-none text-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}
FieldsetLegend.displayName = "FieldsetLegend";

// ---- EXPORTS ----------------------------------------------------------------

export { FieldsetRoot, FieldsetLegend };
