/**
 * Breadcrumb — Navigation trail showing the user's location in a
 * hierarchical site.
 *
 * A pure-CSS component (the semantics of `<nav aria-label="breadcrumb">`
 * combined with `<ol>` are more appropriate than any library primitive).
 * Inline icons are used so this component can be copied into any project
 * without extra dependencies.
 *
 * Anatomy:
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 *
 * Accessibility: the root is `<nav aria-label="breadcrumb">`; the current
 * page uses `aria-current="page"` and `aria-disabled="true"`. Separators
 * are `aria-hidden`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/breadcrumb
 * @registryDescription Navigation breadcrumb trail with separator support.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Slot } from "@/lib/slot";

// ---- ROOT -------------------------------------------------------------------

export type BreadcrumbProps = React.ComponentPropsWithoutRef<"nav"> & {
  /** Custom separator element. When omitted, a chevron-right is used. */
  separator?: React.ReactNode;
};

/**
 * The breadcrumb landmark.
 *
 * @since 0.1.0
 */
function Breadcrumb({ separator: _separator, ...props }: BreadcrumbProps) {
  // `separator` is reserved for future API — destructure to keep it off DOM.
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}
Breadcrumb.displayName = "Breadcrumb";

// ---- LIST -------------------------------------------------------------------

export type BreadcrumbListProps = React.ComponentPropsWithoutRef<"ol">;

/**
 * Ordered list of breadcrumb items.
 *
 * @since 0.1.0
 */
function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
}
BreadcrumbList.displayName = "BreadcrumbList";

// ---- ITEM -------------------------------------------------------------------

export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<"li">;

/**
 * Individual breadcrumb cell. Wraps a `BreadcrumbLink` or
 * `BreadcrumbPage`.
 *
 * @since 0.1.0
 */
function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}
BreadcrumbItem.displayName = "BreadcrumbItem";

// ---- LINK -------------------------------------------------------------------

export type BreadcrumbLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  /** When `true`, passes props to the child instead of rendering an `<a>`. */
  asChild?: boolean;
};

/**
 * A navigable breadcrumb. Supports `asChild` to compose with
 * framework-specific link components (e.g. `next/link`).
 *
 * @since 0.1.0
 */
function BreadcrumbLink({
  className,
  asChild,
  ...props
}: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:text-foreground focus-visible:underline underline-offset-4",
        className
      )}
      {...props}
    />
  );
}
BreadcrumbLink.displayName = "BreadcrumbLink";

// ---- PAGE -------------------------------------------------------------------

export type BreadcrumbPageProps = React.ComponentPropsWithoutRef<"span">;

/**
 * The current page's label. Non-interactive; `aria-current="page"`
 * identifies it to assistive tech.
 *
 * @since 0.1.0
 */
function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
}
BreadcrumbPage.displayName = "BreadcrumbPage";

// ---- SEPARATOR --------------------------------------------------------------

export type BreadcrumbSeparatorProps = React.ComponentPropsWithoutRef<"li">;

/**
 * Visual divider between items. Renders a chevron by default; pass
 * `children` to override.
 *
 * @since 0.1.0
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// ---- ELLIPSIS ---------------------------------------------------------------

export type BreadcrumbEllipsisProps = React.ComponentPropsWithoutRef<"span">;

/**
 * Collapsed-items indicator. Useful when the trail is too long — render
 * this in place of middle items with a popover / menu of the hidden ones.
 *
 * @since 0.1.0
 */
function BreadcrumbEllipsis({
  className,
  ...props
}: BreadcrumbEllipsisProps) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-ellipsis"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <EllipsisIcon className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

// ---- INLINE ICONS -----------------------------------------------------------

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
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
