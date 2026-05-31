/**
 * Graph — compact SVG charts for React PDF documents.
 *
 * @registryTitle PDF Graph
 * @registryDescription Lightweight bar graph rendered with React PDF SVG primitives.
 * @registryCategory data
 * @registryDemos basic=Basic, empty=Empty
 */

import {
  Svg,
  Rect,
  G,
  Text as SvgText,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  clampPdfNumber,
  createPdfTextStyle,
  getPdfPrimitiveProps,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfGraphDatum {
  label: string;
  value: number;
  color?: string;
}

export interface PdfGraphProps extends PdfPrimitiveProps {
  data?: readonly PdfGraphDatum[] | null;
  width?: number;
  height?: number;
  emptyText?: string;
  maxBars?: number;
  valueFormatter?: (value: number, datum: PdfGraphDatum) => string | number;
  style?: PdfStyleInput;
}

export function PdfGraph({
  data,
  width = 320,
  height = 140,
  emptyText = "No graph data",
  maxBars,
  valueFormatter,
  style,
  ...primitiveProps
}: PdfGraphProps) {
  const theme = usePdfTheme();
  const items = data ?? [];
  const chartWidth = clampPdfNumber(width, 320, 120, 1200);
  const chartHeight = clampPdfNumber(height, 140, 80, 800);
  const safeMaxBars = maxBars
    ? Math.floor(clampPdfNumber(maxBars, items.length, 1, items.length))
    : items.length;
  const chartData = items
    .filter((item) => Number.isFinite(item.value))
    .slice(0, safeMaxBars)
    .map((item) => ({ ...item, value: Math.max(0, item.value) }));
  const styles = StyleSheet.create({
    empty: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
  });
  if (chartData.length === 0) {
    return <Text style={styles.empty}>{emptyText}</Text>;
  }

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);
  const padding = 20;
  const drawableHeight = Math.max(1, chartHeight - padding * 2);
  const slotWidth = (chartWidth - padding * 2) / chartData.length;
  const barWidth = Math.max(8, slotWidth * 0.55);
  const svgTextStyle = { fontSize: 7 } as never;

  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(style)}
    >
      <Svg width={chartWidth} height={chartHeight}>
        <Rect
          x={0}
          y={0}
          width={chartWidth}
          height={chartHeight}
          fill="transparent"
        />
        {chartData.map((item, index) => {
          const barHeight = (item.value / maxValue) * drawableHeight;
          const x = padding + index * slotWidth + (slotWidth - barWidth) / 2;
          const y = chartHeight - padding - barHeight;
          return (
            <G key={`${item.label}-${index}`}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color ?? theme.colors.primary}
              />
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight - 8}
                textAnchor="middle"
                fill={theme.colors.mutedForeground}
                style={svgTextStyle}
              >
                {item.label}
              </SvgText>
              <SvgText
                x={x + barWidth / 2}
                y={Math.max(10, y - 4)}
                textAnchor="middle"
                fill={theme.colors.foreground}
                style={svgTextStyle}
              >
                {valueFormatter ? valueFormatter(item.value, item) : item.value}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
