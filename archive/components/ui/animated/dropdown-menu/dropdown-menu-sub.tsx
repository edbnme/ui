/**
 * DropdownMenuSub / SubTrigger / SubContent — Nested submenu system with
 * directional slide animations and keyboard navigation.
 * @module dropdown-menu/dropdown-menu-sub
 */
"use client";

import * as React from "react";
import { forwardRef, useCallback, type ReactNode } from "react";
import { Menu } from "@base-ui/react/menu";
import { motion } from "motion/react";
import { CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useDropdownMenu } from "./dropdown-menu-context";
import { itemVariants, subMenuVariants } from "./dropdown-menu-animations";

// ---- DROPDOWN MENU SUB ------------------------------------------------------

/**
 * DropdownMenuSub props
 */
export interface DropdownMenuSubProps {
  /** Child components */
  children: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

/**
 * DropdownMenuSub - Nested submenu container
 */
function DropdownMenuSub({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: DropdownMenuSubProps) {
  // Handle defaultOpen by using internal state when uncontrolled
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <Menu.SubmenuRoot
      open={open}
      onOpenChange={handleOpenChange}
      data-slot="dropdown-menu-sub"
    >
      {children}
    </Menu.SubmenuRoot>
  );
}

DropdownMenuSub.displayName = "DropdownMenuSub";

// ---- DROPDOWN MENU SUB TRIGGER ----------------------------------------------

/**
 * DropdownMenuSubTrigger props
 */
export interface DropdownMenuSubTriggerProps extends React.ComponentProps<
  typeof Menu.SubmenuTrigger
> {
  /** Add left padding for alignment */
  inset?: boolean;
}

/**
 * DropdownMenuSubTrigger - Opens a nested submenu
 */
const DropdownMenuSubTrigger = forwardRef<
  HTMLDivElement,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => {
  const { disableAnimation, itemTransition } = useDropdownMenu(
    "DropdownMenuSubTrigger"
  );

  const triggerClass = cn(
    // Layout
    "flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
    // Focus & interaction
    "outline-none select-none",
    "transition-colors duration-75",
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
    // Open state
    "data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
    // Icon styling
    "[&_svg:not([class*='text-'])]:text-muted-foreground",
    // Inset padding
    inset && "pl-8",
    // SVG sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className
  );

  if (disableAnimation) {
    return (
      <Menu.SubmenuTrigger
        ref={ref}
        data-slot="dropdown-menu-sub-trigger"
        data-inset={inset ? "true" : undefined}
        className={triggerClass}
        {...props}
      >
        {children}
        <CaretRightIcon className="ml-auto size-4" aria-hidden="true" />
      </Menu.SubmenuTrigger>
    );
  }

  return (
    <Menu.SubmenuTrigger
      ref={ref}
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset ? "true" : undefined}
      render={
        <motion.div
          className={triggerClass}
          variants={itemVariants}
          transition={itemTransition}
        />
      }
      {...props}
    >
      {children}
      <CaretRightIcon className="ml-auto size-4" aria-hidden="true" />
    </Menu.SubmenuTrigger>
  );
});

DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

// ---- DROPDOWN MENU SUB CONTENT ----------------------------------------------

/**
 * DropdownMenuSubContent props
 */
export interface DropdownMenuSubContentProps extends React.ComponentProps<
  typeof Menu.Popup
> {
  /** Offset from the trigger */
  sideOffset?: number;
  /** Alignment offset */
  alignOffset?: number;
  /** Children content */
  children?: ReactNode;
}

/**
 * DropdownMenuSubContent - Content panel for a submenu
 */
const DropdownMenuSubContent = forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>(
  (
    { className, sideOffset = 2, alignOffset = -4, children, ...props },
    ref
  ) => {
    const { disableAnimation } = useDropdownMenu("DropdownMenuSubContent");

    const contentClasses = cn(
      // Layout
      "z-[100] min-w-32 overflow-hidden rounded-2xl border border-border p-2",
      // Colors
      "bg-popover text-popover-foreground",
      // Shadow
      "shadow-lg",
      // Transform origin
      "origin-[var(--transform-origin)]",
      className
    );

    if (disableAnimation) {
      return (
        <Menu.Portal>
          <Menu.Positioner
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            data-slot="dropdown-menu-sub-positioner"
          >
            <Menu.Popup
              ref={ref}
              data-slot="dropdown-menu-sub-content"
              className={cn(
                contentClasses,
                "border-border",
                // CSS transitions
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

    return (
      <Menu.Portal>
        <Menu.Positioner
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          data-slot="dropdown-menu-sub-positioner"
        >
          <Menu.Popup
            ref={ref}
            render={
              <motion.div
                data-slot="dropdown-menu-sub-content"
                className={cn(
                  contentClasses,
                  // Enhanced styling
                  "border-border/60",
                  "bg-popover/98",
                  "shadow-lg shadow-black/15",
                  // Subtle glassmorphism - static blur
                  "supports-backdrop-filter:bg-popover/90",
                  "supports-backdrop-filter:backdrop-blur-xl",
                  // Dark mode
                  "dark:border-white/15",
                  "dark:shadow-xl dark:shadow-black/30"
                )}
                variants={subMenuVariants}
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

DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

// ---- EXPORTS ----------------------------------------------------------------

export { DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent };
