/**
 * Tabs — Tabbed interface for switching between related content panels.
 *
 * Built on the Base UI `Tabs` primitive. Supports horizontal/vertical
 * orientation, automatic or manual activation, looping keyboard focus, and a
 * sliding `TabsIndicator` that animates to the active tab using CSS
 * variables — no layout measurement needed from consumers.
 *
 * Anatomy:
 * ```tsx
 * <TabsRoot defaultValue="overview">
 *   <TabsList>
 *     <TabsTab value="overview">Overview</TabsTab>
 *     <TabsTab value="activity">Activity</TabsTab>
 *     <TabsIndicator />
 *   </TabsList>
 *   <TabsPanel value="overview">…</TabsPanel>
 *   <TabsPanel value="activity">…</TabsPanel>
 * </TabsRoot>
 * ```
 *
 * Accessibility: full ARIA tabpanel pattern wired automatically —
 * `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, and
 * `aria-labelledby` are managed by Base UI. Arrow keys move focus, Home/End
 * jump to edges, and focus wraps when `loop` is enabled.
 *
 * @version 0.3.0
 * @package    @edbn/ui
 * @brand      edbn/ui -- https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/tabs
 * @upstream   Base UI v1.2.0 -- https://base-ui.com/react/components/tabs
 * @registryDescription Tabbed interface with accessible panel switching.
 */

"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

type TabsRootProps = React.ComponentPropsWithoutRef<typeof Tabs.Root>;

/**
 * Stateful root — owns the active tab value. Use `defaultValue` for
 * uncontrolled or `value` + `onValueChange` for controlled.
 *
 * Props of note:
 * - `orientation` — `"horizontal"` (default) or `"vertical"`
 * - `activationDirection` — hint used by the indicator animation
 *
 * Data attributes:
 * - `data-orientation`
 *
 * @since 0.1.0
 */
function TabsRoot({ className, ...props }: TabsRootProps) {
  return (
    <Tabs.Root
      data-slot="tabs-root"
      className={cn("w-full", className)}
      {...props}
    />
  );
}
TabsRoot.displayName = "TabsRoot";

// ---- LIST -------------------------------------------------------------------

type TabsListProps = React.ComponentPropsWithoutRef<typeof Tabs.List>;

/**
 * The tab strip container. `relative` so the absolutely-positioned
 * `TabsIndicator` can sit behind the tabs.
 *
 * Data attributes:
 * - `data-orientation`
 *
 * @since 0.1.0
 */
function TabsList({ className, ...props }: TabsListProps) {
  return (
    <Tabs.List
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        "data-orientation-vertical:h-auto data-orientation-vertical:flex-col",
        className
      )}
      {...props}
    />
  );
}
TabsList.displayName = "TabsList";

// ---- TAB --------------------------------------------------------------------

type TabsTabProps = React.ComponentPropsWithoutRef<typeof Tabs.Tab>;

/**
 * A single tab trigger. Identify the tab via `value` — matching
 * `TabsPanel value` renders its content. The active tab exposes
 * `data-selected`, which drives the lifted card appearance.
 *
 * Data attributes:
 * - `data-selected` — present on the active tab
 * - `data-orientation`
 * - `data-disabled`
 *
 * @since 0.1.0
 */
function TabsTab({ className, ...props }: TabsTabProps) {
  return (
    <Tabs.Tab
      data-slot="tabs-tab"
      className={cn(
        "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium",
        "ring-offset-background transition-[color,background-color,box-shadow] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-selected:text-foreground",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  );
}
TabsTab.displayName = "TabsTab";

// ---- INDICATOR --------------------------------------------------------------

type TabsIndicatorProps = React.ComponentPropsWithoutRef<typeof Tabs.Indicator>;

/**
 * Sliding active-tab indicator. Base UI exposes `--active-tab-left`,
 * `--active-tab-top`, `--active-tab-width`, and `--active-tab-height` CSS
 * variables that track the currently selected tab — transitioning them
 * produces the smooth slide/resize animation.
 *
 * Render **inside** `TabsList` (not between tabs) so it overlays correctly.
 *
 * Data attributes:
 * - `data-orientation`
 * - `data-activation-direction` — `"left"` | `"right"` | `"up"` | `"down"`
 *
 * CSS variables:
 * - `--active-tab-left`, `--active-tab-top`, `--active-tab-width`,
 *   `--active-tab-height` — read-only, provided by Base UI.
 *
 * @since 0.1.0
 */
function TabsIndicator({ className, ...props }: TabsIndicatorProps) {
  return (
    <Tabs.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute left-(--active-tab-left) top-(--active-tab-top) w-(--active-tab-width) h-(--active-tab-height)",
        "rounded-md bg-background shadow transition-all duration-200 ease-out",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  );
}
TabsIndicator.displayName = "TabsIndicator";

// ---- PANEL ------------------------------------------------------------------

type TabsPanelProps = React.ComponentPropsWithoutRef<typeof Tabs.Panel>;

/**
 * A content region paired with a `TabsTab` of the same `value`. Rendered
 * only when its tab is active (Base UI also manages focus forwarding via
 * `tabIndex`).
 *
 * Data attributes:
 * - `data-orientation`
 *
 * @since 0.1.0
 */
function TabsPanel({ className, ...props }: TabsPanelProps) {
  return (
    <Tabs.Panel
      data-slot="tabs-panel"
      className={cn(
        "mt-2 ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}
TabsPanel.displayName = "TabsPanel";

// ---- EXPORTS ----------------------------------------------------------------

export { TabsRoot, TabsList, TabsTab, TabsIndicator, TabsPanel };

export type {
  TabsRootProps,
  TabsListProps,
  TabsTabProps,
  TabsIndicatorProps,
  TabsPanelProps,
};
