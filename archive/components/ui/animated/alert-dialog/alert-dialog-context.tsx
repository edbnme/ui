"use client";

import * as React from "react";
import { createContext, useContext, useSyncExternalStore } from "react";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Context value for AlertDialog state management
 */
export interface AlertDialogContextValue {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Set the open state */
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** Unique ID for ARIA attributes */
  uniqueId: string;
  /** Ref to the trigger element for focus return */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Ref to the content element */
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Whether animations are disabled */
  disableAnimation: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

export const AlertDialogContext = createContext<AlertDialogContextValue | null>(
  null
);

/**
 * Hook to access AlertDialog context
 * @throws Error if used outside AlertDialog
 */
export function useAlertDialog(): AlertDialogContextValue {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      "useAlertDialog must be used within <AlertDialog>. " +
        "Wrap your component tree with <AlertDialog>"
    );
  }
  return context;
}

// =============================================================================
// SPRING PRESETS FOR DIALOG
// =============================================================================

export const dialogSprings = {
  /** Morphing animation between trigger and content */
  morph: {
    type: "spring" as const,
    bounce: 0,
    duration: 0.5,
  },
  /** Content fade in after morph */
  content: {
    duration: 0.25,
    delay: 0.15,
    ease: [0.32, 0.72, 0, 1] as const,
  },
  /** Backdrop fade */
  backdrop: {
    duration: 0.25,
    ease: "easeOut" as const,
  },
  /** Delay for content fade effects */
  contentFadeDelay: 0.15,
} as const;

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * SSR-safe check for client-side rendering
 * Uses useSyncExternalStore for React 19 compliance
 */
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );
}

// =============================================================================
// BODY SCROLL LOCK
// =============================================================================

export function lockBodyScroll(doc: Document) {
  const body = doc.body;
  const previousOverflow = body.style.overflow;
  body.style.overflow = "hidden";
  return () => {
    body.style.overflow = previousOverflow;
  };
}
