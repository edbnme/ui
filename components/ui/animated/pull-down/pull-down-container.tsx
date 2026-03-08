/**
 * PullDownContainer — Animated container that morphs from the trigger dimensions.
 * Handles layout measurement, blur transitions, and spring sizing.
 * @module pull-down/pull-down-container
 */
"use client";

import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  useLayoutEffect,
  type MouseEvent,
} from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

import {
  type PullDownContainerProps,
  usePullDownContext,
  useReducedMotion,
} from "./pull-down-context";
import {
  REDUCED_MOTION_SPRING,
  getPositionStyles,
  getTransformOrigin,
  getAnimationOffset,
  getAnchorOffset,
} from "./pull-down-utils";

// =============================================================================
// CONTAINER COMPONENT
// =============================================================================

export const Container = forwardRef<HTMLDivElement, PullDownContainerProps>(
  function PullDownContainer(
    {
      children,
      buttonSize = 40,
      menuWidth = 200,
      menuRadius = 24,
      buttonRadius,
      className,
      style,
    },
    ref
  ) {
    const {
      open,
      setOpen,
      direction,
      anchor,
      activeSubmenu,
      isSubmenuClosing,
      visualDuration,
      bounce,
      disableAnimation,
    } = usePullDownContext("PullDownContainer");

    const prefersReducedMotion = useReducedMotion();
    const internalRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);

    const buttonWidth =
      typeof buttonSize === "number" ? buttonSize : buttonSize.width;
    const buttonHeight =
      typeof buttonSize === "number" ? buttonSize : buttonSize.height;
    const [measuredHeight, setMeasuredHeight] = useState<number>(buttonHeight);

    // Use centralized submenu closing state from context
    // Submenu styles should remain active during close animation
    const submenuStylesActive = activeSubmenu !== null || isSubmenuClosing;

    const shouldAnimate = !disableAnimation && !prefersReducedMotion;
    const springConfig: Transition = shouldAnimate
      ? { type: "spring" as const, visualDuration, bounce }
      : { type: "spring" as const, ...REDUCED_MOTION_SPRING };

    useLayoutEffect(() => {
      if (open && measureRef.current) {
        const height = measureRef.current.offsetHeight;
        setMeasuredHeight(height);
      }
    }, [open]);

    const handleClick = useCallback(
      (event: MouseEvent) => {
        if (!open) {
          event.preventDefault();
          setOpen(true);
        }
      },
      [open, setOpen]
    );

    const closedRadius =
      buttonRadius ?? Math.min(buttonWidth, buttonHeight) / 2;
    const positionStyles = getPositionStyles(direction);
    const transformOrigin = getTransformOrigin(direction, anchor);
    const liftAmount = buttonHeight * 0.75;
    const directionOffset = getAnimationOffset(direction, liftAmount);
    const anchorOffset = getAnchorOffset(
      direction,
      anchor,
      menuWidth,
      measuredHeight,
      buttonWidth,
      buttonHeight
    );

    const openOffset = {
      x: (directionOffset.x || 0) + anchorOffset.x,
      y: (directionOffset.y || 0) + anchorOffset.y,
    };

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: buttonWidth,
          height: buttonHeight,
        }}
      >
        <motion.div
          ref={internalRef}
          onClick={handleClick}
          initial={false}
          animate={{
            width: open ? menuWidth : buttonWidth,
            height: open ? measuredHeight : buttonHeight,
            borderRadius: open ? menuRadius : closedRadius,
            x: open ? openOffset.x : 0,
            y: open ? openOffset.y : 0,
            scale: submenuStylesActive ? 0.96 : 1,
            boxShadow: open
              ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
              : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          }}
          transition={springConfig}
          className={cn(
            "bg-popover text-popover-foreground ring-1 ring-border/50",
            className
          )}
          style={{
            ...positionStyles,
            overflow: submenuStylesActive ? "visible" : "hidden",
            cursor: open ? "default" : "pointer",
            transformOrigin: submenuStylesActive
              ? "center center"
              : transformOrigin,
            zIndex: open ? 50 : "auto",
            willChange: "transform",
            ...style,
          }}
        >
          <div ref={measureRef}>{children}</div>
        </motion.div>
      </div>
    );
  }
);

Container.displayName = "PullDownContainer";
