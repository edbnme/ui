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

// ---- AUTOCOMPLETE ROOT ------------------------------------------------------

const AutocompleteRoot = Combobox.Root;

// ---- AUTOCOMPLETE INPUT -----------------------------------------------------

const AutocompleteInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithRef<typeof Combobox.Input> & {
    showSearchIcon?: boolean;
  }
>(({ className, showSearchIcon = true, ...props }, ref) => (
  <div className="relative w-full">
    {showSearchIcon && (
      <MagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
    )}
    <Combobox.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background text-sm",
        "shadow-xs ring-offset-background",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
        "transition-[border-color,box-shadow] duration-150",
        "placeholder:text-muted-foreground/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        showSearchIcon ? "pl-10 pr-3.5" : "px-3.5",
        className
      )}
      {...props}
    />
  </div>
));
AutocompleteInput.displayName = "AutocompleteInput";

// ---- AUTOCOMPLETE TRIGGER ---------------------------------------------------

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

// ---- AUTOCOMPLETE PORTAL ----------------------------------------------------

const AutocompletePortal = Combobox.Portal;

// ---- AUTOCOMPLETE POSITIONER ------------------------------------------------

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

// ---- AUTOCOMPLETE POPUP -----------------------------------------------------

const AutocompletePopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Popup>
>(({ className, ...props }, ref) => (
  <Combobox.Popup
    ref={ref}
    className={cn(
      "z-50 w-(--anchor-width) overflow-hidden rounded-lg border border-border/60 bg-popover p-1.5 text-popover-foreground",
      "shadow-lg ring-1 ring-black/3 dark:ring-white/6",
      "origin-(--transform-origin) transform-gpu transition-[scale,opacity] duration-200",
      "data-starting-style:scale-[0.97] data-starting-style:opacity-0",
      "data-ending-style:scale-[0.97] data-ending-style:opacity-0",
      "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
      className
    )}
    {...props}
  />
));
AutocompletePopup.displayName = "AutocompletePopup";

// ---- AUTOCOMPLETE LIST ------------------------------------------------------

const AutocompleteList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.List>
>(({ className, ...props }, ref) => (
  <Combobox.List
    ref={ref}
    className={cn(
      "max-h-60 overflow-y-auto overscroll-contain py-0.5",
      "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/8 [&::-webkit-scrollbar-track]:bg-transparent",
      className
    )}
    {...props}
  />
));
AutocompleteList.displayName = "AutocompleteList";

// ---- AUTOCOMPLETE ITEM ------------------------------------------------------

const AutocompleteItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Item>
>(({ className, children, ...props }, ref) => (
  <Combobox.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-3 pr-8 text-sm outline-none",
      "transition-colors duration-75",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <span className="absolute right-2.5 flex size-4 items-center justify-center">
      <Combobox.ItemIndicator>
        <Check className="h-4 w-4" weight="bold" />
      </Combobox.ItemIndicator>
    </span>
  </Combobox.Item>
));
AutocompleteItem.displayName = "AutocompleteItem";

// ---- AUTOCOMPLETE GROUP -----------------------------------------------------

const AutocompleteGroup = Combobox.Group;

// ---- AUTOCOMPLETE GROUP LABEL -----------------------------------------------

const AutocompleteGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.GroupLabel>
>(({ className, ...props }, ref) => (
  <Combobox.GroupLabel
    ref={ref}
    className={cn(
      "px-3 py-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider",
      className
    )}
    {...props}
  />
));
AutocompleteGroupLabel.displayName = "AutocompleteGroupLabel";

// ---- AUTOCOMPLETE EMPTY -----------------------------------------------------

const AutocompleteEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Combobox.Empty>
>(({ className, children = "No results found.", ...props }, ref) => (
  <Combobox.Empty
    ref={ref}
    className={cn(
      "py-8 text-center text-[13px] text-muted-foreground/60",
      className
    )}
    {...props}
  >
    {children}
  </Combobox.Empty>
));
AutocompleteEmpty.displayName = "AutocompleteEmpty";

// ---- AUTOCOMPLETE ADDITIONAL SUB-COMPONENTS (via Combobox wrapping) ---------

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

// ---- EXPORTS ----------------------------------------------------------------

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
