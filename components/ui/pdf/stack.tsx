/**
 * Stack — flex layout primitive for React PDF documents.
 *
 * @registryTitle PDF Stack
 * @registryDescription Flexbox stack layout for PDF rows, columns, spacing, and wrapping.
 * @registryCategory layout
 * @registryDemos basic=Basic, row=Row
 */

import * as React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  clampPdfNumber,
  getPdfPrimitiveProps,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfStackProps extends PdfPrimitiveProps {
  children: React.ReactNode;
  direction?: "row" | "column";
  gap?: number;
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  wrap?: boolean;
  noWrap?: boolean;
  style?: PdfStyleInput;
}

export function PdfStack({
  children,
  direction = "column",
  gap,
  align = "stretch",
  justify = "flex-start",
  wrap = false,
  noWrap = false,
  style,
  ...primitiveProps
}: PdfStackProps) {
  const theme = usePdfTheme();
  const safeGap = clampPdfNumber(gap, theme.spacing.gap, 0, 96);
  const styles = StyleSheet.create({
    stack: {
      flexDirection: direction,
      gap: safeGap,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? "wrap" : "nowrap",
    } as Style,
  });

  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      wrap={noWrap ? false : undefined}
      style={mergePdfStyles(styles.stack, style)}
    >
      {children}
    </View>
  );
}
