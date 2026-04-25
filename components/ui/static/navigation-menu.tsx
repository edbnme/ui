/**
 * Navigation Menu — Horizontal navigation with dropdown content panels.
 * Built on `@base-ui/react` NavigationMenu primitive.
 *
 * A 13-part composition for building accessible dropdown navigation bars
 * with animated content panels. Semantics map directly to Base UI's
 * `NavigationMenu.*` sub-parts, exposed here under the `NavMenu*` prefix
 * with themed styles. Renders a real `<nav>` at the root for landmark
 * navigation and provides keyboard support (arrow keys, Home/End, Escape)
 * out of the box.
 *
 * Anatomy:
 * ```tsx
 * <NavMenuRoot>
 *   <NavMenuList>
 *     <NavMenuItem>
 *       <NavMenuTrigger>Products<NavMenuIcon /></NavMenuTrigger>
 *       <NavMenuContent>
 *         <NavMenuLink href="/products">All Products</NavMenuLink>
 *       </NavMenuContent>
 *     </NavMenuItem>
 *   </NavMenuList>
 *   <NavMenuPortal>
 *     <NavMenuBackdrop />
 *     <NavMenuPositioner>
 *       <NavMenuPopup>
 *         <NavMenuArrow />
 *         <NavMenuViewport />
 *       </NavMenuPopup>
 *     </NavMenuPositioner>
 *   </NavMenuPortal>
 * </NavMenuRoot>
 * ```
 *
 * Data attributes on trigger: `data-popup-open`, `data-pressed`.
 * Data attributes on popup/backdrop: `data-open`, `data-closed`,
 * `data-starting-style`, `data-ending-style`, `data-side`, `data-instant`.
 * CSS variables exposed on the positioner/popup: `--positioner-height`,
 * `--positioner-width`, `--available-width`, `--popup-height`,
 * `--popup-width`, `--transform-origin`,
 * `--navigation-menu-viewport-height`, `--navigation-menu-viewport-width`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/navigation-menu
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/navigation-menu
 * @registryDescription Horizontal navigation menu with dropdown content panels and links.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { NavigationMenu } from "@base-ui/react/navigation-menu";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type NavMenuRootProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Root
>;

/**
 * Stateful root — renders a `<nav>` landmark and owns the open item.
 * Pass `defaultValue` for uncontrolled or `value` + `onValueChange` for
 * controlled usage. Tune `delay` / `closeDelay` to taste.
 *
 * @since 0.1.0
 */
function NavMenuRoot({ className, ...props }: NavMenuRootProps) {
  return (
    <NavigationMenu.Root
      data-slot="nav-menu-root"
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    />
  );
}
NavMenuRoot.displayName = "NavMenuRoot";

// ---- LIST -------------------------------------------------------------------

export type NavMenuListProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.List
>;

/**
 * The horizontal list of top-level items. Renders a `<ul>`.
 *
 * @since 0.1.0
 */
