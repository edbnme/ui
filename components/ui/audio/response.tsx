"use client";

import { memo, type ComponentProps } from "react";
import { Streamdown } from "streamdown";

import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

type ResponseProps = ComponentProps<typeof Streamdown>;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Memoized wrapper around Streamdown for rendering streaming markdown.
 * Passes through all Streamdown props — see Streamdown docs for full API.
 *
 * Only re-renders when `children` (the markdown content) changes,
 * preventing unnecessary work during streaming.
 */
const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      data-slot="response"
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";

export { Response };
export type { ResponseProps };
