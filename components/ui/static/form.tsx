/**
 * Form — Form container with consistent spacing.
 * Built on @base-ui/react Form primitive.
 *
 * @example
 * <FormRoot onSubmit={handleSubmit}>
 *   <FieldRoot name="email">
 *     <FieldLabel>Email</FieldLabel>
 *     <FieldControl render={<Input />} />
 *   </FieldRoot>
 * </FormRoot>
 *
 * @see https://base-ui.com/react/components/form
 */
"use client";

import * as React from "react";
import { Form } from "@base-ui/react/form";
import { cn } from "@/lib/utils";

// =============================================================================
// FORM ROOT
// =============================================================================

const FormRoot = React.forwardRef<
  HTMLFormElement,
  React.ComponentPropsWithRef<typeof Form>
>(({ className, ...props }, ref) => (
  <Form ref={ref} className={cn("space-y-6", className)} {...props} />
));
FormRoot.displayName = "FormRoot";

// =============================================================================
// EXPORTS
// =============================================================================

export { FormRoot };
