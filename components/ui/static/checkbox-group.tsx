/**
 * CheckboxGroup — Group of related checkboxes with shared state.
 * Built on @base-ui/react CheckboxGroup primitive.
 *
 * @example
 * <CheckboxGroupRoot defaultValue={["option-1"]}>
 *   <CheckboxGroupLabel>Select options</CheckboxGroupLabel>
 *   <CheckboxGroupItem value="option-1" label="Option 1" />
 *   <CheckboxGroupItem value="option-2" label="Option 2" />
 * </CheckboxGroupRoot>
 *
 * @see https://base-ui.com/react/components/checkbox-group
 */
"use client";

import * as React from "react";
import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import { Checkbox } from "@base-ui/react/checkbox";
import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react";

// ---- CHECKBOX GROUP ROOT ----------------------------------------------------

const CheckboxGroupRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof CheckboxGroup>
>(({ className, ...props }, ref) => (
  <CheckboxGroup
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
CheckboxGroupRoot.displayName = "CheckboxGroupRoot";

// ---- CHECKBOX GROUP ITEM ----------------------------------------------------

interface CheckboxGroupItemProps extends React.ComponentPropsWithoutRef<
  typeof Checkbox.Root
> {
  label?: string;
}

const CheckboxGroupItem = React.forwardRef<
  HTMLButtonElement,
  CheckboxGroupItemProps
>(({ className, label, children, ...props }, ref) => (
  <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    <Checkbox.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:bg-primary data-checked:text-primary-foreground",
        className
      )}
      {...props}
    >
      <Checkbox.Indicator className="flex items-center justify-center text-current">
        <Check className="h-3 w-3" weight="bold" />
      </Checkbox.Indicator>
    </Checkbox.Root>
    {label || children}
  </label>
));
CheckboxGroupItem.displayName = "CheckboxGroupItem";

// ---- CHECKBOX GROUP LABEL ---------------------------------------------------

const CheckboxGroupLabel = React.forwardRef<
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
CheckboxGroupLabel.displayName = "CheckboxGroupLabel";

// ---- EXPORTS ----------------------------------------------------------------

export { CheckboxGroupRoot, CheckboxGroupItem, CheckboxGroupLabel };
