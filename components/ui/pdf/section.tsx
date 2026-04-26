/**
 * Section — titled content region for React PDF documents.
 *
 * @registryTitle PDF Section
 * @registryDescription Titled document section with optional description and wrapping controls.
 * @registryCategory layout
 * @registryDemos basic=Basic, no-wrap=No Wrap
 */

import * as React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  noWrap?: boolean;
  style?: PdfStyleInput;
}

export function PdfSection({
  title,
  description,
  children,
  noWrap = false,
  style,
}: PdfSectionProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    section: {
      marginBottom: theme.spacing.section,
      paddingTop: title ? theme.spacing.sm : 0,
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
      marginBottom: theme.spacing.sm,
    } as Style,
  });

  return (
    <View wrap={!noWrap} style={mergePdfStyles(styles.section, style)}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {children}
    </View>
  );
}
