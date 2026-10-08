"use client"

import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import {
  PopupMotionProvider,
  usePopupMotion,
  usePopupMotionState,
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

function ContextMenu({ open, onOpenChange, ...props }: ContextMenuPrimitive.Root.Props) {
  const environmentActive = useUIEnvironmentActive()
  const [motion, handleOpenChange] = usePopupMotionState(open, onOpenChange)

  return (
    <PopupMotionProvider value={motion}>
      {environmentActive ? (
        <PreviewContextMenuRoot open={open} onOpenChange={handleOpenChange} {...props} />
      ) : (
        <ContextMenuPrimitive.Root data-slot="context-menu" open={open} onOpenChange={handleOpenChange} {...props} />
      )}
    </PopupMotionProvider>
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

function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const portalContainer = usePortalContainer()
  const motion = usePopupMotion()
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
          data-motion={motion}
          className={cn("z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-xl bg-popover p-1.5 text-popover-foreground shadow-[0_1px_1px_rgb(16_16_20_/_0.04),0_8px_20px_-8px_rgb(16_16_20_/_0.16)] border border-border outline-none transition-[opacity,scale] duration-(--motion-duration-surface-in) ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-(--motion-duration-surface-out) data-[motion=instant]:transition-none motion-reduce:transition-opacity motion-reduce:duration-100 motion-reduce:data-ending-style:duration-[80ms] motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100 motion-reduce:data-[motion=instant]:transition-none", className )}
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
        "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
        className
      )}
      {...props}
    />
  )
}

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
        "group/context-menu-item relative flex cursor-default items-center gap-1.5 min-h-9 rounded-lg px-2.5 py-2 [@media(pointer:coarse)]:min-h-11 text-sm outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSub({ open, onOpenChange, ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  const [motion, handleOpenChange] = usePopupMotionState(open, onOpenChange)

  return (
    <PopupMotionProvider value={motion}>
      <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" open={open} onOpenChange={handleOpenChange} {...props} />
    </PopupMotionProvider>
  )
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
        "flex cursor-default items-center gap-1.5 min-h-9 rounded-lg px-2.5 py-2 [@media(pointer:coarse)]:min-h-11 text-sm outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubmenuTrigger>
  )
}

function ContextMenuSubContent({
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className="shadow-lg"
      side="right"
      {...props}
    />
  )
}

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
        "relative flex cursor-default items-center gap-1.5 min-h-9 rounded-lg py-2 pr-9 pl-2.5 [@media(pointer:coarse)]:min-h-11 text-sm outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute right-2">
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon
          />
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
        "relative flex cursor-default items-center gap-1.5 min-h-9 rounded-lg py-2 pr-9 pl-2.5 [@media(pointer:coarse)]:min-h-11 text-sm outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2">
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon
          />
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
      className={cn("-mx-1 my-1 h-px bg-border", className)}
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
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
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
