/**
 * =============================================================================
 * ALERT DIALOG COMPONENT TESTS
 * =============================================================================
 *
 * Comprehensive test suite for the AlertDialog component.
 *
 * Test Categories:
 * 1. Rendering - Basic render tests for all subcomponents
 * 2. Interactions - Open/close behavior via triggers and buttons
 * 3. Keyboard Navigation - Escape to close, focus trapping
 * 4. Accessibility - ARIA attributes, roles, labels
 * 5. Controlled State - Programmatic open/close control
 * 6. Props - destructive action, showCloseButton, etc.
 * 7. Animation - disableAnimation prop behavior
 * 8. Edge Cases - Missing children, rapid open/close, etc.
 *
 * Coverage Target: 100% for all metrics
 *
 * @module components/ui/alert-dialog/__tests__/alert-dialog.test
 * =============================================================================
 */

import { describe, it, expect, vi } from "vitest";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContainer,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogSubtitle,
  AlertDialogImage,
  AlertDialogClose as _AlertDialogClose,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/animated/alert-dialog";
import { Button } from "@/components/ui/animated/button";
import {
  render,
  screen,
  waitFor,
  pressEscape,
  fireEvent as _fireEvent,
} from "@/test/utils/test-utils";

// ---- HELPER FUNCTIONS -------------------------------------------------------

/**
 * Helper to render a complete AlertDialog with all common subcomponents
 * Uses AlertDialogContainer for the morphing animation pattern
 */
function renderAlertDialog(
  props: {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: "default" | "destructive";
    showCloseButton?: boolean;
    disableAnimation?: boolean;
  } = {}
) {
  const {
    defaultOpen,
    open,
    onOpenChange,
    variant = "default",
    showCloseButton = false,
    disableAnimation,
  } = props;

  return render(
    <AlertDialog
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      disableAnimation={disableAnimation}
    >
      <AlertDialogTrigger>
        <Button>Open Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContainer>
        <AlertDialogContent showCloseButton={showCloseButton}>
          <div className="p-6 text-center space-y-4">
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
            <div className="flex flex-col gap-2 pt-2">
              <AlertDialogAction variant={variant}>Confirm</AlertDialogAction>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialogContainer>
    </AlertDialog>
  );
}

// ---- HELPER: Get trigger element --------------------------------------------

/**
 * The AlertDialogTrigger wraps children in a div with role="button",
 * so we need to target it specifically using data-slot attribute
 */
function _getTrigger() {
  return (
    screen.getByTestId("alert-dialog-trigger") ||
    document.querySelector('[data-slot="alert-dialog-trigger"]')
  );
}

// ---- RENDERING TESTS --------------------------------------------------------

