/**
 * Text — theme-aware text for React PDF documents.
 *
 * @registryTitle PDF Text
 * @registryDescription Theme-aware text with size, tone, weight, and margin controls.
 * @registryCategory typography
 * @registryDemos basic=Basic, tones=Tones
 */

import * as React from "react";
import { Text as ReactPdfText, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  getToneColor,
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export type PdfTextSize = "xs" | "sm" | "base" | "lg";
export type PdfTextTone =
  | "default"
  | "muted"
  | "primary"
  | "destructive"
  | "warning"
  | "success";

export interface PdfTextProps {
  children: React.ReactNode;
  size?: PdfTextSize;
  tone?: PdfTextTone;
  weight?: "normal" | "medium" | "bold";
  align?: "left" | "center" | "right";
  noMargin?: boolean;
  style?: PdfStyleInput;
}

export function PdfText({
  children,
  size = "base",
  tone = "default",
  weight = "normal",
  align = "left",
  noMargin = false,
  style,
}: PdfTextProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    text: {
      color: getToneColor(theme, tone),
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography[size],
      lineHeight: 1.45,
      marginBottom: noMargin ? 0 : theme.spacing.sm,
      textAlign: align,
      fontWeight: weight === "bold" ? 700 : weight === "medium" ? 600 : 400,
    } as Style,
  });

  return (
    <ReactPdfText style={mergePdfStyles(styles.text, style)}>
      {children}
    </ReactPdfText>
  );
}
