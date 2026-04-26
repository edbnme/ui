/**
 * List — ordered and unordered lists for React PDF documents.
 *
 * @registryTitle PDF List
 * @registryDescription Ordered and unordered list component with empty-state handling.
 * @registryCategory data
 * @registryDemos basic=Basic, ordered=Ordered
 */

import * as React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfListProps {
  items?: React.ReactNode[];
  ordered?: boolean;
  emptyText?: string;
  style?: PdfStyleInput;
}

export function PdfList({
  items = [],
  ordered = false,
  emptyText = "No items",
  style,
}: PdfListProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    list: { gap: 4 } as Style,
    row: { flexDirection: "row", gap: 6 } as Style,
    marker: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      width: 14,
    } as Style,
    text: {
      color: theme.colors.foreground,
      flex: 1,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      lineHeight: 1.45,
    } as Style,
    empty: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
    } as Style,
  });

  if (items.length === 0) {
    return <Text style={styles.empty}>{emptyText}</Text>;
  }

  return (
    <View style={mergePdfStyles(styles.list, style)}>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.marker}>{ordered ? `${index + 1}.` : "•"}</Text>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
