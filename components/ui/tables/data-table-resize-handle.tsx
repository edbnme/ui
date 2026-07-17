/**
 * Pointer, touch, and keyboard column-resize handle for DataTable.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @registryPartOf data-table
 */

"use client";

import * as React from "react";
import type { Column, Header, Table } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

const ACCESSIBLE_UNBOUNDED_COLUMN_MAX = 1000;

type ResizeStart = {
  pointerId: number;
  clientX: number;
  logicalDelta: number;
  sizes: Array<{ id: string; size: number; min: number; max: number }>;
};

function getColumnBounds<TData>(column: Column<TData, unknown>) {
  const rawMinimum = column.columnDef.minSize;
  const rawMaximum = column.columnDef.maxSize;
  const min =
    rawMinimum != null && Number.isFinite(rawMinimum)
      ? Math.max(0, rawMinimum)
      : 20;
  const max =
    rawMaximum != null && Number.isFinite(rawMaximum)
      ? Math.max(min, rawMaximum)
      : Number.MAX_SAFE_INTEGER;
  return { min, max };
}

export interface DataTableResizeHandleProps<TData, TValue> extends Omit<
  React.ComponentPropsWithRef<"div">,
  | "onDoubleClick"
  | "onKeyDown"
  | "onPointerCancel"
  | "onPointerDown"
  | "onPointerMove"
  | "onPointerUp"
> {
  table: Table<TData>;
  header: Header<TData, TValue>;
  /** Keyboard resize increment in pixels. @default 8 */
  step?: number;
  /** Shift-modified keyboard increment in pixels. @default 24 */
  largeStep?: number;
  /** Accessible separator name. Defaults to the column id. */
  label?: string;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onPointerCancel?: React.PointerEventHandler<HTMLDivElement>;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onPointerMove?: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
}

