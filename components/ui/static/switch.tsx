/**
 * Switch — Toggle switch for binary on/off states.
 * Built on @base-ui/react Switch primitive.
 *
 * @example
 * <label>
 *   <SwitchRoot defaultChecked>
 *     <SwitchThumb />
 *   </SwitchRoot>
 *   Dark mode
 * </label>
 *
 * @see https://base-ui.com/react/components/switch
 */
"use client";

import * as React from "react";
import { Switch } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

// ---- SWITCH ROOT ------------------------------------------------------------

const SwitchRoot = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Switch.Root>
>(({ className, ...props }, ref) => (
  <Switch.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "bg-input data-checked:bg-primary",
      className
    )}
    {...props}
  />
));
SwitchRoot.displayName = "SwitchRoot";

// ---- SWITCH THUMB -----------------------------------------------------------

const SwitchThumb = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof Switch.Thumb>
>(({ className, ...props }, ref) => (
  <Switch.Thumb
    ref={ref}
    className={cn(
      "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
      "translate-x-0 data-checked:translate-x-4",
      className
    )}
    {...props}
  />
));
SwitchThumb.displayName = "SwitchThumb";

// ---- EXPORTS ----------------------------------------------------------------

export { SwitchRoot, SwitchThumb };
