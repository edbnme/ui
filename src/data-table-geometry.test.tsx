import * as React from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DataTable,
  DataTableResizeHandle,
} from "@/components/ui/tables/data-table";
import { fireEvent, render, screen } from "./__tests__/utils/test-utils";

afterEach(() => {
  vi.restoreAllMocks();
});

type Project = {
  id: string;
  name: string;
  email: string;
  team: string;
  budget: number;
  region: string;
};

const projects: Project[] = [
  {
    id: "one",
    name: "A very long project name that must not resize its column",
    email: "ada@example.com",
    team: "Platform",
    budget: 120,
    region: "North",
  },
  {
    id: "two",
    name: "Beacon",
    email: "bea@example.com",
    team: "Design",
    budget: 240,
    region: "South",
  },
  {
    id: "three",
    name: "Canopy",
    email: "cam@example.com",
    team: "Research",
    budget: 360,
    region: "East",
  },
  {
    id: "four",
    name: "Drift",
    email: "dan@example.com",
    team: "Platform",
    budget: 480,
    region: "West",
  },
  {
    id: "five",
    name: "Ember",
    email: "eli@example.com",
    team: "Design",
    budget: 600,
    region: "North",
  },
];

const projectColumnHelper = createColumnHelper<Project>();
const projectColumns = [
  projectColumnHelper.group({
    id: "identity",
    header: "Identity",
    columns: [
      projectColumnHelper.accessor("name", {
        header: "Name",
        size: 100,
      }),
      projectColumnHelper.accessor("email", {
        header: "Email",
        size: 120,
      }),
    ],
  }),
  projectColumnHelper.accessor("team", {
    header: "Team",
    size: 140,
  }),
  projectColumnHelper.group({
    id: "finance",
    header: "Finance",
    columns: [
      projectColumnHelper.accessor("budget", {
        header: "Budget",
        size: 90,
      }),
      projectColumnHelper.accessor("region", {
        header: "Region",
        size: 80,
      }),
    ],
  }),
];

function GeometryHarness() {
  const table = useReactTable({
    data: projects.slice(0, 1),
    columns: projectColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    initialState: {
      columnPinning: {
        left: ["name", "email"],
        right: ["budget", "region"],
      },
    },
  });

  return (
    <>
      <button onClick={() => table.getColumn("name")?.toggleVisibility(false)}>
        Hide name
      </button>
      <button
        onClick={() => table.getColumn("region")?.toggleVisibility(false)}
      >
        Hide region
      </button>
      <DataTable aria-label="Geometry" table={table} />
    </>
  );
}

