"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { SearchIcon, CheckIcon } from "lucide-react"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-panel bg-popover p-1 text-popover-foreground shadow-popup contrast-more:shadow-none contrast-more:outline contrast-more:outline-foreground forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 gap-0 overflow-hidden rounded-card p-0 shadow-lift data-starting-style:top-[calc(33.333%+0.25rem)] data-ending-style:top-[calc(33.333%+0.25rem)] *:data-[slot=command]:shadow-none",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

// `icon={false}` drops the search glass. `startAddon` and `endAddon` sit
// inside the field, before and after the text: a breadcrumb back to the
// previous page, a clear button, a shortcut hint.
function CommandInput({
  className,
  icon = true,
  startAddon,
  endAddon,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
  icon?: boolean
  startAddon?: React.ReactNode
  endAddon?: React.ReactNode
}) {
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      {/* An inline command list rings its field on keyboard focus like any
          input group. In a dialog or popover the field holds focus from the
          moment it opens, so a ring there would never go away. */}
      <InputGroup className="bg-background shadow-none *:data-[slot=input-group-addon]:ps-2.5! [&:not([data-slot=dialog-content]_*,[data-slot=popover-content]_*)]:has-[[data-slot=command-input]:focus-visible]:outline-2 [&:not([data-slot=dialog-content]_*,[data-slot=popover-content]_*)]:has-[[data-slot=command-input]:focus-visible]:outline-solid [&:not([data-slot=dialog-content]_*,[data-slot=popover-content]_*)]:has-[[data-slot=command-input]:focus-visible]:-outline-offset-1 [&:not([data-slot=dialog-content]_*,[data-slot=popover-content]_*)]:has-[[data-slot=command-input]:focus-visible]:outline-ring">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "w-full bg-transparent px-2 text-body outline-none placeholder:text-muted-foreground pointer-coarse:text-base disabled:cursor-not-allowed disabled:opacity-50",
            !icon && !startAddon && "ps-3",
            className
          )}
          {...props}
        />
        {icon && (
          <InputGroupAddon>
            <SearchIcon className="size-4 shrink-0 opacity-50" />
          </InputGroupAddon>
        )}
        {startAddon && (
          <InputGroupAddon>{startAddon}</InputGroupAddon>
        )}
        {endAddon && (
          <InputGroupAddon align="inline-end">{endAddon}</InputGroupAddon>
        )}
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto text-body outline-none",
        className
      )}
      {...props}
    />
  )
}

// `align="start"` lines the message up with the items' text, for lists
// that read as a menu rather than a search page.
function CommandEmpty({
  className,
  align = "center",
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty> & {
  align?: "center" | "start"
}) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      data-align={align}
      className={cn(
        "py-6 text-center text-body text-muted-foreground",
        align === "start" && "grid gap-1 px-3 py-2 text-start leading-5",
        className
      )}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:text-small **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex min-h-8 cursor-default items-center gap-2 rounded-control px-3 py-2 text-body leading-4 outline-none select-none pointer-coarse:min-h-control-touch data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-primary data-selected:text-primary-foreground data-selected:**:text-current forced-colors:data-selected:bg-[Highlight] forced-colors:data-selected:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 has-data-[slot=command-item-description]:flex-wrap has-data-[slot=command-item-description]:gap-y-0.5 has-data-[slot=command-item-description]:leading-5",
        className
      )}
      {...props}
    >
      {children}
      <CheckIcon className="ms-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto ps-4 text-small leading-4 text-muted-foreground group-data-selected/command-item:text-current group-data-selected/command-item:opacity-70",
        className
      )}
      {...props}
    />
  )
}

// A second, quieter line under the item's label. It wraps below the label
// and lines up with it past a leading icon.
function CommandItemDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-item-description"
      className={cn(
        "order-last min-w-0 basis-full truncate text-small leading-5 text-muted-foreground group-has-[>svg:first-child]/command-item:ps-6 group-data-selected/command-item:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandItemDescription,
  CommandShortcut,
  CommandSeparator,
}
