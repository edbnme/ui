/**
 * Base UI Components Index
 *
 * This file provides exports for all Base UI components.
 * These are headless, accessible components built on @base-ui/react.
 *
 * @packageDocumentation
 */

export { Toaster } from "./sonner";

// Alert Dialog
export {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogViewport,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogHandle,
  createAlertDialogHandle,
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
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogCloseIconButton,
  DialogHeader,
  DialogFooter,
  DialogHandle,
  createDialogHandle,
} from "./dialog";

// Menu
export {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuBackdrop,
  MenuPositioner,
  MenuPopup,
  MenuArrow,
  MenuViewport,
  MenuItem,
  MenuLinkItem,
  MenuCheckboxItemIndicator,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItemIndicator,
  MenuRadioItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuShortcut,
  MenuHandle,
  createMenuHandle,
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
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectPositioner,
  SelectPopup,
  SelectArrow,
  SelectList,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectGroup,
  SelectGroupLabel,
  SelectSeparator,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
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
  TooltipViewport,
  TooltipHandle,
  createTooltipHandle,
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
  SliderLabel,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  Slider,
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
  PopoverCloseIconButton,
  PopoverViewport,
  PopoverHandle,
  createPopoverHandle,
} from "./popover";

// Input
export { InputRoot, Input } from "./input";

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
export { SeparatorRoot, Separator } from "./separator";

// Toggle
export {
  ToggleRoot,
  ToggleGroupRoot,
  ToggleGroupItem,
  toggleVariants,
} from "./toggle";

