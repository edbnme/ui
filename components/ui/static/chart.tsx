/**
 * Chart — Composable, themed chart components built on Recharts.
 *
 * A thin themed layer over Recharts v3 that standardises colour
 * resolution via CSS custom properties. Wrap any Recharts chart in
 * `ChartContainer` with a `config` map (`{ key: { label, icon, color? }}`)
 * to auto-inject `--color-*` variables scoped to the chart. Pair with
 * `ChartTooltip + ChartTooltipContent` and `ChartLegend +
 * ChartLegendContent` for matching tooltip / legend chrome that respects
 * `theme` (light/dark) overrides.
 *
 * Anatomy:
 * ```tsx
 * <ChartContainer config={{ desktop: { label: "Desktop", color: "hsl(var(--chart-1))" } }}>
 *   <BarChart data={data}>
 *     <CartesianGrid vertical={false} />
 *     <XAxis dataKey="month" />
 *     <Bar dataKey="desktop" fill="var(--color-desktop)" />
 *     <ChartTooltip content={<ChartTooltipContent />} />
 *     <ChartLegend content={<ChartLegendContent />} />
 *   </BarChart>
 * </ChartContainer>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/chart
 * @upstream   Recharts v3 — https://recharts.org
 * @registryDescription Composable chart components with Recharts integration and theme support.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";
import { createComponentContext } from "@/lib/create-component-context";

// ---- CONFIG TYPES -----------------------------------------------------------

/**
 * Map from a series key (matching `dataKey` in the chart) to display
 * metadata. Supply either a flat `color` or per-theme `theme: { light, dark }`.
 */
export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  )
>;

type ChartContextValue = {
  config: ChartConfig;
};

const [ChartProvider, useChart] =
  createComponentContext<ChartContextValue>("ChartContainer");

const THEMES = { light: "", dark: ".dark" } as const;

// ---- CONTAINER --------------------------------------------------------------

export type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Themed wrapper that injects CSS colour variables, provides the
 * `ChartConfig` context, and embeds a Recharts `ResponsiveContainer`
 * sized at `aspect-video` by default.
 *
 * @since 0.1.0
 */
function ChartContainer({
  ref,
  id,
  className,
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartProvider value={{ config }}>
      <div
        data-chart={chartId}
        data-slot="chart"
        ref={ref}
        role="img"
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-none",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-sector]:outline-none",
          "[&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartProvider>
  );
}
ChartContainer.displayName = "ChartContainer";

// ---- STYLE (CSS VAR INJECTION) ---------------------------------------------

/**
 * Emits a scoped `<style>` block that maps each config entry to a
 * `--color-<key>` CSS custom property, with per-theme overrides under
 * the `.dark` selector.
 *
 * @since 0.1.0
 */
function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color
  );

  if (!colorConfig.length) return null;

  return (
    <style
      data-slot="chart-style"
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join("\n")}
}`
          )
          .join("\n"),
      }}
    />
  );
}

// ---- TOOLTIP ----------------------------------------------------------------

/**
 * Recharts `Tooltip` re-exported for composition with
 * `ChartTooltipContent`.
 *
 * @since 0.1.0
 */
const ChartTooltip = RechartsPrimitive.Tooltip;

// ---- TOOLTIP CONTENT --------------------------------------------------------

export type ChartTooltipContentProps = React.ComponentProps<"div"> & {
  active?: boolean;
  payload?: Array<{
    name?: string;
    dataKey?: string;
    value?: number | string;
    color?: string;
    fill?: string;
    payload?: Record<string, unknown>;
    [key: string]: unknown;
  }>;
  label?: string;
  labelFormatter?: (value: unknown, payload: unknown[]) => React.ReactNode;
  labelClassName?: string;
  formatter?: (
    value: unknown,
    name: string,
    item: unknown,
    index: number,
    payload: unknown
  ) => React.ReactNode;
  color?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Themed tooltip body. Pass as the `content` prop to `ChartTooltip` —
 * Recharts will wire `active` / `payload` / `label` automatically.
 *
 * @since 0.1.0
 */
function ChartTooltipContent({
  ref,
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null;

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? itemConfig?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) return null;

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      ref={ref}
      data-slot="chart-tooltip-content"
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5" data-slot="chart-tooltip-items">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor =
            color ||
            ((item.payload as Record<string, unknown>)?.fill as string) ||
            item.color;

          return (
            <div
              key={String(item.dataKey ?? index)}
              data-slot="chart-tooltip-item"
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(
                  item.value,
                  item.name,
                  item,
                  index,
                  item.payload ?? {}
                )
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        data-slot="chart-tooltip-indicator"
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          }
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value !== undefined && (
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {typeof item.value === "number"
                          ? item.value.toLocaleString()
                          : String(item.value)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
ChartTooltipContent.displayName = "ChartTooltipContent";

// ---- LEGEND -----------------------------------------------------------------

/**
 * Recharts `Legend` re-exported for composition with `ChartLegendContent`.
 *
 * @since 0.1.0
 */
const ChartLegend = RechartsPrimitive.Legend;

// ---- LEGEND CONTENT ---------------------------------------------------------

export type ChartLegendContentProps = React.ComponentProps<"div"> & {
  payload?: Array<{
    value?: string;
    dataKey?: string;
    color?: string;
    [key: string]: unknown;
  }>;
  verticalAlign?: "top" | "bottom" | "middle";
  hideIcon?: boolean;
  nameKey?: string;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Themed legend body. Pass as the `content` prop to `ChartLegend`.
 *
 * @since 0.1.0
 */
function ChartLegendContent({
  ref,
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      ref={ref}
      data-slot="chart-legend-content"
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            data-slot="chart-legend-item"
            className={cn(
              "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                data-slot="chart-legend-swatch"
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}
ChartLegendContent.displayName = "ChartLegendContent";

// ---- HELPERS ----------------------------------------------------------------

/**
 * Resolve the `ChartConfig` entry that backs a given payload row. Tries
 * the row's explicit key first, then falls back to a nested
 * `payload[key]` path so chart types with wrapped payloads (e.g. pie)
 * still match.
 */
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) return undefined;

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in config) {
    configLabelKey = key;
  } else if (
    payloadPayload &&
    typeof payloadPayload === "object" &&
    key in payloadPayload
  ) {
    configLabelKey = String((payloadPayload as Record<string, unknown>)[key]);
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

// ---- EXPORTS ----------------------------------------------------------------

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
