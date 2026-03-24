/**
 * Accordion — Collapsible content sections for grouping related information.
 * Built on @base-ui/react Accordion primitive.
 *
 * @example
 * <AccordionRoot defaultValue={["item-1"]}>
 *   <AccordionItem value="item-1">
 *     <AccordionHeader>
 *       <AccordionTrigger>Section 1</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionPanel>Content 1</AccordionPanel>
 *   </AccordionItem>
 * </AccordionRoot>
 *
 * @see https://base-ui.com/react/components/accordion
 */
"use client";

import * as React from "react";
import { Accordion } from "@base-ui/react/accordion";
import { cn } from "@/lib/utils";
import { CaretDown } from "@phosphor-icons/react";

// =============================================================================
// ACCORDION ROOT
// =============================================================================

const AccordionRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Accordion.Root>
>(({ className, ...props }, ref) => (
  <Accordion.Root ref={ref} className={cn("w-full", className)} {...props} />
));
AccordionRoot.displayName = "AccordionRoot";

// =============================================================================
// ACCORDION ITEM
// =============================================================================

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Accordion.Item>
>(({ className, ...props }, ref) => (
  <Accordion.Item
    ref={ref}
    className={cn("border-b border-border", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

// =============================================================================
// ACCORDION HEADER
// =============================================================================

const AccordionHeader = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithRef<typeof Accordion.Header>
>(({ className, ...props }, ref) => (
  <Accordion.Header ref={ref} className={cn("flex", className)} {...props} />
));
AccordionHeader.displayName = "AccordionHeader";

// =============================================================================
// ACCORDION TRIGGER
// =============================================================================

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof Accordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <Accordion.Trigger
    ref={ref}
    className={cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium",
      "hover:underline",
      "data-panel-open:[&>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
    <CaretDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
  </Accordion.Trigger>
));
AccordionTrigger.displayName = "AccordionTrigger";

// =============================================================================
// ACCORDION PANEL
// =============================================================================

const AccordionPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Accordion.Panel>
>(({ className, ...props }, ref) => (
  <Accordion.Panel
    ref={ref}
    className={cn(
      "overflow-hidden text-sm",
      "h-(--accordion-panel-height) transition-[height] duration-300 ease-out",
      "data-ending-style:h-0 data-starting-style:h-0",
      className
    )}
    {...props}
  />
));
AccordionPanel.displayName = "AccordionPanel";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
};
