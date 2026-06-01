/**
 * Accordion - A stacked set of collapsible disclosure sections.
 *
 * Built on Base UI Accordion and intentionally keeps the upstream API surface
 * available: Root, Item, Header, Trigger, and Panel accept Base UI's `render`,
 * function-valued `className`/`style`, controlled state, keyboard navigation,
 * and panel mounting props.
 *
 * Anatomy:
 * ```tsx
 * <AccordionRoot defaultValue={["faq-1"]}>
 *   <AccordionItem value="faq-1">
 *     <AccordionHeader>
 *       <AccordionTrigger>Question 1</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionPanel>Answer content</AccordionPanel>
 *   </AccordionItem>
 * </AccordionRoot>
 * ```
 *
 * Motion: `AccordionPanel` uses Base UI's `--accordion-panel-height` CSS
 * variable with `data-starting-style` and `data-ending-style` for an
 * interruptible height transition. Reduced-motion preferences are respected.
 *
 * Accessibility: Base UI wires headings, buttons, ARIA attributes, controlled
 * state, disabled state, roving focus, and orientation-specific arrow keys.
 *
 * @version 0.3.0
 * @package    @edbn/ui
 * @brand      edbn/ui -- https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/accordion
 * @upstream   Base UI v1.5.0 -- https://base-ui.com/react/components/accordion
 * @registryDescription Vertically collapsible content panels with smooth height animations.
 * @registryDemos basic=Basic, controlled=Controlled
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Accordion } from "@base-ui/react/accordion";
import { CaretDown } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- HELPERS ----------------------------------------------------------------

type BaseClassName<State> = string | ((state: State) => string | undefined);

function composeClassName<State>(
  baseClassName: string,
  className: BaseClassName<State> | undefined
): BaseClassName<State> {
  if (typeof className === "function") {
    return (state) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

// ---- ROOT -------------------------------------------------------------------

export type AccordionRootProps<Value = any> = Omit<
  Accordion.Root.Props<Value>,
  "ref"
>;

interface AccordionRootComponent {
  <Value = any>(
    props: AccordionRootProps<Value> & React.RefAttributes<HTMLDivElement>
  ): React.ReactElement | null;
  displayName?: string;
}

const AccordionRootBase = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  function AccordionRoot({ className, ...props }, ref) {
    return (
      <Accordion.Root
        ref={ref}
        data-slot="accordion-root"
        className={composeClassName<Accordion.Root.State>(
          "w-full overflow-hidden rounded-[8px] border border-border/70 bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      />
    );
  }
);

export const AccordionRoot = AccordionRootBase as AccordionRootComponent;
AccordionRoot.displayName = "AccordionRoot";

// ---- ITEM -------------------------------------------------------------------

export type AccordionItemProps = Omit<Accordion.Item.Props, "ref">;

export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <Accordion.Item
      ref={ref}
      data-slot="accordion-item"
      className={composeClassName<Accordion.Item.State>(
        "border-b border-border/70 last:border-b-0 data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
AccordionItem.displayName = "AccordionItem";

// ---- HEADER -----------------------------------------------------------------

export type AccordionHeaderProps = Omit<Accordion.Header.Props, "ref">;

export const AccordionHeader = React.forwardRef<
  HTMLHeadingElement,
  AccordionHeaderProps
>(function AccordionHeader({ className, ...props }, ref) {
  return (
    <Accordion.Header
      ref={ref}
      data-slot="accordion-header"
      className={composeClassName<Accordion.Header.State>("flex", className)}
      {...props}
    />
  );
});
AccordionHeader.displayName = "AccordionHeader";

// ---- TRIGGER ----------------------------------------------------------------

export type AccordionTriggerProps = Omit<Accordion.Trigger.Props, "ref">;

export const AccordionTrigger = React.forwardRef<
  HTMLElement,
  AccordionTriggerProps
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <Accordion.Trigger
      ref={ref}
      data-slot="accordion-trigger"
      className={composeClassName<Accordion.Trigger.State>(
        [
          "flex w-full flex-1 items-center justify-between gap-4 px-4 py-3.5",
          "text-left text-sm font-medium leading-none tracking-normal text-card-foreground",
          "outline-none transition-[background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "hover:bg-accent/45 hover:text-accent-foreground active:bg-accent/60",
          "focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          "disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
          "data-panel-open:bg-accent/35 data-panel-open:[&>svg]:rotate-180",
          "motion-reduce:transition-none",
        ].join(" "),
        className
      )}
      {...props}
    >
      {children}
      <CaretDown
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
      />
    </Accordion.Trigger>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

// ---- PANEL ------------------------------------------------------------------

export type AccordionPanelProps = Omit<Accordion.Panel.Props, "ref">;

export const AccordionPanel = React.forwardRef<
  HTMLDivElement,
  AccordionPanelProps
>(function AccordionPanel({ className, ...props }, ref) {
  return (
    <Accordion.Panel
      ref={ref}
      data-slot="accordion-panel"
      className={composeClassName<Accordion.Panel.State>(
        [
          "h-[var(--accordion-panel-height)] overflow-hidden text-sm leading-6 text-muted-foreground",
          "transition-[height] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "data-starting-style:h-0 data-ending-style:h-0",
          "motion-reduce:transition-none",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
});
AccordionPanel.displayName = "AccordionPanel";
