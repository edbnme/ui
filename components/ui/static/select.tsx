/**
 * Select — Dropdown select menu for single-value selection.
 * Built on @base-ui/react Select primitive.
 *
 * @example
 * <SelectRoot>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose..." />
 *   </SelectTrigger>
 *   <SelectPortal>
 *     <SelectPositioner>
 *       <SelectPopup>
 *         <SelectList>
 *           <SelectItem value="a">Option A</SelectItem>
 *           <SelectItem value="b">Option B</SelectItem>
 *         </SelectList>
 *       </SelectPopup>
 *     </SelectPositioner>
 *   </SelectPortal>
 * </SelectRoot>
 *
 * @see https://base-ui.com/react/components/select
 */
"use client";

import * as React from "react";
import { Select } from "@base-ui/react/select";
import { cn } from "@/lib/utils";
import { Check, CaretUpDown } from "@phosphor-icons/react";

// ---- SELECT ROOT ------------------------------------------------------------

const SelectRoot = Select.Root;

// ---- SELECT TRIGGER ---------------------------------------------------------

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Select.Trigger>
>(({ className, children, ...props }, ref) => (
  <Select.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-1 focus:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-popup-open:ring-1 data-popup-open:ring-ring",
      className
    )}
    {...props}
  >
    {children}
    <Select.Icon className="flex h-4 w-4 opacity-50">
      <CaretUpDown className="h-4 w-4" />
    </Select.Icon>
  </Select.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

// ---- SELECT VALUE -----------------------------------------------------------

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof Select.Value>
>(({ className, ...props }, ref) => (
  <Select.Value
    ref={ref}
    className={cn("data-placeholder:text-muted-foreground", className)}
    {...props}
  />
));
SelectValue.displayName = "SelectValue";

// ---- SELECT PORTAL ----------------------------------------------------------

const SelectPortal = Select.Portal;

// ---- SELECT POSITIONER ------------------------------------------------------

const SelectPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Positioner>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Select.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50 outline-none", className)}
    {...props}
  />
));
SelectPositioner.displayName = "SelectPositioner";

// ---- SELECT POPUP -----------------------------------------------------------

const SelectPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Popup>
>(({ className, ...props }, ref) => (
  <Select.Popup
    ref={ref}
    className={cn(
      "relative z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
      "origin-(--transform-origin) transform-gpu transition-[scale,opacity] duration-150",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
      className
    )}
    {...props}
  />
));
SelectPopup.displayName = "SelectPopup";

// ---- SELECT LIST ------------------------------------------------------------

const SelectList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.List>
>(({ className, ...props }, ref) => (
  <Select.List
    ref={ref}
    className={cn("max-h-(--available-height) overflow-y-auto p-1", className)}
    {...props}
  />
));
SelectList.displayName = "SelectList";

// ---- SELECT ITEM ------------------------------------------------------------

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ className, children, ...props }, ref) => (
  <Select.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  >
    <Select.ItemText>{children}</Select.ItemText>
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <Select.ItemIndicator>
        <Check className="h-4 w-4" weight="bold" />
      </Select.ItemIndicator>
    </span>
  </Select.Item>
));
SelectItem.displayName = "SelectItem";

// ---- SELECT GROUP -----------------------------------------------------------

const SelectGroup = Select.Group;

// ---- SELECT GROUP LABEL -----------------------------------------------------

const SelectGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.GroupLabel>
>(({ className, ...props }, ref) => (
  <Select.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectGroupLabel.displayName = "SelectGroupLabel";

// ---- SELECT SEPARATOR -------------------------------------------------------

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Separator>
>(({ className, ...props }, ref) => (
  <Select.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

// ---- SELECT ARROW -----------------------------------------------------------

const SelectArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Arrow>
>(({ className, ...props }, ref) => (
  <Select.Arrow
    ref={ref}
    className={cn(
      "relative -top-px -z-10",
      "[&>svg]:fill-popover [&>svg]:stroke-border",
      className
    )}
    {...props}
  />
));
SelectArrow.displayName = "SelectArrow";

// ---- SELECT BACKDROP --------------------------------------------------------

const SelectBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Backdrop>
>(({ className, ...props }, ref) => (
  <Select.Backdrop
    ref={ref}
    className={cn("fixed inset-0 z-50", className)}
    {...props}
  />
));
SelectBackdrop.displayName = "SelectBackdrop";

// ---- SELECT ICON ------------------------------------------------------------

const SelectIcon = Select.Icon;

// ---- SELECT ITEM INDICATOR --------------------------------------------------

const SelectItemIndicator = Select.ItemIndicator;

// ---- SELECT ITEM TEXT -------------------------------------------------------

const SelectItemText = Select.ItemText;

// ---- SELECT SCROLL ARROWS ---------------------------------------------------

const SelectScrollUpArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.ScrollUpArrow>
>(({ className, ...props }, ref) => (
  <Select.ScrollUpArrow
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  />
));
SelectScrollUpArrow.displayName = "SelectScrollUpArrow";

const SelectScrollDownArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.ScrollDownArrow>
>(({ className, ...props }, ref) => (
  <Select.ScrollDownArrow
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  />
));
SelectScrollDownArrow.displayName = "SelectScrollDownArrow";

// ---- EXPORTS ----------------------------------------------------------------

export {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectGroup,
  SelectGroupLabel,
  SelectSeparator,
  SelectArrow,
  SelectBackdrop,
  SelectIcon,
  SelectItemIndicator,
  SelectItemText,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
};
