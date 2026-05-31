/**
 * SVG - safe SVG container for React PDF documents.
 *
 * @registryTitle PDF SVG
 * @registryDescription Theme-aware SVG container plus re-exported React PDF SVG primitives.
 * @registryCategory media
 * @registryDemos basic=Basic
 */

import * as React from "react";
import {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text,
  Tspan,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  getPdfPrimitiveProps,
  isPdfNodeEmpty,
  mergePdfStyles,
  resolvePdfSize,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfSvgProps extends PdfPrimitiveProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  title?: React.ReactNode;
  fallback?: React.ReactNode;
  backgroundColor?: string;
  style?: PdfStyleInput;
  svgStyle?: PdfStyleInput;
}

export function PdfSvg({
  children,
  width = "100%",
  height = 160,
  viewBox,
  title,
  fallback = "SVG unavailable",
  backgroundColor = "transparent",
  style,
  svgStyle,
  ...primitiveProps
}: PdfSvgProps) {
  const theme = usePdfTheme();
  const resolvedWidth = resolvePdfSize(width) ?? "100%";
  const resolvedHeight = resolvePdfSize(height) ?? 160;
  const styles = StyleSheet.create({
    root: { width: resolvedWidth } as Style,
    title: {
      ...createPdfTextStyle(theme, { size: "xs", tone: "muted" }),
      marginBottom: 4,
    } as Style,
    fallback: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
  });

  if (isPdfNodeEmpty(children)) {
    return (
      <View
        {...getPdfPrimitiveProps(primitiveProps)}
        style={mergePdfStyles(styles.root, style)}
      >
        <Text style={styles.fallback}>{fallback}</Text>
      </View>
    );
  }

  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.root, style)}
    >
      {isPdfNodeEmpty(title) ? null : <Text style={styles.title}>{title}</Text>}
      <Svg
        width={resolvedWidth}
        height={resolvedHeight}
        viewBox={viewBox}
        style={mergePdfStyles(svgStyle)}
      >
        <Rect
          x={0}
          y={0}
          width={resolvedWidth}
          height={resolvedHeight}
          fill={backgroundColor}
        />
        {children}
      </Svg>
    </View>
  );
}

export {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg as ReactPdfSvg,
  Text as PdfSvgText,
  Tspan,
};
