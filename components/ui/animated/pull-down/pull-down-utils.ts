/**
 * PullDown animation utilities — Constants, spring configs, blur helpers, and
 * CSS variable builders shared across pull-down sub-components.
 * @module pull-down/pull-down-utils
 */
"use client";

import type { CSSProperties } from "react";
import type {
  PullDownDirection,
  PullDownAnchor,
  PullDownAnimationConfig,
  PullDownSpringConfig,
} from "./pull-down-context";

// =============================================================================
// ANIMATION CONSTANTS
// =============================================================================

export const DEFAULT_ANIMATION_CONFIG: Required<PullDownAnimationConfig> = {
  morphStiffness: 382,
  morphDamping: 29,
  contentStiffness: 403,
  contentDamping: 36,
  contentDelay: 0.03,
  contentScale: 0.95,
  triggerBlur: 8,
  contentBlur: 10,
};

export const REDUCED_MOTION_SPRING: PullDownSpringConfig = {
  stiffness: 1000,
  damping: 100,
};

export const CONTENT_BLUR = 8;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/** Calculate base position styles based on direction */
export function getPositionStyles(direction: PullDownDirection): CSSProperties {
  const styles: CSSProperties = {
    position: "absolute",
  };

  switch (direction) {
    case "top":
      styles.bottom = 0;
      styles.left = 0;
      break;
    case "bottom":
      styles.top = 0;
      styles.left = 0;
      break;
    case "left":
      styles.right = 0;
      styles.bottom = 0;
      break;
    case "right":
      styles.left = 0;
      styles.bottom = 0;
      break;
  }

  return styles;
}

/** Calculate anchor offset for menu alignment */
export function getAnchorOffset(
  direction: PullDownDirection,
  anchor: PullDownAnchor,
  menuWidth: number,
  menuHeight: number,
  buttonWidth: number,
  buttonHeight: number
) {
  if (anchor === "start") {
    return { x: 0, y: 0 };
  }

  const offsetAmount = anchor === "center" ? 0.5 : 1;

  if (direction === "top" || direction === "bottom") {
    const xOffset = -(menuWidth - buttonWidth) * offsetAmount;
    return { x: xOffset, y: 0 };
  } else {
    const yOffset = (menuHeight - buttonHeight) * offsetAmount;
    return { x: 0, y: yOffset };
  }
}

/** Calculate transform origin based on direction and anchor */
export function getTransformOrigin(
  direction: PullDownDirection,
  anchor: PullDownAnchor
): string {
  const vertical =
    direction === "top" ? "bottom" : direction === "bottom" ? "top" : "center";
  const horizontal =
    direction === "left" ? "right" : direction === "right" ? "left" : "center";

  if (direction === "top" || direction === "bottom") {
    const h =
      anchor === "start" ? "left" : anchor === "end" ? "right" : "center";
    return `${h} ${vertical}`;
  } else {
    const v =
      anchor === "start" ? "bottom" : anchor === "end" ? "top" : "center";
    return `${horizontal} ${v}`;
  }
}

/** Calculate animation offset based on direction */
export function getAnimationOffset(
  direction: PullDownDirection,
  amount: number
) {
  switch (direction) {
    case "top":
      return { y: -amount };
    case "bottom":
      return { y: amount };
    case "left":
      return { x: -amount };
    case "right":
      return { x: amount };
  }
}
