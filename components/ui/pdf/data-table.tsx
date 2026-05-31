/**
 * DataTable — data-driven table for React PDF documents.
 *
 * @registryTitle PDF Data Table
 * @registryDescription Render rows from typed data with empty-state handling, alignment, widths, and custom accessors.
 * @registryCategory data
 * @registryDemos basic=Basic, empty=Empty
 */

import * as React from "react";
import {
  PdfTable,
  PdfTableBody,
  PdfTableCell,
  PdfTableHeader,
  PdfTableRow,
} from "@/components/ui/pdf/table";
import { PdfText } from "@/components/ui/pdf/text";
import {
  formatPdfValue,
  mergePdfStyles,
  type PdfFlowProps,
  type PdfTextAlign,
  type PdfStyleInput,
} from "@/lib/pdf-theme";

export interface PdfDataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  width?: number | string;
  align?: PdfTextAlign;
  accessor?: keyof T | ((row: T, index: number) => React.ReactNode);
  format?: (value: unknown, row: T, index: number) => React.ReactNode;
  emptyValue?: React.ReactNode;
  headerStyle?: PdfStyleInput;
  cellStyle?: PdfStyleInput;
}

export interface PdfDataTableProps<T> extends PdfFlowProps {
  columns?: readonly PdfDataTableColumn<T>[];
  data?: readonly T[] | null;
  emptyText?: string;
  noColumnsText?: string;
  bordered?: boolean;
  striped?: boolean;
  getRowKey?: (row: T, index: number) => React.Key;
  style?: PdfStyleInput;
}

function readCell<T>(
  row: T,
  column: PdfDataTableColumn<T>,
  index: number
): React.ReactNode {
  const rawValue =
    typeof column.accessor === "function"
      ? column.accessor(row, index)
      : column.accessor
        ? row[column.accessor]
        : row && typeof row === "object" && column.key in row
          ? row[column.key as keyof T]
          : undefined;

  return column.format
    ? column.format(rawValue, row, index)
    : formatPdfValue(rawValue, column.emptyValue);
}

export function PdfDataTable<T>({
  columns = [],
  data,
  emptyText = "No rows",
  noColumnsText = "No columns",
  bordered = false,
  striped = true,
  getRowKey,
  style,
  ...flowProps
}: PdfDataTableProps<T>) {
  const rows = data ?? [];

  if (columns.length === 0) {
    return <PdfText tone="muted">{noColumnsText}</PdfText>;
  }

  if (rows.length === 0) {
    return <PdfText tone="muted">{emptyText}</PdfText>;
  }

  return (
    <PdfTable
      bordered={bordered}
      striped={striped}
      {...flowProps}
      style={mergePdfStyles(style)}
    >
      <PdfTableHeader>
        <PdfTableRow header>
          {columns.map((column) => (
            <PdfTableCell
              key={column.key}
              width={column.width}
              align={column.align}
              style={column.headerStyle}
            >
              {column.header}
            </PdfTableCell>
          ))}
        </PdfTableRow>
      </PdfTableHeader>
      <PdfTableBody>
        {rows.map((row, rowIndex) => (
          <PdfTableRow key={getRowKey?.(row, rowIndex) ?? rowIndex}>
            {columns.map((column) => (
              <PdfTableCell
                key={column.key}
                width={column.width}
                align={column.align}
                style={column.cellStyle}
              >
                {readCell(row, column, rowIndex)}
              </PdfTableCell>
            ))}
          </PdfTableRow>
        ))}
      </PdfTableBody>
    </PdfTable>
  );
}
