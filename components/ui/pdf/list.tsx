/**
 * List - ordered and unordered lists for React PDF documents.
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
  createPdfTextStyle,
  formatPdfValue,
  getPdfPrimitiveProps,
  isPdfNodeEmpty,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfListItem {
  children: React.ReactNode;
  marker?: React.ReactNode;
  key?: React.Key;
  style?: PdfStyleInput;
  markerStyle?: PdfStyleInput;
}

export interface PdfListProps extends PdfPrimitiveProps {
  items?: readonly (React.ReactNode | PdfListItem)[];
  ordered?: boolean;
  start?: number;
  marker?: (
    index: number,
    item: React.ReactNode | PdfListItem
  ) => React.ReactNode;
  emptyText?: string;
  style?: PdfStyleInput;
}

function isListItemObject(
  item: React.ReactNode | PdfListItem
): item is PdfListItem {
  return (
    !!item &&
    typeof item === "object" &&
    !React.isValidElement(item) &&
    "children" in item
  );
}

export function PdfList({
  items = [],
  ordered = false,
  start = 1,
  marker,
  emptyText = "No items",
  style,
  ...primitiveProps
}: PdfListProps) {
  const theme = usePdfTheme();
  const visibleItems = items.filter((item) => {
    const content = isListItemObject(item) ? item.children : item;
    return !isPdfNodeEmpty(content);
  });
  const styles = StyleSheet.create({
    list: { gap: 4 } as Style,
    row: { flexDirection: "row", gap: 6 } as Style,
    marker: {
      ...createPdfTextStyle(theme, { color: theme.colors.primary, size: "sm" }),
      width: 14,
    } as Style,
    text: {
      ...createPdfTextStyle(theme, { size: "sm" }),
      flex: 1,
    } as Style,
    empty: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
  });

  if (visibleItems.length === 0) {
    return <Text style={styles.empty}>{emptyText}</Text>;
  }

  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.list, style)}
    >
      {visibleItems.map((item, index) => {
        const content = isListItemObject(item) ? item.children : item;
        const itemMarker =
          isListItemObject(item) && item.marker
            ? item.marker
            : (marker?.(index, item) ??
              (ordered ? `${start + index}.` : "\u2022"));
        const key = isListItemObject(item) ? item.key : undefined;

        return (
          <View
            key={key ?? index}
            style={mergePdfStyles(
              styles.row,
              isListItemObject(item) && item.style
            )}
          >
            <Text
              style={mergePdfStyles(
                styles.marker,
                isListItemObject(item) && item.markerStyle
              )}
            >
              {formatPdfValue(itemMarker)}
            </Text>
            <Text style={styles.text}>{formatPdfValue(content)}</Text>
          </View>
        );
      })}
    </View>
  );
}
