/**
 * Component Variant Index
 *
 * This file provides a unified export system for animated components.
 * Components automatically use the correct variant based on the MotionProvider context.
 *
 * Usage:
 * - Import components from this file to get animation support
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
// STATIC COMPONENTS (No animation dependency)
// =============================================================================

export { Avatar, AvatarImage, AvatarFallback } from "./static/avatar";
export { Input } from "./static/input";
export { ScrollArea, ScrollBar } from "./static/scroll-area";
export { Separator } from "./static/separator";
export { Skeleton } from "./static/skeleton";
export { Slider } from "./static/slider";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./static/tooltip";

// =============================================================================
// VARIANT TYPES
// =============================================================================

export type ComponentVariant = "animated" | "static";
