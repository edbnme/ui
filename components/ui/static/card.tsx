/**
 * Card — Content container with variant styles.
 * Supports default, solid, ghost, and elevated variants.
 *
 * @example
 * <Card variant="elevated">
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Body content</CardContent>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// =============================================================================
// Card Variants
// =============================================================================

const cardVariants = cva(
  // Base styles shared across all variants
  "rounded-2xl text-card-foreground overflow-hidden transition-colors duration-200",
  {
    variants: {
      variant: {
        default: [
          // Translucent gradient background matching showcase aesthetic
          "bg-linear-to-br from-muted/30 via-background/80 to-background/95",
          // Ring border — cleaner at rounded corners than border
          "ring-1 ring-border ring-inset",
        ],
        solid: [
          // Traditional opaque card
          "bg-card border border-border shadow-sm",
        ],
        ghost: [
          // No visible boundary — blends into background
          "bg-transparent",
        ],
        elevated: [
          // Raised card with stronger shadow
          "bg-card border border-border shadow-md hover:shadow-lg",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// =============================================================================
// Card
// =============================================================================

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

// =============================================================================
// Card Header
// =============================================================================

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn(
      "flex flex-col gap-1.5 px-5 py-4",
      // Contrasting background for visual separation
      "bg-muted/40 dark:bg-muted/30",
      // Bottom separator
      "border-b border-border/50",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// =============================================================================
// Card Title
// =============================================================================

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-title"
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// =============================================================================
// Card Description
// =============================================================================

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// =============================================================================
// Card Content
// =============================================================================

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn("p-5 pt-4", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// =============================================================================
// Card Footer
// =============================================================================

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn(
      "flex items-center gap-2 px-5 py-4",
      // Contrasting background for visual separation
      "bg-muted/40 dark:bg-muted/30",
      // Top separator
      "border-t border-border/50",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// =============================================================================
// Exports
// =============================================================================

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
