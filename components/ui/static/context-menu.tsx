/**
 * ContextMenu — Right-click context menu with items, checkboxes, radios, and submenus.
 * Built on @base-ui/react ContextMenu primitive.
 *
 * @example
 * <ContextMenuRoot>
 *   <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
 *   <ContextMenuPortal>
 *     <ContextMenuPositioner>
 *       <ContextMenuPopup>
 *         <ContextMenuItem>Cut</ContextMenuItem>
 *         <ContextMenuItem>Copy</ContextMenuItem>
 *       </ContextMenuPopup>
 *     </ContextMenuPositioner>
 *   </ContextMenuPortal>
 * </ContextMenuRoot>
 *
 * @see https://base-ui.com/react/components/context-menu
 */
"use client";

import * as React from "react";
import { ContextMenu } from "@base-ui/react/context-menu";
import { cn } from "@/lib/utils";
import { Check, CaretRight } from "@phosphor-icons/react";

// =============================================================================
// CONTEXT MENU ROOT
// =============================================================================

const ContextMenuRoot = ContextMenu.Root;

// =============================================================================
// CONTEXT MENU TRIGGER
// =============================================================================

const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ContextMenu.Trigger>
>(({ className, ...props }, ref) => (
  <ContextMenu.Trigger
    ref={ref}
    className={cn("cursor-context-menu", className)}
    {...props}
  />
));
ContextMenuTrigger.displayName = "ContextMenuTrigger";

// =============================================================================
// CONTEXT MENU PORTAL
// =============================================================================

const ContextMenuPortal = ContextMenu.Portal;

// =============================================================================
// CONTEXT MENU POSITIONER
// =============================================================================

const ContextMenuPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ContextMenu.Positioner>
>(({ className, ...props }, ref) => (
  <ContextMenu.Positioner
    ref={ref}
    className={cn("outline-none z-50", className)}
    {...props}
  />
));
ContextMenuPositioner.displayName = "ContextMenuPositioner";

// =============================================================================
// CONTEXT MENU POPUP
// =============================================================================

const ContextMenuPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ContextMenu.Popup>
>(({ className, ...props }, ref) => (
  <ContextMenu.Popup
    ref={ref}
    className={cn(
      "min-w-32 origin-(--transform-origin) rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
      "transition-[transform,scale,opacity] duration-150",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
ContextMenuPopup.displayName = "ContextMenuPopup";

// =============================================================================
// CONTEXT MENU ITEM
// =============================================================================

const ContextMenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ContextMenu.Item>
>(({ className, ...props }, ref) => (
  <ContextMenu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ContextMenuItem.displayName = "ContextMenuItem";

// =============================================================================
// CONTEXT MENU CHECKBOX ITEM
// =============================================================================

const ContextMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ContextMenu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenu.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenu.CheckboxItemIndicator>
        <Check className="h-4 w-4" weight="bold" />
      </ContextMenu.CheckboxItemIndicator>
    </span>
    {children}
  </ContextMenu.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

// =============================================================================
// CONTEXT MENU RADIO GROUP
// =============================================================================

const ContextMenuRadioGroup = ContextMenu.RadioGroup;

// =============================================================================
// CONTEXT MENU RADIO ITEM
// =============================================================================

const ContextMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ContextMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenu.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenu.RadioItemIndicator>
        <span className="h-2 w-2 rounded-full bg-current" />
      </ContextMenu.RadioItemIndicator>
    </span>
    {children}
  </ContextMenu.RadioItem>
));
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

// =============================================================================
// CONTEXT MENU GROUP
// =============================================================================

const ContextMenuGroup = ContextMenu.Group;

// =============================================================================
// CONTEXT MENU GROUP LABEL
// =============================================================================

const ContextMenuGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ContextMenu.GroupLabel>
>(({ className, ...props }, ref) => (
  <ContextMenu.GroupLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
      className
    )}
    {...props}
  />
));
ContextMenuGroupLabel.displayName = "ContextMenuGroupLabel";

// =============================================================================
// CONTEXT MENU SEPARATOR
// =============================================================================

const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ContextMenu.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

// =============================================================================
// CONTEXT MENU SUBMENU
// =============================================================================

const ContextMenuSubmenuRoot = ContextMenu.Root;

// =============================================================================
// CONTEXT MENU SUBMENU TRIGGER
// =============================================================================

const ContextMenuSubmenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof ContextMenu.SubmenuTrigger>
>(({ className, children, ...props }, ref) => (
  <ContextMenu.SubmenuTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
    <CaretRight className="ml-auto h-4 w-4" />
  </ContextMenu.SubmenuTrigger>
));
ContextMenuSubmenuTrigger.displayName = "ContextMenuSubmenuTrigger";

// =============================================================================
// CONTEXT MENU SHORTCUT
// =============================================================================

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuPopup,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuSeparator,
  ContextMenuSubmenuRoot,
  ContextMenuSubmenuTrigger,
  ContextMenuShortcut,
};
