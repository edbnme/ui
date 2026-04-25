"use client";


/**
 * useFocusTrap
 * @registryDescription Hook to trap focus within a container element for accessibility in modals, dialogs, and sheets.
 */

import { RefObject, useEffect, useRef, useCallback } from "react";

/**
 * Hook to trap focus within a container element
 *
 * Essential for accessibility in modals, dialogs, and sheets.
 * Ensures keyboard navigation stays within the overlay.
 *
 * @param containerRef - Ref to the container element
 * @param isActive - Whether the focus trap is active
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function Dialog({ isOpen, onClose }) {
 *   const dialogRef = useRef<HTMLDivElement>(null);
 *   useFocusTrap(dialogRef, isOpen, {
 *     onEscape: onClose,
 *     autoFocus: true,
 *   });
 *
 *   return (
 *     <div ref={dialogRef}>
 *       Dialog Content
 *     </div>
 *   );
 * }
 * ```
 */

export type FocusTrapOptions = {
  /** Callback when Escape is pressed */
  onEscape?: () => void;
  /** Whether to auto-focus the first focusable element */
  autoFocus?: boolean;
  /** Whether to restore focus on deactivation */
  restoreFocus?: boolean;
  /** Selector for the initial focus element */
  initialFocusSelector?: string;
};

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(", ");

export function useFocusTrap<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  isActive: boolean,
  options: FocusTrapOptions = {}
): void {
  const {
    onEscape,
    autoFocus = true,
    restoreFocus = true,
    initialFocusSelector,
  } = options;

  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter(
      (el) =>
        !el.hasAttribute("disabled") &&
        el.getAttribute("tabindex") !== "-1" &&
        el.offsetParent !== null // Element is visible
    );
  }, [containerRef]);

  // Handle initial focus
  useEffect(() => {
    if (!isActive || !autoFocus) return;

    // Store the previously focused element
    if (restoreFocus) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    }

    // Small delay to ensure container is rendered
    const timer = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      // Try to focus initial focus element
      if (initialFocusSelector) {
        const initialElement =
          containerRef.current.querySelector<HTMLElement>(initialFocusSelector);
        if (initialElement) {
          initialElement.focus();
          return;
        }
      }

      // Focus first focusable element
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        // If no focusable elements, focus the container itself
        containerRef.current.tabIndex = -1;
        containerRef.current.focus();
      }
    });

    return () => cancelAnimationFrame(timer);
  }, [
    isActive,
    autoFocus,
    initialFocusSelector,
    containerRef,
    getFocusableElements,
    restoreFocus,
  ]);

  // Handle focus restoration on deactivation
  useEffect(() => {
    if (isActive || !restoreFocus) return;

    const containerElement = containerRef.current;
    const doc = containerElement?.ownerDocument ?? document;

    return () => {
      // Restore focus when trap is deactivated
      if (
        previousActiveElementRef.current &&
        doc.body.contains(previousActiveElementRef.current)
      ) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isActive, restoreFocus, containerRef]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Escape
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }

      // Handle Tab
      if (event.key === "Tab") {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab
        if (event.shiftKey) {
          const doc = containerRef.current?.ownerDocument ?? document;
          if (doc.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        }
        // Tab
        else {
          const doc = containerRef.current?.ownerDocument ?? document;
          if (doc.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const doc = containerRef.current?.ownerDocument ?? document;
    doc.addEventListener("keydown", handleKeyDown);
    return () => doc.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onEscape, getFocusableElements, containerRef]);

  // Prevent focus from leaving the container
  useEffect(() => {
    if (!isActive) return;

    const handleFocusIn = (event: FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Focus escaped, bring it back
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else if (containerRef.current) {
          containerRef.current.focus();
        }
      }
    };

    const doc = containerRef.current?.ownerDocument ?? document;
    doc.addEventListener("focusin", handleFocusIn);
    return () => doc.removeEventListener("focusin", handleFocusIn);
  }, [isActive, containerRef, getFocusableElements]);
}

export default useFocusTrap;
