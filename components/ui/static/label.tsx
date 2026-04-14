/**
 * Label — Accessible form label with disabled state styling.
 *
 * @example
 * <Label htmlFor="email">Email address</Label>
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type LabelProps = React.ComponentProps<"label">;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "group-data-disabled:cursor-not-allowed group-data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

Label.displayName = "Label";

export { Label };
