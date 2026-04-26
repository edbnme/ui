/**
 * PageHeader — reusable PDF page header.
 *
 * @registryTitle PDF Page Header
 * @registryDescription Fixed or flowing page header with title, subtitle, and metadata.
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

export interface PdfPageHeaderProps {
  title: string;
  subtitle?: string;
  rightText?: string;
  fixed?: boolean;
  style?: PdfStyleInput;
}

export function PdfPageHeader({
  title,
  subtitle,
  rightText,
  fixed = false,
  style,
}: PdfPageHeaderProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    header: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    } as Style,
    title: {
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.lg,
      fontWeight: 700,
    } as Style,
    subtitle: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      marginTop: 3,
    } as Style,
    right: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      textAlign: "right",
    } as Style,
  });

  return (
    <View fixed={fixed} style={mergePdfStyles(styles.header, style)}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightText ? <Text style={styles.right}>{rightText}</Text> : null}
    </View>
  );
}