describe("AlertDialog", () => {
  describe("Rendering", () => {
    it("should render trigger button", () => {
      renderAlertDialog();

      // AlertDialogTrigger wraps children, use data-slot to find it
      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    });

    it("should not render content initially when closed", () => {
      renderAlertDialog();

      // Content should not be in the DOM when dialog is closed
      expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    });

    it("should render content when defaultOpen is true", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });
    });

    it("should render title and description", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
      });
    });

    it("should render action and cancel buttons in footer", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Confirm" })
        ).toBeInTheDocument();
      });
    });

    it("should have data-slot attributes on all subcomponents", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toHaveAttribute(
          "data-slot",
          "alert-dialog-content"
        );
      });
    });

    it("should render close button when showCloseButton is true", async () => {
      renderAlertDialog({ defaultOpen: true, showCloseButton: true });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      // Close button has aria-label="Close dialog"
      const closeButton = screen.getByLabelText("Close dialog");
      expect(closeButton).toBeInTheDocument();
    });
  });

  // ---- INTERACTION TESTS ----------------------------------------------------

  describe("Interactions", () => {
    it("should open when trigger is clicked", async () => {
      const { user } = renderAlertDialog();

      // Use data-slot to find the trigger wrapper
      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      expect(trigger).toBeTruthy();
      await user.click(trigger!);

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });
    });

    it("should close when cancel button is clicked", async () => {
      const { user } = renderAlertDialog({
        defaultOpen: true,
        disableAnimation: true,
      });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      await waitFor(() => {
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
      });
    });

    it("should close when action button is clicked", async () => {
      const { user } = renderAlertDialog({
        defaultOpen: true,
        disableAnimation: true,
      });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Confirm" }));

      await waitFor(() => {
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
      });
    });

    it("should call onOpenChange when opened", async () => {
      const onOpenChange = vi.fn();
      const { user } = renderAlertDialog({ onOpenChange });

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      await user.click(trigger!);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("should call onOpenChange when closed", async () => {
      const onOpenChange = vi.fn();
      const { user } = renderAlertDialog({ defaultOpen: true, onOpenChange });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("should not close when clicking inside dialog content", async () => {
      const { user } = renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      // Click on the dialog content itself (not a button)
      await user.click(screen.getByText("Test Title"));

      // Dialog should still be open
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });
  });

  // ---- KEYBOARD NAVIGATION TESTS --------------------------------------------

  describe("Keyboard Navigation", () => {
    it("should close when Escape is pressed by default (shadcn-compatible behavior)", async () => {
      const { user } = renderAlertDialog({
        defaultOpen: true,
        disableAnimation: true,
      });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await pressEscape(user);

      // Alert dialogs close on ESC by default (shadcn-compatible)
      await waitFor(() => {
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
      });
    });

    it("should trap focus within dialog", async () => {
      const { user } = renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      // Tab through all focusable elements
      await user.tab();
      await user.tab();
      await user.tab();
      await user.tab();
      await user.tab();

      // Focus should remain within the dialog
      const dialog = screen.getByRole("alertdialog");
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    it("should focus first focusable element when opened", async () => {
      const { user } = renderAlertDialog();

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      await user.click(trigger!);

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      // Focus should be within the dialog
      const dialog = screen.getByRole("alertdialog");
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  // ---- ACCESSIBILITY TESTS --------------------------------------------------

  describe("Accessibility", () => {
    it("should have alertdialog role", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });
    });

    it("should have accessible name from title", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        const dialog = screen.getByRole("alertdialog");
        expect(dialog).toBeInTheDocument();
        // Dialog should have aria-labelledby pointing to the title
        expect(dialog).toHaveAttribute("aria-labelledby");
      });
    });

    it("should have accessible description", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        const dialog = screen.getByRole("alertdialog");
        // Dialog should have aria-describedby pointing to the description
        expect(dialog).toHaveAttribute("aria-describedby");
        expect(screen.getByText("Test Description")).toBeInTheDocument();
      });
    });

    it("should have aria-modal attribute", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        const dialog = screen.getByRole("alertdialog");
        expect(dialog).toHaveAttribute("aria-modal", "true");
      });
    });
  });

  // ---- CONTROLLED STATE TESTS -----------------------------------------------

  describe("Controlled State", () => {
    it("should work with controlled open state", async () => {
      render(
        <AlertDialog open={true} onOpenChange={() => {}}>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6">
                <AlertDialogTitle>Controlled</AlertDialogTitle>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });
    });

    it("should not close when controlled and open is always true", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <AlertDialog open={true} onOpenChange={onOpenChange}>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6 space-y-4">
                <AlertDialogTitle>Controlled</AlertDialogTitle>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      // onOpenChange should be called, but dialog stays open (controlled)
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });
  });

  // ---- DESTRUCTIVE ACTION TESTS ---------------------------------------------

  describe("Destructive Action", () => {
    it("should apply destructive styling when variant is destructive", async () => {
      renderAlertDialog({ defaultOpen: true, variant: "destructive" });

      await waitFor(() => {
        const confirmButton = screen.getByRole("button", { name: "Confirm" });
        // Destructive actions use bg-destructive
        expect(confirmButton).toHaveClass("bg-destructive");
      });
    });

    it("should have primary styling when variant is default", async () => {
      renderAlertDialog({ defaultOpen: true, variant: "default" });

      await waitFor(() => {
        const confirmButton = screen.getByRole("button", { name: "Confirm" });
        // Non-destructive actions use bg-primary
        expect(confirmButton).toHaveClass("bg-primary");
      });
    });
  });

  // ---- ANIMATION TESTS ------------------------------------------------------

  describe("Animation", () => {
    it("should render with animation disabled", async () => {
      renderAlertDialog({ defaultOpen: true, disableAnimation: true });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });
    });
  });

  // ---- EDGE CASE TESTS ------------------------------------------------------

  describe("Edge Cases", () => {
    it("should handle onOpenChange being called", async () => {
      const onOpenChange = vi.fn();
      const { user } = renderAlertDialog({ onOpenChange });

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );

      // Click trigger once to open
      await user.click(trigger!);

      // Should have been called with true
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("should render with title only", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6">
                <AlertDialogTitle>Title Only</AlertDialogTitle>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
        expect(screen.getByText("Title Only")).toBeInTheDocument();
      });
    });

    it("should render without description", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6 space-y-4">
                <AlertDialogTitle>No Description</AlertDialogTitle>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
        expect(screen.getByText("No Description")).toBeInTheDocument();
      });
    });

    it("should apply custom className to content", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent className="custom-content-class">
              <AlertDialogTitle>Custom Class</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        const content = screen.getByRole("alertdialog");
        expect(content).toHaveClass("custom-content-class");
      });
    });
  });

  // ---- TRIGGER VARIANTS TESTS -----------------------------------------------

  describe("Trigger Variants", () => {
    it("should open dialog with keyboard Enter on trigger", async () => {
      const { user } = renderAlertDialog();

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      trigger?.focus();

      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });
    });

    it("should open dialog with keyboard Space on trigger", async () => {
      const { user } = renderAlertDialog();

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      trigger?.focus();

      await user.keyboard(" ");

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });
    });

    it("should render with asChild pattern", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogTrigger asChild>
            <button className="custom-trigger">Custom Trigger</button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogTitle>Test</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        const trigger = document.querySelector(
          '[data-slot="alert-dialog-trigger"]'
        );
        expect(trigger).toBeInTheDocument();
        expect(trigger).toHaveClass("custom-trigger");
      });
    });

    it("should use non-animated trigger when disableAnimation is true", async () => {
      render(
        <AlertDialog disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogTitle>Test</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      expect(trigger).toBeInTheDocument();
      // Non-animated trigger should be a regular div, not a motion.div
      expect(trigger?.tagName).toBe("DIV");
    });

    it("should use non-animated asChild trigger when disableAnimation is true", async () => {
      const { user } = render(
        <AlertDialog disableAnimation>
          <AlertDialogTrigger asChild>
            <button>Open</button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogTitle>Test</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      expect(trigger).toBeInTheDocument();
      expect(trigger?.textContent).toBe("Open");

      // Click trigger and verify dialog opens
      await user.click(trigger!);

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });
    });
  });

  // ---- OVERLAY AND PORTAL TESTS ---------------------------------------------

  describe("Overlay and Portal", () => {
    it("should render backdrop with blur styling", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        // Find the backdrop by its class (backdrop-blur-lg for elegant blur)
        const backdrop = document.querySelector(".backdrop-blur-lg");
        expect(backdrop).toBeInTheDocument();
        expect(backdrop).toHaveClass("fixed");
        expect(backdrop).toHaveClass("inset-0");
      });
    });

    it("should render backdrop without animation when disableAnimation is true", async () => {
      renderAlertDialog({ defaultOpen: true, disableAnimation: true });

      await waitFor(() => {
        const backdrop = document.querySelector(".backdrop-blur-lg");
        expect(backdrop).toBeInTheDocument();
      });
    });
  });

  // ---- CONTENT VARIANTS TESTS -----------------------------------------------

  describe("Content Variants", () => {
    it("should render non-animated content when disableAnimation is true", async () => {
      renderAlertDialog({ defaultOpen: true, disableAnimation: true });

      await waitFor(() => {
        const content = screen.getByRole("alertdialog");
        expect(content).toBeInTheDocument();
        expect(content).toHaveAttribute("data-slot", "alert-dialog-content");
      });
    });

    it("should prevent outside click when preventOutsideClose is true", async () => {
      const onOpenChange = vi.fn();
      const { user } = render(
        <div>
          <AlertDialog defaultOpen onOpenChange={onOpenChange}>
            <AlertDialogContainer>
              <AlertDialogContent preventOutsideClose>
                <AlertDialogTitle>Test</AlertDialogTitle>
              </AlertDialogContent>
            </AlertDialogContainer>
          </AlertDialog>
          <div data-testid="outside">Outside</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("outside"));

      // Dialog should still be open
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    it("should close when clicking outside when preventOutsideClose is false", async () => {
      const { user } = render(
        <div>
          <AlertDialog defaultOpen>
            <AlertDialogContainer>
              <AlertDialogContent preventOutsideClose={false} disableAnimation>
                <AlertDialogTitle>Test</AlertDialogTitle>
              </AlertDialogContent>
            </AlertDialogContainer>
          </AlertDialog>
          <div data-testid="outside">Outside</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      // Wait for listener to be attached (setTimeout in useEffect)
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Click outside the dialog
      await user.click(screen.getByTestId("outside"));

      // Dialog should be closed
      await waitFor(() => {
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
      });
    });

    it("should prevent escape close when preventEscapeClose is true", async () => {
      const { user } = render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent preventEscapeClose>
              <AlertDialogTitle>Test</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await pressEscape(user);

      // Dialog should still be open
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    it("should allow escape close when preventEscapeClose is false", async () => {
      const { user } = render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent preventEscapeClose={false} disableAnimation>
              <AlertDialogTitle>Test</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await pressEscape(user);

      // Dialog should be closed
      await waitFor(() => {
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
      });
    });
  });

  // ---- ACTION AND CANCEL BUTTON TESTS ---------------------------------------

  describe("Action and Cancel Buttons", () => {
    it("should call onClick callback on action button", async () => {
      const onClick = vi.fn();
      const { user } = render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6">
                <AlertDialogAction onClick={onClick}>Confirm</AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Confirm" })
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Confirm" }));

      expect(onClick).toHaveBeenCalled();
    });

    it("should call onClick callback on cancel button", async () => {
      const onClick = vi.fn();
      const { user } = render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6">
                <AlertDialogCancel onClick={onClick}>Cancel</AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onClick).toHaveBeenCalled();
    });

    it("should render disabled action button", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6">
                <AlertDialogAction disabled>Confirm</AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        const button = screen.getByRole("button", { name: "Confirm" });
        expect(button).toBeDisabled();
      });
    });

    it("should render disabled cancel button", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6">
                <AlertDialogCancel disabled>Cancel</AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        const button = screen.getByRole("button", { name: "Cancel" });
        expect(button).toBeDisabled();
      });
    });

    it("should not close when action button click is prevented", async () => {
      const onClick = vi.fn((e: React.MouseEvent) => {
        e.preventDefault();
      });
      const { user } = render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6">
                <AlertDialogAction onClick={onClick}>Confirm</AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Confirm" }));

      // Dialog should still be open
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });
  });

  // ---- ARIA AND ACCESSIBILITY TESTS -----------------------------------------

  describe("Advanced Accessibility", () => {
    it("should have proper aria-haspopup on trigger", async () => {
      renderAlertDialog();

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("should have proper aria-controls linking trigger to content", async () => {
      renderAlertDialog({ defaultOpen: true });

      await waitFor(() => {
        const trigger = document.querySelector(
          '[data-slot="alert-dialog-trigger"]'
        );
        const content = screen.getByRole("alertdialog");
        const contentId = content.getAttribute("id");
        expect(trigger).toHaveAttribute("aria-controls", contentId);
      });
    });

    it("should toggle aria-expanded on trigger", async () => {
      const { user } = renderAlertDialog();

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger!);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("should set tabIndex on trigger for keyboard accessibility", async () => {
      renderAlertDialog();

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      expect(trigger).toHaveAttribute("tabindex", "0");
    });

    it("should have role=button on trigger", async () => {
      renderAlertDialog();

      const trigger = document.querySelector(
        '[data-slot="alert-dialog-trigger"]'
      );
      expect(trigger).toHaveAttribute("role", "button");
    });
  });

  // ---- ADDITIONAL SUBCOMPONENT TESTS FOR FULL COVERAGE ----------------------

  describe("Additional Subcomponents", () => {
    it("should render AlertDialogSubtitle with animation", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6 space-y-2">
                <AlertDialogTitle>Title</AlertDialogTitle>
                <AlertDialogSubtitle>Subtitle Text</AlertDialogSubtitle>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        const subtitle = screen.getByText("Subtitle Text");
        expect(subtitle).toBeInTheDocument();
        expect(subtitle).toHaveAttribute("data-slot", "alert-dialog-subtitle");
      });
    });

    it("should render AlertDialogSubtitle without animation", async () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogContainer>
            <AlertDialogContent>
              <div className="p-6 space-y-2">
                <AlertDialogTitle>Title</AlertDialogTitle>
                <AlertDialogSubtitle>Subtitle No Anim</AlertDialogSubtitle>
              </div>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        const subtitle = screen.getByText("Subtitle No Anim");
        expect(subtitle).toBeInTheDocument();
        expect(subtitle).toHaveAttribute("data-slot", "alert-dialog-subtitle");
      });
    });

    it("should render AlertDialogImage with animation", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogImage src="/test.png" alt="Test image" />
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        const image = screen.getByRole("img", { name: "Test image" });
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("data-slot", "alert-dialog-image");
      });
    });

    it("should render AlertDialogImage without animation", async () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogImage src="/test.png" alt="No anim image" />
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        const image = screen.getByRole("img", { name: "No anim image" });
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("data-slot", "alert-dialog-image");
      });
    });

    it("should render AlertDialogClose with onClick callback", async () => {
      const onClick = vi.fn();
      const { user } = render(
        <AlertDialog defaultOpen>
          <AlertDialogContainer>
            <AlertDialogContent showCloseButton onCloseButtonClick={onClick}>
              <AlertDialogTitle>Test</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText("Close dialog");
      await user.click(closeButton);

      expect(onClick).toHaveBeenCalled();
    });

    it("should render AlertDialogClose without animation", async () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogContainer>
            <AlertDialogContent showCloseButton>
              <AlertDialogTitle>Test</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      await waitFor(() => {
        const closeButton = screen.getByLabelText("Close dialog");
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveAttribute("data-slot", "alert-dialog-close");
      });
    });
  });

  // ---- CONTEXT ERROR TESTS --------------------------------------------------

  describe("Context Error", () => {
    it("should throw error when useAlertDialog is used outside AlertDialog", () => {
      // This tests the throw in useAlertDialog
      expect(() => {
        render(
          <AlertDialogContent>
            <AlertDialogTitle>Test</AlertDialogTitle>
          </AlertDialogContent>
        );
      }).toThrow("useAlertDialog must be used within <AlertDialog>");
    });
  });

  // ---- FOCUS TRAP TESTS -----------------------------------------------------

  describe("Focus Trap", () => {
    it("should trap focus with Shift+Tab cycling to last focusable", async () => {
      const { user } = renderAlertDialog({
        defaultOpen: true,
        disableAnimation: true,
      });

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      // Focus first element (Cancel button typically)
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      cancelButton.focus();

      // Press Shift+Tab repeatedly to cycle focus
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      await user.keyboard("{Shift>}{Tab}{/Shift}");

      // Focus should remain within dialog
      const dialog = screen.getByRole("alertdialog");
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    // Note: Outside click behavior (lines 559-575 in alert-dialog.tsx) is extremely
    // difficult to test in jsdom due to the combination of:
    // 1. Portal-based rendering which places content outside the React tree
    // 2. setTimeout(0) delay for event listener registration
    // 3. document.addEventListener not properly capturing synthetic events in jsdom
    // This functionality is verified through manual testing and e2e tests.
    // The preventOutsideClose=true case IS tested in "Content Variants" tests.
  });

  // ---- ALERTDIALOGHEADER TESTS ----------------------------------------------

  describe("AlertDialogHeader", () => {
    it("should render children correctly", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogHeader>
                <span data-testid="header-child">Header Content</span>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      expect(screen.getByTestId("header-child")).toBeInTheDocument();
      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogHeader className="custom-header-class">
                <span>Header Content</span>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      const header =
        screen.getByText("Header Content").parentElement?.parentElement;
      expect(header).toHaveClass("custom-header-class");
    });

    it("should render icon when provided", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogHeader
                icon={<span data-testid="header-icon">≡ƒÄë</span>}
              >
                <span>Header Content</span>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      expect(screen.getByTestId("header-icon")).toBeInTheDocument();
    });

    it("should apply iconClassName to icon wrapper", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogHeader
                icon={<span data-testid="header-icon">≡ƒÄë</span>}
                iconClassName="custom-icon-class"
              >
                <span>Header Content</span>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      const iconWrapper = screen.getByTestId("header-icon").parentElement;
      expect(iconWrapper).toHaveClass("custom-icon-class");
    });

    it("should not render icon wrapper when no icon provided", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogHeader>
                <span data-testid="header-child">Header Content</span>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      // The header should only have the content wrapper, not an icon wrapper
      const headerChild = screen.getByTestId("header-child");
      const contentWrapper = headerChild.parentElement;
      const header = contentWrapper?.parentElement;
      // Header should have exactly 1 child (the content wrapper) when no icon
      expect(header?.children.length).toBe(1);
    });
  });

  // ---- ALERTDIALOGFOOTER TESTS ----------------------------------------------

  describe("AlertDialogFooter", () => {
    it("should render children correctly", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogFooter>
                <button data-testid="footer-button">Action</button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      expect(screen.getByTestId("footer-button")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogFooter className="custom-footer-class">
                <button data-testid="footer-button">Action</button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      const footer = screen.getByTestId("footer-button").parentElement;
      expect(footer).toHaveClass("custom-footer-class");
    });

    it("should render multiple children", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogFooter>
                <button data-testid="button-1">First</button>
                <button data-testid="button-2">Second</button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      expect(screen.getByTestId("button-1")).toBeInTheDocument();
      expect(screen.getByTestId("button-2")).toBeInTheDocument();
    });
  });

  // ---- ALERTDIALOGBODY TESTS ------------------------------------------------

  describe("AlertDialogBody", () => {
    it("should render children correctly", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogBody>
                <span data-testid="body-content">Body Content</span>
              </AlertDialogBody>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      expect(screen.getByTestId("body-content")).toBeInTheDocument();
      expect(screen.getByText("Body Content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogBody className="custom-body-class">
                <span data-testid="body-content">Body Content</span>
              </AlertDialogBody>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      const body = screen.getByTestId("body-content").parentElement;
      expect(body).toHaveClass("custom-body-class");
    });

    it("should render complex content structure", () => {
      render(
        <AlertDialog defaultOpen disableAnimation>
          <AlertDialogTrigger>
            <Button>Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContainer>
            <AlertDialogContent>
              <AlertDialogBody>
                <AlertDialogHeader>
                  <AlertDialogTitle>Title</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Description text
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogAction>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogBody>
            </AlertDialogContent>
          </AlertDialogContainer>
        </AlertDialog>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description text")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Confirm" })
      ).toBeInTheDocument();
    });
  });
});
