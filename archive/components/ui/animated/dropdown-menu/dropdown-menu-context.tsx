/**
 * DropdownMenuContext — Shared context, types, and hook for the DropdownMenu component tree.
 * @module dropdown-menu/dropdown-menu-context
 */
"use client";

import { createContext, useContext } from "react";
import type { Transition, Variants } from "motion/react";

// ---- TYPES ------------------------------------------------------------------

/**
 * Context value for DropdownMenu state management
 */
export interface DropdownMenuContextValue {
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Unique ID for ARIA attributes */
  uniqueId: string;
  /** Whether animations are disabled */
  disableAnimation: boolean;
  /** Custom animation variants */
  variants: Variants;
  /** Spring transition for items */
  itemTransition: Transition;
}

// ---- CONTEXT ----------------------------------------------------------------

export const DropdownMenuContext =
  createContext<DropdownMenuContextValue | null>(null);

/**
 * Hook to access DropdownMenu context
 * @param componentName - Name of the component using this hook (for error messages)
 * @throws Error if used outside DropdownMenu
 */
export function useDropdownMenu(
  componentName = "DropdownMenuItem"
): DropdownMenuContextValue {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      `${componentName} must be used within <DropdownMenu>. ` +
        "Wrap your component tree with <DropdownMenu>"
    );
  }
  return context;
}