function NavMenuList({ className, ...props }: NavMenuListProps) {
  return (
    <NavigationMenu.List
      data-slot="nav-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  );
}
NavMenuList.displayName = "NavMenuList";

// ---- ITEM -------------------------------------------------------------------

/**
 * A single top-level item. Direct Base UI re-export — renders a `<li>`.
 *
 * @since 0.1.0
 */
const NavMenuItem = NavigationMenu.Item;

// ---- TRIGGER ----------------------------------------------------------------

export type NavMenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Trigger
>;

/**
 * The clickable/hoverable button that opens an item's content panel.
 * Use the `data-popup-open` attribute for open-state styling.
 *
 * @since 0.1.0
 */
function NavMenuTrigger({
  className,
  children,
  ...props
}: NavMenuTriggerProps) {
  return (
    <NavigationMenu.Trigger
      data-slot="nav-menu-trigger"
      className={cn(
        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium",
        "transition-[colors,transform] duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground focus:outline-none",
        "active:scale-[0.97] motion-reduce:active:scale-100",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-popup-open:bg-accent/50",
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenu.Trigger>
  );
}
NavMenuTrigger.displayName = "NavMenuTrigger";

// ---- ICON -------------------------------------------------------------------

export type NavMenuIconProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Icon
>;

/**
 * Rotating caret that flips when the parent trigger is open. Pair with
 * `NavMenuTrigger`.
 *
 * @since 0.1.0
 */
function NavMenuIcon({ className, ...props }: NavMenuIconProps) {
  return (
    <NavigationMenu.Icon
      data-slot="nav-menu-icon"
      className={cn(
        "relative top-px ml-1 h-3 w-3 transition-transform duration-200 motion-reduce:transition-none",
        "group-data-popup-open:rotate-180",
        className
      )}
      {...props}
    />
  );
}
NavMenuIcon.displayName = "NavMenuIcon";

// ---- CONTENT ----------------------------------------------------------------

export type NavMenuContentProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Content
>;

/**
 * The content panel for an item. Rendered inside the viewport when the
 * matching trigger is active.
 *
 * @since 0.1.0
 */
function NavMenuContent({ className, ...props }: NavMenuContentProps) {
  return (
    <NavigationMenu.Content
      data-slot="nav-menu-content"
      className={cn("left-0 top-0 w-full md:absolute md:w-auto", className)}
      {...props}
    />
  );
}
NavMenuContent.displayName = "NavMenuContent";

// ---- LINK -------------------------------------------------------------------

export type NavMenuLinkProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Link
>;

/**
 * A link inside a content panel. Renders an `<a>` with accessible focus
 * and hover states.
 *
 * @since 0.1.0
 */
function NavMenuLink({ className, ...props }: NavMenuLinkProps) {
  return (
    <NavigationMenu.Link
      data-slot="nav-menu-link"
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:bg-accent focus-visible:text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}
NavMenuLink.displayName = "NavMenuLink";

// ---- PORTAL -----------------------------------------------------------------

/**
 * Teleports the popup subtree to `document.body`. Direct Base UI re-export.
 *
 * @since 0.1.0
 */
const NavMenuPortal = NavigationMenu.Portal;

// ---- BACKDROP ---------------------------------------------------------------

export type NavMenuBackdropProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Backdrop
>;

/**
 * Optional full-screen backdrop behind the popup.
 *
 * @since 0.1.0
 */
function NavMenuBackdrop({ className, ...props }: NavMenuBackdropProps) {
  return (
    <NavigationMenu.Backdrop
      data-slot="nav-menu-backdrop"
      className={cn("fixed inset-0", className)}
      {...props}
    />
  );
}
NavMenuBackdrop.displayName = "NavMenuBackdrop";

// ---- POSITIONER -------------------------------------------------------------

export type NavMenuPositionerProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Positioner
>;

/**
 * Floating-UI-powered positioning wrapper. Use `sideOffset` /
 * `collisionPadding` to tune placement.
 *
 * @since 0.1.0
 */
function NavMenuPositioner({ className, ...props }: NavMenuPositionerProps) {
  return (
    <NavigationMenu.Positioner
      data-slot="nav-menu-positioner"
      className={cn("z-50 outline-none", className)}
      {...props}
    />
  );
}
NavMenuPositioner.displayName = "NavMenuPositioner";

// ---- POPUP ------------------------------------------------------------------

export type NavMenuPopupProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Popup
>;

/**
 * The visible popup surface. Hosts `NavMenuArrow` and `NavMenuViewport`.
 * Animates scale + opacity with automatic motion-reduce fallback.
 *
 * @since 0.1.0
 */
function NavMenuPopup({ className, ...props }: NavMenuPopupProps) {
  return (
    <NavigationMenu.Popup
      data-slot="nav-menu-popup"
      className={cn(
        "left-0 top-0 w-full overflow-hidden transform-gpu rounded-md border border-border bg-popover text-popover-foreground shadow-lg",
        "transition-[scale,opacity] duration-200 motion-reduce:transition-none",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        className
      )}
      {...props}
    />
  );
}
NavMenuPopup.displayName = "NavMenuPopup";

// ---- ARROW ------------------------------------------------------------------

export type NavMenuArrowProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Arrow
>;

/**
 * Small pointer that tracks which trigger is active. Auto-rotates based
 * on `data-side`.
 *
 * @since 0.1.0
 */
function NavMenuArrow({ className, ...props }: NavMenuArrowProps) {
  return (
    <NavigationMenu.Arrow
      data-slot="nav-menu-arrow"
      className={cn(
        "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border",
        className
      )}
      {...props}
    />
  );
}
NavMenuArrow.displayName = "NavMenuArrow";

// ---- VIEWPORT ---------------------------------------------------------------

export type NavMenuViewportProps = React.ComponentPropsWithoutRef<
  typeof NavigationMenu.Viewport
>;

/**
 * The animated sizing viewport inside the popup. Its width and height
 * are driven by the CSS variables `--navigation-menu-viewport-width`
 * and `--navigation-menu-viewport-height`.
 *
 * @since 0.1.0
 */
function NavMenuViewport({ className, ...props }: NavMenuViewportProps) {
  return (
    <NavigationMenu.Viewport
      data-slot="nav-menu-viewport"
      className={cn(
        "h-(--navigation-menu-viewport-height) w-full md:w-(--navigation-menu-viewport-width)",
        "origin-top-center relative overflow-hidden",
        className
      )}
      {...props}
    />
  );
}
NavMenuViewport.displayName = "NavMenuViewport";

// ---- EXPORTS ----------------------------------------------------------------

export {
  NavMenuRoot,
  NavMenuList,
  NavMenuItem,
  NavMenuTrigger,
  NavMenuIcon,
  NavMenuContent,
  NavMenuLink,
  NavMenuPortal,
  NavMenuBackdrop,
  NavMenuPositioner,
  NavMenuPopup,
  NavMenuArrow,
  NavMenuViewport,
};
