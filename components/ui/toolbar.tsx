"use client"

import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { textLinkVariants } from "@/components/ui/text-link"

// One tab stop; arrow keys move between the items. Toggle groups inside it
// (ToggleGroup + ToggleGroupItem) join the same arrow-key order. `ghost`
// drops the muted fill, for a toolbar that sits on a panel of its own.
const toolbarVariants = cva(
  "flex w-fit items-center gap-0.5 rounded-panel p-1 data-vertical:flex-col data-vertical:items-stretch",
  {
    variants: {
      variant: {
        default: "bg-muted",
        ghost: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Toolbar({
  className,
  variant = "default",
  ...props
}: ToolbarPrimitive.Root.Props & VariantProps<typeof toolbarVariants>) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      data-variant={variant}
      className={cn(toolbarVariants({ variant }), className)}
      {...props}
    />
  )
}

function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props) {
  return (
    <ToolbarPrimitive.Group
      data-slot="toolbar-group"
      className={cn(
        "flex items-center gap-0.5 data-vertical:flex-col data-vertical:items-stretch",
        className
      )}
      {...props}
    />
  )
}

// A Button in the toolbar's arrow-key order: quiet ghost icons by default.
// Popup triggers go in `render` (`render={<DropdownMenuTrigger />}`); a
// tooltip wraps it instead (`<TooltipTrigger render={<ToolbarButton />} />`).
function ToolbarButton({
  className,
  variant = "ghost",
  size = "icon",
  shape = "default",
  render,
  ...props
}: ToolbarPrimitive.Button.Props & VariantProps<typeof buttonVariants>) {
  const quiet = variant === "ghost" || variant === "ghost-destructive"
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      render={render ?? <Button variant={variant} size={size} shape={shape} />}
      className={cn(
        render && buttonVariants({ variant, size, shape }),
        quiet && "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ToolbarSeparator({
  className,
  ...props
}: ToolbarPrimitive.Separator.Props) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn(
        "shrink-0 bg-foreground/10 data-horizontal:mx-1 data-horizontal:my-1 data-horizontal:h-px data-horizontal:w-auto data-vertical:mx-1 data-vertical:h-4 data-vertical:w-px",
        className
      )}
      {...props}
    />
  )
}

function ToolbarLink({ className, ...props }: ToolbarPrimitive.Link.Props) {
  return (
    <ToolbarPrimitive.Link
      data-slot="toolbar-link"
      className={cn(
        textLinkVariants({ variant: "muted", underline: "hover" }),
        "flex-none self-center px-1.5 text-small",
        className
      )}
      {...props}
    />
  )
}

// Arrow keys move both the caret and the toolbar's focus, so keep to one
// input, as the toolbar's last item.
function ToolbarInput({ className, ...props }: ToolbarPrimitive.Input.Props) {
  return (
    <ToolbarPrimitive.Input
      data-slot="toolbar-input"
      render={<Input />}
      className={cn("w-auto min-w-24 flex-1", className)}
      {...props}
    />
  )
}

export {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
  toolbarVariants,
}
