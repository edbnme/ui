/**
 * Autocomplete — Searchable input with suggestion dropdown.
 *
 * A focused variant of `Combobox` tuned for the classic "search field with
 * filtered suggestions" pattern — narrower prop surface, no chips, and a
 * styling treatment that reads more like an input than a dropdown.
 *
 * Intentionally built on the same `Combobox` primitive as the full combobox
 * so the two components share keyboard navigation, ARIA semantics, and
 * filter behaviour. Use `Autocomplete` when you want the narrower API; reach
 * for `Combobox` when you need multi-select, chips, or virtualised items.
 *
 * Anatomy:
 * ```tsx
 * <AutocompleteRoot items={items}>
 *   <AutocompleteInput placeholder="Search…" />
 *   <AutocompletePortal>
 *     <AutocompletePositioner>
 *       <AutocompletePopup>
 *         <AutocompleteStatus />
 *         <AutocompleteList>
 *           <AutocompleteGroup>
 *             <AutocompleteGroupLabel>…</AutocompleteGroupLabel>
 *             <AutocompleteItem value="…">…</AutocompleteItem>
 *           </AutocompleteGroup>
 *         </AutocompleteList>
 *         <AutocompleteEmpty />
 *       </AutocompletePopup>
 *     </AutocompletePositioner>
 *   </AutocompletePortal>
 * </AutocompleteRoot>
 * ```
 *
 * Accessibility: wires combobox ARIA semantics automatically. The status
 * slot uses a live region so result counts reach screen readers.
 *
 * Motion: scale + opacity enter/exit, respects `prefers-reduced-motion`.
 *
 * @version 0.3.0
 * @package    @edbn/ui
 * @brand      edbn/ui -- https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/autocomplete
 * @upstream   Base UI v1.2.0 -- https://base-ui.com/react/components/combobox
 * @registryDescription Searchable dropdown with filtering, keyboard navigation, and empty state.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { CaretUpDown, Check, MagnifyingGlass } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

/**
 * Stateful root — owns the filter text, selection, and items collection.
 * Supports `items`, `defaultValue`/`value`, `filter`, and controlled/
 * uncontrolled `open` / `inputValue` via `onInputValueChange`.
 *
 * @since 0.1.0
 */
const AutocompleteRoot = Combobox.Root;

// ---- INPUT ------------------------------------------------------------------

type AutocompleteInputProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Input
> & {
  /** Show a leading magnifying glass icon. Defaults to `true`. */
  showSearchIcon?: boolean;
};

/**
 * The search field. Wires ARIA combobox semantics automatically and owns
 * the filter state via the root.
 *
 * Renders inside a relative wrapper when `showSearchIcon` is true, with the
 * icon positioned over the leading edge. Set `showSearchIcon={false}` for a
 * plain input without the glyph.
 *
 * @since 0.1.0
 */
function AutocompleteInput({
  className,
  showSearchIcon = true,
  ...props
}: AutocompleteInputProps) {
  return (
    <div className="relative w-full" data-slot="autocomplete-input-wrapper">
      {showSearchIcon && (
        <MagnifyingGlass
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50"
          aria-hidden
        />
      )}
      <Combobox.Input
        data-slot="autocomplete-input"
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background text-sm",
          "shadow-xs ring-offset-background",
          "transition-[border-color,box-shadow] duration-150",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
          "placeholder:text-muted-foreground/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          showSearchIcon ? "pl-10 pr-3.5" : "px-3.5",
          className
        )}
        {...props}
      />
    </div>
  );
}
AutocompleteInput.displayName = "AutocompleteInput";

// ---- TRIGGER ----------------------------------------------------------------

type AutocompleteTriggerProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Trigger
>;

/**
 * Optional toggle button — useful when the field doubles as a combobox or
 * when users need an explicit affordance to open the suggestions.
 *
 * @since 0.1.0
 */
function AutocompleteTrigger({
  className,
  children,
  ...props
}: AutocompleteTriggerProps) {
  return (
    <Combobox.Trigger
      data-slot="autocomplete-trigger"
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center opacity-50 transition-opacity hover:opacity-100",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {children ?? <CaretUpDown className="h-4 w-4" />}
    </Combobox.Trigger>
  );
}
AutocompleteTrigger.displayName = "AutocompleteTrigger";

// ---- CLEAR ------------------------------------------------------------------

type AutocompleteClearProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Clear
>;

/**
 * Button that clears the current input text and selection.
 *
 * @since 0.3.0
 */
