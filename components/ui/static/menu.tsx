/**
 * Menu — actionable dropdown menu with items, checkboxes, radios, groups,
 * submenus, and keyboard shortcuts.
 *
 * Built on Base UI's Menu primitive. For navigational top-level bars use
 * `NavigationMenu`; for single-value selection use `Select`; for type-
 * and-filter patterns use `Combobox`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.3.0
 * @brand      edbn/ui — <https://ui.edbn.me>
 * @docs       https://ui.edbn.me/docs/components/menu
 * @source     https://ui.edbn.me/r/menu.json
 * @registry   https://ui.edbn.me/r
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/menu
 * @a11y       WAI-ARIA Menu pattern; arrow-key navigation; type-to-search;
 *             Escape / outside-click dismissal; nested submenus open on
 *             hover + ArrowRight; checkbox / radio state announced via
 *             `aria-checked`.
 *
 * ## Anatomy
 * ```tsx
 * <MenuRoot>
 *   <MenuTrigger>Actions</MenuTrigger>
 *   <MenuPortal>
 *     <MenuPositioner sideOffset={4}>
 *       <MenuPopup>
 *         <MenuItem>New file<MenuShortcut>⌘N</MenuShortcut></MenuItem>
 *         <MenuItem>Save<MenuShortcut>⌘S</MenuShortcut></MenuItem>
 *         <MenuSeparator />
 *         <MenuGroup>
 *           <MenuGroupLabel>View</MenuGroupLabel>
 *           <MenuCheckboxItem checked>Show sidebar</MenuCheckboxItem>
 *           <MenuCheckboxItem>Show inspector</MenuCheckboxItem>
 *         </MenuGroup>
 *         <MenuSeparator />
 *         <MenuSubmenuRoot>
 *           <MenuSubmenuTrigger>More</MenuSubmenuTrigger>
 *           <MenuPortal>
 *             <MenuPositioner side="right" alignOffset={-4}>
 *               <MenuPopup>
 *                 <MenuItem>Export…</MenuItem>
 *               </MenuPopup>
 *             </MenuPositioner>
 *           </MenuPortal>
 *         </MenuSubmenuRoot>
 *       </MenuPopup>
 *     </MenuPositioner>
 *   </MenuPortal>
 * </MenuRoot>
 * ```
 * @registrySlug dropdown-menu
 * @registryDescription Dropdown menu with items, separators, and keyboard navigation.
 * @registryCssVars
 * @registryTitle Dropdown Menu
 */
"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { Check, CaretRight, Circle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- MENU ROOT --------------------------------------------------------------

/**
 * Top-level Menu provider. Forwards all Base UI `Menu.Root` props:
 * `actionsRef`, `children`, `closeParentOnEsc`, `defaultOpen`,
 * `defaultTriggerId`, `delay`, `closeDelay`, `disabled`, `handle`,
 * `modal`, `onOpenChange`, `onOpenChangeComplete`, `open`,
 * `openOnHover`, `orientation`, `triggerId`, `typingRef`.
 *
 * @since 0.3.0
 */
export type MenuRootProps = React.ComponentProps<typeof Menu.Root>;
const MenuRoot = (props: MenuRootProps) => <Menu.Root {...props} />;
MenuRoot.displayName = "MenuRoot";

// ---- MENU TRIGGER -----------------------------------------------------------

/**
 * Button that opens the menu. Unstyled by default (focus ring only) so you
 * can compose with your own button surface.
 *
 * **Passthrough props** — `className`, `disabled`, `handle`, `id`,
 * `nativeButton`, `payload`, `render`, `style`, plus native `<button>`
 * attrs.
 *
 * **Data attributes** — `data-popup-open`, `data-pressed`.
 *
 * @since 0.3.0
 */
