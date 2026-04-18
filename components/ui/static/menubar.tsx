/**
 * Menubar — horizontal application-style menu bar with keyboard navigation
 * across top-level menus and full submenu support.
 *
 * Composition: the outer `<Menubar>` is a Base UI `Menubar` container;
 * each top-level menu inside it is a regular Base UI `Menu.Root` — so
 * `MenubarMenu` aliases `Menu.Root`. All inner parts (`MenubarTrigger`,
 * `MenubarPopup`, `MenubarItem`, …) are styled wrappers around the
 * matching `Menu.*` primitives, keeping visual parity with the `Menu`
 * component while dedicating a distinct API surface for menubar usage.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.3.0
 * @brand      edbn/ui — <https://ui.edbn.me>
 * @docs       https://ui.edbn.me/docs/components/menubar
 * @source     https://ui.edbn.me/r/menubar.json
 * @registry   https://ui.edbn.me/r
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/menubar
 * @a11y       WAI-ARIA Menubar pattern; Arrow-left/right between menus,
 *             Arrow-up/down within a menu, typeahead, Esc closes.
 *             Respects `prefers-reduced-motion`.
 *
 * ## Anatomy
 * ```tsx
 * <MenubarRoot>
 *   <MenubarMenu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenubarPortal>
 *       <MenubarPositioner>
 *         <MenubarPopup>
 *           <MenubarItem>New<MenubarShortcut>ΓîÿN</MenubarShortcut></MenubarItem>
 *           <MenubarItem>Open…</MenubarItem>
 *           <MenubarSeparator />
 *           <MenubarSubmenuRoot>
 *             <MenubarSubmenuTrigger>Export</MenubarSubmenuTrigger>
 *             <MenubarPortal>
 *               <MenubarPositioner side="right" alignOffset={-4}>
 *                 <MenubarPopup>
 *                   <MenubarItem>PDF…</MenubarItem>
 *                 </MenubarPopup>
 *               </MenubarPositioner>
 *             </MenubarPortal>
 *           </MenubarSubmenuRoot>
 *         </MenubarPopup>
 *       </MenubarPositioner>
 *     </MenubarPortal>
 *   </MenubarMenu>
 * </MenubarRoot>
 * ```
 * @registryDescription Horizontal menu bar with keyboard navigation, checkbox items, and submenus.
 * @registryIsNew
 */
"use client";

