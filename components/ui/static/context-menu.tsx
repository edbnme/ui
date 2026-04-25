/**
 * ContextMenu — right-click / long-press menu with full keyboard support,
 * nested submenus, checkbox items, radio groups, and link items.
 *
 * Built on Base UI's `ContextMenu` namespace (v1.2.0 — shares the Menu
 * primitive under the hood, so animation and styling tokens match
 * `Menu`). For click-to-open menus use `Menu`; for top-level application
 * menu bars use `Menubar`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.3.0
 * @brand      edbn/ui — <https://ui.edbn.me>
 * @docs       https://ui.edbn.me/docs/components/context-menu
 * @source     https://ui.edbn.me/r/context-menu.json
 * @registry   https://ui.edbn.me/r
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/context-menu
 * @a11y       WAI-ARIA Menu pattern; full keyboard support (Arrow keys,
 *             Home/End, Enter, Esc, typeahead); focus trap while open;
 *             respects `prefers-reduced-motion`.
 *
 * ## Anatomy
 * ```tsx
 * <ContextMenuRoot>
 *   <ContextMenuTrigger>Right-click area</ContextMenuTrigger>
 *   <ContextMenuPortal>
 *     <ContextMenuPositioner>
 *       <ContextMenuPopup>
 *         <ContextMenuItem>Cut</ContextMenuItem>
 *         <ContextMenuItem>Copy</ContextMenuItem>
 *         <ContextMenuSeparator />
 *         <ContextMenuCheckboxItem checked>Show grid</ContextMenuCheckboxItem>
 *         <ContextMenuRadioGroup value="m">
 *           <ContextMenuRadioItem value="s">Small</ContextMenuRadioItem>
 *           <ContextMenuRadioItem value="m">Medium</ContextMenuRadioItem>
 *         </ContextMenuRadioGroup>
 *         <ContextMenuSubmenuRoot>
 *           <ContextMenuSubmenuTrigger>More…</ContextMenuSubmenuTrigger>
 *           <ContextMenuPortal>
 *             <ContextMenuPositioner>
 *               <ContextMenuPopup>
 *                 <ContextMenuItem>Export</ContextMenuItem>
 *               </ContextMenuPopup>
 *             </ContextMenuPositioner>
 *           </ContextMenuPortal>
 *         </ContextMenuSubmenuRoot>
 *       </ContextMenuPopup>
 *     </ContextMenuPositioner>
 *   </ContextMenuPortal>
 * </ContextMenuRoot>
 * ```
 * @registryDescription Right-click context menu with items, checkboxes, radio groups, and submenus.
 * @registryIsNew
 */
"use client";

