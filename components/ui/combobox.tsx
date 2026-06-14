/**
 * Combobox - filterable selection input with single-select, multi-select,
 * chips, grouped collections, status, and virtualized list support.
 *
 * Thin styled layer over `@base-ui/react/combobox`. The wrapper preserves
 * upstream render composition, refs, function-valued `className` and `style`,
 * field state data attributes, portal positioning, collection helpers, and
 * filter utilities.
 *
 * Styling is premium, solid, platform-native, and token driven.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @upstream   https://base-ui.com/react/components/combobox
 * @registryDescription Premium solid combobox with full primitive part coverage, chips, filtering hooks, grouping, status, and portal positioning.
 */
"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import type {
  ComboboxArrowProps as BaseComboboxArrowProps,
  ComboboxArrowState as BaseComboboxArrowState,
  ComboboxBackdropProps as BaseComboboxBackdropProps,
  ComboboxBackdropState as BaseComboboxBackdropState,
  ComboboxChipProps as BaseComboboxChipProps,
  ComboboxChipRemoveProps as BaseComboboxChipRemoveProps,
  ComboboxChipRemoveState as BaseComboboxChipRemoveState,
  ComboboxChipState as BaseComboboxChipState,
  ComboboxChipsProps as BaseComboboxChipsProps,
  ComboboxChipsState as BaseComboboxChipsState,
  ComboboxClearProps as BaseComboboxClearProps,
  ComboboxClearState as BaseComboboxClearState,
  ComboboxCollectionProps as BaseComboboxCollectionProps,
  ComboboxCollectionState as BaseComboboxCollectionState,
  ComboboxEmptyProps as BaseComboboxEmptyProps,
  ComboboxEmptyState as BaseComboboxEmptyState,
  ComboboxFilter,
  ComboboxFilterOptions,
  ComboboxGroupLabelProps as BaseComboboxGroupLabelProps,
  ComboboxGroupLabelState as BaseComboboxGroupLabelState,
  ComboboxGroupProps as BaseComboboxGroupProps,
  ComboboxGroupState as BaseComboboxGroupState,
  ComboboxIconProps as BaseComboboxIconProps,
  ComboboxIconState as BaseComboboxIconState,
  ComboboxInputGroupProps as BaseComboboxInputGroupProps,
  ComboboxInputGroupState as BaseComboboxInputGroupState,
  ComboboxInputProps as BaseComboboxInputProps,
  ComboboxInputState as BaseComboboxInputState,
  ComboboxItemIndicatorProps as BaseComboboxItemIndicatorProps,
  ComboboxItemIndicatorState as BaseComboboxItemIndicatorState,
  ComboboxItemProps as BaseComboboxItemProps,
  ComboboxItemState as BaseComboboxItemState,
  ComboboxLabelProps as BaseComboboxLabelProps,
  ComboboxLabelState as BaseComboboxLabelState,
  ComboboxListProps as BaseComboboxListProps,
  ComboboxListState as BaseComboboxListState,
  ComboboxPopupProps as BaseComboboxPopupProps,
  ComboboxPopupState as BaseComboboxPopupState,
  ComboboxPortalProps as BaseComboboxPortalProps,
  ComboboxPortalState as BaseComboboxPortalState,
  ComboboxPositionerProps as BaseComboboxPositionerProps,
  ComboboxPositionerState as BaseComboboxPositionerState,
  ComboboxRootActions as BaseComboboxRootActions,
  ComboboxRootChangeEventDetails as BaseComboboxRootChangeEventDetails,
  ComboboxRootChangeEventReason as BaseComboboxRootChangeEventReason,
  ComboboxRootHighlightEventDetails as BaseComboboxRootHighlightEventDetails,
  ComboboxRootHighlightEventReason as BaseComboboxRootHighlightEventReason,
  ComboboxRootProps as BaseComboboxRootProps,
  ComboboxRootState as BaseComboboxRootState,
  ComboboxRowProps as BaseComboboxRowProps,
  ComboboxRowState as BaseComboboxRowState,
  ComboboxStatusProps as BaseComboboxStatusProps,
  ComboboxStatusState as BaseComboboxStatusState,
  ComboboxTriggerProps as BaseComboboxTriggerProps,
  ComboboxTriggerState as BaseComboboxTriggerState,
  ComboboxValueProps as BaseComboboxValueProps,
  ComboboxValueState as BaseComboboxValueState,
} from "@base-ui/react/combobox";
import { CaretDown, Check, MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

export type ComboboxRootProps<
  Value = unknown,
  Multiple extends boolean | undefined = false,
> = BaseComboboxRootProps<Value, Multiple>;
export type ComboboxRootState = BaseComboboxRootState;
export type ComboboxRootActions = BaseComboboxRootActions;
export type ComboboxRootChangeEventReason = BaseComboboxRootChangeEventReason;
export type ComboboxRootChangeEventDetails = BaseComboboxRootChangeEventDetails;
export type ComboboxRootHighlightEventReason =
  BaseComboboxRootHighlightEventReason;
export type ComboboxRootHighlightEventDetails =
  BaseComboboxRootHighlightEventDetails;

export type ComboboxLabelProps = BaseComboboxLabelProps;
export type ComboboxLabelState = BaseComboboxLabelState;
export type ComboboxValueProps = BaseComboboxValueProps;
export type ComboboxValueState = BaseComboboxValueState;
export type ComboboxInputProps = BaseComboboxInputProps;
export type ComboboxInputState = BaseComboboxInputState;
export type ComboboxInputGroupProps = BaseComboboxInputGroupProps;
export type ComboboxInputGroupState = BaseComboboxInputGroupState;
export type ComboboxInputWrapperProps = ComboboxInputGroupProps;
export type ComboboxTriggerProps = BaseComboboxTriggerProps;
export type ComboboxTriggerState = BaseComboboxTriggerState;
export type ComboboxIconProps = BaseComboboxIconProps;
export type ComboboxIconState = BaseComboboxIconState;
export type ComboboxClearProps = BaseComboboxClearProps;
export type ComboboxClearState = BaseComboboxClearState;
export type ComboboxChipsProps = BaseComboboxChipsProps;
export type ComboboxChipsState = BaseComboboxChipsState;
export type ComboboxChipProps = BaseComboboxChipProps;
export type ComboboxChipState = BaseComboboxChipState;
export type ComboboxChipRemoveProps = BaseComboboxChipRemoveProps;
export type ComboboxChipRemoveState = BaseComboboxChipRemoveState;
export type ComboboxListProps = BaseComboboxListProps;
export type ComboboxListState = BaseComboboxListState;
export type ComboboxPortalProps = BaseComboboxPortalProps;
export type ComboboxPortalState = BaseComboboxPortalState;
export type ComboboxBackdropProps = BaseComboboxBackdropProps;
export type ComboboxBackdropState = BaseComboboxBackdropState;
export type ComboboxPositionerProps = BaseComboboxPositionerProps;
export type ComboboxPositionerState = BaseComboboxPositionerState;
export type ComboboxPopupProps = BaseComboboxPopupProps;
export type ComboboxPopupState = BaseComboboxPopupState;
export type ComboboxArrowProps = BaseComboboxArrowProps;
export type ComboboxArrowState = BaseComboboxArrowState;
export type ComboboxStatusProps = BaseComboboxStatusProps;
export type ComboboxStatusState = BaseComboboxStatusState;
export type ComboboxEmptyProps = BaseComboboxEmptyProps;
export type ComboboxEmptyState = BaseComboboxEmptyState;
export type ComboboxCollectionProps = BaseComboboxCollectionProps;
export type ComboboxCollectionState = BaseComboboxCollectionState;
export type ComboboxRowProps = BaseComboboxRowProps;
export type ComboboxRowState = BaseComboboxRowState;
export type ComboboxItemProps = BaseComboboxItemProps;
export type ComboboxItemState = BaseComboboxItemState;
export type ComboboxItemIndicatorProps = BaseComboboxItemIndicatorProps;
export type ComboboxItemIndicatorState = BaseComboboxItemIndicatorState;
export type ComboboxGroupProps = BaseComboboxGroupProps;
export type ComboboxGroupState = BaseComboboxGroupState;
export type ComboboxGroupLabelProps = BaseComboboxGroupLabelProps;
export type ComboboxGroupLabelState = BaseComboboxGroupLabelState;
export type ComboboxSeparatorProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Separator
>;

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

const ComboboxRoot = Combobox.Root;
const ComboboxPortal = Combobox.Portal;
const ComboboxValue = Combobox.Value;
const ComboboxCollection = Combobox.Collection;

const useComboboxFilter = Combobox.useFilter;
const useComboboxFilteredItems = Combobox.useFilteredItems;

// ---- LABEL ------------------------------------------------------------------

const ComboboxLabel = React.forwardRef<
  React.ElementRef<typeof Combobox.Label>,
  ComboboxLabelProps
>(function ComboboxLabel({ className, ...props }, ref) {
  return (
    <Combobox.Label
      ref={ref}
      data-slot="combobox-label"
      className={composeClassName<ComboboxLabelProps>(
        "text-sm font-medium leading-5 text-foreground data-[disabled]:opacity-50 forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    />
  );
});
ComboboxLabel.displayName = "ComboboxLabel";

// ---- INPUT GROUP -------------------------------------------------------------

const ComboboxInputGroup = React.forwardRef<
  React.ElementRef<typeof Combobox.InputGroup>,
  ComboboxInputGroupProps
>(function ComboboxInputGroup({ className, ...props }, ref) {
  return (
    <Combobox.InputGroup
      ref={ref}
      data-slot="combobox-input-group"
      className={composeClassName<ComboboxInputGroupProps>(
        cn(
          "group relative flex min-h-11 w-full min-w-0 flex-wrap items-center gap-1.5 rounded-[14px] border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm outline-none",
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
ComboboxInputGroup.displayName = "ComboboxInputGroup";

const ComboboxInputWrapper = React.forwardRef<
  React.ElementRef<typeof Combobox.InputGroup>,
  ComboboxInputWrapperProps
>(function ComboboxInputWrapper(props, ref) {
  return <ComboboxInputGroup ref={ref} {...props} />;
});
ComboboxInputWrapper.displayName = "ComboboxInputWrapper";

// ---- INPUT ------------------------------------------------------------------

const ComboboxInput = React.forwardRef<
  React.ElementRef<typeof Combobox.Input>,
  ComboboxInputProps
>(function ComboboxInput({ className, ...props }, ref) {
  return (
    <Combobox.Input
      ref={ref}
      data-slot="combobox-input"
      className={composeClassName<ComboboxInputProps>(
        cn(
          "h-8 min-w-[7rem] flex-1 bg-transparent text-base leading-5 text-foreground outline-none",
          "placeholder:text-muted-foreground disabled:cursor-not-allowed",
          "data-[readonly]:cursor-default forced-colors:placeholder:text-[GrayText]"
        ),
        className
      )}
      {...props}
    />
  );
});
ComboboxInput.displayName = "ComboboxInput";

// ---- TRIGGER ----------------------------------------------------------------

const ComboboxTrigger = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  ComboboxTriggerProps
>(function ComboboxTrigger({ className, children, ...props }, ref) {
  return (
    <Combobox.Trigger
      ref={ref}
      data-slot="combobox-trigger"
      className={composeClassName<ComboboxTriggerProps>(
        cn(
          "group/combobox-trigger inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground outline-none",
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
          className="size-4 transition-transform duration-150 ease-out group-data-[popup-open]/combobox-trigger:rotate-180 motion-reduce:transition-none"
          weight="bold"
        />
      )}
    </Combobox.Trigger>
  );
});
ComboboxTrigger.displayName = "ComboboxTrigger";

// ---- ICON -------------------------------------------------------------------

const ComboboxIcon = React.forwardRef<
  React.ElementRef<typeof Combobox.Icon>,
  ComboboxIconProps
>(function ComboboxIcon({ className, children, ...props }, ref) {
  return (
    <Combobox.Icon
      ref={ref}
      data-slot="combobox-icon"
      className={composeClassName<ComboboxIconProps>(
        "flex size-4 shrink-0 items-center justify-center text-muted-foreground forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    >
      {children ?? (
        <MagnifyingGlass aria-hidden="true" className="size-4" weight="bold" />
      )}
    </Combobox.Icon>
  );
});
ComboboxIcon.displayName = "ComboboxIcon";

// ---- CLEAR ------------------------------------------------------------------

const ComboboxClear = React.forwardRef<
  React.ElementRef<typeof Combobox.Clear>,
  ComboboxClearProps
>(function ComboboxClear(
  {
    className,
    children,
    "aria-label": ariaLabel = "Clear selection",
    ...props
  },
  ref
) {
  return (
    <Combobox.Clear
      ref={ref}
      data-slot="combobox-clear"
      aria-label={ariaLabel}
      className={composeClassName<ComboboxClearProps>(
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
    </Combobox.Clear>
  );
});
ComboboxClear.displayName = "ComboboxClear";

// ---- CHIPS ------------------------------------------------------------------

const ComboboxChips = React.forwardRef<
  React.ElementRef<typeof Combobox.Chips>,
  ComboboxChipsProps
>(function ComboboxChips({ className, ...props }, ref) {
  return (
    <Combobox.Chips
      ref={ref}
      data-slot="combobox-chips"
      className={composeClassName<ComboboxChipsProps>(
        "flex min-w-0 flex-1 flex-wrap items-center gap-1.5",
        className
      )}
      {...props}
    />
  );
});
ComboboxChips.displayName = "ComboboxChips";

const ComboboxChip = React.forwardRef<
  React.ElementRef<typeof Combobox.Chip>,
  ComboboxChipProps
>(function ComboboxChip({ className, ...props }, ref) {
  return (
    <Combobox.Chip
      ref={ref}
      data-slot="combobox-chip"
      className={composeClassName<ComboboxChipProps>(
        cn(
          "inline-flex min-h-7 max-w-full items-center gap-1 rounded-[9px] border border-border bg-muted px-2 text-sm leading-5 text-foreground shadow-xs",
          "data-[disabled]:opacity-50 forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]"
        ),
        className
      )}
      {...props}
    />
  );
});
ComboboxChip.displayName = "ComboboxChip";

const ComboboxChipRemove = React.forwardRef<
  React.ElementRef<typeof Combobox.ChipRemove>,
  ComboboxChipRemoveProps
>(function ComboboxChipRemove(
  { className, children, "aria-label": ariaLabel, ...props },
  ref
) {
  return (
    <Combobox.ChipRemove
      ref={ref}
      data-slot="combobox-chip-remove"
      aria-label={ariaLabel ?? "Remove selected item"}
      className={composeClassName<ComboboxChipRemoveProps>(
        cn(
          "-mr-1 inline-flex size-5 shrink-0 items-center justify-center rounded-[7px] text-muted-foreground outline-none",
          "transition-[background-color,color,transform] duration-150 ease-out motion-reduce:transition-none motion-reduce:active:scale-100",
          "hover:bg-background hover:text-foreground active:scale-95",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-muted",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
          "forced-colors:text-[ButtonText] forced-colors:focus-visible:outline forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-[Highlight]"
        ),
        className
      )}
      {...props}
    >
      {children ?? <X aria-hidden="true" className="size-3.5" weight="bold" />}
    </Combobox.ChipRemove>
  );
});
ComboboxChipRemove.displayName = "ComboboxChipRemove";

// ---- BACKDROP / POSITIONER / POPUP ------------------------------------------

const ComboboxBackdrop = React.forwardRef<
  React.ElementRef<typeof Combobox.Backdrop>,
  ComboboxBackdropProps
>(function ComboboxBackdrop({ className, ...props }, ref) {
  return (
    <Combobox.Backdrop
      ref={ref}
      data-slot="combobox-backdrop"
      className={composeClassName<ComboboxBackdropProps>(
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
ComboboxBackdrop.displayName = "ComboboxBackdrop";

const ComboboxPositioner = React.forwardRef<
  React.ElementRef<typeof Combobox.Positioner>,
  ComboboxPositionerProps
>(function ComboboxPositioner(
  { className, sideOffset = 8, collisionPadding = 8, ...props },
  ref
) {
  return (
    <Combobox.Positioner
      ref={ref}
      data-slot="combobox-positioner"
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={composeClassName<ComboboxPositionerProps>(
        "z-50 max-w-[min(var(--available-width),calc(100vw-1rem))] outline-none data-[anchor-hidden]:pointer-events-none",
        className
      )}
      {...props}
    />
  );
});
ComboboxPositioner.displayName = "ComboboxPositioner";

const ComboboxPopup = React.forwardRef<
  React.ElementRef<typeof Combobox.Popup>,
  ComboboxPopupProps
>(function ComboboxPopup({ className, ...props }, ref) {
  return (
    <Combobox.Popup
      ref={ref}
      data-slot="combobox-popup"
      className={composeClassName<ComboboxPopupProps>(
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
ComboboxPopup.displayName = "ComboboxPopup";

const ComboboxArrow = React.forwardRef<
  React.ElementRef<typeof Combobox.Arrow>,
  ComboboxArrowProps
>(function ComboboxArrow({ className, children, ...props }, ref) {
  return (
    <Combobox.Arrow
      ref={ref}
      data-slot="combobox-arrow"
      className={composeClassName<ComboboxArrowProps>(
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
    </Combobox.Arrow>
  );
});
ComboboxArrow.displayName = "ComboboxArrow";

// ---- STATUS / EMPTY ----------------------------------------------------------

const ComboboxStatus = React.forwardRef<
  React.ElementRef<typeof Combobox.Status>,
  ComboboxStatusProps
>(function ComboboxStatus({ className, ...props }, ref) {
  return (
    <Combobox.Status
      ref={ref}
      data-slot="combobox-status"
      className={composeClassName<ComboboxStatusProps>(
        "min-h-8 px-3 py-2 text-xs leading-4 text-muted-foreground forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    />
  );
});
ComboboxStatus.displayName = "ComboboxStatus";

const ComboboxEmpty = React.forwardRef<
  React.ElementRef<typeof Combobox.Empty>,
  ComboboxEmptyProps
>(function ComboboxEmpty(
  { className, children = "No results found.", ...props },
  ref
) {
  return (
    <Combobox.Empty
      ref={ref}
      data-slot="combobox-empty"
      className={composeClassName<ComboboxEmptyProps>(
        "px-3 py-6 text-center text-sm leading-5 text-muted-foreground [&:empty]:h-0 [&:empty]:overflow-hidden [&:empty]:p-0 forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    >
      {children}
    </Combobox.Empty>
  );
});
ComboboxEmpty.displayName = "ComboboxEmpty";

// ---- LIST / ITEMS ------------------------------------------------------------

const ComboboxList = React.forwardRef<
  React.ElementRef<typeof Combobox.List>,
  ComboboxListProps
>(function ComboboxList({ className, ...props }, ref) {
  return (
    <Combobox.List
      ref={ref}
      data-slot="combobox-list"
      className={composeClassName<ComboboxListProps>(
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
ComboboxList.displayName = "ComboboxList";

const ComboboxRow = React.forwardRef<
  React.ElementRef<typeof Combobox.Row>,
  ComboboxRowProps
>(function ComboboxRow({ className, ...props }, ref) {
  return (
    <Combobox.Row
      ref={ref}
      data-slot="combobox-row"
      className={composeClassName<ComboboxRowProps>(
        "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-1",
        className
      )}
      {...props}
    />
  );
});
ComboboxRow.displayName = "ComboboxRow";

const ComboboxItem = React.memo(
  React.forwardRef<React.ElementRef<typeof Combobox.Item>, ComboboxItemProps>(
    function ComboboxItem({ className, children, ...props }, ref) {
      return (
        <Combobox.Item
          ref={ref}
          data-slot="combobox-item"
          className={composeClassName<ComboboxItemProps>(
            cn(
              "relative flex min-h-10 w-full min-w-0 cursor-default select-none items-center gap-2 rounded-[10px] py-2 pl-8 pr-3 text-sm leading-5 outline-none",
              "transition-[background-color,color] duration-100 ease-out motion-reduce:transition-none",
              "hover:bg-muted hover:text-foreground",
              "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
              "forced-colors:data-[highlighted]:bg-[Highlight] forced-colors:data-[highlighted]:text-[HighlightText]"
            ),
            className
          )}
          {...props}
        >
          <ComboboxItemIndicator />
          <span
            data-slot="combobox-item-text"
            className="min-w-0 flex-1 truncate"
          >
            {children}
          </span>
        </Combobox.Item>
      );
    }
  )
);
ComboboxItem.displayName = "ComboboxItem";

const ComboboxItemIndicator = React.forwardRef<
  React.ElementRef<typeof Combobox.ItemIndicator>,
  ComboboxItemIndicatorProps
>(function ComboboxItemIndicator({ className, children, ...props }, ref) {
  return (
    <Combobox.ItemIndicator
      ref={ref}
      data-slot="combobox-item-indicator"
      className={composeClassName<ComboboxItemIndicatorProps>(
        cn(
          "absolute left-3 inline-flex size-4 items-center justify-center text-foreground",
          "transition-opacity duration-100 ease-out motion-reduce:transition-none",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
        ),
        className
      )}
      {...props}
    >
      {children ?? (
        <Check aria-hidden="true" className="size-4" weight="bold" />
      )}
    </Combobox.ItemIndicator>
  );
});
ComboboxItemIndicator.displayName = "ComboboxItemIndicator";

const ComboboxSeparator = React.forwardRef<
  React.ElementRef<typeof Combobox.Separator>,
  ComboboxSeparatorProps
>(function ComboboxSeparator({ className, ...props }, ref) {
  return (
    <Combobox.Separator
      ref={ref}
      data-slot="combobox-separator"
      className={composeClassName<ComboboxSeparatorProps>(
        "-mx-1 my-1 h-px bg-border forced-colors:bg-[CanvasText]",
        className
      )}
      {...props}
    />
  );
});
ComboboxSeparator.displayName = "ComboboxSeparator";

// ---- GROUPS -----------------------------------------------------------------

const ComboboxGroup = React.forwardRef<
  React.ElementRef<typeof Combobox.Group>,
  ComboboxGroupProps
>(function ComboboxGroup({ className, ...props }, ref) {
  return (
    <Combobox.Group
      ref={ref}
      data-slot="combobox-group"
      className={composeClassName<ComboboxGroupProps>(
        "py-1 first:pt-0 last:pb-0",
        className
      )}
      {...props}
    />
  );
});
ComboboxGroup.displayName = "ComboboxGroup";

const ComboboxGroupLabel = React.forwardRef<
  React.ElementRef<typeof Combobox.GroupLabel>,
  ComboboxGroupLabelProps
>(function ComboboxGroupLabel({ className, ...props }, ref) {
  return (
    <Combobox.GroupLabel
      ref={ref}
      data-slot="combobox-group-label"
      className={composeClassName<ComboboxGroupLabelProps>(
        "px-3 pb-1 pt-2 text-xs font-medium leading-4 text-muted-foreground forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    />
  );
});
ComboboxGroupLabel.displayName = "ComboboxGroupLabel";

// ---- EXPORTS ----------------------------------------------------------------

export {
  ComboboxRoot,
  ComboboxLabel,
  ComboboxValue,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxInputWrapper,
  ComboboxTrigger,
  ComboboxIcon,
  ComboboxClear,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxList,
  ComboboxPortal,
  ComboboxBackdrop,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxArrow,
  ComboboxStatus,
  ComboboxEmpty,
  ComboboxCollection,
  ComboboxRow,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxSeparator,
  useComboboxFilter,
  useComboboxFilteredItems,
};

export type { ComboboxFilter, ComboboxFilterOptions };
