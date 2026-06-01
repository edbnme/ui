/**
 * Toolbar — Grouped horizontal (or vertical) set of controls.
 *
 * Built on the Base UI `Toolbar` primitive. Provides the WAI-ARIA toolbar
 * pattern: a single tab-stop with Arrow-key navigation between children,
 * Home / End to jump to edges, and `orientation="vertical"` for stacked
 * layouts.
 *
 * Anatomy:
 * ```tsx
 * <ToolbarRoot aria-label="Text formatting">
 *   <ToolbarButton aria-label="Bold"><BoldIcon /></ToolbarButton>
 *   <ToolbarButton aria-label="Italic"><ItalicIcon /></ToolbarButton>
 *   <ToolbarSeparator />
 *   <ToolbarLink href="/help">Help</ToolbarLink>
 *   <ToolbarGroup>
 *     <ToolbarInput placeholder="Search…" />
 *   </ToolbarGroup>
 * </ToolbarRoot>
 * ```
 *
 * Accessibility: `ToolbarRoot` renders a `<div role="toolbar">`. Always
 * provide `aria-label` (or `aria-labelledby`) describing the toolbar's
 * purpose. Icon-only buttons need their own `aria-label`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/toolbar
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/toolbar
 * @registryDescription Horizontal toolbar with buttons, toggles, and grouped actions.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Toolbar } from "@base-ui/react/toolbar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---- VARIANTS ---------------------------------------------------------------

/**
 * Shared styling for `ToolbarButton`.
 *
 * @since 0.1.0
 */
const toolbarButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background",
    "transition-colors duration-150 ease-out motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-pressed:bg-accent data-pressed:text-accent-foreground",
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

// ---- ROOT -------------------------------------------------------------------

export type ToolbarRootProps = React.ComponentPropsWithoutRef<typeof Toolbar.Root>;

/**
 * The toolbar container.
 *
 * Data attributes:
 * - `data-orientation` — `"horizontal"` (default) | `"vertical"`
 *
 * @since 0.1.0
 */
function ToolbarRoot({ className, ...props }: ToolbarRootProps) {
  return (
    <Toolbar.Root
      data-slot="toolbar-root"
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-background p-1",
        "data-orientation-vertical:h-auto data-orientation-vertical:flex-col data-orientation-vertical:w-9",
        className
      )}
      {...props}
    />
  );
}
ToolbarRoot.displayName = "ToolbarRoot";

// ---- BUTTON -----------------------------------------------------------------

export type ToolbarButtonProps = React.ComponentPropsWithoutRef<
  typeof Toolbar.Button
> &
  VariantProps<typeof toolbarButtonVariants>;

/**
 * A toolbar action button. Use for imperative commands (Save, Undo, Copy).
 *
 * @since 0.1.0
 */
function ToolbarButton({
  className,
  variant,
  size,
  ...props
}: ToolbarButtonProps) {
  return (
    <Toolbar.Button
      data-slot="toolbar-button"
      className={cn(toolbarButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
ToolbarButton.displayName = "ToolbarButton";

// ---- SEPARATOR --------------------------------------------------------------

export type ToolbarSeparatorProps = React.ComponentPropsWithoutRef<
  typeof Toolbar.Separator
>;

/**
 * Visual divider between button groups. Thin vertical line in a horizontal
 * toolbar, horizontal rule in a vertical one.
 *
 * @since 0.1.0
 */
function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return (
    <Toolbar.Separator
      data-slot="toolbar-separator"
      className={cn(
        "mx-1 h-5 w-px bg-border",
        "data-orientation-vertical:h-px data-orientation-vertical:w-5 data-orientation-vertical:mx-0 data-orientation-vertical:my-1",
        className
      )}
      {...props}
    />
  );
}
ToolbarSeparator.displayName = "ToolbarSeparator";

// ---- LINK -------------------------------------------------------------------

export type ToolbarLinkProps = React.ComponentPropsWithoutRef<typeof Toolbar.Link>;

/**
 * A toolbar item that navigates. Pass `href` and render text or icon
 * children.
 *
 * @since 0.1.0
 */
function ToolbarLink({ className, ...props }: ToolbarLinkProps) {
  return (
    <Toolbar.Link
      data-slot="toolbar-link"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "hover:text-foreground hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}
ToolbarLink.displayName = "ToolbarLink";

// ---- GROUP ------------------------------------------------------------------

export type ToolbarGroupProps = React.ComponentPropsWithoutRef<typeof Toolbar.Group>;

/**
 * Logical grouping of related items — keeps them visually adjacent while
 * letting `ToolbarSeparator`s mark the boundaries between groups.
 *
 * @since 0.1.0
 */
function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  return (
    <Toolbar.Group
      data-slot="toolbar-group"
      className={cn(
        "flex items-center",
        "data-orientation-vertical:flex-col",
        className
      )}
      {...props}
    />
  );
}
ToolbarGroup.displayName = "ToolbarGroup";

// ---- INPUT ------------------------------------------------------------------

export type ToolbarInputProps = React.ComponentPropsWithoutRef<typeof Toolbar.Input>;

/**
 * Inline `<input>` that participates in the toolbar's roving-focus ring
 * (e.g., a search field or numeric stepper embedded in the toolbar).
 *
 * @since 0.3.0
 */
function ToolbarInput({ className, ...props }: ToolbarInputProps) {
  return (
    <Toolbar.Input
      data-slot="toolbar-input"
      className={cn(
        "flex h-8 w-40 rounded-md border border-input bg-background px-3 text-sm",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
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
