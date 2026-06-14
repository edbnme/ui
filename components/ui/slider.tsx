/**
 * Slider - Numeric value input with single-value and range modes.
 *
 * Thin styled layer over `@base-ui/react/slider`. Parts preserve upstream
 * render composition, refs, function-valued `className` and `style`, field
 * state data attributes, form integration, labeling, and range thumb indexes.
 *
 * Anatomy:
 * ```tsx
 * <SliderRoot defaultValue={50}>
 *   <div className="flex items-center justify-between">
 *     <SliderLabel>Volume</SliderLabel>
 *     <SliderValue />
 *   </div>
 *   <SliderControl>
 *     <SliderTrack>
 *       <SliderIndicator />
 *       <SliderThumb />
 *     </SliderTrack>
 *   </SliderControl>
 * </SliderRoot>
 * ```
 *
 * Range anatomy:
 * ```tsx
 * <SliderRoot defaultValue={[20, 80]}>
 *   <SliderLabel>Price range</SliderLabel>
 *   <SliderControl>
 *     <SliderTrack>
 *       <SliderIndicator />
 *       <SliderThumb index={0} aria-label="Minimum price" />
 *       <SliderThumb index={1} aria-label="Maximum price" />
 *     </SliderTrack>
 *   </SliderControl>
 * </SliderRoot>
 * ```
 *
 * Styling is solid, premium, platform-native, and token driven.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @upstream   Base UI v1.5.0 - https://base-ui.com/react/components/slider
 * @registryDescription Premium solid slider with full Base UI part coverage, labels, value readout, range thumbs, form integration, and state-aware styling.
 * @registryDemos basic=Basic, range=Range, vertical=Vertical, states=States, form=Form
 */
"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import type {
  SliderControlProps as BaseSliderControlProps,
  SliderControlState as BaseSliderControlState,
  SliderIndicatorProps as BaseSliderIndicatorProps,
  SliderIndicatorState as BaseSliderIndicatorState,
  SliderLabelProps as BaseSliderLabelProps,
  SliderLabelState as BaseSliderLabelState,
  SliderRootChangeEventDetails as BaseSliderRootChangeEventDetails,
  SliderRootChangeEventReason as BaseSliderRootChangeEventReason,
  SliderRootCommitEventDetails as BaseSliderRootCommitEventDetails,
  SliderRootCommitEventReason as BaseSliderRootCommitEventReason,
  SliderRootProps as BaseSliderRootProps,
  SliderRootState as BaseSliderRootState,
  SliderThumbProps as BaseSliderThumbProps,
  SliderThumbState as BaseSliderThumbState,
  SliderTrackProps as BaseSliderTrackProps,
  SliderTrackState as BaseSliderTrackState,
  SliderValueProps as BaseSliderValueProps,
  SliderValueState as BaseSliderValueState,
} from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

export type SliderRootValue = number | readonly number[];
export type SliderRootProps<
  Value extends SliderRootValue = SliderRootValue,
> = BaseSliderRootProps<Value>;
export type SliderRootState = BaseSliderRootState;
export type SliderRootChangeEventReason = BaseSliderRootChangeEventReason;
export type SliderRootChangeEventDetails = BaseSliderRootChangeEventDetails;
export type SliderRootCommitEventReason = BaseSliderRootCommitEventReason;
export type SliderRootCommitEventDetails = BaseSliderRootCommitEventDetails;

export type SliderLabelProps = BaseSliderLabelProps;
export type SliderLabelState = BaseSliderLabelState;
export type SliderValueProps = BaseSliderValueProps;
export type SliderValueState = BaseSliderValueState;
export type SliderControlProps = BaseSliderControlProps;
export type SliderControlState = BaseSliderControlState;
export type SliderTrackProps = BaseSliderTrackProps;
export type SliderTrackState = BaseSliderTrackState;
export type SliderIndicatorProps = BaseSliderIndicatorProps;
export type SliderIndicatorState = BaseSliderIndicatorState;
export type SliderThumbProps = BaseSliderThumbProps;
export type SliderThumbState = BaseSliderThumbState;

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

// ---- ROOT -------------------------------------------------------------------

const SliderRoot = React.forwardRef<HTMLDivElement, SliderRootProps>(
  function SliderRoot({ className, ...props }, ref) {
    return (
      <BaseSlider.Root
        ref={ref}
        data-slot="slider-root"
        className={composeClassName<SliderRootProps>(
          cn(
            "relative flex w-full min-w-0 select-none flex-col gap-2 text-foreground",
            "[--slider-control-size:1.5rem] [--slider-thumb-size:1.25rem] [--slider-track-size:0.5rem]",
            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60",
            "data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-fit data-[orientation=vertical]:items-center"
          ),
          className
        )}
        {...props}
      />
    );
  }
) as <Value extends SliderRootValue = SliderRootValue>(
  props: SliderRootProps<Value> & React.RefAttributes<HTMLDivElement>
) => React.JSX.Element;
(SliderRoot as { displayName?: string }).displayName = "SliderRoot";

// ---- LABEL ------------------------------------------------------------------

