/**
 * =============================================================================
 * DROPDOWN MENU COMPONENT TESTS
 * =============================================================================
 *
 * Comprehensive test suite for the DropdownMenu component.
 *
 * Test Categories:
 * 1. Rendering - Basic render tests for all subcomponents
 * 2. Interactions - Open/close, item selection
 * 3. Keyboard Navigation - Arrow keys, Escape, Enter
 * 4. Checkbox Items - Toggle behavior
 * 5. Radio Items - Selection behavior
 * 6. Submenus - Nested menu behavior
 * 7. Accessibility - ARIA attributes, roles
 * 8. Animation - disableAnimation prop
 * 9. Edge Cases - Disabled items, shortcuts
 *
 * Coverage Target: 100% for all metrics
 *
 * @module components/ui/dropdown-menu/__tests__/dropdown-menu.test
 * =============================================================================
 */

import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/ui/animated/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
  DropdownMenuPortal,
} from "@/components/ui/animated/dropdown-menu";
import {
  render,
  screen,
  waitFor,
  pressEscape,
  pressArrowDown,
  pressArrowUp,
} from "@/test/utils/test-utils";

// ---- HELPER FUNCTIONS -------------------------------------------------------

/**
 * Helper to render a complete DropdownMenu with common subcomponents
 */
