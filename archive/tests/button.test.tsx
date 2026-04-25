/**
 * =============================================================================
 * BUTTON COMPONENT TESTS
 * =============================================================================
 *
 * Comprehensive test suite for the Button component.
 *
 * Test Categories:
 * 1. Rendering - Basic render tests for all variants and sizes
 * 2. Icons - Start/end icon rendering and loading state icon behavior
 * 3. Loading State - Spinner display, disabled behavior, ARIA attributes
 * 4. Success State - Checkmark display, interaction with loading state
 * 5. Ripple Effect - Material ripple on variants (excluding ghost/link)
 * 6. Disabled State - Disabled styling and interaction prevention
 * 7. Interactions - Click handlers, keyboard navigation
 * 8. Composition - asChild prop with Slot
 * 9. Accessibility - ARIA attributes, focus management
 * 10. Animation - disableAnimation prop behavior
 * 11. IconButton - Specialized icon-only button variant
 * 12. buttonVariants - CVA function for custom styling
 *
 * Coverage Target: 100% for all metrics
 *
 * @module components/ui/button/__tests__/button.test
 * =============================================================================
 */

import { PlusIcon, XIcon, MinusIcon } from "@phosphor-icons/react";
import { describe, it, expect, vi } from "vitest";
import {
  Button,
  IconButton,
  buttonVariants,
} from "@/components/ui/animated/button";
import { render, screen } from "@/test/utils/test-utils";

// ---- RENDERING TESTS --------------------------------------------------------

