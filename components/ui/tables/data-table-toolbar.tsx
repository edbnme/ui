/**
 * Composable toolbar layout and table-result summary.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @registryPartOf data-table
 */

"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

export interface DataTableToolbarProps<
  TData,
> extends React.ComponentPropsWithRef<"div"> {
  table: Table<TData>;
  /** Secondary controls aligned at the end of the toolbar. */
  actions?: React.ReactNode;
  /** Show the concise visible result count. @default true */
  showResultCount?: boolean;
  /** Total result count override for server-filtered or partially loaded data. */
  resultCount?: number;
  /** Selected-row count override for selections outside the loaded row model. */
  selectedCount?: number;
  /** Formats the result summary. */
  resultLabel?: (count: number) => React.ReactNode;
  /** Formats the selected-row summary. */
  selectionLabel?: (selectedCount: number) => React.ReactNode;
}

function DataTableToolbarImpl<TData>(
  {
    table,
    actions,
    showResultCount = true,
    resultCount: resultCountProp,
    selectedCount: selectedCountProp,
    resultLabel = (count) =>
      `${count.toLocaleString()} result${count === 1 ? "" : "s"}`,
    selectionLabel = (count) => `${count.toLocaleString()} selected`,
    className,
    children,
    "aria-label": ariaLabel = "Table controls",
    ...props
  }: Omit<DataTableToolbarProps<TData>, "ref">,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const derivedResultCount = table.options.manualFiltering
    ? table.getRowCount()
    : table.getFilteredRowModel().rows.length;
  const rawResultCount = resultCountProp ?? derivedResultCount;
  const rawSelectedCount =
    selectedCountProp ?? table.getFilteredSelectedRowModel().rows.length;
  const resultCount = Number.isFinite(rawResultCount)
    ? Math.max(0, Math.floor(rawResultCount))
    : 0;
  const selectedCount = Number.isFinite(rawSelectedCount)
    ? Math.max(0, Math.floor(rawSelectedCount))
    : 0;

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      data-slot="data-table-toolbar"
      className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}
      {...props}
    >
      <div
        data-slot="data-table-toolbar-primary"
        className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
      >
        {children}
      </div>
      {actions ? (
        <div
          data-slot="data-table-toolbar-actions"
          className="ms-auto flex shrink-0 items-center gap-2"
        >
          {actions}
        </div>
      ) : null}
      {showResultCount ? (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-slot="data-table-result-count"
          className="basis-full text-xs text-muted-foreground sm:ms-auto sm:basis-auto"
        >
          {selectedCount > 0 ? (
            <>
              {selectionLabel(selectedCount)}
              <span aria-hidden="true"> · </span>
            </>
          ) : null}
          {resultLabel(resultCount)}
        </div>
      ) : null}
    </div>
  );
}

type DataTableToolbarComponent = {
  <TData>(props: DataTableToolbarProps<TData>): React.ReactElement | null;
  displayName?: string;
};

const DataTableToolbar = React.forwardRef(
  DataTableToolbarImpl
) as DataTableToolbarComponent;
DataTableToolbar.displayName = "DataTableToolbar";

export { DataTableToolbar };
