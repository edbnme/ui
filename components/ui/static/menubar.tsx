/**
 * Menubar — Horizontal menu bar with keyboard navigation and submenus.
 * Built on @base-ui/react Menubar and Menu primitives.
 *
 * @example
 * <MenubarRoot>
 *   <MenubarMenu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenubarPortal>
 *       <MenubarPositioner>
 *         <MenubarPopup>
 *           <MenubarItem>New</MenubarItem>
 *           <MenubarItem>Open</MenubarItem>
 *           <MenubarSeparator />
 *           <MenubarItem>Exit</MenubarItem>
 *         </MenubarPopup>
 *       </MenubarPositioner>
 *     </MenubarPortal>
 *   </MenubarMenu>
 * </MenubarRoot>
 *
 * @see https://base-ui.com/react/components/menubar
 * @see https://base-ui.com/react/components/menu
 */
"use client";

import * as React from "react";
import { Menubar } from "@base-ui/react/menubar";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";
import { Check, CaretRight } from "@phosphor-icons/react";

// =============================================================================
// MENUBAR ROOT
// =============================================================================

const MenubarRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menubar>
>(({ className, ...props }, ref) => (
  <Menubar
    ref={ref}
    className={cn(
      "flex h-10 items-center gap-1 rounded-md border border-border bg-background p-1 shadow-sm",
      className
    )}
    {...props}
  />
));
MenubarRoot.displayName = "MenubarRoot";

// =============================================================================
// MENUBAR MENU
// =============================================================================

const MenubarMenu = Menu.Root;

// =============================================================================
// MENUBAR TRIGGER
// =============================================================================

const MenubarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Menu.Trigger>
>(({ className, ...props }, ref) => (
  <Menu.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none",
      "transition-[colors,transform] duration-150 ease-out",
      "hover:bg-accent hover:text-accent-foreground",
      "focus:bg-accent focus:text-accent-foreground",
      "active:scale-[0.97]",
      "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
      className
    )}
    {...props}
  />
));
MenubarTrigger.displayName = "MenubarTrigger";

// =============================================================================
// MENUBAR PORTAL
// =============================================================================

const MenubarPortal = Menu.Portal;

// =============================================================================
// MENUBAR POSITIONER
// =============================================================================

const MenubarPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Positioner>
>(({ className, sideOffset = 4, alignOffset = -4, ...props }, ref) => (
  <Menu.Positioner
    ref={ref}
    sideOffset={sideOffset}
    alignOffset={alignOffset}
    className={cn("z-50 outline-none", className)}
    {...props}
  />
));
MenubarPositioner.displayName = "MenubarPositioner";

// =============================================================================
// MENUBAR POPUP
// =============================================================================

const MenubarPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Popup>
>(({ className, ...props }, ref) => (
  <Menu.Popup
    ref={ref}
    className={cn(
      "min-w-48 origin-(--transform-origin) transform-gpu rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
      "transition-[scale,opacity] duration-150",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
      className
    )}
    {...props}
  />
));
MenubarPopup.displayName = "MenubarPopup";

// =============================================================================
// MENUBAR ITEM
// =============================================================================

const MenubarItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <Menu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
MenubarItem.displayName = "MenubarItem";

// =============================================================================
// MENUBAR CHECKBOX ITEM
// =============================================================================

const MenubarCheckboxItem = React.forwardRef<
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
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

// =============================================================================
// MENUBAR RADIO GROUP
// =============================================================================

const MenubarRadioGroup = Menu.RadioGroup;

// =============================================================================
// MENUBAR RADIO ITEM
// =============================================================================

const MenubarRadioItem = React.forwardRef<
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
MenubarRadioItem.displayName = "MenubarRadioItem";

// =============================================================================
// MENUBAR GROUP
// =============================================================================

const MenubarGroup = Menu.Group;

// =============================================================================
// MENUBAR GROUP LABEL
// =============================================================================

const MenubarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.GroupLabel> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <Menu.GroupLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
MenubarGroupLabel.displayName = "MenubarGroupLabel";

// =============================================================================
// MENUBAR SEPARATOR
// =============================================================================

const MenubarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Separator>
>(({ className, ...props }, ref) => (
  <Menu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
MenubarSeparator.displayName = "MenubarSeparator";

// =============================================================================
// MENUBAR SUB MENU
// =============================================================================

const MenubarSubmenuRoot = Menu.Root;

const MenubarSubmenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.SubmenuTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <Menu.SubmenuTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <CaretRight className="ml-auto h-4 w-4" />
  </Menu.SubmenuTrigger>
));
MenubarSubmenuTrigger.displayName = "MenubarSubmenuTrigger";

// =============================================================================
// MENUBAR SHORTCUT
// =============================================================================

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className
    )}
    {...props}
  />
);
MenubarShortcut.displayName = "MenubarShortcut";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarPositioner,
  MenubarPopup,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarSeparator,
  MenubarSubmenuRoot,
  MenubarSubmenuTrigger,
  MenubarShortcut,
};
