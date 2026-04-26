/**
 * PageNumber — dynamic page number text for React PDF.
 *
 * @registryTitle PDF Page Number
 * @registryDescription Dynamic page number using React PDF render callbacks and format tokens.
 * @registryCategory chrome
 * @registryDemos basic=Basic, custom=Custom
 */

import { Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfPageNumberProps {
  format?: string;
  fixed?: boolean;
  align?: "left" | "center" | "right";
  style?: PdfStyleInput;
}

export function formatPdfPageNumber(
  format: string,
  pageNumber: number,
  totalPages: number
): string {
  return format
    .replaceAll("{page}", String(pageNumber))
    .replaceAll("{total}", String(totalPages));
}

export function PdfPageNumber({
  format = "Page {page} of {total}",
  fixed = false,
  align = "center",
  style,
}: PdfPageNumberProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    text: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.xs,
      textAlign: align,
    } as Style,
  });
  return (
    <Text
      fixed={fixed}
      style={mergePdfStyles(styles.text, style)}
      render={({ pageNumber, totalPages }) =>
        formatPdfPageNumber(format, pageNumber, totalPages)
      }
    />
  );
}
