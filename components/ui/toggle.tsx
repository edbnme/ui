"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-control border border-transparent bg-clip-padding text-body whitespace-nowrap transition-[color,background-color] duration-100 motion-reduce:transition-none pointer-coarse:min-h-control-touch pointer-coarse:min-w-control-touch outline-none text-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.04] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-pressed:bg-primary data-pressed:text-primary-foreground [@media(hover:hover)_and_(pointer:fine)]:data-pressed:hover:bg-primary/90 [@media(hover:hover)_and_(pointer:fine)]:data-pressed:hover:text-primary-foreground forced-colors:data-pressed:bg-[Highlight] forced-colors:data-pressed:text-[HighlightText] dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "bg-foreground/[.04] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.07]",
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        sm: "h-control-sm min-w-control-sm rounded-control-sm px-2 text-small has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-control-lg min-w-control-lg px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
