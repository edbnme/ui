/**
 * Navigation Menu - Horizontal navigation with dropdown content panels.
 * Built on `@base-ui/react` NavigationMenu primitive.
 *
 * A 13-part composition for accessible website navigation. The wrapper maps
 * directly to Base UI's `NavigationMenu.*` parts under the `NavMenu*` prefix,
 * preserving the upstream `render`, `style`, functional `className`, refs,
 * controlled state, portal, positioner, and `keepMounted` APIs.
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
 * Data attributes: `data-popup-open`, `data-pressed`, `data-open`,
 * `data-closed`, `data-starting-style`, `data-ending-style`,
 * `data-activation-direction`, `data-active`, `data-side`, `data-align`,
 * `data-anchor-hidden`, `data-instant`, `data-uncentered`.
 *
 * CSS variables: `--anchor-height`, `--anchor-width`, `--available-height`,
 * `--available-width`, `--positioner-height`, `--positioner-width`,
 * `--popup-height`, `--popup-width`, `--transform-origin`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui - https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/navigation-menu
 * @upstream   Base UI v1.5.0 - https://base-ui.com/react/components/navigation-menu
 * @registryDescription Horizontal navigation menu with dropdown content panels and links.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ClassNameProp<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

function mergeClassName<State>(
  ...inputs: [...base: string[], className: ClassNameProp<State>]
) {
  const className = inputs[inputs.length - 1] as ClassNameProp<State>;
  const base = inputs.slice(0, -1) as string[];

  if (typeof className === "function") {
    return (state: State) => cn(...base, className(state));
  }

  return cn(...base, className);
}

// ---- ROOT -------------------------------------------------------------------

export type NavMenuRootProps<Value = unknown> =
  NavigationMenu.Root.Props<Value>;

type NavMenuRootComponent = (<Value = unknown>(
  props: NavMenuRootProps<Value>
) => React.ReactElement | null) & {
  displayName?: string;
};

/**
 * Stateful root. Renders a `<nav>` landmark at the top level, or a `<div>`
 * when nested inside another navigation menu.
 *
 * @since 0.1.0
 */
