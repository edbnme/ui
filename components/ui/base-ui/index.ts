/**
 * Base UI Components Index
 *
 * This file provides exports for all Base UI components.
 * These are headless, accessible components built on @base-ui/react.
 *
 * @packageDocumentation
 */

// Alert Dialog
export {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "./alert-dialog";

// Checkbox
export {
  CheckboxRoot,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxGroup,
} from "./checkbox";

// Dialog
export {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "./dialog";

// Menu
export {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuShortcut,
} from "./menu";

// Progress
export {
  ProgressRoot,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from "./progress";

// Select
export {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectGroup,
  SelectGroupLabel,
  SelectSeparator,
} from "./select";

// Switch
export { SwitchRoot, SwitchThumb } from "./switch";

// Tabs
export { TabsRoot, TabsList, TabsTab, TabsIndicator, TabsPanel } from "./tabs";

// Tooltip
export {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  TooltipArrow,
} from "./tooltip";

// Collapsible
export {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "./collapsible";

// Radio
export { RadioGroupRoot, RadioItem, RadioIndicator } from "./radio";

// Slider
export {
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  SliderValue,
} from "./slider";

// Popover
export {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverBackdrop,
  PopoverPositioner,
  PopoverPopup,
  PopoverArrow,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
} from "./popover";

// Input
export { InputRoot } from "./input";

// Number Field
export {
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldScrubArea,
} from "./number-field";

// Separator
export { SeparatorRoot } from "./separator";

// Toggle
export {
  ToggleRoot,
  ToggleGroupRoot,
  ToggleGroupItem,
  toggleVariants,
} from "./toggle";

// Scroll Area
export {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from "./scroll-area";

// Field
export {
  FieldRoot,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
} from "./field";

// Form
export { FormRoot } from "./form";

// Accordion
export {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from "./accordion";

// Avatar
export { AvatarRoot, AvatarImage, AvatarFallback } from "./avatar";

// Toast
export {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "./toast";

// Preview Card
export {
  PreviewCardRoot,
  PreviewCardTrigger,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardArrow,
} from "./preview-card";

// Meter
export {
  MeterRoot,
  MeterLabel,
  MeterTrack,
  MeterIndicator,
  MeterValue,
} from "./meter";

// Context Menu
export {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuPopup,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuSeparator,
  ContextMenuSubmenuRoot,
  ContextMenuSubmenuTrigger,
  ContextMenuShortcut,
} from "./context-menu";

// Combobox
export {
  ComboboxRoot,
  ComboboxInputWrapper,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
} from "./combobox";

// Fieldset
export { FieldsetRoot, FieldsetLegend } from "./fieldset";

// Toolbar
export {
  ToolbarRoot,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarGroup,
  toolbarButtonVariants,
} from "./toolbar";

// Checkbox Group
export {
  CheckboxGroupRoot,
  CheckboxGroupItem,
  CheckboxGroupLabel,
} from "./checkbox-group";
