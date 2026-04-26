/**
 * Alert — callout message for React PDF documents.
 *
 * @registryTitle PDF Alert
 * @registryDescription Callout message with title, body, and tone-based border color.
 * @registryCategory structure
 * @registryDemos basic=Basic, destructive=Destructive
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

export interface PdfAlertProps {
  title?: string;
  children: React.ReactNode;
  tone?: "primary" | "success" | "warning" | "destructive";
  style?: PdfStyleInput;
}

export function PdfAlert({
  title,
  children,
  tone = "primary",
  style,
}: PdfAlertProps) {
  const theme = usePdfTheme();
  const color = getToneColor(theme, tone);
  const styles = StyleSheet.create({
    alert: {
      borderColor: theme.colors.border,
      borderLeftColor: color,
      borderLeftWidth: 4,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
    } as Style,
    title: {
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.base,
      fontWeight: 700,
      marginBottom: 4,
    } as Style,
    body: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      lineHeight: 1.45,
    } as Style,
  });

  return (
    <View style={mergePdfStyles(styles.alert, style)}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}
