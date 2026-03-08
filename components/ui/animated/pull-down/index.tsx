/**
 * Pull Down Menu Component
 *
 * A pull down menu with morphing animations. The trigger morphs
 * into the menu container, creating a fluid, native-feeling interaction.
 *
 * Features spring physics and blur transitions for smooth, organic motion.
 *
 * ---
 * Inspired by and adapted from **bloom-menu** by Josh Puckett.
 * Original project: https://github.com/joshpuckett/bloom
 * Licensed under MIT License.
 * ---
 *
 * @packageDocumentation
 */

// Re-export all types
export type {
  PullDownDirection,
  PullDownAnchor,
  PullDownSpringConfig,
  PullDownAnimationConfig,
  PullDownContextValue,
  PullDownProps,
  PullDownContainerProps,
  PullDownTriggerProps,
  PullDownContentProps,
  PullDownItemProps,
  PullDownPortalProps,
  PullDownOverlayProps,
  PullDownSubMenuProps,
  PullDownSubMenuTriggerProps,
  PullDownSubMenuContentProps,
} from "./pull-down-context";

// Import components for compound export
import { Root } from "./pull-down";
import { Container } from "./pull-down-container";
import { Trigger, Content } from "./pull-down-content";
import { Item, Portal, Overlay, Separator, Label } from "./pull-down-items";
import {
  SubMenu,
  SubMenuTrigger,
  SubMenuContent,
  PullDownChevron,
} from "./pull-down-submenu";

// =============================================================================
// COMPOUND EXPORT
// =============================================================================

export const PullDown = Object.assign(Root, {
  Container,
  Trigger,
  Content,
  Item,
  Portal,
  Overlay,
  Separator,
  Label,
  SubMenu,
  SubMenuTrigger,
  SubMenuContent,
  Chevron: PullDownChevron,
});

// =============================================================================
// INDIVIDUAL EXPORTS
// =============================================================================

export {
  Root as PullDownRoot,
  Container as PullDownContainer,
  Trigger as PullDownTrigger,
  Content as PullDownContent,
  Item as PullDownItem,
  Portal as PullDownPortal,
  Overlay as PullDownOverlay,
  Separator as PullDownSeparator,
  Label as PullDownLabel,
  SubMenu as PullDownSubMenu,
  SubMenuTrigger as PullDownSubMenuTrigger,
  SubMenuContent as PullDownSubMenuContent,
  PullDownChevron,
};
