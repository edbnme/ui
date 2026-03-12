/**
 * Autocomplete — Searchable dropdown with filtering support.
 * Built on @base-ui/react Combobox primitive with filtering.
 *
 * @example
 * <AutocompleteRoot>
 *   <AutocompleteInput placeholder="Search..." />
 *   <AutocompleteTrigger />
 *   <AutocompletePortal>
 *     <AutocompletePositioner>
 *       <AutocompletePopup>
 *         <AutocompleteList>
 *           <AutocompleteItem value="react">React</AutocompleteItem>
 *           <AutocompleteItem value="vue">Vue</AutocompleteItem>
 *         </AutocompleteList>
 *         <AutocompleteEmpty />
 *       </AutocompletePopup>
 *     </AutocompletePositioner>
 *   </AutocompletePortal>
 * </AutocompleteRoot>
 *
 * @see https://base-ui.com/react/components/combobox
 */
"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { cn } from "@/lib/utils";
import { CaretUpDown, Check, MagnifyingGlass } from "@phosphor-icons/react";

// =============================================================================
// AUTOCOMPLETE ROOT
// =============================================================================

const AutocompleteRoot = Combobox.Root;

// =============================================================================
// AUTOCOMPLETE INPUT
// =============================================================================

const AutocompleteInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<typeof Combobox.Input> & {
    showSearchIcon?: boolean;
  }
>(({ className, showSearchIcon = true, ...props }, ref) => (
  <div
    className={cn(
      "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm",
      "focus-within:ring-1 focus-within:ring-ring"
    )}
  >
    {showSearchIcon && (
      <MagnifyingGlass className="h-4 w-4 shrink-0 opacity-50" />
    )}
    <Combobox.Input
      ref={ref}
      className={cn(
        "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
AutocompleteInput.displayName = "AutocompleteInput";

// =============================================================================
// AUTOCOMPLETE TRIGGER
// =============================================================================

const AutocompleteTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof Combobox.Trigger>
>(({ className, children, ...props }, ref) => (
  <Combobox.Trigger
    ref={ref}
    className={cn(
      "flex h-5 w-5 shrink-0 items-center justify-center opacity-50 hover:opacity-100",
      className
    )}
    {...props}
  >
    {children || <CaretUpDown className="h-4 w-4" />}
  </Combobox.Trigger>
));
AutocompleteTrigger.displayName = "AutocompleteTrigger";

// =============================================================================
// AUTOCOMPLETE PORTAL
// =============================================================================

const AutocompletePortal = Combobox.Portal;

// =============================================================================
// AUTOCOMPLETE POSITIONER
// =============================================================================

const AutocompletePositioner = React.forwardRef<
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
AutocompletePositioner.displayName = "AutocompletePositioner";

// =============================================================================
// AUTOCOMPLETE POPUP
// =============================================================================

const AutocompletePopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Popup>
>(({ className, ...props }, ref) => (
  <Combobox.Popup
    ref={ref}
    className={cn(
      "z-50 min-w-[var(--anchor-width)] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
      "origin-(--transform-origin) transition-all duration-150",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
AutocompletePopup.displayName = "AutocompletePopup";

// =============================================================================
// AUTOCOMPLETE LIST
// =============================================================================

const AutocompleteList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.List>
>(({ className, ...props }, ref) => (
  <Combobox.List
    ref={ref}
    className={cn("max-h-72 overflow-y-auto", className)}
    {...props}
  />
));
AutocompleteList.displayName = "AutocompleteList";

// =============================================================================
// AUTOCOMPLETE ITEM
// =============================================================================

const AutocompleteItem = React.forwardRef<
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
AutocompleteItem.displayName = "AutocompleteItem";

// =============================================================================
// AUTOCOMPLETE GROUP
// =============================================================================

const AutocompleteGroup = Combobox.Group;

// =============================================================================
// AUTOCOMPLETE GROUP LABEL
// =============================================================================

const AutocompleteGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.GroupLabel>
>(({ className, ...props }, ref) => (
  <Combobox.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
AutocompleteGroupLabel.displayName = "AutocompleteGroupLabel";

// =============================================================================
// AUTOCOMPLETE EMPTY
// =============================================================================

const AutocompleteEmpty = React.forwardRef<
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
AutocompleteEmpty.displayName = "AutocompleteEmpty";

// =============================================================================
// AUTOCOMPLETE ADDITIONAL SUB-COMPONENTS (via Combobox wrapping)
// =============================================================================

const AutocompleteArrow = React.forwardRef<
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
AutocompleteArrow.displayName = "AutocompleteArrow";

const AutocompleteBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Backdrop>
>(({ className, ...props }, ref) => (
  <Combobox.Backdrop
    ref={ref}
    className={cn("fixed inset-0 z-50", className)}
    {...props}
  />
));
AutocompleteBackdrop.displayName = "AutocompleteBackdrop";

const AutocompleteIcon = Combobox.Icon;
const AutocompleteValue = Combobox.Value;
const AutocompleteItemIndicator = Combobox.ItemIndicator;
const AutocompleteSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Separator>
>(({ className, ...props }, ref) => (
  <Combobox.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
AutocompleteSeparator.displayName = "AutocompleteSeparator";

const AutocompleteStatus = Combobox.Status;

// =============================================================================
// EXPORTS
// =============================================================================

export {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteArrow,
  AutocompleteBackdrop,
  AutocompleteIcon,
  AutocompleteValue,
  AutocompleteItemIndicator,
  AutocompleteSeparator,
  AutocompleteStatus,
};
