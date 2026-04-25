/**
 * Label — Accessible form label with disabled-peer state styling.
 *
 * A thin wrapper over the native `<label>` element. Associates with a
 * control either via `htmlFor` + `id`, or by being nested around the
 * control. Adds visual opacity when the adjacent / ancestor control is
 * disabled (via `peer-disabled:` and `group-data-disabled:` selectors).
 *
 * Anatomy:
 * ```tsx
 * <Label htmlFor="email">Email address</Label>
 * <Input id="email" type="email" />
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/label
 * @registryDescription A styled label component with peer/group disabled state support.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ---- LABEL ------------------------------------------------------------------

export type LabelProps = React.ComponentPropsWithoutRef<"label">;

/**
 * Native `<label>` with accessible disabled-state styling.
 *
 * @since 0.1.0
 */
function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "group-data-disabled:cursor-not-allowed group-data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
Label.displayName = "Label";

// ---- EXPORTS ----------------------------------------------------------------

export { Label };
