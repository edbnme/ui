"use client"

import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import {
  useUIDocument,
  usePortalContainer,
  useUIEnvironmentActive,
} from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { ChevronRightIcon, CheckIcon } from "lucide-react"

type PreviewContextMenu = {
  anchor: ContextMenuPrimitive.Positioner.Props["anchor"]
  setPoint: (x: number, y: number) => void
}

const PreviewContextMenuContext = React.createContext<PreviewContextMenu | null>(
  null
)

function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  const environmentActive = useUIEnvironmentActive()

  return environmentActive ? (
    <PreviewContextMenuRoot {...props} />
  ) : (
    <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
  )
}

function PreviewContextMenuRoot({ ...props }: ContextMenuPrimitive.Root.Props) {
  const [point, setPoint] = React.useState({ x: 0, y: 0 })
  const value = React.useMemo<PreviewContextMenu>(
    () => ({
      anchor: {
        getBoundingClientRect: () => ({
          bottom: point.y,
          height: 0,
          left: point.x,
          right: point.x,
          top: point.y,
          width: 0,
          x: point.x,
          y: point.y,
        }),
      },
      setPoint: (x, y) => setPoint({ x, y }),
    }),
    [point]
  )

  return (
    <PreviewContextMenuContext.Provider value={value}>
      <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
    </PreviewContextMenuContext.Provider>
  )
}

function ContextMenuPortal({
  container,
  ...props
}: ContextMenuPrimitive.Portal.Props) {
  const portalContainer = usePortalContainer(container)

  return (
    <ContextMenuPrimitive.Portal
      data-slot="context-menu-portal"
      container={portalContainer}
      {...props}
    />
  )
}

function ContextMenuTrigger({
  className,
  onContextMenu,
  onKeyDown,
  tabIndex = 0,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  const environmentActive = useUIEnvironmentActive()
  const previewContext = React.useContext(PreviewContextMenuContext)
  const trigger = (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      tabIndex={tabIndex}
      aria-haspopup="menu"
      aria-keyshortcuts="Shift+F10"
      className={cn("select-none outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-foreground", className)}
      onContextMenu={(event) => {
        previewContext?.setPoint(event.clientX, event.clientY)
        onContextMenu?.(event)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        const shortcut = event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")
        const activation = event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")
        if (!shortcut && !activation) return
        event.preventDefault()
        event.preventBaseUIHandler()
        const rect = event.currentTarget.getBoundingClientRect()
        const ownerWindow = event.currentTarget.ownerDocument.defaultView!
        event.currentTarget.dispatchEvent(new ownerWindow.MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        }))
      }}
      {...props}
    />
  )

  if (!environmentActive) return trigger

  return (
    <MenuPrimitive.Trigger
      nativeButton={false}
      render={trigger}
      onMouseDown={(event) => event.preventBaseUIHandler()}
    />
  )
}

// Opens with its corner at the pointer, below and after it, as Base UI's
// context menu does.
function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 0,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const portalContainer = usePortalContainer()
  const environmentActive = useUIEnvironmentActive()
  const ownerDocument = useUIDocument()
  const previewContext = React.useContext(PreviewContextMenuContext)

  return (
    <ContextMenuPrimitive.Portal container={portalContainer}>
      <ContextMenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={previewContext?.anchor}
        collisionBoundary={
          environmentActive ? ownerDocument?.documentElement : undefined
        }
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            "z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto overscroll-contain rounded-panel bg-popover p-1 text-popover-foreground shadow-popup outline-none transition-[opacity,scale] duration-(--motion-duration-surface-in) ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-(--motion-duration-surface-out) motion-reduce:transition-opacity motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100 contrast-more:shadow-none contrast-more:outline contrast-more:outline-foreground forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]",
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuGroup({ ...props }: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-3 pt-2 pb-1 text-xs text-muted-foreground select-none data-inset:pl-8",
        className
      )}
      {...props}
    />
  )
}

// One highlight for mouse and keyboard: the row turns ink (light in dark
// mode) and doubles as the focus indicator.
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/context-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-control px-3 py-2 text-sm leading-4 outline-none select-none pointer-coarse:min-h-10 data-highlighted:bg-primary data-highlighted:text-primary-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive data-[variant=destructive]:data-highlighted:text-white forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSub({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  return <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "group/context-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-control px-3 py-2 text-sm leading-4 outline-none select-none pointer-coarse:min-h-10 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-highlighted:bg-primary data-highlighted:text-primary-foreground data-highlighted:data-popup-open:bg-primary data-highlighted:data-popup-open:text-primary-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto -me-1 rtl:rotate-180" />
    </ContextMenuPrimitive.SubmenuTrigger>
  )
}

// Submenus overlap their parent by the popup's padding so the first row
// lines up with the row that opened it (Base UI's nested menu).
const submenuOffset: ContextMenuPrimitive.Positioner.Props["sideOffset"] = ({
  side,
}) => (side === "top" || side === "bottom" ? 4 : -4)

function ContextMenuSubContent({
  align = "start",
  alignOffset = submenuOffset,
  side = "inline-end",
  sideOffset = submenuOffset,
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

// Ticks sit in a column on the left so labels line up whether or not a row
// is checked (Base UI's layout).
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "group/context-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-control py-2 pr-3 pl-2 text-sm leading-4 outline-none select-none pointer-coarse:min-h-10 data-highlighted:bg-primary data-highlighted:text-primary-foreground data-disabled:pointer-events-none data-disabled:opacity-50 forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none flex size-4 shrink-0 items-center justify-center"
        data-slot="context-menu-checkbox-item-indicator"
      >
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioGroup({
  ...props
}: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        "group/context-menu-item relative flex min-h-8 cursor-default items-center gap-2 rounded-control py-2 pr-3 pl-2 text-sm leading-4 outline-none select-none pointer-coarse:min-h-10 data-highlighted:bg-primary data-highlighted:text-primary-foreground data-disabled:pointer-events-none data-disabled:opacity-50 forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none flex size-4 shrink-0 items-center justify-center"
        data-slot="context-menu-radio-item-indicator"
      >
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto pl-4 text-xs tracking-widest text-muted-foreground group-data-highlighted/context-menu-item:text-current group-data-highlighted/context-menu-item:opacity-70",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
