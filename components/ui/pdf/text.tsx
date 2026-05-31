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
  createPdfTextStyle,
  formatPdfValue,
  getPdfFlowProps,
  mergePdfStyles,
  type PdfAdvancedTextProps,
  type PdfTextAlign,
  type PdfTextRenderProps,
  type PdfTextSize,
  type PdfTextTone,
  type PdfTextWeight,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export type { PdfTextAlign, PdfTextSize, PdfTextTone, PdfTextWeight };

export interface PdfTextProps extends PdfAdvancedTextProps {
  children: React.ReactNode;
  size?: PdfTextSize;
  tone?: PdfTextTone;
  weight?: PdfTextWeight;
  align?: PdfTextAlign;
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
  render,
  ...flowProps
}: PdfTextProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    text: {
      ...createPdfTextStyle(theme, { size, tone, weight, align }),
      marginBottom: noMargin ? 0 : theme.spacing.sm,
    } as Style,
  });
  const renderProps = render
    ? {
        render: (props: PdfTextRenderProps) => formatPdfValue(render(props)),
      }
    : {};

  return (
    <ReactPdfText
      {...getPdfFlowProps(flowProps)}
      {...renderProps}
      style={mergePdfStyles(styles.text, style)}
    >
      {formatPdfValue(children)}
    </ReactPdfText>
  );
}
