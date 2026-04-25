/**
 * Tests for ShimmeringText component (oss/components/ui/animated/shimmering-text.tsx)
 *
 * Animated text component that creates per-character color shimmer effect.
 * Uses motion/react for animation  in JSDOM, motion components render as
 * regular DOM elements.
 *
 * @see oss/components/ui/animated/shimmering-text.tsx
 */

import { describe, it, expect } from "vitest";
import { ShimmeringText } from "@/components/ui/animated/shimmering-text";
import { render } from "@/test/utils/test-utils";

// ---- EXPORTS ----------------------------------------------------------------

describe("ShimmeringText", () => {
  describe("Exports", () => {
    it("should export ShimmeringText", () => {
      expect(ShimmeringText).toBeDefined();
    });
  });

  // ---- RENDERING ------------------------------------------------------------

  describe("Rendering", () => {
    it("should render the text content", () => {
      const { container } = render(<ShimmeringText text="world" />);
      const root = container.querySelector('[data-slot="shimmering-text"]');
      const chars = root?.querySelectorAll(":scope > span");
      const text = Array.from(chars ?? [])
        .map((c) => c.textContent)
        .join("");
      expect(text).toBe("world");
    });

    it("should apply data-slot attribute", () => {
      const { container } = render(<ShimmeringText text="test" />);
      expect(
        container.querySelector('[data-slot="shimmering-text"]')
      ).toBeInTheDocument();
    });

    it("should render each character as a separate span", () => {
      const { container } = render(<ShimmeringText text="abc" />);
      const root = container.querySelector('[data-slot="shimmering-text"]');
      // Root span + 3 character spans
      const childSpans = root?.querySelectorAll(":scope > span");
      expect(childSpans?.length).toBe(3);
    });

    it("should apply inline-block class for character spans", () => {
      const { container } = render(<ShimmeringText text="x" />);
      const root = container.querySelector('[data-slot="shimmering-text"]');
      const charSpan = root?.querySelector(":scope > span");
      expect(charSpan).toHaveClass("inline-block", "whitespace-pre");
    });

    it("should render empty text without crashing", () => {
      const { container } = render(<ShimmeringText text="" />);
      const root = container.querySelector('[data-slot="shimmering-text"]');
      expect(root).toBeInTheDocument();
      expect(root?.querySelectorAll(":scope > span").length).toBe(0);
    });

    it("should preserve spaces in text", () => {
      const { container } = render(<ShimmeringText text="a b" />);
      const root = container.querySelector('[data-slot="shimmering-text"]');
      const spans = root?.querySelectorAll(":scope > span");
      expect(spans?.length).toBe(3);
      // Middle span should contain a space
      expect(spans?.[1]?.textContent).toBe(" ");
    });
  });

  // ---- STYLING --------------------------------------------------------------

  describe("Styling", () => {
    it("should apply default classes", () => {
      const { container } = render(<ShimmeringText text="hi" />);
      const root = container.querySelector('[data-slot="shimmering-text"]');
      expect(root).toHaveClass("inline-block", "select-none");
    });

    it("should merge custom className", () => {
      const { container } = render(
        <ShimmeringText text="hi" className="text-xl" />
      );
      const root = container.querySelector('[data-slot="shimmering-text"]');
      expect(root).toHaveClass("inline-block", "select-none", "text-xl");
    });
  });

  // ---- PROPS ----------------------------------------------------------------

  describe("Props", () => {
    it("should accept duration prop without crashing", () => {
      const { container } = render(<ShimmeringText text="test" duration={2} />);
      expect(
        container.querySelector('[data-slot="shimmering-text"]')
      ).toBeInTheDocument();
    });

    it("should accept isStopped prop without crashing", () => {
      const { container } = render(
        <ShimmeringText text="test" isStopped={true} />
      );
      expect(
        container.querySelector('[data-slot="shimmering-text"]')
      ).toBeInTheDocument();
    });

    it("should accept isStopped=false without crashing", () => {
      const { container } = render(
        <ShimmeringText text="test" isStopped={false} />
      );
      expect(
        container.querySelector('[data-slot="shimmering-text"]')
      ).toBeInTheDocument();
    });

    it("should pass extra props to root element", () => {
      const { container } = render(
        <ShimmeringText text="test" data-custom="value" />
      );
      const root = container.querySelector('[data-slot="shimmering-text"]');
      expect(root).toHaveAttribute("data-custom", "value");
    });
  });

  // ---- DISPLAY NAME ---------------------------------------------------------

  describe("DisplayName", () => {
    it("should have correct displayName", () => {
      expect(ShimmeringText.displayName).toBe("ShimmeringText");
    });
  });
});
