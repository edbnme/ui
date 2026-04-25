/**
 * PullDownSub / PullDownSubTrigger / PullDownSubContent — Nested submenu system
 * with directional animations based on menu depth.
 * @module pull-down/pull-down-submenu
 */
"use client";

import {
  forwardRef,
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent,
  type MutableRefObject,
} from "react";
import {
  motion,
  AnimatePresence,
  type Transition,
  type Variants,
} from "motion/react";
import { CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

import {
  type PullDownSubMenuProps,
  type PullDownSubMenuTriggerProps,
  type PullDownSubMenuContentProps,
  SubMenuContext,
  usePullDownContext,
  useSubMenuContext,
  useReducedMotion,
} from "./pull-down-context";
import { REDUCED_MOTION_SPRING, CONTENT_BLUR } from "./pull-down-utils";

// ---- SUBMENU COMPONENT ------------------------------------------------------

export function SubMenu({ children, id }: PullDownSubMenuProps): ReactNode {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contextValue = useMemo(() => ({ id, triggerRef }), [id]);

  return (
    <SubMenuContext.Provider value={contextValue}>
      {children}
    </SubMenuContext.Provider>
  );
}

SubMenu.displayName = "PullDownSubMenu";

// ---- SUBMENU TRIGGER COMPONENT ----------------------------------------------

export const SubMenuTrigger = forwardRef<
  HTMLDivElement,
  PullDownSubMenuTriggerProps
>(function PullDownSubMenuTrigger(
  { children, className, style, disabled = false },
  ref
) {
  const {
    setActiveSubmenu,
    activeSubmenu,
    isSubmenuClosing,
    visualDuration,
    bounce,
    disableAnimation,
  } = usePullDownContext("PullDownSubMenuTrigger");

  const { id, triggerRef } = useSubMenuContext();
  const prefersReducedMotion = useReducedMotion();

  const isActive = activeSubmenu === id;
  const isElevated = isActive || isSubmenuClosing;

  const shouldAnimate = !disableAnimation && !prefersReducedMotion;
  const springConfig: Transition = shouldAnimate
    ? { type: "spring" as const, visualDuration, bounce }
    : { type: "spring" as const, ...REDUCED_MOTION_SPRING };

  const openScale = 1.06 / 0.96;

  const handleClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled) {
        setActiveSubmenu(isActive ? null : id);
      }
    },
    [disabled, setActiveSubmenu, id, isActive]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActiveSubmenu(isActive ? null : id);
      } else if (event.key === "ArrowRight" && !isActive) {
        event.preventDefault();
        setActiveSubmenu(id);
      } else if (
        (event.key === "ArrowLeft" || event.key === "Escape") &&
        isActive
      ) {
        event.preventDefault();
        setActiveSubmenu(null);
      }
    },
    [disabled, setActiveSubmenu, id, isActive]
  );

  const content =
    typeof children === "function" ? children(isActive) : children;

  return (
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
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={isActive}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      data-active={isActive || undefined}
      data-elevated={isElevated || undefined}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "data-elevated:hover:bg-transparent",
        className
      )}
      initial={false}
      animate={{
        scale: isActive ? openScale : 1,
      }}
      transition={springConfig}
      style={{
        ...style,
        position: "relative",
        zIndex: isElevated ? 20 : undefined,
        transformOrigin: "top center",
        userSelect: "none",
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {content}
    </motion.div>
  );
});

SubMenuTrigger.displayName = "PullDownSubMenuTrigger";

// ---- SUBMENU CONTENT COMPONENT ----------------------------------------------

export const SubMenuContent = forwardRef<
  HTMLDivElement,
  PullDownSubMenuContentProps
