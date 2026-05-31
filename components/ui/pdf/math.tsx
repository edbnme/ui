/**
 * Math - LaTeX math expressions for React PDF documents.
 *
 * @registryTitle PDF Math
 * @registryDescription Optional LaTeX math wrapper powered by @react-pdf/math.
 * @registryCategory media
 * @registryDemos basic=Basic, inline=Inline
 */

import * as React from "react";
import { Math as ReactPdfMath } from "@react-pdf/math";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  getPdfPrimitiveProps,
  mergePdfStyles,
  normalizePdfString,
  resolvePdfSize,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfMathProps extends PdfPrimitiveProps {
  children?: string | null;
  inline?: boolean;
  width?: number | string;
  height?: number | string;
  color?: string;
  emptyText?: React.ReactNode;
  invalidText?: React.ReactNode;
  style?: PdfStyleInput;
}

export function PdfMath({
  children,
  inline = false,
  width,
  height,
  color,
  debug,
  emptyText = "Math expression is empty",
  invalidText = "Math expression is invalid",
  style,
  ...primitiveProps
}: PdfMathProps) {
  const theme = usePdfTheme();
  const expression = normalizePdfString(children);
  const mathColor = color ?? theme.colors.foreground;
  const styles = StyleSheet.create({
    root: {
      alignItems: inline ? "flex-start" : "center",
      marginBottom: inline ? 0 : theme.spacing.sm,
    } as Style,
    fallback: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
  });

  if (!expression) {
    return (
      <View
        {...getPdfPrimitiveProps({ ...primitiveProps, debug })}
        style={mergePdfStyles(styles.root, style)}
      >
        <Text style={styles.fallback}>{emptyText}</Text>
      </View>
    );
  }

  try {
    const math = ReactPdfMath({
      children: expression,
      inline,
      width: resolvePdfSize(width),
      height: resolvePdfSize(height),
      color: mathColor,
      debug,
    });

    return (
      <View
        {...getPdfPrimitiveProps({ ...primitiveProps, debug })}
        style={mergePdfStyles(styles.root, style)}
      >
        {math}
      </View>
    );
  } catch {
    return (
      <View
        {...getPdfPrimitiveProps({ ...primitiveProps, debug })}
        style={mergePdfStyles(styles.root, style)}
      >
        <Text style={styles.fallback}>{invalidText}</Text>
      </View>
    );
  }
}
