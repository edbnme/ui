import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-token w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 text-micro whitespace-nowrap tabular-nums transition-[color,background-color] duration-(--motion-duration-press) motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/80",
        secondary:
          "bg-foreground/[.04] text-foreground [a]:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.07]",
        destructive:
          "bg-destructive/10 text-[color-mix(in_oklch,var(--destructive),black_15%)] focus-visible:outline-destructive dark:bg-destructive/20 dark:text-[color-mix(in_oklch,var(--destructive),white_25%)] [a]:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-destructive/20",
        outline:
          "bg-popover text-foreground shadow-[0_1px_2px_rgb(16_16_20/0.08)] dark:bg-foreground/10 dark:shadow-none [a]:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted dark:[a]:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.14]",
        ghost:
          "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.04]",
        link: "text-primary underline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:underline",
      },
      size: {
        default: "",
        // A number that keeps its width as it changes: 1, 9 and 99 sit in
        // the same centred pill.
        count: "min-w-5 px-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const badgeDotVariants = cva(
  "inline-block shrink-0 rounded-full bg-primary",
  {
    variants: {
      size: {
        default: "size-2",
        sm: "size-1.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

// An unread marker. Decorative unless it carries a `label`, which screen
// readers announce in its place.
function BadgeDot({
  className,
  size = "default",
  label,
  render,
  children,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeDotVariants> & { label?: string }) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        "aria-hidden": label ? undefined : true,
        className: cn(badgeDotVariants({ size }), className),
        children: label ? <span className="sr-only">{label}</span> : children,
      },
      props
    ),
    render,
    state: {
      slot: "badge-dot",
    },
  })
}

export { Badge, BadgeDot, badgeDotVariants, badgeVariants }
