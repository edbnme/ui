/**
 * Avatar - premium solid profile image primitive.
 *
 * Thin styled layer over `@base-ui/react/avatar`. Parts preserve upstream
 * render composition, refs, function-valued `className` and `style`, image
 * loading state, fallback delay, and transition data attributes.
 *
 * Anatomy:
 * ```tsx
 * <AvatarRoot>
 *   <AvatarImage src="/avatars/jane.jpg" alt="Jane Doe" />
 *   <AvatarFallback delay={400}>JD</AvatarFallback>
 * </AvatarRoot>
 * ```
 *
 * Styling is solid, platform-native, professional, and token driven.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @docs       https://ui.edbn.me/docs/components/avatar
 * @upstream   @base-ui/react v1.5.0 - https://base-ui.com/react/components/avatar
 * @registryDescription Premium solid avatar with image loading, fallback delay, render composition, and state-aware styling.
 * @registryDemos basic=Basic, with-image=With Image, states=States
 */
"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type {
  AvatarFallbackProps as BaseAvatarFallbackProps,
  AvatarFallbackState as BaseAvatarFallbackState,
  AvatarImageProps as BaseAvatarImageProps,
  AvatarImageState as BaseAvatarImageState,
  AvatarRootProps as BaseAvatarRootProps,
  AvatarRootState as BaseAvatarRootState,
  ImageLoadingStatus as BaseImageLoadingStatus,
} from "@base-ui/react/avatar";

import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

export type AvatarRootProps = BaseAvatarRootProps;
export type AvatarRootState = BaseAvatarRootState;
export type AvatarImageProps = BaseAvatarImageProps;
export type AvatarImageState = BaseAvatarImageState;
export type AvatarFallbackProps = BaseAvatarFallbackProps;
export type AvatarFallbackState = BaseAvatarFallbackState;
export type ImageLoadingStatus = BaseImageLoadingStatus;

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

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarRootProps
>(function AvatarRoot({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar-root"
      className={composeClassName<AvatarRootProps>(
        cn(
          "relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full align-middle",
          "border border-border bg-muted text-muted-foreground shadow-sm ring-1 ring-background",
          "select-none transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
          "forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]"
        ),
        className
      )}
      {...props}
    />
  );
});
AvatarRoot.displayName = "AvatarRoot";

// ---- IMAGE ------------------------------------------------------------------

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(function AvatarImage({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      data-slot="avatar-image"
      className={composeClassName<AvatarImageProps>(
        cn(
          "aspect-square h-full w-full object-cover",
          "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
        ),
        className
      )}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

// ---- FALLBACK ---------------------------------------------------------------

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(function AvatarFallback({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={composeClassName<AvatarFallbackProps>(
        cn(
          "flex h-full w-full items-center justify-center rounded-full",
          "bg-secondary text-sm font-semibold leading-none text-secondary-foreground",
          "ring-1 ring-inset ring-border",
          "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]"
        ),
        className
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";

// ---- EXPORTS ----------------------------------------------------------------

const Avatar = Object.assign(AvatarRoot, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

export { AvatarRoot, AvatarImage, AvatarFallback, Avatar };
