/**
 * PullDownContent — Content panel that renders inside the morphing container.
 * Handles directional navigation, keyboard events, and focus management.
 * @module pull-down/pull-down-content
 */
"use client";

import {
  forwardRef,
  useCallback,
  type MouseEvent,
  type KeyboardEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  type Transition,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

import {
  type PullDownTriggerProps,
  type PullDownContentProps,
  usePullDownContext,
  useReducedMotion,
} from "./pull-down-context";
import { REDUCED_MOTION_SPRING } from "./pull-down-utils";

// =============================================================================
// TRIGGER COMPONENT
// =============================================================================

export const Trigger = forwardRef<HTMLDivElement, PullDownTriggerProps>(
  function PullDownTrigger(
    { children, disabled = false, className, style },
    ref
  ) {
    const {
      open,
      setOpen,
      triggerRef,
      animationConfig,
      visualDuration,
      bounce,
      disableAnimation,
    } = usePullDownContext("PullDownTrigger");

    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = !disableAnimation && !prefersReducedMotion;

    const springConfig: Transition = shouldAnimate
      ? {
          type: "spring" as const,
          visualDuration: visualDuration * 0.85,
          bounce,
        }
      : { type: "spring" as const, ...REDUCED_MOTION_SPRING };

    const handleClick = useCallback(
      (event: MouseEvent) => {
        if (disabled) return;
        event.preventDefault();
        event.stopPropagation();
        setOpen(!open);
      },
      [disabled, setOpen, open]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen(!open);
        }
        if (event.key === "ArrowDown" && !open) {
          event.preventDefault();
          setOpen(true);
        }
      },
      [disabled, setOpen, open]
    );

    const triggerContentVariants: Variants = {
      visible: {
        opacity: 1,
        filter: "blur(0px)",
      },
      hidden: {
        opacity: 0,
        filter: shouldAnimate
          ? `blur(${animationConfig.triggerBlur}px)`
          : "blur(0px)",
      },
    };

    return (
      <AnimatePresence initial={false}>
        {!open && (
          <motion.div
            ref={(node) => {
              if (ref) {
                if (typeof ref === "function") {
                  ref(node);
                } else {
                  ref.current = node;
                }
              }
              triggerRef.current = node;
            }}
            key="trigger-icon"
            layout={false}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={triggerContentVariants}
            transition={springConfig}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-disabled={disabled}
            className={cn(className)}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: disabled ? "not-allowed" : "pointer",
              ...style,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Trigger.displayName = "PullDownTrigger";

// =============================================================================
// CONTENT COMPONENT
// =============================================================================

export const Content = forwardRef<HTMLDivElement, PullDownContentProps>(
  function PullDownContent(
    { children, className, style, onAnimationComplete },
    ref
  ) {
    const {
      open,
      contentRef,
      animationConfig,
      isOpenAnimationCompleteRef,
      direction,
      visualDuration,
      bounce,
      disableAnimation,
    } = usePullDownContext("PullDownContent");

    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = !disableAnimation && !prefersReducedMotion;

    const springConfig: Transition = shouldAnimate
      ? {
          type: "spring" as const,
          visualDuration: visualDuration * 0.85,
          bounce,
        }
      : { type: "spring" as const, ...REDUCED_MOTION_SPRING };

    const getOffset = (amount: number) => {
      switch (direction) {
        case "top":
          return { x: 0, y: amount };
        case "bottom":
          return { x: 0, y: -amount };
        case "left":
          return { x: amount, y: 0 };
        case "right":
          return { x: -amount, y: 0 };
      }
    };

    const hiddenOffset = getOffset(8);
    const exitOffset = getOffset(30);

    const contentVariants: Variants = {
      visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        transition: {
          ...springConfig,
          delay: shouldAnimate ? animationConfig.contentDelay : 0,
        },
      },
      hidden: {
        opacity: 0,
        scale: animationConfig.contentScale,
        ...hiddenOffset,
        filter: shouldAnimate
          ? `blur(${animationConfig.contentBlur}px)`
          : "blur(0px)",
      },
      exit: {
        opacity: 0,
        scale: 0.9,
        ...exitOffset,
        filter: shouldAnimate
          ? `blur(${animationConfig.contentBlur}px)`
          : "blur(0px)",
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 1, 1],
        },
      },
    };

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (ref) {
          if (typeof ref === "function") {
            ref(node);
          } else {
            ref.current = node;
          }
        }
        contentRef.current = node;
      },
      [contentRef, ref]
    );

    const handleAnimationComplete = useCallback(
      (definition: string) => {
        if (definition === "visible") {
          isOpenAnimationCompleteRef.current = true;
        }
        onAnimationComplete?.();
      },
      [isOpenAnimationCompleteRef, onAnimationComplete]
    );

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={setRef}
            key="pulldown-content"
            role="menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{
              ...springConfig,
              delay: shouldAnimate ? animationConfig.contentDelay : 0,
            }}
            onAnimationComplete={handleAnimationComplete}
            className={cn(className)}
            style={{ position: "relative", ...style }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Content.displayName = "PullDownContent";
