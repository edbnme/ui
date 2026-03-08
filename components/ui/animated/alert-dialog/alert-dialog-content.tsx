"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import {
  useAlertDialog,
  dialogSprings,
  useIsMounted,
  lockBodyScroll,
} from "./alert-dialog-context";
import { AlertDialogClose } from "./alert-dialog-actions";

// =============================================================================
// ALERT DIALOG CONTENT
// =============================================================================

/**
 * AlertDialogContent props
 */
export interface AlertDialogContentProps {
  /** Child content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Show close button in corner */
  showCloseButton?: boolean;
  /** Callback when close button clicked */
  onCloseButtonClick?: () => void;
  /** Prevent Escape key from closing (default: false for shadcn compatibility) */
  preventEscapeClose?: boolean;
  /** Prevent clicking outside from closing (default: true) */
  preventOutsideClose?: boolean;
  /**
   * When true, only renders the content panel (legacy mode for use with explicit Container).
   * When false (default), includes portal and overlay automatically (shadcn mode).
   */
  standalone?: boolean;
}

/**
 * AlertDialogContent - Main dialog panel with integrated portal and overlay
 *
 * Contains the dialog content with morphing animation.
 * Handles focus trapping and keyboard interactions.
 *
 * In shadcn mode (default), this component includes:
 * - Portal rendering to document.body
 * - Animated backdrop overlay
 * - Centered positioning
 *
 * In standalone mode, it only renders the content panel.
 */
export function AlertDialogContent({
  children,
  className,
  style,
  showCloseButton = false,
  onCloseButtonClick,
  preventEscapeClose = false, // Changed to false for shadcn compatibility
  preventOutsideClose = true,
  standalone = false,
}: AlertDialogContentProps) {
  const {
    setIsOpen,
    isOpen,
    uniqueId,
    triggerRef,
    contentRef,
    disableAnimation,
  } = useAlertDialog();

  const mounted = useIsMounted();

  // Focus trap refs
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key handling
      if (event.key === "Escape" && !preventEscapeClose) {
        setIsOpen(false);
        return;
      }

      // Focus trap with Tab key
      if (event.key === "Tab") {
        const first = firstFocusableRef.current;
        const last = lastFocusableRef.current;

        if (!first || !last) return;

        const doc = contentRef.current?.ownerDocument ?? document;
        if (event.shiftKey) {
          if (doc.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (doc.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    const doc = contentRef.current?.ownerDocument ?? document;
    doc.addEventListener("keydown", handleKeyDown);
    return () => doc.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen, preventEscapeClose, contentRef]);

  // Body scroll lock and initial focus
  useEffect(() => {
    if (!isOpen) return;

    const triggerElement = triggerRef.current;
    const contentElement = contentRef.current;

    // Save original body overflow
    const doc = contentElement?.ownerDocument ?? document;
    const unlockBodyScroll = lockBodyScroll(doc);

    // Find focusable elements
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements =
      contentElement?.querySelectorAll(focusableSelector);

    if (focusableElements && focusableElements.length > 0) {
      firstFocusableRef.current = focusableElements[0] as HTMLElement;
      lastFocusableRef.current = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      // Focus first element after animation
      requestAnimationFrame(() => {
        (focusableElements[0] as HTMLElement).focus();
      });
    }

    return () => {
      unlockBodyScroll();
      triggerElement?.focus();
    };
  }, [isOpen, triggerRef, contentRef]);

  // Handle outside click
  useEffect(() => {
    if (!isOpen || preventOutsideClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Delay to prevent immediate closing
    const doc = contentRef.current?.ownerDocument ?? document;
    const timeoutId = setTimeout(() => {
      doc.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      doc.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen, preventOutsideClose, contentRef]);

  // Content styles
  const contentClasses = cn(
    "relative z-10 pointer-events-auto",
    "overflow-hidden",
    "rounded-2xl sm:rounded-3xl",
    "border border-border",
    "bg-background",
    "shadow-2xl shadow-black/50 dark:shadow-black/80",
    "outline-none focus:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "w-full max-w-[calc(100vw-2rem)] sm:max-w-md",
    // Base padding for consistent spacing
    "p-6 sm:p-8",
    className
  );

  // Content panel component
  const ContentPanel = disableAnimation ? (
    <div
      ref={contentRef}
      className={contentClasses}
      style={style}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={`${uniqueId}-title`}
      aria-describedby={`${uniqueId}-description`}
      id={`${uniqueId}-content`}
      data-slot="alert-dialog-content"
      data-state="open"
    >
      {showCloseButton && <AlertDialogClose onClick={onCloseButtonClick} />}
      {children}
    </div>
  ) : (
    <motion.div
      ref={contentRef}
      layoutId={`dialog-${uniqueId}`}
      className={contentClasses}
      style={{ ...style, borderRadius: 24 }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={`${uniqueId}-title`}
      aria-describedby={`${uniqueId}-description`}
      id={`${uniqueId}-content`}
      data-slot="alert-dialog-content"
      data-state="open"
      initial={false}
      transition={dialogSprings.morph}
    >
      {showCloseButton && <AlertDialogClose onClick={onCloseButtonClick} />}
      {children}
    </motion.div>
  );

  // Standalone mode: just return the content panel (for use with explicit Container)
  if (standalone) {
    return ContentPanel;
  }

  // shadcn mode: include portal and overlay
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false} mode="wait">
      {isOpen && (
        <MotionConfig transition={dialogSprings.morph}>
          {/* Backdrop with blur - z-100 to be above all UI elements */}
          {disableAnimation ? (
            <div
              key={`backdrop-${uniqueId}`}
              className="fixed inset-0 z-100 bg-black/50 backdrop-blur-lg"
              data-slot="alert-dialog-overlay"
            />
          ) : (
            <motion.div
              key={`backdrop-${uniqueId}`}
              className="fixed inset-0 z-100 bg-black/50 backdrop-blur-lg"
              data-slot="alert-dialog-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={dialogSprings.backdrop}
            />
          )}

          {/* Centered container - z-101 above backdrop, pointer-events-none to allow clicks through */}
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none">
            {ContentPanel}
          </div>
        </MotionConfig>
      )}
    </AnimatePresence>,
    document.body
  );
}

AlertDialogContent.displayName = "AlertDialogContent";
