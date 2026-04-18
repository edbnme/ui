/**
 * Static Icons Library
 *
 * CSS-only icon components for static components.
 * No motion/react dependency - uses pure CSS animations.
 *
 * These are drop-in replacements for the animated icon components
 * when using the static variant.
 *
 * @packageDocumentation
 * @registryDescription CSS-only icon components for static variants.
 * @registryTitle Static Icons
 */

"use client";

import * as React from "react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- STATIC LOADING SPINNER -------------------------------------------------

export interface StaticLoadingSpinnerProps {
  /** Size of the spinner in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional className */
  className?: string;
  /** Whether to show the spinner */
  show?: boolean;
}

/**
 * StaticLoadingSpinner - CSS-only loading indicator
 *
 * Uses CSS animation instead of motion/react for rotation.
 */
export function StaticLoadingSpinner({
  size = 16,
  strokeWidth = 2,
  className,
  show = true,
}: StaticLoadingSpinnerProps) {
  if (!show) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeOpacity={0.25}
        fill="none"
      />
      <path
        d="M12 2C6.477 2 2 6.477 2 12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ---- STATIC CHECKMARK ICON --------------------------------------------------

export interface StaticCheckProps {
  /** Size of the checkmark in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional className */
  className?: string;
  /** Whether to show the checkmark */
  show?: boolean;
}

/**
 * StaticCheck - Simple checkmark without draw animation
 *
 * Shows immediately with a fade-in effect.
 */
export function StaticCheck({
  size = 24,
  strokeWidth = 2,
  className,
  show = true,
}: StaticCheckProps) {
  if (!show) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-in fade-in-0 zoom-in-95 duration-200", className)}
      aria-hidden="true"
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ---- STATIC CLOSE BUTTON ----------------------------------------------------

export interface StaticCloseButtonProps {
  /** Click handler */
  onClick?: () => void;
  /** Size of the button */
  size?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
  /** ARIA label */
  "aria-label"?: string;
}

const sizeMap = {
  sm: { button: 24, icon: 14 },
  md: { button: 32, icon: 18 },
  lg: { button: 40, icon: 22 },
};

/**
 * StaticCloseButton - Close button with CSS transitions
 */
export function StaticCloseButton({
  onClick,
  size = "md",
  className,
  "aria-label": ariaLabel = "Close",
}: StaticCloseButtonProps) {
  const dimensions = sizeMap[size];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "bg-muted/50 text-muted-foreground",
        "transition-all duration-150 ease-out",
        "hover:bg-muted hover:text-foreground hover:scale-105",
        "active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      style={{
        width: dimensions.button,
        height: dimensions.button,
      }}
      aria-label={ariaLabel}
    >
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
}

// ---- STATIC ICON WRAPPER ----------------------------------------------------

export interface StaticIconProps extends React.SVGProps<SVGSVGElement> {
  /** The Phosphor icon component to render */
  icon: Icon;
  /** Size of the icon */
  size?: number | string;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional className */
  className?: string;
}

/**
 * StaticIcon - Renders a Phosphor icon without motion dependencies
 *
 * Use this as a drop-in replacement for AnimatedIcon in static components.
 */
export function StaticIcon({
  icon: IconComponent,
  className,
  size,
  strokeWidth = 2,
  ref: _ref,
  ...props
}: StaticIconProps) {
  return (
    <span className={cn("inline-flex shrink-0", className)}>
      <IconComponent
        size={size}
        strokeWidth={strokeWidth}
        {...(props as Omit<React.SVGProps<SVGSVGElement>, "ref">)}
      />
    </span>
  );
}

// ---- STATIC ICON MORPH ------------------------------------------------------

export interface StaticIconMorphProps {
  /** First icon (shown when isActive is false) */
  iconA: Icon;
  /** Second icon (shown when isActive is true) */
  iconB: Icon;
  /** Current state */
  isActive: boolean;
  /** Icon size */
  size?: number | string;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional className */
  className?: string;
}

/**
 * StaticIconMorph - Switches between two icons with CSS fade
 *
 * Use this as a drop-in replacement for IconMorph in static components.
 */
export function StaticIconMorph({
  iconA: IconA,
  iconB: IconB,
  isActive,
  size = 24,
  strokeWidth = 2,
  className,
}: StaticIconMorphProps) {
  const CurrentIcon = isActive ? IconB : IconA;

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center",
        "transition-transform duration-150 ease-out",
        className
      )}
      style={{ width: size, height: size }}
    >
      <CurrentIcon
        size={size}
        strokeWidth={strokeWidth}
        className="animate-in fade-in-0 zoom-in-95 duration-150"
      />
    </span>
  );
}

// ---- STATIC CHEVRON ---------------------------------------------------------

export interface StaticChevronProps {
  /** Direction/rotation state */
  direction: "up" | "down" | "left" | "right";
  /** Size of the chevron */
  size?: number;
  /** Additional className */
  className?: string;
}

const directionRotation = {
  up: "-rotate-180",
  down: "rotate-0",
  left: "rotate-90",
  right: "-rotate-90",
};

/**
 * StaticChevron - CSS-animated rotatable chevron
 */
export function StaticChevron({
  direction = "down",
  size = 16,
  className,
}: StaticChevronProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "transition-transform duration-200 ease-out",
        directionRotation[direction],
        className
      )}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ---- LOADING DOTS -----------------------------------------------------------

export interface StaticLoadingDotsProps {
  /** Size of each dot */
  dotSize?: number;
  /** Gap between dots */
  gap?: number;
  /** Additional className */
  className?: string;
}

/**
 * StaticLoadingDots - Three bouncing dots animation
 */
export function StaticLoadingDots({
  dotSize = 4,
  gap = 4,
  className,
}: StaticLoadingDotsProps) {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap }}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="rounded-full bg-current static-loading-dot"
          style={{
            width: dotSize,
            height: dotSize,
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}
