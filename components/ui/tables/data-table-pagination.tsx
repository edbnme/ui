/**
 * Accessible client- and manual-pagination controls for DataTable.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @registryPartOf data-table
 */

"use client";

import * as React from "react";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import type { Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export interface DataTablePaginationProps<
  TData,
> extends React.ComponentPropsWithRef<"nav"> {
  table: Table<TData>;
  /** Available page sizes. @default [10, 20, 30, 50, 100] */
  pageSizeOptions?: readonly number[];
  /** Show the page-size selector. @default true */
  showPageSize?: boolean;
  /** Show selected row feedback. @default true */
  showSelectedCount?: boolean;
  /** Show first and last page buttons. @default true */
  showBoundaryButtons?: boolean;
  /** Override previous-page availability for cursor/manual pagination. */
  canPreviousPage?: boolean;
  /** Override next-page availability for cursor/manual pagination. */
  canNextPage?: boolean;
  /** Override selection feedback for off-page server selection. */
  selectedCount?: number;
}

function DataTablePaginationImpl<TData>(
  {
    table,
    pageSizeOptions = [10, 20, 30, 50, 100],
    showPageSize = true,
    showSelectedCount = true,
    showBoundaryButtons = true,
    canPreviousPage,
    canNextPage,
    selectedCount: selectedCountProp,
    className,
    "aria-label": ariaLabel = "Table pagination",
    ...props
  }: Omit<DataTablePaginationProps<TData>, "ref">,
  ref: React.ForwardedRef<HTMLElement>
) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const rawPageCount = table.getPageCount();
  const hasKnownPageCount = Number.isFinite(rawPageCount) && rawPageCount >= 0;
  const pageCount = hasKnownPageCount ? Math.floor(rawPageCount) : -1;
  const safePageIndex = Number.isFinite(pageIndex)
    ? Math.max(0, Math.floor(pageIndex))
    : 0;
  const displayPage =
    hasKnownPageCount && pageCount === 0 ? 0 : safePageIndex + 1;
  const rawSelectedCount =
    selectedCountProp ?? table.getFilteredSelectedRowModel().rows.length;
  const selectedCount = Number.isFinite(rawSelectedCount)
    ? Math.max(0, Math.floor(rawSelectedCount))
    : 0;
  const hasPreviousPage = canPreviousPage ?? table.getCanPreviousPage();
  const hasNextPage = canNextPage ?? table.getCanNextPage();
  const normalizedPageSizes = Array.from(
    new Set(
      [...pageSizeOptions, pageSize]
        .filter((size) => Number.isFinite(size) && size > 0)
        .map((size) => Math.floor(size))
    )
  ).sort((a, b) => a - b);

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      data-slot="data-table-pagination"
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2",
        className
      )}
      {...props}
    >
      {showSelectedCount ? (
        <p
          className="min-w-0 flex-1 text-xs text-muted-foreground"
          aria-live="polite"
        >
          {selectedCount > 0
            ? `${selectedCount.toLocaleString()} row${selectedCount === 1 ? "" : "s"} selected`
            : "No rows selected"}
        </p>
      ) : (
        <span className="flex-1" />
      )}

      {showPageSize ? (
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Rows per page</span>
          <span className="sr-only sm:hidden">Rows per page</span>
          <select
            value={pageSize}
            className={cn(
              "h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground shadow-xs",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            )}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
          >
            {normalizedPageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <p
        aria-live="polite"
        aria-atomic="true"
        className="min-w-20 text-center text-xs font-medium tabular-nums text-muted-foreground"
      >
        Page {displayPage}
        {hasKnownPageCount ? ` of ${pageCount}` : ""}
      </p>

      <div className="flex items-center gap-1">
        {showBoundaryButtons ? (
          <PaginationButton
            aria-label="Go to first page"
            disabled={!hasPreviousPage}
            onClick={() => table.firstPage()}
          >
            <CaretDoubleLeft
              aria-hidden
              className="size-4 rtl:rotate-180"
              weight="bold"
            />
          </PaginationButton>
        ) : null}
        <PaginationButton
          aria-label="Go to previous page"
          disabled={!hasPreviousPage}
          onClick={() => table.previousPage()}
        >
          <CaretLeft
            aria-hidden
            className="size-4 rtl:rotate-180"
            weight="bold"
          />
        </PaginationButton>
        <PaginationButton
          aria-label="Go to next page"
          disabled={!hasNextPage}
          onClick={() => table.nextPage()}
        >
          <CaretRight
            aria-hidden
            className="size-4 rtl:rotate-180"
            weight="bold"
          />
        </PaginationButton>
        {showBoundaryButtons ? (
          <PaginationButton
            aria-label="Go to last page"
            disabled={!hasKnownPageCount || !hasNextPage}
            onClick={() => table.lastPage()}
          >
            <CaretDoubleRight
              aria-hidden
              className="size-4 rtl:rotate-180"
              weight="bold"
            />
          </PaginationButton>
        ) : null}
      </div>
    </nav>
  );
}

type DataTablePaginationComponent = {
  <TData>(props: DataTablePaginationProps<TData>): React.ReactElement | null;
  displayName?: string;
};

const DataTablePagination = React.forwardRef(
  DataTablePaginationImpl
) as DataTablePaginationComponent;
DataTablePagination.displayName = "DataTablePagination";

function PaginationButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md border border-border bg-background shadow-xs",
        "hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

export { DataTablePagination };
