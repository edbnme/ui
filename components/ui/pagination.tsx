/**
 * Pagination — Page navigation with previous, next, and numbered pages.
 *
 * A pure-CSS component (it's just `<nav aria-label="pagination">` + a
 * styled `<ul>` of links — no library primitive is required). Inline
 * icons for zero-dependency portability.
 *
 * Anatomy:
 * ```tsx
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious href="/page/1" />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="/page/2">2</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="/page/3" isActive>3</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationEllipsis />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationNext href="/page/4" />
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 * ```
 *
 * Accessibility: the root is `<nav aria-label="pagination">`. The active
 * page's link carries `aria-current="page"`. Prev / Next carry their own
 * `aria-label`. Ellipsis uses `aria-hidden` plus a visually-hidden
 * "More pages" label.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/pagination
 * @registryDescription Page navigation with previous/next and numbered pages.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type PaginationProps = React.ComponentPropsWithoutRef<"nav">;

/**
 * The pagination landmark.
 *
 * @since 0.1.0
 */
function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}
Pagination.displayName = "Pagination";

// ---- CONTENT ----------------------------------------------------------------

export type PaginationContentProps = React.ComponentPropsWithoutRef<"ul">;

/**
 * Row of pagination items.
 *
 * @since 0.1.0
 */
function PaginationContent({ className, ...props }: PaginationContentProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}
PaginationContent.displayName = "PaginationContent";

// ---- ITEM -------------------------------------------------------------------

export type PaginationItemProps = React.ComponentPropsWithoutRef<"li">;

/**
 * A single item wrapper. Wraps `PaginationLink`, `PaginationPrevious`,
 * `PaginationNext`, or `PaginationEllipsis`.
 *
 * @since 0.1.0
 */
function PaginationItem({ className, ...props }: PaginationItemProps) {
  return (
    <li
      data-slot="pagination-item"
      className={cn(className)}
      {...props}
    />
  );
}
PaginationItem.displayName = "PaginationItem";

// ---- LINK -------------------------------------------------------------------

export interface PaginationLinkProps
  extends React.ComponentPropsWithoutRef<"a"> {
  /** Marks this link as the current page — applies `aria-current` + active styles. */
  isActive?: boolean;
  /** Visual size preset. */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * A numbered page link. Pair with a framework link (wrap with `<Link>`
 * using the `legacyBehavior` pattern, or roll your own wrapper).
 *
 * @since 0.1.0
 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive ? "" : undefined}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          "h-9 w-9": size === "icon",
          "h-9 px-3": size === "default",
          "h-8 px-2 text-xs": size === "sm",
          "h-10 px-4": size === "lg",
        },
        isActive
          ? "border border-input bg-background shadow-sm"
          : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}
PaginationLink.displayName = "PaginationLink";

// ---- PREVIOUS ---------------------------------------------------------------

export type PaginationPreviousProps = React.ComponentPropsWithoutRef<
  typeof PaginationLink
>;

/**
 * "Go to previous page" link.
 *
 * @since 0.1.0
 */
function PaginationPrevious({
  className,
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      data-slot="pagination-previous"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span>Previous</span>
    </PaginationLink>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

// ---- NEXT -------------------------------------------------------------------

export type PaginationNextProps = React.ComponentPropsWithoutRef<
  typeof PaginationLink
>;

/**
 * "Go to next page" link.
 *
 * @since 0.1.0
 */
function PaginationNext({ className, ...props }: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      data-slot="pagination-next"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  );
}
PaginationNext.displayName = "PaginationNext";

// ---- ELLIPSIS ---------------------------------------------------------------

export type PaginationEllipsisProps = React.ComponentPropsWithoutRef<"span">;

/**
 * Collapsed pages indicator — usually rendered between the first and
 * current-adjacent pages.
 *
 * @since 0.1.0
 */
function PaginationEllipsis({
  className,
  ...props
}: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <EllipsisIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
PaginationEllipsis.displayName = "PaginationEllipsis";

// ---- INLINE ICONS -----------------------------------------------------------

function ChevronLeftIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function EllipsisIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

// ---- EXPORTS ----------------------------------------------------------------

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
