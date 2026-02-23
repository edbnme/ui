"use client";

import * as React from "react";
import { Fieldset } from "@base-ui/react/fieldset";
import { cn } from "@/lib/utils";

// =============================================================================
// FIELDSET ROOT
// =============================================================================

const FieldsetRoot = React.forwardRef<
  HTMLFieldSetElement,
  React.ComponentPropsWithRef<typeof Fieldset.Root>
>(({ className, ...props }, ref) => (
  <Fieldset.Root ref={ref} className={cn("space-y-4", className)} {...props} />
));
FieldsetRoot.displayName = "FieldsetRoot";

// =============================================================================
// FIELDSET LEGEND
// =============================================================================

const FieldsetLegend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentPropsWithRef<typeof Fieldset.Legend>
>(({ className, ...props }, ref) => (
  <Fieldset.Legend
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none text-foreground",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
FieldsetLegend.displayName = "FieldsetLegend";

// =============================================================================
// EXPORTS
// =============================================================================

export { FieldsetRoot, FieldsetLegend };