const NavMenuRoot = React.forwardRef(function NavMenuRoot<Value = unknown>(
  { className, ...props }: NavMenuRootProps<Value>,
  ref: React.ForwardedRef<HTMLElement>
) {
  return (
    <NavigationMenu.Root
      ref={ref}
      data-slot="nav-menu-root"
      className={mergeClassName<NavigationMenu.Root.State>(
        "relative z-10 flex w-full max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    />
  );
}) as NavMenuRootComponent;
NavMenuRoot.displayName = "NavMenuRoot";

// ---- LIST -------------------------------------------------------------------

export type NavMenuListProps = NavigationMenu.List.Props;

/**
 * Horizontal or vertical list of top-level navigation items. Renders a `<ul>`.
 *
 * @since 0.1.0
 */
const NavMenuList = React.forwardRef<HTMLUListElement, NavMenuListProps>(
  function NavMenuList({ className, ...props }, ref) {
    return (
      <NavigationMenu.List
        ref={ref}
        data-slot="nav-menu-list"
        className={mergeClassName<NavigationMenu.List.State>(
          "group flex flex-1 list-none items-center justify-center gap-1 p-1",
          className
        )}
        {...props}
      />
    );
  }
);
NavMenuList.displayName = "NavMenuList";

// ---- ITEM -------------------------------------------------------------------

export type NavMenuItemProps = NavigationMenu.Item.Props;

/**
 * Top-level navigation item. Use `value` when controlling the root value.
 *
 * @since 0.1.0
 */
const NavMenuItem = React.forwardRef<HTMLLIElement, NavMenuItemProps>(
  function NavMenuItem({ className, ...props }, ref) {
    return (
      <NavigationMenu.Item
        ref={ref}
        data-slot="nav-menu-item"
        className={mergeClassName<NavigationMenu.Item.State>("", className)}
        {...props}
      />
    );
  }
);
NavMenuItem.displayName = "NavMenuItem";

// ---- TRIGGER ----------------------------------------------------------------

export type NavMenuTriggerProps = NavigationMenu.Trigger.Props;

/**
 * Button that opens an item's content panel on hover, click, or keyboard
 * activation. Supports Base UI's `nativeButton` and `render` props.
 *
 * @since 0.1.0
 */
const NavMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavMenuTriggerProps
>(function NavMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NavigationMenu.Trigger
      ref={ref}
      data-slot="nav-menu-trigger"
      className={mergeClassName<NavigationMenu.Trigger.State>(
        "group inline-flex h-9 w-max items-center justify-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-foreground/80",
        "transition-[background-color,color,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-accent/80 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-popup-open:bg-accent data-popup-open:text-foreground data-popup-open:shadow-xs",
        "active:scale-[0.98] motion-reduce:active:scale-100",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenu.Trigger>
  );
});
NavMenuTrigger.displayName = "NavMenuTrigger";

// ---- ICON -------------------------------------------------------------------

export type NavMenuIconProps = NavigationMenu.Icon.Props;

/**
 * Caret indicator that rotates when the owning trigger is open.
 *
 * @since 0.1.0
 */
const NavMenuIcon = React.forwardRef<HTMLSpanElement, NavMenuIconProps>(
  function NavMenuIcon({ className, children, ...props }, ref) {
    return (
      <NavigationMenu.Icon
        ref={ref}
        data-slot="nav-menu-icon"
        className={mergeClassName<NavigationMenu.Icon.State>(
          "flex size-3.5 items-center justify-center text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
          "data-popup-open:rotate-180 data-popup-open:text-foreground",
          className
        )}
        {...props}
      >
        {children ?? (
          <CaretDown aria-hidden className="size-3.5" weight="bold" />
        )}
      </NavigationMenu.Icon>
    );
  }
);
NavMenuIcon.displayName = "NavMenuIcon";

// ---- CONTENT ----------------------------------------------------------------

export type NavMenuContentProps = NavigationMenu.Content.Props;

/**
 * Content for the active item. Pass `keepMounted` for SSR-visible links.
 *
 * @since 0.1.0
 */
const NavMenuContent = React.forwardRef<HTMLDivElement, NavMenuContentProps>(
  function NavMenuContent({ className, ...props }, ref) {
    return (
      <NavigationMenu.Content
        ref={ref}
        data-slot="nav-menu-content"
        className={mergeClassName<NavigationMenu.Content.State>(
          "box-border h-full w-[min(var(--available-width,calc(100vw-2rem)),42rem)] max-h-(--available-height) overflow-y-auto p-2.5",
          "transition-opacity duration-100 ease-out motion-reduce:transition-none",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
          className
        )}
        {...props}
      />
    );
  }
);
NavMenuContent.displayName = "NavMenuContent";

// ---- LINK -------------------------------------------------------------------

export type NavMenuLinkProps = NavigationMenu.Link.Props;

/**
 * Navigation link inside a menu panel. Use `active` for current-page styling
 * and `closeOnClick` to dismiss the menu after navigation.
 *
 * @since 0.1.0
 */
const NavMenuLink = React.forwardRef<HTMLAnchorElement, NavMenuLinkProps>(
  function NavMenuLink({ className, ...props }, ref) {
    return (
      <NavigationMenu.Link
        ref={ref}
        data-slot="nav-menu-link"
        className={mergeClassName<NavigationMenu.Link.State>(
          "block select-none rounded-[8px] p-3 text-left leading-none no-underline outline-none",
          "transition-[background-color,color,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring",
          "data-active:bg-accent data-active:text-accent-foreground",
          "active:scale-[0.99] motion-reduce:active:scale-100",
          className
        )}
        {...props}
      />
    );
  }
);
NavMenuLink.displayName = "NavMenuLink";

// ---- PORTAL -----------------------------------------------------------------

export type NavMenuPortalProps = NavigationMenu.Portal.Props;

/**
 * Portal container. Defaults to `document.body`; pass `container` to keep the
 * popup inside a specific preview or app shell.
 *
 * @since 0.1.0
 */
const NavMenuPortal = React.forwardRef<HTMLDivElement, NavMenuPortalProps>(
  function NavMenuPortal({ className, ...props }, ref) {
    return (
      <NavigationMenu.Portal
        ref={ref}
        data-slot="nav-menu-portal"
        className={mergeClassName<NavigationMenu.Portal.State>("", className)}
        {...props}
      />
    );
  }
);
NavMenuPortal.displayName = "NavMenuPortal";

// ---- BACKDROP ---------------------------------------------------------------

export type NavMenuBackdropProps = NavigationMenu.Backdrop.Props;

/**
 * Optional backdrop behind the popup.
 *
 * @since 0.1.0
 */
const NavMenuBackdrop = React.forwardRef<
  HTMLDivElement,
  NavMenuBackdropProps
>(function NavMenuBackdrop({ className, ...props }, ref) {
  return (
    <NavigationMenu.Backdrop
      ref={ref}
      data-slot="nav-menu-backdrop"
      className={mergeClassName<NavigationMenu.Backdrop.State>(
        "fixed inset-0 z-40 bg-background/25 backdrop-blur-[2px]",
        "transition-opacity duration-150 ease-out",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    />
  );
});
NavMenuBackdrop.displayName = "NavMenuBackdrop";

// ---- POSITIONER -------------------------------------------------------------

export type NavMenuPositionerProps = NavigationMenu.Positioner.Props;

/**
 * Floating UI positioner. Supports `side`, `align`, `sideOffset`,
 * `collisionPadding`, `collisionAvoidance`, and anchor overrides.
 *
 * @since 0.1.0
 */
const NavMenuPositioner = React.forwardRef<
  HTMLDivElement,
  NavMenuPositionerProps
>(function NavMenuPositioner(
  { className, sideOffset = 10, collisionPadding = 16, ...props },
  ref
) {
  return (
    <NavigationMenu.Positioner
      ref={ref}
      data-slot="nav-menu-positioner"
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={mergeClassName<NavigationMenu.Positioner.State>(
        "relative z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) outline-none",
        "before:absolute before:content-[''] data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:-top-2 data-[side=bottom]:before:h-2",
        "data-[side=top]:before:inset-x-0 data-[side=top]:before:-bottom-2 data-[side=top]:before:h-2",
        "data-[side=left]:before:inset-y-0 data-[side=left]:before:-right-2 data-[side=left]:before:w-2",
        "data-[side=right]:before:inset-y-0 data-[side=right]:before:-left-2 data-[side=right]:before:w-2",
        className
      )}
      {...props}
    />
  );
});
NavMenuPositioner.displayName = "NavMenuPositioner";

// ---- POPUP ------------------------------------------------------------------

export type NavMenuPopupProps = NavigationMenu.Popup.Props;

/**
 * Popup surface. Width and height are driven by Base UI's current
 * `--popup-width` and `--popup-height` variables.
 *
 * @since 0.1.0
 */
const NavMenuPopup = React.forwardRef<HTMLElement, NavMenuPopupProps>(
  function NavMenuPopup({ className, ...props }, ref) {
    return (
      <NavigationMenu.Popup
        ref={ref}
        data-slot="nav-menu-popup"
        className={mergeClassName<NavigationMenu.Popup.State>(
          "relative h-(--popup-height) w-(--popup-width) max-w-[var(--available-width,calc(100vw-2rem))] overflow-visible rounded-lg border border-border/70 bg-popover/95 text-popover-foreground shadow-2xl backdrop-blur-xl outline-none",
          "transition-opacity duration-100 ease-out motion-reduce:transition-none",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
          className
        )}
        {...props}
      />
    );
  }
);
NavMenuPopup.displayName = "NavMenuPopup";

// ---- ARROW ------------------------------------------------------------------

export type NavMenuArrowProps = NavigationMenu.Arrow.Props;

/**
 * Optional anchor pointer. Pass children for a custom arrow.
 *
 * @since 0.1.0
 */
const NavMenuArrow = React.forwardRef<HTMLDivElement, NavMenuArrowProps>(
  function NavMenuArrow({ className, children, ...props }, ref) {
    return (
      <NavigationMenu.Arrow
        ref={ref}
        data-slot="nav-menu-arrow"
        className={mergeClassName<NavigationMenu.Arrow.State>(
          "pointer-events-none -z-10 flex size-3 items-center justify-center",
          className
        )}
        {...props}
      >
        {children ?? (
          <span
            data-slot="nav-menu-arrow-tip"
            className="block size-3 rotate-45 rounded-[3px] border-t border-l border-border/70 bg-popover"
          />
        )}
      </NavigationMenu.Arrow>
    );
  }
);
NavMenuArrow.displayName = "NavMenuArrow";

// ---- VIEWPORT ---------------------------------------------------------------

export type NavMenuViewportProps = NavigationMenu.Viewport.Props;

/**
 * Clipping viewport for the active content.
 *
 * @since 0.1.0
 */
const NavMenuViewport = React.forwardRef<HTMLDivElement, NavMenuViewportProps>(
  function NavMenuViewport({ className, ...props }, ref) {
    return (
      <NavigationMenu.Viewport
        ref={ref}
        data-slot="nav-menu-viewport"
        className={mergeClassName<NavigationMenu.Viewport.State>(
          "relative h-full w-full overflow-hidden rounded-[inherit]",
          className
        )}
        {...props}
      />
    );
  }
);
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
