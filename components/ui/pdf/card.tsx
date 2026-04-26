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
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfCardProps {
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
}: PdfCardProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    card: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    } as Style,
    title: {
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.lg,
      fontWeight: 700,
      marginBottom: 4,
    } as Style,
    description: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      lineHeight: 1.45,
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
    <View wrap={!noWrap} style={mergePdfStyles(styles.card, style)}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {children}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}
