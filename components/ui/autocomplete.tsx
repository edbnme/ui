/**
 * Autocomplete - free-form input with filtered suggestions.
 *
 * Thin styled layer over `@base-ui/react/autocomplete`. Parts preserve
 * upstream render composition, refs, function-valued `className` and `style`,
 * field state data attributes, portal positioning, grouped data, and hooks.
 *
 * Anatomy:
 * ```tsx
 * <AutocompleteRoot items={tags}>
 *   <AutocompleteInputGroup>
 *     <AutocompleteIcon />
 *     <AutocompleteInput />
 *     <AutocompleteClear />
 *     <AutocompleteTrigger />
 *   </AutocompleteInputGroup>
 *   <AutocompletePortal>
 *     <AutocompletePositioner>
 *       <AutocompletePopup>
 *         <AutocompleteStatus />
 *         <AutocompleteEmpty />
 *         <AutocompleteList>
 *           <AutocompleteItem />
 *         </AutocompleteList>
 *       </AutocompletePopup>
 *     </AutocompletePositioner>
 *   </AutocompletePortal>
 * </AutocompleteRoot>
 * ```
 *
 * Styling is solid, premium, platform-native, and token driven.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @upstream   Base UI v1.5.0 - https://base-ui.com/react/components/autocomplete
 * @registryDescription Premium solid autocomplete with full Base UI part coverage, filtering hooks, grouped items, status, and portal positioning.
 * @registryDemos basic=Basic, controlled=Controlled, async=Async, grouped=Grouped, empty=Empty, states=States, long-labels=Long labels
 */
"use client";

