"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import useClickOutside from "@/hooks/use-click-outside";
import { usePopover } from "./popover-context";

// =============================================================================
// POPOVER CONTENT
// =============================================================================

/**
 * PopoverContent props
 */
export interface PopoverContentProps {
  /** Child content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Close on Escape key (default: true) */
  closeOnEscape?: boolean;
  /** Close on click outside (default: true) */
  closeOnClickOutside?: boolean;
}

/**
 * PopoverContent - Main popover panel
 *
 * Contains the popover content with morphing animation.
 * Handles focus trapping and keyboard interactions.
 */
export function PopoverContent({
  children,
  className,
  style,
  closeOnEscape = true,
  closeOnClickOutside = true,
}: PopoverContentProps) {
  const { isOpen, close, uniqueId, contentRef, disableAnimation, variants } =
    usePopover("PopoverContent");

  // Focus trap refs
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  // Handle click outside
  useClickOutside(contentRef, () => {
    if (closeOnClickOutside) {
      close();
    }
  });

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key handling
      if (event.key === "Escape" && closeOnEscape) {
        close();
        event.preventDefault();
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
  }, [isOpen, close, closeOnEscape, contentRef]);

  // Initial focus management
  useEffect(() => {
    if (!isOpen) return;

    const contentElement = contentRef.current;
    if (!contentElement) return;

    // Find focusable elements
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements =
      contentElement.querySelectorAll(focusableSelector);

    if (focusableElements.length > 0) {
      firstFocusableRef.current = focusableElements[0] as HTMLElement;
      lastFocusableRef.current = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      // Focus first element after animation
      requestAnimationFrame(() => {
        (focusableElements[0] as HTMLElement).focus();
      });
    }
  }, [isOpen, contentRef]);

  // Content styles
  const contentClasses = cn(
    "absolute z-[100]",
    "min-w-[300px] max-w-[95vw]",
    "overflow-hidden rounded-2xl",
    "border border-border",
    "bg-background",
    "shadow-2xl shadow-black/20 dark:shadow-black/50",
    "outline-none focus:outline-none",
    className
  );

  // Animated version with morphing
  return (
    <AnimatePresence mode="wait">
      {isOpen &&
        (disableAnimation ? (
          <div
            ref={contentRef}
            className={contentClasses}
            style={{
              ...style,
              isolation: "isolate",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`popover-title-${uniqueId}`}
            aria-describedby={`popover-description-${uniqueId}`}
            id={`popover-content-${uniqueId}`}
            data-slot="popover-content"
            data-state="open"
          >
            {children}
          </div>
        ) : (
          <motion.div
            ref={contentRef}
            layoutId={`popover-trigger-${uniqueId}`}
            className={contentClasses}
            style={{
              ...style,
              isolation: "isolate",
              willChange: "transform, opacity",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`popover-title-${uniqueId}`}
            aria-describedby={`popover-description-${uniqueId}`}
            id={`popover-content-${uniqueId}`}
            data-slot="popover-content"
            data-state="open"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
          >
            {children}
          </motion.div>
        ))}
    </AnimatePresence>
  );
}

PopoverContent.displayName = "PopoverContent";
