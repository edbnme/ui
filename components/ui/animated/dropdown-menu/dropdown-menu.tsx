/**
 * Dropdown Menu Component
 *
 * A comprehensive dropdown menu system with morphing animations, keyboard navigation,
 * and full accessibility support.
 *
 * Built on Base UI Menu primitives with custom motion animations.
 *
 * Based on WAI-ARIA Menu Button pattern.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/
 *
 * @packageDocumentation
 */

"use client";

// =============================================================================
// IMPORTS
// =============================================================================

import * as React from "react";
import { forwardRef, useMemo, useCallback, type ReactNode } from "react";
import { Menu } from "@base-ui/react/menu";
import { MotionConfig, type Transition, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { useShouldDisableAnimation } from "@/components/motion-provider";
import { useStableId } from "@/hooks/use-stable-id";
import { usePreventScroll } from "@/hooks/use-prevent-scroll";
import {
  DropdownMenuContext,
  useDropdownMenu,
  type DropdownMenuContextValue,
} from "./dropdown-menu-context";
import {
  menuTransition,
  itemTransitionConfig,
  DEFAULT_MENU_VARIANTS,
} from "./dropdown-menu-animations";

// =============================================================================
// DROPDOWN MENU ROOT
// =============================================================================

/**
 * DropdownMenu props
 */
export interface DropdownMenuProps {
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
  /** Whether to render as modal */
  modal?: boolean;
  /** Whether to prevent page scroll when open */
  preventScroll?: boolean;
}

/**
 * DropdownMenu - Container component that manages dropdown state
 *
 * Provides context for all child components and handles
 * controlled/uncontrolled state management.
 *
 * @example
 * ```tsx
 * <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
 *   <DropdownMenuTrigger>Open</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
function DropdownMenu({
  children,
  transition = menuTransition,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disableAnimation: disableAnimationProp,
  variants = DEFAULT_MENU_VARIANTS,
  modal = false,
  preventScroll = false,
}: DropdownMenuProps) {
  // Handle defaultOpen by using internal state when uncontrolled
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  // Handle open changes with adapter for Base UI callback signature
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  // Generate stable IDs
  const uniqueId = useStableId("dropdown-menu");

  // Animation preference
  const shouldDisableAnimation =
    useShouldDisableAnimation(disableAnimationProp);

  // Prevent body scroll when open
  usePreventScroll(preventScroll && isOpen);

  // Memoized context value
  const contextValue = useMemo<DropdownMenuContextValue>(
    () => ({
      isOpen,
      uniqueId,
      disableAnimation: shouldDisableAnimation,
      variants,
      itemTransition: itemTransitionConfig,
    }),
    [isOpen, uniqueId, shouldDisableAnimation, variants]
  );

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>
        <Menu.Root
          open={isOpen}
          onOpenChange={handleOpenChange}
          modal={modal}
          data-slot="dropdown-menu"
        >
          {children}
        </Menu.Root>
      </MotionConfig>
    </DropdownMenuContext.Provider>
  );
}

DropdownMenu.displayName = "DropdownMenu";

// =============================================================================
// DROPDOWN MENU PORTAL
// =============================================================================

/**
 * DropdownMenuPortal props
 */
export interface DropdownMenuPortalProps {
  /** Child content */
  children: ReactNode;
  /** Container element for the portal */
  container?: HTMLElement | null;
}

/**
 * DropdownMenuPortal - Renders content in a portal
 */
function DropdownMenuPortal({ children, container }: DropdownMenuPortalProps) {
  return (
    <Menu.Portal container={container} data-slot="dropdown-menu-portal">
      {children}
    </Menu.Portal>
  );
}

DropdownMenuPortal.displayName = "DropdownMenuPortal";

// =============================================================================
// DROPDOWN MENU TRIGGER
// =============================================================================

/**
 * DropdownMenuTrigger props
 */
export interface DropdownMenuTriggerProps extends React.ComponentProps<
  typeof Menu.Trigger
> {
  /** Merge props with child element (uses render prop in Base UI) */
  asChild?: boolean;
}

/**
 * DropdownMenuTrigger - Button that opens the dropdown
 */
const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ className, asChild = false, children, ...props }, ref) => {
  const { uniqueId, isOpen } = useDropdownMenu("DropdownMenuTrigger");

  const triggerProps = {
    ref,
    "aria-controls": `${uniqueId}-content`,
    "data-slot": "dropdown-menu-trigger",
    "data-state": isOpen ? "open" : "closed",
    className: cn(
      "outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    ),
    ...props,
  };

  if (asChild && React.isValidElement(children)) {
    return <Menu.Trigger {...triggerProps} render={children} />;
  }

  return <Menu.Trigger {...triggerProps}>{children}</Menu.Trigger>;
});

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// =============================================================================
// EXPORTS
// =============================================================================

export { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger };
