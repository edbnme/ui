import * as React from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Table } from "@/components/ui/table";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  DataTableResizeHandle,
  DataTableSearch,
  DataTableToolbar,
  DataTableViewOptions,
} from "@/components/ui/tables/data-table";
import { act, fireEvent, render, screen } from "./__tests__/utils/test-utils";

type Person = { id: string; name: string };

const columnHelper = createColumnHelper<Person>();
const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ getValue }) => getValue(),
  }),
];
const people: Person[] = [{ id: "one", name: "Ada" }];

function TableHarness({
  status = "ready",
  data = people,
  renderDetails = false,
  loadingRowCount,
}: {
  status?: "ready" | "loading" | "error";
  data?: Person[];
  renderDetails?: boolean;
  loadingRowCount?: number;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: () => renderDetails,
    getRowId: (row) => row.id,
    initialState: renderDetails ? { expanded: { one: true } } : undefined,
  });

  return (
    <DataTable
      aria-label="People"
      table={table}
      status={status}
      loadingRowCount={loadingRowCount}
      renderSubComponent={
        renderDetails
          ? ({ row }) => <button>{row.original.name} details</button>
          : undefined
      }
    />
  );
}

function ColumnStateHarness({ hidden = false }: { hidden?: boolean }) {
  const table = useReactTable({
    data: people,
    columns: hidden ? columns : [],
    getCoreRowModel: getCoreRowModel(),
    initialState: hidden ? { columnVisibility: { name: false } } : undefined,
  });
  return <DataTable aria-label="Column state" table={table} />;
}

describe("DataTable", () => {
  it("keeps native table semantics and renders expanded detail rows", () => {
    render(<TableHarness renderDetails />);

    const table = screen.getByRole("table", { name: "People" });
    expect(table).toBeInTheDocument();
    expect(table.parentElement).toHaveClass(
      "overflow-auto",
      "rounded-none",
      "border-0",
      "bg-transparent",
      "shadow-none"
    );
    expect(table.parentElement).not.toHaveClass(
      "rounded-lg",
      "border",
      "bg-background",
      "shadow-sm"
    );
    expect(
      screen.getByRole("columnheader", { name: "Name" })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Ada" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ada details" })
    ).toBeInTheDocument();
  });

  it("presents loading, error, and empty states inside a stable table", () => {
    const { rerender } = render(<TableHarness status="loading" />);
    expect(screen.getByRole("table", { name: "People" })).toHaveAttribute(
      "aria-busy",
      "true"
    );

    rerender(<TableHarness status="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");

    rerender(<TableHarness data={[]} />);
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("forwards ref, classes, styles, and events to the scroll container", () => {
    const wrapperRef = React.createRef<HTMLDivElement>();
    const tableRef = React.createRef<HTMLTableElement>();
    const onScroll = vi.fn();
    render(
      <Table
        ref={tableRef}
        containerProps={{
          ref: wrapperRef,
          className: "custom-wrapper",
          style: { maxHeight: 200 },
          onScroll,
        }}
      />
    );

    expect(wrapperRef.current).toHaveClass("custom-wrapper");
    expect(tableRef.current?.tagName).toBe("TABLE");
    expect(wrapperRef.current).toHaveStyle({ maxHeight: "200px" });
    fireEvent.scroll(wrapperRef.current!);
    expect(onScroll).toHaveBeenCalledOnce();
  });

  it("distinguishes missing columns from an all-hidden column set", () => {
    const { rerender } = render(<ColumnStateHarness />);
    expect(screen.getByText("No columns are configured.")).toBeInTheDocument();

    rerender(<ColumnStateHarness key="hidden" hidden />);
    expect(screen.getByText("All columns are hidden.")).toBeInTheDocument();
  });

  it("uses a safe loading row count for non-finite input", () => {
    render(<TableHarness status="loading" loadingRowCount={Infinity} />);
    expect(
      document.querySelectorAll('[data-slot="data-table-skeleton"]')
    ).toHaveLength(5);
  });

  it("preserves ordinary cell renderers on hierarchical parent rows", () => {
    type TreePerson = Person & { subRows?: TreePerson[] };
    const treeColumnHelper = createColumnHelper<TreePerson>();
    const hierarchicalColumns = [
      treeColumnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => <button>Select {row.original.name}</button>,
        aggregatedCell: () => "Aggregated name",
      }),
    ];
    const hierarchicalData = [
      {
        id: "parent",
        name: "Parent",
        subRows: [{ id: "child", name: "Child" }],
      },
    ];

    function HierarchyHarness() {
      const table = useReactTable({
        data: hierarchicalData,
        columns: hierarchicalColumns,
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
      });
      return <DataTable aria-label="Hierarchy" table={table} />;
    }

    render(<HierarchyHarness />);
    expect(
      screen.getByRole("button", { name: "Select Parent" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Aggregated name")).not.toBeInTheDocument();
  });

  it("uses aggregated renderers for actual grouped rows", () => {
    type GroupedValue = { category: string; amount: number };
    const groupedColumns = [
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        aggregationFn: "sum" as const,
        cell: ({ getValue }: { getValue: () => unknown }) => String(getValue()),
        aggregatedCell: ({ getValue }: { getValue: () => unknown }) =>
          `Total ${String(getValue())}`,
      },
    ];

    function GroupedHarness() {
      const table = useReactTable<GroupedValue>({
        data: [
          { category: "A", amount: 2 },
          { category: "A", amount: 3 },
        ],
        columns: groupedColumns,
        initialState: { grouping: ["category"] },
        autoResetPageIndex: false,
        getCoreRowModel: getCoreRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
      });
      return <DataTable aria-label="Grouped" table={table} />;
    }

    render(<GroupedHarness />);
    expect(screen.getByText("Total 5")).toBeInTheDocument();
  });

  it("exposes aria-sort only on the primary sort and labels every priority", () => {
    const sortableColumns = [
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" showSortIndex />
        ),
      }),
      columnHelper.accessor("id", {
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Identifier"
            showSortIndex
          />
        ),
      }),
    ];

    function MultiSortHarness() {
      const table = useReactTable({
        data: people,
        columns: sortableColumns,
        initialState: {
          sorting: [
            { id: "name", desc: false },
            { id: "id", desc: true },
          ],
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
      });
      return <DataTable aria-label="Sorted people" table={table} />;
    }

    render(<MultiSortHarness />);
    const primarySort = screen.getByRole("button", {
      name: /Name: sorted ascending, priority 1;/,
    });
    const secondarySort = screen.getByRole("button", {
      name: /Identifier: sorted descending, priority 2;/,
    });

    expect(primarySort.closest("th")).toHaveAttribute("aria-sort", "ascending");
    expect(secondarySort.closest("th")).not.toHaveAttribute("aria-sort");
  });
});

