/**
 * Toolbar - Premium solid command surface.
 *
 * Built on Base UI Toolbar v1.5.0. The wrapper preserves Root, Button,
 * Separator, Link, Group, and Input props, refs, render composition, state
 * className, state style, orientation, roving focus, and data attributes.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.1.0
 * @docs https://ui.edbn.me/docs/components/toolbar
 * @upstream https://base-ui.com/react/components/toolbar
 * @registryDescription Premium solid toolbar with grouped actions, links, and inputs.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Toolbar } from "@base-ui/react/toolbar";
import { cva, type VariantProps } from "class-variance-authority";

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

// ---- VARIANTS ---------------------------------------------------------------

const toolbarButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background",
    "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-pressed:bg-accent data-pressed:text-accent-foreground data-pressed:shadow-sm",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted hover:text-foreground",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        solid:
          "border border-border bg-background shadow-sm hover:bg-muted data-pressed:border-primary/40",
      },
      size: {
        default: "h-9 w-9",
        sm: "h-8 w-8",
        lg: "h-10 w-10",
        text: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ---- ROOT -------------------------------------------------------------------

export type ToolbarRootProps = React.ComponentProps<typeof Toolbar.Root>;

function ToolbarRoot({ className, ...props }: ToolbarRootProps) {
  return (
    <Toolbar.Root
      data-slot="toolbar-root"
      className={composeClassName<Toolbar.Root.State>(
        cn(
          "inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-sm",
          "data-orientation-vertical:h-auto data-orientation-vertical:w-10 data-orientation-vertical:flex-col",
          "data-disabled:opacity-50"
        ),
        className
      )}
      {...props}
    />
  );
}
ToolbarRoot.displayName = "ToolbarRoot";

// ---- BUTTON -----------------------------------------------------------------

export type ToolbarButtonProps = React.ComponentProps<typeof Toolbar.Button> &
  VariantProps<typeof toolbarButtonVariants>;

function ToolbarButton({
  className,
  variant,
  size,
  ...props
}: ToolbarButtonProps) {
  return (
    <Toolbar.Button
      data-slot="toolbar-button"
      className={composeClassName<Toolbar.Button.State>(
        toolbarButtonVariants({ variant, size }),
        className
      )}
      {...props}
    />
  );
}
ToolbarButton.displayName = "ToolbarButton";

// ---- SEPARATOR --------------------------------------------------------------

export type ToolbarSeparatorProps = React.ComponentProps<
  typeof Toolbar.Separator
>;

function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return (
    <Toolbar.Separator
      data-slot="toolbar-separator"
      className={composeClassName<Toolbar.Separator.State>(
        cn(
          "mx-1 h-5 w-px bg-border",
          "data-orientation-vertical:mx-0 data-orientation-vertical:my-1 data-orientation-vertical:h-px data-orientation-vertical:w-5"
        ),
        className
      )}
      {...props}
    />
  );
}
ToolbarSeparator.displayName = "ToolbarSeparator";

// ---- LINK -------------------------------------------------------------------

export type ToolbarLinkProps = React.ComponentProps<typeof Toolbar.Link>;

function ToolbarLink({ className, ...props }: ToolbarLinkProps) {
  return (
    <Toolbar.Link
      data-slot="toolbar-link"
      className={composeClassName<Toolbar.Link.State>(
        cn(
          "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground",
          "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        ),
        className
      )}
      {...props}
    />
  );
}
ToolbarLink.displayName = "ToolbarLink";

// ---- GROUP ------------------------------------------------------------------

export type ToolbarGroupProps = React.ComponentProps<typeof Toolbar.Group>;

function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  return (
    <Toolbar.Group
      data-slot="toolbar-group"
      className={composeClassName<Toolbar.Group.State>(
        cn(
          "flex items-center gap-1",
          "data-orientation-vertical:flex-col data-orientation-vertical:items-stretch",
          "data-disabled:opacity-50"
        ),
        className
      )}
      {...props}
    />
  );
}
ToolbarGroup.displayName = "ToolbarGroup";

// ---- INPUT ------------------------------------------------------------------

export type ToolbarInputProps = React.ComponentProps<typeof Toolbar.Input>;

function ToolbarInput({ className, ...props }: ToolbarInputProps) {
  return (
    <Toolbar.Input
      data-slot="toolbar-input"
      className={composeClassName<Toolbar.Input.State>(
        cn(
          "flex h-8 w-40 min-w-0 rounded-md border border-input bg-background px-3 text-sm shadow-sm",
          "placeholder:text-muted-foreground",
          "transition-[border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-orientation-vertical:w-full"
        ),
        className
      )}
      {...props}
    />
  );
}
ToolbarInput.displayName = "ToolbarInput";

// ---- EXPORTS ----------------------------------------------------------------

export {
  ToolbarRoot,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarGroup,
  ToolbarInput,
  toolbarButtonVariants,
};
