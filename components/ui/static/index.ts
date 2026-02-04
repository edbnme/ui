// =============================================================================
// STATIC UI COMPONENTS - shadcn-style, no motion dependencies
// =============================================================================
//
// These components use CSS transitions and Radix UI primitives only.
// Ideal for projects that want minimal bundle size without motion/react.
// For animated alternatives, see ../animated/
//
// IMPORTANT: Static components should NEVER import from animated/
// They should import shared components from ../shared/
//

export * from "./button";
export * from "./alert-dialog";
export * from "./dropdown-menu";
export * from "./popover";
export * from "./pull-down";
export * from "./sheet";
export * from "./sidebar";

// Re-export shared components for convenience
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  Input,
  ScrollArea,
  ScrollBar,
  Separator,
  Skeleton,
  Slider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../shared";
