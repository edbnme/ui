"use client"

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"

import { usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align">) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-0.5",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-8 w-max items-center justify-center gap-1 rounded-control px-3 text-body outline-none select-none pointer-coarse:h-control-touch [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.04] data-popup-open:bg-foreground/[.07] focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="relative top-px size-3 text-muted-foreground transition-transform duration-200 ease-(--motion-ease-out) motion-reduce:transition-none group-data-popup-open/navigation-menu-trigger:rotate-180" aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  )
}

// Moving between menus slides the new content in from the side it came
// from while the panel morphs to its size (Base UI's timing).
function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-auto p-1 transition-[opacity,translate] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:data-[activation-direction=left]:-translate-x-1/2 data-starting-style:data-[activation-direction=right]:translate-x-1/2 data-ending-style:data-[activation-direction=left]:translate-x-1/2 data-ending-style:data-[activation-direction=right]:-translate-x-1/2 motion-reduce:translate-x-0 motion-reduce:transition-opacity group-data-[viewport=false]/navigation-menu:rounded-panel group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow-popup",
        className
      )}
      {...props}
    />
  )
}

// A strip as tall as the gap bridges the trigger and the panel, so the
// pointer can cross it without the menu closing.
function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  const portalContainer = usePortalContainer()

  return (
    <NavigationMenuPrimitive.Portal container={portalContainer}>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:-top-2 data-[side=bottom]:before:h-2 data-[side=top]:before:inset-x-0 data-[side=top]:before:-bottom-2 data-[side=top]:before:h-2 data-[side=left]:before:inset-y-0 data-[side=left]:before:-right-2 data-[side=left]:before:w-2 data-[side=right]:before:inset-y-0 data-[side=right]:before:-left-2 data-[side=right]:before:w-2 motion-reduce:transition-none",
          className
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-panel bg-popover text-popover-foreground shadow-popup outline-none transition-[opacity,scale,width,height] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:scale-90 data-starting-style:opacity-0 data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-[ease] data-instant:transition-none motion-reduce:transition-opacity contrast-more:shadow-none contrast-more:outline contrast-more:outline-foreground forced-colors:bg-[Canvas] forced-colors:outline forced-colors:outline-[CanvasText]">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex min-h-8 items-center gap-2 rounded-control p-2 text-body outline-none pointer-coarse:min-h-control-touch [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.04] focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-ring data-active:bg-foreground/[.07] [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-popover shadow-popup" />
    </NavigationMenuPrimitive.Icon>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
}
