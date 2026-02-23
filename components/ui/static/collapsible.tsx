"use client";

import * as React from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "@/lib/utils";

// =============================================================================
// COLLAPSIBLE ROOT
// =============================================================================

const CollapsibleRoot = React.forwardRef<
  HTMLDivElement,
  Collapsible.Root.Props
>(({ className, ...props }, ref) => (
  <Collapsible.Root ref={ref} className={cn("w-full", className)} {...props} />
));
CollapsibleRoot.displayName = "CollapsibleRoot";

// =============================================================================
// COLLAPSIBLE TRIGGER
// =============================================================================

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  Collapsible.Trigger.Props
>(({ className, children, ...props }, ref) => (
  <Collapsible.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between py-4 font-medium transition-all",
      "hover:underline",
      "data-panel-open:[&>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
  </Collapsible.Trigger>
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

// =============================================================================
// COLLAPSIBLE PANEL
// =============================================================================

const CollapsiblePanel = React.forwardRef<
  HTMLDivElement,
  Collapsible.Panel.Props
>(({ className, ...props }, ref) => (
  <Collapsible.Panel
    ref={ref}
    className={cn(
      "overflow-hidden",
      "h-(--collapsible-panel-height) transition-[height] duration-300 ease-out",
      "data-ending-style:h-0 data-starting-style:h-0",
      className
    )}
    {...props}
  />
));
CollapsiblePanel.displayName = "CollapsiblePanel";

// =============================================================================
// EXPORTS
// =============================================================================

export { CollapsibleRoot, CollapsibleTrigger, CollapsiblePanel };
