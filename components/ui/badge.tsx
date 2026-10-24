import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs whitespace-nowrap tabular-nums transition-[color,background-color] duration-(--motion-duration-press) motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3!",
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
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
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

export { Badge, badgeVariants }
