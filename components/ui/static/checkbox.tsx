/**
 * Checkbox — Checkbox input with indeterminate state support.
 * Built on @base-ui/react Checkbox primitive.
 *
 * @example
 * <label>
 *   <CheckboxRoot>
 *     <CheckboxIndicator />
 *   </CheckboxRoot>
 *   Accept terms
 * </label>
 *
 * @see https://base-ui.com/react/components/checkbox
 */
"use client";

import * as React from "react";
import { Checkbox } from "@base-ui/react/checkbox";
import { cn } from "@/lib/utils";
import { Check, Minus } from "@phosphor-icons/react";

// ---- CHECKBOX ROOT ----------------------------------------------------------

interface CheckboxRootProps extends React.ComponentPropsWithoutRef<
  typeof Checkbox.Root
> {
  indeterminate?: boolean;
}

const CheckboxRoot = React.forwardRef<HTMLButtonElement, CheckboxRootProps>(
  ({ className, indeterminate, ...props }, ref) => (
    <Checkbox.Root
      ref={ref}
      indeterminate={indeterminate}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:bg-primary data-checked:text-primary-foreground",
        "data-indeterminate:bg-primary data-indeterminate:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
);
CheckboxRoot.displayName = "CheckboxRoot";

// ---- CHECKBOX INDICATOR -----------------------------------------------------

const CheckboxIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof Checkbox.Indicator> & {
    indeterminate?: boolean;
  }
>(({ className, indeterminate, ...props }, ref) => (
  <Checkbox.Indicator
    ref={ref}
    className={cn("flex items-center justify-center text-current", className)}
    {...props}
  >
    {indeterminate ? (
      <Minus className="h-3 w-3" weight="bold" />
    ) : (
      <Check className="h-3 w-3" weight="bold" />
    )}
  </Checkbox.Indicator>
));
CheckboxIndicator.displayName = "CheckboxIndicator";

// ---- CHECKBOX LABEL ---------------------------------------------------------

const CheckboxLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
CheckboxLabel.displayName = "CheckboxLabel";

// ---- CHECKBOX GROUP ---------------------------------------------------------

const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props} />
));
CheckboxGroup.displayName = "CheckboxGroup";

// ---- EXPORTS ----------------------------------------------------------------

export { CheckboxRoot, CheckboxIndicator, CheckboxLabel, CheckboxGroup };
