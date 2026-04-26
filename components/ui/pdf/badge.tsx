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
  getToneColor,
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfBadgeProps {
  children: React.ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "destructive";
  style?: PdfStyleInput;
}

export function PdfBadge({ children, tone = "default", style }: PdfBadgeProps) {
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
      color,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.xs,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    } as Style,
  });

  return (
    <View style={mergePdfStyles(styles.badge, style)}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}
