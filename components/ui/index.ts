/**
 * Component Variant Index
 *
 * This file provides a unified export system for animated and static component variants.
 * Components automatically use the correct variant based on the VariantProvider context.
 *
 * Usage:
 * - Import components from this file to get auto-variant-switching behavior
 * - Or import directly from animated/ or static/ folders for explicit control
 *
 * @packageDocumentation
 */

// =============================================================================
// RE-EXPORTS FROM ANIMATED (Default)
// These components support disableAnimation prop and respect MotionProvider
// =============================================================================

// Button
export { Button, IconButton, buttonVariants } from "./animated/button";
export type {
  ButtonProps,
  IconButtonProps,
  ButtonRootProps,
} from "./animated/button";

// Alert Dialog
export {
  AlertDialog,
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogContainer,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogSubtitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogImage,
} from "./animated/alert-dialog";

// Dropdown Menu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./animated/dropdown-menu";

// Popover
export {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverLabel,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverBody,
  PopoverFooter,
  PopoverClose,
} from "./animated/popover";

// Pull Down Menu
export {
  PullDown,
  PullDownRoot,
  PullDownContainer,
  PullDownTrigger,
  PullDownContent,
  PullDownItem,
  PullDownPortal,
  PullDownOverlay,
  PullDownSeparator,
  PullDownLabel,
  PullDownSubMenu,
  PullDownSubMenuTrigger,
  PullDownSubMenuContent,
  PullDownChevron,
} from "./animated/pull-down";

// Sheet
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetBody,
} from "./animated/sheet";

// =============================================================================
// SHARED COMPONENTS (No animation dependency)
// These are variant-agnostic and work with both animated and static
// =============================================================================

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
} from "./shared/avatar";
export { Input } from "./shared/input";
export { ScrollArea, ScrollBar } from "./shared/scroll-area";
export { Separator } from "./shared/separator";
export { Skeleton } from "./shared/skeleton";
export { Slider } from "./shared/slider";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./shared/tooltip";

// =============================================================================
// STATIC COMPONENT VARIANTS
// Import these directly when you want no motion dependencies
// =============================================================================

export {
  Button as StaticButton,
  IconButton as StaticIconButton,
  buttonVariants as staticButtonVariants,
} from "./static/button";

export {
  AlertDialog as StaticAlertDialog,
  AlertDialogRoot as StaticAlertDialogRoot,
  AlertDialogTrigger as StaticAlertDialogTrigger,
  AlertDialogContainer as StaticAlertDialogContainer,
  AlertDialogContent as StaticAlertDialogContent,
  AlertDialogHeader as StaticAlertDialogHeader,
  AlertDialogBody as StaticAlertDialogBody,
  AlertDialogFooter as StaticAlertDialogFooter,
  AlertDialogTitle as StaticAlertDialogTitle,
  AlertDialogSubtitle as StaticAlertDialogSubtitle,
  AlertDialogDescription as StaticAlertDialogDescription,
  AlertDialogAction as StaticAlertDialogAction,
  AlertDialogCancel as StaticAlertDialogCancel,
  AlertDialogClose as StaticAlertDialogClose,
  AlertDialogImage as StaticAlertDialogImage,
} from "./static/alert-dialog";

export {
  Popover as StaticPopover,
  PopoverRoot as StaticPopoverRoot,
  PopoverTrigger as StaticPopoverTrigger,
  PopoverLabel as StaticPopoverLabel,
  PopoverContent as StaticPopoverContent,
  PopoverHeader as StaticPopoverHeader,
  PopoverTitle as StaticPopoverTitle,
  PopoverDescription as StaticPopoverDescription,
  PopoverBody as StaticPopoverBody,
  PopoverFooter as StaticPopoverFooter,
  PopoverClose as StaticPopoverClose,
} from "./static/popover";

export {
  DropdownMenu as StaticDropdownMenu,
  DropdownMenuPortal as StaticDropdownMenuPortal,
  DropdownMenuTrigger as StaticDropdownMenuTrigger,
  DropdownMenuContent as StaticDropdownMenuContent,
  DropdownMenuGroup as StaticDropdownMenuGroup,
  DropdownMenuItem as StaticDropdownMenuItem,
  DropdownMenuCheckboxItem as StaticDropdownMenuCheckboxItem,
  DropdownMenuRadioGroup as StaticDropdownMenuRadioGroup,
  DropdownMenuRadioItem as StaticDropdownMenuRadioItem,
  DropdownMenuLabel as StaticDropdownMenuLabel,
  DropdownMenuSeparator as StaticDropdownMenuSeparator,
  DropdownMenuShortcut as StaticDropdownMenuShortcut,
  DropdownMenuSub as StaticDropdownMenuSub,
  DropdownMenuSubTrigger as StaticDropdownMenuSubTrigger,
  DropdownMenuSubContent as StaticDropdownMenuSubContent,
} from "./static/dropdown-menu";

export {
  Sheet as StaticSheet,
  SheetPortal as StaticSheetPortal,
  SheetOverlay as StaticSheetOverlay,
  SheetTrigger as StaticSheetTrigger,
  SheetClose as StaticSheetClose,
  SheetContent as StaticSheetContent,
  SheetHeader as StaticSheetHeader,
  SheetFooter as StaticSheetFooter,
  SheetTitle as StaticSheetTitle,
  SheetDescription as StaticSheetDescription,
  SheetBody as StaticSheetBody,
} from "./static/sheet";

export {
  PullDown as StaticPullDown,
  PullDownRoot as StaticPullDownRoot,
  PullDownContainer as StaticPullDownContainer,
  PullDownTrigger as StaticPullDownTrigger,
  PullDownContent as StaticPullDownContent,
  PullDownItem as StaticPullDownItem,
  PullDownPortal as StaticPullDownPortal,
  PullDownOverlay as StaticPullDownOverlay,
  PullDownSeparator as StaticPullDownSeparator,
  PullDownLabel as StaticPullDownLabel,
  PullDownSubMenu as StaticPullDownSubMenu,
  PullDownSubMenuTrigger as StaticPullDownSubMenuTrigger,
  PullDownSubMenuContent as StaticPullDownSubMenuContent,
  PullDownChevron as StaticPullDownChevron,
} from "./static/pull-down";

// =============================================================================
// VARIANT TYPES
// =============================================================================

export type ComponentVariant = "animated" | "static";
