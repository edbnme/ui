/**
 * Heading — document headings for React PDF.
 *
 * @registryTitle PDF Heading
 * @registryDescription Document headings with semantic levels and stable PDF typography.
 * @registryCategory typography
 * @registryDemos basic=Basic, levels=Levels
 */

import * as React from "react";
import { Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  eyebrow?: string;
  style?: PdfStyleInput;
}

const levelSize = {
  1: "xxl",
  2: "xl",
  3: "lg",
  4: "base",
} as const;

export function PdfHeading({
  children,
  level = 2,
  eyebrow,
  style,
}: PdfHeadingProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    eyebrow: {
      color: theme.colors.primary,
      fontSize: theme.typography.xs,
      letterSpacing: 1.2,
      marginBottom: 4,
      textTransform: "uppercase",
    } as Style,
    heading: {
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography[levelSize[level]],
      fontWeight: 700,
      lineHeight: 1.15,
      marginBottom: theme.spacing.sm,
    } as Style,
  });

  return (
    <>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={mergePdfStyles(styles.heading, style)}>{children}</Text>
    </>
  );
}