function AutocompleteClear({ className, ...props }: AutocompleteClearProps) {
  return (
    <Combobox.Clear
      data-slot="autocomplete-clear"
      className={cn(
        "h-5 w-5 rounded-sm opacity-50 transition-opacity hover:opacity-100",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
}
AutocompleteClear.displayName = "AutocompleteClear";

// ---- PORTAL -----------------------------------------------------------------

/**
 * Teleports the popup out of its DOM parent, avoiding overflow clipping.
 *
 * @since 0.1.0
 */
const AutocompletePortal = Combobox.Portal;

// ---- BACKDROP ---------------------------------------------------------------

type AutocompleteBackdropProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Backdrop
>;

/**
 * Full-viewport layer — rarely used for autocomplete but included for
 * modal-flavoured variants.
 *
 * @since 0.1.0
 */
function AutocompleteBackdrop({
  className,
  ...props
}: AutocompleteBackdropProps) {
  return (
    <Combobox.Backdrop
      data-slot="autocomplete-backdrop"
      className={cn("fixed inset-0 z-50", className)}
      {...props}
    />
  );
}
AutocompleteBackdrop.displayName = "AutocompleteBackdrop";

// ---- POSITIONER -------------------------------------------------------------

type AutocompletePositionerProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Positioner
>;

/**
 * Floating-UI wrapper — exposes `--anchor-width` so the popup can mirror
 * the input width (applied by default in `AutocompletePopup`).
 *
 * @since 0.1.0
 */
function AutocompletePositioner({
  className,
  sideOffset = 4,
  ...props
}: AutocompletePositionerProps) {
  return (
    <Combobox.Positioner
      data-slot="autocomplete-positioner"
      sideOffset={sideOffset}
      className={cn("z-50 outline-none", className)}
      {...props}
    />
  );
}
AutocompletePositioner.displayName = "AutocompletePositioner";

// ---- POPUP ------------------------------------------------------------------

type AutocompletePopupProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Popup
>;

/**
 * The visible suggestion surface. Mirrors the input width via
 * `w-(--anchor-width)` and animates in/out with scale + opacity.
 *
 * Data attributes:
 * - `data-starting-style`, `data-ending-style` — enter / exit transitions
 * - `data-side`, `data-align` — side-aware styling hooks
 *
 * @since 0.1.0
 */
function AutocompletePopup({ className, ...props }: AutocompletePopupProps) {
  return (
    <Combobox.Popup
      data-slot="autocomplete-popup"
      className={cn(
        "z-50 w-(--anchor-width) overflow-hidden rounded-lg border border-border/60 bg-popover p-1.5 text-popover-foreground",
        "shadow-lg ring-1 ring-black/3 dark:ring-white/6",
        "origin-(--transform-origin) transform-gpu transition-[scale,opacity] duration-200",
        "data-starting-style:scale-[0.97] data-starting-style:opacity-0",
        "data-ending-style:scale-[0.97] data-ending-style:opacity-0",
        "motion-reduce:transition-none",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        className
      )}
      {...props}
    />
  );
}
AutocompletePopup.displayName = "AutocompletePopup";

// ---- LIST -------------------------------------------------------------------

type AutocompleteListProps = React.ComponentPropsWithoutRef<
  typeof Combobox.List
>;

/**
 * Scrollable suggestion list. Subtle custom scrollbar avoids stealing focus
 * from the content.
 *
 * @since 0.1.0
 */
function AutocompleteList({ className, ...props }: AutocompleteListProps) {
  return (
    <Combobox.List
      data-slot="autocomplete-list"
      className={cn(
        "max-h-60 overflow-y-auto overscroll-contain py-0.5",
        "[&::-webkit-scrollbar]:w-1.5",
        "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/8",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        className
      )}
      {...props}
    />
  );
}
AutocompleteList.displayName = "AutocompleteList";

// ---- ITEM -------------------------------------------------------------------

type AutocompleteItemProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Item
>;

/**
 * Selectable suggestion. An embedded `Combobox.ItemIndicator` renders a
 * check glyph when the item matches the currently committed value.
 *
 * Data attributes:
 * - `data-highlighted` — keyboard / pointer focus
 * - `data-selected` — current value
 * - `data-disabled`
 *
 * @since 0.1.0
 */
function AutocompleteItem({
  className,
  children,
  ...props
}: AutocompleteItemProps) {
  return (
    <Combobox.Item
      data-slot="autocomplete-item"
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
      <span
        aria-hidden
        className="absolute right-2.5 flex size-4 items-center justify-center"
      >
        <Combobox.ItemIndicator>
          <Check className="h-4 w-4" weight="bold" />
        </Combobox.ItemIndicator>
      </span>
    </Combobox.Item>
  );
}
AutocompleteItem.displayName = "AutocompleteItem";

// ---- ROW --------------------------------------------------------------------

type AutocompleteRowProps = React.ComponentPropsWithoutRef<typeof Combobox.Row>;

/**
 * Virtualisation row — useful only when rendering very large lists with a
 * custom virtualiser.
 *
 * @since 0.3.0
 */
function AutocompleteRow({ className, ...props }: AutocompleteRowProps) {
  return (
    <Combobox.Row
      data-slot="autocomplete-row"
      className={className}
      {...props}
    />
  );
}
AutocompleteRow.displayName = "AutocompleteRow";

// ---- COLLECTION -------------------------------------------------------------

/**
 * Render-prop helper for walking the items collection — useful for grouped
 * or nested suggestion sets.
 *
 * @since 0.3.0
 */
const AutocompleteCollection = Combobox.Collection;

// ---- GROUP + GROUP LABEL ----------------------------------------------------

/**
 * Logical grouping of suggestions.
 *
 * @since 0.1.0
 */
const AutocompleteGroup = Combobox.Group;

type AutocompleteGroupLabelProps = React.ComponentPropsWithoutRef<
  typeof Combobox.GroupLabel
>;

/**
 * Heading for a `AutocompleteGroup`. Uppercase tracking reads as a section
 * label rather than suggestion content.
 *
 * @since 0.1.0
 */
function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompleteGroupLabelProps) {
  return (
    <Combobox.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn(
        "px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70",
        className
      )}
      {...props}
    />
  );
}
AutocompleteGroupLabel.displayName = "AutocompleteGroupLabel";

// ---- EMPTY ------------------------------------------------------------------

type AutocompleteEmptyProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Empty
>;

/**
 * Rendered when the filter produces no matches.
 *
 * @since 0.1.0
 */
function AutocompleteEmpty({
  className,
  children = "No results found.",
  ...props
}: AutocompleteEmptyProps) {
  return (
    <Combobox.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "py-8 text-center text-[13px] text-muted-foreground/60",
        className
      )}
      {...props}
    >
      {children}
    </Combobox.Empty>
  );
}
AutocompleteEmpty.displayName = "AutocompleteEmpty";

