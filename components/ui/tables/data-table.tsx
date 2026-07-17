/**
 * DataTable — a semantic renderer for a caller-owned TanStack Table instance.
 *
 * DataTable renders headers, rows, footers, pinning, sizing, expansion, and
 * status states. The caller keeps full ownership of TanStack configuration,
 * feature state, row models, data fetching, and mutations.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @docs https://ui.edbn.me/docs/tables/data-table
 * @registryDescription A typed, semantic TanStack Table renderer with composable controls and status states.
 * @registryDependencies @phosphor-icons/react@^2.1.10, @tanstack/react-table@^8.21.3
 * @registryVariant tables
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import type { Cell, Column, Header, Row } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type {
  DataTableDensity,
  DataTableProps,
  DataTableRowClassName,
} from "./data-table-types";

const DENSITY_CLASSES: Record<
  DataTableDensity,
  { head: string; cell: string; headHeight: number; rowHeight: number }
> = {
  compact: {
    head: "h-8 px-2.5",
    cell: "px-2.5 py-1.5",
    headHeight: 32,
    rowHeight: 32,
  },
  default: {
    head: "h-10 px-3",
    cell: "p-3",
    headHeight: 40,
    rowHeight: 44,
  },
  comfortable: {
    head: "h-12 px-4",
    cell: "px-4 py-3.5",
    headHeight: 48,
    rowHeight: 48,
  },
};

type DataTableCSSProperties = React.CSSProperties &
  Record<`--data-table-${string}`, string | number>;

type ColumnSizeVariable = `--data-table-column-${number}-size`;

function getColumnSizeStyle<TData>(
  column: Column<TData, unknown>,
  sizeVariable: ColumnSizeVariable | undefined
): React.CSSProperties {
  const size = `${column.getSize()}px`;
  const width = sizeVariable ? `var(${sizeVariable}, ${size})` : size;

  return {
    maxWidth: width,
    minWidth: width,
    width,
  };
}

function getColumnStyle<TData>(
  column: Column<TData, unknown>,
  sizeVariable: ColumnSizeVariable | undefined,
  rowPinPosition?: "top" | "bottom",
  rowPinOffset?: number
): React.CSSProperties {
  const pinned = column.getIsPinned();
  const isSticky = Boolean(pinned || rowPinPosition);

  return {
    ...getColumnSizeStyle(column, sizeVariable),
    bottom: rowPinPosition === "bottom" ? rowPinOffset : undefined,
    insetInlineEnd:
      pinned === "right" ? `${column.getAfter("right")}px` : undefined,
    insetInlineStart:
      pinned === "left" ? `${column.getStart("left")}px` : undefined,
    position: isSticky ? "sticky" : undefined,
    top: rowPinPosition === "top" ? rowPinOffset : undefined,
    zIndex:
      pinned && rowPinPosition
        ? 4
        : rowPinPosition
          ? 3
          : pinned
            ? 2
            : undefined,
  };
}

function getHeaderPinPosition<TData>(header: Header<TData, unknown>) {
  const leafColumns = header
    .getLeafHeaders()
    .filter(
      (leaf) => leaf.subHeaders.length === 0 && leaf.column.getIsVisible()
    )
    .map((leaf) => leaf.column);
  const pinnedPositions = new Set(
    leafColumns.map((column) => column.getIsPinned())
  );

  return pinnedPositions.size === 1
    ? leafColumns[0]?.getIsPinned() || false
    : false;
}

function getHeaderStyle<TData>(
  header: Header<TData, unknown>,
  top: number,
  stickyBlock = true
): React.CSSProperties {
  const leafColumns = header
    .getLeafHeaders()
    .filter(
      (leaf) => leaf.subHeaders.length === 0 && leaf.column.getIsVisible()
    )
    .map((leaf) => leaf.column);
  const pinned = getHeaderPinPosition(header);
  const size = `${header.getSize()}px`;

  if (!pinned && !stickyBlock) {
    return { maxWidth: size, minWidth: size, width: size };
  }

  const firstColumn = leafColumns[0];
  const lastColumn = leafColumns[leafColumns.length - 1];

  return {
    maxWidth: size,
    minWidth: size,
    insetInlineEnd:
      pinned === "right" && lastColumn
        ? `${lastColumn.getAfter("right")}px`
        : undefined,
    insetInlineStart:
      pinned === "left" && firstColumn
        ? `${firstColumn.getStart("left")}px`
        : undefined,
    position: pinned || stickyBlock ? "sticky" : undefined,
    top: stickyBlock ? top : undefined,
    width: size,
    zIndex: pinned ? 6 : stickyBlock ? 5 : undefined,
  };
}

function getCellState<TData>(cell: Cell<TData, unknown>) {
  if (cell.getIsPlaceholder()) return "placeholder";
  if (cell.getIsGrouped()) return "grouped";
  if (isGroupedAggregateCell(cell)) return "aggregated";
  return "value";
}

function isGroupedAggregateCell<TData>(cell: Cell<TData, unknown>) {
  // TanStack also flags ordinary tree parents with subRows as aggregated.
  // Only grouped rows should replace interactive cells with aggregatedCell.
  return cell.row.getIsGrouped() && cell.getIsAggregated();
}

function renderCell<TData>(cell: Cell<TData, unknown>) {
  if (cell.getIsPlaceholder()) return null;

  const renderer = isGroupedAggregateCell(cell)
    ? (cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell)
    : cell.column.columnDef.cell;

  return flexRender(renderer, cell.getContext());
}

function resolveRowClassName<TData>(
  rowClassName: DataTableRowClassName<TData> | undefined,
  row: Row<TData>
) {
  return typeof rowClassName === "function" ? rowClassName(row) : rowClassName;
}

function getRowPinPosition<TData>(row: Row<TData>) {
  return row.getIsPinned() || undefined;
}

type MemoizedTableBodyProps = {
  data: unknown;
  freeze: boolean;
  render: () => React.ReactNode;
};

const MemoizedTableBody = React.memo(
  function MemoizedTableBody({ render }: MemoizedTableBodyProps) {
    return <TableBody>{render()}</TableBody>;
  },
  (previous, next) => next.freeze && Object.is(previous.data, next.data)
);

function useMeasuredRowHeights(keys: readonly string[]) {
  const elements = React.useRef(new Map<string, HTMLTableRowElement>());
  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const keySignature = JSON.stringify(keys);
  const setElement = React.useCallback(
    (key: string, element: HTMLTableRowElement | null) => {
      if (element) elements.current.set(key, element);
      else elements.current.delete(key);
    },
    []
  );

  React.useLayoutEffect(() => {
    const measurementKeys = JSON.parse(keySignature) as string[];
    if (measurementKeys.length === 0) {
      setHeights((current) =>
        Object.keys(current).length === 0 ? current : {}
      );
      return;
    }

    const measure = () => {
      const next: Record<string, number> = {};

      for (const key of measurementKeys) {
        const element = elements.current.get(key);
        if (!element) continue;
        const height = Math.ceil(
          element.getBoundingClientRect().height || element.offsetHeight
        );
        if (height > 0) next[key] = height;
      }

      setHeights((current) => {
        const currentKeys = Object.keys(current);
        const nextKeys = Object.keys(next);
        if (
          currentKeys.length === nextKeys.length &&
          nextKeys.every((key) => current[key] === next[key])
        ) {
          return current;
        }
        return next;
      });
    };

    measure();

    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    for (const key of measurementKeys) {
      const element = elements.current.get(key);
      if (element) observer?.observe(element);
    }
    window.addEventListener("resize", measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [keySignature]);

  return { heights, setElement };
}

function DataTableImpl<TData>(
  {
    table,
    status = "ready",
    emptyContent = "No results.",
    loadingContent,
    errorContent = "Something went wrong while loading these results.",
    noColumnsContent = "No columns are configured.",
    hiddenColumnsContent = "All columns are hidden.",
    renderSubComponent,
    density = "default",
    rowClassName,
    loadingRowCount = 5,
    showFooter,
    className,
    containerProps,
    style,
    "aria-busy": ariaBusy,
    ...tableProps
  }: Omit<DataTableProps<TData>, "ref">,
  ref: React.ForwardedRef<HTMLTableElement>
) {
  const allLeafColumns = table.getAllLeafColumns();
  const columnSizeVariableById = React.useMemo(
    () =>
      new Map(
        allLeafColumns.map(
          (column, index) =>
            [
              column.id,
              `--data-table-column-${index}-size` as ColumnSizeVariable,
            ] as const
        )
      ),
    [allLeafColumns]
  );
  const visibleLeafColumns = [
    ...table.getLeftLeafColumns(),
    ...table.getCenterLeafColumns(),
    ...table.getRightLeafColumns(),
  ].filter((column) => column.getIsVisible());
  const visibleColumnCount = visibleLeafColumns.length;
  const stateColumnSpan = Math.max(visibleColumnCount, 1);
  const densityClasses = DENSITY_CLASSES[density];
  const headerGroups = table.getHeaderGroups();
  const topRows = table.getTopRows();
  const centerRows = table.getCenterRows();
  const bottomRows = table.getBottomRows();
  const footerGroups = table.getFooterGroups();
  const hasFooterContent = footerGroups.some((group) =>
    group.headers.some((header) => header.column.columnDef.footer != null)
  );
  const shouldRenderFooter = showFooter ?? hasFooterContent;
  const rows = [...topRows, ...centerRows, ...bottomRows];
  const headerMeasurementKeys = headerGroups.map((group) => group.id);
  const pinnedRowMeasurementKeys = [...topRows, ...bottomRows].map(
    (row) => row.id
  );
  const { heights: headerHeights, setElement: setHeaderRowElement } =
    useMeasuredRowHeights(headerMeasurementKeys);
  const { heights: pinnedRowHeights, setElement: setPinnedRowElement } =
    useMeasuredRowHeights(pinnedRowMeasurementKeys);
  const headerBlockHeight = headerGroups.reduce(
    (height, group) =>
      height + (headerHeights[group.id] ?? densityClasses.headHeight),
    0
  );
  const headerRowOffsets = new Map<string, number>();
  let headerOffset = 0;
  for (const group of headerGroups) {
    headerRowOffsets.set(group.id, headerOffset);
    headerOffset += headerHeights[group.id] ?? densityClasses.headHeight;
  }
  const topRowOffsets = new Map<string, number>();
  let topOffset = headerBlockHeight;
  for (const row of topRows) {
    topRowOffsets.set(row.id, topOffset);
    topOffset += pinnedRowHeights[row.id] ?? densityClasses.rowHeight;
  }
  const bottomRowOffsets = new Map<string, number>();
  let bottomOffset = 0;
  for (let index = bottomRows.length - 1; index >= 0; index -= 1) {
    const row = bottomRows[index];
    bottomRowOffsets.set(row.id, bottomOffset);
    bottomOffset += pinnedRowHeights[row.id] ?? densityClasses.rowHeight;
  }
  const safeLoadingRowCount = Number.isFinite(loadingRowCount)
    ? Math.max(1, Math.floor(loadingRowCount))
    : 5;
  const tableWidth = visibleColumnCount > 0 ? table.getTotalSize() : undefined;
  const freezeBodyDuringResize =
    table.options.columnResizeMode === "onChange" &&
    Boolean(table.getState().columnSizingInfo.isResizingColumn);
  const sizingVariables = allLeafColumns.reduce<DataTableCSSProperties>(
    (variables, column) => {
      const variable = columnSizeVariableById.get(column.id);
      if (variable) variables[variable] = `${column.getSize()}px`;
      return variables;
    },
    {
      "--data-table-header-row-height": `${densityClasses.headHeight}px`,
      "--data-table-row-height": `${densityClasses.rowHeight}px`,
    }
  );

  const renderDataRow = (row: Row<TData>) => {
    const pinPosition = getRowPinPosition(row);
    const rowPinOffset =
      pinPosition === "top"
        ? topRowOffsets.get(row.id)
        : pinPosition === "bottom"
          ? bottomRowOffsets.get(row.id)
          : undefined;
    const isSelected = row.getIsSelected();
    const isPartiallySelected = !isSelected && row.getIsSomeSelected();
    const isExpanded = row.getIsExpanded();

    return (
      <React.Fragment key={row.id}>
        <TableRow
          ref={(element) => {
            if (pinPosition) setPinnedRowElement(row.id, element);
          }}
          data-depth={row.depth}
          data-expanded={isExpanded ? "true" : undefined}
          data-pinned={pinPosition}
          data-selected={
            isSelected ? "true" : isPartiallySelected ? "mixed" : undefined
          }
          data-state={
            isSelected ? "selected" : isPartiallySelected ? "mixed" : undefined
          }
          style={
            pinPosition
              ? ({
                  "--data-table-row-pin-offset": `${rowPinOffset}px`,
                } as DataTableCSSProperties)
              : undefined
          }
          className={cn(
            "group/data-row data-[pinned]:bg-muted/30",
            "data-[selected=true]:shadow-[inset_2px_0_0_0_var(--primary)]",
            "data-[selected=mixed]:shadow-[inset_2px_0_0_0_var(--muted-foreground)]",
            resolveRowClassName(rowClassName, row)
          )}
        >
          {row.getVisibleCells().map((cell) => {
            const pinned = cell.column.getIsPinned();
            return (
              <TableCell
                key={cell.id}
                data-column-id={cell.column.id}
                data-pinned={pinned || undefined}
                data-state={getCellState(cell)}
                className={cn(
                  densityClasses.cell,
                  "data-[state=placeholder]:text-muted-foreground",
                  "data-[state=aggregated]:font-medium",
                  "data-[state=grouped]:font-medium",
                  "data-[pinned]:bg-background",
                  "group-data-[pinned]/data-row:bg-muted",
                  "group-data-[selected]/data-row:data-[pinned]:bg-muted"
                )}
                style={getColumnStyle(
                  cell.column,
                  columnSizeVariableById.get(cell.column.id),
                  pinPosition,
                  rowPinOffset
                )}
              >
                {renderCell(cell)}
              </TableCell>
            );
          })}
        </TableRow>
        {renderSubComponent && isExpanded ? (
          <TableRow
            data-depth={row.depth}
            data-slot="data-table-detail-row"
            className="bg-muted/20 hover:bg-muted/20"
          >
            <TableCell
              colSpan={stateColumnSpan}
              className={cn("p-0", densityClasses.cell)}
            >
              {renderSubComponent({ row, table })}
            </TableCell>
          </TableRow>
        ) : null}
      </React.Fragment>
    );
  };

  const renderBody = () => {
    if (allLeafColumns.length === 0) {
      return (
        <DataTableStateRow colSpan={1}>{noColumnsContent}</DataTableStateRow>
      );
    }

    if (visibleColumnCount === 0) {
      return (
        <DataTableStateRow colSpan={1} data-state="columns-hidden">
          {hiddenColumnsContent}
        </DataTableStateRow>
      );
    }

    if (status === "loading") {
      if (loadingContent != null) {
        return (
          <DataTableStateRow colSpan={stateColumnSpan} data-state="loading">
            {loadingContent}
          </DataTableStateRow>
        );
      }

      return Array.from({ length: safeLoadingRowCount }, (_, rowIndex) => (
        <TableRow
          key={`loading-${rowIndex}`}
          aria-hidden="true"
          data-state="loading"
        >
          {visibleLeafColumns.map((column, columnIndex) => (
            <TableCell
              key={column.id}
              className={densityClasses.cell}
              style={getColumnStyle(
                column,
                columnSizeVariableById.get(column.id)
              )}
            >
              <span
                data-slot="data-table-skeleton"
                className={cn(
                  "block h-4 animate-pulse rounded-md bg-muted motion-reduce:animate-none",
                  columnIndex % 3 === 0
                    ? "w-3/5"
                    : columnIndex % 3 === 1
                      ? "w-4/5"
                      : "w-2/5"
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (status === "error") {
      return (
        <DataTableStateRow colSpan={stateColumnSpan} data-state="error">
          <div role="alert">{errorContent}</div>
        </DataTableStateRow>
      );
    }

    if (rows.length === 0) {
      return (
        <DataTableStateRow colSpan={stateColumnSpan} data-state="empty">
          {emptyContent}
        </DataTableStateRow>
      );
    }

    return rows.map(renderDataRow);
  };

  return (
    <Table
      {...tableProps}
      ref={ref}
      aria-busy={ariaBusy ?? status === "loading"}
      data-density={density}
      data-resizing={freezeBodyDuringResize ? "" : undefined}
      data-slot="data-table"
      data-status={status}
      className={cn("w-full border-separate border-spacing-0", className)}
      containerProps={{
        ...containerProps,
        className: cn(
          "isolate rounded-none border-0 bg-transparent shadow-none",
          containerProps?.className
        ),
      }}
      style={{
        ...sizingVariables,
        tableLayout: visibleColumnCount > 0 ? "fixed" : undefined,
        maxWidth: tableWidth,
        minWidth: tableWidth,
        width: tableWidth,
        ...style,
      }}
    >
      {visibleColumnCount > 0 ? (
        <colgroup>
          {visibleLeafColumns.map((column) => (
            <col
              key={column.id}
              data-column-id={column.id}
              style={getColumnSizeStyle(
                column,
                columnSizeVariableById.get(column.id)
              )}
            />
          ))}
        </colgroup>
      ) : null}
      {visibleColumnCount > 0 ? (
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              ref={(element) => {
                setHeaderRowElement(headerGroup.id, element);
              }}
            >
              {headerGroup.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                const isPrimarySort =
                  sorted !== false && header.column.getSortIndex() === 0;
                const pinned = getHeaderPinPosition(header);
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      isPrimarySort && sorted === "asc"
                        ? "ascending"
                        : isPrimarySort && sorted === "desc"
                          ? "descending"
                          : undefined
                    }
                    colSpan={header.colSpan}
                    data-column-id={header.column.id}
                    data-pinned={pinned || undefined}
                    data-placeholder={header.isPlaceholder ? "" : undefined}
                    scope={header.colSpan > 1 ? "colgroup" : "col"}
                    className={cn(
                      "relative bg-muted",
                      densityClasses.head,
                      "data-[pinned]:bg-muted"
                    )}
                    style={getHeaderStyle(
                      header,
                      headerRowOffsets.get(headerGroup.id) ?? 0
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
      ) : null}
      <MemoizedTableBody
        data={table.options.data}
        freeze={freezeBodyDuringResize}
        render={renderBody}
      />
      {shouldRenderFooter && visibleColumnCount > 0 ? (
        <TableFooter>
          {footerGroups.map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  colSpan={header.colSpan}
                  data-column-id={header.column.id}
                  data-pinned={getHeaderPinPosition(header) || undefined}
                  className={cn(densityClasses.cell, "data-[pinned]:bg-muted")}
                  style={getHeaderStyle(header, 0, false)}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      ) : null}
    </Table>
  );
}

type DataTableComponent = {
  <TData>(props: DataTableProps<TData>): React.ReactElement | null;
  displayName?: string;
};

const DataTable = React.forwardRef(DataTableImpl) as DataTableComponent;
DataTable.displayName = "DataTable";

type DataTableStateRowProps = React.ComponentPropsWithoutRef<"tr"> & {
  colSpan: number;
};

function DataTableStateRow({
  children,
  colSpan,
  className,
  ...props
}: DataTableStateRowProps) {
  return (
    <TableRow
      data-slot="data-table-state-row"
      className={cn("hover:bg-transparent", className)}
      {...props}
    >
      <TableCell
        colSpan={Math.max(1, colSpan)}
        className="h-28 px-6 text-center text-sm text-muted-foreground"
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

export { DataTable };
export type {
  DataTableColumnLabel,
  DataTableDensity,
  DataTableFilterOption,
  DataTableProps,
  DataTableRowClassName,
  DataTableStatus,
  DataTableSubComponentProps,
} from "./data-table-types";
export {
  DataTableColumnHeader,
  type DataTableColumnHeaderProps,
} from "./data-table-column-header";
export {
  DataTableFacetedFilter,
  type DataTableFacetedFilterProps,
} from "./data-table-faceted-filter";
export {
  DataTablePagination,
  type DataTablePaginationProps,
} from "./data-table-pagination";
export {
  DataTableResizeHandle,
  type DataTableResizeHandleProps,
} from "./data-table-resize-handle";
export {
  DataTableSearch,
  type DataTableSearchProps,
} from "./data-table-search";
export {
  DataTableToolbar,
  type DataTableToolbarProps,
} from "./data-table-toolbar";
export {
  DataTableViewOptions,
  type DataTableViewOptionsProps,
} from "./data-table-view-options";
