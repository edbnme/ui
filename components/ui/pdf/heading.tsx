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
  createPdfTextStyle,
  formatPdfValue,
  getPdfFlowProps,
  isPdfNodeEmpty,
  mergePdfStyles,
  type PdfAdvancedTextProps,
  type PdfStyleInput,
  type PdfTextRenderProps,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfHeadingProps extends PdfAdvancedTextProps {
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
  render,
  ...flowProps
}: PdfHeadingProps) {
  const theme = usePdfTheme();
  const resolvedLevel = levelSize[level] ? level : 2;
  const hasEyebrow = !isPdfNodeEmpty(eyebrow);
  const styles = StyleSheet.create({
    eyebrow: {
      ...createPdfTextStyle(theme, { color: theme.colors.primary, size: "xs" }),
      letterSpacing: 1.2,
      marginBottom: 4,
      textTransform: "uppercase",
    } as Style,
    heading: {
      ...createPdfTextStyle(theme, {
        lineHeight: 1.15,
        marginBottom: theme.spacing.sm,
        size: levelSize[resolvedLevel],
        weight: "bold",
      }),
    } as Style,
  });
  const renderProps = render
    ? {
        render: (props: PdfTextRenderProps) => formatPdfValue(render(props)),
      }
    : {};

  return (
    <>
      {hasEyebrow ? (
        <Text style={styles.eyebrow}>{formatPdfValue(eyebrow)}</Text>
      ) : null}
      <Text
        {...getPdfFlowProps(flowProps)}
        {...renderProps}
        style={mergePdfStyles(styles.heading, style)}
      >
        {formatPdfValue(children)}
      </Text>
    </>
  );
}
