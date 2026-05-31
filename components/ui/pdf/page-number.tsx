/**
 * PageNumber — dynamic page number text for React PDF.
 *
 * @registryTitle PDF Page Number
 * @registryDescription Dynamic page number using React PDF render callbacks and format tokens.
 * @registryCategory chrome
 * @registryDemos basic=Basic, custom=Custom
 */

import { Text, StyleSheet } from "@react-pdf/renderer";
import {
  createPdfTextStyle,
  getPdfPrimitiveProps,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfTextAlign,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfPageNumberProps extends PdfPrimitiveProps {
  format?: string;
  fixed?: boolean;
  align?: PdfTextAlign;
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
  ...primitiveProps
}: PdfPageNumberProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    text: createPdfTextStyle(theme, {
      align,
      size: "xs",
      tone: "muted",
    }),
  });
  return (
    <Text
      {...getPdfPrimitiveProps({ ...primitiveProps, fixed })}
      style={mergePdfStyles(styles.text, style)}
      render={({ pageNumber, totalPages }) =>
        formatPdfPageNumber(format, pageNumber, totalPages)
      }
    />
  );
}