describe("DataTable geometry", () => {
  it("keeps TanStack sizes exact for grouped and multiply pinned columns", () => {
    render(<GeometryHarness />);

    const table = screen.getByRole("table", {
      name: "Geometry",
    }) as HTMLTableElement;
    expect(table).toHaveStyle({
      tableLayout: "fixed",
      width: "530px",
      minWidth: "530px",
      maxWidth: "530px",
    });
    expect(table.style.getPropertyValue("--data-table-column-0-size")).toBe(
      "100px"
    );
    expect(table.style.getPropertyValue("--data-table-column-4-size")).toBe(
      "80px"
    );
    expect(table.querySelectorAll("colgroup col")).toHaveLength(5);
    expect(
      table.querySelector<HTMLElement>('col[data-column-id="email"]')
    ).toHaveStyle({ width: "var(--data-table-column-1-size, 120px)" });

    const body = table.tBodies[0];
    const name = body.querySelector<HTMLElement>('[data-column-id="name"]');
    const email = body.querySelector<HTMLElement>('[data-column-id="email"]');
    const budget = body.querySelector<HTMLElement>('[data-column-id="budget"]');
    const region = body.querySelector<HTMLElement>('[data-column-id="region"]');

    expect(name).toHaveStyle({
      insetInlineStart: "0px",
      minWidth: "var(--data-table-column-0-size, 100px)",
      maxWidth: "var(--data-table-column-0-size, 100px)",
      position: "sticky",
    });
    expect(email).toHaveStyle({ insetInlineStart: "100px" });
    expect(budget).toHaveStyle({ insetInlineEnd: "80px" });
    expect(region).toHaveStyle({ insetInlineEnd: "0px" });

    const identity = screen.getByRole("columnheader", { name: "Identity" });
    const finance = screen.getByRole("columnheader", { name: "Finance" });
    expect(identity).toHaveAttribute("scope", "colgroup");
    expect(identity).toHaveAttribute("data-pinned", "left");
    expect(identity).toHaveStyle({
      insetInlineStart: "0px",
      width: "220px",
      minWidth: "220px",
      maxWidth: "220px",
    });
    expect(finance).toHaveAttribute("data-pinned", "right");
    expect(finance).toHaveStyle({
      insetInlineEnd: "0px",
      width: "170px",
    });

    const leafName = screen.getByRole("columnheader", { name: "Name" });
    expect(identity).toHaveStyle({ top: "0px" });
    expect(leafName).toHaveStyle({ top: "40px" });
  });

  it("recomputes sticky offsets and group widths after visibility changes", () => {
    render(<GeometryHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Hide name" }));
    fireEvent.click(screen.getByRole("button", { name: "Hide region" }));

    const table = screen.getByRole("table", {
      name: "Geometry",
    }) as HTMLTableElement;
    const body = table.tBodies[0];
    const email = body.querySelector<HTMLElement>('[data-column-id="email"]');
    const budget = body.querySelector<HTMLElement>('[data-column-id="budget"]');

    expect(table).toHaveStyle({ width: "350px", minWidth: "350px" });
    expect(
      body.querySelector('[data-column-id="name"]')
    ).not.toBeInTheDocument();
    expect(
      body.querySelector('[data-column-id="region"]')
    ).not.toBeInTheDocument();
    expect(email).toHaveStyle({ insetInlineStart: "0px" });
    expect(budget).toHaveStyle({ insetInlineEnd: "0px" });
    expect(screen.getByRole("columnheader", { name: "Identity" })).toHaveStyle({
      width: "120px",
    });
    expect(screen.getByRole("columnheader", { name: "Finance" })).toHaveStyle({
      width: "90px",
    });
  });
});

function RowPinningHarness() {
  const table = useReactTable({
    data: projects,
    columns: projectColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    initialState: {
      rowPinning: {
        top: ["one", "two"],
        bottom: ["four", "five"],
      },
    },
  });

  return <DataTable aria-label="Pinned rows" density="compact" table={table} />;
}

describe("DataTable row pinning", () => {
  it("stacks top and bottom pinned rows around sticky grouped headers", () => {
    render(<RowPinningHarness />);

    const table = screen.getByRole("table", {
      name: "Pinned rows",
    }) as HTMLTableElement;
    expect(table).toHaveAttribute("data-density", "compact");
    expect(table.style.getPropertyValue("--data-table-header-row-height")).toBe(
      "32px"
    );
    expect(table.style.getPropertyValue("--data-table-row-height")).toBe(
      "32px"
    );

    const topRows = table.querySelectorAll<HTMLTableRowElement>(
      'tbody tr[data-pinned="top"]'
    );
    const bottomRows = table.querySelectorAll<HTMLTableRowElement>(
      'tbody tr[data-pinned="bottom"]'
    );
    expect(topRows).toHaveLength(2);
    expect(bottomRows).toHaveLength(2);

    expect(
      topRows[0].style.getPropertyValue("--data-table-row-pin-offset")
    ).toBe("64px");
    expect(
      topRows[1].style.getPropertyValue("--data-table-row-pin-offset")
    ).toBe("96px");
    expect(topRows[0].cells[0]).toHaveStyle({
      position: "sticky",
      top: "64px",
    });
    expect(topRows[1].cells[0]).toHaveStyle({ top: "96px" });

    expect(bottomRows[0].cells[0]).toHaveStyle({ bottom: "32px" });
    expect(bottomRows[1].cells[0]).toHaveStyle({ bottom: "0px" });
    expect(bottomRows[0].cells[0]).toHaveStyle({ position: "sticky" });

    expect(screen.getByRole("columnheader", { name: "Identity" })).toHaveStyle({
      top: "0px",
      position: "sticky",
    });
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveStyle({
      top: "32px",
      position: "sticky",
    });
    expect(
      screen.getByRole("table", { name: "Pinned rows" })
    ).toBeInTheDocument();
  });

  it("measures richer pinned rows instead of assuming uniform heights", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function getBoundingClientRect(this: HTMLElement) {
        let height = 0;
        if (this.tagName === "TR" && this.parentElement?.tagName === "THEAD") {
          height = this.parentElement.children[0] === this ? 36 : 40;
        } else if (this.tagName === "TR") {
          const text = this.textContent ?? "";
          if (text.includes(projects[0].name)) height = 70;
          else if (text.includes(projects[1].name)) height = 52;
          else if (text.includes(projects[3].name)) height = 64;
          else if (text.includes(projects[4].name)) height = 48;
        }

        return {
          bottom: height,
          height,
          left: 0,
          right: 0,
          toJSON: () => ({}),
          top: 0,
          width: 0,
          x: 0,
          y: 0,
        } as DOMRect;
      }
    );

    render(<RowPinningHarness />);

    const table = screen.getByRole("table", {
      name: "Pinned rows",
    }) as HTMLTableElement;
    const topRows = table.querySelectorAll<HTMLTableRowElement>(
      'tbody tr[data-pinned="top"]'
    );
    const bottomRows = table.querySelectorAll<HTMLTableRowElement>(
      'tbody tr[data-pinned="bottom"]'
    );

    expect(topRows[0].cells[0]).toHaveStyle({ top: "76px" });
    expect(topRows[1].cells[0]).toHaveStyle({ top: "146px" });
    expect(bottomRows[0].cells[0]).toHaveStyle({ bottom: "48px" });
    expect(bottomRows[1].cells[0]).toHaveStyle({ bottom: "0px" });
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveStyle({
      top: "36px",
    });
  });
});