function renderDropdownMenu(
  props: {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    disableAnimation?: boolean;
  } = {}
) {
  const { defaultOpen, open, onOpenChange, disableAnimation } = props;

  return render(
    <DropdownMenu
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      disableAnimation={disableAnimation}
    >
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---- RENDERING TESTS --------------------------------------------------------

describe("DropdownMenu", () => {
  describe("Rendering", () => {
    it("should render trigger button", () => {
      renderDropdownMenu();

      expect(
        screen.getByRole("button", { name: "Open Menu" })
      ).toBeInTheDocument();
    });

    it("should not render content initially", () => {
      renderDropdownMenu();

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("should render content when defaultOpen is true", async () => {
      renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("should render menu items", async () => {
      renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        expect(
          screen.getByRole("menuitem", { name: "Profile" })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("menuitem", { name: "Settings" })
        ).toBeInTheDocument();
      });
    });

    it("should render label", async () => {
      renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByText("My Account")).toBeInTheDocument();
      });
    });

    it("should render separator", async () => {
      renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getAllByRole("separator")).toHaveLength(2);
      });
    });

    it("should render destructive item with correct variant", async () => {
      renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        const deleteItem = screen.getByRole("menuitem", {
          name: "Delete Account",
        });
        expect(deleteItem).toHaveAttribute("data-variant", "destructive");
      });
    });

    it("should have data-slot attributes", async () => {
      renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        const menuItem = screen.getByRole("menuitem", { name: "Profile" });
        expect(menuItem).toHaveAttribute("data-slot", "dropdown-menu-item");
      });
    });
  });

  // ---- INTERACTION TESTS ----------------------------------------------------

  describe("Interactions", () => {
    it("should open when trigger is clicked", async () => {
      const { user } = renderDropdownMenu();

      await user.click(screen.getByRole("button", { name: "Open Menu" }));

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("should close when item is clicked", async () => {
      const { user } = renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("menuitem", { name: "Profile" }));

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("should call onSelect when item is clicked", async () => {
      const onSelect = vi.fn();
      const { user } = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onSelect}>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("menuitem", { name: "Item" }));

      expect(onSelect).toHaveBeenCalled();
    });

    it("should not close when disabled item is clicked", async () => {
      const { user } = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("menuitem", { name: "Disabled" }));

      // Menu should still be open
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should call onOpenChange when opened", async () => {
      const onOpenChange = vi.fn();
      const { user } = renderDropdownMenu({ onOpenChange });

      await user.click(screen.getByRole("button", { name: "Open Menu" }));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  // ---- KEYBOARD NAVIGATION TESTS --------------------------------------------

  describe("Keyboard Navigation", () => {
    it("should close when Escape is pressed", async () => {
      const { user } = renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      await pressEscape(user);

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("should navigate with arrow down", async () => {
      const { user } = renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      await pressArrowDown(user);

      // Menu should still be visible with navigation
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should navigate with arrow up", async () => {
      const { user } = renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      await pressArrowUp(user);

      // Menu should still be visible with navigation
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  // ---- CHECKBOX ITEM TESTS --------------------------------------------------

  describe("Checkbox Items", () => {
    it("should render checkbox items", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>Checked</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Unchecked</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("menuitemcheckbox", { name: "Checked" })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("menuitemcheckbox", { name: "Unchecked" })
        ).toBeInTheDocument();
      });
    });

    it("should toggle checkbox on click", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={onCheckedChange}
            >
              Toggle
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(screen.getByRole("menuitemcheckbox")).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("menuitemcheckbox", { name: "Toggle" })
      );

      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("should display check icon when checked", async () => {
      render(
        <DropdownMenu defaultOpen disableAnimation>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>
              Checked Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        const checkbox = screen.getByRole("menuitemcheckbox", {
          name: "Checked Item",
        });
        expect(checkbox).toBeInTheDocument();
        // Check icon should be present when checked
        expect(checkbox.querySelector("svg")).toBeInTheDocument();
      });
    });
  });

  // ---- RADIO ITEM TESTS -----------------------------------------------------

  describe("Radio Items", () => {
    it("should render radio items", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("menuitemradio", { name: "Option 1" })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("menuitemradio", { name: "Option 2" })
        ).toBeInTheDocument();
      });
    });

    it("should select radio item on click", async () => {
      const onValueChange = vi.fn();
      const { user } = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value="option1"
              onValueChange={onValueChange}
            >
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("menuitemradio", { name: "Option 2" })
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("menuitemradio", { name: "Option 2" }));

      expect(onValueChange).toHaveBeenCalledWith("option2");
    });

    it("should render radio items with animation (default)", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">
                Animated Option
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("menuitemradio", { name: "Animated Option" })
        ).toBeInTheDocument();
      });
    });

    it("should render radio items with disabled animation", async () => {
      render(
        <DropdownMenu defaultOpen disableAnimation>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">
                No Animation
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("menuitemradio", { name: "No Animation" })
        ).toBeInTheDocument();
      });
    });
  });

  // ---- SUBMENU TESTS --------------------------------------------------------

  describe("Submenus", () => {
    it("should render submenu trigger", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(screen.getByText("More Options")).toBeInTheDocument();
      });
    });

    it("should render submenu with inset prop", async () => {
      render(
        <DropdownMenu defaultOpen disableAnimation>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset>
                Inset Submenu
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        const trigger = screen.getByText("Inset Submenu");
        expect(trigger.closest("[data-inset]")).toHaveAttribute(
          "data-inset",
          "true"
        );
      });
    });
  });

  // ---- SHORTCUT TESTS -------------------------------------------------------

  describe("Shortcuts", () => {
    it("should render keyboard shortcut", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Copy
              <DropdownMenuShortcut>ΓîÿC</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(screen.getByText("ΓîÿC")).toBeInTheDocument();
      });
    });

    it("should have correct data-slot on shortcut", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Paste
              <DropdownMenuShortcut>ΓîÿV</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        const shortcut = screen.getByText("ΓîÿV");
        expect(shortcut).toHaveAttribute("data-slot", "dropdown-menu-shortcut");
      });
    });
  });

  // ---- ACCESSIBILITY TESTS --------------------------------------------------

  describe("Accessibility", () => {
    it("should have correct trigger data-slot", () => {
      renderDropdownMenu();

      const trigger = screen.getByRole("button", { name: "Open Menu" });
      expect(trigger).toHaveAttribute("data-slot", "dropdown-menu-trigger");
    });

    it("should mark disabled items correctly", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        const item = screen.getByRole("menuitem", { name: "Disabled Item" });
        expect(item).toHaveAttribute("data-disabled");
      });
    });

    it("should render group with correct role", async () => {
      renderDropdownMenu({ defaultOpen: true });

      await waitFor(() => {
        expect(screen.getByRole("group")).toBeInTheDocument();
      });
    });

    it("should support inset prop on items", async () => {
      render(
        <DropdownMenu defaultOpen disableAnimation>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        const item = screen.getByRole("menuitem", { name: "Inset Item" });
        expect(item).toHaveAttribute("data-inset", "true");
      });
    });

    it("should support inset prop on labels", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        const label = screen.getByText("Inset Label");
        expect(label).toHaveAttribute("data-inset", "true");
      });
    });
  });

  // ---- ANIMATION TESTS ------------------------------------------------------

  describe("Animation", () => {
    it("should render with animation disabled", async () => {
      renderDropdownMenu({ defaultOpen: true, disableAnimation: true });

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("should render items without animation when disabled", async () => {
      render(
        <DropdownMenu defaultOpen disableAnimation>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>No Animation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("menuitem", { name: "No Animation" })
        ).toBeInTheDocument();
      });
    });
  });

  // ---- CONTROLLED STATE TESTS -----------------------------------------------

  describe("Controlled State", () => {
    it("should work with controlled open state", async () => {
      render(
        <DropdownMenu open={true} onOpenChange={() => {}}>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Controlled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });
  });

  // ---- MODAL TESTS ----------------------------------------------------------

  describe("Modal", () => {
    it("should support modal prop", async () => {
      render(
        <DropdownMenu defaultOpen modal={true}>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Modal Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });
  });

  // ---- PORTAL TESTS ---------------------------------------------------------

  describe("Portal", () => {
    it("should render DropdownMenuPortal component", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuItem>Portal Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      );

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
        expect(
          screen.getByRole("menuitem", { name: "Portal Item" })
        ).toBeInTheDocument();
      });
    });
  });
});
