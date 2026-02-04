/**
 * =============================================================================
 * SHARED UI COMPONENTS - Variant Agnostic
 * =============================================================================
 *
 * These components have no animation dependencies and work identically
 * in both animated and static contexts. They are the foundation layer
 * that both variants can safely import without cross-contamination.
 *
 * Components in this folder:
 * - Avatar: User avatars with image, fallback, and status indicators
 * - Input: Form input with focus states and validation styling
 * - ScrollArea: Custom scrollbar wrapper using Radix primitives
 * - Separator: Horizontal/vertical dividers
 * - Skeleton: Loading placeholder with CSS pulse animation
 * - Slider: Range slider with single/multiple thumbs
 * - Tooltip: Hover tooltips using Radix primitives
 *
 * Usage:
 *   import { Avatar, Input } from "@/components/ui/shared";
 *
 * @packageDocumentation
 */

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "./avatar";
export type { AvatarProps } from "./avatar";

export { Input } from "./input";

export { ScrollArea, ScrollBar } from "./scroll-area";

export { Separator } from "./separator";

export { Skeleton } from "./skeleton";

export { Slider } from "./slider";

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
} from "./tooltip";
