export { PopoverRoot, PopoverTrigger, PopoverLabel } from "./popover";
export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverLabelProps,
} from "./popover";

export { PopoverContent } from "./popover-content";
export type { PopoverContentProps } from "./popover-content";

export {
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverBody,
  PopoverFooter,
  PopoverClose,
} from "./popover-parts";
export type {
  PopoverHeaderProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
  PopoverBodyProps,
  PopoverFooterProps,
  PopoverCloseProps,
} from "./popover-parts";

// Alias for convenience
import { PopoverRoot } from "./popover";
const Popover = PopoverRoot;
export { Popover };
