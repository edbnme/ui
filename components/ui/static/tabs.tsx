/**
 * Tabs — Tabbed interface for switching between content panels.
 * Built on @base-ui/react Tabs primitive.
 *
 * @example
 * <TabsRoot defaultValue="tab1">
 *   <TabsList>
 *     <TabsTab value="tab1">Tab 1</TabsTab>
 *     <TabsTab value="tab2">Tab 2</TabsTab>
 *   </TabsList>
 *   <TabsPanel value="tab1">Content 1</TabsPanel>
 *   <TabsPanel value="tab2">Content 2</TabsPanel>
 * </TabsRoot>
 *
 * @see https://base-ui.com/react/components/tabs
 */
"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

// =============================================================================
// TABS ROOT
// =============================================================================

const TabsRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Tabs.Root>
>(({ className, ...props }, ref) => (
  <Tabs.Root ref={ref} className={cn("w-full", className)} {...props} />
));
TabsRoot.displayName = "TabsRoot";

// =============================================================================
// TABS LIST
// =============================================================================

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Tabs.List>
>(({ className, ...props }, ref) => (
  <Tabs.List
    ref={ref}
    className={cn(
      "relative inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

// =============================================================================
// TABS TAB
// =============================================================================

const TabsTab = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Tabs.Tab>
>(({ className, ...props }, ref) => (
  <Tabs.Tab
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-selected:bg-background data-selected:text-foreground data-selected:shadow",
      className
    )}
    {...props}
  />
));
TabsTab.displayName = "TabsTab";

// =============================================================================
// TABS INDICATOR
// =============================================================================

const TabsIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof Tabs.Indicator>
>(({ className, ...props }, ref) => (
  <Tabs.Indicator
    ref={ref}
    className={cn(
      "absolute left-(--active-tab-left) top-(--active-tab-top) w-(--active-tab-width) h-(--active-tab-height)",
      "rounded-md bg-background shadow transition-all duration-200",
      className
    )}
    {...props}
  />
));
TabsIndicator.displayName = "TabsIndicator";

// =============================================================================
// TABS PANEL
// =============================================================================

const TabsPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Tabs.Panel>
>(({ className, ...props }, ref) => (
  <Tabs.Panel
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsPanel.displayName = "TabsPanel";

// =============================================================================
// EXPORTS
// =============================================================================

export { TabsRoot, TabsList, TabsTab, TabsIndicator, TabsPanel };
