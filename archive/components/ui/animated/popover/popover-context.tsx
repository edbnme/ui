"use client";

import * as React from "react";
import { createContext, useContext } from "react";
import { type Transition, type Variants } from "motion/react";
import { createMorphingPopoverVariants } from "@/lib/animations";

// ---- TYPES ------------------------------------------------------------------

/**
 * Context value for Popover state management
 */
export interface PopoverContextValue {
  /** Whether the popover is open */
  isOpen: boolean;
  /** Set the open state */
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** Open the popover */
  open: () => void;
  /** Close the popover */
  close: () => void;
  /** Toggle the popover */
  toggle: () => void;
  /** Unique ID for ARIA attributes */
  uniqueId: string;
  /** Ref to the trigger element for focus return */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Ref to the content element */
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Whether animations are disabled */
  disableAnimation: boolean;
  /** Custom animation variants */
  variants: Variants;
}

// ---- CONTEXT ----------------------------------------------------------------

export const PopoverContext = createContext<PopoverContextValue | null>(null);

/**
 * Hook to access Popover context
 * @param componentName - Name of the component using this hook (for error messages)
 * @throws Error if used outside Popover
 */
export function usePopover(
  componentName = "PopoverTrigger"
): PopoverContextValue {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error(`${componentName} must be used within <Popover>`);
  }
  return context;
}

// ---- SPRING PRESETS FOR POPOVER ---------------------------------------------

export const popoverTransition: Transition = {
  type: "spring" as const,
  bounce: 0.15,
  duration: 0.45,
};

export const DEFAULT_VARIANTS: Variants = createMorphingPopoverVariants();
