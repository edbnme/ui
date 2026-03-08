/**
 * Separator — Visual divider between content sections.
 * Built on @base-ui/react Separator primitive.
 *
 * @example
 * <SeparatorRoot orientation="horizontal" />
 *
 * @see https://base-ui.com/react/components/separator
 */
"use client";

import * as React from "react";
import { Separator } from "@base-ui/react/separator";
import { cn } from "@/lib/utils";

// =============================================================================
// SEPARATOR
// =============================================================================

const SeparatorRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Separator> & {
    orientation?: "horizontal" | "vertical";
  }
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className
    )}
    {...props}
  />
));
SeparatorRoot.displayName = "SeparatorRoot";

// =============================================================================
// EXPORTS
// =============================================================================

export { SeparatorRoot };

// Backward-compatible alias (formerly shared/)
export { SeparatorRoot as Separator };
