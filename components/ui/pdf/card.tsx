/**
 * Card — bordered content container for React PDF documents.
 *
 * @registryTitle PDF Card
 * @registryDescription Bordered card container with title, description, and footer slots.
 * @registryCategory structure
 * @registryDemos basic=Basic, footer=Footer
 */

import * as React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  formatPdfValue,
  getPdfFlowProps,
  isPdfNodeEmpty,
  mergePdfStyles,
  type PdfFlowProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfCardProps extends PdfFlowProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  noWrap?: boolean;
  style?: PdfStyleInput;
}

export function PdfCard({
  title,
  description,
  footer,
  children,
  noWrap = false,
  style,
  wrap,
  ...flowProps
}: PdfCardProps) {
  const theme = usePdfTheme();
  const hasTitle = !isPdfNodeEmpty(title);
  const hasDescription = !isPdfNodeEmpty(description);
  const hasFooter = !isPdfNodeEmpty(footer);
  const styles = StyleSheet.create({
    card: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    } as Style,
    title: {
      ...createPdfTextStyle(theme, { size: "lg", weight: "bold" }),
      marginBottom: 4,
    } as Style,
    description: {
      ...createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
      marginBottom: theme.spacing.md,
    } as Style,
    footer: {
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    } as Style,
  });

  return (
    <View
      {...getPdfFlowProps({ ...flowProps, wrap: wrap ?? !noWrap })}
      style={mergePdfStyles(styles.card, style)}
    >
      {hasTitle ? (
        <Text style={styles.title}>{formatPdfValue(title)}</Text>
      ) : null}
      {hasDescription ? (
        <Text style={styles.description}>{formatPdfValue(description)}</Text>
      ) : null}
      {children}
      {hasFooter ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}
