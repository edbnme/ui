/**
 * =============================================================================
 * POPOVER COMPONENT TESTS
 * =============================================================================
 *
 * Comprehensive test suite for the in-place Popover component.
 *
 * Note: This popover opens in its current position (not below or beside
 * like a dropdown) using layoutId animations.
 *
 * Test Categories:
 * 1. Rendering - Basic render tests for all subcomponents
 * 2. Interactions - Open/close behavior, click outside
 * 3. Keyboard Navigation - Escape to close
 * 4. Accessibility - ARIA attributes
 * 5. Controlled State - External state management
 * 6. Edge Cases - Missing children, rapid interactions
 *
 * Coverage Target: 100% for all metrics
 *
 * @module components/ui/popover/__tests__/popover.test
 * =============================================================================
 */

import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/ui/animated/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverBody,
  PopoverFooter,
  PopoverLabel,
} from "@/components/ui/animated/popover";
import { render, screen, waitFor, pressEscape } from "@/test/utils/test-utils";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Helper to render a complete Popover with common subcomponents
 */
function renderPopover(
  props: {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    asChild?: boolean;
    contentClassName?: string;
  } = {}
) {
  const {
    defaultOpen,
    open,
    onOpenChange,
    asChild = true,
    contentClassName,
  } = props;

  // When asChild=false, don't use Button as children (would cause nested buttons)
  const triggerContent = asChild ? (
    <Button>Open Popover</Button>
  ) : (
    "Open Popover"
  );

  return render(
    <Popover defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild={asChild}>{triggerContent}</PopoverTrigger>
      <PopoverContent className={contentClassName}>
        <div>Popover Title</div>
        <div>Popover Description</div>
        <div>Content goes here</div>
      </PopoverContent>
    </Popover>
  );
}

// =============================================================================
// RENDERING TESTS
// =============================================================================