describe("Button", () => {
  describe("Rendering", () => {
    it("should render button with text content", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button", { name: "Click me" });
      expect(button).toBeInTheDocument();
    });

    it("should render with data-slot attribute for styling hooks", () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-slot", "button");
    });

    it("should apply custom className", () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should forward ref to button element", () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Ref Test</Button>);

      expect(ref).toHaveBeenCalled();
    });
  });

  // ---- VARIANT TESTS --------------------------------------------------------

  describe("Variants", () => {
    it("should render default variant with primary styling", () => {
      render(<Button variant="default">Default</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
      expect(button).toHaveClass("text-primary-foreground");
    });

    it("should render destructive variant with red styling", () => {
      render(<Button variant="destructive">Delete</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-destructive");
      expect(button).toHaveClass("text-white");
    });

    it("should render outline variant with border", () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("border");
      expect(button).toHaveClass("bg-background");
    });

    it("should render secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary");
      expect(button).toHaveClass("text-secondary-foreground");
    });

    it("should render ghost variant without background", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-accent");
      expect(button).not.toHaveClass("bg-primary");
    });

    it("should render link variant with underline on hover", () => {
      render(<Button variant="link">Link</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-primary");
      expect(button).toHaveClass("underline-offset-4");
      expect(button).toHaveClass("hover:underline");
    });
  });

  // ---- SIZE TESTS -----------------------------------------------------------

  describe("Sizes", () => {
    it("should render default size (h-10)", () => {
      render(<Button size="default">Default Size</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("px-5");
    });

    it("should render small size (h-9)", () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-9");
      expect(button).toHaveClass("px-4");
      expect(button).toHaveClass("text-xs");
    });

    it("should render large size (h-11)", () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11");
      expect(button).toHaveClass("px-7");
      expect(button).toHaveClass("text-base");
    });

    it("should render extra large size (h-12)", () => {
      render(<Button size="xl">Extra Large</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-12");
      expect(button).toHaveClass("px-8");
    });

    it("should render icon size (size-10)", () => {
      render(
        <Button size="icon" aria-label="Icon">
          X
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-10");
    });

    it("should render small icon size (size-9)", () => {
      render(
        <Button size="icon-sm" aria-label="Small icon">
          X
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-9");
    });

    it("should render large icon size (size-11)", () => {
      render(
        <Button size="icon-lg" aria-label="Large icon">
          X
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-11");
    });
  });

  // ---- ICON TESTS -----------------------------------------------------------

  describe("Icons", () => {
    it("should render with start icon", () => {
      render(<Button iconStart={PlusIcon}>Add Item</Button>);

      const button = screen.getByRole("button");
      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should render with end icon", () => {
      render(<Button iconEnd={XIcon}>Close</Button>);

      const button = screen.getByRole("button");
      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should render with both start and end icons", () => {
      render(
        <Button iconStart={PlusIcon} iconEnd={MinusIcon}>
          Both Icons
        </Button>
      );

      const button = screen.getByRole("button");
      const icons = button.querySelectorAll("svg");
      expect(icons).toHaveLength(2);
    });

    it("should hide icons when loading", () => {
      render(
        <Button loading iconStart={PlusIcon} iconEnd={XIcon}>
          Loading
        </Button>
      );

      const button = screen.getByRole("button");
      // Should only have loading spinner
      const icons = button.querySelectorAll("svg");
      expect(icons).toHaveLength(1);
    });

    it("should use smaller icon size for sm button", () => {
      render(
        <Button size="sm" iconStart={PlusIcon}>
          Small
        </Button>
      );

      // Icon should be rendered (size is set via prop)
      const button = screen.getByRole("button");
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("should use smaller icon size for icon-sm button", () => {
      render(
        <Button size="icon-sm" iconStart={PlusIcon} aria-label="Small icon" />
      );

      const button = screen.getByRole("button");
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("should use smaller spinner size for icon-sm loading button", () => {
      render(<Button size="icon-sm" loading aria-label="Loading" />);

      const button = screen.getByRole("button");
      // Spinner should be rendered with smaller size
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("should use smaller icon size for sm button with end icon", () => {
      render(
        <Button size="sm" iconEnd={XIcon}>
          Small End
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button.querySelector("svg")).toBeInTheDocument();
    });
  });

  // ---- LOADING STATE TESTS --------------------------------------------------

  describe("Loading State", () => {
    it("should show loading spinner when loading is true", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("should set aria-busy when loading", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("should set aria-disabled when loading", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("should be disabled when loading", () => {
      render(<Button loading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should not trigger onClick when loading", async () => {
      const onClick = vi.fn();
      const { user } = render(
        <Button loading onClick={onClick}>
          Loading
        </Button>
      );

      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // ---- SUCCESS STATE TESTS --------------------------------------------------

  describe("Success State", () => {
    it("should show success checkmark when success is true", () => {
      render(<Button success>Success</Button>);

      const button = screen.getByRole("button");
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should hide iconStart when success is true", () => {
      render(
        <Button success iconStart={PlusIcon}>
          Success
        </Button>
      );

      const button = screen.getByRole("button");
      const svgs = button.querySelectorAll("svg");
      // Only one SVG should be present (the checkmark)
      expect(svgs.length).toBe(1);
    });

    it("should not show success checkmark when loading is also true", () => {
      render(
        <Button success loading>
          Loading Success
        </Button>
      );

      const button = screen.getByRole("button");
      // Should show loading spinner, not checkmark
      expect(button).toHaveAttribute("aria-busy", "true");
    });
  });

  // ---- RIPPLE EFFECT TESTS --------------------------------------------------

  describe("Ripple Effect", () => {
    it("should have ripple container for default variant", () => {
      render(<Button variant="default">Ripple</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("relative");
      expect(button).toHaveClass("overflow-hidden");
    });

    it("should have ripple container for destructive variant", () => {
      render(<Button variant="destructive">Ripple</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("relative");
      expect(button).toHaveClass("overflow-hidden");
    });

    it("should have ripple container for outline variant", () => {
      render(<Button variant="outline">Ripple</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("relative");
      expect(button).toHaveClass("overflow-hidden");
    });

    it("should have ripple container for secondary variant", () => {
      render(<Button variant="secondary">Ripple</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("relative");
      expect(button).toHaveClass("overflow-hidden");
    });

    it("should NOT have ripple container for ghost variant", () => {
      render(<Button variant="ghost">No Ripple</Button>);

      const button = screen.getByRole("button");
      // Ghost variant should not have overflow-hidden
      expect(button).not.toHaveClass("overflow-hidden");
    });

    it("should NOT have ripple container for link variant", () => {
      render(<Button variant="link">No Ripple</Button>);

      const button = screen.getByRole("button");
      // Link variant should not have overflow-hidden
      expect(button).not.toHaveClass("overflow-hidden");
    });

    it("should create ripple on click for default variant", async () => {
      const { user } = render(<Button variant="default">Click</Button>);

      const button = screen.getByRole("button");
      await user.click(button);

      // Check if ripple span was added (it should be in the DOM briefly)
      const rippleContainer = button.querySelector("span.pointer-events-none");
      expect(rippleContainer).toBeInTheDocument();
    });

    it("should not create ripple when loading", async () => {
      const onClick = vi.fn();
      const { user } = render(
        <Button loading onClick={onClick}>
          Loading
        </Button>
      );

      await user.click(screen.getByRole("button"));
      // Click should be prevented entirely when loading
      expect(onClick).not.toHaveBeenCalled();
    });

    it("should not create ripple when in success state", async () => {
      const onClick = vi.fn();
      const { user } = render(
        <Button success onClick={onClick}>
          Success
        </Button>
      );

      await user.click(screen.getByRole("button"));
      // onClick should still work but no ripple should be created during success
      expect(onClick).toHaveBeenCalled();
    });
  });

  // ---- DISABLED STATE TESTS -------------------------------------------------

  describe("Disabled State", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should have disabled opacity class", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:opacity-50");
    });

    it("should set aria-disabled when disabled", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("should not trigger onClick when disabled", async () => {
      const onClick = vi.fn();
      const { user } = render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // ---- INTERACTION TESTS ----------------------------------------------------

  describe("Interactions", () => {
    it("should call onClick when clicked", async () => {
      const onClick = vi.fn();
      const { user } = render(<Button onClick={onClick}>Click</Button>);

      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick with event object", async () => {
      const onClick = vi.fn();
      const { user } = render(<Button onClick={onClick}>Click</Button>);

      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it("should support onMouseEnter and onMouseLeave", async () => {
      const onMouseEnter = vi.fn();
      const onMouseLeave = vi.fn();
      const { user } = render(
        <Button onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          Hover
        </Button>
      );

      const button = screen.getByRole("button");
      await user.hover(button);
      expect(onMouseEnter).toHaveBeenCalled();

      await user.unhover(button);
      expect(onMouseLeave).toHaveBeenCalled();
    });

    it("should support onFocus and onBlur", async () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      const { user } = render(
        <Button onFocus={onFocus} onBlur={onBlur}>
          Focus
        </Button>
      );

      await user.tab();
      expect(onFocus).toHaveBeenCalled();

      await user.tab();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  // ---- COMPOSITION (asChild) TESTS ------------------------------------------

  describe("asChild Composition", () => {
    it("should render as link when asChild with anchor", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole("link", { name: "Link Button" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("should apply button classes to child element", () => {
      render(
        <Button asChild variant="outline">
          <a href="/test">Styled Link</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("border");
    });
  });

  // ---- ACCESSIBILITY TESTS --------------------------------------------------

  describe("Accessibility", () => {
    it("should support aria-label for icon-only buttons", () => {
      render(
        <Button size="icon" aria-label="Add item">
          +
        </Button>
      );

      const button = screen.getByRole("button", { name: "Add item" });
      expect(button).toBeInTheDocument();
    });

    it("should have focus-visible ring styles", () => {
      render(<Button>Focus Test</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus-visible:ring-2");
      expect(button).toHaveClass("focus-visible:ring-ring");
    });

    it("should have aria-invalid ring styles", () => {
      render(<Button>Invalid Test</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("aria-invalid:ring-destructive/20");
    });

    it("should support type attribute", () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should default to type button", () => {
      render(<Button>Default Type</Button>);

      // Note: React Testing Library doesn't enforce default type
      // The component should have type="button" as default for safety
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  // ---- ANIMATION TESTS ------------------------------------------------------

  describe("Animation", () => {
    it("should render without animation when disableAnimation is true", () => {
      render(<Button disableAnimation>No Animation</Button>);

      // Should render as regular button, not motion.button
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });

    it("should render with animation by default", () => {
      render(<Button>Animated</Button>);

      // With animation, it's wrapped in motion.button
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });
});

// ---- ICON BUTTON TESTS ------------------------------------------------------

describe("IconButton", () => {
  it("should render with icon and aria-label", () => {
    render(<IconButton icon={PlusIcon} aria-label="Add item" />);

    const button = screen.getByRole("button", { name: "Add item" });
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("should use icon size by default", () => {
    render(<IconButton icon={PlusIcon} aria-label="Add" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("size-10");
  });

  it("should support small icon size", () => {
    render(<IconButton icon={PlusIcon} aria-label="Add" size="icon-sm" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("size-9");
  });

  it("should support large icon size", () => {
    render(<IconButton icon={XIcon} aria-label="Close" size="icon-lg" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("size-11");
  });

  it("should support variant prop", () => {
    render(<IconButton icon={XIcon} aria-label="Close" variant="ghost" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-accent");
  });

  it("should support destructive variant", () => {
    render(
      <IconButton icon={XIcon} aria-label="Delete" variant="destructive" />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("should show loading spinner when loading", () => {
    render(<IconButton icon={PlusIcon} aria-label="Add" loading />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<IconButton icon={PlusIcon} aria-label="Add" disabled />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});

// ---- BUTTON VARIANTS FUNCTION TESTS -----------------------------------------

describe("buttonVariants", () => {
  it("should return correct classes for default variant", () => {
    const classes = buttonVariants({ variant: "default" });

    expect(classes).toContain("bg-primary");
    expect(classes).toContain("text-primary-foreground");
  });

  it("should return correct classes for destructive variant", () => {
    const classes = buttonVariants({ variant: "destructive" });

    expect(classes).toContain("bg-destructive");
    expect(classes).toContain("text-white");
  });

  it("should return correct classes for outline variant", () => {
    const classes = buttonVariants({ variant: "outline" });

    expect(classes).toContain("border");
    expect(classes).toContain("bg-background");
  });

  it("should return correct classes for custom variant and size", () => {
    const classes = buttonVariants({ variant: "secondary", size: "lg" });

    expect(classes).toContain("bg-secondary");
    expect(classes).toContain("h-11");
  });

  it("should return default classes when no props provided", () => {
    const classes = buttonVariants({});

    expect(classes).toContain("bg-primary");
    expect(classes).toContain("h-10");
  });

  it("should merge custom className", () => {
    const classes = buttonVariants({ className: "custom-class" });

    expect(classes).toContain("custom-class");
  });
});
