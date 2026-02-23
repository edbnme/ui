"use client";

import * as React from "react";
import { Avatar } from "@base-ui/react/avatar";
import { cn } from "@/lib/utils";

// =============================================================================
// AVATAR ROOT
// =============================================================================

const AvatarRoot = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithRef<typeof Avatar.Root>
>(({ className, ...props }, ref) => (
  <Avatar.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
AvatarRoot.displayName = "AvatarRoot";

// =============================================================================
// AVATAR IMAGE
// =============================================================================

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ComponentPropsWithRef<typeof Avatar.Image>
>(({ className, ...props }, ref) => (
  <Avatar.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

// =============================================================================
// AVATAR FALLBACK
// =============================================================================

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithRef<typeof Avatar.Fallback>
>(({ className, ...props }, ref) => (
  <Avatar.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

// =============================================================================
// EXPORTS
// =============================================================================

export { AvatarRoot, AvatarImage, AvatarFallback };
