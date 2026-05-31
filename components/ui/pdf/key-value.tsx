/**
 * KeyValue — key-value rows for React PDF documents.
 *
 * @registryTitle PDF Key Value
 * @registryDescription Key-value rows for summaries, totals, and metadata blocks.
 * @registryCategory data
 * @registryDemos basic=Basic, divided=Divided
 */

import * as React from "react";
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

export interface PdfKeyValueItem {
  key: React.ReactNode;
  value: React.ReactNode;
  keyStyle?: PdfStyleInput;
  valueStyle?: PdfStyleInput;
}

export interface PdfKeyValueProps extends PdfPrimitiveProps {
  items?: readonly PdfKeyValueItem[] | null;
  divided?: boolean;
  emptyText?: string;
  emptyValue?: React.ReactNode;
  style?: PdfStyleInput;
}

export function PdfKeyValue({
  items,
  divided = false,
  emptyText = "No details",
  emptyValue = "",
  style,
  ...primitiveProps
}: PdfKeyValueProps) {
  const theme = usePdfTheme();
  const rows = items ?? [];
  const styles = StyleSheet.create({
    root: { width: "100%" } as Style,
    row: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: divided ? 1 : 0,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
    } as Style,
    key: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
    value: createPdfTextStyle(theme, {
      align: "right",
      size: "sm",
      weight: "bold",
    }),
    empty: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
  });

  const visibleItems = rows.filter((item) => !isPdfNodeEmpty(item.key));

  if (visibleItems.length === 0) {
    return <Text style={styles.empty}>{emptyText}</Text>;
  }

  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.root, style)}
    >
      {visibleItems.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={mergePdfStyles(styles.key, item.keyStyle)}>
            {formatPdfValue(item.key)}
          </Text>
          <Text style={mergePdfStyles(styles.value, item.valueStyle)}>
            {formatPdfValue(item.value, emptyValue)}
          </Text>
        </View>
      ))}
    </View>
  );
}
