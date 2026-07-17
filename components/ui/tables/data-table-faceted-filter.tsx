/**
 * Typed multi- or single-select faceted filter for a DataTable column.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @registryPartOf data-table
 */

"use client";

import * as React from "react";
import {
  Check,
  MagnifyingGlass,
  SlidersHorizontal,
  X,
} from "@phosphor-icons/react";
import type { Column } from "@tanstack/react-table";
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DataTableFilterOption } from "./data-table-types";

export interface DataTableFacetedFilterProps<TData, TValue> extends Omit<
  React.ComponentPropsWithRef<"button">,
  "children" | "onChange" | "title" | "value"
> {
  column: Column<TData, TValue>;
  title: string;
  options: readonly DataTableFilterOption<TValue>[];
  /** Store an array of values when true, or one value when false. @default true */
  multiple?: boolean;
  /** Show local option search. Defaults to true for more than seven options. */
  searchable?: boolean;
  /** Maximum option rows rendered after local filtering. @default 100 */
  maxVisibleOptions?: number;
  /** Message shown when no options match local search. */
  emptyContent?: React.ReactNode;
}

function DataTableFacetedFilterImpl<TData, TValue>(
  {
    column,
    title,
    options,
    multiple = true,
    searchable = options.length > 7,
    maxVisibleOptions = 100,
    emptyContent = "No options found.",
    className,
    disabled,
    ...triggerProps
  }: Omit<DataTableFacetedFilterProps<TData, TValue>, "ref">,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const radioGroupName = React.useId();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const rawValue = column.getFilterValue();
  const selectedValues = new Set<TValue>(
    Array.isArray(rawValue)
      ? (rawValue as TValue[])
      : rawValue == null
        ? []
        : [rawValue as TValue]
  );
  const selectedCount = selectedValues.size;
  const facetedCounts = column.getFacetedUniqueValues();
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const safeMaxVisibleOptions = Number.isFinite(maxVisibleOptions)
    ? Math.max(1, Math.floor(maxVisibleOptions))
    : 100;
  const visibleOptions = options
    .filter((option) => {
      if (!normalizedQuery) return true;
      const optionText =
        option.searchText ??
        (typeof option.label === "string"
          ? option.label
          : String(option.value));
      return optionText.toLocaleLowerCase().includes(normalizedQuery);
    })
    .slice(0, safeMaxVisibleOptions);

  const updateOption = (option: DataTableFilterOption<TValue>) => {
    if (option.disabled) return;

    if (!multiple) {
      column.setFilterValue(option.value);
      setOpen(false);
      return;
    }

    const nextValues = new Set(selectedValues);
    if (nextValues.has(option.value)) nextValues.delete(option.value);
    else nextValues.add(option.value);
    column.setFilterValue(nextValues.size ? Array.from(nextValues) : undefined);
  };

  const clear = () => {
    column.setFilterValue(undefined);
    setQuery("");
  };

  return (
    <PopoverRoot
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setQuery("");
      }}
    >
      <PopoverTrigger
        ref={ref}
        type="button"
        aria-label={`Filter by ${title}`}
        disabled={disabled || !column.getCanFilter()}
        data-slot="data-table-faceted-filter-trigger"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-md border border-dashed border-border bg-background px-3 text-sm font-medium shadow-xs",
          "hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...triggerProps}
      >
        <SlidersHorizontal aria-hidden className="size-3.5" weight="bold" />
        <span className="max-w-36 truncate">{title}</span>
        {selectedCount > 0 ? (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">
            {selectedCount}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner sideOffset={6} align="start">
          <PopoverPopup className="w-64 p-1.5">
            <PopoverTitle className="sr-only">Filter by {title}</PopoverTitle>
            {searchable ? (
              <div className="relative mb-1">
                <MagnifyingGlass
                  aria-hidden
                  className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  weight="bold"
                />
                <input
                  type="search"
                  aria-label={`Search ${title} options`}
                  autoComplete="off"
                  value={query}
                  placeholder="Search options…"
                  className={cn(
                    "h-8 w-full rounded-md border border-input bg-transparent pe-8 ps-8 text-sm outline-none",
                    "placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring",
                    "[&::-webkit-search-cancel-button]:hidden"
                  )}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear option search"
                    className="absolute end-1 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                    onClick={() => setQuery("")}
                  >
                    <X aria-hidden className="size-3" weight="bold" />
                  </button>
                ) : null}
              </div>
            ) : null}
            <div
              role={multiple ? "group" : "radiogroup"}
              aria-label={`${title} filter options`}
              className="max-h-72 overflow-y-auto overscroll-contain"
            >
              {visibleOptions.length ? (
                visibleOptions.map((option, index) => {
                  const selected = selectedValues.has(option.value);
                  const count = option.count ?? facetedCounts.get(option.value);
                  const OptionIcon = option.icon;
                  const optionContent = (
                    <>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center border border-border",
                          multiple ? "rounded-sm" : "rounded-full",
                          selected &&
                            "border-primary bg-primary text-primary-foreground"
                        )}
                      >
                        {selected ? (
                          <Check
                            aria-hidden
                            className="size-3"
                            weight="bold"
                          />
                        ) : null}
                      </span>
                      {OptionIcon ? (
                        <OptionIcon
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground"
                        />
                      ) : null}
                      <span className="min-w-0 flex-1 truncate">
                        {option.label}
                      </span>
                      {typeof count === "number" ? (
                        <span className="ms-auto text-xs tabular-nums text-muted-foreground">
                          {count.toLocaleString()}
                        </span>
                      ) : null}
                    </>
                  );

                  if (!multiple) {
                    return (
                      <label
                        key={`${String(option.value)}-${index}`}
                        className={cn(
                          "flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-start text-sm outline-none",
                          "hover:bg-muted has-[:focus-visible]:bg-muted has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring",
                          "has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50"
                        )}
                      >
                        <input
                          type="radio"
                          name={radioGroupName}
                          value={String(index)}
                          checked={selected}
                          disabled={option.disabled}
                          className="sr-only"
                          onChange={() => updateOption(option)}
                        />
                        {optionContent}
                      </label>
                    );
                  }

                  return (
                    <button
                      key={`${String(option.value)}-${index}`}
                      type="button"
                      role="checkbox"
                      aria-checked={selected}
                      disabled={option.disabled}
                      className={cn(
                        "flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-start text-sm outline-none",
                        "hover:bg-muted focus-visible:bg-muted focus-visible:ring-1 focus-visible:ring-ring",
                        "disabled:pointer-events-none disabled:opacity-50"
                      )}
                      onClick={() => updateOption(option)}
                    >
                      {optionContent}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {emptyContent}
                </div>
              )}
            </div>
            {selectedCount > 0 ? (
              <div className="mt-1 border-t border-border pt-1">
                <button
                  type="button"
                  className="flex h-8 w-full items-center justify-center rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  onClick={clear}
                >
                  Clear filter
                </button>
              </div>
            ) : null}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </PopoverRoot>
  );
}

type DataTableFacetedFilterComponent = {
  <TData, TValue>(
    props: DataTableFacetedFilterProps<TData, TValue>
  ): React.ReactElement | null;
  displayName?: string;
};

const DataTableFacetedFilter = React.forwardRef(
  DataTableFacetedFilterImpl
) as DataTableFacetedFilterComponent;
DataTableFacetedFilter.displayName = "DataTableFacetedFilter";

export { DataTableFacetedFilter };
