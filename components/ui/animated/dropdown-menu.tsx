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

// 1. React imports
import * as React from "react";
import {
  createContext,
  useContext,
  forwardRef,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";

// 2. External library imports
import { Menu } from "@base-ui/react/menu";
import {
  motion,
  MotionConfig,
  type Transition,
  type Variants,
} from "motion/react";
import { CheckIcon, CaretRightIcon, CircleIcon } from "@phosphor-icons/react";

// 3. Internal imports
import { cn } from "@/lib/utils";
import { useShouldDisableAnimation } from "@/components/motion-provider";
import { useStableId } from "@/hooks/use-stable-id";
import { usePreventScroll } from "@/hooks/use-prevent-scroll";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Context value for DropdownMenu state management
 */
interface DropdownMenuContextValue {
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Unique ID for ARIA attributes */
  uniqueId: string;
  /** Whether animations are disabled */
  disableAnimation: boolean;
  /** Custom animation variants */
  variants: Variants;
  /** Spring transition for items */
  itemTransition: Transition;
}

// =============================================================================
// CONTEXT
// =============================================================================

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(
  null
);

/**
 * Hook to access DropdownMenu context
 * @param componentName - Name of the component using this hook (for error messages)
 * @throws Error if used outside DropdownMenu
 */
function useDropdownMenu(
  componentName = "DropdownMenuItem"
): DropdownMenuContextValue {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      `${componentName} must be used within <DropdownMenu>. ` +
        "Wrap your component tree with <DropdownMenu>"
    );
  }
  return context;
}

// =============================================================================
// ANIMATION CONSTANTS & VARIANTS
// =============================================================================

/**
 * PREMIUM ANIMATION SYSTEM
 * - Refined spring physics for natural, premium feel
 * - Smooth ease curves for exits
 * - No jank or stuttering
 */

/** Primary spring transition - natural feel */
const menuTransition: Transition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
  mass: 0.9,
};

/** Item transition - quick and responsive */
const itemTransitionConfig: Transition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.8,
};

/** Indicator pop transition */
const indicatorTransition: Transition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 28,
  mass: 0.6,
};

/** Sub-menu reveal transition */
const subContentTransition: Transition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 0.85,
};

/**
 * Premium exit curve - smooth deceleration
 */
const exitEase = [0.32, 0, 0.67, 0] as const;

/**
 * Default variants for dropdown content
 */
const DEFAULT_MENU_VARIANTS: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: -6,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...menuTransition,
      staggerChildren: 0.025,
      delayChildren: 0.015,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -3,
    transition: {
      type: "tween" as const,
      duration: 0.15,
      ease: exitEase,
    },
  },
};

/**
 * Variants for sub-menu content
 */
const subMenuVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.97,
    x: -6,
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      ...subContentTransition,
      staggerChildren: 0.02,
      delayChildren: 0.01,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    x: -3,
    transition: {
      type: "tween" as const,
      duration: 0.12,
      ease: exitEase,
    },
  },
};

/**
 * Variants for individual menu items
 */
const itemVariants: Variants = {
  initial: {
    opacity: 0,
    y: -3,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    transition: {
      type: "tween" as const,
      duration: 0.1,
      ease: exitEase,
    },
  },
};

/**
 * Variants for checkbox/radio indicators
 */
const indicatorVariants: Variants = {
  initial: {
    scale: 0.5,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0.5,
    opacity: 0,
    transition: {
      type: "tween" as const,
      duration: 0.08,
      ease: exitEase,
    },
  },
};

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
// DROPDOWN MENU CONTENT
// =============================================================================

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

// =============================================================================
// DROPDOWN MENU GROUP
// =============================================================================

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

// =============================================================================
// DROPDOWN MENU ITEM
// =============================================================================

/**
 * DropdownMenuItem props
 *
 * Note: onSelect signature matches shadcn API (native Event, not SyntheticEvent)
 */
export interface DropdownMenuItemProps extends Omit<
  React.ComponentProps<typeof Menu.Item>,
  "onSelect"
> {
  /** Add left padding for alignment with checkbox/radio items */
  inset?: boolean;
  /** Visual variant */
  variant?: "default" | "destructive";
  /** Called when the item is selected (shadcn API compatibility) */
  onSelect?: (event: Event) => void;
}

/**
 * DropdownMenuItem - Interactive menu item
 */
