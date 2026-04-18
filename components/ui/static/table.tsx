/**
 * Table — Semantic HTML table with styled header, body, footer, rows,
 * cells, and caption.
 *
 * Pure CSS — the components are thin wrappers over native table
 * elements with consistent spacing, borders, and hover states. Wraps
 * the `<table>` in a scroll container so wide tables don't break
 * layout.
 *
 * Anatomy:
 * ```tsx
 * <Table>
 *   <TableCaption>A list of recent invoices.</TableCaption>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Invoice</TableHead>
 *       <TableHead>Status</TableHead>
 *       <TableHead className="text-right">Amount</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>INV001</TableCell>
 *       <TableCell>Paid</TableCell>
 *       <TableCell className="text-right">$250.00</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/table
 * @registryDescription Data table with header, body, and cell components.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type TableProps = React.ComponentPropsWithoutRef<"table">;

/**
 * The `<table>` element, wrapped in a horizontal-scroll container to
 * handle wide data gracefully.
 *
 * @since 0.1.0
 */
function Table({ className, ...props }: TableProps) {
  return (
    <div data-slot="table-wrapper" className="relative w-full overflow-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}
Table.displayName = "Table";

// ---- HEADER -----------------------------------------------------------------

export type TableHeaderProps = React.ComponentPropsWithoutRef<"thead">;

/**
 * `<thead>` section.
 *
 * @since 0.1.0
 */
function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-border", className)}
      {...props}
    />
  );
}
TableHeader.displayName = "TableHeader";

// ---- BODY -------------------------------------------------------------------

export type TableBodyProps = React.ComponentPropsWithoutRef<"tbody">;

/**
 * `<tbody>` section. Strips the bottom border from the last row.
 *
 * @since 0.1.0
 */
function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}
TableBody.displayName = "TableBody";

// ---- FOOTER -----------------------------------------------------------------

export type TableFooterProps = React.ComponentPropsWithoutRef<"tfoot">;

/**
 * `<tfoot>` section — typically used for totals / summary rows.
 *
 * @since 0.1.0
 */
function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
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

export type TableRowProps = React.ComponentPropsWithoutRef<"tr">;

/**
 * `<tr>` row. Add `data-selected` (any truthy value) to mark selected
 * rows — they'll pick up the `data-selected:bg-muted` style.
 *
 * @since 0.1.0
 */
function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border",
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

export type TableHeadProps = React.ComponentPropsWithoutRef<"th">;

/**
 * `<th>` header cell.
 *
 * @since 0.1.0
 */
function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}
TableHead.displayName = "TableHead";

// ---- DATA CELL --------------------------------------------------------------

export type TableCellProps = React.ComponentPropsWithoutRef<"td">;

/**
 * `<td>` data cell.
 *
 * @since 0.1.0
 */
function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}
TableCell.displayName = "TableCell";

// ---- CAPTION ----------------------------------------------------------------

export type TableCaptionProps = React.ComponentPropsWithoutRef<"caption">;

/**
 * `<caption>` — accessible description of the table.
 *
 * @since 0.1.0
 */
function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
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
