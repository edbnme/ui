"use client";

import * as React from "react";
import { useCallback, useMemo, useRef, type ReactNode } from "react";
import {
  motion,
  MotionConfig,
  type Transition,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useShouldDisableAnimation } from "@/components/motion-provider";
import { useStableId } from "@/hooks/use-stable-id";
import { useControllableBoolean } from "@/hooks/use-controllable-state";
import {
  PopoverContext,
  usePopover,
  type PopoverContextValue,
  popoverTransition,
  DEFAULT_VARIANTS,
} from "./popover-context";

// ---- POPOVER ROOT -----------------------------------------------------------

/**
 * PopoverRoot props
 */
export interface PopoverRootProps {
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
  /** Custom animation variants */
  variants?: Variants;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * PopoverRoot - Container component that manages popover state
 *
 * Provides context for all child components and handles
 * controlled/uncontrolled state management.
 *
 * @example
 * ```tsx
 * <Popover open={isOpen} onOpenChange={setIsOpen}>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>...</PopoverContent>
 * </Popover>
 * ```
 */
export function PopoverRoot({
  children,
  transition = popoverTransition,
  open,
  defaultOpen = false,
  onOpenChange,
  disableAnimation: disableAnimationProp,
  variants = DEFAULT_VARIANTS,
  className,
  style,
}: PopoverRootProps) {
  // Controlled/uncontrolled state
  const [isOpen, setIsOpen] = useControllableBoolean({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  // Generate stable IDs
  const uniqueId = useStableId("popover");

  // Refs for focus management
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animation preference
  const shouldDisableAnimation =
    useShouldDisableAnimation(disableAnimationProp);

  // Convenience methods
  const openPopover = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closePopover = useCallback(() => setIsOpen(false), [setIsOpen]);
  const togglePopover = useCallback(
    () => setIsOpen((prev) => !prev),
    [setIsOpen]
  );

  // Memoized context value
  const contextValue = useMemo<PopoverContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      open: openPopover,
      close: closePopover,
      toggle: togglePopover,
      uniqueId,
      triggerRef,
      contentRef,
      disableAnimation: shouldDisableAnimation,
      variants,
    }),
    [
      isOpen,
      setIsOpen,
      openPopover,
      closePopover,
      togglePopover,
      uniqueId,
      shouldDisableAnimation,
      variants,
    ]
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>
        <div
          className={cn("relative flex items-center justify-center", className)}
          style={style}
          data-slot="popover"
          data-state={isOpen ? "open" : "closed"}
        >
          {children}
        </div>
      </MotionConfig>
    </PopoverContext.Provider>
  );
}

PopoverRoot.displayName = "PopoverRoot";

// ---- POPOVER TRIGGER --------------------------------------------------------

/**
 * PopoverTrigger props
 */
export interface PopoverTriggerProps {
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
 * PopoverTrigger - Button that opens the popover
 *
 * Uses layoutId for smooth morphing animation into the popover.
 * The trigger hides when popover opens to create seamless morph effect.
 */
export function PopoverTrigger({
  children,
  className,
  style,
  asChild = false,
}: PopoverTriggerProps) {
  const { open, isOpen, uniqueId, triggerRef, disableAnimation } =
    usePopover("PopoverTrigger");

  const handleClick = useCallback(() => {
    open();
  }, [open]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    },
    [open]
  );

  // Common ARIA and data attributes
  const commonProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    "aria-haspopup": "dialog" as const,
    "aria-expanded": isOpen,
    "aria-controls": `popover-content-${uniqueId}`,
    "data-slot": "popover-trigger",
    "data-state": isOpen ? "open" : "closed",
  };

  // asChild pattern - merge props with child
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<
      Record<string, unknown>
    >;

    if (!disableAnimation) {
      return (
        <motion.div
          layoutId={`popover-trigger-${uniqueId}`}
          className={cn("inline-flex", className)}
          style={{
            ...style,
            opacity: isOpen ? 0 : 1,
            pointerEvents: isOpen ? "none" : "auto",
          }}
        >
          {React.cloneElement(childElement, commonProps)}
        </motion.div>
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
      <motion.button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        layoutId={`popover-trigger-${uniqueId}`}
        className={cn("inline-flex items-center justify-center", className)}
        style={{
          ...style,
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? "none" : "auto",
        }}
        type="button"
        {...commonProps}
      >
        {children}
      </motion.button>
    );
  }

  // Non-animated trigger
  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      className={cn("inline-flex items-center justify-center", className)}
      style={style}
      type="button"
      {...commonProps}
    >
      {children}
    </button>
  );
}

PopoverTrigger.displayName = "PopoverTrigger";

// ---- POPOVER LABEL ----------------------------------------------------------

/**
 * PopoverLabel props
 */
export interface PopoverLabelProps {
  /** Label content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * PopoverLabel - Morphing label that transitions with the popover
 */
export function PopoverLabel({
  children,
  className,
  style,
}: PopoverLabelProps) {
  const { uniqueId, disableAnimation } = usePopover("PopoverLabel");

  if (!disableAnimation) {
    return (
      <motion.span
        layoutId={`popover-label-${uniqueId}`}
        className={cn("inline-flex items-center gap-2", className)}
        style={style}
        data-slot="popover-label"
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      style={style}
      data-slot="popover-label"
    >
      {children}
    </span>
  );
}

PopoverLabel.displayName = "PopoverLabel";