const SliderLabel = React.forwardRef<HTMLDivElement, SliderLabelProps>(
  function SliderLabel({ className, ...props }, ref) {
    return (
      <BaseSlider.Label
        ref={ref}
        data-slot="slider-label"
        className={composeClassName<SliderLabelProps>(
          cn(
            "text-sm font-medium leading-none text-foreground",
            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60",
            "forced-colors:text-[CanvasText]"
          ),
          className
        )}
        {...props}
      />
    );
  }
);
SliderLabel.displayName = "SliderLabel";

// ---- VALUE ------------------------------------------------------------------

const SliderValue = React.forwardRef<HTMLOutputElement, SliderValueProps>(
  function SliderValue({ className, ...props }, ref) {
    return (
      <BaseSlider.Value
        ref={ref}
        data-slot="slider-value"
        className={composeClassName<SliderValueProps>(
          cn(
            "min-w-10 text-right text-sm font-medium tabular-nums text-muted-foreground",
            "data-[disabled]:opacity-60 forced-colors:text-[CanvasText]"
          ),
          className
        )}
        {...props}
      />
    );
  }
);
SliderValue.displayName = "SliderValue";

// ---- CONTROL ----------------------------------------------------------------

const SliderControl = React.forwardRef<HTMLDivElement, SliderControlProps>(
  function SliderControl({ className, ...props }, ref) {
    return (
      <BaseSlider.Control
        ref={ref}
        data-slot="slider-control"
        className={composeClassName<SliderControlProps>(
          cn(
            "relative flex w-full touch-none select-none items-center py-2",
            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60",
            "data-[orientation=horizontal]:min-h-[var(--slider-control-size)]",
            "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-[var(--slider-control-size)] data-[orientation=vertical]:justify-center data-[orientation=vertical]:px-2 data-[orientation=vertical]:py-0"
          ),
          className
        )}
        {...props}
      />
    );
  }
);
SliderControl.displayName = "SliderControl";

// ---- TRACK ------------------------------------------------------------------

const SliderTrack = React.forwardRef<HTMLDivElement, SliderTrackProps>(
  function SliderTrack({ className, ...props }, ref) {
    return (
      <BaseSlider.Track
        ref={ref}
        data-slot="slider-track"
        className={composeClassName<SliderTrackProps>(
          cn(
            "relative isolate grow overflow-hidden rounded-full border border-border bg-muted shadow-inner",
            "data-[invalid]:border-destructive",
            "data-[orientation=horizontal]:h-[var(--slider-track-size)] data-[orientation=horizontal]:w-full",
            "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[var(--slider-track-size)]",
            "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:shadow-none"
          ),
          className
        )}
        {...props}
      />
    );
  }
);
SliderTrack.displayName = "SliderTrack";

// ---- INDICATOR --------------------------------------------------------------

const SliderIndicator = React.forwardRef<
  HTMLDivElement,
  SliderIndicatorProps
>(function SliderIndicator({ className, ...props }, ref) {
  return (
    <BaseSlider.Indicator
      ref={ref}
      data-slot="slider-indicator"
      className={composeClassName<SliderIndicatorProps>(
        cn(
          "absolute rounded-full bg-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_88%,var(--border))]",
          "data-[invalid]:bg-destructive",
          "data-[orientation=horizontal]:h-full",
          "data-[orientation=vertical]:w-full",
          "forced-colors:bg-[Highlight] forced-colors:shadow-none"
        ),
        className
      )}
      {...props}
    />
  );
});
SliderIndicator.displayName = "SliderIndicator";

// ---- THUMB ------------------------------------------------------------------

const SliderThumb = React.forwardRef<HTMLDivElement, SliderThumbProps>(
  function SliderThumb({ className, ...props }, ref) {
    return (
      <BaseSlider.Thumb
        ref={ref}
        data-slot="slider-thumb"
        className={composeClassName<SliderThumbProps>(
          cn(
            "block size-[var(--slider-thumb-size)] rounded-full border border-border bg-background ring-4 ring-background",
            "shadow-[0_1px_2px_rgba(0,0,0,0.12),0_6px_18px_-10px_rgba(0,0,0,0.45)]",
            "transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none motion-reduce:active:scale-100",
            "hover:border-ring hover:shadow-[0_2px_6px_rgba(0,0,0,0.14),0_10px_24px_-14px_rgba(0,0,0,0.55)]",
            "data-[dragging]:scale-105 data-[dragging]:border-ring data-[dragging]:shadow-[0_2px_6px_rgba(0,0,0,0.16),0_14px_28px_-14px_rgba(0,0,0,0.65)]",
            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[invalid]:border-destructive",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",
            "has-[:focus-visible]:border-ring has-[:focus-visible]:outline-none has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring",
            "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:ring-[Canvas]",
            "forced-colors:has-[:focus-visible]:outline forced-colors:has-[:focus-visible]:outline-2 forced-colors:has-[:focus-visible]:outline-[Highlight]"
          ),
          className
        )}
        {...props}
      />
    );
  }
);
SliderThumb.displayName = "SliderThumb";

// ---- EXPORTS ----------------------------------------------------------------

export {
  SliderRoot,
  SliderLabel,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
};

/**
 * Backward-compatible alias kept for existing imports.
 *
 * @deprecated prefer `SliderRoot` for clarity.
 */
export { SliderRoot as Slider };
