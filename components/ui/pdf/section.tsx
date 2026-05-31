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
  createPdfTextStyle,
  formatPdfValue,
  getPdfFlowProps,
  isPdfNodeEmpty,
  mergePdfStyles,
  type PdfFlowProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfSectionProps extends PdfFlowProps {
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
  wrap,
  ...flowProps
}: PdfSectionProps) {
  const theme = usePdfTheme();
  const hasTitle = !isPdfNodeEmpty(title);
  const hasDescription = !isPdfNodeEmpty(description);
  const styles = StyleSheet.create({
    section: {
      marginBottom: theme.spacing.section,
      paddingTop: hasTitle ? theme.spacing.sm : 0,
    } as Style,
    title: {
      ...createPdfTextStyle(theme, { size: "lg", weight: "bold" }),
      marginBottom: 4,
    } as Style,
    description: {
      ...createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
      marginBottom: theme.spacing.sm,
    } as Style,
  });

  return (
    <View
      {...getPdfFlowProps({ ...flowProps, wrap: wrap ?? !noWrap })}
      style={mergePdfStyles(styles.section, style)}
    >
      {hasTitle ? (
        <Text style={styles.title}>{formatPdfValue(title)}</Text>
      ) : null}
      {hasDescription ? (
        <Text style={styles.description}>{formatPdfValue(description)}</Text>
      ) : null}
      {children}
    </View>
  );
}
