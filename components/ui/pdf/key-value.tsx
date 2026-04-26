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
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfKeyValueItem {
  key: React.ReactNode;
  value: React.ReactNode;
  keyStyle?: PdfStyleInput;
  valueStyle?: PdfStyleInput;
}

export interface PdfKeyValueProps {
  items: PdfKeyValueItem[];
  divided?: boolean;
  emptyText?: string;
  style?: PdfStyleInput;
}

export function PdfKeyValue({
  items,
  divided = false,
  emptyText = "No details",
  style,
}: PdfKeyValueProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    root: { width: "100%" } as Style,
    row: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: divided ? 1 : 0,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
    } as Style,
    key: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
    } as Style,
    value: {
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      fontWeight: 700,
      textAlign: "right",
    } as Style,
    empty: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
    } as Style,
  });

  if (items.length === 0) return <Text style={styles.empty}>{emptyText}</Text>;

  return (
    <View style={mergePdfStyles(styles.root, style)}>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={mergePdfStyles(styles.key, item.keyStyle)}>
            {item.key}
          </Text>
          <Text style={mergePdfStyles(styles.value, item.valueStyle)}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