function DataTableResizeHandleImpl<TData, TValue>(
  {
    table,
    header,
    step = 8,
    largeStep = 24,
    label = `Resize ${header.column.id} column`,
    className,
    style,
    onDoubleClick,
    onKeyDown,
    onPointerCancel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    ...props
  }: Omit<DataTableResizeHandleProps<TData, TValue>, "ref">,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const dragRef = React.useRef<ResizeStart | null>(null);
  const canResize = header.column.getCanResize();
  const isResizing = header.column.getIsResizing();
  const safeStep = Number.isFinite(step) && step > 0 ? step : 8;
  const safeLargeStep =
    Number.isFinite(largeStep) && largeStep > 0 ? largeStep : 24;
  const leafColumns = header
    .getLeafHeaders()
    .filter((leaf) => leaf.subHeaders.length === 0)
    .map((leaf) => leaf.column);
  const minimumSize = leafColumns.reduce(
    (sum, column) => sum + getColumnBounds(column).min,
    0
  );
  const maximumSize = leafColumns.reduce((sum, column) => {
    const maximum = getColumnBounds(column).max;
    return (
      sum +
      (maximum === Number.MAX_SAFE_INTEGER
        ? Math.max(column.getSize(), ACCESSIBLE_UNBOUNDED_COLUMN_MAX)
        : maximum)
    );
  }, 0);
  const resizeDirection =
    table.options.columnResizeDirection === "rtl" ? -1 : 1;
  const sizingInfo = table.getState().columnSizingInfo;
  const visualOffset =
    isResizing && table.options.columnResizeMode === "onEnd"
      ? (sizingInfo.deltaOffset ?? 0) * resizeDirection
      : 0;

  React.useEffect(
    () => () => {
      if (dragRef.current) {
        table.setColumnSizingInfo((old) => ({
          ...old,
          columnSizingStart: [],
          deltaOffset: null,
          deltaPercentage: null,
          isResizingColumn: false,
          startOffset: null,
          startSize: null,
        }));
      }
    },
    [table]
  );

  const getNextSizes = React.useCallback(
    (start: ResizeStart, delta: number) => {
      const total = start.sizes.reduce((sum, item) => sum + item.size, 0);
      const percentage = total > 0 ? delta / total : 0;
      return start.sizes.map((item) => ({
        ...item,
        size: Math.min(
          item.max,
          Math.max(
            item.min,
            Math.round((item.size + item.size * percentage) * 100) / 100
          )
        ),
      }));
    },
    []
  );

  const commitSizes = React.useCallback(
    (sizes: ResizeStart["sizes"]) => {
      table.setColumnSizing((old) => ({
        ...old,
        ...Object.fromEntries(sizes.map((item) => [item.id, item.size])),
      }));
    },
    [table]
  );

  const updateDrag = (clientX: number, commit: boolean) => {
    const start = dragRef.current;
    if (!start) return;
    const logicalDelta = (clientX - start.clientX) * resizeDirection;
    start.logicalDelta = logicalDelta;
    const nextSizes = getNextSizes(start, logicalDelta);

    table.setColumnSizingInfo((old) => ({
      ...old,
      deltaOffset: logicalDelta,
      deltaPercentage:
        header.getSize() > 0 ? logicalDelta / header.getSize() : 0,
    }));

    if (commit || table.options.columnResizeMode === "onChange") {
      commitSizes(nextSizes);
    }
  };

  const finishDrag = (
    event: React.PointerEvent<HTMLDivElement>,
    cancelled: boolean
  ) => {
    const start = dragRef.current;
    if (!start || start.pointerId !== event.pointerId) return;

    if (cancelled && table.options.columnResizeMode === "onChange") {
      commitSizes(start.sizes);
    } else if (!cancelled) {
      updateDrag(event.clientX, true);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    table.setColumnSizingInfo((old) => ({
      ...old,
      columnSizingStart: [],
      deltaOffset: null,
      deltaPercentage: null,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
    }));
  };

  const resizeBy = (delta: number) => {
    const currentSizes = leafColumns.map((column) => ({
      id: column.id,
      size: column.getSize(),
      ...getColumnBounds(column),
    }));
    commitSizes(
      getNextSizes(
        {
          pointerId: -1,
          clientX: 0,
          logicalDelta: 0,
          sizes: currentSizes,
        },
        delta
      )
    );
  };

  return (
    <div
      {...props}
      ref={ref}
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={Math.round(minimumSize)}
      aria-valuemax={Math.round(maximumSize)}
      aria-valuenow={Math.round(header.getSize())}
      tabIndex={canResize ? 0 : -1}
      data-slot="data-table-resize-handle"
      data-resizing={isResizing ? "" : undefined}
      className={cn(
        "absolute inset-y-0 -end-3 z-10 w-6 cursor-col-resize touch-none select-none",
        "after:absolute after:inset-y-1 after:start-1/2 after:w-px after:-translate-x-1/2 after:bg-border",
        "hover:after:w-0.5 hover:after:bg-primary focus-visible:outline-none focus-visible:after:w-0.5 focus-visible:after:bg-ring",
        "data-[resizing]:after:w-0.5 data-[resizing]:after:bg-primary",
        !canResize && "pointer-events-none hidden",
        className
      )}
      style={{ transform: `translateX(${visualOffset}px)`, ...style }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || !canResize || dragRef.current) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;

        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        const sizes = leafColumns.map((column) => ({
          id: column.id,
          size: column.getSize(),
          ...getColumnBounds(column),
        }));
        dragRef.current = {
          pointerId: event.pointerId,
          clientX: event.clientX,
          logicalDelta: 0,
          sizes,
        };
        table.setColumnSizingInfo((old) => ({
          ...old,
          columnSizingStart: sizes.map((item) => [item.id, item.size]),
          deltaOffset: 0,
          deltaPercentage: 0,
          isResizingColumn: header.column.id,
          startOffset: event.clientX,
          startSize: header.getSize(),
        }));
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (
          event.defaultPrevented ||
          dragRef.current?.pointerId !== event.pointerId
        )
          return;
        updateDrag(event.clientX, false);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (!event.defaultPrevented) finishDrag(event, false);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        finishDrag(event, true);
      }}
      onDoubleClick={(event) => {
        onDoubleClick?.(event);
        if (event.defaultPrevented) return;
        leafColumns.forEach((column) => column.resetSize());
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !canResize) return;

        const amount = event.shiftKey ? safeLargeStep : safeStep;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          const physicalDirection = event.key === "ArrowRight" ? 1 : -1;
          resizeBy(physicalDirection * resizeDirection * amount);
        }
      }}
    />
  );
}

type DataTableResizeHandleComponent = {
  <TData, TValue>(
    props: DataTableResizeHandleProps<TData, TValue>
  ): React.ReactElement | null;
  displayName?: string;
};

const DataTableResizeHandle = React.forwardRef(
  DataTableResizeHandleImpl
) as DataTableResizeHandleComponent;
DataTableResizeHandle.displayName = "DataTableResizeHandle";

export { DataTableResizeHandle };