type Person = { id: string; name: string };

const people: Person[] = [{ id: "one", name: "Ada" }];
const personColumnHelper = createColumnHelper<Person>();

function LiveResizeHarness({ onCellRender }: { onCellRender: () => void }) {
  const columns = React.useMemo(
    () => [
      personColumnHelper.accessor("name", {
        header: ({ table, header }) => (
          <DataTableResizeHandle table={table} header={header} />
        ),
        cell: ({ getValue }) => {
          onCellRender();
          return getValue();
        },
        size: 150,
      }),
    ],
    [onCellRender]
  );
  const table = useReactTable({
    data: people,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable aria-label="Live resize" table={table} />;
}

describe("DataTable live resizing", () => {
  it("updates width variables while keeping the expensive body frozen", () => {
    const onCellRender = vi.fn();
    render(<LiveResizeHarness onCellRender={onCellRender} />);

    const handle = screen.getByRole("separator");
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.assign(handle, {
      setPointerCapture,
      hasPointerCapture: () => true,
      releasePointerCapture,
    });
    const initialRenderCount = onCellRender.mock.calls.length;

    expect(handle).toHaveAttribute("aria-valuemax", "1000");
    expect(handle).toHaveClass("w-6", "-end-3");

    fireEvent.pointerDown(handle, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      clientX: 100,
    });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 124 });

    const table = screen.getByRole("table", {
      name: "Live resize",
    }) as HTMLTableElement;
    expect(table).toHaveAttribute("data-resizing");
    expect(table.style.getPropertyValue("--data-table-column-0-size")).toBe(
      "174px"
    );
    expect(onCellRender).toHaveBeenCalledTimes(initialRenderCount);

    fireEvent.pointerUp(handle, { pointerId: 1, clientX: 124 });
    expect(releasePointerCapture).toHaveBeenCalledWith(1);
    expect(table).not.toHaveAttribute("data-resizing");
    expect(onCellRender.mock.calls.length).toBeGreaterThan(initialRenderCount);
  });

  it("reports an explicit finite maximum to assistive technology", () => {
    function FiniteResizeHarness() {
      const finiteColumns = React.useMemo(
        () => [
          personColumnHelper.accessor("name", {
            header: ({ table, header }) => (
              <DataTableResizeHandle table={table} header={header} />
            ),
            maxSize: 320,
          }),
        ],
        []
      );
      const table = useReactTable({
        data: people,
        columns: finiteColumns,
        getCoreRowModel: getCoreRowModel(),
      });
      return <DataTable aria-label="Finite resize" table={table} />;
    }

    render(<FiniteResizeHarness />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-valuemax",
      "320"
    );
  });
});
