/**
 * Alert Dialog Component - Root, Trigger, and Container
 *
 * A modal dialog for important interactions that require acknowledgement.
 * Features morphing animations, focus management, and full accessibility.
 *
 * Based on WAI-ARIA Alert Dialog pattern.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 */

"use client";

import * as React from "react";
import { useCallback, useMemo, useRef, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  type Transition,
} from "motion/react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import { springPresets } from "@/lib/animations";
import { useShouldDisableAnimation } from "@/components/motion-provider";
import { useStableId } from "@/hooks/use-stable-id";
import { useControllableBoolean } from "@/hooks/use-controllable-state";

import {
  AlertDialogContext,
  type AlertDialogContextValue,
  useAlertDialog,
  dialogSprings,
  useIsMounted,
} from "./alert-dialog-context";

// =============================================================================
// ALERT DIALOG ROOT
// =============================================================================

/**
 * AlertDialogRoot props
 */
export interface AlertDialogRootProps {
  /** Child components */
  children: ReactNode;
  /** Custom transition for animations */
  transition?: Transition;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Disable all animations */
  disableAnimation?: boolean;
}

/**
 * AlertDialog - Container component that manages dialog state
 *
 * Provides context for all child components and handles
 * controlled/uncontrolled state management.
 *
 * @example
 * ```tsx
 * <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
 *   <AlertDialogTrigger>Open</AlertDialogTrigger>
 *   <AlertDialogContent>...</AlertDialogContent>
 * </AlertDialog>
 * ```
 */
export function AlertDialogRoot({
  children,
  transition = springPresets.smooth,
  open,
  defaultOpen = false,
  onOpenChange,
  disableAnimation: disableAnimationProp,
}: AlertDialogRootProps) {
  // Controlled/uncontrolled state
  const [isOpen, setIsOpen] = useControllableBoolean({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  // Generate stable IDs
  const uniqueId = useStableId("alert-dialog");

  // Refs for focus management
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animation preference
  const shouldDisableAnimation =
    useShouldDisableAnimation(disableAnimationProp);

  // Memoized context value
  const contextValue = useMemo<AlertDialogContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      uniqueId,
      triggerRef,
      contentRef,
      disableAnimation: shouldDisableAnimation,
      onOpenChange,
    }),
    [isOpen, setIsOpen, uniqueId, shouldDisableAnimation, onOpenChange]
  );

  return (
    <AlertDialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </AlertDialogContext.Provider>
  );
}

AlertDialogRoot.displayName = "AlertDialogRoot";

// =============================================================================
// ALERT DIALOG TRIGGER
// =============================================================================

/**
 * AlertDialogTrigger props
 */
export interface AlertDialogTriggerProps {
  /** Child content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Merge props with child element */
  asChild?: boolean;
}

/**
 * AlertDialogTrigger - Button that opens the dialog
 *
 * Uses layoutId for smooth morphing animation into the dialog.
 * The trigger hides when dialog opens to prevent "button behind dialog" effect.
 */
export function AlertDialogTrigger({
  children,
  className,
  style,
  asChild = false,
}: AlertDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef, disableAnimation } =
    useAlertDialog();

  const handleClick = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(true);
      }
    },
    [setIsOpen]
  );

  // Common ARIA and data attributes
  const commonProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    "aria-haspopup": "dialog" as const,
    "aria-expanded": isOpen,
    "aria-controls": `${uniqueId}-content`,
    "data-slot": "alert-dialog-trigger",
    "data-state": isOpen ? "open" : "closed",
  };

  // asChild pattern - merge props with child
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<
      Record<string, unknown>
    >;

    if (!disableAnimation) {
      return (
        <div
          ref={triggerRef as React.RefObject<HTMLDivElement>}
          className={cn("relative inline-flex", className)}
          style={{
            ...style,
            pointerEvents: isOpen ? "none" : "auto",
          }}
        >
          {/* Morphing background layer - transparent, explicitly no border */}
          <motion.div
            layoutId={`dialog-${uniqueId}`}
            className="absolute inset-0 -z-10 rounded-lg border-0"
            initial={false}
            animate={{
              opacity: isOpen ? 0 : 1,
              borderWidth: 0,
            }}
            transition={dialogSprings.morph}
            style={{
              borderRadius: "inherit",
              backgroundColor: "transparent",
              borderWidth: 0,
              borderStyle: "none",
              boxShadow: "none",
              outline: "none",
            }}
          />
          {/* Child with fade */}
          <motion.div
            className="relative z-10"
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          >
            {React.cloneElement(childElement, commonProps)}
          </motion.div>
        </div>
      );
    }

    // Non-animated asChild - wrap in div for ref capture
    return (
      <div
        ref={triggerRef as React.RefObject<HTMLDivElement>}
        className="contents"
      >
        {React.cloneElement(childElement, commonProps)}
      </div>
    );
  }

  // Default button trigger with morphing
  if (!disableAnimation) {
    return (
      <div
        ref={triggerRef as React.RefObject<HTMLDivElement>}
        className={cn("relative inline-flex cursor-pointer", className)}
        style={{
          ...style,
          pointerEvents: isOpen ? "none" : "auto",
        }}
        role="button"
        tabIndex={isOpen ? -1 : 0}
        {...commonProps}
      >
        {/* Morphing background layer - transparent, explicitly no border */}
        <motion.div
          layoutId={`dialog-${uniqueId}`}
          className="absolute inset-0 -z-10 rounded-lg border-0"
          initial={false}
          animate={{
            opacity: isOpen ? 0 : 1,
            borderWidth: 0,
          }}
          transition={dialogSprings.morph}
          style={{
            backgroundColor: "transparent",
            borderWidth: 0,
            borderStyle: "none",
            boxShadow: "none",
            outline: "none",
          }}
        />
        {/* Static content with fade */}
        <motion.span
          className="relative z-10 inline-flex items-center gap-2"
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.span>
      </div>
    );
  }

  // Non-animated trigger
  return (
    <div
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      className={cn("relative inline-flex cursor-pointer", className)}
      style={style}
      role="button"
      tabIndex={0}
      {...commonProps}
    >
      {children}
    </div>
  );
}

AlertDialogTrigger.displayName = "AlertDialogTrigger";

// =============================================================================
// ALERT DIALOG CONTAINER (PORTAL)
// =============================================================================

/**
 * AlertDialogContainer props
 */
export interface AlertDialogContainerProps {
  /** Child content (typically AlertDialogContent) */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * AlertDialogContainer - Portal wrapper with backdrop
 *
 * Renders content in a portal with backdrop and center positioning.
 * Handles AnimatePresence for enter/exit animations.
 */
export function AlertDialogContainer({ children }: AlertDialogContainerProps) {
  const { isOpen, uniqueId, disableAnimation } = useAlertDialog();
  const mounted = useIsMounted();

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
              data-slot="alert-dialog-backdrop"
            />
          ) : (
            <motion.div
              key={`backdrop-${uniqueId}`}
              className="fixed inset-0 z-100 bg-black/50 backdrop-blur-lg"
              data-slot="alert-dialog-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={dialogSprings.backdrop}
            />
          )}

          {/* Centered container - z-101 above backdrop, pointer-events-none to allow clicks through */}
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none">
            {children}
          </div>
        </MotionConfig>
      )}
    </AnimatePresence>,
    document.body
  );
}

AlertDialogContainer.displayName = "AlertDialogContainer";
