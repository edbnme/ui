/**
 * Combobox — Searchable dropdown for filtering and selecting from a list.
 * Built on @base-ui/react Combobox primitive.
 *
 * @example
 * <ComboboxRoot>
 *   <ComboboxAnchor>
 *     <ComboboxInput placeholder="Search..." />
 *     <ComboboxTrigger />
 *   </ComboboxAnchor>
 *   <ComboboxPortal>
 *     <ComboboxPositioner>
 *       <ComboboxPopup>
 *         <ComboboxList>
 *           <ComboboxItem value="a">Option A</ComboboxItem>
 *         </ComboboxList>
 *       </ComboboxPopup>
 *     </ComboboxPositioner>
 *   </ComboboxPortal>
 * </ComboboxRoot>
 *
 * @see https://base-ui.com/react/components/combobox
 */
"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { cn } from "@/lib/utils";
import { CaretUpDown, Check } from "@phosphor-icons/react";

// ---- COMBOBOX ROOT ----------------------------------------------------------

const ComboboxRoot = Combobox.Root;

// ---- COMBOBOX INPUT WRAPPER (for styling the input container) ---------------

const ComboboxInputWrapper = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm",
      "focus-within:ring-1 focus-within:ring-ring",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
ComboboxInputWrapper.displayName = "ComboboxInputWrapper";

// ---- COMBOBOX INPUT ---------------------------------------------------------

const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<typeof Combobox.Input>
>(({ className, ...props }, ref) => (
  <Combobox.Input
    ref={ref}
    className={cn(
      "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ComboboxInput.displayName = "ComboboxInput";

// ---- COMBOBOX TRIGGER -------------------------------------------------------

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof Combobox.Trigger>
>(({ className, children, ...props }, ref) => (
  <Combobox.Trigger
    ref={ref}
    className={cn(
      "flex h-5 w-5 shrink-0 items-center justify-center opacity-50",
      "hover:opacity-100",
      className
    )}
    {...props}
  >
    {children || <CaretUpDown className="h-4 w-4" />}
  </Combobox.Trigger>
));
ComboboxTrigger.displayName = "ComboboxTrigger";

// ---- COMBOBOX CLEAR ---------------------------------------------------------

const ComboboxClear = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof Combobox.Clear>
>(({ className, ...props }, ref) => (
  <Combobox.Clear
    ref={ref}
    className={cn(
      "h-5 w-5 rounded-sm opacity-50",
      "hover:opacity-100",
      "focus:outline-none focus:ring-1 focus:ring-ring",
      className
    )}
    {...props}
  />
));
ComboboxClear.displayName = "ComboboxClear";

// ---- COMBOBOX PORTAL --------------------------------------------------------

const ComboboxPortal = Combobox.Portal;

// ---- COMBOBOX POSITIONER ----------------------------------------------------

const ComboboxPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Positioner>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Combobox.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50 outline-none", className)}
    {...props}
  />
));
ComboboxPositioner.displayName = "ComboboxPositioner";

// ---- COMBOBOX POPUP ---------------------------------------------------------

const ComboboxPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Popup>
>(({ className, ...props }, ref) => (
  <Combobox.Popup
    ref={ref}
    className={cn(
      "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
      "origin-(--transform-origin) transform-gpu transition-[scale,opacity] duration-150",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
      className
    )}
    {...props}
  />
));
ComboboxPopup.displayName = "ComboboxPopup";

// ---- COMBOBOX LIST ----------------------------------------------------------

const ComboboxList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.List>
>(({ className, ...props }, ref) => (
  <Combobox.List
    ref={ref}
    className={cn("max-h-72 overflow-y-auto", className)}
    {...props}
  />
));
ComboboxList.displayName = "ComboboxList";

// ---- COMBOBOX ITEM ----------------------------------------------------------

const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Item>
>(({ className, children, ...props }, ref) => (
  <Combobox.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <Combobox.ItemIndicator>
        <Check className="h-4 w-4" weight="bold" />
      </Combobox.ItemIndicator>
    </span>
  </Combobox.Item>
));
ComboboxItem.displayName = "ComboboxItem";

// ---- COMBOBOX GROUP ---------------------------------------------------------

const ComboboxGroup = Combobox.Group;

// ---- COMBOBOX GROUP LABEL ---------------------------------------------------

const ComboboxGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.GroupLabel>
>(({ className, ...props }, ref) => (
  <Combobox.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
ComboboxGroupLabel.displayName = "ComboboxGroupLabel";

// ---- COMBOBOX EMPTY (No results) --------------------------------------------

const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Empty>
>(({ className, children = "No results found.", ...props }, ref) => (
  <Combobox.Empty
    ref={ref}
    className={cn("py-6 text-center text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </Combobox.Empty>
));
ComboboxEmpty.displayName = "ComboboxEmpty";

// ---- COMBOBOX ADDITIONAL SUB-COMPONENTS -------------------------------------

const ComboboxArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Arrow>
>(({ className, ...props }, ref) => (
  <Combobox.Arrow
    ref={ref}
    className={cn(
      "relative -top-px -z-10",
      "[&>svg]:fill-popover [&>svg]:stroke-border",
      className
    )}
    {...props}
  />
));
ComboboxArrow.displayName = "ComboboxArrow";

const ComboboxBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Backdrop>
>(({ className, ...props }, ref) => (
  <Combobox.Backdrop
    ref={ref}
    className={cn("fixed inset-0 z-50", className)}
    {...props}
  />
));
ComboboxBackdrop.displayName = "ComboboxBackdrop";

const ComboboxIcon = Combobox.Icon;
const ComboboxValue = Combobox.Value;
const ComboboxItemIndicator = Combobox.ItemIndicator;
const ComboboxSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Separator>
>(({ className, ...props }, ref) => (
  <Combobox.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
ComboboxSeparator.displayName = "ComboboxSeparator";

const ComboboxStatus = Combobox.Status;
const ComboboxChip = Combobox.Chip;
const ComboboxChips = Combobox.Chips;
const ComboboxChipRemove = Combobox.ChipRemove;

// ---- EXPORTS ----------------------------------------------------------------

export {
  ComboboxRoot,
  ComboboxInputWrapper,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxArrow,
  ComboboxBackdrop,
  ComboboxIcon,
  ComboboxValue,
  ComboboxItemIndicator,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipRemove,
};
