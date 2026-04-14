/**
 * Avatar — User avatar with image and fallback support.
 * Built on @base-ui/react Avatar primitive.
 *
 * @example
 * <Avatar src="/user.jpg" alt="User" fallback="JD" />
 *
 * @see https://base-ui.com/react/components/avatar
 */
"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "@/lib/utils";

// ---- AVATAR ROOT ------------------------------------------------------------

const AvatarRoot = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
AvatarRoot.displayName = "AvatarRoot";

// ---- AVATAR IMAGE -----------------------------------------------------------

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ComponentPropsWithRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

// ---- AVATAR FALLBACK --------------------------------------------------------

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

// ---- EXPORTS ----------------------------------------------------------------

export { AvatarRoot, AvatarImage, AvatarFallback };

// Backward-compatible aliases (formerly shared/)
const Avatar = AvatarRoot;
export { Avatar };
