/**
 * Shared public types for DataTable.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @registryPartOf data-table
 */

"use client";

import type * as React from "react";
import type {
  Column,
  Row,
  Table as TanStackTable,
} from "@tanstack/react-table";

import type { TableProps } from "@/components/ui/table";

/** Presentation state for the table body. */
export type DataTableStatus = "ready" | "loading" | "error";

/** Vertical spacing applied to header and body cells. */
export type DataTableDensity = "compact" | "default" | "comfortable";

/** Arguments supplied to expanded detail-row renderers. */
export interface DataTableSubComponentProps<TData> {
  row: Row<TData>;
  table: TanStackTable<TData>;
}

/** Resolves an optional class for an individual data row. */
export type DataTableRowClassName<TData> =
  | string
  | ((row: Row<TData>) => string | undefined);

/** A typed option displayed by {@link DataTableFacetedFilter}. */
export interface DataTableFilterOption<TValue> {
  /** Content shown for the option. */
  label: React.ReactNode;
  /** Value written to the TanStack column filter. */
  value: TValue;
  /** Plain text used when locally searching rich option labels. */
  searchText?: string;
  /** Optional leading visual. Decorative SVGs should be aria-hidden. */
  icon?: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
  /** Optional count override. Faceted counts are used when omitted. */
  count?: number;
  /** Prevents the option from being changed. */
  disabled?: boolean;
}

/** Props for the native DataTable renderer. */
export interface DataTableProps<TData>
  extends Omit<TableProps, "children"> {
  /** A fully configured TanStack Table instance owned by the caller. */
  table: TanStackTable<TData>;
  /** Body presentation state. @default "ready" */
  status?: DataTableStatus;
  /** Content shown when the final row model is empty. */
  emptyContent?: React.ReactNode;
  /** Content shown instead of the default loading skeleton. */
  loadingContent?: React.ReactNode;
  /** Content shown while `status` is `"error"`. */
  errorContent?: React.ReactNode;
  /** Content shown when no leaf columns were configured. */
  noColumnsContent?: React.ReactNode;
  /** Content shown when every configured leaf column is hidden. */
  hiddenColumnsContent?: React.ReactNode;
  /** Renders a full-width row beneath each expanded row. */
  renderSubComponent?: (
    props: DataTableSubComponentProps<TData>
  ) => React.ReactNode;
  /** Vertical cell spacing. @default "default" */
  density?: DataTableDensity;
  /** Static or row-aware class applied to each data row. */
  rowClassName?: DataTableRowClassName<TData>;
  /** Number of deterministic placeholder rows. @default 5 */
  loadingRowCount?: number;
  /** Force footer visibility. By default it is inferred from column defs. */
  showFooter?: boolean;
}

/** Resolves a human-readable label for a column. */
export type DataTableColumnLabel<TData> = (
  column: Column<TData, unknown>
) => React.ReactNode;
