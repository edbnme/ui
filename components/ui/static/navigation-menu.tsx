/**
 * Navigation Menu — Horizontal navigation with dropdown content panels.
 * Built on @base-ui/react NavigationMenu primitive.
 *
 * @example
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
 *     <NavMenuPositioner>
 *       <NavMenuPopup>
 *         <NavMenuViewport />
 *       </NavMenuPopup>
 *     </NavMenuPositioner>
 *   </NavMenuPortal>
 * </NavMenuRoot>
 *
 * @see https://base-ui.com/react/components/navigation-menu
 */
"use client";

import * as React from "react";
import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { cn } from "@/lib/utils";

// =============================================================================
// NAV MENU ROOT
// =============================================================================

const NavMenuRoot = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Root>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  />
));
NavMenuRoot.displayName = "NavMenuRoot";

// =============================================================================
// NAV MENU LIST
// =============================================================================

const NavMenuList = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.List>
>(({ className, ...props }, ref) => (
  <NavigationMenu.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className
    )}
    {...props}
  />
));
NavMenuList.displayName = "NavMenuList";

// =============================================================================
// NAV MENU ITEM
// =============================================================================

const NavMenuItem = NavigationMenu.Item;

// =============================================================================
// NAV MENU TRIGGER
// =============================================================================

const NavMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenu.Trigger
    ref={ref}
    className={cn(
      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=open]:bg-accent/50",
      className
    )}
    {...props}
  >
    {children}
  </NavigationMenu.Trigger>
));
NavMenuTrigger.displayName = "NavMenuTrigger";

// =============================================================================
// NAV MENU ICON
// =============================================================================

const NavMenuIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Icon>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Icon
    ref={ref}
    className={cn(
      "relative top-px ml-1 h-3 w-3 transition-transform duration-200",
      "group-data-[state=open]:rotate-180",
      className
    )}
    {...props}
  />
));
NavMenuIcon.displayName = "NavMenuIcon";

// =============================================================================
// NAV MENU CONTENT
// =============================================================================

const NavMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Content
    ref={ref}
    className={cn("left-0 top-0 w-full md:absolute md:w-auto", className)}
    {...props}
  />
));
NavMenuContent.displayName = "NavMenuContent";

// =============================================================================
// NAV MENU LINK
// =============================================================================

const NavMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Link
    ref={ref}
    className={cn(
      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  />
));
NavMenuLink.displayName = "NavMenuLink";

// =============================================================================
// NAV MENU PORTAL
// =============================================================================

const NavMenuPortal = NavigationMenu.Portal;

// =============================================================================
// NAV MENU BACKDROP
// =============================================================================

const NavMenuBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Backdrop>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Backdrop
    ref={ref}
    className={cn("fixed inset-0", className)}
    {...props}
  />
));
NavMenuBackdrop.displayName = "NavMenuBackdrop";

// =============================================================================
// NAV MENU POSITIONER
// =============================================================================

const NavMenuPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Positioner>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Positioner
    ref={ref}
    className={cn("z-50 outline-none", className)}
    {...props}
  />
));
NavMenuPositioner.displayName = "NavMenuPositioner";

// =============================================================================
// NAV MENU POPUP
// =============================================================================

const NavMenuPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Popup>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Popup
    ref={ref}
    className={cn(
      "left-0 top-0 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg",
      "transition-[transform,scale,opacity] duration-200",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
NavMenuPopup.displayName = "NavMenuPopup";

// =============================================================================
// NAV MENU ARROW
// =============================================================================

const NavMenuArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Arrow>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Arrow
    ref={ref}
    className={cn(
      "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border",
      className
    )}
    {...props}
  />
));
NavMenuArrow.displayName = "NavMenuArrow";

// =============================================================================
// NAV MENU VIEWPORT
// =============================================================================

const NavMenuViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof NavigationMenu.Viewport>
>(({ className, ...props }, ref) => (
  <NavigationMenu.Viewport
    ref={ref}
    className={cn(
      "h-(--navigation-menu-viewport-height) w-full md:w-(--navigation-menu-viewport-width)",
      "origin-top-center relative overflow-hidden",
      className
    )}
    {...props}
  />
));
NavMenuViewport.displayName = "NavMenuViewport";

// =============================================================================
// EXPORTS
// =============================================================================

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
