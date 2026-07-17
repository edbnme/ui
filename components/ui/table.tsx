/**
 * Table - Premium solid semantic data table.
 *
 * Native table primitives with stable scroll containment, crisp borders,
 * selected row styling, footer support, captions, and full native prop/ref
 * forwarding.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.1.0
 * @docs https://ui.edbn.me/docs/components/table
 * @registryDescription Premium solid data table with header, body, footer, rows, cells, and caption.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type TableProps = React.ComponentPropsWithRef<"table"> & {
  /** Props forwarded to the scroll container around the native table. */
  containerProps?: React.ComponentPropsWithRef<"div">;
};

const Table = React.forwardRef<HTMLTableElement, Omit<TableProps, "ref">>(
  function Table({ className, containerProps, ...props }, ref) {
    const { className: containerClassName, ...restContainerProps } =
      containerProps ?? {};

    return (
      <div
        {...restContainerProps}
        data-slot="table-wrapper"
        className={cn(
          "relative w-full overflow-auto rounded-lg border border-border/70 bg-background shadow-sm",
          containerClassName
        )}
      >
        <table
          ref={ref}
          data-slot="table"
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
    );
  }
);
Table.displayName = "Table";

// ---- HEADER -----------------------------------------------------------------

export type TableHeaderProps = React.ComponentPropsWithRef<"thead">;

function TableHeader({ className, ref, ...props }: TableHeaderProps) {
  return (
    <thead
      ref={ref}
      data-slot="table-header"
      className={cn(
        "bg-muted/50 text-muted-foreground [&_tr]:border-b [&_tr]:border-border/70",
        className
      )}
      {...props}
    />
  );
}
TableHeader.displayName = "TableHeader";

// ---- BODY -------------------------------------------------------------------

export type TableBodyProps = React.ComponentPropsWithRef<"tbody">;

function TableBody({ className, ref, ...props }: TableBodyProps) {
  return (
    <tbody
      ref={ref}
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}
TableBody.displayName = "TableBody";

// ---- FOOTER -----------------------------------------------------------------

export type TableFooterProps = React.ComponentPropsWithRef<"tfoot">;

function TableFooter({ className, ref, ...props }: TableFooterProps) {
  return (
    <tfoot
      ref={ref}
      data-slot="table-footer"
      className={cn(
        "border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}
TableFooter.displayName = "TableFooter";

// ---- ROW --------------------------------------------------------------------

export type TableRowProps = React.ComponentPropsWithRef<"tr">;

function TableRow({ className, ref, ...props }: TableRowProps) {
  return (
    <tr
      ref={ref}
      data-slot="table-row"
      className={cn(
        "border-b border-border/70",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-muted/50 data-selected:bg-muted",
        className
      )}
      {...props}
    />
  );
}
TableRow.displayName = "TableRow";

// ---- HEAD CELL --------------------------------------------------------------

export type TableHeadProps = React.ComponentPropsWithRef<"th">;

function TableHead({ className, ref, ...props }: TableHeadProps) {
  return (
    <th
      ref={ref}
      data-slot="table-head"
      className={cn(
        "h-10 px-3 text-left align-middle font-medium text-muted-foreground",
        "[&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}
TableHead.displayName = "TableHead";

// ---- DATA CELL --------------------------------------------------------------

export type TableCellProps = React.ComponentPropsWithRef<"td">;

function TableCell({ className, ref, ...props }: TableCellProps) {
  return (
    <td
      ref={ref}
      data-slot="table-cell"
      className={cn(
        "p-3 align-middle",
        "[&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}
TableCell.displayName = "TableCell";

// ---- CAPTION ----------------------------------------------------------------

export type TableCaptionProps = React.ComponentPropsWithRef<"caption">;

function TableCaption({ className, ref, ...props }: TableCaptionProps) {
  return (
    <caption
      ref={ref}
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
TableCaption.displayName = "TableCaption";

// ---- EXPORTS ----------------------------------------------------------------

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
