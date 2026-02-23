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