describe("Popover", () => {
  describe("Rendering", () => {
    it("should render trigger button", () => {
      renderPopover();

      expect(
        screen.getByRole("button", { name: "Open Popover" })
      ).toBeInTheDocument();
    });

    it("should not render content initially", () => {
      renderPopover();

      expect(screen.queryByText("Popover Title")).not.toBeInTheDocument();
    });

    it("should render content when defaultOpen is true", async () => {
      renderPopover({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByText("Popover Title")).toBeInTheDocument();
      });
    });

    it("should render description in content", async () => {
      renderPopover({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByText("Popover Title")).toBeInTheDocument();
        expect(screen.getByText("Popover Description")).toBeInTheDocument();
      });
    });

    it("should render content with dialog role", async () => {
      renderPopover({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should render content with aria-modal", async () => {
      renderPopover({ defaultOpen: true });

      await waitFor(() => {
        const content = screen.getByRole("dialog");
        expect(content).toHaveAttribute("aria-modal", "true");
      });
    });
  });

  // ===========================================================================
  // INTERACTION TESTS
  // ===========================================================================

  describe("Interactions", () => {
    it("should open when trigger is clicked", async () => {
      const { user } = renderPopover();

      await user.click(screen.getByRole("button", { name: "Open Popover" }));

      await waitFor(() => {
        expect(screen.getByText("Popover Title")).toBeInTheDocument();
      });
    });

    it("should close when clicking outside", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <div>
          <Popover defaultOpen onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <Button>Open</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>Title</div>
            </PopoverContent>
          </Popover>
          <div data-testid="outside">Outside Element</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("outside"));

      // Close is triggered (onOpenChange called with false)
      // Note: AnimatePresence may keep content mounted during exit animation
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("should call onOpenChange when opened", async () => {
      const onOpenChange = vi.fn();
      const { user } = renderPopover({ onOpenChange });

      await user.click(screen.getByRole("button", { name: "Open Popover" }));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("should call onOpenChange when closed", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <div>
          <Popover defaultOpen onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <Button>Open</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>Title</div>
            </PopoverContent>
          </Popover>
          <div data-testid="outside">Outside</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("outside"));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  // ===========================================================================
  // KEYBOARD NAVIGATION TESTS
  // ===========================================================================

  describe("Keyboard Navigation", () => {
    it("should close when Escape is pressed", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <Popover defaultOpen onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Popover Title</div>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText("Popover Title")).toBeInTheDocument();
      });

      await pressEscape(user);

      // Close is triggered (onOpenChange called with false)
      // Note: AnimatePresence may keep content mounted during exit animation
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("should not close when non-Escape key is pressed", async () => {
      const { user } = renderPopover({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByText("Popover Title")).toBeInTheDocument();
      });

      // Press a non-Escape key
      await user.keyboard("{Enter}");

      // Popover should still be open
      expect(screen.getByText("Popover Title")).toBeInTheDocument();
    });

    it("should handle focus when opened", async () => {
      const { user } = renderPopover();

      await user.click(screen.getByRole("button", { name: "Open Popover" }));

      await waitFor(() => {
        expect(screen.getByText("Popover Title")).toBeInTheDocument();
      });

      // Content should be rendered and accessible
      expect(screen.getByText("Popover Title")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // ACCESSIBILITY TESTS
  // ===========================================================================

  describe("Accessibility", () => {
    it("should have aria-expanded on trigger when closed", async () => {
      // Need asChild=false for aria-expanded to be on the trigger
      renderPopover({ asChild: false });

      const trigger = screen.getByRole("button", { name: "Open Popover" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("should have aria-expanded on trigger when open", async () => {
      // Need asChild=false for aria-expanded to be on the trigger
      renderPopover({ defaultOpen: true, asChild: false });

      await waitFor(() => {
        const trigger = screen.getByRole("button", { name: "Open Popover" });
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("should have dialog role on content", async () => {
      renderPopover({ defaultOpen: true });

      await waitFor(() => {
        const content = screen.getByRole("dialog");
        expect(content).toBeInTheDocument();
      });
    });

    it("should have aria-modal attribute on content", async () => {
      renderPopover({ defaultOpen: true });

      await waitFor(() => {
        const content = screen.getByRole("dialog");
        expect(content).toHaveAttribute("aria-modal", "true");
      });
    });

    it("should have aria-controls linking trigger to content", async () => {
      // Need asChild=false for aria-controls to be on the trigger
      renderPopover({ defaultOpen: true, asChild: false });

      await waitFor(() => {
        const trigger = screen.getByRole("button", { name: "Open Popover" });
        const content = screen.getByRole("dialog");
        const contentId = content.getAttribute("id");
        expect(trigger).toHaveAttribute("aria-controls", contentId);
      });
    });
  });

  // ===========================================================================
  // CONTROLLED STATE TESTS
  // ===========================================================================

  describe("Controlled State", () => {
    it("should work with controlled open state", async () => {
      render(
        <Popover open={true} onOpenChange={() => {}}>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Controlled</div>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText("Controlled")).toBeInTheDocument();
      });
    });

    it("should not close when controlled and open is always true", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <div>
          <Popover open={true} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <Button>Open</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>Controlled</div>
            </PopoverContent>
          </Popover>
          <div data-testid="outside">Outside</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText("Controlled")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("outside"));

      // onOpenChange called but content stays (controlled)
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.getByText("Controlled")).toBeInTheDocument();
    });

    it("should be closed when controlled open is false", async () => {
      render(
        <Popover open={false} onOpenChange={() => {}}>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Should not show</div>
          </PopoverContent>
        </Popover>
      );

      expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
    });

    it("should not update internal state when controlled and closing via escape", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <div>
          <Popover open={true} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <Button>Open</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>Controlled Content</div>
            </PopoverContent>
          </Popover>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText("Controlled Content")).toBeInTheDocument();
      });

      // Press escape to trigger close()
      await pressEscape(user);

      // onOpenChange should be called but internal state should not update
      expect(onOpenChange).toHaveBeenCalledWith(false);
      // Content still visible because parent controls it
      expect(screen.getByText("Controlled Content")).toBeInTheDocument();
    });

    it("should not update internal state when controlled and trying to open", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <Popover open={false} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Controlled Content</div>
          </PopoverContent>
        </Popover>
      );

      // Click trigger when controlled (open=false)
      await user.click(screen.getByRole("button", { name: "Open" }));

      // onOpenChange should be called but internal state should not update
      expect(onOpenChange).toHaveBeenCalledWith(true);
      // Content still not visible because parent controls it with open={false}
      expect(screen.queryByText("Controlled Content")).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // EDGE CASE TESTS
  // ===========================================================================

  describe("Edge Cases", () => {
    it("should handle rapid open/close", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <div data-testid="outside">
          <Popover onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <Button>Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>Test</PopoverContent>
          </Popover>
        </div>
      );

      const trigger = screen.getByRole("button", { name: "Open Popover" });

      // Open popover
      await user.click(trigger);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });

      // Close by clicking outside
      await user.click(screen.getByTestId("outside"));
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });

      // Open again
      await user.click(trigger);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenLastCalledWith(true);
      });

      // Called multiple times (open, close, open again, potentially close on re-render)
      expect(onOpenChange.mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it("should apply custom className to content", async () => {
      renderPopover({
        defaultOpen: true,
        contentClassName: "custom-popover-class",
      });

      await waitFor(() => {
        const content = screen.getByRole("dialog");
        expect(content).toHaveClass("custom-popover-class");
      });
    });

    it("should render trigger without asChild", async () => {
      render(
        <Popover>
          <PopoverTrigger className="trigger-class">Click me</PopoverTrigger>
          <PopoverContent>
            <div>Content</div>
          </PopoverContent>
        </Popover>
      );

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("should throw error when PopoverTrigger is used outside Popover", () => {
      expect(() => {
        render(
          <PopoverTrigger asChild>
            <Button>Orphan Trigger</Button>
          </PopoverTrigger>
        );
      }).toThrow("PopoverTrigger must be used within <Popover>");
    });

    it("should throw error when PopoverContent is used outside Popover", () => {
      expect(() => {
        render(
          <PopoverContent>
            <div>Orphan Content</div>
          </PopoverContent>
        );
      }).toThrow("PopoverContent must be used within <Popover>");
    });

    it("should apply custom transition", async () => {
      render(
        <Popover defaultOpen transition={{ type: "spring", duration: 0.2 }}>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>With custom transition</div>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText("With custom transition")).toBeInTheDocument();
      });
    });

    it("should apply custom variants", async () => {
      const customVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      };

      render(
        <Popover defaultOpen variants={customVariants}>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>With custom variants</div>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText("With custom variants")).toBeInTheDocument();
      });
    });

    it("should apply className to popover container", async () => {
      render(
        <Popover defaultOpen className="custom-container-class">
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Content</div>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        // The Popover container is the parent of the dialog
        const dialog = screen.getByRole("dialog");
        const popoverContainer = dialog.parentElement;
        expect(popoverContainer).toHaveClass("custom-container-class");
      });
    });

    it("should handle content with interactive elements", async () => {
      const onButtonClick = vi.fn();
      const { user } = render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Button onClick={onButtonClick}>Inner Button</Button>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Inner Button" })
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Inner Button" }));

      expect(onButtonClick).toHaveBeenCalled();
    });

    it("should render as button when asChild is true but children is not a valid element", async () => {
      // When asChild is true but children is a string (not a valid element),
      // it should fall back to rendering as a button
      render(
        <Popover>
          <PopoverTrigger asChild>Plain text trigger</PopoverTrigger>
          <PopoverContent>
            <div>Content</div>
          </PopoverContent>
        </Popover>
      );

      // Should render as button since the child is just text, not a valid React element
      expect(screen.getByText("Plain text trigger")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // SUBCOMPONENT TESTS FOR FULL COVERAGE
  // ===========================================================================

  describe("Subcomponents", () => {
    it("should render PopoverLabel component", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger>
            <PopoverLabel>Label Text</PopoverLabel>
          </PopoverTrigger>
          <PopoverContent>
            <div>Content</div>
          </PopoverContent>
        </Popover>
      );

      expect(screen.getByText("Label Text")).toBeInTheDocument();
    });

    it("should throw error when PopoverLabel is used outside Popover", () => {
      expect(() => {
        render(<PopoverLabel>Label</PopoverLabel>);
      }).toThrow("PopoverLabel must be used within <Popover>");
    });

    it("should render PopoverHeader component", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <div>Header Content</div>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText("Header Content")).toBeInTheDocument();
      });
    });

    it("should render PopoverTitle component", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Title Text</PopoverTitle>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText("Title Text")).toBeInTheDocument();
      });
    });

    it("should throw error when PopoverTitle is used outside Popover", () => {
      expect(() => {
        render(<PopoverTitle>Title</PopoverTitle>);
      }).toThrow("PopoverTitle must be used within <Popover>");
    });

    it("should render PopoverDescription component", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverDescription>Description Text</PopoverDescription>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText("Description Text")).toBeInTheDocument();
      });
    });

    it("should render PopoverBody component", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>Body Content</PopoverBody>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText("Body Content")).toBeInTheDocument();
      });
    });

    it("should render PopoverFooter component", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverFooter>
              <Button>Footer Button</Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Footer Button" })
        ).toBeInTheDocument();
      });
    });

    it("should apply custom className to PopoverHeader", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader className="custom-header">
              <div>Header</div>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        const header = screen.getByText("Header").parentElement;
        expect(header).toHaveClass("custom-header");
      });
    });

    it("should apply custom className to PopoverBody", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody className="custom-body">Body</PopoverBody>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        const body = screen.getByText("Body");
        expect(body).toHaveClass("custom-body");
      });
    });

    it("should apply custom className to PopoverFooter", async () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverFooter className="custom-footer">
              <span>Footer</span>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      );

      await waitFor(() => {
        const footer = screen.getByText("Footer").parentElement;
        expect(footer).toHaveClass("custom-footer");
      });
    });
  });
});
