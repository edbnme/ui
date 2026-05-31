/**
 * PageFooter — reusable PDF page footer.
 *
 * @registryTitle PDF Page Footer
 * @registryDescription Fixed or flowing page footer with left and right text areas.
 * @registryCategory chrome
 * @registryDemos basic=Basic, fixed=Fixed
 */

import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  formatPdfValue,
  getPdfPrimitiveProps,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfPageFooterProps extends PdfPrimitiveProps {
  leftText?: string;
  rightText?: string;
  fixed?: boolean;
  style?: PdfStyleInput;
}

export function PdfPageFooter({
  leftText,
  rightText,
  fixed = false,
  style,
  ...primitiveProps
}: PdfPageFooterProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    footer: {
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
    } as Style,
    text: createPdfTextStyle(theme, { size: "xs", tone: "muted" }),
    right: { textAlign: "right" } as Style,
  });

  return (
    <View
      {...getPdfPrimitiveProps({ ...primitiveProps, fixed })}
      style={mergePdfStyles(styles.footer, style)}
    >
      <Text style={styles.text}>{formatPdfValue(leftText)}</Text>
      <Text style={mergePdfStyles(styles.text, styles.right)}>
        {formatPdfValue(rightText)}
      </Text>
    </View>
  );
}