describe("DataTableSearch", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function SearchHarness({
    onValueChange,
    value = "",
    debounceMs = 200,
  }: {
    onValueChange: (value: string) => void;
    value?: string;
    debounceMs?: number;
  }) {
    const table = useReactTable({
      data: people,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataTableSearch
        table={table}
        value={value}
        debounceMs={debounceMs}
        onValueChange={onValueChange}
      />
    );
  }

  it("keeps controlled typing responsive and commits after the debounce", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<SearchHarness onValueChange={onValueChange} />);
    const input = screen.getByRole("searchbox", { name: "Search table" });

    fireEvent.change(input, { target: { value: "Ada" } });
    expect(input).toHaveValue("Ada");
    expect(onValueChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));
    expect(onValueChange).toHaveBeenCalledWith("Ada");
  });

  it("returns to the controlled value when an update is rejected", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<SearchHarness value="kept" onValueChange={onValueChange} />);
    const input = screen.getByRole("searchbox", { name: "Search table" });

    fireEvent.change(input, { target: { value: "rejected" } });
    expect(input).toHaveValue("rejected");

    act(() => vi.advanceTimersByTime(200));
    expect(onValueChange).toHaveBeenCalledWith("rejected");
    expect(input).toHaveValue("kept");
  });

  it("keeps an accepted controlled update after the debounce", () => {
    vi.useFakeTimers();

    function AcceptedValueHarness() {
      const [searchValue, setSearchValue] = React.useState("kept");
      const table = useReactTable({
        data: people,
        columns,
        getCoreRowModel: getCoreRowModel(),
      });
      return (
        <DataTableSearch
          table={table}
          value={searchValue}
          debounceMs={200}
          onValueChange={setSearchValue}
        />
      );
    }

    render(<AcceptedValueHarness />);
    const input = screen.getByRole("searchbox", { name: "Search table" });
    fireEvent.change(input, { target: { value: "accepted" } });

    act(() => vi.advanceTimersByTime(200));
    expect(input).toHaveValue("accepted");
  });

  it("does not publish intermediate IME composition values", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<SearchHarness onValueChange={onValueChange} />);
    const input = screen.getByRole("searchbox", { name: "Search table" });

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "あ" } });
    act(() => vi.advanceTimersByTime(400));
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.compositionEnd(input);
    act(() => vi.advanceTimersByTime(200));
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith("あ");
  });

  it("deduplicates the final composition input without a debounce", () => {
    const onValueChange = vi.fn();
    render(<SearchHarness debounceMs={0} onValueChange={onValueChange} />);
    const input = screen.getByRole("searchbox", { name: "Search table" });

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "あ" } });
    fireEvent.compositionEnd(input);
    fireEvent.change(input, { target: { value: "あ" } });

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith("あ");
  });

  it("deduplicates the final composition input when uncontrolled", () => {
    const onValueChange = vi.fn();

    function UncontrolledCompositionHarness() {
      const table = useReactTable({
        data: people,
        columns,
        getCoreRowModel: getCoreRowModel(),
      });
      return (
        <DataTableSearch
          table={table}
          debounceMs={0}
          onValueChange={onValueChange}
        />
      );
    }

    render(<UncontrolledCompositionHarness />);
    const input = screen.getByRole("searchbox", { name: "Search table" });

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "あ" } });
    fireEvent.compositionEnd(input);
    fireEvent.change(input, { target: { value: "あ" } });

    expect(onValueChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith("あ");
  });

  it("cancels a pending commit when the controlled value is replaced", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SearchHarness value="" onValueChange={onValueChange} />
    );
    const input = screen.getByRole("searchbox", { name: "Search table" });

    fireEvent.change(input, { target: { value: "stale" } });
    rerender(<SearchHarness value="reset" onValueChange={onValueChange} />);
    expect(input).toHaveValue("reset");

    act(() => vi.advanceTimersByTime(200));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("publishes an uncontrolled default value on mount", () => {
    const onValueChange = vi.fn();

    function DefaultValueHarness() {
      const table = useReactTable({
        data: people,
        columns,
        getCoreRowModel: getCoreRowModel(),
      });
      return (
        <DataTableSearch
          table={table}
          defaultValue="Ada"
          onValueChange={onValueChange}
        />
      );
    }

    render(<DefaultValueHarness />);
    expect(screen.getByRole("searchbox", { name: "Search table" })).toHaveValue(
      "Ada"
    );
    expect(onValueChange).toHaveBeenCalledWith("Ada");
  });

  it("synchronizes and cancels pending work when the global filter resets", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();

    function GlobalResetHarness() {
      const table = useReactTable({
        data: people,
        columns,
        initialState: { globalFilter: "Ada" },
        getCoreRowModel: getCoreRowModel(),
      });
      return (
        <>
          <DataTableSearch
            table={table}
            debounceMs={200}
            onValueChange={onValueChange}
          />
          <button onClick={() => table.resetGlobalFilter(true)}>
            Reset global
          </button>
        </>
      );
    }

    render(<GlobalResetHarness />);
    const input = screen.getByRole("searchbox", { name: "Search table" });
    fireEvent.change(input, { target: { value: "pending" } });
    fireEvent.click(screen.getByRole("button", { name: "Reset global" }));

    expect(input).toHaveValue("");
    act(() => vi.advanceTimersByTime(200));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("synchronizes when a column filter is reset externally", () => {
    function ColumnResetHarness() {
      const table = useReactTable({
        data: people,
        columns,
        initialState: {
          columnFilters: [{ id: "name", value: "Ada" }],
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
      });
      const column = table.getColumn("name")!;
      return (
        <>
          <DataTableSearch column={column} />
          <button onClick={() => column.setFilterValue(undefined)}>
            Reset name
          </button>
        </>
      );
    }

    render(<ColumnResetHarness />);
    const input = screen.getByRole("searchbox", { name: "Search name" });
    expect(input).toHaveValue("Ada");

    fireEvent.click(screen.getByRole("button", { name: "Reset name" }));
    expect(input).toHaveValue("");
  });

  it("adopts a replacement target and drops its previous pending commit", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();

    function TargetReplacementHarness() {
      const [useSecondTable, setUseSecondTable] = React.useState(false);
      const firstTable = useReactTable({
        data: people,
        columns,
        initialState: { globalFilter: "First" },
        getCoreRowModel: getCoreRowModel(),
      });
      const secondTable = useReactTable({
        data: people,
        columns,
        initialState: { globalFilter: "Second" },
        getCoreRowModel: getCoreRowModel(),
      });
      return (
        <>
          <DataTableSearch
            table={useSecondTable ? secondTable : firstTable}
            debounceMs={200}
            onValueChange={onValueChange}
          />
          <button onClick={() => setUseSecondTable(true)}>Use second</button>
        </>
      );
    }

    render(<TargetReplacementHarness />);
    const input = screen.getByRole("searchbox", { name: "Search table" });
    expect(input).toHaveValue("First");

    fireEvent.change(input, { target: { value: "pending" } });
    fireEvent.click(screen.getByRole("button", { name: "Use second" }));
    expect(input).toHaveValue("Second");

    act(() => vi.advanceTimersByTime(200));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("disables the clear action with a disabled search field", () => {
    function DisabledHarness() {
      const table = useReactTable({
        data: people,
        columns,
        initialState: { globalFilter: "Ada" },
        getCoreRowModel: getCoreRowModel(),
      });
      return <DataTableSearch table={table} disabled />;
    }

    render(<DisabledHarness />);
    expect(
      screen.getByRole("button", { name: "Clear search table" })
    ).toBeDisabled();
  });
});

describe("DataTableToolbar", () => {
  it("accepts server result and off-page selection count overrides", () => {
    function ToolbarHarness() {
      const table = useReactTable({
        data: people,
        columns,
        getCoreRowModel: getCoreRowModel(),
      });
      return (
        <DataTableToolbar table={table} resultCount={128} selectedCount={7} />
      );
    }

    render(<ToolbarHarness />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "7 selected · 128 results"
    );
  });
});

describe("DataTableViewOptions", () => {
  it("turns machine column ids into readable fallback labels", () => {
    const machineIdColumns = [
      columnHelper.accessor((person) => person.name, {
        id: "accountStatus",
        header: () => <span>Status</span>,
      }),
    ];

    function ViewOptionsHarness() {
      const table = useReactTable({
        data: people,
        columns: machineIdColumns,
        getCoreRowModel: getCoreRowModel(),
      });
      return <DataTableViewOptions table={table} />;
    }

    render(<ViewOptionsHarness />);
    fireEvent.click(screen.getByRole("button", { name: "Columns" }));

    expect(screen.getByText("Account Status")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Toggle Account Status column" })
    ).toBeInTheDocument();
  });
});

describe("DataTableFacetedFilter", () => {
  it("uses native radio semantics and only clears through the clear action", () => {
    function FacetHarness() {
      const table = useReactTable({
        data: people,
        columns,
        initialState: {
          columnFilters: [{ id: "name", value: "Ada" }],
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
      });
      const column = table.getColumn("name")!;
      return (
        <>
          <DataTableFacetedFilter
            column={column}
            title="Name"
            multiple={false}
            searchable={false}
            options={[
              { label: "Ada", value: "Ada" },
              { label: "Grace", value: "Grace" },
            ]}
          />
          <output aria-label="Current filter">
            {String(column.getFilterValue() ?? "none")}
          </output>
        </>
      );
    }

    render(<FacetHarness />);
    fireEvent.click(screen.getByRole("button", { name: "Filter by Name" }));

    const ada = screen.getByRole("radio", { name: /Ada/ });
    const grace = screen.getByRole("radio", { name: /Grace/ });
    expect(ada).toHaveAttribute("type", "radio");
    expect(ada).toBeChecked();
    expect(grace).toHaveAttribute("name", ada.getAttribute("name"));

    fireEvent.click(ada);
    expect(
      screen.getByRole("status", { name: "Current filter" })
    ).toHaveTextContent("Ada");
    expect(
      screen.getByRole("button", { name: "Clear filter" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filter" }));
    expect(
      screen.getByRole("status", { name: "Current filter" })
    ).toHaveTextContent("none");
  });
});

describe("DataTableResizeHandle", () => {
  function ResizeHarness({ direction }: { direction: "ltr" | "rtl" }) {
    const table = useReactTable({
      data: people,
      columns,
      columnResizeDirection: direction,
      getCoreRowModel: getCoreRowModel(),
    });
    const header = table.getFlatHeaders()[0];
    return (
      <>
        <DataTableResizeHandle table={table} header={header} />
        <output>{Math.round(header.getSize())}</output>
      </>
    );
  }

  it("reverses keyboard resize direction in RTL", () => {
    const { rerender } = render(<ResizeHarness direction="ltr" />);
    const ltrHandle = screen.getByRole("separator");
    const initialLtrSize = Number(screen.getByRole("status").textContent);
    fireEvent.keyDown(ltrHandle, { key: "ArrowRight" });
    expect(Number(screen.getByRole("status").textContent)).toBeGreaterThan(
      initialLtrSize
    );

    rerender(<ResizeHarness direction="rtl" />);
    const rtlHandle = screen.getByRole("separator");
    const initialRtlSize = Number(screen.getByRole("status").textContent);
    fireEvent.keyDown(rtlHandle, { key: "ArrowRight" });
    expect(Number(screen.getByRole("status").textContent)).toBeLessThan(
      initialRtlSize
    );
  });

  it("captures the pointer and commits a drag resize", () => {
    render(<ResizeHarness direction="ltr" />);
    const handle = screen.getByRole("separator");
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.assign(handle, {
      setPointerCapture,
      hasPointerCapture: () => true,
      releasePointerCapture,
    });
    const initialSize = Number(screen.getByRole("status").textContent);

    fireEvent.pointerDown(handle, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientX: 100,
    });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 124 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientX: 124 });

    expect(setPointerCapture).toHaveBeenCalledWith(1);
    expect(releasePointerCapture).toHaveBeenCalledWith(1);
    expect(Number(screen.getByRole("status").textContent)).toBeGreaterThan(
      initialSize
    );
  });
});
