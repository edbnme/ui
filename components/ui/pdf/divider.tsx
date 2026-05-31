/**
 * Divider — horizontal or vertical rule for React PDF documents.
 *
 * @registryTitle PDF Divider
 * @registryDescription Theme-aware PDF divider with horizontal and vertical orientations.
 * @registryCategory structure
 * @registryDemos basic=Basic, vertical=Vertical
 */

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

export interface PdfDividerProps extends PdfPrimitiveProps {
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  style?: PdfStyleInput;
}

export function PdfDivider({
  orientation = "horizontal",
  thickness = 1,
  style,
  ...primitiveProps
}: PdfDividerProps) {
  const theme = usePdfTheme();
  const safeThickness = clampPdfNumber(thickness, 1, 0.25, 24);
  const styles = StyleSheet.create({
    divider: {
      backgroundColor: theme.colors.border,
      height: orientation === "horizontal" ? safeThickness : "100%",
      marginVertical: orientation === "horizontal" ? theme.spacing.md : 0,
      width: orientation === "vertical" ? safeThickness : "100%",
    } as Style,
  });

  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.divider, style)}
    />
  );
}
