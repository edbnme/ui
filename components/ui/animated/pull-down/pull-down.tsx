/**
 * PullDown — Root component managing open/close state and morphing animation.
 * Renders trigger, container, and content with spring physics.
 * @module pull-down/pull-down
 */
"use client";

import { forwardRef, useMemo, useCallback, useRef, useState } from "react";
import { useShouldDisableAnimation } from "@/components/motion-provider";

import {
  type PullDownProps,
  PullDownContext,
  useControllable,
  useClickOutside,
  useEscapeKey,
} from "./pull-down-context";
import { DEFAULT_ANIMATION_CONFIG } from "./pull-down-utils";

// =============================================================================
// ROOT COMPONENT
// =============================================================================

export const Root = forwardRef<HTMLDivElement, PullDownProps>(
  function PullDownRoot(
    {
      children,
      open: controlledOpen,
      onOpenChange,
      defaultOpen = false,
      animationConfig,
      closeOnClickOutside = true,
      closeOnEscape = true,
      modal = false,
      direction = "top",
      anchor: anchorProp = "start",
      visualDuration = 0.25,
      bounce = 0.2,
    },
    ref
  ) {
    const disableAnimation = useShouldDisableAnimation();

    // For horizontal directions, anchor is always center
    const anchor =
      direction === "left" || direction === "right" ? "center" : anchorProp;

    const [open, setOpen] = useControllable({
      value: controlledOpen,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const triggerRef = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const isOpenAnimationCompleteRef = useRef(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    // Track when submenu is in the process of closing (exit animation)
    const [isSubmenuClosing, setIsSubmenuClosing] = useState(false);
    const submenuClosingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle submenu state changes and track closing animation
    const handleSetActiveSubmenu = useCallback(
      (id: string | null) => {
        // Clear any pending timeout
        if (submenuClosingTimeoutRef.current) {
          clearTimeout(submenuClosingTimeoutRef.current);
          submenuClosingTimeoutRef.current = null;
        }

        if (id === null && activeSubmenu !== null) {
          // Submenu is closing - mark it and wait for animation
          setIsSubmenuClosing(true);
          setActiveSubmenu(null);
          submenuClosingTimeoutRef.current = setTimeout(
            () => {
              setIsSubmenuClosing(false);
              submenuClosingTimeoutRef.current = null;
            },
            visualDuration * 1000 + 50
          ); // Add small buffer
        } else {
          setIsSubmenuClosing(false);
          setActiveSubmenu(id);
        }
      },
      [activeSubmenu, visualDuration]
    );

    const handleSetOpen = useCallback(
      (newOpen: boolean) => {
        if (newOpen) {
          isOpenAnimationCompleteRef.current = false;
        } else {
          // Clear any pending timeout
          if (submenuClosingTimeoutRef.current) {
            clearTimeout(submenuClosingTimeoutRef.current);
            submenuClosingTimeoutRef.current = null;
          }
          setIsSubmenuClosing(false);
          setActiveSubmenu(null);
        }
        setOpen(newOpen);
      },
      [setOpen]
    );

    // Handle click outside - if submenu is open or closing, handle appropriately
    const handleClickOutside = useCallback(() => {
      if (activeSubmenu !== null) {
        // If a submenu is open, close submenu first
        handleSetActiveSubmenu(null);
      } else if (isSubmenuClosing) {
        // Submenu is still in closing animation, ignore click
        return;
      } else {
        // No submenu open or closing, close the entire menu
        handleSetOpen(false);
      }
    }, [
      activeSubmenu,
      isSubmenuClosing,
      handleSetActiveSubmenu,
      handleSetOpen,
    ]);

    // Close on click outside
    useClickOutside(
      [triggerRef, contentRef],
      handleClickOutside,
      open && closeOnClickOutside
    );

    // Handle escape key - if submenu is open or closing, handle appropriately
    const handleEscapeKey = useCallback(() => {
      if (activeSubmenu !== null) {
        // If a submenu is open, close submenu first
        handleSetActiveSubmenu(null);
      } else if (isSubmenuClosing) {
        // Submenu is still in closing animation, ignore escape
        return;
      } else {
        // No submenu open or closing, close the entire menu
        handleSetOpen(false);
      }
    }, [
      activeSubmenu,
      isSubmenuClosing,
      handleSetActiveSubmenu,
      handleSetOpen,
    ]);

    // Close on escape
    useEscapeKey(handleEscapeKey, open && closeOnEscape);

    const mergedAnimationConfig = useMemo(
      () => ({
        ...DEFAULT_ANIMATION_CONFIG,
        ...animationConfig,
      }),
      [animationConfig]
    );

    const contextValue = useMemo(
      () => ({
        open,
        setOpen: handleSetOpen,
        triggerRef,
        contentRef,
        animationConfig: mergedAnimationConfig,
        closeOnClickOutside,
        closeOnEscape,
        modal,
        isOpenAnimationCompleteRef,
        direction,
        anchor,
        activeSubmenu,
        setActiveSubmenu: handleSetActiveSubmenu,
        isSubmenuClosing,
        visualDuration,
        bounce,
        disableAnimation,
      }),
      [
        open,
        handleSetOpen,
        mergedAnimationConfig,
        closeOnClickOutside,
        closeOnEscape,
        modal,
        direction,
        anchor,
        activeSubmenu,
        handleSetActiveSubmenu,
        isSubmenuClosing,
        visualDuration,
        bounce,
        disableAnimation,
      ]
    );

    return (
      <PullDownContext.Provider value={contextValue}>
        <div ref={ref} className="relative inline-block">
          {children}
        </div>
      </PullDownContext.Provider>
    );
  }
);

Root.displayName = "PullDown";
