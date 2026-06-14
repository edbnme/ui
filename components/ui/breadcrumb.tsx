/**
 * Breadcrumb - Solid navigation trail showing the current page location.
 *
 * Uses semantic HTML: a navigation landmark, an ordered list, links for
 * ancestors, and a non-interactive current-page label.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @docs       https://ui.edbn.me/docs/components/breadcrumb
 * @registryDescription Solid breadcrumb navigation with separator, ellipsis, and responsive wrapping.
 */

"use client";

import * as React from "react";
import { Slot } from "@/lib/slot";
import { cn } from "@/lib/utils";

// ---- CONTEXT ----------------------------------------------------------------

const BreadcrumbSeparatorContext = React.createContext<
  React.ReactNode | undefined
>(undefined);

// ---- ROOT -------------------------------------------------------------------

export type BreadcrumbProps = React.ComponentPropsWithoutRef<"nav"> & {
  /** Default separator rendered by `BreadcrumbSeparator` descendants. */
  separator?: React.ReactNode;
};

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb(
    { separator, className, "aria-label": ariaLabel = "breadcrumb", ...props },
    ref
  ) {
    return (
      <BreadcrumbSeparatorContext.Provider value={separator}>
        <nav
          ref={ref}
          aria-label={ariaLabel}
          data-slot="breadcrumb"
          className={cn("w-full min-w-0", className)}
          {...props}
        />
      </BreadcrumbSeparatorContext.Provider>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

// ---- LIST -------------------------------------------------------------------

export type BreadcrumbListProps = React.ComponentPropsWithoutRef<"ol">;

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  function BreadcrumbList({ className, ...props }, ref) {
    return (
      <ol
        ref={ref}
        data-slot="breadcrumb-list"
        className={cn(
          "m-0 flex w-full max-w-full min-w-0 list-none flex-wrap items-center gap-x-1 gap-y-1 text-sm leading-6 text-muted-foreground",
          "sm:gap-x-1.5",
          className
        )}
        {...props}
      />
    );
  }
);
BreadcrumbList.displayName = "BreadcrumbList";

// ---- ITEM -------------------------------------------------------------------

export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<"li">;

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ className, ...props }, ref) {
    return (
      <li
        ref={ref}
        data-slot="breadcrumb-item"
        className={cn(
          "inline-flex max-w-full min-w-0 items-center gap-1.5",
          className
        )}
        {...props}
      />
    );
  }
);
BreadcrumbItem.displayName = "BreadcrumbItem";

// ---- LINK -------------------------------------------------------------------

export type BreadcrumbLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  /** Pass props to a single child element instead of rendering an anchor. */
  asChild?: boolean;
};

const breadcrumbLinkClassName = [
  "inline-flex max-w-full min-w-0 items-center truncate rounded-md px-1 py-0.5",
  "text-foreground/75 no-underline outline-none",
  "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
  "hover:bg-accent hover:text-accent-foreground",
  "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
  "forced-colors:focus-visible:outline forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-[Highlight]",
].join(" ");

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ className, asChild, ...props }, ref) {
    const classes = cn(breadcrumbLinkClassName, className);

    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          data-slot="breadcrumb-link"
          className={classes}
          {...(props as React.ComponentPropsWithoutRef<typeof Slot>)}
        />
      );
    }

    return (
      <a ref={ref} data-slot="breadcrumb-link" className={classes} {...props} />
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

// ---- PAGE -------------------------------------------------------------------

export type BreadcrumbPageProps = React.ComponentPropsWithoutRef<"span">;

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  function BreadcrumbPage(
    { className, "aria-current": ariaCurrent = "page", ...props },
    ref
  ) {
    return (
      <span
        ref={ref}
        aria-current={ariaCurrent}
        data-slot="breadcrumb-page"
        className={cn(
          "inline-flex max-w-full min-w-0 truncate rounded-md px-1 py-0.5 font-medium text-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
BreadcrumbPage.displayName = "BreadcrumbPage";

// ---- SEPARATOR --------------------------------------------------------------

export type BreadcrumbSeparatorProps = React.ComponentPropsWithoutRef<"li">;

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(function BreadcrumbSeparator({ children, className, ...props }, ref) {
  const inheritedSeparator = React.useContext(BreadcrumbSeparatorContext);

  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center text-muted-foreground/70",
        "[&>svg]:size-3.5 rtl:[&>svg]:rotate-180",
        "forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    >
      {children ?? inheritedSeparator ?? (
        <ChevronRightIcon aria-hidden="true" />
      )}
    </li>
  );
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// ---- ELLIPSIS ---------------------------------------------------------------

export type BreadcrumbEllipsisProps = React.ComponentPropsWithoutRef<"span">;

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(function BreadcrumbEllipsis({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-ellipsis"
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground",
        "forced-colors:text-[CanvasText]",
        className
      )}
      {...props}
    >
      <EllipsisIcon aria-hidden="true" className="size-4" />
      <span className="sr-only">More items</span>
    </span>
  );
});
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
