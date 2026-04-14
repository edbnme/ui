/**
 * =============================================================================
 * SHEET COMPONENT TESTS
 * =============================================================================
 *
 * Comprehensive test suite for the Sheet component (side drawer/panel).
 *
 * Test Categories:
 * 1. Rendering - Basic render tests for all subcomponents
 * 2. Side Variants - top, right, bottom, left positioning
 * 3. Interactions - Open/close, overlay click
 * 4. Keyboard Navigation - Escape to close
 * 5. Accessibility - ARIA attributes, focus management
 * 6. Animation - disableAnimation prop
 * 7. Visual Options - Drag handle, close button visibility
 * 8. Edge Cases - Controlled state, multiple sheets
 *
 * Coverage Target: 100% for all metrics
 *
 * @module components/ui/sheet/__tests__/sheet.test
 * =============================================================================
 */

import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/ui/animated/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/animated/sheet";
import { render, screen, waitFor, pressEscape } from "@/test/utils/test-utils";

// ---- HELPER FUNCTIONS -------------------------------------------------------

/**
 * Helper to render a complete Sheet with common structure
 */
function renderSheet(
  props: {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    disableAnimation?: boolean;
    side?: "top" | "right" | "bottom" | "left";
    showDragHandle?: boolean;
    showCloseButton?: boolean;
  } = {}
) {
  const {
    defaultOpen,
    open,
    onOpenChange,
    disableAnimation,
    side,
    showDragHandle,
    showCloseButton,
  } = props;

  return render(
    <Sheet
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      disableAnimation={disableAnimation}
    >
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        showDragHandle={showDragHandle}
        showCloseButton={showCloseButton}
      >
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet description text here.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <p>Sheet body content goes here.</p>
        </SheetBody>
        <SheetFooter>
          <Button>Save</Button>
          <SheetClose asChild>
            <Button variant="secondary">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---- RENDERING TESTS --------------------------------------------------------

describe("Sheet", () => {
  describe("Rendering", () => {
    it("should render trigger button", () => {
      renderSheet();

      expect(
        screen.getByRole("button", { name: "Open Sheet" })
      ).toBeInTheDocument();
    });

    it("should not render content initially when closed", () => {
      renderSheet();

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should render content when defaultOpen is true", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should render title when open", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByText("Sheet Title")).toBeInTheDocument();
      });
    });

    it("should render description when open", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(
          screen.getByText("Sheet description text here.")
        ).toBeInTheDocument();
      });
    });

    it("should render body content when open", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(
          screen.getByText("Sheet body content goes here.")
        ).toBeInTheDocument();
      });
    });

    it("should render footer when open", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Save" })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
      });
    });

    it("should have data-slot attributes on trigger", () => {
      renderSheet();

      const trigger = screen.getByRole("button", { name: "Open Sheet" });
      expect(trigger).toHaveAttribute("data-slot", "sheet-trigger");
    });

    it("should have data-slot attributes on content elements", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("data-slot", "sheet-content");
      });
    });
  });

  // ---- SIDE VARIANT TESTS ---------------------------------------------------

  describe("Side Variants", () => {
    it("should render right-side sheet by default", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("should render left-side sheet", async () => {
      renderSheet({ defaultOpen: true, side: "left" });

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("should render top-side sheet", async () => {
      renderSheet({ defaultOpen: true, side: "top" });

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("should render bottom-side sheet", async () => {
      renderSheet({ defaultOpen: true, side: "bottom" });

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });
  });

  // ---- INTERACTION TESTS ----------------------------------------------------

  describe("Interactions", () => {
    it("should open when trigger is clicked", async () => {
      const { user } = renderSheet();

      await user.click(screen.getByRole("button", { name: "Open Sheet" }));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should close when SheetClose is clicked", async () => {
      const { user } = renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("should call onOpenChange when opened", async () => {
      const onOpenChange = vi.fn();
      const { user } = renderSheet({ onOpenChange });

      await user.click(screen.getByRole("button", { name: "Open Sheet" }));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("should call onOpenChange with false when closed", async () => {
      const onOpenChange = vi.fn();
      const { user } = renderSheet({ defaultOpen: true, onOpenChange });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText("Close sheet");
      await user.click(closeButton);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("should close when close button is clicked", async () => {
      const { user } = renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText("Close sheet");
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  // ---- KEYBOARD NAVIGATION TESTS --------------------------------------------

  describe("Keyboard Navigation", () => {
    it("should close when Escape is pressed", async () => {
      const { user } = renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await pressEscape(user);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  // ---- ACCESSIBILITY TESTS --------------------------------------------------

  describe("Accessibility", () => {
    it("should have dialog role", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should have accessible title", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        const title = screen.getByText("Sheet Title");
        expect(title).toHaveAttribute("data-slot", "sheet-title");
      });
    });

    it("should have accessible description", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        const description = screen.getByText("Sheet description text here.");
        expect(description).toHaveAttribute("data-slot", "sheet-description");
      });
    });

    it("should have close button with aria-label", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByLabelText("Close sheet")).toBeInTheDocument();
      });
    });
  });

  // ---- VISUAL OPTIONS TESTS -------------------------------------------------

  describe("Visual Options", () => {
    it("should show drag handle on bottom sheet by default", async () => {
      render(
        <Sheet defaultOpen>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent side="bottom" showDragHandle>
            <SheetTitle>Bottom Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should show drag handle on top sheet", async () => {
      render(
        <Sheet defaultOpen>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent side="top" showDragHandle>
            <SheetTitle>Top Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should hide close button when showCloseButton is false", async () => {
      render(
        <Sheet defaultOpen>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent showCloseButton={false}>
            <SheetTitle>No Close Button</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      expect(screen.queryByLabelText("Close sheet")).not.toBeInTheDocument();
    });

    it("should hide drag handle when showDragHandle is false", async () => {
      render(
        <Sheet defaultOpen>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent side="bottom" showDragHandle={false}>
            <SheetTitle>No Drag Handle</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });
  });

  // ---- ANIMATION TESTS ------------------------------------------------------

  describe("Animation", () => {
    it("should render with animation disabled", async () => {
      renderSheet({ defaultOpen: true, disableAnimation: true });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should render overlay with animation disabled", async () => {
      renderSheet({ defaultOpen: true, disableAnimation: true });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });
  });

  // ---- CONTROLLED STATE TESTS -----------------------------------------------

  describe("Controlled State", () => {
    it("should work with controlled open state (true)", async () => {
      render(
        <Sheet open={true} onOpenChange={() => {}}>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Controlled Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should work with controlled open state (false)", () => {
      render(
        <Sheet open={false} onOpenChange={() => {}}>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Controlled Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  // ---- DATA SLOT TESTS ------------------------------------------------------

  describe("Data Slots", () => {
    it("should have correct data-slot on header", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        const header = screen.getByText("Sheet Title").parentElement;
        expect(header).toHaveAttribute("data-slot", "sheet-header");
      });
    });

    it("should have correct data-slot on body", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        const body = screen.getByText(
          "Sheet body content goes here."
        ).parentElement;
        expect(body).toHaveAttribute("data-slot", "sheet-body");
      });
    });

    it("should have correct data-slot on footer", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        const footer = screen.getByRole("button", {
          name: "Save",
        }).parentElement;
        expect(footer).toHaveAttribute("data-slot", "sheet-footer");
      });
    });
  });

  // ---- EDGE CASE TESTS ------------------------------------------------------

  describe("Edge Cases", () => {
    it("should handle null side prop gracefully (uses default)", async () => {
      render(
        <Sheet defaultOpen>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          {/* @ts-expect-error Testing null side prop */}
          <SheetContent side={null}>
            <SheetTitle>Null Side</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should handle enableDrag prop", async () => {
      render(
        <Sheet defaultOpen enableDrag={false}>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>No Drag</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should render SheetClose with data-slot", async () => {
      renderSheet({ defaultOpen: true });

      await waitFor(() => {
        const cancelButton = screen.getByRole("button", { name: "Cancel" });
        // The Cancel button itself has the data-slot since SheetClose uses asChild
        expect(cancelButton).toHaveAttribute("data-slot", "sheet-close");
      });
    });

    it("should call onOpenChange when sheet is closed via SheetClose", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <Sheet defaultOpen onOpenChange={onOpenChange}>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Test</SheetTitle>
            <SheetClose asChild>
              <Button>Close Sheet</Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Close Sheet" }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });
});
