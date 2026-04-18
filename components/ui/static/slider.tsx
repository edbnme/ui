/**
 * Slider — Range input for picking a numeric value (or a pair of values).
 *
 * Built on the Base UI `Slider` primitive. Supports single and range modes
 * (pass an array to `value` / `defaultValue`), horizontal & vertical
 * orientation, keyboard stepping (Arrow keys, PageUp/PageDown, Home/End),
 * form integration via hidden inputs, and full ARIA wiring.
 *
 * Anatomy (single value):
 * ```tsx
 * <SliderRoot defaultValue={50}>
 *   <SliderControl>
 *     <SliderTrack>
 *       <SliderIndicator />
 *     </SliderTrack>
 *     <SliderThumb />
 *   </SliderControl>
 *   <SliderValue />
 * </SliderRoot>
 * ```
 *
 * Anatomy (range):
 * ```tsx
 * <SliderRoot defaultValue={[20, 80]} min={0} max={100}>
 *   <SliderControl>
 *     <SliderTrack>
 *       <SliderIndicator />
 *     </SliderTrack>
 *     <SliderThumb />
 *     <SliderThumb />
 *   </SliderControl>
 * </SliderRoot>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/slider
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/slider
 * @registryDescription Range slider with single or multi-thumb support.
 */

"use client";

import * as React from "react";
import { Slider } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type SliderRootProps = Slider.Root.Props;

/**
 * Owns the value state and dispatches updates. Accepts a number for a
 * single-thumb slider or an array for a range slider — the number of
 * `SliderThumb`s inside should match the array length.
 *
 * Data attributes:
 * - `data-orientation` — `"horizontal"` (default) | `"vertical"`
 * - `data-disabled`
 *
 * @since 0.1.0
 */
function SliderRoot({ className, ...props }: SliderRootProps) {
  return (
    <Slider.Root
      data-slot="slider-root"
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-orientation-vertical:h-full data-orientation-vertical:w-auto data-orientation-vertical:flex-col",
        className
      )}
      {...props}
    />
  );
}
SliderRoot.displayName = "SliderRoot";

// ---- CONTROL ----------------------------------------------------------------

export type SliderControlProps = Slider.Control.Props;

/**
 * Interactive hit area that hosts the track and thumbs. Taps anywhere on
 * this region move the nearest thumb. Always include — Base UI's pointer
 * handling lives here.
 *
 * @since 0.1.0
 */
function SliderControl({ className, ...props }: SliderControlProps) {
  return (
    <Slider.Control
      data-slot="slider-control"
      className={cn(
        "relative flex h-5 w-full touch-none select-none items-center",
        "data-orientation-vertical:h-full data-orientation-vertical:w-5 data-orientation-vertical:flex-col",
        className
      )}
      {...props}
    />
  );
}
SliderControl.displayName = "SliderControl";

// ---- TRACK ------------------------------------------------------------------

export type SliderTrackProps = Slider.Track.Props;

/**
 * The recessed rail behind the thumb. Hosts `SliderIndicator`, which paints
 * the filled portion.
 *
 * @since 0.1.0
 */
function SliderTrack({ className, ...props }: SliderTrackProps) {
  return (
    <Slider.Track
      data-slot="slider-track"
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
        "data-orientation-vertical:h-full data-orientation-vertical:w-1.5",
        className
      )}
      {...props}
    />
  );
}
SliderTrack.displayName = "SliderTrack";

// ---- INDICATOR --------------------------------------------------------------

export type SliderIndicatorProps = Slider.Indicator.Props;

/**
 * The filled portion of the track. Base UI sizes this automatically based
 * on the current value(s) — for a range slider it spans between the two
 * thumbs.
 *
 * @since 0.1.0
 */
function SliderIndicator({ className, ...props }: SliderIndicatorProps) {
  return (
    <Slider.Indicator
      data-slot="slider-indicator"
      className={cn(
        "absolute h-full bg-primary",
        "data-orientation-vertical:h-auto data-orientation-vertical:w-full",
        className
      )}
      {...props}
    />
  );
}
SliderIndicator.displayName = "SliderIndicator";

// ---- THUMB ------------------------------------------------------------------

export type SliderThumbProps = Slider.Thumb.Props;

/**
 * The draggable knob. Render one per value — one for a single-value
 * slider, two for a range slider.
 *
 * Subtle scale-up while active provides a tactile "picked up" feedback
 * loop matching Apple's HIG affordance for direct-manipulation handles.
 *
 * Data attributes:
 * - `data-dragging` — on while actively being dragged
 * - `data-orientation`
 * - `data-index` — the thumb's position (0-based) in the value array
 *
 * @since 0.1.0
 */
function SliderThumb({ className, ...props }: SliderThumbProps) {
  return (
    <Slider.Thumb
      data-slot="slider-thumb"
      className={cn(
        "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow",
        "transition-[transform,box-shadow,border-color] duration-150 ease-out motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "hover:scale-110 data-dragging:scale-110 data-dragging:shadow-md",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
SliderThumb.displayName = "SliderThumb";

// ---- VALUE ------------------------------------------------------------------

export type SliderValueProps = Slider.Value.Props;

/**
 * Live text readout of the current value(s). Renders as an `<output>`
 * element with `aria-live="off"` by default (Base UI handles the
 * announcement semantics through the thumb's `aria-valuenow`).
 *
 * @since 0.1.0
 */
function SliderValue({ className, ...props }: SliderValueProps) {
  return (
    <Slider.Value
      data-slot="slider-value"
      className={cn("text-sm tabular-nums text-muted-foreground", className)}
      {...props}
    />
  );
}
SliderValue.displayName = "SliderValue";

// ---- EXPORTS ----------------------------------------------------------------

export {
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  SliderValue,
};

/**
 * Backward-compatible alias — `Slider` was the original shared-variant
 * export before the static-variant split. Kept so existing consumers do
 * not break.
 *
 * @deprecated prefer `SliderRoot` for clarity.
 */
export { SliderRoot as Slider };