// Scroll Area
export {
  ScrollArea,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
  ScrollAreaEdgeCue,
  ScrollBar,
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
export { AvatarRoot, AvatarImage, AvatarFallback, Avatar } from "./avatar";

// Toast
export {
  ToastProvider,
  ToastPortal,
  ToastViewport,
  ToastPositioner,
  ToastRoot,
  ToastArrow,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  createToastManager,
  useToastManager,
} from "./toast";

// Preview Card
export {
  PreviewCardRoot,
  PreviewCardTrigger,
  PreviewCardPortal,
  PreviewCardBackdrop,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardArrow,
  PreviewCardViewport,
  PreviewCardHandle,
  createPreviewCardHandle,
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
  ContextMenuBackdrop,
  ContextMenuPositioner,
  ContextMenuPopup,
  ContextMenuArrow,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuCheckboxItemIndicator,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItemIndicator,
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
  ComboboxLabel,
  ComboboxInputGroup,
  ComboboxInputWrapper,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxPortal,
  ComboboxBackdrop,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxRow,
  ComboboxCollection,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxArrow,
  ComboboxSeparator,
  ComboboxIcon,
  ComboboxValue,
  ComboboxItemIndicator,
  ComboboxStatus,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
  useComboboxFilter,
  useComboboxFilteredItems,
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
  ToolbarInput,
  toolbarButtonVariants,
} from "./toolbar";

// Checkbox Group
export {
  CheckboxGroupRoot,
  CheckboxGroupItem,
  CheckboxGroupLabel,
} from "./checkbox-group";

// Alert (formerly shared/)
export * from "./alert";

// Aspect Ratio (formerly shared/)
export * from "./aspect-ratio";

// Badge (formerly shared/)
export * from "./badge";

// Breadcrumb (formerly shared/)
export * from "./breadcrumb";

// Card (formerly shared/)
export * from "./card";

// Label (formerly shared/)
export * from "./label";

// Pagination (formerly shared/)
export * from "./pagination";

// Skeleton (formerly shared/)
export * from "./skeleton";

// Table (formerly shared/)
export * from "./table";

// Textarea (formerly shared/)
export * from "./textarea";

// ---- New components (Phase 3) ----

// Button
export { Button, buttonVariants } from "./button";

// Sheet
export {
  SheetRoot,
  SheetTrigger,
  SheetPortal,
  SheetBackdrop,
  SheetViewport,
  SheetPopup,
  SheetClose,
  SheetCloseIconButton,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetHandle,
  createSheetHandle,
  sheetVariants,
} from "./sheet";

// Drawer
export {
  DrawerProvider,
  DrawerRoot,
  DrawerTrigger,
  DrawerSwipeArea,
  DrawerPortal,
  DrawerBackdrop,
  DrawerViewport,
  DrawerPopup,
  DrawerGrip,
  DrawerHandle,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerCloseIconButton,
  DrawerIndent,
  DrawerIndentBackground,
  createDrawerHandle,
} from "./drawer";

// Hover Card
export {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardBackdrop,
  HoverCardPositioner,
  HoverCardPopup,
  HoverCardArrow,
  HoverCardViewport,
  HoverCardHandle,
  createHoverCardHandle,
} from "./hover-card";

// Input OTP
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./input-otp";

// Toggle Group (dedicated file)
export {
  ToggleGroupRoot as ToggleGroupRootStandalone,
  ToggleGroupItem as ToggleGroupItemStandalone,
  toggleGroupItemVariants,
} from "./toggle-group";

// Menubar
export {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarBackdrop,
  MenubarPositioner,
  MenubarPopup,
  MenubarViewport,
  MenubarArrow,
  MenubarItem,
  MenubarLinkItem,
  MenubarCheckboxItemIndicator,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItemIndicator,
  MenubarRadioItem,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarSeparator,
  MenubarSubmenuRoot,
  MenubarSubmenuTrigger,
  MenubarShortcut,
  MenubarHandle,
  createMenubarHandle,
} from "./menubar";

// Navigation Menu
export {
  NavMenuRoot,
  NavMenuList,
  NavMenuItem,
  NavMenuTrigger,
  NavMenuIcon,
  NavMenuContent,
  NavMenuLink,
  NavMenuPortal,
  NavMenuBackdrop,
  NavMenuPositioner,
  NavMenuPopup,
  NavMenuArrow,
  NavMenuViewport,
} from "./navigation-menu";

// Resizable
export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./resizable";

// Autocomplete
export {
  AutocompleteRoot,
  AutocompleteInputGroup,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteClear,
  AutocompletePortal,
  AutocompleteBackdrop,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteRow,
  AutocompleteCollection,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteArrow,
  AutocompleteSeparator,
  AutocompleteIcon,
  AutocompleteValue,
  AutocompleteStatus,
  useAutocompleteFilter,
  useAutocompleteFilteredItems,
} from "./autocomplete";

// Calendar
export { Calendar, type CalendarProps } from "./calendar";

// Carousel
export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./carousel";

// Chart
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  type ChartConfig,
} from "./chart";

// Sidebar
export {
  useSidebar as useSidebarStatic,
  SidebarProvider as SidebarProviderStatic,
  Sidebar as SidebarStatic,
  SidebarTrigger as SidebarTriggerStatic,
  SidebarRail as SidebarRailStatic,
  SidebarInset as SidebarInsetStatic,
  SidebarInput as SidebarInputStatic,
  SidebarHeader as SidebarHeaderStatic,
  SidebarFooter as SidebarFooterStatic,
  SidebarSeparator as SidebarSeparatorStatic,
  SidebarContent as SidebarContentStatic,
  SidebarGroup as SidebarGroupStatic,
  SidebarGroupLabel as SidebarGroupLabelStatic,
  SidebarGroupAction as SidebarGroupActionStatic,
  SidebarGroupContent as SidebarGroupContentStatic,
  SidebarMenu as SidebarMenuStatic,
  SidebarMenuItem as SidebarMenuItemStatic,
  sidebarMenuButtonVariants,
  SidebarMenuButton as SidebarMenuButtonStatic,
  SidebarMenuAction as SidebarMenuActionStatic,
  SidebarMenuBadge as SidebarMenuBadgeStatic,
  SidebarMenuSkeleton as SidebarMenuSkeletonStatic,
  SidebarMenuSub as SidebarMenuSubStatic,
  SidebarMenuSubItem as SidebarMenuSubItemStatic,
  SidebarMenuSubButton as SidebarMenuSubButtonStatic,
} from "./sidebar";

export type ComponentVariant = "static";
