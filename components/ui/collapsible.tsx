/**
 * Collapsible — Expandable/collapsible content region.
 *
 * The primitive building block for disclosure UIs. Unlike `Accordion`, there
 * is no group coordination — each `Collapsible` is independent. Use when you
 * need a single toggle (show/hide filters, expandable card) rather than a
 * group of related disclosures.
 *
 * Anatomy:
 * ```tsx
 * <CollapsibleRoot>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsiblePanel>Hidden content…</CollapsiblePanel>
 * </CollapsibleRoot>
 * ```
 *
 * Motion: the panel animates via the `--collapsible-panel-height` CSS
 * variable exposed by Base UI, transitioning from `h-0` at the
 * starting/ending states to the measured content height. Respects
 * `prefers-reduced-motion`.
 *
 * Accessibility: trigger and panel are linked via `aria-controls` /
 * `aria-expanded` automatically. The panel is hidden from assistive tech
 * while collapsed.
 *
 * @version 0.3.0
 * @package    @edbn/ui
 * @brand      edbn/ui -- https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/collapsible
 * @upstream   Base UI v1.2.0 -- https://base-ui.com/react/components/collapsible
 * @registryDescription Expandable/collapsible content section with CSS transitions.
 */

"use client";

import * as React from "react";
import { Collapsible } from "@base-ui/react/collapsible";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

type CollapsibleRootProps = Collapsible.Root.Props;

/**
 * Stateful root — owns the open state. Use `defaultOpen` for uncontrolled
 * or `open` + `onOpenChange` for controlled usage.
 *
 * Data attributes:
 * - `data-panel-open` — present while the panel is open
 * - `data-disabled`
 *
 * @since 0.1.0
 */
function CollapsibleRoot({ className, ...props }: CollapsibleRootProps) {
  return (
    <Collapsible.Root
      data-slot="collapsible-root"
      className={cn("w-full", className)}
      {...props}
    />
  );
}
CollapsibleRoot.displayName = "CollapsibleRoot";

// ---- TRIGGER ----------------------------------------------------------------

type CollapsibleTriggerProps = Collapsible.Trigger.Props;

/**
 * The button that toggles the panel. Consumers are free to include any
 * affordance as children — an arrow icon, a plus/minus glyph, or a plain
 * text label. Rotation helpers for trailing `svg` children (like
 * `data-panel-open:[&>svg]:rotate-180`) are kept so the common caret
 * pattern works out of the box.
 *
 * Data attributes:
 * - `data-panel-open` — reflects open state
 *
 * @since 0.1.0
 */
function CollapsibleTrigger({
  className,
  children,
  ...props
}: CollapsibleTriggerProps) {
  return (
    <Collapsible.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium",
        "transition-colors hover:underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-panel-open:[&>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-200",
        "motion-reduce:[&>svg]:transition-none",
        className
      )}
      {...props}
    >
      {children}
    </Collapsible.Trigger>
  );
}
CollapsibleTrigger.displayName = "CollapsibleTrigger";

// ---- PANEL ------------------------------------------------------------------

type CollapsiblePanelProps = Collapsible.Panel.Props;

/**
 * The region that expands and collapses.
 *
 * Base UI measures the natural content height and exposes it via
 * `--collapsible-panel-height`. The panel animates from `h-0` (starting /
 * ending style) to that measured height.
 *
 * Data attributes:
 * - `data-starting-style`, `data-ending-style` — drive the height transition
 * - `data-open` — reflects current open state
 *
 * CSS variables:
 * - `--collapsible-panel-height` — measured natural height of the content
 *
 * @since 0.1.0
 */
function CollapsiblePanel({ className, ...props }: CollapsiblePanelProps) {
  return (
    <Collapsible.Panel
      data-slot="collapsible-panel"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height) transition-[height] duration-300 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  );
}
CollapsiblePanel.displayName = "CollapsiblePanel";

// ---- EXPORTS ----------------------------------------------------------------

export { CollapsibleRoot, CollapsibleTrigger, CollapsiblePanel };

export type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsiblePanelProps,
};