import * as React from "react";
import { Autocomplete } from "@base-ui/react/autocomplete";
import type {
  AutocompleteArrowProps as BaseAutocompleteArrowProps,
  AutocompleteArrowState as BaseAutocompleteArrowState,
  AutocompleteBackdropProps as BaseAutocompleteBackdropProps,
  AutocompleteBackdropState as BaseAutocompleteBackdropState,
  AutocompleteClearProps as BaseAutocompleteClearProps,
  AutocompleteClearState as BaseAutocompleteClearState,
  AutocompleteCollectionProps as BaseAutocompleteCollectionProps,
  AutocompleteCollectionState as BaseAutocompleteCollectionState,
  AutocompleteEmptyProps as BaseAutocompleteEmptyProps,
  AutocompleteEmptyState as BaseAutocompleteEmptyState,
  AutocompleteFilter,
  AutocompleteFilterOptions,
  AutocompleteGroupLabelProps as BaseAutocompleteGroupLabelProps,
  AutocompleteGroupLabelState as BaseAutocompleteGroupLabelState,
  AutocompleteGroupProps as BaseAutocompleteGroupProps,
  AutocompleteGroupState as BaseAutocompleteGroupState,
  AutocompleteIconProps as BaseAutocompleteIconProps,
  AutocompleteIconState as BaseAutocompleteIconState,
  AutocompleteInputGroupProps as BaseAutocompleteInputGroupProps,
  AutocompleteInputGroupState as BaseAutocompleteInputGroupState,
  AutocompleteInputProps as BaseAutocompleteInputProps,
  AutocompleteInputState as BaseAutocompleteInputState,
  AutocompleteItemProps as BaseAutocompleteItemProps,
  AutocompleteItemState as BaseAutocompleteItemState,
  AutocompleteListProps as BaseAutocompleteListProps,
  AutocompleteListState as BaseAutocompleteListState,
  AutocompletePopupProps as BaseAutocompletePopupProps,
  AutocompletePopupState as BaseAutocompletePopupState,
  AutocompletePortalProps as BaseAutocompletePortalProps,
  AutocompletePortalState as BaseAutocompletePortalState,
  AutocompletePositionerProps as BaseAutocompletePositionerProps,
  AutocompletePositionerState as BaseAutocompletePositionerState,
  AutocompleteRootActions as BaseAutocompleteRootActions,
  AutocompleteRootChangeEventDetails as BaseAutocompleteRootChangeEventDetails,
  AutocompleteRootChangeEventReason as BaseAutocompleteRootChangeEventReason,
  AutocompleteRootHighlightEventDetails as BaseAutocompleteRootHighlightEventDetails,
  AutocompleteRootHighlightEventReason as BaseAutocompleteRootHighlightEventReason,
  AutocompleteRootProps as BaseAutocompleteRootProps,
  AutocompleteRootState as BaseAutocompleteRootState,
  AutocompleteRowProps as BaseAutocompleteRowProps,
  AutocompleteRowState as BaseAutocompleteRowState,
  AutocompleteStatusProps as BaseAutocompleteStatusProps,
  AutocompleteStatusState as BaseAutocompleteStatusState,
  AutocompleteTriggerProps as BaseAutocompleteTriggerProps,
  AutocompleteTriggerState as BaseAutocompleteTriggerState,
  AutocompleteValueProps as BaseAutocompleteValueProps,
  AutocompleteValueState as BaseAutocompleteValueState,
} from "@base-ui/react/autocomplete";
import { CaretDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

export type AutocompleteRootProps<ItemValue = unknown> =
  BaseAutocompleteRootProps<ItemValue>;
export type AutocompleteRootState = BaseAutocompleteRootState;
export type AutocompleteRootActions = BaseAutocompleteRootActions;
export type AutocompleteRootChangeEventReason =
  BaseAutocompleteRootChangeEventReason;
export type AutocompleteRootChangeEventDetails =
  BaseAutocompleteRootChangeEventDetails;
export type AutocompleteRootHighlightEventReason =
  BaseAutocompleteRootHighlightEventReason;
export type AutocompleteRootHighlightEventDetails =
  BaseAutocompleteRootHighlightEventDetails;

export type AutocompleteInputGroupProps = BaseAutocompleteInputGroupProps;
export type AutocompleteInputGroupState = BaseAutocompleteInputGroupState;
export type AutocompleteInputProps = BaseAutocompleteInputProps;
export type AutocompleteInputState = BaseAutocompleteInputState;
export type AutocompleteTriggerProps = BaseAutocompleteTriggerProps;
export type AutocompleteTriggerState = BaseAutocompleteTriggerState;
export type AutocompleteIconProps = BaseAutocompleteIconProps;
export type AutocompleteIconState = BaseAutocompleteIconState;
export type AutocompleteClearProps = BaseAutocompleteClearProps;
export type AutocompleteClearState = BaseAutocompleteClearState;
export type AutocompleteValueProps = BaseAutocompleteValueProps;
export type AutocompleteValueState = BaseAutocompleteValueState;
export type AutocompletePortalProps = BaseAutocompletePortalProps;
export type AutocompletePortalState = BaseAutocompletePortalState;
export type AutocompleteBackdropProps = BaseAutocompleteBackdropProps;
export type AutocompleteBackdropState = BaseAutocompleteBackdropState;
export type AutocompletePositionerProps = BaseAutocompletePositionerProps;
export type AutocompletePositionerState = BaseAutocompletePositionerState;
export type AutocompletePopupProps = BaseAutocompletePopupProps;
export type AutocompletePopupState = BaseAutocompletePopupState;
export type AutocompleteArrowProps = BaseAutocompleteArrowProps;
export type AutocompleteArrowState = BaseAutocompleteArrowState;
export type AutocompleteStatusProps = BaseAutocompleteStatusProps;
export type AutocompleteStatusState = BaseAutocompleteStatusState;
export type AutocompleteEmptyProps = BaseAutocompleteEmptyProps;
export type AutocompleteEmptyState = BaseAutocompleteEmptyState;
export type AutocompleteListProps = BaseAutocompleteListProps;
export type AutocompleteListState = BaseAutocompleteListState;
export type AutocompleteRowProps = BaseAutocompleteRowProps;
export type AutocompleteRowState = BaseAutocompleteRowState;
export type AutocompleteItemProps = BaseAutocompleteItemProps;
export type AutocompleteItemState = BaseAutocompleteItemState;
export type AutocompleteSeparatorProps = React.ComponentPropsWithoutRef<
  typeof Autocomplete.Separator
>;
export type AutocompleteGroupProps = BaseAutocompleteGroupProps;
export type AutocompleteGroupState = BaseAutocompleteGroupState;
export type AutocompleteGroupLabelProps = BaseAutocompleteGroupLabelProps;
export type AutocompleteGroupLabelState = BaseAutocompleteGroupLabelState;
export type AutocompleteCollectionProps = BaseAutocompleteCollectionProps;
export type AutocompleteCollectionState = BaseAutocompleteCollectionState;

// ---- HELPERS ----------------------------------------------------------------

function composeClassName<TProps extends { className?: unknown }>(
  baseClassName: string,
  className: TProps["className"]
): TProps["className"] {
  if (typeof className === "function") {
    return ((state: unknown) =>
      cn(
        baseClassName,
        (className as (state: unknown) => string | undefined)(state)
      )) as TProps["className"];
  }

  return cn(
    baseClassName,
    className as string | undefined
  ) as TProps["className"];
}

// ---- ROOT / NON-ELEMENT PARTS -----------------------------------------------

const AutocompleteRoot = Autocomplete.Root;
const AutocompletePortal = Autocomplete.Portal;
const AutocompleteValue = Autocomplete.Value;
const AutocompleteCollection = Autocomplete.Collection;

const useAutocompleteFilter = Autocomplete.useFilter;
const useAutocompleteFilteredItems = Autocomplete.useFilteredItems;

// ---- INPUT GROUP -------------------------------------------------------------

const AutocompleteInputGroup = React.forwardRef<
  React.ElementRef<typeof Autocomplete.InputGroup>,
  AutocompleteInputGroupProps
>(function AutocompleteInputGroup({ className, ...props }, ref) {
  return (
    <Autocomplete.InputGroup
      ref={ref}
      data-slot="autocomplete-input-group"
      className={composeClassName<AutocompleteInputGroupProps>(
        cn(
          "group relative flex min-h-11 w-full min-w-0 items-center gap-2 rounded-[14px] border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none",
          "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          "data-[popup-open]:border-ring data-[popup-open]:ring-2 data-[popup-open]:ring-ring data-[popup-open]:ring-offset-2 data-[popup-open]:ring-offset-background",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          "data-[readonly]:bg-muted",
          "data-[invalid]:border-destructive data-[invalid]:ring-2 data-[invalid]:ring-destructive data-[invalid]:ring-offset-2 data-[invalid]:ring-offset-background",
          "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]"
        ),
        className
      )}
      {...props}
    />
  );
});
AutocompleteInputGroup.displayName = "AutocompleteInputGroup";

// ---- INPUT ------------------------------------------------------------------

const AutocompleteInput = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Input>,
  AutocompleteInputProps
>(function AutocompleteInput({ className, ...props }, ref) {
  return (
    <Autocomplete.Input
      ref={ref}
      data-slot="autocomplete-input"
      className={composeClassName<AutocompleteInputProps>(
        cn(
          "h-10 min-w-0 flex-1 bg-transparent text-base leading-5 text-foreground outline-none",
          "placeholder:text-muted-foreground disabled:cursor-not-allowed",
          "data-[readonly]:cursor-default forced-colors:placeholder:text-[GrayText]"
        ),
        className
      )}
      {...props}
    />
  );
});
AutocompleteInput.displayName = "AutocompleteInput";

// ---- TRIGGER ----------------------------------------------------------------

const AutocompleteTrigger = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Trigger>,
  AutocompleteTriggerProps
>(function AutocompleteTrigger({ className, children, ...props }, ref) {
  return (
    <Autocomplete.Trigger
      ref={ref}
      data-slot="autocomplete-trigger"
      className={composeClassName<AutocompleteTriggerProps>(
        cn(
          "group/autocomplete-trigger inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground outline-none",
          "transition-[background-color,color,transform] duration-150 ease-out motion-reduce:transition-none motion-reduce:active:scale-100",
          "hover:bg-muted hover:text-foreground active:scale-95",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-[popup-open]:text-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
          "data-[readonly]:cursor-not-allowed data-[readonly]:opacity-45 data-[readonly]:hover:bg-transparent data-[readonly]:active:scale-100",
          "group-data-[readonly]:cursor-not-allowed group-data-[readonly]:opacity-45 group-data-[readonly]:hover:bg-transparent group-data-[readonly]:active:scale-100",
          "forced-colors:text-[ButtonText] forced-colors:focus-visible:outline forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-[Highlight]"
        ),
        className
      )}
      {...props}
    >
      {children ?? (
        <CaretDown
          aria-hidden="true"
          className="size-4 transition-transform duration-150 ease-out group-data-[popup-open]/autocomplete-trigger:rotate-180 motion-reduce:transition-none"
          weight="bold"
        />
      )}
    </Autocomplete.Trigger>
  );
});
AutocompleteTrigger.displayName = "AutocompleteTrigger";

// ---- ICON -------------------------------------------------------------------

const AutocompleteIcon = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Icon>,
  AutocompleteIconProps
>(function AutocompleteIcon({ className, children, ...props }, ref) {
  return (
    <Autocomplete.Icon
      ref={ref}
      data-slot="autocomplete-icon"
      className={composeClassName<AutocompleteIconProps>(
        "flex size-4 shrink-0 items-center justify-center text-muted-foreground forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    >
      {children ?? (
        <MagnifyingGlass aria-hidden="true" className="size-4" weight="bold" />
      )}
    </Autocomplete.Icon>
  );
});
AutocompleteIcon.displayName = "AutocompleteIcon";

// ---- CLEAR ------------------------------------------------------------------

const AutocompleteClear = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Clear>,
  AutocompleteClearProps
>(function AutocompleteClear(
  { className, children, "aria-label": ariaLabel = "Clear input", ...props },
  ref
) {
  return (
    <Autocomplete.Clear
      ref={ref}
      data-slot="autocomplete-clear"
      aria-label={ariaLabel}
      className={composeClassName<AutocompleteClearProps>(
        cn(
          "pointer-events-none inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground opacity-0 outline-none",
          "transition-[background-color,color,opacity,transform] duration-150 ease-out motion-reduce:transition-none motion-reduce:active:scale-100",
          "hover:bg-muted hover:text-foreground active:scale-95",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-[visible]:pointer-events-auto data-[visible]:opacity-100",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[disabled]:hover:bg-transparent data-[disabled]:active:scale-100",
          "group-data-[readonly]:cursor-not-allowed group-data-[readonly]:opacity-45 group-data-[readonly]:hover:bg-transparent group-data-[readonly]:active:scale-100",
          "forced-colors:text-[ButtonText] forced-colors:focus-visible:outline forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-[Highlight]"
        ),
        className
      )}
      {...props}
    >
      {children ?? <X aria-hidden="true" className="size-4" weight="bold" />}
    </Autocomplete.Clear>
  );
});
AutocompleteClear.displayName = "AutocompleteClear";

// ---- BACKDROP ----------------------------------------------------------------

const AutocompleteBackdrop = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Backdrop>,
  AutocompleteBackdropProps
>(function AutocompleteBackdrop({ className, ...props }, ref) {
  return (
    <Autocomplete.Backdrop
      ref={ref}
      data-slot="autocomplete-backdrop"
      className={composeClassName<AutocompleteBackdropProps>(
        cn(
          "fixed inset-0 z-40 bg-background",
          "transition-opacity duration-150 ease-out motion-reduce:transition-none",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          "forced-colors:bg-[Canvas]"
        ),
        className
      )}
      {...props}
    />
  );
});
AutocompleteBackdrop.displayName = "AutocompleteBackdrop";

// ---- POSITIONER --------------------------------------------------------------

const AutocompletePositioner = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Positioner>,
  AutocompletePositionerProps
>(function AutocompletePositioner(
  { className, sideOffset = 8, collisionPadding = 8, ...props },
  ref
) {
  return (
    <Autocomplete.Positioner
      ref={ref}
      data-slot="autocomplete-positioner"
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={composeClassName<AutocompletePositionerProps>(
        "z-50 max-w-[min(var(--available-width),calc(100vw-1rem))] outline-none data-[anchor-hidden]:pointer-events-none",
        className
      )}
      {...props}
    />
  );
});
AutocompletePositioner.displayName = "AutocompletePositioner";

// ---- POPUP ------------------------------------------------------------------

const AutocompletePopup = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Popup>,
  AutocompletePopupProps
>(function AutocompletePopup({ className, ...props }, ref) {
  return (
    <Autocomplete.Popup
      ref={ref}
      data-slot="autocomplete-popup"
      className={composeClassName<AutocompletePopupProps>(
        cn(
          "w-[var(--anchor-width)] max-w-[min(var(--available-width),calc(100vw-1rem))] max-h-[min(var(--available-height,22rem),22rem)] overflow-hidden rounded-[14px] border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none ring-1 ring-border",
          "origin-[var(--transform-origin)] transform-gpu transition-[opacity,transform] duration-150 ease-out motion-reduce:transform-none motion-reduce:transition-opacity",
          "data-[starting-style]:translate-y-1 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0",
          "data-[ending-style]:translate-y-1 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
          "motion-reduce:data-[starting-style]:translate-y-0 motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:translate-y-0 motion-reduce:data-[ending-style]:scale-100",
          "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:shadow-none forced-colors:ring-0"
        ),
        className
      )}
      {...props}
    />
  );
});
AutocompletePopup.displayName = "AutocompletePopup";

// ---- ARROW ------------------------------------------------------------------

const AutocompleteArrow = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Arrow>,
  AutocompleteArrowProps
>(function AutocompleteArrow({ className, children, ...props }, ref) {
  return (
    <Autocomplete.Arrow
      ref={ref}
      data-slot="autocomplete-arrow"
      className={composeClassName<AutocompleteArrowProps>(
        cn(
          "data-[side=top]:rotate-180 data-[side=left]:-rotate-90 data-[side=right]:rotate-90",
          "forced-colors:text-[CanvasText]"
        ),
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          aria-hidden="true"
          width="14"
          height="7"
          viewBox="0 0 14 7"
          className="block fill-popover stroke-border forced-colors:fill-[Canvas] forced-colors:stroke-[CanvasText]"
        >
          <path d="M0,0 L7,7 L14,0" strokeWidth="1" />
        </svg>
      )}
    </Autocomplete.Arrow>
  );
});
AutocompleteArrow.displayName = "AutocompleteArrow";

// ---- STATUS / EMPTY ----------------------------------------------------------

const AutocompleteStatus = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Status>,
  AutocompleteStatusProps
>(function AutocompleteStatus({ className, ...props }, ref) {
  return (
    <Autocomplete.Status
      ref={ref}
      data-slot="autocomplete-status"
      className={composeClassName<AutocompleteStatusProps>(
        "min-h-8 px-3 py-2 text-xs leading-4 text-muted-foreground forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    />
  );
});
AutocompleteStatus.displayName = "AutocompleteStatus";

const AutocompleteEmpty = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Empty>,
  AutocompleteEmptyProps
>(function AutocompleteEmpty({ className, ...props }, ref) {
  return (
    <Autocomplete.Empty
      ref={ref}
      data-slot="autocomplete-empty"
      className={composeClassName<AutocompleteEmptyProps>(
        "px-3 py-6 text-center text-sm leading-5 text-muted-foreground [&:empty]:h-0 [&:empty]:overflow-hidden [&:empty]:p-0 forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    />
  );
});
AutocompleteEmpty.displayName = "AutocompleteEmpty";

// ---- LIST / ITEMS ------------------------------------------------------------

const AutocompleteList = React.forwardRef<
  React.ElementRef<typeof Autocomplete.List>,
  AutocompleteListProps
>(function AutocompleteList({ className, ...props }, ref) {
  return (
    <Autocomplete.List
      ref={ref}
      data-slot="autocomplete-list"
      className={composeClassName<AutocompleteListProps>(
        cn(
          "max-h-[inherit] overflow-y-auto overscroll-contain py-0.5 outline-none [scrollbar-width:thin]",
          "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent",
          "forced-colors:[scrollbar-color:CanvasText_Canvas]"
        ),
        className
      )}
      {...props}
    />
  );
});
AutocompleteList.displayName = "AutocompleteList";

const AutocompleteRow = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Row>,
  AutocompleteRowProps
>(function AutocompleteRow({ className, ...props }, ref) {
  return (
    <Autocomplete.Row
      ref={ref}
      data-slot="autocomplete-row"
      className={composeClassName<AutocompleteRowProps>(
        "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-1",
        className
      )}
      {...props}
    />
  );
});
AutocompleteRow.displayName = "AutocompleteRow";

const AutocompleteItem = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Item>,
  AutocompleteItemProps
>(function AutocompleteItem({ className, ...props }, ref) {
  return (
    <Autocomplete.Item
      ref={ref}
      data-slot="autocomplete-item"
      className={composeClassName<AutocompleteItemProps>(
        cn(
          "relative flex min-h-10 w-full min-w-0 cursor-default select-none items-center gap-2 rounded-[10px] px-3 py-2 text-sm leading-5 outline-none",
          "transition-[background-color,color] duration-100 ease-out motion-reduce:transition-none",
          "hover:bg-muted hover:text-foreground",
          "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
          "forced-colors:data-[highlighted]:bg-[Highlight] forced-colors:data-[highlighted]:text-[HighlightText]"
        ),
        className
      )}
      {...props}
    />
  );
});
AutocompleteItem.displayName = "AutocompleteItem";

const AutocompleteSeparator = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Separator>,
  AutocompleteSeparatorProps
>(function AutocompleteSeparator({ className, ...props }, ref) {
  return (
    <Autocomplete.Separator
      ref={ref}
      data-slot="autocomplete-separator"
      className={composeClassName<AutocompleteSeparatorProps>(
        "-mx-1 my-1 h-px bg-border forced-colors:bg-[CanvasText]",
        className
      )}
      {...props}
    />
  );
});
AutocompleteSeparator.displayName = "AutocompleteSeparator";

// ---- GROUPS -----------------------------------------------------------------

const AutocompleteGroup = React.forwardRef<
  React.ElementRef<typeof Autocomplete.Group>,
  AutocompleteGroupProps
>(function AutocompleteGroup({ className, ...props }, ref) {
  return (
    <Autocomplete.Group
      ref={ref}
      data-slot="autocomplete-group"
      className={composeClassName<AutocompleteGroupProps>(
        "py-1 first:pt-0 last:pb-0",
        className
      )}
      {...props}
    />
  );
});
AutocompleteGroup.displayName = "AutocompleteGroup";

const AutocompleteGroupLabel = React.forwardRef<
  React.ElementRef<typeof Autocomplete.GroupLabel>,
  AutocompleteGroupLabelProps
>(function AutocompleteGroupLabel({ className, ...props }, ref) {
  return (
    <Autocomplete.GroupLabel
      ref={ref}
      data-slot="autocomplete-group-label"
      className={composeClassName<AutocompleteGroupLabelProps>(
        "px-3 pb-1 pt-2 text-xs font-medium leading-4 text-muted-foreground forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    />
  );
});
AutocompleteGroupLabel.displayName = "AutocompleteGroupLabel";

// ---- EXPORTS ----------------------------------------------------------------

export {
  AutocompleteRoot,
  AutocompleteInputGroup,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteIcon,
  AutocompleteClear,
  AutocompleteValue,
  AutocompletePortal,
  AutocompleteBackdrop,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteArrow,
  AutocompleteStatus,
  AutocompleteEmpty,
  AutocompleteList,
  AutocompleteRow,
  AutocompleteItem,
  AutocompleteSeparator,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteCollection,
  useAutocompleteFilter,
  useAutocompleteFilteredItems,
};

export type { AutocompleteFilter, AutocompleteFilterOptions };
