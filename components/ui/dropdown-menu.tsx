"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { ChevronRightIcon, CheckIcon } from "lucide-react"

// Submenus overlap their parent by the popup's padding so the first row
// lines up with the row that opened it, as in Base UI's nested menu. When
// there's no room beside the parent they flip above or below it instead.
const submenuOffset: MenuPrimitive.Positioner.Props["sideOffset"] = ({
  side,
}) => (side === "top" || side === "bottom" ? 4 : -4)

function DropdownMenu<Payload = unknown>({ ...props }: MenuPrimitive.Root.Props<Payload>) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ container, ...props }: MenuPrimitive.Portal.Props) {
  const portalContainer = usePortalContainer(container)

  return (
    <MenuPrimitive.Portal
      data-slot="dropdown-menu-portal"
      container={portalContainer}
      {...props}
    />
  )
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const portalContainer = usePortalContainer()

  return (
    <MenuPrimitive.Portal container={portalContainer}>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto overscroll-contain rounded-panel bg-popover p-1 text-popover-foreground shadow-popup outline-none transition-[opacity,scale] duration-(--motion-duration-surface-in) ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-(--motion-duration-surface-out) motion-reduce:transition-opacity motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100 contrast-more:shadow-none contrast-more:outline contrast-more:outline-foreground forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-3 pt-2 pb-1 text-[13px] text-muted-foreground select-none data-inset:ps-8",
        className
      )}
      {...props}
    />
  )
}

// One highlight for mouse and keyboard, as in Base UI: the row turns ink
// (light in dark mode). It doubles as the focus indicator, so rows draw no
// outline of their own.
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-control px-3 py-2 text-[15px] leading-4 outline-none select-none pointer-coarse:min-h-10 data-highlighted:bg-primary data-highlighted:text-primary-foreground data-highlighted:**:text-current data-inset:ps-8 data-disabled:pointer-events-none data-disabled:opacity-50 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive data-[variant=destructive]:data-highlighted:text-white forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "group/dropdown-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-control px-3 py-2 text-[15px] leading-4 outline-none select-none pointer-coarse:min-h-10 data-popup-open:bg-foreground/[.07] data-popup-open:text-popover-foreground data-highlighted:bg-primary data-highlighted:text-primary-foreground data-highlighted:**:text-current data-highlighted:data-popup-open:bg-primary data-highlighted:data-popup-open:text-primary-foreground data-inset:ps-8 data-disabled:pointer-events-none data-disabled:opacity-50 forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto -me-1 rtl:rotate-180" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = submenuOffset,
  side = "inline-end",
  sideOffset = submenuOffset,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("min-w-32", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

// Checkbox and radio rows keep their tick in a column on the left, so the
// labels line up whether or not a row is checked (Base UI's layout).
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "group/dropdown-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-control py-2 pe-3 ps-2 text-[15px] leading-4 outline-none select-none pointer-coarse:min-h-10 data-highlighted:bg-primary data-highlighted:text-primary-foreground data-highlighted:**:text-current data-disabled:pointer-events-none data-disabled:opacity-50 forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none flex size-4 shrink-0 items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "group/dropdown-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-control py-2 pe-3 ps-2 text-[15px] leading-4 outline-none select-none pointer-coarse:min-h-10 data-highlighted:bg-primary data-highlighted:text-primary-foreground data-highlighted:**:text-current data-disabled:pointer-events-none data-disabled:opacity-50 forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none flex size-4 shrink-0 items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ms-auto ps-4 text-[13px] text-muted-foreground group-data-highlighted/dropdown-menu-item:text-current group-data-highlighted/dropdown-menu-item:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
