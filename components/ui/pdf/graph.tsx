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
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfGraphDatum {
  label: string;
  value: number;
}

export interface PdfGraphProps {
  data: PdfGraphDatum[];
  width?: number;
  height?: number;
  emptyText?: string;
  style?: PdfStyleInput;
}

export function PdfGraph({
  data,
  width = 320,
  height = 140,
  emptyText = "No graph data",
  style,
}: PdfGraphProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    empty: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
    } as Style,
  });
  if (data.length === 0) return <Text style={styles.empty}>{emptyText}</Text>;

  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const padding = 20;
  const chartHeight = height - padding * 2;
  const slotWidth = (width - padding * 2) / data.length;
  const barWidth = Math.max(8, slotWidth * 0.55);
  const svgTextStyle = { fontSize: 7 } as never;

  return (
    <View style={mergePdfStyles(style)}>
      <Svg width={width} height={height}>
        <Rect x={0} y={0} width={width} height={height} fill="transparent" />
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding + index * slotWidth + (slotWidth - barWidth) / 2;
          const y = height - padding - barHeight;
          return (
            <G key={item.label}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={theme.colors.primary}
              />
              <SvgText
                x={x + barWidth / 2}
                y={height - 8}
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
                {item.value}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
