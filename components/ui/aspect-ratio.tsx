﻿/**
 * AspectRatio — Maintains a consistent width-to-height ratio for content.
 *
 * A zero-dependency wrapper around the native CSS `aspect-ratio`
 * property. Pass `ratio={16 / 9}` for 16:9, `ratio={1}` for square, etc.
 * Children are absolutely-free — use `object-cover` on images / videos to
 * fill the box.
 *
 * Anatomy:
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/photo.jpg" alt="Landscape" className="h-full w-full object-cover" />
 * </AspectRatio>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/aspect-ratio
 * @registryDescription A CSS aspect-ratio wrapper component for maintaining consistent proportions.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ---- ASPECT RATIO -----------------------------------------------------------

export interface AspectRatioProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Width-to-height ratio (e.g. `16 / 9`). Defaults to `1` (square). */
  ratio?: number;
}

/**
 * Maintains a consistent aspect ratio via CSS `aspect-ratio`.
 *
 * @since 0.1.0
 */
function AspectRatio({
  ratio = 1,
  className,
  style,
  children,
  ...props
}: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${ratio}`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
AspectRatio.displayName = "AspectRatio";

// ---- EXPORTS ----------------------------------------------------------------

export { AspectRatio };
