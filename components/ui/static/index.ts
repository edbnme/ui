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
  AlertDialogViewport,
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
  DialogViewport,
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
  Tooltip,
  TooltipContent,
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
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollArea,
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
  ToastViewport,
  ToastRoot,
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
  SheetPopup,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  sheetVariants,
} from "./sheet";

// Drawer
export {
  DrawerRoot,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerViewport,
  DrawerPopup,
  DrawerHandle,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer";

// Hover Card
export {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardPositioner,
  HoverCardPopup,
  HoverCardArrow,
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
  MenubarPositioner,
  MenubarPopup,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarSeparator,
  MenubarSubmenuRoot,
  MenubarSubmenuTrigger,
  MenubarShortcut,
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
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
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
