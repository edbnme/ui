/**
 * IME-safe global or column search control for DataTable.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.3.0
 * @registryPartOf data-table
 */

"use client";

import * as React from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import type { Column, Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

type DataTableSearchTarget<TData, TValue> =
  | { table: Table<TData>; column?: never }
  | { column: Column<TData, TValue>; table?: never };

export type DataTableSearchProps<TData, TValue = unknown> = Omit<
  React.ComponentPropsWithRef<"input">,
  "defaultValue" | "onChange" | "size" | "value"
> &
  DataTableSearchTarget<TData, TValue> & {
    /** Controlled text value. */
    value?: string;
    /** Initial text when uncontrolled. */
    defaultValue?: string;
    /** Called when committed text changes. */
    onValueChange?: (value: string) => void;
    /** Delay before publishing text to the TanStack filter state. @default 0 */
    debounceMs?: number;
    /** Accessible input name. @default "Search table" */
    label?: string;
    /** Hide the clear button even when text is present. */
    hideClearButton?: boolean;
  };

function DataTableSearchImpl<TData, TValue = unknown>(
  {
    table,
    column,
    value,
    defaultValue,
    onValueChange,
    debounceMs = 0,
    label = column ? `Search ${column.id}` : "Search table",
    hideClearButton = false,
    className,
    placeholder = "Search…",
    onCompositionStart,
    onCompositionEnd,
    ...props
  }: Omit<DataTableSearchProps<TData, TValue>, "ref">,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const target = column ?? table;
  const isControlled = value !== undefined;
  const targetValue = column
    ? column.getFilterValue()
    : table?.getState().globalFilter;
  const externalValue = String((isControlled ? value : targetValue) ?? "");
  const initialValueRef = React.useRef(
    String(value ?? targetValue ?? defaultValue ?? "")
  );
  const initializeDefaultRef = React.useRef(
    !isControlled && defaultValue !== undefined && targetValue == null
  );
  const [draftValue, setDraftValue] = React.useState(initialValueRef.current);
  const syncedTargetRef = React.useRef(target);
  const syncedExternalValueRef = React.useRef(externalValue);
  const syncedControlledRef = React.useRef(isControlled);
  const targetRef = React.useRef(target);
  const externalValueRef = React.useRef(externalValue);
  const controlledRef = React.useRef(isControlled);
  const composingRef = React.useRef(false);
  const compositionCommitRef = React.useRef<string | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const safeDebounceMs =
    Number.isFinite(debounceMs) && debounceMs > 0 ? debounceMs : 0;
  const hasExternalChange =
    syncedTargetRef.current !== target ||
    syncedExternalValueRef.current !== externalValue ||
    syncedControlledRef.current !== isControlled;
  const inputValue = hasExternalChange ? externalValue : draftValue;

  targetRef.current = target;
  externalValueRef.current = externalValue;
  controlledRef.current = isControlled;

  const cancelPendingCommit = React.useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  React.useEffect(
    () => () => {
      cancelPendingCommit();
    },
    [cancelPendingCommit, safeDebounceMs]
  );

  React.useEffect(() => {
    const targetChanged = syncedTargetRef.current !== target;
    const externalValueChanged =
      syncedExternalValueRef.current !== externalValue;
    const controlledModeChanged = syncedControlledRef.current !== isControlled;

    syncedTargetRef.current = target;
    syncedExternalValueRef.current = externalValue;
    syncedControlledRef.current = isControlled;

    if (!targetChanged && !externalValueChanged && !controlledModeChanged) {
      return;
    }

    cancelPendingCommit();
    composingRef.current = false;
    if (
      targetChanged ||
      controlledModeChanged ||
      compositionCommitRef.current !== externalValue
    ) {
      compositionCommitRef.current = null;
    }
    setDraftValue(externalValue);
  }, [cancelPendingCommit, externalValue, isControlled, target]);

  const publish = React.useCallback(
    (nextValue: string, immediate = false) => {
      cancelPendingCommit();
      const scheduledTarget = target;

      const commit = () => {
        timerRef.current = null;
        if (targetRef.current !== scheduledTarget) return;

        if (column) column.setFilterValue(nextValue || undefined);
        else table?.setGlobalFilter(nextValue);
        onValueChange?.(nextValue);

        // Keep typing responsive during the debounce, then honor the source of
        // truth when a controlled owner rejects or defers the requested value.
        if (controlledRef.current) {
          setDraftValue(externalValueRef.current);
        }
      };

      if (immediate || safeDebounceMs === 0) commit();
      else timerRef.current = setTimeout(commit, safeDebounceMs);
    },
    [cancelPendingCommit, column, onValueChange, safeDebounceMs, table, target]
  );

  React.useEffect(() => {
    if (!initializeDefaultRef.current) return;
    initializeDefaultRef.current = false;
    publish(initialValueRef.current, true);
  }, [publish]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;

    if (!composingRef.current && compositionCommitRef.current === nextValue) {
      compositionCommitRef.current = null;
      return;
    }

    compositionCommitRef.current = null;
    setDraftValue(nextValue);
    if (!composingRef.current) {
      publish(nextValue);
    }
  };

  const clear = () => {
    setDraftValue("");
    publish("", true);
  };

  return (
    <div
      data-slot="data-table-search"
      className="relative min-w-48 flex-1 sm:max-w-sm"
    >
      <MagnifyingGlass
        aria-hidden
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        weight="bold"
      />
      <input
        ref={ref}
        type="search"
        aria-label={label}
        autoComplete="off"
        value={inputValue}
        placeholder={placeholder}
        className={cn(
          "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent py-1 pe-9 ps-9 text-sm shadow-sm",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "[&::-webkit-search-cancel-button]:hidden",
          className
        )}
        {...props}
        onChange={handleChange}
        onCompositionStart={(event) => {
          cancelPendingCommit();
          composingRef.current = true;
          compositionCommitRef.current = null;
          onCompositionStart?.(event);
        }}
        onCompositionEnd={(event) => {
          composingRef.current = false;
          const nextValue = event.currentTarget.value;
          compositionCommitRef.current = nextValue;
          setDraftValue(nextValue);
          publish(nextValue);
          onCompositionEnd?.(event);
        }}
      />
      {!hideClearButton && inputValue ? (
        <button
          type="button"
          aria-label={`Clear ${label.toLowerCase()}`}
          disabled={props.disabled || props.readOnly}
          className={cn(
            "absolute end-1.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
          onClick={clear}
        >
          <X aria-hidden className="size-3.5" weight="bold" />
        </button>
      ) : null}
    </div>
  );
}

type DataTableSearchComponent = {
  <TData, TValue = unknown>(
    props: DataTableSearchProps<TData, TValue>
  ): React.ReactElement | null;
  displayName?: string;
};

const DataTableSearch = React.forwardRef(
  DataTableSearchImpl
) as DataTableSearchComponent;
DataTableSearch.displayName = "DataTableSearch";

export { DataTableSearch };
