/**
 * Slider Component
 *
 * A range slider component with single or multiple thumbs. Supports
 * keyboard navigation and touch interactions.
 *
 * Built on Base UI Slider primitive.
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "onValueChange"
> {
  thumbCount?: number;
  onValueChange?: (value: number[]) => void;
  minStepsBetweenThumbs?: number;
}

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    { className, thumbCount, onValueChange, minStepsBetweenThumbs, ...props },
    ref
  ) => {
    const getThumbCount = () => {
      if (thumbCount !== undefined) return thumbCount;
      if (Array.isArray(props.value)) return props.value.length;
      if (Array.isArray(props.defaultValue)) return props.defaultValue.length;
      return 1;
    };
    const count = getThumbCount();

    const handleValueChange = React.useCallback(
      (value: number | readonly number[]) => {
        if (onValueChange) {
          const arrayValue = Array.isArray(value) ? [...value] : [value];
          onValueChange(arrayValue);
        }
      },
      [onValueChange]
    );

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        onValueChange={handleValueChange}
        minStepsBetweenValues={minStepsBetweenThumbs}
        {...props}
      >
        <SliderPrimitive.Control className="flex w-full items-center py-2">
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Indicator className="absolute h-full bg-primary" />
            {Array.from({ length: count }).map((_, index) => (
              <SliderPrimitive.Thumb
                key={index}
                index={index}
                className="block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md ring-offset-background transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              />
            ))}
          </SliderPrimitive.Track>
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
