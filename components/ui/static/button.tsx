/**
 * Button — CSS-only button with CVA variants. No motion dependency.
 *
 * @example
 * <Button variant="default" size="md">Click me</Button>
 * <Button variant="outline" size="sm">Outline</Button>
 * <Button variant="ghost" size="icon"><PlusIcon /></Button>
 *
 * @see Built without Base UI primitive (custom implementation)
 */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// =============================================================================
// BUTTON VARIANTS
// =============================================================================

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "transition-colors duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none cursor-pointer",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline:
          "border border-border bg-background text-foreground hover:bg-muted active:bg-muted/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "text-foreground hover:bg-muted active:bg-muted/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs [&_svg]:size-3.5",
        md: "h-9 px-4 py-2 [&_svg]:size-4",
        lg: "h-10 rounded-md px-6 text-base [&_svg]:size-5",
        icon: "h-9 w-9 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// =============================================================================
// BUTTON
// =============================================================================

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child element (e.g. a Link) */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// =============================================================================
// ICON BUTTON (convenience wrapper)
// =============================================================================

export interface IconButtonProps extends ButtonProps {}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "icon", ...props }, ref) => (
    <Button
      ref={ref}
      size={size}
      className={cn("rounded-full", className)}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";

// =============================================================================
// EXPORTS
// =============================================================================

export { Button, IconButton, buttonVariants };
