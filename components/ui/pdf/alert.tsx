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
  createPdfTextStyle,
  formatPdfValue,
  getPdfPrimitiveProps,
  getToneColor,
  isPdfNodeEmpty,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfAlertProps extends PdfPrimitiveProps {
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
  ...primitiveProps
}: PdfAlertProps) {
  const theme = usePdfTheme();
  const color = getToneColor(theme, tone);
  const hasTitle = !isPdfNodeEmpty(title);
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
    title: createPdfTextStyle(theme, {
      marginBottom: 4,
      size: "base",
      weight: "bold",
    }),
    body: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
  });

  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.alert, style)}
    >
      {hasTitle ? (
        <Text style={styles.title}>{formatPdfValue(title)}</Text>
      ) : null}
      <Text style={styles.body}>{formatPdfValue(children)}</Text>
    </View>
  );
}
