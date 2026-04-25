/**
 * Accordion — A vertically stacked set of disclosure sections.
 *
 * Each `AccordionItem` hosts a `AccordionTrigger` that toggles the matching
 * `AccordionPanel`. Supports single (`openMultiple={false}`) or multiple
 * open items, controlled/uncontrolled state, and keyboard navigation
 * (Up/Down, Home/End, PageUp/PageDown). Built on the Base UI `Accordion`
 * primitive for fully accessible ARIA wiring.
 *
 * Anatomy:
 * ```tsx
 * <AccordionRoot defaultValue={["faq-1"]}>
 *   <AccordionItem value="faq-1">
 *     <AccordionHeader>
 *       <AccordionTrigger>Question 1</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionPanel>Answer content…</AccordionPanel>
 *   </AccordionItem>
 * </AccordionRoot>
 * ```
 *
 * Motion: the panel animates via the `--accordion-panel-height` CSS variable
 * exposed by Base UI, transitioning from `h-0` at the starting/ending states
 * to the measured content height. Respects `prefers-reduced-motion`.
 *
 * Accessibility: `AccordionTrigger` renders a button inside the heading so
 * the accordion is navigable both by tab (trigger-to-trigger) and by arrow
 * keys within the group. Each panel is linked to its trigger via
 * `aria-controls` / `aria-labelledby` automatically.
 *
 * @version 0.3.0
 * @package    @edbn/ui
 * @brand      edbn/ui -- https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/accordion
 * @upstream   Base UI v1.2.0 -- https://base-ui.com/react/components/accordion
 * @registryDescription Vertically collapsible content panels with smooth height animations.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Accordion } from "@base-ui/react/accordion";
import { CaretDown } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

type AccordionRootProps = React.ComponentPropsWithoutRef<typeof Accordion.Root>;

/**
 * Stateful root — owns the open value(s). Use `defaultValue` for
 * uncontrolled state or `value` + `onValueChange` for controlled.
 *
 * Props of note:
 * - `openMultiple` — `true` (default) allows multiple panels open at once
 * - `orientation` — `"vertical"` (default) or `"horizontal"`
 * - `loop` — wraps keyboard focus past the last/first item
 *
 * Data attributes:
 * - `data-orientation` — `"vertical"` | `"horizontal"`
 *
 * @since 0.1.0
 */
function AccordionRoot({ className, ...props }: AccordionRootProps) {
  return (
    <Accordion.Root
      data-slot="accordion-root"
      className={cn("w-full", className)}
      {...props}
    />
  );
}
AccordionRoot.displayName = "AccordionRoot";

// ---- ITEM -------------------------------------------------------------------

type AccordionItemProps = React.ComponentPropsWithoutRef<typeof Accordion.Item>;

/**
 * A single disclosure unit. The `value` prop uniquely identifies the item
 * within the accordion and is what `AccordionRoot`'s `value` state tracks.
 *
 * Data attributes:
 * - `data-panel-open` — present while this item's panel is open
 * - `data-disabled` — forwarded from `disabled` prop
 *
 * @since 0.1.0
 */
function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <Accordion.Item
      data-slot="accordion-item"
      className={cn("border-b border-border", className)}
      {...props}
    />
  );
}
AccordionItem.displayName = "AccordionItem";

// ---- HEADER -----------------------------------------------------------------

type AccordionHeaderProps = React.ComponentPropsWithoutRef<
  typeof Accordion.Header
>;

/**
 * Semantic heading that wraps the trigger. Renders an `<h3>` by default —
 * use the `render` prop to pick a different heading level if the accordion
 * sits deeper in the document outline.
 *
 * @since 0.1.0
 */
function AccordionHeader({ className, ...props }: AccordionHeaderProps) {
  return (
    <Accordion.Header
      data-slot="accordion-header"
      className={cn("flex", className)}
      {...props}
    />
  );
}
AccordionHeader.displayName = "AccordionHeader";

// ---- TRIGGER ----------------------------------------------------------------

type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof Accordion.Trigger
>;

/**
 * The interactive button that toggles its panel.
 *
 * Renders a trailing `CaretDown` glyph by default — rotated 180Â° when the
 * panel is open via `data-panel-open:[&>svg]:rotate-180`. Pass children to
 * place the caret after your own label content, or override the entire
 * trigger with the `render` prop for a bespoke layout.
 *
 * Data attributes:
 * - `data-panel-open` — reflects open state
 *
 * @since 0.1.0
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  return (
    <Accordion.Trigger
      data-slot="accordion-trigger"
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium",
        "transition-colors hover:underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-panel-open:[&>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <CaretDown
        aria-hidden
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none"
      />
    </Accordion.Trigger>
  );
}
AccordionTrigger.displayName = "AccordionTrigger";

// ---- PANEL ------------------------------------------------------------------

type AccordionPanelProps = React.ComponentPropsWithoutRef<
  typeof Accordion.Panel
>;

/**
 * The content region that collapses and expands.
 *
 * Base UI measures the natural content height and exposes it via
 * `--accordion-panel-height`. The panel animates from `h-0` (starting /
 * ending style) to that measured height, producing smooth expand/collapse
 * without layout thrash.
 *
 * Data attributes:
 * - `data-starting-style`, `data-ending-style` — drive the height transition
 * - `data-open` — reflects current open state
 *
 * CSS variables:
 * - `--accordion-panel-height` — measured natural height of the content
 *
 * @since 0.1.0
 */
function AccordionPanel({ className, ...props }: AccordionPanelProps) {
  return (
    <Accordion.Panel
      data-slot="accordion-panel"
      className={cn(
        "overflow-hidden text-sm",
        "h-(--accordion-panel-height) transition-[height] duration-300 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  );
}
AccordionPanel.displayName = "AccordionPanel";

// ---- EXPORTS ----------------------------------------------------------------

export {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
};

export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionPanelProps,
};
