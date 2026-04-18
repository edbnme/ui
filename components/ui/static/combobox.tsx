/**
 * Combobox — Searchable, filterable dropdown with multi-select, chips, and
 * virtualised list support.
 *
 * The most feature-dense picker in the library. Use when users need to
 * search/filter through options, select one or many, or see inline chips for
 * current selections. For a narrower "type-ahead-only" experience, reach for
 * `Autocomplete` instead.
 *
 * Anatomy:
 * ```tsx
 * <ComboboxRoot items={items} multiple>
 *   <ComboboxInputWrapper>
 *     <ComboboxChips>
 *       <ComboboxChip>…<ComboboxChipRemove /></ComboboxChip>
 *     </ComboboxChips>
 *     <ComboboxInput placeholder="Search…" />
 *     <ComboboxClear />
 *     <ComboboxTrigger />
 *   </ComboboxInputWrapper>
 *   <ComboboxPortal>
 *     <ComboboxPositioner>
 *       <ComboboxPopup>
 *         <ComboboxStatus />
 *         <ComboboxList>
 *           <ComboboxGroup>
 *             <ComboboxGroupLabel>Group</ComboboxGroupLabel>
 *             <ComboboxItem value="…">Item</ComboboxItem>
 *           </ComboboxGroup>
 *           <ComboboxEmpty />
 *         </ComboboxList>
 *       </ComboboxPopup>
 *     </ComboboxPositioner>
 *   </ComboboxPortal>
 * </ComboboxRoot>
 * ```
 *
 * Keyboard: Up/Down, Home/End, PageUp/PageDown navigate; Enter selects;
 * Escape clears; Backspace on empty input pops last chip (multiple mode).
 *
 * Motion: scale + opacity enter/exit, respects `prefers-reduced-motion`.
 *
 * @version 0.3.0
 * @package    @edbn/ui
 * @brand      edbn/ui -- https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/combobox
 * @upstream   Base UI v1.2.0 -- https://base-ui.com/react/components/combobox
 * @registryDescription Searchable dropdown for filtering and selecting from a list, built on Base UI Combobox.
 */

"use client";

import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { CaretUpDown, Check } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

/**
 * Stateful root — owns selected value(s), filter text, open state, and the
 * items collection. Supports `items`, `defaultValue`/`value`, `multiple`,
 * `filter`, `virtualized`, and controlled/uncontrolled `open`.
 *
 * @since 0.1.0
 */
const ComboboxRoot = Combobox.Root;

// ---- INPUT WRAPPER ----------------------------------------------------------

type ComboboxInputWrapperProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Visual wrapper that groups `ComboboxInput`, chips, icons, clear, and
 * trigger into a single bordered field.
 *
 * This is a composition helper (not a Base UI primitive) — it exists so the
 * common "input with icons inside" pattern stays DRY across consumers.
 *
 * @since 0.1.0
 */