export type MenuTriggerProps = React.ComponentProps<typeof Menu.Trigger>;
function MenuTrigger({ className, ...props }: MenuTriggerProps) {
  return (
    <Menu.Trigger
      data-slot="menu-trigger"
      className={cn(
        "inline-flex select-none items-center justify-center",
        "transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
MenuTrigger.displayName = "MenuTrigger";

// ---- MENU PORTAL ------------------------------------------------------------

/**
 * Portals popup into a stable DOM location.
 *
 * @since 0.3.0
 */
export type MenuPortalProps = React.ComponentProps<typeof Menu.Portal>;
const MenuPortal = (props: MenuPortalProps) => <Menu.Portal {...props} />;
MenuPortal.displayName = "MenuPortal";

// ---- MENU BACKDROP ----------------------------------------------------------

/**
 * Optional dimming backdrop for modal menus.
 *
 * @since 0.3.0
 */
export type MenuBackdropProps = React.ComponentProps<typeof Menu.Backdrop>;
function MenuBackdrop({ className, ...props }: MenuBackdropProps) {
  return (
    <Menu.Backdrop
      data-slot="menu-backdrop"
      className={cn(
        "fixed inset-0 z-40",
        "transition-opacity duration-150 ease-out",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    />
  );
}
MenuBackdrop.displayName = "MenuBackdrop";

// ---- MENU POSITIONER --------------------------------------------------------

/**
 * Positions the popup.
 *
 * **Data attributes** — `data-align`, `data-anchor-hidden`, `data-closed`,
 * `data-instant`, `data-open`, `data-side`.
 *
 * **CSS variables** — `--anchor-height`, `--anchor-width`,
 * `--available-height`, `--available-width`, `--positioner-height`,
 * `--positioner-width`, `--transform-origin`.
 *
 * @since 0.3.0
 */
export type MenuPositionerProps = React.ComponentProps<typeof Menu.Positioner>;
function MenuPositioner({
  className,
  sideOffset = 4,
  ...props
}: MenuPositionerProps) {
  return (
    <Menu.Positioner
      data-slot="menu-positioner"
      sideOffset={sideOffset}
      className={cn("z-50 max-h-(--available-height)", className)}
      {...props}
    />
  );
}
MenuPositioner.displayName = "MenuPositioner";

// ---- MENU POPUP -------------------------------------------------------------

/**
 * Menu surface.
 *
 * **Data attributes** — `data-align`, `data-closed`, `data-ending-style`,
 * `data-open`, `data-side`, `data-starting-style`.
 *
 * **CSS variables** — `--popup-height`, `--popup-width`.
 *
 * @since 0.3.0
 */
export type MenuPopupProps = React.ComponentProps<typeof Menu.Popup>;
function MenuPopup({ className, ...props }: MenuPopupProps) {
  return (
    <Menu.Popup
      data-slot="menu-popup"
      className={cn(
        "z-50 min-w-40 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl",
        "origin-(--transform-origin) transform-gpu",
        "transition-[scale,opacity] duration-150 ease-out",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        "motion-reduce:transform-none motion-reduce:transition-opacity",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        "focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
MenuPopup.displayName = "MenuPopup";

// ---- MENU ARROW -------------------------------------------------------------

/**
 * Optional arrow pointer.
 *
 * @since 0.3.0
 */
export type MenuArrowProps = React.ComponentProps<typeof Menu.Arrow>;
function MenuArrow({ className, children, ...props }: MenuArrowProps) {
  return (
    <Menu.Arrow
      data-slot="menu-arrow"
      className={cn(
        "data-[side=top]:rotate-180",
        "data-[side=left]:-rotate-90",
        "data-[side=right]:rotate-90",
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
          <path d="M0,0 L7,7 L14,0" strokeWidth="1" />
        </svg>
      )}
    </Menu.Arrow>
  );
}
MenuArrow.displayName = "MenuArrow";

// ---- MENU ITEM --------------------------------------------------------------

/**
 * Row that fires an action on click / Enter. Set `closeOnClick={false}` to
 * keep the menu open after activation. Use `render={<a href="…" />}` or
 * the dedicated {@link MenuLinkItem} for navigation.
 *
 * **Data attributes** — `data-disabled`, `data-highlighted`.
 *
 * @since 0.3.0
 */
export type MenuItemProps = React.ComponentProps<typeof Menu.Item>;
function MenuItem({ className, ...props }: MenuItemProps) {
  return (
    <Menu.Item
      data-slot="menu-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}
MenuItem.displayName = "MenuItem";

// ---- MENU LINK ITEM ---------------------------------------------------------

/**
 * `MenuItem` variant that renders as an `<a>` by default. Closes the menu
 * on click by default (set `closeOnClick={false}` to keep it open, e.g.
 * for cmd-click to open in a new tab patterns).
 *
 * @since 0.3.0
 */
export type MenuLinkItemProps = React.ComponentProps<typeof Menu.LinkItem>;
function MenuLinkItem({ className, ...props }: MenuLinkItemProps) {
  return (
    <Menu.LinkItem
      data-slot="menu-link-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm no-underline select-none outline-none",
        "text-foreground",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}
MenuLinkItem.displayName = "MenuLinkItem";

// ---- MENU CHECKBOX ITEM -----------------------------------------------------

/**
 * Toggleable item with a leading check indicator. `closeOnClick` defaults
 * to `false` for checkbox items so the user can toggle multiple states.
 *
 * **Data attributes** — `data-checked`, `data-unchecked`, `data-disabled`,
 * `data-highlighted`.
 *
 * @since 0.3.0
 */
export type MenuCheckboxItemProps = React.ComponentProps<
  typeof Menu.CheckboxItem
>;
function MenuCheckboxItem({
  className,
  children,
  ...props
}: MenuCheckboxItemProps) {
  return (
    <Menu.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <Menu.CheckboxItemIndicator
          data-slot="menu-checkbox-indicator"
          className="flex items-center justify-center"
        >
          <Check aria-hidden className="size-4" weight="bold" />
        </Menu.CheckboxItemIndicator>
      </span>
      {children}
    </Menu.CheckboxItem>
  );
}
MenuCheckboxItem.displayName = "MenuCheckboxItem";

// ---- MENU RADIO GROUP + ITEM ------------------------------------------------

/**
 * Groups `MenuRadioItem`s and holds the selected `value`.
 *
 * @since 0.3.0
 */
export type MenuRadioGroupProps = React.ComponentProps<typeof Menu.RadioGroup>;
const MenuRadioGroup = (props: MenuRadioGroupProps) => (
  <Menu.RadioGroup {...props} />
);
MenuRadioGroup.displayName = "MenuRadioGroup";

/**
 * Single-select item within a `MenuRadioGroup`. Renders a small filled
 * circle indicator when selected.
 *
 * **Data attributes** — `data-checked`, `data-unchecked`, `data-disabled`,
 * `data-highlighted`.
 *
 * @since 0.3.0
 */
export type MenuRadioItemProps = React.ComponentProps<typeof Menu.RadioItem>;
function MenuRadioItem({ className, children, ...props }: MenuRadioItemProps) {
  return (
    <Menu.RadioItem
      data-slot="menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <Menu.RadioItemIndicator
          data-slot="menu-radio-indicator"
          className="flex items-center justify-center"
        >
          <Circle aria-hidden className="size-2" weight="fill" />
        </Menu.RadioItemIndicator>
      </span>
      {children}
    </Menu.RadioItem>
  );
}
MenuRadioItem.displayName = "MenuRadioItem";

// ---- MENU GROUP + GROUP LABEL ----------------------------------------------

/**
 * Logical grouping of items. Pair with `MenuGroupLabel` for section
 * headings.
 *
 * @since 0.3.0
 */
export type MenuGroupProps = React.ComponentProps<typeof Menu.Group>;
function MenuGroup({ className, ...props }: MenuGroupProps) {
  return <Menu.Group data-slot="menu-group" className={className} {...props} />;
}
MenuGroup.displayName = "MenuGroup";

/**
 * Non-interactive label for a `MenuGroup`.
 *
 * @since 0.3.0
 */
export type MenuGroupLabelProps = React.ComponentProps<typeof Menu.GroupLabel>;
function MenuGroupLabel({ className, ...props }: MenuGroupLabelProps) {
  return (
    <Menu.GroupLabel
      data-slot="menu-group-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
MenuGroupLabel.displayName = "MenuGroupLabel";

// ---- MENU SEPARATOR ---------------------------------------------------------

/**
 * Thin rule separating item groups.
 *
 * @since 0.3.0
 */
export type MenuSeparatorProps = React.ComponentProps<typeof Menu.Separator>;
function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return (
    <Menu.Separator
      data-slot="menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
MenuSeparator.displayName = "MenuSeparator";

// ---- MENU SUBMENU -----------------------------------------------------------

/**
 * Wrapper that defines a nested submenu. Place inside a `MenuPopup` and
 * pair with `MenuSubmenuTrigger` + nested `MenuPortal` / `MenuPopup`.
 *
 * `SubmenuRoot` is an alias for `Menu.Root` with a parent context — it
 * shares the same prop surface.
 *
 * @since 0.3.0
 */
export type MenuSubmenuRootProps = React.ComponentProps<
  typeof Menu.SubmenuRoot
>;
const MenuSubmenuRoot = (props: MenuSubmenuRootProps) => (
  <Menu.SubmenuRoot {...props} />
);
MenuSubmenuRoot.displayName = "MenuSubmenuRoot";

/**
 * Item that both opens a submenu and displays a trailing `CaretRight`
 * indicator. When activated (hover, click, or ArrowRight), the nested
 * submenu opens.
 *
 * @since 0.3.0
 */
export type MenuSubmenuTriggerProps = React.ComponentProps<
  typeof Menu.SubmenuTrigger
>;
function MenuSubmenuTrigger({
  className,
  children,
  ...props
}: MenuSubmenuTriggerProps) {
  return (
    <Menu.SubmenuTrigger
      data-slot="menu-submenu-trigger"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <CaretRight
        aria-hidden
        className="ml-auto size-4 text-muted-foreground"
        weight="bold"
      />
    </Menu.SubmenuTrigger>
  );
}
MenuSubmenuTrigger.displayName = "MenuSubmenuTrigger";

// ---- MENU SHORTCUT ----------------------------------------------------------

/**
 * Trailing keyboard hint (e.g. `⌘ S`). Visual only — the actual shortcut
 * must be handled by your app's keymap.
 *
 * @since 0.3.0
 */
export type MenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
function MenuShortcut({ className, ...props }: MenuShortcutProps) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
MenuShortcut.displayName = "MenuShortcut";

// ---- MENU HANDLE (detached-trigger API) -------------------------------------

/**
 * Handle type produced by {@link createMenuHandle}. Enables detached
 * triggers that control a remote `MenuRoot` — pass the same handle to
 * both trigger and root.
 *
 * @since 0.3.0
 */
const MenuHandle = Menu.Handle;

/**
 * Creates a typed handle for detached triggers. The generic is the
 * `payload` type carried from trigger to root's function-as-children.
 *
 * @since 0.3.0
 */
const createMenuHandle = Menu.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuBackdrop,
  MenuPositioner,
  MenuPopup,
  MenuArrow,
  MenuItem,
  MenuLinkItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuShortcut,
  MenuHandle,
  createMenuHandle,
};
