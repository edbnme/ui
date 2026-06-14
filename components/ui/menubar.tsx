/**
 * Menubar - Premium solid application menu bar.
 *
 * Built on Base UI Menubar v1.5.0 plus Base UI Menu parts for each top-level
 * menu. The wrapper preserves refs, render composition, state className,
 * state style, menu handles, submenu parts, indicators, viewport transitions,
 * data attributes, CSS variables, and controlled open state.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @docs https://ui.edbn.me/docs/components/menubar
 * @source https://ui.edbn.me/r/menubar.json
 * @registry https://ui.edbn.me/r
 * @upstream https://base-ui.com/react/components/menubar
 * @registryDescription Premium solid menubar with keyboard navigation, checkbox items, radio items, and submenus.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Menubar } from "@base-ui/react/menubar";
import { Menu } from "@base-ui/react/menu";
import { CaretRight, Check, Circle } from "@phosphor-icons/react";

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

// ---- MENUBAR ROOT -----------------------------------------------------------

export type MenubarRootProps = React.ComponentProps<typeof Menubar>;

function MenubarRoot({ className, ...props }: MenubarRootProps) {
  return (
    <Menubar
      data-slot="menubar-root"
      className={composeClassName<Menubar.State>(
        cn(
          "flex h-10 items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-sm",
          "data-orientation-vertical:h-auto data-orientation-vertical:flex-col data-orientation-vertical:items-stretch",
          "data-has-submenu-open:shadow-md"
        ),
        className
      )}
      {...props}
    />
  );
}
MenubarRoot.displayName = "MenubarRoot";

// ---- MENUBAR MENU -----------------------------------------------------------

export type MenubarMenuProps = Menu.Root.Props;

const MenubarMenu = (props: MenubarMenuProps) => <Menu.Root {...props} />;
MenubarMenu.displayName = "MenubarMenu";

// ---- MENUBAR TRIGGER --------------------------------------------------------

export type MenubarTriggerProps = React.ComponentProps<typeof Menu.Trigger>;

function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return (
    <Menu.Trigger
      data-slot="menubar-trigger"
      className={composeClassName<Menu.Trigger.State>(
        cn(
          "flex cursor-default items-center rounded-md px-3 py-1.5 text-sm font-medium select-none outline-none",
          "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring",
          "data-popup-open:bg-accent data-popup-open:text-accent-foreground data-popup-open:shadow-sm",
          "disabled:pointer-events-none disabled:opacity-50"
        ),
        className
      )}
      {...props}
    />
  );
}
MenubarTrigger.displayName = "MenubarTrigger";

// ---- MENUBAR PORTAL ---------------------------------------------------------

export type MenubarPortalProps = React.ComponentProps<typeof Menu.Portal>;

const MenubarPortal = (props: MenubarPortalProps) => <Menu.Portal {...props} />;
MenubarPortal.displayName = "MenubarPortal";

// ---- MENUBAR BACKDROP -------------------------------------------------------

export type MenubarBackdropProps = React.ComponentProps<typeof Menu.Backdrop>;

function MenubarBackdrop({ className, ...props }: MenubarBackdropProps) {
  return (
    <Menu.Backdrop
      data-slot="menubar-backdrop"
      className={composeClassName<Menu.Backdrop.State>(
        cn(
          "fixed inset-0 z-40",
          "transition-opacity duration-150 ease-out motion-reduce:transition-none",
          "data-starting-style:opacity-0 data-ending-style:opacity-0"
        ),
        className
      )}
      {...props}
    />
  );
}
MenubarBackdrop.displayName = "MenubarBackdrop";

// ---- MENUBAR POSITIONER -----------------------------------------------------

export type MenubarPositionerProps = React.ComponentProps<
  typeof Menu.Positioner
>;

function MenubarPositioner({
  className,
  sideOffset = 6,
  alignOffset = -4,
  ...props
}: MenubarPositionerProps) {
  return (
    <Menu.Positioner
      data-slot="menubar-positioner"
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={composeClassName<Menu.Positioner.State>(
        cn(
          "z-50 max-h-[min(var(--available-height),32rem)] outline-none",
          "data-anchor-hidden:pointer-events-none data-anchor-hidden:opacity-0"
        ),
        className
      )}
      {...props}
    />
  );
}
MenubarPositioner.displayName = "MenubarPositioner";

// ---- MENUBAR POPUP ----------------------------------------------------------

export type MenubarPopupProps = React.ComponentProps<typeof Menu.Popup>;

function MenubarPopup({ className, ...props }: MenubarPopupProps) {
  return (
    <Menu.Popup
      data-slot="menubar-popup"
      className={composeClassName<Menu.Popup.State>(
        cn(
          "z-50 min-w-48 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl",
          "origin-(--transform-origin) transform-gpu",
          "transition-[opacity,transform] duration-150 ease-out motion-reduce:transform-none motion-reduce:transition-opacity",
          "data-starting-style:scale-95 data-starting-style:opacity-0",
          "data-ending-style:scale-95 data-ending-style:opacity-0",
          "data-instant:transition-none",
          "focus:outline-none"
        ),
        className
      )}
      {...props}
    />
  );
}
MenubarPopup.displayName = "MenubarPopup";

// ---- MENUBAR VIEWPORT -------------------------------------------------------

export type MenubarViewportProps = React.ComponentProps<typeof Menu.Viewport>;

function MenubarViewport({ className, ...props }: MenubarViewportProps) {
  return (
    <Menu.Viewport
      data-slot="menubar-viewport"
      className={composeClassName<Menu.Viewport.State>(
        cn(
          "overflow-hidden",
          "transition-[width,height] duration-150 ease-out motion-reduce:transition-none",
          "data-transitioning:pointer-events-none"
        ),
        className
      )}
      {...props}
    />
  );
}
MenubarViewport.displayName = "MenubarViewport";

// ---- MENUBAR ARROW ----------------------------------------------------------

export type MenubarArrowProps = React.ComponentProps<typeof Menu.Arrow>;

function MenubarArrow({ className, children, ...props }: MenubarArrowProps) {
  return (
    <Menu.Arrow
      data-slot="menubar-arrow"
      className={composeClassName<Menu.Arrow.State>(
        cn(
          "data-[side=top]:rotate-180 data-[side=left]:-rotate-90 data-[side=right]:rotate-90",
          "data-uncentered:opacity-0"
        ),
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          aria-hidden
          width="14"
          height="7"
          viewBox="0 0 14 7"
          className="block fill-popover stroke-border"
        >
          <path d="M0 0h14L7 7z" strokeWidth="1" />
        </svg>
      )}
    </Menu.Arrow>
  );
}
MenubarArrow.displayName = "MenubarArrow";

// ---- MENUBAR ITEM -----------------------------------------------------------

export type MenubarItemProps = React.ComponentProps<typeof Menu.Item> & {
  inset?: boolean;
};

function MenubarItem({ className, inset, ...props }: MenubarItemProps) {
  return (
    <Menu.Item
      data-slot="menubar-item"
      className={composeClassName<Menu.Item.State>(
        cn(
          "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none outline-none",
          "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          inset && "pl-8"
        ),
        className
      )}
      {...props}
    />
  );
}
MenubarItem.displayName = "MenubarItem";

// ---- MENUBAR LINK ITEM ------------------------------------------------------

export type MenubarLinkItemProps = React.ComponentProps<
  typeof Menu.LinkItem
> & {
  inset?: boolean;
};

function MenubarLinkItem({ className, inset, ...props }: MenubarLinkItemProps) {
  return (
    <Menu.LinkItem
      data-slot="menubar-link-item"
      className={composeClassName<Menu.LinkItem.State>(
        cn(
          "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none outline-none",
          "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          inset && "pl-8"
        ),
        className
      )}
      {...props}
    />
  );
}
MenubarLinkItem.displayName = "MenubarLinkItem";

// ---- MENUBAR CHECKBOX ITEM INDICATOR ---------------------------------------

export type MenubarCheckboxItemIndicatorProps = React.ComponentProps<
  typeof Menu.CheckboxItemIndicator
>;

function MenubarCheckboxItemIndicator({
  className,
  children,
  ...props
}: MenubarCheckboxItemIndicatorProps) {
  return (
    <Menu.CheckboxItemIndicator
      data-slot="menubar-checkbox-indicator"
      className={composeClassName<Menu.CheckboxItemIndicator.State>(
        "flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children ?? <Check aria-hidden className="size-4" weight="bold" />}
    </Menu.CheckboxItemIndicator>
  );
}
MenubarCheckboxItemIndicator.displayName = "MenubarCheckboxItemIndicator";

// ---- MENUBAR CHECKBOX ITEM --------------------------------------------------

export type MenubarCheckboxItemProps = React.ComponentProps<
  typeof Menu.CheckboxItem
>;

function MenubarCheckboxItem({
  className,
  children,
  ...props
}: MenubarCheckboxItemProps) {
  return (
    <Menu.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={composeClassName<Menu.CheckboxItem.State>(
        cn(
          "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm select-none outline-none",
          "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50"
        ),
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarCheckboxItemIndicator />
      </span>
      {children}
    </Menu.CheckboxItem>
  );
}
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

// ---- MENUBAR RADIO GROUP ----------------------------------------------------

export type MenubarRadioGroupProps = React.ComponentProps<
  typeof Menu.RadioGroup
>;
const MenubarRadioGroup = Menu.RadioGroup;

// ---- MENUBAR RADIO ITEM INDICATOR ------------------------------------------

export type MenubarRadioItemIndicatorProps = React.ComponentProps<
  typeof Menu.RadioItemIndicator
>;

function MenubarRadioItemIndicator({
  className,
  children,
  ...props
}: MenubarRadioItemIndicatorProps) {
  return (
    <Menu.RadioItemIndicator
      data-slot="menubar-radio-indicator"
      className={composeClassName<Menu.RadioItemIndicator.State>(
        "flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children ?? (
        <Circle aria-hidden className="size-2 fill-current" weight="fill" />
      )}
    </Menu.RadioItemIndicator>
  );
}
MenubarRadioItemIndicator.displayName = "MenubarRadioItemIndicator";

// ---- MENUBAR RADIO ITEM -----------------------------------------------------

export type MenubarRadioItemProps = React.ComponentProps<typeof Menu.RadioItem>;

function MenubarRadioItem({
  className,
  children,
  ...props
}: MenubarRadioItemProps) {
  return (
    <Menu.RadioItem
      data-slot="menubar-radio-item"
      className={composeClassName<Menu.RadioItem.State>(
        cn(
          "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm select-none outline-none",
          "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50"
        ),
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarRadioItemIndicator />
      </span>
      {children}
    </Menu.RadioItem>
  );
}
MenubarRadioItem.displayName = "MenubarRadioItem";

// ---- MENUBAR GROUP ----------------------------------------------------------

export type MenubarGroupProps = React.ComponentProps<typeof Menu.Group>;
const MenubarGroup = Menu.Group;

// ---- MENUBAR GROUP LABEL ----------------------------------------------------

export type MenubarGroupLabelProps = React.ComponentProps<
  typeof Menu.GroupLabel
> & {
  inset?: boolean;
};

function MenubarGroupLabel({
  className,
  inset,
  ...props
}: MenubarGroupLabelProps) {
  return (
    <Menu.GroupLabel
      data-slot="menubar-group-label"
      className={composeClassName<Menu.GroupLabel.State>(
        cn(
          "px-2 py-1.5 text-xs font-medium text-muted-foreground",
          inset && "pl-8"
        ),
        className
      )}
      {...props}
    />
  );
}
MenubarGroupLabel.displayName = "MenubarGroupLabel";

// ---- MENUBAR SEPARATOR ------------------------------------------------------

export type MenubarSeparatorProps = React.ComponentProps<typeof Menu.Separator>;

function MenubarSeparator({ className, ...props }: MenubarSeparatorProps) {
  return (
    <Menu.Separator
      data-slot="menubar-separator"
      className={composeClassName<Menu.Separator.State>(
        "-mx-1 my-1 h-px bg-border",
        className
      )}
      {...props}
    />
  );
}
MenubarSeparator.displayName = "MenubarSeparator";

// ---- MENUBAR SUBMENU ROOT ---------------------------------------------------

export type MenubarSubmenuRootProps = React.ComponentProps<
  typeof Menu.SubmenuRoot
>;
const MenubarSubmenuRoot = Menu.SubmenuRoot;

// ---- MENUBAR SUBMENU TRIGGER ------------------------------------------------

export type MenubarSubmenuTriggerProps = React.ComponentProps<
  typeof Menu.SubmenuTrigger
> & {
  inset?: boolean;
};

function MenubarSubmenuTrigger({
  className,
  inset,
  children,
  ...props
}: MenubarSubmenuTriggerProps) {
  return (
    <Menu.SubmenuTrigger
      data-slot="menubar-submenu-trigger"
      className={composeClassName<Menu.SubmenuTrigger.State>(
        cn(
          "flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none outline-none",
          "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          inset && "pl-8"
        ),
        className
      )}
      {...props}
    >
      {children}
      <CaretRight aria-hidden className="ml-auto size-4" weight="bold" />
    </Menu.SubmenuTrigger>
  );
}
MenubarSubmenuTrigger.displayName = "MenubarSubmenuTrigger";

// ---- MENUBAR SHORTCUT -------------------------------------------------------

export type MenubarShortcutProps = React.ComponentProps<"span">;

function MenubarShortcut({ className, ...props }: MenubarShortcutProps) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
MenubarShortcut.displayName = "MenubarShortcut";

// ---- IMPERATIVE HANDLE ------------------------------------------------------

const MenubarHandle = Menu.Handle;
const createMenubarHandle = Menu.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarBackdrop,
  MenubarPositioner,
  MenubarPopup,
  MenubarViewport,
  MenubarArrow,
  MenubarItem,
  MenubarLinkItem,
  MenubarCheckboxItemIndicator,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItemIndicator,
  MenubarRadioItem,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarSeparator,
  MenubarSubmenuRoot,
  MenubarSubmenuTrigger,
  MenubarShortcut,
  MenubarHandle,
  createMenubarHandle,
};
