"use client";

import * as React from "react";
import { Toolbar } from "@base-ui/react/toolbar";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// =============================================================================
// TOOLBAR VARIANTS
// =============================================================================

const toolbarButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted hover:text-muted-foreground",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 w-9",
        sm: "h-8 w-8",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// =============================================================================
// TOOLBAR ROOT
// =============================================================================

const ToolbarRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Toolbar.Root>
>(({ className, ...props }, ref) => (
  <Toolbar.Root
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-background p-1",
      className
    )}
    {...props}
  />
));
ToolbarRoot.displayName = "ToolbarRoot";

// =============================================================================
// TOOLBAR BUTTON
// =============================================================================

const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof Toolbar.Button> &
    VariantProps<typeof toolbarButtonVariants>
>(({ className, variant, size, ...props }, ref) => (
  <Toolbar.Button
    ref={ref}
    className={cn(toolbarButtonVariants({ variant, size }), className)}
    {...props}
  />
));
ToolbarButton.displayName = "ToolbarButton";

// =============================================================================
// TOOLBAR SEPARATOR
// =============================================================================

const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Toolbar.Separator>
>(({ className, ...props }, ref) => (
  <Toolbar.Separator
    ref={ref}
    className={cn("mx-1 h-5 w-px bg-border", className)}
    {...props}
  />
));
ToolbarSeparator.displayName = "ToolbarSeparator";

// =============================================================================
// TOOLBAR LINK
// =============================================================================

const ToolbarLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithRef<typeof Toolbar.Link>
>(({ className, ...props }, ref) => (
  <Toolbar.Link
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground",
      "hover:text-foreground hover:bg-muted",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
ToolbarLink.displayName = "ToolbarLink";

// =============================================================================
// TOOLBAR GROUP
// =============================================================================

const ToolbarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Toolbar.Group>
>(({ className, ...props }, ref) => (
  <Toolbar.Group
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
));
ToolbarGroup.displayName = "ToolbarGroup";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ToolbarRoot,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarGroup,
  toolbarButtonVariants,
};
