/**
 * DropdownMenuItem / CheckboxItem / RadioItem — Interactive menu items with
 * keyboard selection, check/radio indicators, and ripple effects.
 * @module dropdown-menu/dropdown-menu-items
 */
"use client";

import * as React from "react";
import { forwardRef } from "react";
import { Menu } from "@base-ui/react/menu";
import { motion } from "motion/react";
import { CheckIcon, CircleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useDropdownMenu } from "./dropdown-menu-context";
import {
  itemVariants,
  indicatorVariants,
  indicatorTransition,
} from "./dropdown-menu-animations";

// ---- DROPDOWN MENU ITEM -----------------------------------------------------

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

// ---- DROPDOWN MENU CHECKBOX ITEM --------------------------------------------

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

// ---- DROPDOWN MENU RADIO GROUP ----------------------------------------------

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

// ---- DROPDOWN MENU RADIO ITEM -----------------------------------------------

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

// ---- DROPDOWN MENU LABEL ----------------------------------------------------

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

// ---- DROPDOWN MENU SEPARATOR ------------------------------------------------

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

// ---- DROPDOWN MENU SHORTCUT -------------------------------------------------

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

// ---- EXPORTS ----------------------------------------------------------------

export {
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};