const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (
    {
      className,
      inset,
      variant = "default",
      children,
      onSelect,
      onClick,
      ...props
    },
    ref
  ) => {
    const { disableAnimation, itemTransition } =
      useDropdownMenu("DropdownMenuItem");

    // Adapter: Map shadcn's onSelect to onClick
    const handleClick: React.ComponentProps<typeof Menu.Item>["onClick"] = (
      event
    ) => {
      onClick?.(event);
      onSelect?.(event.nativeEvent);
    };

    const itemClass = cn(
      // Layout
      "relative flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
      // Focus & interaction
      "outline-none select-none",
      "transition-colors duration-75",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      // Destructive variant
      "data-[variant=destructive]:text-destructive",
      "data-[variant=destructive]:data-[highlighted]:bg-destructive/10",
      "dark:data-[variant=destructive]:data-[highlighted]:bg-destructive/20",
      "data-[variant=destructive]:data-[highlighted]:text-destructive",
      "data-[variant=destructive]:*:[svg]:!text-destructive",
      // Icon styling
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      // Disabled state
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      // Inset padding
      inset && "pl-8",
      // SVG sizing
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    );

    if (disableAnimation) {
      return (
        <Menu.Item
          ref={ref}
          data-slot="dropdown-menu-item"
          data-inset={inset ? "true" : undefined}
          data-variant={variant}
          className={itemClass}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Menu.Item>
      );
    }

    return (
      <Menu.Item
        ref={ref}
        data-slot="dropdown-menu-item"
        data-inset={inset ? "true" : undefined}
        data-variant={variant}
        onClick={handleClick}
        render={
          <motion.div
            className={itemClass}
            variants={itemVariants}
            transition={itemTransition}
          />
        }
        {...props}
      >
        {children}
      </Menu.Item>
    );
  }
);

DropdownMenuItem.displayName = "DropdownMenuItem";

// =============================================================================
// DROPDOWN MENU CHECKBOX ITEM
// =============================================================================

/**
 * DropdownMenuCheckboxItem props
 *
 * Note: onCheckedChange signature matches shadcn API (value only, no event)
 */
export interface DropdownMenuCheckboxItemProps extends Omit<
  React.ComponentProps<typeof Menu.CheckboxItem>,
  "onCheckedChange"
> {
  /** Whether the item is checked */
  checked?: boolean;
  /** Called when the checked state changes (shadcn-compatible: value only) */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * DropdownMenuCheckboxItem - Toggleable checkbox item
 */
const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, onCheckedChange, ...props }, ref) => {
  const { disableAnimation, itemTransition } = useDropdownMenu(
    "DropdownMenuCheckboxItem"
  );

  // Adapter: Base UI passes (value, event), shadcn API only passes (value)
  const handleCheckedChange = onCheckedChange
    ? (newChecked: boolean) => onCheckedChange(newChecked)
    : undefined;

  const itemClass = cn(
    // Layout
    "relative flex cursor-default items-center gap-2 rounded-lg py-2 pr-2.5 pl-9 text-sm",
    // Focus & interaction
    "outline-none select-none",
    "transition-colors duration-75",
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
    // Disabled state
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    // SVG sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className
  );

  const indicatorContent = checked && (
    <span className="pointer-events-none absolute left-2.5 flex size-4 items-center justify-center">
      {disableAnimation ? (
        <CheckIcon className="size-4" aria-hidden="true" />
      ) : (
        <motion.div
          variants={indicatorVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={indicatorTransition}
        >
          <CheckIcon className="size-4" aria-hidden="true" />
        </motion.div>
      )}
    </span>
  );

  if (disableAnimation) {
    return (
      <Menu.CheckboxItem
        ref={ref}
        data-slot="dropdown-menu-checkbox-item"
        className={itemClass}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        {indicatorContent}
        {children}
      </Menu.CheckboxItem>
    );
  }

  return (
    <Menu.CheckboxItem
      ref={ref}
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      onCheckedChange={handleCheckedChange}
      render={
        <motion.div
          className={itemClass}
          variants={itemVariants}
          transition={itemTransition}
        />
      }
      {...props}
    >
      {indicatorContent}
      {children}
    </Menu.CheckboxItem>
  );
});

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

// =============================================================================
// DROPDOWN MENU RADIO GROUP
// =============================================================================

/**
 * DropdownMenuRadioGroup props
 *
 * Note: onValueChange signature matches shadcn API (value only, no event)
 */
export interface DropdownMenuRadioGroupProps extends Omit<
  React.ComponentProps<typeof Menu.RadioGroup>,
  "onValueChange"
> {
  /** Called when the selected value changes (shadcn-compatible: value only) */
  onValueChange?: (value: string) => void;
}

/**
 * DropdownMenuRadioGroup - Groups radio items together
 */
function DropdownMenuRadioGroup({
  className,
  onValueChange,
  ...props
}: DropdownMenuRadioGroupProps) {
  // Adapter: Base UI passes (value, event), shadcn API only passes (value)
  const handleValueChange = onValueChange
    ? (newValue: string) => onValueChange(newValue)
    : undefined;

  return (
    <Menu.RadioGroup
      data-slot="dropdown-menu-radio-group"
      className={cn(className)}
      onValueChange={handleValueChange}
      {...props}
    />
  );
}

DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

// =============================================================================
// DROPDOWN MENU RADIO ITEM
// =============================================================================

/**
 * DropdownMenuRadioItem props
 */
export interface DropdownMenuRadioItemProps extends React.ComponentProps<
  typeof Menu.RadioItem
> {
  /** Value for this radio item */
  value: string;
}

/**
 * DropdownMenuRadioItem - Selectable radio item
 *
 * Note: The indicator is shown via CSS using data-checked attribute
 */
const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => {
  const { disableAnimation, itemTransition } = useDropdownMenu(
    "DropdownMenuRadioItem"
  );

  const itemClass = cn(
    // Layout
    "relative flex cursor-default items-center gap-2 rounded-lg py-2 pr-2.5 pl-9 text-sm",
    // Focus & interaction
    "outline-none select-none",
    "transition-colors duration-75",
    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
    // Disabled state
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    // SVG sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className
  );

  if (disableAnimation) {
    return (
      <Menu.RadioItem
        ref={ref}
        data-slot="dropdown-menu-radio-item"
        className={cn(
          itemClass,
          // Show indicator when checked
          "[&>[data-indicator]]:opacity-0 [&>[data-indicator]]:data-[checked]:opacity-100"
        )}
        {...props}
      >
        <span
          data-indicator=""
          className="pointer-events-none absolute left-2.5 flex size-4 items-center justify-center"
        >
          <CircleIcon
            className="size-2.5 fill-current"
            aria-hidden="true"
            weight="fill"
          />
        </span>
        {children}
      </Menu.RadioItem>
    );
  }

  return (
    <Menu.RadioItem
      ref={ref}
      data-slot="dropdown-menu-radio-item"
      render={
        <motion.div
          className={cn(
            itemClass,
            "[&>[data-indicator]]:opacity-0 [&>[data-indicator]]:data-[checked]:opacity-100"
          )}
          variants={itemVariants}
          transition={itemTransition}
        />
      }
      {...props}
    >
      <span
        data-indicator=""
        className="pointer-events-none absolute left-2.5 flex size-4 items-center justify-center"
      >
        <CircleIcon
          className="size-2.5 fill-current"
          aria-hidden="true"
          weight="fill"
        />
      </span>
      {children}
    </Menu.RadioItem>
  );
});

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

// =============================================================================
// DROPDOWN MENU LABEL
// =============================================================================

/**
 * DropdownMenuLabel props
 *
 * Note: Unlike Base UI's Menu.GroupLabel which requires Menu.Group context,
 * this component can be used standalone (matching shadcn API behavior).
 */
export interface DropdownMenuLabelProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Add left padding for alignment */
  inset?: boolean;
}

/**
 * DropdownMenuLabel - Non-interactive label for a group
 *
 * Can be used standalone or inside DropdownMenuGroup (matches shadcn API).
 */
const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dropdown-menu-label"
      data-inset={inset ? "true" : undefined}
      className={cn(
        "px-2.5 py-2 text-xs font-semibold",
        "text-foreground/80",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);

DropdownMenuLabel.displayName = "DropdownMenuLabel";

// =============================================================================
// DROPDOWN MENU SEPARATOR
// =============================================================================

/**
 * DropdownMenuSeparator props
 */
export type DropdownMenuSeparatorProps = React.ComponentProps<
  typeof Menu.Separator
>;

/**
 * DropdownMenuSeparator - Visual divider between items
 */
const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <Menu.Separator
    ref={ref}
    data-slot="dropdown-menu-separator"
    className={cn("bg-border/40 -mx-1 my-1 h-px", className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// =============================================================================
// DROPDOWN MENU SHORTCUT
// =============================================================================

/**
 * DropdownMenuShortcut props
 */
export type DropdownMenuShortcutProps = React.ComponentProps<"kbd">;

/**
 * DropdownMenuShortcut - Keyboard shortcut indicator
 */
function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <kbd
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-[10px] tracking-widest",
        "text-muted-foreground/60",
        className
      )}
      {...props}
    />
  );
}

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// =============================================================================
// DROPDOWN MENU SUB
// =============================================================================

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

// =============================================================================
// DROPDOWN MENU SUB TRIGGER
// =============================================================================

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

// =============================================================================
// DROPDOWN MENU SUB CONTENT
// =============================================================================

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

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * DropdownMenu components following shadcn/ui export pattern.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <Button>Open</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Edit</DropdownMenuItem>
 *     <DropdownMenuItem>Duplicate</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
