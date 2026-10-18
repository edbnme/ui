"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-control border border-transparent bg-clip-padding pointer-coarse:min-h-10 pointer-coarse:min-w-10 text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,opacity,scale] duration-100 data-[pointer-pressed]:duration-(--motion-duration-press) ease-(--motion-ease-out) data-[pointer-pressed]:not-aria-[haspopup]:scale-[.97] motion-reduce:transition-[color,background-color,opacity] motion-reduce:duration-100 motion-reduce:data-[pointer-pressed]:not-aria-[haspopup]:scale-100 motion-reduce:data-[pointer-pressed]:opacity-80 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary/80",
        outline:
          "border-border bg-background [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[color-mix(in_oklch,var(--background),var(--foreground)_5%)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground aria-expanded:bg-[color-mix(in_oklch,var(--background),var(--foreground)_5%)] aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.05] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground aria-expanded:bg-foreground/[.05] aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive [@media(hover:hover)_and_(pointer:fine)]:hover:bg-destructive/15 aria-expanded:bg-destructive/15 focus-visible:outline-destructive dark:bg-destructive/20 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
        xs: "h-6 gap-1 rounded-[6px] px-2 text-xs in-data-[slot=button-group]:rounded-control has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[8px] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-control has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[6px] in-data-[slot=button-group]:rounded-control [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[8px] in-data-[slot=button-group]:rounded-control",
        "icon-lg": "size-9",
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
