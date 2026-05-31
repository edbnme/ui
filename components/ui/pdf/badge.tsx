/**
 * Badge — compact label for React PDF documents.
 *
 * @registryTitle PDF Badge
 * @registryDescription Compact status badge with neutral, primary, success, warning, and destructive tones.
 * @registryCategory structure
 * @registryDemos basic=Basic, tones=Tones
 */

import * as React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  formatPdfValue,
  getPdfPrimitiveProps,
  getToneColor,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfBadgeProps extends PdfPrimitiveProps {
  children: React.ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "destructive";
  style?: PdfStyleInput;
}

export function PdfBadge({
  children,
  tone = "default",
  style,
  ...primitiveProps
}: PdfBadgeProps) {
  const theme = usePdfTheme();
  const color =
    tone === "default"
      ? theme.colors.mutedForeground
      : getToneColor(theme, tone);
  const styles = StyleSheet.create({
    badge: {
      alignSelf: "flex-start",
      borderColor: color,
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 7,
      paddingVertical: 3,
    } as Style,
    text: {
      ...createPdfTextStyle(theme, { color, size: "xs", weight: "bold" }),
      textTransform: "uppercase",
      letterSpacing: 0.6,
    } as Style,
  });

  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.badge, style)}
    >
      <Text style={styles.text}>{formatPdfValue(children)}</Text>
    </View>
  );
}
