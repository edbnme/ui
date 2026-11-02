"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function InputGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * `composer` is the chat prompt shell: a muted card with no border. With
   * an `inline-end` addon the text and the send button sit side by side;
   * with `block-start` or `block-end` addons they stack in rows.
   */
  variant?: "default" | "composer"
}) {
  return (
    <div
      data-slot="input-group"
      data-variant={variant}
      role="group"
      className={cn(
        "group/input-group relative flex h-control w-full min-w-0 items-center rounded-control border border-input bg-transparent pointer-coarse:min-h-control-touch transition-[color,background-color] duration-(--motion-duration-press) motion-reduce:transition-none outline-none has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-solid has-[[data-slot=input-group-control]:focus-visible]:-outline-offset-1 has-[[data-slot=input-group-control]:focus-visible]:outline-ring has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pe-1.5 has-[>[data-align=inline-start]]:[&>input]:ps-1.5",
        variant === "composer" &&
          "h-auto items-end gap-2 rounded-card border-transparent bg-muted py-2 ps-4 pe-2 pointer-coarse:h-auto *:data-[align^=inline]:m-0! *:data-[align^=inline]:p-0! has-[>[data-align^=block]]:items-stretch has-[>[data-align^=block]]:gap-0 has-[>[data-align^=block]]:p-0 *:data-[align=block-start]:px-4! *:data-[align=block-start]:pt-3! *:data-[align=block-start]:pb-0! *:data-[align=block-end]:px-2! *:data-[align=block-end]:pt-0! *:data-[align=block-end]:pb-2!",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-body text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-control-xs [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first ps-2 has-[>button]:-ms-[0.3rem] has-[>button]:py-0 has-[>kbd]:-ms-[0.15rem]",
        "inline-end":
          "order-last pe-2 has-[>button]:-me-[0.3rem] has-[>button]:py-0 has-[>kbd]:-me-[0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        const group = e.currentTarget.parentElement
        ;(
          group?.querySelector<HTMLElement>(
            "[data-slot=input-group-control]"
          ) ?? group?.querySelector("input")
        )?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-body shadow-none",
  {
    variants: {
      size: {
        // Inside a field a button keeps a 4px inset all round: 24px in the
        // 32px field, 32px in the 40px touch field, with the field's radius
        // less the inset. NumberField's steppers do the same.
        xs: "relative h-control-xs gap-1 rounded-control-xs px-1.5 text-small pointer-coarse:h-control pointer-coarse:min-h-0 pointer-coarse:min-w-0 after:absolute after:-inset-2 [&_svg:not([class*='size-'])]:size-3.5",
        // A 28px button, 2px in from the field's edge, so its radius is the
        // field's less 2 (8px); 36px in the touch field.
        sm: "h-control-sm gap-1 rounded-control-sm px-2 text-small pointer-coarse:h-control-lg pointer-coarse:min-h-0 pointer-coarse:min-w-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "relative size-control-xs rounded-control-xs p-0 pointer-coarse:size-control pointer-coarse:min-h-0 pointer-coarse:min-w-0 after:absolute after:-inset-2 has-[>svg]:p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-control-sm rounded-control-sm p-0 pointer-coarse:size-control-lg pointer-coarse:min-h-0 pointer-coarse:min-w-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  shape = "default",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      shape={shape}
      className={cn(
        inputGroupButtonVariants({ size }),
        shape === "round" && "rounded-full",
        className
      )}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-body text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "h-full flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 pointer-coarse:h-full focus-visible:ring-0 focus-visible:outline-none aria-invalid:ring-0",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 focus-visible:outline-none aria-invalid:ring-0",
        // In a composer the field grows with its text, then scrolls: from
        // one line beside the send button up to five, or in the stacked
        // layout from a touch-height row up to about six.
        "group-data-[variant=composer]/input-group:min-h-control-sm group-data-[variant=composer]/input-group:max-h-[calc(5lh+--spacing(1))] group-data-[variant=composer]/input-group:px-0 group-data-[variant=composer]/input-group:py-0.5 group-data-[variant=composer]/input-group:pointer-coarse:max-h-[calc(5lh+--spacing(5))] group-data-[variant=composer]/input-group:pointer-coarse:py-2.5",
        "group-data-[variant=composer]/input-group:group-has-[>[data-align^=block]]/input-group:min-h-control-touch group-data-[variant=composer]/input-group:group-has-[>[data-align^=block]]/input-group:max-h-40 group-data-[variant=composer]/input-group:group-has-[>[data-align^=block]]/input-group:px-4 group-data-[variant=composer]/input-group:group-has-[>[data-align^=block]]/input-group:pt-3 group-data-[variant=composer]/input-group:group-has-[>[data-align^=block]]/input-group:pb-1",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
