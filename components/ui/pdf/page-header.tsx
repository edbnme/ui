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
  createPdfTextStyle,
  formatPdfValue,
  getPdfPrimitiveProps,
  isPdfNodeEmpty,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfPageHeaderProps extends PdfPrimitiveProps {
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
  ...primitiveProps
}: PdfPageHeaderProps) {
  const theme = usePdfTheme();
  const hasSubtitle = !isPdfNodeEmpty(subtitle);
  const hasRightText = !isPdfNodeEmpty(rightText);
  const styles = StyleSheet.create({
    header: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    } as Style,
    title: createPdfTextStyle(theme, { size: "lg", weight: "bold" }),
    subtitle: {
      ...createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
      marginTop: 3,
    } as Style,
    right: createPdfTextStyle(theme, {
      align: "right",
      size: "sm",
      tone: "muted",
    }),
  });

  return (
    <View
      {...getPdfPrimitiveProps({ ...primitiveProps, fixed })}
      style={mergePdfStyles(styles.header, style)}
    >
      <View>
        <Text style={styles.title}>{formatPdfValue(title)}</Text>
        {hasSubtitle ? (
          <Text style={styles.subtitle}>{formatPdfValue(subtitle)}</Text>
        ) : null}
      </View>
      {hasRightText ? (
        <Text style={styles.right}>{formatPdfValue(rightText)}</Text>
      ) : null}
    </View>
  );
}
