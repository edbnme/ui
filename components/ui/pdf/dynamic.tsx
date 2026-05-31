/**
 * Dynamic - render callback helpers for React PDF documents.
 *
 * @registryTitle PDF Dynamic
 * @registryDescription Dynamic text and view wrappers for page-aware render callbacks.
 * @registryCategory advanced
 * @registryDemos basic=Basic
 */

import * as React from "react";
import {
  Text as ReactPdfText,
  View as ReactPdfView,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  formatPdfValue,
  getPdfFlowProps,
  mergePdfStyles,
  type PdfAdvancedTextProps,
  type PdfStyleInput,
  type PdfTextAlign,
  type PdfTextSize,
  type PdfTextTone,
  type PdfTextWeight,
  type PdfViewRenderProps,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfDynamicTextProps extends PdfAdvancedTextProps {
  size?: PdfTextSize;
  tone?: PdfTextTone;
  weight?: PdfTextWeight;
  align?: PdfTextAlign;
  fallback?: React.ReactNode;
  noMargin?: boolean;
  style?: PdfStyleInput;
}

export interface PdfDynamicViewProps {
  render: (props: PdfViewRenderProps) => React.ReactNode;
  fallback?: React.ReactNode;
  style?: PdfStyleInput;
  id?: string;
  debug?: boolean;
  fixed?: boolean;
  break?: boolean;
  minPresenceAhead?: number;
  wrap?: boolean;
}

export function PdfDynamicText({
  render,
  fallback = "",
  size = "sm",
  tone = "default",
  weight = "normal",
  align = "left",
  noMargin = false,
  style,
  ...flowProps
}: PdfDynamicTextProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    text: {
      ...createPdfTextStyle(theme, { size, tone, weight, align }),
      marginBottom: noMargin ? 0 : theme.spacing.sm,
    } as Style,
  });

  return (
    <ReactPdfText
      {...getPdfFlowProps(flowProps)}
      render={(props) => formatPdfValue(render?.(props), fallback)}
      style={mergePdfStyles(styles.text, style)}
    />
  );
}

export function PdfDynamicView({
  render,
  fallback = null,
  style,
  ...flowProps
}: PdfDynamicViewProps) {
  return (
    <ReactPdfView
      {...getPdfFlowProps(flowProps)}
      render={(props) => render?.(props) ?? fallback}
      style={mergePdfStyles(style)}
    />
  );
}
