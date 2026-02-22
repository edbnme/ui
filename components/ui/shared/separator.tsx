/**
 * Separator Component
 *
 * A visual separator for dividing content. Supports horizontal and vertical
 * orientations with proper accessibility semantics.
 *
 * Built on Base UI Separator primitive.
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.ComponentProps<
  typeof SeparatorPrimitive
> {
  decorative?: boolean;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

Separator.displayName = "Separator";

export { Separator };
