/**
 * Form — Form container with consistent spacing.
 * Built on `@base-ui/react` Form primitive.
 *
 * A thin wrapper around Base UI's accessible `Form` primitive that
 * supplies consistent vertical spacing between fields. Compose with
 * `FieldRoot` / `FieldLabel` / `FieldControl` / `FieldError` from
 * `./field` to build accessible forms with built-in error wiring.
 *
 * Anatomy:
 * ```tsx
 * <FormRoot onSubmit={handleSubmit}>
 *   <FieldRoot name="email">
 *     <FieldLabel>Email</FieldLabel>
 *     <FieldControl render={<Input />} />
 *     <FieldError />
 *   </FieldRoot>
 *   <Button type="submit">Sign up</Button>
 * </FormRoot>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/form
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/form
 * @registryDescription Accessible form wrapper with Base UI validation integration.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Form } from "@base-ui/react/form";

import { cn } from "@/lib/utils";

// ---- FORM ROOT --------------------------------------------------------------

export type FormRootProps = React.ComponentPropsWithoutRef<typeof Form>;

/**
 * Accessible form container with consistent vertical spacing.
 *
 * @since 0.1.0
 */
function FormRoot({ className, ...props }: FormRootProps) {
  return (
    <Form
      data-slot="form-root"
      className={cn("space-y-6", className)}
      {...props}
    />
  );
}
FormRoot.displayName = "FormRoot";

// ---- EXPORTS ----------------------------------------------------------------

export { FormRoot };