// ---- ARROW ------------------------------------------------------------------

type AutocompleteArrowProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Arrow
>;

/**
 * Decorative pointer.
 *
 * @since 0.1.0
 */
function AutocompleteArrow({ className, ...props }: AutocompleteArrowProps) {
  return (
    <Combobox.Arrow
      data-slot="autocomplete-arrow"
      className={cn(
        "relative -top-px -z-10",
        "[&>svg]:fill-popover [&>svg]:stroke-border",
        className
      )}
      {...props}
    />
  );
}
AutocompleteArrow.displayName = "AutocompleteArrow";

// ---- SEPARATOR --------------------------------------------------------------

type AutocompleteSeparatorProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Separator
>;

/**
 * Horizontal rule between groups.
 *
 * @since 0.1.0
 */
function AutocompleteSeparator({
  className,
  ...props
}: AutocompleteSeparatorProps) {
  return (
    <Combobox.Separator
      data-slot="autocomplete-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
AutocompleteSeparator.displayName = "AutocompleteSeparator";

// ---- PASSTHROUGHS -----------------------------------------------------------

/**
 * Decorative leading icon slot.
 * @since 0.1.0
 */
const AutocompleteIcon = Combobox.Icon;

/**
 * Reads the currently committed value via render-prop.
 * @since 0.1.0
 */
const AutocompleteValue = Combobox.Value;

/**
 * Check-style indicator nested inside `AutocompleteItem` — exposed for
 * bespoke item renderers that need to drive the check themselves.
 * @since 0.1.0
 */
const AutocompleteItemIndicator = Combobox.ItemIndicator;

/**
 * Live-region container announcing result counts / loading states.
 * @since 0.1.0
 */
const AutocompleteStatus = Combobox.Status;

// ---- EXPORTS ----------------------------------------------------------------

export {
  AutocompleteRoot,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteClear,
  AutocompletePortal,
  AutocompleteBackdrop,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteRow,
  AutocompleteCollection,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteArrow,
  AutocompleteSeparator,
  AutocompleteIcon,
  AutocompleteValue,
  AutocompleteItemIndicator,
  AutocompleteStatus,
};

export type {
  AutocompleteInputProps,
  AutocompleteTriggerProps,
  AutocompleteClearProps,
  AutocompleteBackdropProps,
  AutocompletePositionerProps,
  AutocompletePopupProps,
  AutocompleteListProps,
  AutocompleteItemProps,
  AutocompleteRowProps,
  AutocompleteGroupLabelProps,
  AutocompleteEmptyProps,
  AutocompleteArrowProps,
  AutocompleteSeparatorProps,
};
