"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface AspectRatioProps extends React.ComponentProps<"div"> {
  ratio?: number;
}

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

export { AspectRatio };
