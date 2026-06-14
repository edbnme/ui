/**
 * Tabs - Premium solid tabbed panels.
 *
 * Built on Base UI Tabs v1.5.0. The wrapper preserves Root, List, Tab,
 * Indicator, and Panel props, refs, render composition, state className,
 * state style, data attributes, CSS variables, and controlled/uncontrolled
 * value behavior.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.1.0
 * @docs https://ui.edbn.me/docs/components/tabs
 * @upstream https://base-ui.com/react/components/tabs
 * @registryDescription Premium solid tabs with accessible panel switching and animated indicator.
 */

"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

type StateClassName<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

function composeClassName<State>(
  baseClassName: string,
  className: StateClassName<State>
) {
  if (typeof className === "function") {
    return (state: State) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

// ---- ROOT -------------------------------------------------------------------

export type TabsRootProps = React.ComponentProps<typeof Tabs.Root>;

function TabsRoot({ className, ...props }: TabsRootProps) {
  return (
    <Tabs.Root
      data-slot="tabs-root"
      className={composeClassName<Tabs.Root.State>("w-full", className)}
      {...props}
    />
  );
}
TabsRoot.displayName = "TabsRoot";

// ---- LIST -------------------------------------------------------------------

export type TabsListProps = React.ComponentProps<typeof Tabs.List>;

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <Tabs.List
      data-slot="tabs-list"
      className={composeClassName<Tabs.List.State>(
        cn(
          "relative inline-flex min-h-9 items-center justify-center rounded-lg border border-border/70 bg-background p-1 text-muted-foreground shadow-sm",
          "data-orientation-vertical:h-auto data-orientation-vertical:flex-col data-orientation-vertical:items-stretch"
        ),
        className
      )}
      {...props}
    />
  );
}
TabsList.displayName = "TabsList";

// ---- TAB --------------------------------------------------------------------

export type TabsTabProps = React.ComponentProps<typeof Tabs.Tab>;

function TabsTab({ className, ...props }: TabsTabProps) {
  return (
    <Tabs.Tab
      data-slot="tabs-tab"
      className={composeClassName<Tabs.Tab.State>(
        cn(
          "relative z-10 inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium",
          "transition-[color,background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-selected:text-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50"
        ),
        className
      )}
      {...props}
    />
  );
}
TabsTab.displayName = "TabsTab";

// ---- INDICATOR --------------------------------------------------------------

export type TabsIndicatorProps = React.ComponentProps<typeof Tabs.Indicator>;

function TabsIndicator({ className, ...props }: TabsIndicatorProps) {
  return (
    <Tabs.Indicator
      data-slot="tabs-indicator"
      className={composeClassName<Tabs.Indicator.State>(
        cn(
          "absolute left-(--active-tab-left) top-(--active-tab-top) h-(--active-tab-height) w-(--active-tab-width)",
          "rounded-md bg-background shadow-sm ring-1 ring-border/70",
          "transition-[left,top,width,height] duration-200 ease-out motion-reduce:transition-none"
        ),
        className
      )}
      {...props}
    />
  );
}
TabsIndicator.displayName = "TabsIndicator";

// ---- PANEL ------------------------------------------------------------------

export type TabsPanelProps = React.ComponentProps<typeof Tabs.Panel>;

function TabsPanel({ className, ...props }: TabsPanelProps) {
  return (
    <Tabs.Panel
      data-slot="tabs-panel"
      className={composeClassName<Tabs.Panel.State>(
        cn(
          "mt-2 rounded-lg border border-transparent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
          "transition-opacity duration-150 ease-out motion-reduce:transition-none"
        ),
        className
      )}
      {...props}
    />
  );
}
TabsPanel.displayName = "TabsPanel";

// ---- EXPORTS ----------------------------------------------------------------

export { TabsRoot, TabsList, TabsTab, TabsIndicator, TabsPanel };
