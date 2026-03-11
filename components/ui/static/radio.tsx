/**
 * Radio — Radio button group for single-choice selection.
 * Built on @base-ui/react RadioGroup and Radio primitives.
 *
 * @example
 * <RadioGroupRoot defaultValue="option-1">
 *   <RadioItem value="option-1" label="Option 1" />
 *   <RadioItem value="option-2" label="Option 2" />
 * </RadioGroupRoot>
 *
 * @see https://base-ui.com/react/components/radio
 */
"use client";

import * as React from "react";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";
import { cn } from "@/lib/utils";

// =============================================================================
// RADIO GROUP ROOT
// =============================================================================

const RadioGroupRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof RadioGroup>
>(({ className, ...props }, ref) => (
  <RadioGroup
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
RadioGroupRoot.displayName = "RadioGroupRoot";

// =============================================================================
// RADIO ITEM
// =============================================================================

const RadioItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof Radio.Root> & { label?: string }
>(({ className, label, children, ...props }, ref) => (
  <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    <Radio.Root
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 shrink-0 rounded-full border border-primary shadow",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <Radio.Indicator
        className={cn(
          "flex items-center justify-center",
          "after:h-2 after:w-2 after:rounded-full after:bg-primary"
        )}
      />
    </Radio.Root>
    {label || children}
  </label>
));
RadioItem.displayName = "RadioItem";

// =============================================================================
// RADIO INDICATOR
// =============================================================================

const RadioIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Radio.Indicator>
>(({ className, ...props }, ref) => (
  <Radio.Indicator
    ref={ref}
    className={cn(
      "flex items-center justify-center",
      "after:h-2 after:w-2 after:rounded-full after:bg-primary",
      className
    )}
    {...props}
  />
));
RadioIndicator.displayName = "RadioIndicator";

// =============================================================================
// EXPORTS
// =============================================================================

export { RadioGroupRoot, RadioItem, RadioIndicator };
