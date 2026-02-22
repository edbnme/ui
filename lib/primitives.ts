/**
 * Primitive Component Adapter Layer
 *
 * Re-exports headless UI primitives used by edbn-ui components.
 * Components import from this file instead of directly from provider packages.
 *
 * Base UI (@base-ui/react) is the primary primitive provider.
 * Radix UI is retained only for Avatar (no Base UI equivalent) and Slot.
 *
 * @packageDocumentation
 */

// =============================================================================
// SLOT (Polymorphic rendering)
// Used by: Button (animated + static), Sidebar, Popover (static)
// Retained from Radix — Base UI uses `render` prop instead of Slot
// =============================================================================

export { Slot } from "@radix-ui/react-slot";

// =============================================================================
// AVATAR (Radix — no Base UI equivalent)
// Used by: Avatar
// =============================================================================

export * as AvatarPrimitive from "@radix-ui/react-avatar";

// =============================================================================
// BASE UI PRIMITIVES
// =============================================================================

export { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
export { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
export { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
export { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
export { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
export { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
export { Field as FieldPrimitive } from "@base-ui/react/field";
export { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
export { Form as FormPrimitive } from "@base-ui/react/form";
export { Input as InputPrimitive } from "@base-ui/react/input";
export { Menu as MenuPrimitive } from "@base-ui/react/menu";
export { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
export { Popover as PopoverPrimitive } from "@base-ui/react/popover";
export { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
export { Progress as ProgressPrimitive } from "@base-ui/react/progress";
export { Radio as RadioPrimitive } from "@base-ui/react/radio";
export { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
export { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
export { Select as SelectPrimitive } from "@base-ui/react/select";
export { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
export { Slider as SliderPrimitive } from "@base-ui/react/slider";
export { Switch as SwitchPrimitive } from "@base-ui/react/switch";
export { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
export { Toast as ToastPrimitive } from "@base-ui/react/toast";
export { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
export { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
export { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
export { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

// =============================================================================
// LEGACY RADIX EXPORTS (animated variant only — will be removed)
// Static components should NOT import these
// =============================================================================

export * as RadixDialogPrimitive from "@radix-ui/react-dialog";
export * as RadixDropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
export * as RadixSeparatorPrimitive from "@radix-ui/react-separator";
export * as RadixTooltipPrimitive from "@radix-ui/react-tooltip";
export * as RadixScrollAreaPrimitive from "@radix-ui/react-scroll-area";
export * as RadixSliderPrimitive from "@radix-ui/react-slider";