>(function PullDownSubMenuContent({ children, className, style }, ref) {
  const {
    activeSubmenu,
    setActiveSubmenu,
    contentRef: mainContentRef,
    visualDuration,
    bounce,
    disableAnimation,
  } = usePullDownContext("PullDownSubMenuContent");

  const { id, triggerRef } = useSubMenuContext();
  const prefersReducedMotion = useReducedMotion();
  const subMenuRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const [triggerTop, setTriggerTop] = useState(0);
  const [triggerHeight, setTriggerHeight] = useState(44);
  const [contentHeight, setContentHeight] = useState(triggerHeight);

  const isActive = activeSubmenu === id;

  useLayoutEffect(() => {
    if (isActive && triggerRef.current) {
      setTriggerTop(triggerRef.current.offsetTop);
      setTriggerHeight(triggerRef.current.offsetHeight);
    }
  }, [isActive, triggerRef]);

  useLayoutEffect(() => {
    if (isActive && measureRef.current) {
      setContentHeight(measureRef.current.offsetHeight);
    }
  }, [isActive, children, triggerHeight]);

  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;

      if (subMenuRef.current?.contains(target)) {
        return;
      }

      if (triggerRef.current?.contains(target)) {
        return;
      }

      if (mainContentRef.current?.contains(target)) {
        event.stopPropagation();
        setActiveSubmenu(null);
        return;
      }

      setActiveSubmenu(null);
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isActive, setActiveSubmenu, mainContentRef, triggerRef]);

  const shouldAnimate = !disableAnimation && !prefersReducedMotion;
  const springConfig: Transition = shouldAnimate
    ? { type: "spring" as const, visualDuration, bounce }
    : { type: "spring" as const, ...REDUCED_MOTION_SPRING };

  const contentSpringConfig: Transition = shouldAnimate
    ? {
        type: "spring" as const,
        visualDuration: visualDuration * 0.85,
        bounce,
      }
    : { type: "spring" as const, ...REDUCED_MOTION_SPRING };

  const contentVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: shouldAnimate ? `blur(${CONTENT_BLUR}px)` : "blur(0px)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        ...contentSpringConfig,
        delay: 0.05,
      },
    },
    exit: {
      opacity: 0,
      filter: shouldAnimate ? `blur(${CONTENT_BLUR}px)` : "blur(0px)",
      transition: {
        duration: 0.15,
      },
    },
  };

  const openScale = 1.06 / 0.96;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          ref={(node) => {
            if (ref) {
              if (typeof ref === "function") {
                ref(node);
              } else {
                ref.current = node;
              }
            }
            (subMenuRef as MutableRefObject<HTMLDivElement | null>).current =
              node;
          }}
          className={cn(
            "rounded-xl bg-popover p-1 shadow-lg ring-1 ring-border/50",
            className
          )}
          initial={{
            height: triggerHeight,
            scale: 1,
            opacity: 1,
            pointerEvents: "auto" as const,
          }}
          animate={{
            height: contentHeight,
            scale: openScale,
            opacity: 1,
            pointerEvents: "auto" as const,
          }}
          exit={{
            height: triggerHeight,
            scale: 1,
            opacity: 0,
            pointerEvents: "none" as const,
          }}
          transition={{
            height: springConfig,
            scale: springConfig,
            opacity: { duration: 0.15 },
          }}
          style={{
            ...style,
            position: "absolute",
            top: triggerTop,
            left: 0,
            right: 0,
            zIndex: 10,
            overflow: "hidden",
            transformOrigin: "top center",
            willChange: "transform, height, opacity",
            boxSizing: "content-box",
          }}
        >
          <div ref={measureRef}>
            <div style={{ height: triggerHeight }} aria-hidden="true" />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SubMenuContent.displayName = "PullDownSubMenuContent";

// ---- ICON COMPONENT (for submenu indicator) ---------------------------------

interface PullDownChevronProps {
  isActive?: boolean;
  className?: string;
}

export function PullDownChevron({ isActive, className }: PullDownChevronProps) {
  return (
    <CaretRightIcon
      className={cn(
        "h-4 w-4 text-muted-foreground transition-transform duration-200",
        isActive && "rotate-90",
        className
      )}
    />
  );
}

PullDownChevron.displayName = "PullDownChevron";
