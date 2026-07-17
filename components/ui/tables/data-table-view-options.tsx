/**
 * Column visibility controls for DataTable.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @registryPartOf data-table
 */

"use client";

import * as React from "react";
import { Check, Columns } from "@phosphor-icons/react";
import type { Column, Table } from "@tanstack/react-table";
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DataTableColumnLabel } from "./data-table-types";

export interface DataTableViewOptionsProps<TData> extends Omit<
  React.ComponentPropsWithRef<"button">,
  "children" | "title"
> {
  table: Table<TData>;
  /** Trigger and popover heading. @default "Columns" */
  title?: string;
  /** Resolves rich display content for each leaf column. */
  getColumnLabel?: DataTableColumnLabel<TData>;
  /** Include the show/hide-all control. @default true */
  showToggleAll?: boolean;
}

function defaultColumnLabel<TData>(column: Column<TData, unknown>) {
  const meta = column.columnDef.meta as { label?: React.ReactNode } | undefined;
  if (meta?.label != null) return meta.label;
  if (typeof column.columnDef.header === "string")
    return column.columnDef.header;
  return humanizeColumnId(column.id);
}

function humanizeColumnId(columnId: string) {
  const label = columnId
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .trim();

  return label
    ? label.replace(/\b[a-z]/g, (character) => character.toUpperCase())
    : columnId;
}

function DataTableViewOptionsImpl<TData>(
  {
    table,
    title = "Columns",
    getColumnLabel = defaultColumnLabel,
    showToggleAll = true,
    className,
    disabled,
    ...triggerProps
  }: Omit<DataTableViewOptionsProps<TData>, "ref">,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());
  const allVisible = hideableColumns.every((column) => column.getIsVisible());
  const someVisible = hideableColumns.some((column) => column.getIsVisible());

  return (
    <PopoverRoot>
      <PopoverTrigger
        ref={ref}
        type="button"
        disabled={disabled || hideableColumns.length === 0}
        data-slot="data-table-view-options-trigger"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium shadow-xs",
          "hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...triggerProps}
      >
        <Columns aria-hidden className="size-3.5" weight="bold" />
        <span>{title}</span>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner sideOffset={6} align="end">
          <PopoverPopup className="w-56 p-1.5">
            <PopoverTitle className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Toggle columns
            </PopoverTitle>
            <div role="group" aria-label="Column visibility">
              {showToggleAll && hideableColumns.length > 1 ? (
                <>
                  <VisibilityOption
                    checked={allVisible ? true : someVisible ? "mixed" : false}
                    label="All columns"
                    onClick={() => table.toggleAllColumnsVisible(!allVisible)}
                  />
                  <div className="my-1 h-px bg-border" />
                </>
              ) : null}
              {hideableColumns.map((column) => {
                const columnLabel = getColumnLabel(column);
                const accessibleColumnLabel =
                  typeof columnLabel === "string"
                    ? columnLabel
                    : humanizeColumnId(column.id);

                return (
                  <VisibilityOption
                    key={column.id}
                    checked={column.getIsVisible()}
                    label={columnLabel}
                    accessibleLabel={`Toggle ${accessibleColumnLabel} column`}
                    onClick={() => column.toggleVisibility()}
                  />
                );
              })}
            </div>
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </PopoverRoot>
  );
}

type DataTableViewOptionsComponent = {
  <TData>(props: DataTableViewOptionsProps<TData>): React.ReactElement | null;
  displayName?: string;
};

const DataTableViewOptions = React.forwardRef(
  DataTableViewOptionsImpl
) as DataTableViewOptionsComponent;
DataTableViewOptions.displayName = "DataTableViewOptions";

interface VisibilityOptionProps {
  checked: boolean | "mixed";
  label: React.ReactNode;
  accessibleLabel?: string;
  onClick: () => void;
}

function VisibilityOption({
  checked,
  label,
  accessibleLabel,
  onClick,
}: VisibilityOptionProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={accessibleLabel}
      className="flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-start text-sm outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-1 focus-visible:ring-ring"
      onClick={onClick}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-border",
          checked && "border-primary bg-primary text-primary-foreground"
        )}
      >
        {checked === "mixed" ? (
          <span className="h-0.5 w-2 rounded-full bg-current" />
        ) : checked ? (
          <Check aria-hidden className="size-3" weight="bold" />
        ) : null}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

export { DataTableViewOptions };
