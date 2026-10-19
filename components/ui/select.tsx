"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, ChevronsUpDownIcon } from "lucide-react"

function Select<Value, Multiple extends boolean | undefined = false>({ ...props }: SelectPrimitive.Root.Props<Value, Multiple>) {
  return <SelectPrimitive.Root {...props} />
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-start", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-2 rounded-control border border-input bg-background ps-3 pe-2 text-sm whitespace-nowrap outline-none select-none data-[size=default]:h-8 data-[size=sm]:h-7 pointer-coarse:data-[size=default]:h-10 pointer-coarse:data-[size=sm]:h-9 pointer-coarse:text-base focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-foreground data-placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:border-foreground/50 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronsUpDownIcon className="pointer-events-none size-4 text-muted-foreground" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

// As in Base UI, the open list lays the chosen option exactly over the
// trigger, its tick just before the text, and appears without a zoom (like
// a native menu). When there's no room for that, or on touch screens, it
// drops below the trigger and animates like the other popups.
function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  const portalContainer = usePortalContainer()

  return (
    <SelectPrimitive.Portal container={portalContainer}>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50 outline-none select-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "group/select-content relative isolate z-50 min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-panel bg-popover text-popover-foreground shadow-popup outline-none transition-[opacity,scale] duration-(--motion-duration-surface-in) ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-(--motion-duration-surface-out) data-[side=none]:min-w-[calc(var(--anchor-width)+1.75rem)] data-[side=none]:transition-none data-[side=none]:data-starting-style:scale-none data-[side=none]:data-starting-style:opacity-100 motion-reduce:transition-opacity motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100 contrast-more:shadow-none contrast-more:outline contrast-more:outline-foreground forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List className="relative max-h-(--available-height) scroll-py-6 overflow-y-auto overscroll-contain p-1">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("ps-8 pe-3 pt-2 pb-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

// The tick sits in a column before the text, so options line up whether or
// not they're chosen; the highlighted option turns ink for mouse and
// keyboard alike.
function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-8 w-full cursor-default items-center gap-2 rounded-control py-2 ps-2 pe-3 text-sm leading-4 outline-none select-none pointer-coarse:min-h-10 data-highlighted:bg-primary data-highlighted:text-primary-foreground data-highlighted:**:text-current data-disabled:pointer-events-none data-disabled:opacity-50 forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none flex size-4 shrink-0 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 items-center gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

// Hovering an arrow scrolls the list. While the list is laid over the
// trigger, the hover area reaches past the popup's edge, as in Base UI.
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex h-5 w-full cursor-default items-center justify-center bg-popover text-muted-foreground before:absolute before:inset-x-0 before:h-full before:content-[''] group-data-[side=none]/select-content:before:-top-full [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex h-5 w-full cursor-default items-center justify-center bg-popover text-muted-foreground before:absolute before:inset-x-0 before:h-full before:content-[''] group-data-[side=none]/select-content:before:-bottom-full [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
