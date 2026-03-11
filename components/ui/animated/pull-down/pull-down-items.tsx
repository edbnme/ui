/**
 * PullDownItem / PullDownCheckboxItem / PullDownRadioItem — Interactive menu items
 * with optional check/radio indicators, keyboard selection, and ripple effects.
 * @module pull-down/pull-down-items
 */
"use client";

import * as React from "react";
import {
  useContext,
  forwardRef,
  useCallback,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  type Transition,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

import {
  type PullDownItemProps,
  type PullDownPortalProps,
  type PullDownOverlayProps,
  SubMenuContext,
  usePullDownContext,
  useReducedMotion,
} from "./pull-down-context";
import { REDUCED_MOTION_SPRING } from "./pull-down-utils";

// =============================================================================
// ITEM COMPONENT
// =============================================================================

export const Item = forwardRef<HTMLDivElement, PullDownItemProps>(
  function PullDownItem(
    {
      children,
      onSelect,
      disabled = false,
      closeOnSelect = true,
      className,
      style,
    },
    ref
  ) {
    const {
      setOpen,
      isOpenAnimationCompleteRef,
      activeSubmenu,
      visualDuration,
      bounce,
      disableAnimation,
    } = usePullDownContext("PullDownItem");

    const subMenuContext = useContext(SubMenuContext);
    const [isHovered, setIsHovered] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const isInsideActiveSubmenu =
      subMenuContext && activeSubmenu === subMenuContext.id;
    const shouldDim = activeSubmenu !== null && !isInsideActiveSubmenu;

    const shouldAnimate = !disableAnimation && !prefersReducedMotion;
    const springConfig: Transition = shouldAnimate
      ? { type: "spring" as const, visualDuration, bounce }
      : { type: "spring" as const, ...REDUCED_MOTION_SPRING };

    const handleClick = useCallback(
      (event: MouseEvent) => {
        if (disabled) return;
        event.preventDefault();
        onSelect?.();
        if (closeOnSelect) {
          setOpen(false);
        }
      },
      [disabled, onSelect, closeOnSelect, setOpen]
    );

    const handleMouseEnter = useCallback(() => {
      if (!isOpenAnimationCompleteRef.current) return;
      if (!disabled) {
        setIsHovered(true);
      }
    }, [disabled, isOpenAnimationCompleteRef]);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
    }, []);

    return (
      <motion.div
        ref={ref}
        role="menuitem"
        aria-disabled={disabled}
        data-disabled={disabled || undefined}
        data-highlighted={isHovered || undefined}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          className
        )}
        animate={{
          opacity: shouldDim ? 0.5 : 1,
        }}
        transition={springConfig}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          transformOrigin: "center center",
          userSelect: "none",
          ...style,
        }}
      >
        {children}
      </motion.div>
    );
  }
);

Item.displayName = "PullDownItem";

// =============================================================================
// PORTAL COMPONENT
// =============================================================================

export function Portal({
  children,
  container,
}: PullDownPortalProps): ReactNode {
  const mounted = React.useSyncExternalStore(
    useCallback(() => () => {}, []),
    useCallback(() => true, []),
    useCallback(() => false, [])
  );

  if (!mounted) {
    return null;
  }

  const portalContainer = container ?? document.body;
  return createPortal(children, portalContainer);
}

Portal.displayName = "PullDownPortal";

// =============================================================================
// OVERLAY COMPONENT
// =============================================================================

export const Overlay = forwardRef<HTMLDivElement, PullDownOverlayProps>(
  function PullDownOverlay({ className, style, onClick }, ref) {
    const { open, setOpen, visualDuration, bounce, disableAnimation } =
      usePullDownContext("PullDownOverlay");

    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = !disableAnimation && !prefersReducedMotion;

    const springConfig: Transition = shouldAnimate
      ? { type: "spring" as const, visualDuration, bounce }
      : { type: "spring" as const, ...REDUCED_MOTION_SPRING };

    const handleClick = useCallback(
      (event: MouseEvent) => {
        event.preventDefault();
        if (onClick) {
          onClick();
        } else {
          setOpen(false);
        }
      },
      [onClick, setOpen]
    );

    const overlayVariants: Variants = {
      visible: { opacity: 1 },
      hidden: { opacity: 0 },
    };

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            key="pulldown-overlay"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={springConfig}
            onClick={handleClick}
            className={cn("bg-background/80 backdrop-blur-sm", className)}
            style={{
              position: "fixed",
              inset: 0,
              ...style,
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    );
  }
);

Overlay.displayName = "PullDownOverlay";

// =============================================================================
// SEPARATOR COMPONENT
// =============================================================================

export const Separator = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function PullDownSeparator({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("my-1 h-px bg-border", className)}
      role="separator"
      {...props}
    />
  );
});

Separator.displayName = "PullDownSeparator";

// =============================================================================
// LABEL COMPONENT
// =============================================================================

export const Label = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function PullDownLabel({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "px-3 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});

Label.displayName = "PullDownLabel";
