/**
 * Sidebar Context — Internal state, constants, and the `useSidebar` hook
 * for the sidebar system.
 *
 * Separated from `sidebar.tsx` so sub-modules (`sidebar-group`,
 * `sidebar-menu`, etc.) can consume the context without creating a
 * circular import with the provider.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/sidebar
 * @registryPartOf sidebar
 */

"use client";

import * as React from "react";

// ---- CONSTANTS --------------------------------------------------------------

export const SIDEBAR_COOKIE_NAME = "sidebar_state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// ---- CONTEXT ----------------------------------------------------------------

export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export const SidebarContext = React.createContext<SidebarContextProps | null>(
  null
);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within <SidebarProvider>.");
  }
  return context;
}
