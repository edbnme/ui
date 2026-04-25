/**
 * DropdownMenuContent — Animated popup content with morphing open/close transitions.
 * @module dropdown-menu/dropdown-menu-content
 */
"use client";

import * as React from "react";
import { forwardRef, type ReactNode } from "react";
import { Menu } from "@base-ui/react/menu";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useDropdownMenu } from "./dropdown-menu-context";

// ---- DROPDOWN MENU CONTENT --------------------------------------------------

/**
 * DropdownMenuContent props
 */
export interface DropdownMenuContentProps extends Omit<
  React.ComponentProps<typeof Menu.Popup>,
  "children"
> {
  /** Offset from the trigger */
  sideOffset?: number;
  /** Alignment relative to trigger */
  align?: "start" | "center" | "end";
  /** Side to render on */
  side?: "top" | "right" | "bottom" | "left";
  /** Enable loop navigation */
  loop?: boolean;
  /** Children content */
  children?: ReactNode;
}

/**
 * DropdownMenuContent - Main dropdown panel with animations
 */
const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(
  (
    {
      className,
      sideOffset = 6,
      align = "start",
      side = "bottom",
      loop: _loop = true,
      children,
      ...props
    },
    ref
  ) => {
    const { disableAnimation, uniqueId, variants } = useDropdownMenu(
      "DropdownMenuContent"
    );

    // Base classes for dropdown content
    const contentClasses = cn(
      // Layout
      "z-[100] min-w-32 overflow-hidden rounded-2xl border border-border p-2",
      // Colors
      "bg-popover text-popover-foreground",
      // Shadow
      "shadow-lg",
      // Sizing
      "max-h-[var(--available-height)]",
      // Transform origin for animations
      "origin-[var(--transform-origin)]",
      // Scroll
      "overflow-y-auto",
      className
    );

    // Non-animated version
    if (disableAnimation) {
      return (
        <Menu.Portal>
          <Menu.Positioner
            sideOffset={sideOffset}
            align={align}
            side={side}
            data-slot="dropdown-menu-positioner"
          >
            <Menu.Popup
              ref={ref}
              id={`${uniqueId}-content`}
              data-slot="dropdown-menu-content"
              className={cn(
                contentClasses,
                "border-border",
                // CSS transitions for non-motion animations
                "transition-all duration-150",
                "data-starting-style:scale-95 data-starting-style:opacity-0",
                "data-ending-style:scale-95 data-ending-style:opacity-0",
                "scale-100 opacity-100"
              )}
              {...props}
            >
              {children}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      );
    }

    // Animated version with motion
    return (
      <Menu.Portal>
        <Menu.Positioner
          sideOffset={sideOffset}
          align={align}
          side={side}
          data-slot="dropdown-menu-positioner"
        >
          <Menu.Popup
            ref={ref}
            id={`${uniqueId}-content`}
            render={
              <motion.div
                data-slot="dropdown-menu-content"
                className={cn(
                  contentClasses,
                  // Enhanced styling for animated version
                  "border-border/60",
                  "bg-popover/98",
                  "shadow-lg shadow-black/15",
                  // Subtle glassmorphism - static blur (NOT animated)
                  "supports-backdrop-filter:bg-popover/90",
                  "supports-backdrop-filter:backdrop-blur-xl",
                  // Dark mode enhancements
                  "dark:border-white/15",
                  "dark:shadow-xl dark:shadow-black/30"
                )}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
              />
            }
            {...props}
          >
            {children}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    );
  }
);

DropdownMenuContent.displayName = "DropdownMenuContent";

// ---- DROPDOWN MENU GROUP ----------------------------------------------------

/**
 * DropdownMenuGroup props
 */
export type DropdownMenuGroupProps = React.ComponentProps<typeof Menu.Group>;

/**
 * DropdownMenuGroup - Groups related items together
 */
function DropdownMenuGroup({ className, ...props }: DropdownMenuGroupProps) {
  return (
    <Menu.Group
      data-slot="dropdown-menu-group"
      className={cn(className)}
      {...props}
    />
  );
}

DropdownMenuGroup.displayName = "DropdownMenuGroup";

// ---- EXPORTS ----------------------------------------------------------------

export { DropdownMenuContent, DropdownMenuGroup };
