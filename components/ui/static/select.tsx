/**
 * Select — dropdown for choosing a single (or multiple) value from a list.
 *
 * Built on Base UI's Select primitive. For free-text filtering or large
 * lists, prefer `Combobox`. For multi-select UX with chips, prefer
 * `Combobox` with `multiple`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.3.0
 * @brand      edbn/ui — <https://ui.edbn.me>
 * @docs       https://ui.edbn.me/docs/components/select
 * @source     https://ui.edbn.me/r/select.json
 * @registry   https://ui.edbn.me/r
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/select
 * @a11y       WAI-ARIA Listbox pattern; keyboard navigation (ArrowUp /
 *             ArrowDown, Home / End, type-to-search); form participation
 *             via hidden input; focus trap within popup; respects
 *             `prefers-reduced-motion`.
 *
 * ## Anatomy
 * ```tsx
 * <SelectRoot defaultValue="light">
 *   <SelectTrigger>
 *     <SelectValue placeholder="Pick a theme" />
 *   </SelectTrigger>
 *   <SelectPortal>
 *     <SelectPositioner sideOffset={4}>
 *       <SelectScrollUpArrow />
 *       <SelectPopup>
 *         <SelectList>
 *           <SelectGroup>
 *             <SelectGroupLabel>Themes</SelectGroupLabel>
 *             <SelectItem value="light">
 *               <SelectItemIndicator />
 *               <SelectItemText>Light</SelectItemText>
 *             </SelectItem>
 *             <SelectItem value="dark">
 *               <SelectItemIndicator />
 *               <SelectItemText>Dark</SelectItemText>
 *             </SelectItem>
 *           </SelectGroup>
 *         </SelectList>
 *       </SelectPopup>
 *       <SelectScrollDownArrow />
 *     </SelectPositioner>
 *   </SelectPortal>
 * </SelectRoot>
 * ```
 * @registryDescription Accessible select dropdown with search and keyboard navigation.
 */
"use client";

import * as React from "react";
import { Select } from "@base-ui/react/select";
import { Check, CaretUpDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- SELECT ROOT ------------------------------------------------------------

/**
 * Top-level Select provider. Forwards all Base UI `Select.Root` props:
 * `actionsRef`, `autoComplete`, `defaultOpen`, `defaultValue`, `disabled`,
 * `highlightItemOnHover`, `id`, `inputRef`, `isItemEqualToValue`,
 * `itemToStringLabel`, `itemToStringValue`, `items`, `modal`, `multiple`,
 * `name`, `onOpenChange`, `onOpenChangeComplete`, `onValueChange`, `open`,
 * `readOnly`, `required`, `value`.
 *
 * Aliased directly to `Select.Root` to preserve generic type inference
 * over the value parameter.
 *
 * @since 0.3.0
 */
export type SelectRootProps = React.ComponentProps<typeof Select.Root>;
const SelectRoot = Select.Root;

// ---- SELECT TRIGGER ---------------------------------------------------------

/**
 * The button that opens the select menu. Auto-emits a trailing
 * `CaretUpDown` icon via `SelectIcon` unless `children` already include one.
 *
 * **Data attributes** — `data-dirty`, `data-disabled`, `data-filled`,
 * `data-focused`, `data-invalid`, `data-placeholder`, `data-popup-open`,
 * `data-pressed`, `data-readonly`, `data-required`, `data-touched`,
 * `data-valid`.
 *
 * @since 0.3.0
 */
export type SelectTriggerProps = React.ComponentProps<typeof Select.Trigger>;
function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <Select.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
        "transition-colors",
        "data-placeholder:text-muted-foreground",
        "hover:bg-muted/40",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-popup-open:outline-2 data-popup-open:outline-offset-2 data-popup-open:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:outline-destructive",
        className
      )}
      {...props}
    >
      {children}
      <Select.Icon
        data-slot="select-icon"
        className="flex size-4 shrink-0 opacity-60 data-popup-open:opacity-100"
      >
        <CaretUpDown aria-hidden className="size-4" weight="bold" />
      </Select.Icon>
    </Select.Trigger>
  );
}
SelectTrigger.displayName = "SelectTrigger";

// ---- SELECT VALUE -----------------------------------------------------------

/**
 * Displays the current selection inside the trigger. Provide `placeholder`
 * for the empty state.
 *
 * **Data attributes** — `data-placeholder`.
 *
 * @since 0.3.0
 */
export type SelectValueProps = React.ComponentProps<typeof Select.Value>;
function SelectValue({ className, ...props }: SelectValueProps) {
  return (
    <Select.Value
      data-slot="select-value"
      className={cn("truncate", className)}
      {...props}
    />
  );
}
SelectValue.displayName = "SelectValue";

// ---- SELECT ICON ------------------------------------------------------------

/**
 * Trigger's end-adornment icon. `SelectTrigger` renders one automatically;
 * export exposed for rare custom trigger compositions.
 *
 * **Data attributes** — `data-popup-open`.
 *
 * @since 0.3.0
 */