function ComboboxInputWrapper({
  className,
  children,
  ...props
}: ComboboxInputWrapperProps) {
  return (
    <div
      data-slot="combobox-input-wrapper"
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2",
        "rounded-md border border-input bg-transparent px-3 text-sm shadow-sm",
        "focus-within:ring-1 focus-within:ring-ring",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
ComboboxInputWrapper.displayName = "ComboboxInputWrapper";

// ---- INPUT ------------------------------------------------------------------

type ComboboxInputProps = React.ComponentPropsWithoutRef<typeof Combobox.Input>;

/**
 * The text field users type into. Wires up ARIA combobox semantics
 * automatically and owns the filter state via `Combobox.Root`.
 *
 * Data attributes:
 * - `data-popup-open` — while the list is visible
 * - `data-disabled`, `data-readonly` — forwarded from root
 *
 * @since 0.1.0
 */
function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <Combobox.Input
      data-slot="combobox-input"
      className={cn(
        "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
ComboboxInput.displayName = "ComboboxInput";

// ---- TRIGGER ----------------------------------------------------------------

type ComboboxTriggerProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Trigger
>;

/**
 * Button that toggles the list open/closed. Defaults to a CaretUpDown glyph
 * — pass children to override.
 *
 * Data attributes:
 * - `data-popup-open` — reflects open state for styling
 *
 * @since 0.1.0
 */
function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxTriggerProps) {
  return (
    <Combobox.Trigger
      data-slot="combobox-trigger"
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
ComboboxTrigger.displayName = "ComboboxTrigger";

// ---- CLEAR ------------------------------------------------------------------

type ComboboxClearProps = React.ComponentPropsWithoutRef<typeof Combobox.Clear>;

/**
 * Button that resets the current value(s) and clears the input filter.
 * Base UI automatically hides this when there's nothing to clear.
 *
 * @since 0.1.0
 */
function ComboboxClear({ className, ...props }: ComboboxClearProps) {
  return (
    <Combobox.Clear
      data-slot="combobox-clear"
      className={cn(
        "h-5 w-5 rounded-sm opacity-50 transition-opacity hover:opacity-100",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
}
ComboboxClear.displayName = "ComboboxClear";

// ---- PORTAL -----------------------------------------------------------------

/**
 * Teleports the popup tree out of its DOM parent, preventing overflow
 * clipping inside scroll containers.
 *
 * @since 0.1.0
 */
const ComboboxPortal = Combobox.Portal;

// ---- BACKDROP ---------------------------------------------------------------

type ComboboxBackdropProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Backdrop
>;

/**
 * Full-viewport layer — render behind the popup for modal-flavoured
 * comboboxes where outside click should dismiss but still block page
 * interaction.
 *
 * @since 0.1.0
 */
function ComboboxBackdrop({ className, ...props }: ComboboxBackdropProps) {
  return (
    <Combobox.Backdrop
      data-slot="combobox-backdrop"
      className={cn("fixed inset-0 z-50", className)}
      {...props}
    />
  );
}
ComboboxBackdrop.displayName = "ComboboxBackdrop";

// ---- POSITIONER -------------------------------------------------------------

type ComboboxPositionerProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Positioner
>;

/**
 * Floating-UI positioner. Exposes `--anchor-width`, `--available-height`,
 * `--transform-origin` etc. for popup styling.
 *
 * @since 0.1.0
 */
function ComboboxPositioner({
  className,
  sideOffset = 4,
  ...props
}: ComboboxPositionerProps) {
  return (
    <Combobox.Positioner
      data-slot="combobox-positioner"
      sideOffset={sideOffset}
      className={cn("z-50 outline-none", className)}
      {...props}
    />
  );
}
ComboboxPositioner.displayName = "ComboboxPositioner";

// ---- POPUP ------------------------------------------------------------------

type ComboboxPopupProps = React.ComponentPropsWithoutRef<typeof Combobox.Popup>;

/**
 * The visible list container. Animates in/out with scale + opacity.
 *
 * Data attributes:
 * - `data-starting-style`, `data-ending-style` — drive enter/exit transitions
 * - `data-side`, `data-align` — forwarded for side-aware styling
 *
 * @since 0.1.0
 */
function ComboboxPopup({ className, ...props }: ComboboxPopupProps) {
  return (
    <Combobox.Popup
      data-slot="combobox-popup"
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
        "origin-(--transform-origin) transform-gpu transition-[scale,opacity] duration-150",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        "motion-reduce:transition-none",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        className
      )}
      {...props}
    />
  );
}
ComboboxPopup.displayName = "ComboboxPopup";

// ---- LIST -------------------------------------------------------------------

type ComboboxListProps = React.ComponentPropsWithoutRef<typeof Combobox.List>;

/**
 * Scrollable list owning ARIA listbox semantics. Supports virtualisation
 * when `Combobox.Root` is configured with `virtualized`.
 *
 * @since 0.1.0
 */
function ComboboxList({ className, ...props }: ComboboxListProps) {
  return (
    <Combobox.List
      data-slot="combobox-list"
      className={cn("max-h-72 overflow-y-auto", className)}
      {...props}
    />
  );
}
ComboboxList.displayName = "ComboboxList";

// ---- ITEM -------------------------------------------------------------------

type ComboboxItemProps = React.ComponentPropsWithoutRef<typeof Combobox.Item>;

/**
 * Selectable row. Automatically renders a check indicator for the currently
 * selected value(s) via embedded `Combobox.ItemIndicator`.
 *
 * Data attributes:
 * - `data-highlighted` — keyboard/pointer highlighted state
 * - `data-selected` — value matches root's selection
 * - `data-disabled`
 *
 * @since 0.1.0
 */
function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  return (
    <Combobox.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center"
      >
        <Combobox.ItemIndicator>
          <Check className="h-4 w-4" weight="bold" />
        </Combobox.ItemIndicator>
      </span>
    </Combobox.Item>
  );
}
ComboboxItem.displayName = "ComboboxItem";

// ---- ROW --------------------------------------------------------------------

type ComboboxRowProps = React.ComponentPropsWithoutRef<typeof Combobox.Row>;

/**
 * Virtualisation row — used internally when `virtualized` is enabled on
 * `ComboboxRoot`. Expose it so consumers can render custom virtualisers.
 *
 * @since 0.3.0
 */
function ComboboxRow({ className, ...props }: ComboboxRowProps) {
  return (
    <Combobox.Row
      data-slot="combobox-row"
      className={className}
      {...props}
    />
  );
}
ComboboxRow.displayName = "ComboboxRow";

// ---- COLLECTION -------------------------------------------------------------

/**
 * Low-level helper that renders `Root`'s `items` with a render-prop callback
 * — useful for grouped or nested collections.
 *
 * @since 0.3.0
 */
const ComboboxCollection = Combobox.Collection;

// ---- GROUP + GROUP LABEL ----------------------------------------------------

/**
 * Logical grouping of items. Pair with `ComboboxGroupLabel` for a heading.
 *
 * @since 0.1.0
 */
const ComboboxGroup = Combobox.Group;

type ComboboxGroupLabelProps = React.ComponentPropsWithoutRef<
  typeof Combobox.GroupLabel
>;

/**
 * Heading for a `ComboboxGroup`. Not focusable.
 *
 * @since 0.1.0
 */
function ComboboxGroupLabel({
  className,
  ...props
}: ComboboxGroupLabelProps) {
  return (
    <Combobox.GroupLabel
      data-slot="combobox-group-label"
      className={cn(
        "px-2 py-1.5 text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
ComboboxGroupLabel.displayName = "ComboboxGroupLabel";

// ---- EMPTY ------------------------------------------------------------------

type ComboboxEmptyProps = React.ComponentPropsWithoutRef<typeof Combobox.Empty>;

/**
 * Rendered when the filter produces no matching items.
 *
 * @since 0.1.0
 */
function ComboboxEmpty({
  className,
  children = "No results found.",
  ...props
}: ComboboxEmptyProps) {
  return (
    <Combobox.Empty
      data-slot="combobox-empty"
      className={cn(
        "py-6 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Combobox.Empty>
  );
}
ComboboxEmpty.displayName = "ComboboxEmpty";

// ---- ARROW ------------------------------------------------------------------

type ComboboxArrowProps = React.ComponentPropsWithoutRef<typeof Combobox.Arrow>;

/**
 * Decorative pointer — styled via `[&>svg]:fill-popover` so custom arrow
 * SVGs inherit the popover palette.
 *
 * @since 0.1.0
 */
function ComboboxArrow({ className, ...props }: ComboboxArrowProps) {
  return (
    <Combobox.Arrow
      data-slot="combobox-arrow"
      className={cn(
        "relative -top-px -z-10",
        "[&>svg]:fill-popover [&>svg]:stroke-border",
        className
      )}
      {...props}
    />
  );
}
ComboboxArrow.displayName = "ComboboxArrow";

// ---- SEPARATOR --------------------------------------------------------------

type ComboboxSeparatorProps = React.ComponentPropsWithoutRef<
  typeof Combobox.Separator
>;

/**
 * Horizontal rule between groups of items.
 *
 * @since 0.1.0
 */
function ComboboxSeparator({ className, ...props }: ComboboxSeparatorProps) {
  return (
    <Combobox.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
ComboboxSeparator.displayName = "ComboboxSeparator";

// ---- PASSTHROUGHS -----------------------------------------------------------

/**
 * Decorative leading icon slot inside the input wrapper.
 * @since 0.1.0
 */
const ComboboxIcon = Combobox.Icon;

/**
 * Reads the currently selected value — supports a render-prop for custom
 * display (e.g. rendering labels instead of keys).
 * @since 0.1.0
 */
const ComboboxValue = Combobox.Value;

/**
 * Check-style indicator nested inside `ComboboxItem`; exposed for bespoke
 * item renderers.
 * @since 0.1.0
 */
const ComboboxItemIndicator = Combobox.ItemIndicator;

/**
 * Live-region container announcing loading / count / empty states.
 * @since 0.1.0
 */
const ComboboxStatus = Combobox.Status;

/**
 * Container for the chip cloud (multi-select mode).
 * @since 0.1.0
 */
const ComboboxChips = Combobox.Chips;

/**
 * Individual chip representing one selected value.
 * @since 0.1.0
 */
const ComboboxChip = Combobox.Chip;

/**
 * Button inside a chip that deselects its value.
 * @since 0.1.0
 */
const ComboboxChipRemove = Combobox.ChipRemove;

// ---- EXPORTS ----------------------------------------------------------------

export {
  ComboboxRoot,
  ComboboxInputWrapper,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxPortal,
  ComboboxBackdrop,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxRow,
  ComboboxCollection,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxArrow,
  ComboboxSeparator,
  ComboboxIcon,
  ComboboxValue,
  ComboboxItemIndicator,
  ComboboxStatus,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
};

export type {
  ComboboxInputWrapperProps,
  ComboboxInputProps,
  ComboboxTriggerProps,
  ComboboxClearProps,
  ComboboxBackdropProps,
  ComboboxPositionerProps,
  ComboboxPopupProps,
  ComboboxListProps,
  ComboboxItemProps,
  ComboboxRowProps,
  ComboboxGroupLabelProps,
  ComboboxEmptyProps,
  ComboboxArrowProps,
  ComboboxSeparatorProps,
};
