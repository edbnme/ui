/**
 * NumberField — Numeric input with increment / decrement controls and an
 * optional "scrub area" for drag-to-adjust.
 *
 * Built on the Base UI `NumberField` primitive. Supports locale-aware
 * formatting, min / max clamping, step increments, mouse-wheel nudging,
 * and an opt-in pointer-drag scrub target (think Photoshop's numeric
 * inputs).
 *
 * Anatomy (standard):
 * ```tsx
 * <NumberFieldRoot defaultValue={1} min={0} max={100}>
 *   <NumberFieldGroup>
 *     <NumberFieldDecrement />
 *     <NumberFieldInput />
 *     <NumberFieldIncrement />
 *   </NumberFieldGroup>
 * </NumberFieldRoot>
 * ```
 *
 * Anatomy (with scrub area):
 * ```tsx
 * <NumberFieldRoot>
 *   <NumberFieldScrubArea>
 *     <label>Size</label>
 *     <NumberFieldScrubAreaCursor />
 *   </NumberFieldScrubArea>
 *   <NumberFieldGroup>
 *     <NumberFieldDecrement />
 *     <NumberFieldInput />
 *     <NumberFieldIncrement />
 *   </NumberFieldGroup>
 * </NumberFieldRoot>
 * ```
 *
 * Accessibility: `NumberFieldInput` is a real `<input type="text">`
 * (not `number`, so the browser doesn't insert a second set of steppers)
 * with `inputmode="numeric"`, `aria-valuenow/min/max`, and the standard
 * ArrowUp / ArrowDown / PageUp / PageDown / Home / End key set.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/number-field
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/number-field
 * @registryDescription Numeric input with increment/decrement buttons and min/max constraints.
 */

"use client";

import * as React from "react";
import { NumberField } from "@base-ui/react/number-field";
import { Minus, Plus } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type NumberFieldRootProps = React.ComponentPropsWithoutRef<
  typeof NumberField.Root
>;

/**
 * Top-level provider. Owns the numeric value, formatter, and validation.
 *
 * Props of note:
 * - `value` / `defaultValue` — number | null
 * - `min` / `max` — clamped inclusive bounds
 * - `step` / `smallStep` / `largeStep` — Arrow / Shift+Arrow / PageUp-Dn
 * - `format` — `Intl.NumberFormatOptions`
 * - `allowWheelScrub` — `true` to enable wheel-over-input to adjust
 *
 * @since 0.1.0
 */
function NumberFieldRoot({ className, ...props }: NumberFieldRootProps) {
  return (
    <NumberField.Root
      data-slot="number-field-root"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}
NumberFieldRoot.displayName = "NumberFieldRoot";

// ---- GROUP ------------------------------------------------------------------

export type NumberFieldGroupProps = React.ComponentPropsWithoutRef<
  typeof NumberField.Group
>;

/**
 * Visual grouping for the decrement / input / increment triplet. Applies
 * the connected-button look.
 *
 * @since 0.1.0
 */
function NumberFieldGroup({ className, ...props }: NumberFieldGroupProps) {
  return (
    <NumberField.Group
      data-slot="number-field-group"
      className={cn("flex items-stretch", className)}
      {...props}
    />
  );
}
NumberFieldGroup.displayName = "NumberFieldGroup";

// ---- DECREMENT --------------------------------------------------------------

export type NumberFieldDecrementProps = React.ComponentPropsWithoutRef<
  typeof NumberField.Decrement
>;

/**
 * Subtracts one `step` on click. Auto-disables at `min`.
 *
 * @since 0.1.0
 */
function NumberFieldDecrement({
  className,
  children,
  ...props
}: NumberFieldDecrementProps) {
  return (
    <NumberField.Decrement
      data-slot="number-field-decrement"
      className={cn(
        "flex h-9 w-9 items-center justify-center",
        "rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground select-none",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children ?? <Minus className="h-4 w-4" />}
    </NumberField.Decrement>
  );
}
NumberFieldDecrement.displayName = "NumberFieldDecrement";

// ---- INPUT ------------------------------------------------------------------

export type NumberFieldInputProps = React.ComponentPropsWithoutRef<
  typeof NumberField.Input
>;

/**
 * The text input itself. `tabular-nums` keeps digits from jittering while
 * scrubbing.
 *
 * @since 0.1.0
 */
function NumberFieldInput({ className, ...props }: NumberFieldInputProps) {
  return (
    <NumberField.Input
      data-slot="number-field-input"
      className={cn(
        "h-9 w-16 border border-input bg-transparent text-center text-sm tabular-nums",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "focus:z-10 focus:outline-none focus:ring-1 focus:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  );
}
NumberFieldInput.displayName = "NumberFieldInput";

// ---- INCREMENT --------------------------------------------------------------

export type NumberFieldIncrementProps = React.ComponentPropsWithoutRef<
  typeof NumberField.Increment
>;

/**
 * Adds one `step` on click. Auto-disables at `max`.
 *
 * @since 0.1.0
 */
function NumberFieldIncrement({
  className,
  children,
  ...props
}: NumberFieldIncrementProps) {
  return (
    <NumberField.Increment
      data-slot="number-field-increment"
      className={cn(
        "flex h-9 w-9 items-center justify-center",
        "rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground select-none",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children ?? <Plus className="h-4 w-4" />}
    </NumberField.Increment>
  );
}
NumberFieldIncrement.displayName = "NumberFieldIncrement";

// ---- SCRUB AREA -------------------------------------------------------------

export type NumberFieldScrubAreaProps = React.ComponentPropsWithoutRef<
  typeof NumberField.ScrubArea
>;

/**
 * An area (usually the label) that, when press-dragged horizontally,
 * nudges the numeric value — familiar from creative tools.
 *
 * @since 0.1.0
 */
function NumberFieldScrubArea({
  className,
  ...props
}: NumberFieldScrubAreaProps) {
  return (
    <NumberField.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn("cursor-ew-resize select-none", className)}
      {...props}
    />
  );
}
NumberFieldScrubArea.displayName = "NumberFieldScrubArea";

// ---- SCRUB AREA CURSOR ------------------------------------------------------

export type NumberFieldScrubAreaCursorProps = React.ComponentPropsWithoutRef<
  typeof NumberField.ScrubAreaCursor
>;

/**
 * Custom cursor that follows the pointer during scrubbing. Rendered into
 * the top layer via a portal by Base UI — style as a floating chip or
 * icon.
 *
 * @since 0.1.0
 */
function NumberFieldScrubAreaCursor({
  className,
  ...props
}: NumberFieldScrubAreaCursorProps) {
  return (
    <NumberField.ScrubAreaCursor
      data-slot="number-field-scrub-area-cursor"
      className={cn("pointer-events-none select-none", className)}
      {...props}
    />
  );
}
NumberFieldScrubAreaCursor.displayName = "NumberFieldScrubAreaCursor";

// ---- EXPORTS ----------------------------------------------------------------

export {
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
};
