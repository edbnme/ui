/**
 * Button — CSS-only button with CVA variants. No motion dependency.
 *
 * A zero-dependency button that composes `class-variance-authority` for
 * variants (`default`, `destructive`, `outline`, `secondary`, `ghost`,
 * `link`) and sizes (`sm`, `md`, `lg`, `icon`). Pass `asChild` to render
 * the styles on any child (e.g. a `next/link` `<a>`) via the `Slot`
 * primitive. An `IconButton` convenience wrapper is also exported with
 * `size="icon"` and a rounded-full default.
 *
 * Anatomy:
 * ```tsx
 * <Button variant="default" size="md">Save</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 * <Button asChild><Link href="/x">Go</Link></Button>
 * <IconButton aria-label="Add"><PlusIcon /></IconButton>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/button
 * @registryDescription Static button component with CSS transitions only. No motion dependency required.
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Slot } from "@/lib/slot";

// ---- VARIANTS ---------------------------------------------------------------

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "transition-colors duration-150 motion-reduce:transition-none",
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

// ---- BUTTON -----------------------------------------------------------------

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the button styles onto the single child element. */
  asChild?: boolean;
}

/**
 * Themed button with CVA variants. Pass `asChild` to style any child
 * element (e.g. a link) without adding an extra DOM node.
 *
 * @since 0.1.0
 */
function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
Button.displayName = "Button";

// ---- ICON BUTTON ------------------------------------------------------------

export type IconButtonProps = ButtonProps;

/**
 * Convenience wrapper around `Button` with `size="icon"` and a
 * rounded-full default. Always pass an `aria-label`.
 *
 * @since 0.1.0
 */
function IconButton({ className, size = "icon", ...props }: IconButtonProps) {
  return (
    <Button
      data-slot="icon-button"
      size={size}
      className={cn("rounded-full", className)}
      {...props}
    />
  );
}
IconButton.displayName = "IconButton";

// ---- EXPORTS ----------------------------------------------------------------

export { Button, IconButton, buttonVariants };
