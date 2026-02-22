/**
 * Skeleton Component
 *
 * A loading placeholder component with pulse animation for content loading states.
 * Use to indicate loading content while maintaining layout structure.
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="skeleton"
    className={cn("bg-accent animate-pulse rounded-md", className)}
    {...props}
  />
));

Skeleton.displayName = "Skeleton";

export { Skeleton };
