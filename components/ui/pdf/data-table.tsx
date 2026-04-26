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
import { mergePdfStyles, type PdfStyleInput } from "@/lib/pdf-theme";

export interface PdfDataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  width?: number | string;
  align?: "left" | "center" | "right";
  accessor: keyof T | ((row: T, index: number) => React.ReactNode);
}

export interface PdfDataTableProps<T> {
  columns: PdfDataTableColumn<T>[];
  data: T[];
  emptyText?: string;
  bordered?: boolean;
  striped?: boolean;
  style?: PdfStyleInput;
}

function readCell<T>(
  row: T,
  column: PdfDataTableColumn<T>,
  index: number
): React.ReactNode {
  if (typeof column.accessor === "function") return column.accessor(row, index);
  const value = row[column.accessor];
  if (value == null) return "";
  return String(value);
}

export function PdfDataTable<T>({
  columns,
  data,
  emptyText = "No rows",
  bordered = false,
  striped = true,
  style,
}: PdfDataTableProps<T>) {
  if (columns.length === 0 || data.length === 0) {
    return <PdfText tone="muted">{emptyText}</PdfText>;
  }

  return (
    <PdfTable
      bordered={bordered}
      striped={striped}
      style={mergePdfStyles(style)}
    >
      <PdfTableHeader>
        <PdfTableRow header>
          {columns.map((column) => (
            <PdfTableCell
              key={column.key}
              width={column.width}
              align={column.align}
            >
              {column.header}
            </PdfTableCell>
          ))}
        </PdfTableRow>
      </PdfTableHeader>
      <PdfTableBody>
        {data.map((row, rowIndex) => (
          <PdfTableRow key={rowIndex}>
            {columns.map((column) => (
              <PdfTableCell
                key={column.key}
                width={column.width}
                align={column.align}
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
