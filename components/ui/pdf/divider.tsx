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
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfDividerProps {
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  style?: PdfStyleInput;
}

export function PdfDivider({
  orientation = "horizontal",
  thickness = 1,
  style,
}: PdfDividerProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    divider: {
      backgroundColor: theme.colors.border,
      height: orientation === "horizontal" ? thickness : "100%",
      marginVertical: orientation === "horizontal" ? theme.spacing.md : 0,
      width: orientation === "vertical" ? thickness : "100%",
    } as Style,
  });

  return <View style={mergePdfStyles(styles.divider, style)} />;
}
