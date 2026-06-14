/**
 * Switch - Premium solid binary setting control.
 *
 * Built on Base UI Switch v1.5.0. The wrapper keeps the upstream Root and
 * Thumb API intact, including refs, render composition, state className,
 * state style, form props, data attributes, and hidden input behavior.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.1.0
 * @docs https://ui.edbn.me/docs/components/switch
 * @upstream https://base-ui.com/react/components/switch
 * @registryDescription Premium solid switch with accessible on/off states and form integration.
 */

"use client";

import * as React from "react";
import { Switch } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

type StateClassName<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

function composeClassName<State>(
  baseClassName: string,
  className: StateClassName<State>
) {
  if (typeof className === "function") {
    return (state: State) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

// ---- ROOT -------------------------------------------------------------------

export type SwitchRootProps = React.ComponentProps<typeof Switch.Root>;

function SwitchRoot({ className, ...props }: SwitchRootProps) {
  return (
    <Switch.Root
      data-slot="switch-root"
      className={composeClassName<Switch.Root.State>(
        cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border/70 bg-muted shadow-sm",
          "transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-checked:border-primary data-checked:bg-primary",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "data-readonly:cursor-default data-readonly:opacity-80",
          "data-invalid:border-destructive data-invalid:ring-destructive/20"
        ),
        className
      )}
      {...props}
    />
  );
}
SwitchRoot.displayName = "SwitchRoot";

// ---- THUMB ------------------------------------------------------------------

export type SwitchThumbProps = React.ComponentProps<typeof Switch.Thumb>;

function SwitchThumb({ className, ...props }: SwitchThumbProps) {
  return (
    <Switch.Thumb
      data-slot="switch-thumb"
      className={composeClassName<Switch.Thumb.State>(
        cn(
          "pointer-events-none block h-4 w-4 translate-x-0 rounded-full bg-background shadow-lg ring-1 ring-black/5",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          "data-checked:translate-x-4 data-disabled:opacity-90"
        ),
        className
      )}
      {...props}
    />
  );
}
SwitchThumb.displayName = "SwitchThumb";

// ---- EXPORTS ----------------------------------------------------------------

export { SwitchRoot, SwitchThumb };
