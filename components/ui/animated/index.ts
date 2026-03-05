// =============================================================================
// ANIMATED UI COMPONENTS - with motion/react
// =============================================================================
//
// These components use motion/react for spring animations and transitions.
// For static alternatives without motion dependencies, see ../static/
//

export * from "./button";
export * from "./alert-dialog";
export * from "./dropdown-menu";
export * from "./popover";
export * from "./pull-down";
export * from "./sheet";
export * from "./shimmering-text";
export * from "./slide-to-unlock";

// Re-export static components for convenience
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
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
} from "../static";
