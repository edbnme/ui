/**
 * Sortable header control for DataTable columns.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @registryPartOf data-table
 */

"use client";

import * as React from "react";
import { CaretDown, CaretUp, CaretUpDown } from "@phosphor-icons/react";
import type { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export interface DataTableColumnHeaderProps<TData, TValue> extends Omit<
  React.ComponentPropsWithRef<"div">,
  "title"
> {
  column: Column<TData, TValue>;
  title: React.ReactNode;
  /** Plain accessible name when `title` is not a string. */
  label?: string;
  /** Display the one-based sort priority beside a sorted column. */
  showSortIndex?: boolean;
}

function DataTableColumnHeaderImpl<TData, TValue>(
  {
    column,
    title,
    label = typeof title === "string" ? title : column.id,
    showSortIndex = false,
    className,
    ...props
  }: Omit<DataTableColumnHeaderProps<TData, TValue>, "ref">,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const sorted = column.getIsSorted();
  const sortPriority = sorted ? column.getSortIndex() + 1 : undefined;
  const nextOrder = column.getNextSortingOrder();
  const nextAction =
    nextOrder === "asc"
      ? "sort ascending"
      : nextOrder === "desc"
        ? "sort descending"
        : "clear sorting";
  const currentState = sorted
    ? `sorted ${sorted === "asc" ? "ascending" : "descending"}, priority ${sortPriority}`
    : "not sorted";

  if (!column.getCanSort()) {
    return (
      <div
        ref={ref}
        data-slot="data-table-column-header"
        className={cn("flex min-w-0 items-center gap-2", className)}
        {...props}
      >
        <span className="truncate">{title}</span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-slot="data-table-column-header"
      className={cn("flex min-w-0 items-center", className)}
      {...props}
    >
      <button
        type="button"
        aria-label={`${label}: ${currentState}; ${nextAction}`}
        data-sort={sorted || "none"}
        className={cn(
          "-ms-2 inline-flex h-8 min-w-0 items-center gap-1.5 rounded-md px-2",
          "text-sm font-medium text-muted-foreground select-none",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
        onClick={column.getToggleSortingHandler()}
      >
        <span className="truncate">{title}</span>
        {sorted === "asc" ? (
          <CaretUp
            aria-hidden
            className="size-3.5 shrink-0"
            weight="bold"
          />
        ) : sorted === "desc" ? (
          <CaretDown
            aria-hidden
            className="size-3.5 shrink-0"
            weight="bold"
          />
        ) : (
          <CaretUpDown
            aria-hidden
            className="size-3.5 shrink-0 opacity-55"
            weight="bold"
          />
        )}
        {showSortIndex && sorted ? (
          <span
            aria-hidden="true"
            className="inline-flex min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] leading-4 tabular-nums text-muted-foreground"
          >
            {column.getSortIndex() + 1}
          </span>
        ) : null}
      </button>
    </div>
  );
}

type DataTableColumnHeaderComponent = {
  <TData, TValue>(
    props: DataTableColumnHeaderProps<TData, TValue>
  ): React.ReactElement | null;
  displayName?: string;
};

const DataTableColumnHeader = React.forwardRef(
  DataTableColumnHeaderImpl
) as DataTableColumnHeaderComponent;
DataTableColumnHeader.displayName = "DataTableColumnHeader";

export { DataTableColumnHeader };
