/**
 * Separator — Visual and semantic divider between content sections.
 *
 * Built on the Base UI `Separator` primitive. Renders as an ARIA
 * `separator` element by default — purely decorative dividers should pass
 * `render={<div />}` or set `aria-hidden`.
 *
 * Anatomy:
 * ```tsx
 * <SeparatorRoot />                             // horizontal (default)
 * <SeparatorRoot orientation="vertical" />      // vertical
 * <SeparatorRoot className="my-6" />            // custom spacing
 * ```
 *
 * Accessibility: horizontal separators carry no implicit meaning for
 * screen readers and are safe to leave as-is. Vertical separators
 * announcing major section breaks can benefit from `aria-orientation`
 * (set automatically by Base UI).
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/separator
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/separator
 * @registryDescription Visual divider for separating content sections.
 */

"use client";

import * as React from "react";
import { Separator } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type SeparatorRootProps = React.ComponentPropsWithoutRef<
  typeof Separator
> & {
  /** Visual axis. Defaults to `"horizontal"`. */
  orientation?: "horizontal" | "vertical";
};

/**
 * A thin line that separates content.
 *
 * Data attributes:
 * - `data-orientation` — `"horizontal"` | `"vertical"`
 *
 * @since 0.1.0
 */
function SeparatorRoot({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorRootProps) {
  return (
    <Separator
      data-slot="separator-root"
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}
SeparatorRoot.displayName = "SeparatorRoot";

// ---- EXPORTS ----------------------------------------------------------------

export { SeparatorRoot };

/**
 * Backward-compatible alias — `Separator` was the original shared-variant
 * export before the static-variant split. Kept so existing consumers do
 * not break.
 *
 * @deprecated prefer `SeparatorRoot` for clarity.
 */
export { SeparatorRoot as Separator };
