"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-control border border-transparent bg-clip-padding pointer-coarse:min-h-control-touch pointer-coarse:min-w-control-touch text-body whitespace-nowrap outline-none select-none transition-[color,background-color,opacity,scale] duration-100 data-[pointer-pressed]:duration-(--motion-duration-press) ease-(--motion-ease-out) data-[pointer-pressed]:not-aria-[haspopup]:scale-[.97] motion-reduce:transition-[color,background-color,opacity] motion-reduce:duration-100 motion-reduce:data-[pointer-pressed]:not-aria-[haspopup]:scale-100 motion-reduce:data-[pointer-pressed]:opacity-80 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/80",
        outline:
          "bg-foreground/[.04] text-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.07] aria-expanded:bg-foreground/[.07]",
        secondary:
          "bg-foreground/[.04] text-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.07] aria-expanded:bg-foreground/[.07]",
        ghost:
          "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.04] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground aria-expanded:bg-foreground/[.07] aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 text-[color-mix(in_oklch,var(--destructive),black_15%)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-destructive/15 aria-expanded:bg-destructive/15 focus-visible:outline-destructive dark:bg-destructive/20 dark:text-[color-mix(in_oklch,var(--destructive),white_25%)] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:underline",
      },
      size: {
        default:
          "h-control gap-1.5 px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
        xs: "h-control-xs gap-1 rounded-control-xs px-2 text-small in-data-[slot=button-group]:rounded-control has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-control-sm gap-1 rounded-control-sm px-2.5 text-small in-data-[slot=button-group]:rounded-control has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-control-lg gap-2 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        icon: "size-control",
        "icon-xs":
          "size-control-xs rounded-control-xs in-data-[slot=button-group]:rounded-control [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm":
          "size-control-sm rounded-control-sm in-data-[slot=button-group]:rounded-control",
        "icon-lg": "size-control-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  onLostPointerCapture,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const [pointerPressed, setPointerPressed] = React.useState(false)

  return (
    <ButtonPrimitive
      data-slot="button"
      data-pointer-pressed={pointerPressed || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      onPointerDown={(event) => {
        if (event.button === 0) setPointerPressed(true)
        onPointerDown?.(event)
      }}
      onPointerUp={(event) => {
        setPointerPressed(false)
        onPointerUp?.(event)
      }}
      onPointerCancel={(event) => {
        setPointerPressed(false)
        onPointerCancel?.(event)
      }}
      onPointerLeave={(event) => {
        setPointerPressed(false)
        onPointerLeave?.(event)
      }}
      onLostPointerCapture={(event) => {
        setPointerPressed(false)
        onLostPointerCapture?.(event)
      }}
      {...props}
    />
  )
}

export { Button, buttonVariants }