export type SelectIconProps = React.ComponentProps<typeof Select.Icon>;
function SelectIcon({ className, ...props }: SelectIconProps) {
  return (
    <Select.Icon
      data-slot="select-icon"
      className={cn("flex size-4 shrink-0 opacity-60", className)}
      {...props}
    />
  );
}
SelectIcon.displayName = "SelectIcon";

// ---- SELECT PORTAL ----------------------------------------------------------

/**
 * Portals the popup into a stable DOM location.
 *
 * @since 0.3.0
 */
export type SelectPortalProps = React.ComponentProps<typeof Select.Portal>;
const SelectPortal = (props: SelectPortalProps) => <Select.Portal {...props} />;
SelectPortal.displayName = "SelectPortal";

// ---- SELECT BACKDROP --------------------------------------------------------

/**
 * Optional dimming backdrop when `modal` is true.
 *
 * **Data attributes** — `data-closed`, `data-ending-style`, `data-open`,
 * `data-starting-style`.
 *
 * @since 0.3.0
 */
export type SelectBackdropProps = React.ComponentProps<typeof Select.Backdrop>;
function SelectBackdrop({ className, ...props }: SelectBackdropProps) {
  return (
    <Select.Backdrop
      data-slot="select-backdrop"
      className={cn(
        "fixed inset-0 z-40 bg-black/30",
        "transition-opacity duration-150 ease-out",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    />
  );
}
SelectBackdrop.displayName = "SelectBackdrop";

// ---- SELECT POSITIONER ------------------------------------------------------

/**
 * Positions the popup. Set `alignItemWithTrigger={false}` to disable the
 * "selected item floats over trigger" behavior.
 *
 * **Data attributes** — `data-align`, `data-anchor-hidden`, `data-closed`,
 * `data-open`, `data-side`.
 *
 * **CSS variables** — `--anchor-height`, `--anchor-width`,
 * `--available-height`, `--available-width`, `--transform-origin`.
 *
 * @since 0.3.0
 */
export type SelectPositionerProps = React.ComponentProps<
  typeof Select.Positioner
>;
function SelectPositioner({
  className,
  sideOffset = 4,
  ...props
}: SelectPositionerProps) {
  return (
    <Select.Positioner
      data-slot="select-positioner"
      sideOffset={sideOffset}
      className={cn("z-50 max-h-(--available-height)", className)}
      {...props}
    />
  );
}
SelectPositioner.displayName = "SelectPositioner";

// ---- SELECT POPUP -----------------------------------------------------------

/**
 * The listbox surface.
 *
 * **Data attributes** — `data-align`, `data-closed`, `data-ending-style`,
 * `data-open`, `data-side`, `data-starting-style`.
 *
 * @since 0.3.0
 */
export type SelectPopupProps = React.ComponentProps<typeof Select.Popup>;
function SelectPopup({ className, ...props }: SelectPopupProps) {
  return (
    <Select.Popup
      data-slot="select-popup"
      className={cn(
        "z-50 min-w-(--anchor-width) overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl",
        "origin-(--transform-origin) transform-gpu",
        "transition-[scale,opacity] duration-150 ease-out",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        "motion-reduce:transform-none motion-reduce:transition-opacity",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        "focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
SelectPopup.displayName = "SelectPopup";

// ---- SELECT ARROW -----------------------------------------------------------

/**
 * Optional arrow pointing to the trigger.
 *
 * **Data attributes** — `data-align`, `data-closed`, `data-open`,
 * `data-side`, `data-uncentered`.
 *
 * @since 0.3.0
 */
export type SelectArrowProps = React.ComponentProps<typeof Select.Arrow>;
function SelectArrow({ className, children, ...props }: SelectArrowProps) {
  return (
    <Select.Arrow
      data-slot="select-arrow"
      className={cn(
        "data-[side=top]:rotate-180",
        "data-[side=left]:-rotate-90",
        "data-[side=right]:rotate-90",
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          aria-hidden
          width="14"
          height="7"
          viewBox="0 0 14 7"
          className="block fill-popover stroke-border"
        >
          <path d="M0,0 L7,7 L14,0" strokeWidth="1" />
        </svg>
      )}
    </Select.Arrow>
  );
}
SelectArrow.displayName = "SelectArrow";

// ---- SELECT LIST ------------------------------------------------------------

/**
 * Listbox container. Required parent of `SelectItem` / `SelectGroup`.
 *
 * @since 0.3.0
 */
export type SelectListProps = React.ComponentProps<typeof Select.List>;
function SelectList({ className, ...props }: SelectListProps) {
  return (
    <Select.List
      data-slot="select-list"
      className={cn(
        "max-h-(--available-height) overflow-y-auto overscroll-contain p-0.5",
        className
      )}
      {...props}
    />
  );
}
SelectList.displayName = "SelectList";

// ---- SELECT ITEM ------------------------------------------------------------

/**
 * Selectable row. Wraps `SelectItemText` for the label and
 * `SelectItemIndicator` for the checkmark.
 *
 * **Data attributes** — `data-disabled`, `data-highlighted`,
 * `data-selected`.
 *
 * @since 0.3.0
 */
export type SelectItemProps = React.ComponentProps<typeof Select.Item>;
function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <Select.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm select-none outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </Select.Item>
  );
}
SelectItem.displayName = "SelectItem";

// ---- SELECT ITEM TEXT -------------------------------------------------------

/**
 * Label inside a `SelectItem`. Also used internally by Base UI to render
 * the selected value inside `SelectValue`.
 *
 * @since 0.3.0
 */
export type SelectItemTextProps = React.ComponentProps<typeof Select.ItemText>;
function SelectItemText({ className, ...props }: SelectItemTextProps) {
  return (
    <Select.ItemText
      data-slot="select-item-text"
      className={cn("truncate", className)}
      {...props}
    />
  );
}
SelectItemText.displayName = "SelectItemText";

// ---- SELECT ITEM INDICATOR --------------------------------------------------

/**
 * Absolutely-positioned check icon for selected items. Renders a Phosphor
 * `Check` by default.
 *
 * @since 0.3.0
 */
export type SelectItemIndicatorProps = React.ComponentProps<
  typeof Select.ItemIndicator
>;
function SelectItemIndicator({
  className,
  children,
  ...props
}: SelectItemIndicatorProps) {
  return (
    <Select.ItemIndicator
      data-slot="select-item-indicator"
      className={cn(
        "absolute left-2 flex size-4 items-center justify-center text-foreground",
        className
      )}
      {...props}
    >
      {children ?? <Check aria-hidden className="size-4" weight="bold" />}
    </Select.ItemIndicator>
  );
}
SelectItemIndicator.displayName = "SelectItemIndicator";

// ---- SELECT GROUP + LABEL + SEPARATOR ---------------------------------------

/**
 * Groups a set of related items. Pair with `SelectGroupLabel` for heading.
 *
 * @since 0.3.0
 */
export type SelectGroupProps = React.ComponentProps<typeof Select.Group>;
function SelectGroup({ className, ...props }: SelectGroupProps) {
  return (
    <Select.Group data-slot="select-group" className={className} {...props} />
  );
}
SelectGroup.displayName = "SelectGroup";

/**
 * Label for a `SelectGroup`. Non-interactive.
 *
 * @since 0.3.0
 */
export type SelectGroupLabelProps = React.ComponentProps<
  typeof Select.GroupLabel
>;
function SelectGroupLabel({ className, ...props }: SelectGroupLabelProps) {
  return (
    <Select.GroupLabel
      data-slot="select-group-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
SelectGroupLabel.displayName = "SelectGroupLabel";

/**
 * Thin horizontal rule separator.
 *
 * @since 0.3.0
 */
export type SelectSeparatorProps = React.ComponentProps<
  typeof Select.Separator
>;
function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <Select.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
SelectSeparator.displayName = "SelectSeparator";

// ---- SELECT SCROLL ARROWS ---------------------------------------------------

/**
 * Visible-only-when-needed scroll hint for long lists (top edge).
 *
 * **Data attributes** — `data-direction`, `data-ending-style`,
 * `data-side`, `data-starting-style`, `data-visible`.
 *
 * @since 0.3.0
 */
export type SelectScrollUpArrowProps = React.ComponentProps<
  typeof Select.ScrollUpArrow
>;
function SelectScrollUpArrow({
  className,
  ...props
}: SelectScrollUpArrowProps) {
  return (
    <Select.ScrollUpArrow
      data-slot="select-scroll-up-arrow"
      className={cn(
        "sticky top-0 z-10 flex h-6 items-center justify-center bg-popover text-muted-foreground",
        "before:absolute before:inset-0 before:-bottom-3 before:bg-linear-to-b before:from-popover before:to-transparent before:content-['']",
        className
      )}
      {...props}
    />
  );
}
SelectScrollUpArrow.displayName = "SelectScrollUpArrow";

/**
 * Visible-only-when-needed scroll hint for long lists (bottom edge).
 *
 * @since 0.3.0
 */
export type SelectScrollDownArrowProps = React.ComponentProps<
  typeof Select.ScrollDownArrow
>;
function SelectScrollDownArrow({
  className,
  ...props
}: SelectScrollDownArrowProps) {
  return (
    <Select.ScrollDownArrow
      data-slot="select-scroll-down-arrow"
      className={cn(
        "sticky bottom-0 z-10 flex h-6 items-center justify-center bg-popover text-muted-foreground",
        "before:absolute before:inset-0 before:-top-3 before:bg-linear-to-t before:from-popover before:to-transparent before:content-['']",
        className
      )}
      {...props}
    />
  );
}
SelectScrollDownArrow.displayName = "SelectScrollDownArrow";

// ---- EXPORTS ----------------------------------------------------------------

export {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectPositioner,
  SelectPopup,
  SelectArrow,
  SelectList,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectGroup,
  SelectGroupLabel,
  SelectSeparator,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
};
