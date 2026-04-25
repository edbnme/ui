/**
 * Field — Form field wrapper with label, description, validity, and
 * error states. Built on `@base-ui/react` `Field`.
 *
 * Provides a single semantic grouping for a labeled control. Use
 * `FieldControl.render` to compose with any input primitive while keeping
 * Base UI's validity wiring, `aria-describedby`, and `data-invalid`
 * semantics.
 *
 * Anatomy:
 * ```tsx
 * <FieldRoot name="email">
 *   <FieldLabel>Email</FieldLabel>
 *   <FieldControl render={<Input type="email" />} />
 *   <FieldDescription>We'll never share your email.</FieldDescription>
 *   <FieldError />
 * </FieldRoot>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/field
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/field
 * @registryDescription Form field with label, description, error message, and validation.
 */

"use client";

import * as React from "react";
import { Field } from "@base-ui/react/field";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type FieldRootProps = Field.Root.Props;

/**
 * Groups a label + control + description + error into a single accessible
 * unit. Pass `name` to tie into form submission.
 *
 * @since 0.1.0
 */
function FieldRoot({ className, ...props }: FieldRootProps) {
  return (
    <Field.Root
      data-slot="field"
      className={cn("space-y-2", className)}
      {...props}
    />
  );
}
FieldRoot.displayName = "FieldRoot";

// ---- LABEL ------------------------------------------------------------------

export type FieldLabelProps = Field.Label.Props;

/**
 * Accessible label for the field's control. Auto-wires to the control via
 * Base UI's field context.
 *
 * @since 0.1.0
 */
function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <Field.Label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-none text-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}
FieldLabel.displayName = "FieldLabel";

// ---- CONTROL ----------------------------------------------------------------

export type FieldControlProps = Field.Control.Props;

/**
 * The field's form control. Typically used with the `render` prop to wrap
 * any input primitive (e.g. `<Input />`, `<Textarea />`).
 *
 * @since 0.1.0
 */
function FieldControl({ className, ...props }: FieldControlProps) {
  return (
    <Field.Control
      data-slot="field-control"
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-invalid:border-destructive data-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  );
}
FieldControl.displayName = "FieldControl";

// ---- DESCRIPTION ------------------------------------------------------------

export type FieldDescriptionProps = Field.Description.Props;

/**
 * Supporting helper text. Linked to the control via `aria-describedby`.
 *
 * @since 0.1.0
 */
function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <Field.Description
      data-slot="field-description"
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
}
FieldDescription.displayName = "FieldDescription";

// ---- ERROR ------------------------------------------------------------------

export type FieldErrorProps = Field.Error.Props;

/**
 * Validation error message. Automatically rendered when the associated
 * control is invalid; pair with `match` for targeted messages.
 *
 * @since 0.1.0
 */
function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <Field.Error
      data-slot="field-error"
      className={cn(
        "text-[0.8rem] font-medium text-destructive",
        className
      )}
      {...props}
    />
  );
}
FieldError.displayName = "FieldError";

// ---- VALIDITY ---------------------------------------------------------------

/**
 * Render-prop component exposing the field's current validity state.
 * Direct re-export from Base UI — no wrapping needed.
 *
 * @since 0.1.0
 */
const FieldValidity = Field.Validity;

// ---- EXPORTS ----------------------------------------------------------------

export {
  FieldRoot,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
};
