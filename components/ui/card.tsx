/**
 * Card — Content container with variant styles.
 *
 * A composable card surface with four visual styles: `default` (subtle
 * gradient ring), `solid` (opaque bg + shadow), `ghost` (transparent),
 * and `elevated` (stronger shadow with hover lift). Compose with
 * `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and
 * `CardFooter` for a polished layout with contrasting header/footer
 * bands.
 *
 * Anatomy:
 * ```tsx
 * <Card variant="elevated">
 *   <CardHeader>
 *     <CardTitle>Billing</CardTitle>
 *     <CardDescription>Manage your subscription.</CardDescription>
 *   </CardHeader>
 *   <CardContent>Body content</CardContent>
 *   <CardFooter>
 *     <Button>Upgrade</Button>
 *   </CardFooter>
 * </Card>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/card
 * @registryDescription Container component with header, content, and footer sections.
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---- VARIANTS ---------------------------------------------------------------

const cardVariants = cva(
  "rounded-2xl text-card-foreground overflow-hidden transition-colors duration-200 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: [
          "bg-linear-to-br from-muted/30 via-background/80 to-background/95",
          "ring-1 ring-border ring-inset",
        ],
        solid: ["bg-card border border-border shadow-sm"],
        ghost: ["bg-transparent"],
        elevated: [
          "bg-card border border-border shadow-md hover:shadow-lg",
        ],
      },
    },
    defaultVariants: { variant: "default" },
  }
);

// ---- CARD -------------------------------------------------------------------

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Themed container surface. Use the sub-parts (`CardHeader`, `CardTitle`,
 * `CardDescription`, `CardContent`, `CardFooter`) to compose a consistent
 * layout.
 *
 * @since 0.1.0
 */
function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}
Card.displayName = "Card";

// ---- HEADER -----------------------------------------------------------------

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Header band with a contrasting background and bottom separator.
 *
 * @since 0.1.0
 */
function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 px-5 py-4",
        "bg-muted/40 dark:bg-muted/30",
        "border-b border-border/50",
        className
      )}
      {...props}
    />
  );
}
CardHeader.displayName = "CardHeader";

// ---- TITLE ------------------------------------------------------------------

export type CardTitleProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Card title — renders a visually-prominent heading. Upgrade to a real
 * heading element via `asChild` if you need an `<h2>`.
 *
 * @since 0.1.0
 */
function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}
CardTitle.displayName = "CardTitle";

// ---- DESCRIPTION ------------------------------------------------------------

export type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Muted supporting copy that pairs with `CardTitle`.
 *
 * @since 0.1.0
 */
function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
CardDescription.displayName = "CardDescription";

// ---- CONTENT ----------------------------------------------------------------

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Main body of the card.
 *
 * @since 0.1.0
 */
function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-5 pt-4", className)}
      {...props}
    />
  );
}
CardContent.displayName = "CardContent";

// ---- FOOTER -----------------------------------------------------------------

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Footer band with a contrasting background and top separator. Ideal
 * for action rows.
 *
 * @since 0.1.0
 */
function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2 px-5 py-4",
        "bg-muted/40 dark:bg-muted/30",
        "border-t border-border/50",
        className
      )}
      {...props}
    />
  );
}
CardFooter.displayName = "CardFooter";

// ---- EXPORTS ----------------------------------------------------------------

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
