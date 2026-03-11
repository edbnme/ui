/**
 * Menu — Dropdown menu with items, checkboxes, radios, groups, and submenus.
 * Built on @base-ui/react Menu primitive.
 *
 * @example
 * <MenuRoot>
 *   <MenuTrigger>Open Menu</MenuTrigger>
 *   <MenuPortal>
 *     <MenuPositioner>
 *       <MenuPopup>
 *         <MenuItem>Settings</MenuItem>
 *         <MenuItem>Profile</MenuItem>
 *       </MenuPopup>
 *     </MenuPositioner>
 *   </MenuPortal>
 * </MenuRoot>
 *
 * @see https://base-ui.com/react/components/menu
 */
"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";
import { Check, CaretRight } from "@phosphor-icons/react";

// =============================================================================
// MENU ROOT
// =============================================================================

const MenuRoot = Menu.Root;

// =============================================================================
// MENU TRIGGER
// =============================================================================

const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Menu.Trigger>
>(({ className, ...props }, ref) => (
  <Menu.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors select-none",
      "hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring active:bg-muted/80",
      "data-popup-open:bg-muted",
      className
    )}
    {...props}
  />
));
MenuTrigger.displayName = "MenuTrigger";

// =============================================================================
// MENU PORTAL
// =============================================================================

const MenuPortal = Menu.Portal;

// =============================================================================
// MENU POSITIONER
// =============================================================================

const MenuPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Positioner>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Menu.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("outline-none z-50", className)}
    {...props}
  />
));
MenuPositioner.displayName = "MenuPositioner";

// =============================================================================
// MENU POPUP
// =============================================================================

const MenuPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Popup>
>(({ className, ...props }, ref) => (
  <Menu.Popup
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
MenuPopup.displayName = "MenuPopup";

// =============================================================================
// MENU ITEM
// =============================================================================

const MenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Item>
>(({ className, ...props }, ref) => (
  <Menu.Item
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
MenuItem.displayName = "MenuItem";

// =============================================================================
// MENU CHECKBOX ITEM
// =============================================================================

const MenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <Menu.CheckboxItem
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
      <Menu.CheckboxItemIndicator>
        <Check className="h-4 w-4" weight="bold" />
      </Menu.CheckboxItemIndicator>
    </span>
    {children}
  </Menu.CheckboxItem>
));
MenuCheckboxItem.displayName = "MenuCheckboxItem";

// =============================================================================
// MENU RADIO GROUP
// =============================================================================

const MenuRadioGroup = Menu.RadioGroup;

// =============================================================================
// MENU RADIO ITEM
// =============================================================================

const MenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <Menu.RadioItem
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
      <Menu.RadioItemIndicator>
        <span className="h-2 w-2 rounded-full bg-current" />
      </Menu.RadioItemIndicator>
    </span>
    {children}
  </Menu.RadioItem>
));
MenuRadioItem.displayName = "MenuRadioItem";

// =============================================================================
// MENU GROUP
// =============================================================================

const MenuGroup = Menu.Group;

// =============================================================================
// MENU GROUP LABEL
// =============================================================================

const MenuGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.GroupLabel>
>(({ className, ...props }, ref) => (
  <Menu.GroupLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
      className
    )}
    {...props}
  />
));
MenuGroupLabel.displayName = "MenuGroupLabel";

// =============================================================================
// MENU SEPARATOR
// =============================================================================

const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Separator>
>(({ className, ...props }, ref) => (
  <Menu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
MenuSeparator.displayName = "MenuSeparator";

// =============================================================================
// MENU SUBMENU
// =============================================================================

const MenuSubmenuRoot = Menu.Root;

// =============================================================================
// MENU SUBMENU TRIGGER
// =============================================================================

const MenuSubmenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.SubmenuTrigger>
>(({ className, children, ...props }, ref) => (
  <Menu.SubmenuTrigger
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
  </Menu.SubmenuTrigger>
));
MenuSubmenuTrigger.displayName = "MenuSubmenuTrigger";

// =============================================================================
// MENU SHORTCUT
// =============================================================================

const MenuShortcut = ({
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
MenuShortcut.displayName = "MenuShortcut";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuShortcut,
};
