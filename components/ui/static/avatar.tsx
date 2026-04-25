/**
 * Avatar — User avatar with image loading, fallback, and automatic delay.
 *
 * Built on the Base UI `Avatar` primitive. Handles the full image-loading
 * lifecycle: shows `<AvatarFallback>` while the image loads, swaps to
 * `<AvatarImage>` on `load`, and stays on the fallback on `error`. The
 * fallback can specify a delay so quick successful loads do not flash.
 *
 * Anatomy:
 * ```tsx
 * <AvatarRoot>
 *   <AvatarImage src="/avatars/jane.jpg" alt="Jane Doe" />
 *   <AvatarFallback delay={400}>JD</AvatarFallback>
 * </AvatarRoot>
 * ```
 *
 * Accessibility: always pass an `alt` on `AvatarImage`. For decorative
 * avatars set `alt=""`. Fallbacks are announced as text.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/avatar
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/avatar
 * @registryDescription Composable avatar with image support and fallback initials.
 */

"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type AvatarRootProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
>;

/**
 * The outer container — coordinates image loading state and clips children
 * to a rounded shape.
 *
 * @since 0.1.0
 */
function AvatarRoot({ className, ...props }: AvatarRootProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar-root"
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        "bg-muted",
        className
      )}
      {...props}
    />
  );
}
AvatarRoot.displayName = "AvatarRoot";

// ---- IMAGE ------------------------------------------------------------------

export type AvatarImageProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
>;

/**
 * The `<img>`. Only mounts after the underlying image successfully loads,
 * preventing broken-icon flashes when the URL 404s.
 *
 * @since 0.1.0
 */
function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}
AvatarImage.displayName = "AvatarImage";

// ---- FALLBACK ---------------------------------------------------------------

export type AvatarFallbackProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Fallback
>;

/**
 * Shown while the image loads (and remains visible if it errors). Usually
 * a 1–2 character initial set.
 *
 * Props of note:
 * - `delay?: number` — ms to wait before showing the fallback; prevents
 *   flash on fast loads.
 *
 * @since 0.1.0
 */
function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full",
        "bg-muted text-sm font-medium text-muted-foreground",
        "select-none",
        className
      )}
      {...props}
    />
  );
}
AvatarFallback.displayName = "AvatarFallback";

// ---- EXPORTS ----------------------------------------------------------------

export { AvatarRoot, AvatarImage, AvatarFallback };

/**
 * Backward-compatible alias — `Avatar` was the original shared-variant
 * export. Points to `AvatarRoot`.
 *
 * @deprecated prefer `AvatarRoot` for clarity.
 */
export { AvatarRoot as Avatar };
