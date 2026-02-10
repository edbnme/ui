/**
 * Button Component (Static Version)
 *
 * A production-grade button without motion animations.
 * Uses CSS transitions for subtle feedback while avoiding motion library dependencies.
 *
 * This is the static variant - use the animated variant for full spring animations.
 *
 * @packageDocumentation
 */

"use client";

// =============================================================================
// IMPORTS
// =============================================================================

import * as React from "react";
import {
  forwardRef,
  useCallback,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

import { Slot } from "@/lib/primitives";
import { cva, type VariantProps } from "class-variance-authority";
import type { Icon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { useRipple } from "@/hooks/use-ripple";
import { StaticLoadingSpinner, StaticCheck } from "@/lib/icons-static";

// =============================================================================
// VARIANTS (CVA)
// =============================================================================

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0",
    "text-sm font-medium",
    "rounded-lg",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-150",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "select-none",
    // CSS-based interaction feedback
    "active:scale-[0.98] active:transition-transform",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "shadow-sm shadow-primary/20",
          "hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25",
          "active:shadow-sm",
        ].join(" "),

        destructive: [
          "bg-destructive text-white",
          "shadow-sm shadow-destructive/20",
          "hover:bg-destructive/90 hover:shadow-md hover:shadow-destructive/25",
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          "dark:bg-destructive/80",
        ].join(" "),

        outline: [
          "border border-input bg-background",
          "shadow-xs",
          "hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
          "dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ].join(" "),

        secondary: [
          "bg-secondary text-secondary-foreground",
          "shadow-xs",
          "hover:bg-secondary/80 hover:shadow-sm",
        ].join(" "),

        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "dark:hover:bg-accent/50",
        ].join(" "),

        link: ["text-primary underline-offset-4", "hover:underline"].join(" "),
      },

      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-md gap-1.5 px-4 text-xs has-[>svg]:px-3",
        lg: "h-11 rounded-lg px-7 text-base has-[>svg]:px-5",
        xl: "h-12 rounded-xl px-8 text-base has-[>svg]:px-6",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "ref">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  success?: boolean;
  iconStart?: Icon;
  iconEnd?: Icon;
}

// =============================================================================
// BUTTON COMPONENT
// =============================================================================

const Button = forwardRef<ElementRef<"button">, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      success = false,
      iconStart: IconStart,
      iconEnd: IconEnd,
      disabled,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const { ripples, createRipple } = useRipple();
    const showRipple = variant !== "ghost" && variant !== "link";

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!loading && !success && showRipple) {
          createRipple(event);
        }
        onClick?.(event);
      },
      [loading, success, showRipple, createRipple, onClick],
    );

    const iconSize = size === "sm" || size === "icon-sm" ? 14 : 16;

    const iconStartContent =
      IconStart && !loading && !success ? (
        <IconStart className="shrink-0" size={iconSize} aria-hidden="true" />
      ) : null;

    const loadingSpinner = loading ? (
      <StaticLoadingSpinner size={iconSize} />
    ) : null;

    const successCheck =
      success && !loading ? <StaticCheck size={iconSize} /> : null;

    const iconEndContent =
      IconEnd && !loading && !success ? (
        <IconEnd className="shrink-0" size={iconSize} aria-hidden="true" />
      ) : null;

    const buttonContent = (
      <>
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loadingSpinner}
          {successCheck}
          {iconStartContent}
          {children}
          {iconEndContent}
        </span>

        {showRipple && (
          <span
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              opacity: loading || success ? 0 : 1,
              transition: "opacity 200ms ease-out",
            }}
            aria-hidden="true"
          >
            {ripples.map((ripple) => (
              <span
                className="animate-rippling absolute rounded-full opacity-30"
                key={ripple.key}
                style={{
                  width: `${ripple.size}px`,
                  height: `${ripple.size}px`,
                  top: `${ripple.y}px`,
                  left: `${ripple.x}px`,
                  backgroundColor: "currentColor",
                  transform: "scale(0)",
                }}
              />
            ))}
          </span>
        )}
      </>
    );

    const commonProps = {
      "data-slot": "button",
      "data-loading": loading || undefined,
      "data-success": success || undefined,
      className: cn(
        buttonVariants({ variant, size, className }),
        showRipple && "relative overflow-hidden",
      ),
      disabled: isDisabled,
      "aria-busy": loading || undefined,
      "aria-disabled": isDisabled || undefined,
      onClick: handleClick,
      ...props,
    };

    if (asChild) {
      return (
        <Slot ref={ref} {...commonProps}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} {...commonProps}>
        {buttonContent}
      </button>
    );
  },
);

Button.displayName = "Button";

// =============================================================================
// ICON BUTTON COMPONENT
// =============================================================================

export interface IconButtonProps
  extends Omit<ButtonProps, "iconStart" | "iconEnd" | "children" | "asChild"> {
  icon: Icon;
  "aria-label": string;
}

const IconButton = forwardRef<ElementRef<"button">, IconButtonProps>(
  ({ icon, size = "icon", ...props }, ref) => {
    return <Button ref={ref} size={size} iconStart={icon} {...props} />;
  },
);

IconButton.displayName = "IconButton";

// =============================================================================
// EXPORTS
// =============================================================================

export { Button, IconButton, buttonVariants };
export type { ButtonProps as ButtonRootProps };
