/**
 * Table — composable table primitives for React PDF documents.
 *
 * @registryTitle PDF Table
 * @registryDescription Composable PDF table primitives with header, body, rows, cells, widths, and alignment.
 * @registryCategory data
 * @registryDemos basic=Basic, bordered=Bordered
 */

import * as React from "react";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
} from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  formatPdfValue,
  getPdfFlowProps,
  getPdfPrimitiveProps,
  mergePdfStyles,
  resolvePdfSize,
  type PdfFlowProps,
  type PdfPrimitiveProps,
  type PdfTextAlign,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfTableProps extends PdfFlowProps {
  children: React.ReactNode;
  bordered?: boolean;
  striped?: boolean;
  noWrap?: boolean;
  style?: PdfStyleInput;
}

export interface PdfTableSectionProps extends PdfPrimitiveProps {
  children: React.ReactNode;
  style?: PdfStyleInput;
}

export interface PdfTableRowProps extends PdfFlowProps {
  children: React.ReactNode;
  header?: boolean;
  stripe?: boolean;
  bordered?: boolean;
  style?: PdfStyleInput;
}

export interface PdfTableCellProps extends PdfPrimitiveProps {
  children: React.ReactNode;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  align?: PdfTextAlign;
  header?: boolean;
  bordered?: boolean;
  style?: PdfStyleInput;
}

function isRowElement(
  child: React.ReactNode
): child is ReactElement<PdfTableRowProps> {
  return isValidElement(child) && child.type === PdfTableRow;
}

function isCellElement(
  child: React.ReactNode
): child is ReactElement<PdfTableCellProps> {
  return isValidElement(child) && child.type === PdfTableCell;
}

export function PdfTable({
  children,
  bordered = false,
  striped = false,
  noWrap = false,
  style,
  wrap,
  ...flowProps
}: PdfTableProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    table: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: bordered ? 1 : 0,
      overflow: "hidden",
      width: "100%",
    } as Style,
  });
  let rowIndex = 0;
  const processedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const section = child as ReactElement<PdfTableSectionProps>;
    return cloneElement(section, {
      children: Children.map(section.props.children, (rowChild) => {
        if (!isRowElement(rowChild)) return rowChild;
        const stripe =
          striped && !rowChild.props.header && rowIndex++ % 2 === 1;
        return cloneElement(rowChild, { bordered, stripe });
      }),
    });
  });
  return (
    <View
      {...getPdfFlowProps({ ...flowProps, wrap: wrap ?? !noWrap })}
      style={mergePdfStyles(styles.table, style)}
    >
      {processedChildren}
    </View>
  );
}

export function PdfTableHeader({
  children,
  style,
  minPresenceAhead = 60,
  ...primitiveProps
}: PdfTableSectionProps) {
  return (
    <View
      {...getPdfPrimitiveProps({ ...primitiveProps, minPresenceAhead })}
      style={mergePdfStyles(style)}
    >
      {children}
    </View>
  );
}

export function PdfTableBody({
  children,
  style,
  ...primitiveProps
}: PdfTableSectionProps) {
  return (
    <View {...getPdfPrimitiveProps(primitiveProps)} style={mergePdfStyles(style)}>
      {children}
    </View>
  );
}

export function PdfTableRow({
  children,
  header = false,
  stripe = false,
  bordered = false,
  style,
  wrap,
  ...flowProps
}: PdfTableRowProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    row: {
      backgroundColor: header
        ? theme.colors.muted
        : stripe
          ? "#f9fafb"
          : theme.colors.background,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: bordered ? 1 : 0.75,
      flexDirection: "row",
      width: "100%",
    } as Style,
  });
  const processedChildren = Children.map(children, (child) => {
    if (!isCellElement(child)) return child;
    return cloneElement(child, { bordered, header });
  });
  return (
    <View
      {...getPdfFlowProps({ ...flowProps, wrap: wrap ?? false })}
      style={mergePdfStyles(styles.row, style)}
    >
      {processedChildren}
    </View>
  );
}

export function PdfTableCell({
  children,
  width,
  minWidth,
  maxWidth,
  align = "left",
  header = false,
  bordered = false,
  style,
  ...primitiveProps
}: PdfTableCellProps) {
  const theme = usePdfTheme();
  const resolvedWidth = resolvePdfSize(width);
  const content = formatPdfValue(children);
  const styles = StyleSheet.create({
    cell: {
      borderRightColor: theme.colors.border,
      borderRightWidth: bordered ? 1 : 0,
      flex: resolvedWidth ? undefined : 1,
      maxWidth: resolvePdfSize(maxWidth),
      minWidth: resolvePdfSize(minWidth),
      paddingHorizontal: 8,
      paddingVertical: header ? 7 : 8,
      width: resolvedWidth,
    } as Style,
    text: createPdfTextStyle(theme, {
      align,
      color: header ? theme.colors.foreground : theme.colors.mutedForeground,
      lineHeight: 1.35,
      size: "sm",
      weight: header ? "bold" : "normal",
    }),
  });
  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.cell, style)}
    >
      {typeof content === "string" || typeof content === "number" ? (
        <Text style={styles.text}>{content}</Text>
      ) : (
        content
      )}
    </View>
  );
}