import * as React from "react";
import { Menubar } from "@base-ui/react/menubar";
import { Menu } from "@base-ui/react/menu";
import { Check, CaretRight, Circle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- MENUBAR ROOT -----------------------------------------------------------

/**
 * Top-level menubar container. Forwards all Base UI `Menubar` props:
 * `loopFocus` (default `true`), `modal` (default `true`), `disabled`,
 * `orientation` (default `'horizontal'`).
 *
 * **Data attributes** — `data-orientation`, `data-has-submenu-open`,
 * `data-modal`.
 *
 * @since 0.3.0
 */
export type MenubarRootProps = React.ComponentProps<typeof Menubar>;
function MenubarRoot({ className, ...props }: MenubarRootProps) {
  return (
    <Menubar
      data-slot="menubar-root"
      className={cn(
        "flex h-10 items-center gap-1 rounded-md border border-border bg-background p-1 shadow-xs",
        "data-orientation-vertical:h-auto data-orientation-vertical:flex-col data-orientation-vertical:items-stretch",
        className,
      )}
      {...props}
    />
  );
}
MenubarRoot.displayName = "MenubarRoot";

// ---- MENUBAR MENU -----------------------------------------------------------

/**
 * A single top-level menu slot within the menubar. Aliases
 * `Menu.Root` — forwards its props (`actionsRef`, `defaultOpen`,
 * `disabled`, `modal`, `onOpenChange`, `onOpenChangeComplete`, `open`,
 * `orientation`, `openOnHover`, `delay`, `closeDelay`, …).
 *
 * @since 0.3.0
 */
export type MenubarMenuProps = React.ComponentProps<typeof Menu.Root>;
const MenubarMenu = (props: MenubarMenuProps) => <Menu.Root {...props} />;
MenubarMenu.displayName = "MenubarMenu";

// ---- MENUBAR TRIGGER --------------------------------------------------------

/**
 * Button that opens a menubar menu. Styled with subtle background on
 * hover, focus, and open states.
 *
 * **Data attributes** — `data-popup-open`, `data-pressed`.
 *
 * @since 0.3.0
 */
export type MenubarTriggerProps = React.ComponentProps<typeof Menu.Trigger>;
function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return (
    <Menu.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex cursor-default items-center rounded-sm px-3 py-1 text-sm font-medium select-none outline-none",
        "transition-colors duration-150",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:bg-accent focus-visible:text-accent-foreground",
        "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
MenubarTrigger.displayName = "MenubarTrigger";

// ---- MENUBAR PORTAL ---------------------------------------------------------

/**
 * Portals menu content into a stable DOM location.
 *
 * @since 0.3.0
 */
export type MenubarPortalProps = React.ComponentProps<typeof Menu.Portal>;
const MenubarPortal = (props: MenubarPortalProps) => <Menu.Portal {...props} />;
MenubarPortal.displayName = "MenubarPortal";

// ---- MENUBAR BACKDROP -------------------------------------------------------

/**
 * Optional dimming backdrop for modal menubar menus.
 *
 * @since 0.3.0
 */
export type MenubarBackdropProps = React.ComponentProps<typeof Menu.Backdrop>;
function MenubarBackdrop({ className, ...props }: MenubarBackdropProps) {
  return (
    <Menu.Backdrop
      data-slot="menubar-backdrop"
      className={cn(
        "fixed inset-0 z-40",
        "transition-opacity duration-150 ease-out",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        className,
      )}
      {...props}
    />
  );
}
MenubarBackdrop.displayName = "MenubarBackdrop";

// ---- MENUBAR POSITIONER -----------------------------------------------------

/**
 * Floating-UI positioner. Supports the full set of Menu.Positioner props.
 *
 * **CSS variables** — `--anchor-width`, `--anchor-height`,
 * `--available-width`, `--available-height`, `--transform-origin`.
 *
 * @since 0.3.0
 */
export type MenubarPositionerProps = React.ComponentProps<
  typeof Menu.Positioner
>;
function MenubarPositioner({
  className,
  sideOffset = 4,
  alignOffset = -4,
  ...props
}: MenubarPositionerProps) {
  return (
    <Menu.Positioner
      data-slot="menubar-positioner"
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={cn("z-50 outline-none", className)}
      {...props}
    />
  );
}
MenubarPositioner.displayName = "MenubarPositioner";

// ---- MENUBAR POPUP ----------------------------------------------------------

/**
 * The menu surface.
 *
 * **Data attributes** — `data-instant`, `data-side`,
 * `data-starting-style`, `data-ending-style`.
 *
 * @since 0.3.0
 */
export type MenubarPopupProps = React.ComponentProps<typeof Menu.Popup>;
function MenubarPopup({ className, ...props }: MenubarPopupProps) {
  return (
    <Menu.Popup
      data-slot="menubar-popup"
      className={cn(
        "z-50 min-w-48 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl",
        "origin-(--transform-origin) transform-gpu",
        "transition-[scale,opacity] duration-150 ease-out",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        "data-instant:transition-none",
        "motion-reduce:transform-none motion-reduce:transition-opacity",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        "focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
MenubarPopup.displayName = "MenubarPopup";

// ---- MENUBAR ARROW ----------------------------------------------------------

/**
 * Optional pointing arrow for submenus.
 *
 * @since 0.3.0
 */
export type MenubarArrowProps = React.ComponentProps<typeof Menu.Arrow>;
function MenubarArrow({ className, ...props }: MenubarArrowProps) {
  return (
    <Menu.Arrow
      data-slot="menubar-arrow"
      className={cn(
        "relative -top-px -z-10",
        "[&>svg]:fill-popover [&>svg]:stroke-border",
        className,
      )}
      {...props}
    />
  );
}
MenubarArrow.displayName = "MenubarArrow";

// ---- MENUBAR ITEM -----------------------------------------------------------

/**
 * Actionable menu item.
 *
 * **Data attributes** — `data-highlighted`, `data-disabled`.
 *
 * @since 0.3.0
 */
export type MenubarItemProps = React.ComponentProps<typeof Menu.Item> & {
  /** Adds left padding to align with items that have an indicator slot. */
  inset?: boolean;
};
function MenubarItem({ className, inset, ...props }: MenubarItemProps) {
  return (
    <Menu.Item
      data-slot="menubar-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}
MenubarItem.displayName = "MenubarItem";

// ---- MENUBAR LINK ITEM ------------------------------------------------------

/**
 * Anchor-based menu item. Closes the menu on click by default.
 *
 * @since 0.3.0
 */
export type MenubarLinkItemProps = React.ComponentProps<
  typeof Menu.LinkItem
> & {
  inset?: boolean;
};
function MenubarLinkItem({
  className,
  inset,
  ...props
}: MenubarLinkItemProps) {
  return (
    <Menu.LinkItem
      data-slot="menubar-link-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none outline-none",
        "transition-colors",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}
MenubarLinkItem.displayName = "MenubarLinkItem";

// ---- MENUBAR CHECKBOX ITEM --------------------------------------------------

/**
 * Checkbox-styled menu item with a built-in check indicator.
 *
 * @since 0.3.0
 */
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
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <Menu.CheckboxItemIndicator data-slot="menubar-checkbox-indicator">
          <Check aria-hidden className="size-4" weight="bold" />
        </Menu.CheckboxItemIndicator>
      </span>
      {children}
    </Menu.CheckboxItem>
  );
}
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

// ---- MENUBAR RADIO GROUP ----------------------------------------------------

/**
 * Groups a set of mutually-exclusive radio items.
 *
 * @since 0.3.0
 */
export type MenubarRadioGroupProps = React.ComponentProps<
  typeof Menu.RadioGroup
>;
const MenubarRadioGroup = Menu.RadioGroup;

// ---- MENUBAR RADIO ITEM -----------------------------------------------------

/**
 * Radio-styled menu item with a built-in dot indicator.
 *
 * @since 0.3.0
 */
export type MenubarRadioItemProps = React.ComponentProps<typeof Menu.RadioItem>;
function MenubarRadioItem({
  className,
  children,
  ...props
}: MenubarRadioItemProps) {
  return (
    <Menu.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <Menu.RadioItemIndicator data-slot="menubar-radio-indicator">
          <Circle aria-hidden className="size-2 fill-current" weight="fill" />
        </Menu.RadioItemIndicator>
      </span>
      {children}
    </Menu.RadioItem>
  );
}
MenubarRadioItem.displayName = "MenubarRadioItem";

// ---- MENUBAR GROUP ----------------------------------------------------------

/**
 * Groups related items. Pair with `MenubarGroupLabel`.
 *
 * @since 0.3.0
 */
export type MenubarGroupProps = React.ComponentProps<typeof Menu.Group>;
const MenubarGroup = Menu.Group;

// ---- MENUBAR GROUP LABEL ----------------------------------------------------

/**
 * Label rendered above a group. Presentational only.
 *
 * @since 0.3.0
 */
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
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}
MenubarGroupLabel.displayName = "MenubarGroupLabel";

// ---- MENUBAR SEPARATOR ------------------------------------------------------

/**
 * Thin horizontal divider between groups or items.
 *
 * @since 0.3.0
 */
export type MenubarSeparatorProps = React.ComponentProps<typeof Menu.Separator>;
function MenubarSeparator({ className, ...props }: MenubarSeparatorProps) {
  return (
    <Menu.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
MenubarSeparator.displayName = "MenubarSeparator";

// ---- MENUBAR SUBMENU ROOT ---------------------------------------------------

/**
 * Wrapper for a nested submenu. Place inside a `MenubarPopup` and pair
 * with `MenubarSubmenuTrigger` + nested `MenubarPortal` / `MenubarPopup`.
 *
 * @since 0.3.0
 */
export type MenubarSubmenuRootProps = React.ComponentProps<
  typeof Menu.SubmenuRoot
>;
const MenubarSubmenuRoot = Menu.SubmenuRoot;

// ---- MENUBAR SUBMENU TRIGGER ------------------------------------------------

/**
 * Menu item that opens a nested submenu on hover or Arrow-right.
 *
 * **Data attributes** — `data-popup-open`, `data-highlighted`,
 * `data-disabled`.
 *
 * @since 0.3.0
 */
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
      className={cn(
        "flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-8",
        className,
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

/**
 * Right-aligned keyboard-shortcut hint. Presentational only.
 *
 * @since 0.3.0
 */
export type MenubarShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
function MenubarShortcut({ className, ...props }: MenubarShortcutProps) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
MenubarShortcut.displayName = "MenubarShortcut";

// ---- EXPORTS ----------------------------------------------------------------

export {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarBackdrop,
  MenubarPositioner,
  MenubarPopup,
  MenubarArrow,
  MenubarItem,
  MenubarLinkItem,
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
