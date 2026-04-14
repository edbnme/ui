/**
 * Chart — Composable, themed chart components built on Recharts.
 * CSS variable theming with pre-styled tooltips and legends.
 *
 * @example
 * <ChartContainer config={chartConfig}>
 *   <BarChart data={data}>
 *     <CartesianGrid vertical={false} />
 *     <XAxis dataKey="month" />
 *     <Bar dataKey="desktop" fill="var(--color-desktop)" />
 *     <ChartTooltip content={<ChartTooltipContent />} />
 *     <ChartLegend content={<ChartLegendContent />} />
 *   </BarChart>
 * </ChartContainer>
 *
 * @see https://recharts.org
 */
"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
import { createComponentContext } from "@/lib/create-component-context";

// ---- CHART CONFIG -----------------------------------------------------------

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

type ChartContextProps = {
  config: ChartConfig;
};

const [ChartProvider, useChart] =
  createComponentContext<ChartContextProps>("ChartContainer");

// ---- CHART CONTAINER --------------------------------------------------------

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartProvider value={{ config }}>
      <div
        data-chart={chartId}
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
});
ChartContainer.displayName = "ChartContainer";

// ---- CHART STYLE (CSS VARIABLE INJECTION) -----------------------------------

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color
  );

  if (!colorConfig.length) return null;

  return (
    <style
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

const THEMES = { light: "", dark: ".dark" } as const;

// ---- CHART TOOLTIP ----------------------------------------------------------

const ChartTooltip = RechartsPrimitive.Tooltip;

// ---- CHART TOOLTIP CONTENT --------------------------------------------------

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
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
  }
>(
  (
    {
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
    },
    ref
  ) => {
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
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
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
);
ChartTooltipContent.displayName = "ChartTooltipContent";

// ---- CHART LEGEND -----------------------------------------------------------

const ChartLegend = RechartsPrimitive.Legend;

// ---- CHART LEGEND CONTENT ---------------------------------------------------

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: Array<{
      value?: string;
      dataKey?: string;
      color?: string;
      [key: string]: unknown;
    }>;
    verticalAlign?: "top" | "bottom" | "middle";
    hideIcon?: boolean;
    nameKey?: string;
  }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart();

    if (!payload?.length) return null;

    return (
      <div
        ref={ref}
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
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

// ---- HELPERS ----------------------------------------------------------------

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
