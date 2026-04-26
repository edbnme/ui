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
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfPageFooterProps {
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
    text: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.xs,
    } as Style,
    right: { textAlign: "right" } as Style,
  });

  return (
    <View fixed={fixed} style={mergePdfStyles(styles.footer, style)}>
      <Text style={styles.text}>{leftText}</Text>
      <Text style={mergePdfStyles(styles.text, styles.right)}>{rightText}</Text>
    </View>
  );
}
