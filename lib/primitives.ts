/**
 * Primitive Component Adapter Layer
 *
 * Re-exports headless UI primitives from the current provider (Radix UI).
 * Components import from this file instead of directly from @radix-ui/*.
 *
 * When migrating to Base UI, only this file needs to change.
 * See component-standards.ts for the full migration order.
 *
 * @packageDocumentation
 */

// =============================================================================
// SLOT (Polymorphic rendering)
// Used by: Button (animated + static), Sidebar, Popover (static)
// =============================================================================

export { Slot } from "@radix-ui/react-slot";
// Future: export { Slot } from "@base-ui-components/react/slot";

// =============================================================================
// SEPARATOR
// Used by: Separator
// =============================================================================

export * as SeparatorPrimitive from "@radix-ui/react-separator";
// Future: export * as SeparatorPrimitive from "@base-ui-components/react/separator";

// =============================================================================
// AVATAR
// Used by: Avatar
// =============================================================================

export * as AvatarPrimitive from "@radix-ui/react-avatar";
// Future: export * as AvatarPrimitive from "@base-ui-components/react/avatar";

// =============================================================================
// TOOLTIP
// Used by: Tooltip
// =============================================================================

export * as TooltipPrimitive from "@radix-ui/react-tooltip";
// Future: export * as TooltipPrimitive from "@base-ui-components/react/tooltip";

// =============================================================================
// SCROLL AREA
// Used by: ScrollArea
// =============================================================================

export * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
// Future: export * as ScrollAreaPrimitive from "@base-ui-components/react/scroll-area";

// =============================================================================
// SLIDER
// Used by: Slider
// =============================================================================

export * as SliderPrimitive from "@radix-ui/react-slider";
// Future: export * as SliderPrimitive from "@base-ui-components/react/slider";

// =============================================================================
// DIALOG (used internally by Sheet)
// Used by: Sheet (animated + static)
// =============================================================================

export * as DialogPrimitive from "@radix-ui/react-dialog";
// Future: export * as DialogPrimitive from "@base-ui-components/react/dialog";

// =============================================================================
// DROPDOWN MENU
// Used by: DropdownMenu
// =============================================================================

export * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
// Future: export * as DropdownMenuPrimitive from "@base-ui-components/react/menu";
