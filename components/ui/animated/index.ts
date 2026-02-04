// =============================================================================
// ANIMATED UI COMPONENTS - with motion/react
// =============================================================================
//
// These components use motion/react for spring animations and transitions.
// For static alternatives without motion dependencies, see ../static/
//
// IMPORTANT: Animated components should import shared components from ../shared/
// to maintain proper isolation between variants.
//

export * from "./button";
export * from "./alert-dialog";
export * from "./dropdown-menu";
export * from "./popover";
export * from "./pull-down";
export * from "./sheet";

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
