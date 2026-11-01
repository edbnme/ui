"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

// `default` leaves the trigger unstyled, for `render` or your own classes.
// `row` is a full-width row that fills on hover; `inline` is a quiet text
// toggle. Both end in a chevron that turns over while the panel is open.
const collapsibleTriggerVariants = cva("", {
  variants: {
    variant: {
      default: "",
      row: "group/collapsible-trigger flex min-h-control w-full items-center gap-2.5 rounded-control px-2 py-1 text-start leading-5 outline-none transition-[background-color] duration-100 pointer-coarse:min-h-control-touch focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.04]",
      inline:
        "group/collapsible-trigger inline-flex items-center gap-1 rounded-[2px] text-muted-foreground outline-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function CollapsibleTrigger({
  className,
  variant = "default",
  children,
  ...props
}: CollapsiblePrimitive.Trigger.Props &
  VariantProps<typeof collapsibleTriggerVariants>) {
  if (variant === "default") {
    return (
      <CollapsiblePrimitive.Trigger
        data-slot="collapsible-trigger"
        className={className}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Trigger>
    )
  }

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      data-variant={variant}
      className={cn(collapsibleTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        aria-hidden
        data-slot="collapsible-chevron"
        className={cn(
          "size-4 shrink-0 transition-transform duration-150 ease-(--motion-ease-out) group-data-panel-open/collapsible-trigger:rotate-180 motion-reduce:transition-none",
          variant === "row" && "ms-auto text-muted-foreground"
        )}
      />
    </CollapsiblePrimitive.Trigger>
  )
}

// Eases open to its height with a fade, like the accordion.
function CollapsibleContent({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-150 ease-out data-starting-style:h-0 data-starting-style:opacity-0 data-ending-style:h-0 data-ending-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  collapsibleTriggerVariants,
}
