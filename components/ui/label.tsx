/**
 * Label - Premium solid accessible form label.
 *
 * Native label wrapper with full htmlFor behavior, ref forwarding, and
 * disabled-state styling for peer and grouped form controls.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.1.0
 * @docs https://ui.edbn.me/docs/components/label
 * @registryDescription Premium solid form label with peer and group disabled state support.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ---- LABEL ------------------------------------------------------------------

export type LabelProps = React.ComponentPropsWithRef<"label">;

function Label({ className, ref, ...props }: LabelProps) {
  return (
    <label
      ref={ref}
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none text-foreground select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "group-data-disabled:cursor-not-allowed group-data-disabled:opacity-50",
        "has-[[aria-invalid=true]]:text-destructive",
        className
      )}
      {...props}
    />
  );
}
Label.displayName = "Label";

// ---- EXPORTS ----------------------------------------------------------------

export { Label };
