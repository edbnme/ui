/**
 * Tests for SlideToUnlock component (oss/components/ui/animated/slide-to-unlock.tsx)
 *
 * Compound component with provider context:
 * SlideToUnlock (root), SlideToUnlockTrack, SlideToUnlockText, SlideToUnlockHandle
 *
 * Uses motion/react for drag gestures  in JSDOM, motion.div renders as a regular div.
 * We test structure, styling, context provision, and error boundaries.
 *
 * @see oss/components/ui/animated/slide-to-unlock.tsx
 */

import { describe, it, expect } from "vitest";
import {
  SlideToUnlock,
  SlideToUnlockTrack,
  SlideToUnlockText,
  SlideToUnlockHandle,
} from "@/components/ui/animated/slide-to-unlock";
import { render, screen } from "@/test/utils/test-utils";

// ---- HELPERS ----------------------------------------------------------------

function renderSlideToUnlock(
  props: {
    handleWidth?: number;
    onUnlock?: () => void;
    className?: string;
  } = {}
) {
  return render(
    <SlideToUnlock {...props}>
      <SlideToUnlockTrack data-testid="track">
        <SlideToUnlockText>slide to unlock</SlideToUnlockText>
        <SlideToUnlockHandle data-testid="handle" />
      </SlideToUnlockTrack>
    </SlideToUnlock>
  );
}

// ---- EXPORTS ----------------------------------------------------------------

describe("SlideToUnlock", () => {
  describe("Exports", () => {
    it("should export all subcomponents", () => {
      expect(SlideToUnlock).toBeDefined();
      expect(SlideToUnlockTrack).toBeDefined();
      expect(SlideToUnlockText).toBeDefined();
      expect(SlideToUnlockHandle).toBeDefined();
    });
  });

  // ---- ROOT -----------------------------------------------------------------

  describe("SlideToUnlock Root", () => {
    it("should render without crashing", () => {
      const { container } = renderSlideToUnlock();
      expect(
        container.querySelector('[data-slot="slide-to-unlock"]')
      ).toBeInTheDocument();
    });

    it("should apply data-slot attribute", () => {
      const { container } = renderSlideToUnlock();
      const root = container.querySelector('[data-slot="slide-to-unlock"]');
      expect(root).toBeInTheDocument();
    });

    it("should apply default styling", () => {
      const { container } = renderSlideToUnlock();
      const root = container.querySelector('[data-slot="slide-to-unlock"]');
      expect(root).toHaveClass("rounded-xl", "p-1", "shadow-inner");
    });

    it("should merge custom className", () => {
      const { container } = renderSlideToUnlock({ className: "w-96" });
      const root = container.querySelector('[data-slot="slide-to-unlock"]');
      expect(root).toHaveClass("w-96");
    });

    it("should have correct displayName", () => {
      expect(SlideToUnlock.displayName).toBe("SlideToUnlock");
    });
  });

  // ---- TRACK ----------------------------------------------------------------

  describe("SlideToUnlockTrack", () => {
    it("should render track element", () => {
      renderSlideToUnlock();
      expect(screen.getByTestId("track")).toBeInTheDocument();
    });

    it("should apply data-slot attribute", () => {
      renderSlideToUnlock();
      expect(screen.getByTestId("track")).toHaveAttribute(
        "data-slot",
        "slide-to-unlock-track"
      );
    });

    it("should apply track styling", () => {
      renderSlideToUnlock();
      expect(screen.getByTestId("track")).toHaveClass(
        "relative",
        "flex",
        "h-10",
        "items-center",
        "justify-center"
      );
    });

    it("should have correct displayName", () => {
      expect(SlideToUnlockTrack.displayName).toBe("SlideToUnlockTrack");
    });
  });

  // ---- TEXT -----------------------------------------------------------------

  describe("SlideToUnlockText", () => {
    it("should render text content", () => {
      renderSlideToUnlock();
      expect(screen.getByText("slide to unlock")).toBeInTheDocument();
    });

    it("should apply data-slot attribute", () => {
      const { container } = renderSlideToUnlock();
      expect(
        container.querySelector('[data-slot="slide-to-unlock-text"]')
      ).toBeInTheDocument();
    });

    it("should accept render function children", () => {
      render(
        <SlideToUnlock>
          <SlideToUnlockTrack>
            <SlideToUnlockText>
              {({ isDragging }) => (
                <span data-testid="render-fn">
                  {isDragging ? "Dragging" : "Idle"}
                </span>
              )}
            </SlideToUnlockText>
            <SlideToUnlockHandle />
          </SlideToUnlockTrack>
        </SlideToUnlock>
      );

      expect(screen.getByTestId("render-fn")).toHaveTextContent("Idle");
    });

    it("should have correct displayName", () => {
      expect(SlideToUnlockText.displayName).toBe("SlideToUnlockText");
    });
  });

  // ---- HANDLE ---------------------------------------------------------------

  describe("SlideToUnlockHandle", () => {
    it("should render handle element", () => {
      renderSlideToUnlock();
      expect(screen.getByTestId("handle")).toBeInTheDocument();
    });

    it("should apply data-slot attribute", () => {
      renderSlideToUnlock();
      expect(screen.getByTestId("handle")).toHaveAttribute(
        "data-slot",
        "slide-to-unlock-handle"
      );
    });

    it("should apply handle styling", () => {
      renderSlideToUnlock();
      expect(screen.getByTestId("handle")).toHaveClass(
        "absolute",
        "top-0",
        "left-0",
        "flex",
        "h-10",
        "cursor-grab",
        "items-center",
        "justify-center",
        "rounded-lg"
      );
    });

    it("should render default arrow icon (SVG)", () => {
      renderSlideToUnlock();
      const handle = screen.getByTestId("handle");
      expect(handle.querySelector("svg")).toBeInTheDocument();
    });

    it("should render custom children instead of default icon", () => {
      render(
        <SlideToUnlock>
          <SlideToUnlockTrack>
            <SlideToUnlockText>Slide</SlideToUnlockText>
            <SlideToUnlockHandle data-testid="handle">
              <span data-testid="custom-icon">ΓåÆ</span>
            </SlideToUnlockHandle>
          </SlideToUnlockTrack>
        </SlideToUnlock>
      );

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("should have correct displayName", () => {
      expect(SlideToUnlockHandle.displayName).toBe("SlideToUnlockHandle");
    });
  });

  // ---- CONTEXT ERROR --------------------------------------------------------

  describe("Context Error", () => {
    it("should throw when track is used outside provider", () => {
      expect(() => {
        render(<SlideToUnlockTrack>No context</SlideToUnlockTrack>);
      }).toThrow("SlideToUnlock components must be used within SlideToUnlock");
    });
  });

  // ---- COMPOSITION ----------------------------------------------------------

  describe("Composition", () => {
    it("should render complete slide-to-unlock component", () => {
      const { container } = renderSlideToUnlock();

      // Root
      expect(
        container.querySelector('[data-slot="slide-to-unlock"]')
      ).toBeInTheDocument();

      // Track
      expect(
        container.querySelector('[data-slot="slide-to-unlock-track"]')
      ).toBeInTheDocument();

      // Text
      expect(
        container.querySelector('[data-slot="slide-to-unlock-text"]')
      ).toBeInTheDocument();

      // Handle
      expect(
        container.querySelector('[data-slot="slide-to-unlock-handle"]')
      ).toBeInTheDocument();
    });

    it("should accept custom handleWidth", () => {
      const { container } = renderSlideToUnlock({ handleWidth: 80 });
      expect(
        container.querySelector('[data-slot="slide-to-unlock"]')
      ).toBeInTheDocument();
    });
  });
});