import * as React from "react";
import { ContextMenu } from "@base-ui/react/context-menu";
import { Check, CaretRight, Circle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- CONTEXT MENU ROOT ------------------------------------------------------

/**
 * Top-level ContextMenu provider. Forwards all Base UI `ContextMenu.Root`
 * props: `actionsRef`, `children`, `closeParentOnEsc`, `defaultOpen`,
 * `defaultTriggerId`, `disabled`, `modal`, `onOpenChange`,
 * `onOpenChangeComplete`, `open`, `orientation`, `triggerId`.
 *
 * @since 0.3.0
 */
export type ContextMenuRootProps = React.ComponentProps<typeof ContextMenu.Root>;
const ContextMenuRoot = (props: ContextMenuRootProps) => (
  <ContextMenu.Root {...props} />
);
ContextMenuRoot.displayName = "ContextMenuRoot";

// ---- CONTEXT MENU TRIGGER ---------------------------------------------------

/**
 * Surface that listens for `contextmenu` events (right-click or
 * long-press) and opens the menu.
 *
 * @since 0.3.0
 */
export type ContextMenuTriggerProps = React.ComponentProps<
  typeof ContextMenu.Trigger
>;
function ContextMenuTrigger({ className, ...props }: ContextMenuTriggerProps) {
  return (
    <ContextMenu.Trigger
      data-slot="context-menu-trigger"
      className={cn("cursor-context-menu", className)}
      {...props}
    />
  );
}
ContextMenuTrigger.displayName = "ContextMenuTrigger";

// ---- CONTEXT MENU PORTAL ----------------------------------------------------

/**
 * Portals popup into a stable DOM location.
 *
 * @since 0.3.0
 */
export type ContextMenuPortalProps = React.ComponentProps<
  typeof ContextMenu.Portal
>;
const ContextMenuPortal = (props: ContextMenuPortalProps) => (
  <ContextMenu.Portal {...props} />
);
ContextMenuPortal.displayName = "ContextMenuPortal";

// ---- CONTEXT MENU BACKDROP --------------------------------------------------

/**
 * Optional dimming backdrop for modal context menus.
 *
 * **Data attributes** — `data-open`, `data-closed`, `data-starting-style`,
 * `data-ending-style`.
 *
 * @since 0.3.0
 */
export type ContextMenuBackdropProps = React.ComponentProps<
  typeof ContextMenu.Backdrop
>;
function ContextMenuBackdrop({ className, ...props }: ContextMenuBackdropProps) {
  return (
    <ContextMenu.Backdrop
      data-slot="context-menu-backdrop"
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
ContextMenuBackdrop.displayName = "ContextMenuBackdrop";

// ---- CONTEXT MENU POSITIONER ------------------------------------------------

/**
 * Floating-UI powered positioner. Supports `align`, `alignOffset`,
 * `anchor`, `arrowPadding`, `collisionAvoidance`, `collisionBoundary`,
 * `collisionPadding`, `disableAnchorTracking`, `positionMethod`, `side`,
 * `sideOffset`, `sticky`, `trackAnchor`.
 *
 * **CSS variables** — `--anchor-height`, `--anchor-width`,
 * `--available-height`, `--available-width`, `--transform-origin`.
 *
 * @since 0.3.0
 */
export type ContextMenuPositionerProps = React.ComponentProps<
  typeof ContextMenu.Positioner
>;
function ContextMenuPositioner({
  className,
  ...props
}: ContextMenuPositionerProps) {
  return (
    <ContextMenu.Positioner
      data-slot="context-menu-positioner"
      className={cn("z-50 outline-none", className)}
      {...props}
    />
  );
}
ContextMenuPositioner.displayName = "ContextMenuPositioner";

// ---- CONTEXT MENU POPUP -----------------------------------------------------

/**
 * The menu surface. Focus is trapped inside; Esc closes.
 *
 * **Data attributes** — `data-instant`, `data-side`,
 * `data-starting-style`, `data-ending-style`.
 *
 * @since 0.3.0
 */
export type ContextMenuPopupProps = React.ComponentProps<
  typeof ContextMenu.Popup
>;
function ContextMenuPopup({ className, ...props }: ContextMenuPopupProps) {
  return (
    <ContextMenu.Popup
      data-slot="context-menu-popup"
      className={cn(
        "z-50 min-w-40 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl",
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
ContextMenuPopup.displayName = "ContextMenuPopup";

// ---- CONTEXT MENU ARROW -----------------------------------------------------

/**
 * Optional pointing arrow. Auto-flips with the popup.
 *
 * **Data attributes** — `data-open`, `data-closed`, `data-uncentered`,
 * `data-align`, `data-side`.
 *
 * @since 0.3.0
 */
export type ContextMenuArrowProps = React.ComponentProps<
  typeof ContextMenu.Arrow
>;
function ContextMenuArrow({ className, ...props }: ContextMenuArrowProps) {
  return (
    <ContextMenu.Arrow
      data-slot="context-menu-arrow"
      className={cn(
        "relative -top-px -z-10",
        "[&>svg]:fill-popover [&>svg]:stroke-border",
        className,
      )}
      {...props}
    />
  );
}
ContextMenuArrow.displayName = "ContextMenuArrow";

// ---- CONTEXT MENU ITEM ------------------------------------------------------

/**
 * Actionable menu item.
 *
 * **Data attributes** — `data-highlighted`, `data-disabled`.
 *
 * @since 0.3.0
 */
export type ContextMenuItemProps = React.ComponentProps<
  typeof ContextMenu.Item
> & {
  /** Adds left padding to align with items that have an indicator slot. */
  inset?: boolean;
};
function ContextMenuItem({ className, inset, ...props }: ContextMenuItemProps) {
  return (
    <ContextMenu.Item
      data-slot="context-menu-item"
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
ContextMenuItem.displayName = "ContextMenuItem";

// ---- CONTEXT MENU LINK ITEM -------------------------------------------------

/**
 * Anchor-based menu item for navigation. Closes the menu on click by
 * default.
 *
 * **Data attributes** — `data-highlighted`.
 *
 * @since 0.3.0
 */
export type ContextMenuLinkItemProps = React.ComponentProps<
  typeof ContextMenu.LinkItem
> & {
  inset?: boolean;
};
function ContextMenuLinkItem({
  className,
  inset,
  ...props
}: ContextMenuLinkItemProps) {
  return (
    <ContextMenu.LinkItem
      data-slot="context-menu-link-item"
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
ContextMenuLinkItem.displayName = "ContextMenuLinkItem";

// ---- CONTEXT MENU CHECKBOX ITEM ---------------------------------------------

/**
 * Checkbox-styled menu item with a built-in check indicator.
 *
 * **Data attributes** — `data-checked`, `data-unchecked`,
 * `data-highlighted`, `data-disabled`.
 *
 * @since 0.3.0
 */
export type ContextMenuCheckboxItemProps = React.ComponentProps<
  typeof ContextMenu.CheckboxItem
>;
function ContextMenuCheckboxItem({
  className,
  children,
  ...props
}: ContextMenuCheckboxItemProps) {
  return (
    <ContextMenu.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenu.CheckboxItemIndicator data-slot="context-menu-checkbox-indicator">
          <Check aria-hidden className="size-4" weight="bold" />
        </ContextMenu.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenu.CheckboxItem>
  );
}
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

// ---- CONTEXT MENU RADIO GROUP -----------------------------------------------

/**
 * Groups a set of mutually-exclusive radio items.
 *
 * @since 0.3.0
 */
export type ContextMenuRadioGroupProps = React.ComponentProps<
  typeof ContextMenu.RadioGroup
>;
const ContextMenuRadioGroup = ContextMenu.RadioGroup;

// ---- CONTEXT MENU RADIO ITEM ------------------------------------------------

/**
 * Radio-styled menu item with a built-in dot indicator.
 *
 * **Data attributes** — `data-checked`, `data-unchecked`,
 * `data-highlighted`, `data-disabled`.
 *
 * @since 0.3.0
 */
export type ContextMenuRadioItemProps = React.ComponentProps<
  typeof ContextMenu.RadioItem
>;
function ContextMenuRadioItem({
  className,
  children,
  ...props
}: ContextMenuRadioItemProps) {
  return (
    <ContextMenu.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenu.RadioItemIndicator data-slot="context-menu-radio-indicator">
          <Circle aria-hidden className="size-2 fill-current" weight="fill" />
        </ContextMenu.RadioItemIndicator>
      </span>
      {children}
    </ContextMenu.RadioItem>
  );
}
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

// ---- CONTEXT MENU GROUP -----------------------------------------------------

/**
 * Groups related items. Pair with `ContextMenuGroupLabel` for a heading.
 *
 * @since 0.3.0
 */
export type ContextMenuGroupProps = React.ComponentProps<
  typeof ContextMenu.Group
>;
const ContextMenuGroup = ContextMenu.Group;

// ---- CONTEXT MENU GROUP LABEL -----------------------------------------------

/**
 * Label rendered above a group. Presentational only (not focusable).
 *
 * @since 0.3.0
 */
export type ContextMenuGroupLabelProps = React.ComponentProps<
  typeof ContextMenu.GroupLabel
> & {
  inset?: boolean;
};
function ContextMenuGroupLabel({
  className,
  inset,
  ...props
}: ContextMenuGroupLabelProps) {
  return (
    <ContextMenu.GroupLabel
      data-slot="context-menu-group-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}
ContextMenuGroupLabel.displayName = "ContextMenuGroupLabel";

// ---- CONTEXT MENU SEPARATOR -------------------------------------------------

/**
 * Thin horizontal divider between groups or items.
 *
 * @since 0.3.0
 */
export type ContextMenuSeparatorProps = React.ComponentProps<
  typeof ContextMenu.Separator
>;
function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps) {
  return (
    <ContextMenu.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
ContextMenuSeparator.displayName = "ContextMenuSeparator";

// ---- CONTEXT MENU SUBMENU ROOT ----------------------------------------------

/**
 * Wrapper for a nested submenu. Must be placed inside a parent
 * `ContextMenuPopup`.
 *
 * @since 0.3.0
 */
export type ContextMenuSubmenuRootProps = React.ComponentProps<
  typeof ContextMenu.SubmenuRoot
>;
const ContextMenuSubmenuRoot = ContextMenu.SubmenuRoot;

// ---- CONTEXT MENU SUBMENU TRIGGER -------------------------------------------

/**
 * Menu item that opens a nested submenu on hover or Arrow-right.
 *
 * **Data attributes** — `data-popup-open`, `data-highlighted`,
 * `data-disabled`.
 *
 * @since 0.3.0
 */
export type ContextMenuSubmenuTriggerProps = React.ComponentProps<
  typeof ContextMenu.SubmenuTrigger
> & {
  inset?: boolean;
};
function ContextMenuSubmenuTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubmenuTriggerProps) {
  return (
    <ContextMenu.SubmenuTrigger
      data-slot="context-menu-submenu-trigger"
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
    </ContextMenu.SubmenuTrigger>
  );
}
ContextMenuSubmenuTrigger.displayName = "ContextMenuSubmenuTrigger";

// ---- CONTEXT MENU SHORTCUT --------------------------------------------------

/**
 * Right-aligned keyboard-shortcut hint (e.g. `ΓîÿC`). Presentational only.
 *
 * @since 0.3.0
 */
export type ContextMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
function ContextMenuShortcut({
  className,
  ...props
}: ContextMenuShortcutProps) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
ContextMenuShortcut.displayName = "ContextMenuShortcut";

// ---- EXPORTS ----------------------------------------------------------------

export {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuBackdrop,
  ContextMenuPositioner,
  ContextMenuPopup,
  ContextMenuArrow,
  ContextMenuItem,
  ContextMenuLinkItem,
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
