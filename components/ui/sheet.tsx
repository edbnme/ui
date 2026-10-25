"use client"

import * as React from "react"
import { Drawer as SheetPrimitive } from "@base-ui/react/drawer"

import { usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

type SheetSide = "top" | "right" | "bottom" | "left"

const swipeDirections = {
  top: "up",
  right: "right",
  bottom: "down",
  left: "left",
} as const

// A sheet is Base UI's drawer: it slides in from its edge and can be swiped
// back out. The side is set on SheetContent, as in shadcn, while Base UI
// takes the swipe direction on the root, so the content passes it up.
const SheetSideContext = React.createContext<React.Dispatch<
  React.SetStateAction<SheetSide>
> | null>(null)

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  const [side, setSide] = React.useState<SheetSide>("right")

  return (
    <SheetSideContext.Provider value={setSide}>
      <SheetPrimitive.Root
        data-slot="sheet"
        swipeDirection={swipeDirections[side]}
        {...props}
      />
    </SheetSideContext.Provider>
  )
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ container, ...props }: SheetPrimitive.Portal.Props) {
  const portalContainer = usePortalContainer(container)

  return (
    <SheetPrimitive.Portal
      data-slot="sheet-portal"
      container={portalContainer}
      {...props}
    />
  )
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 min-h-dvh bg-black/20 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-[450ms] ease-(--motion-ease-drawer) select-none data-swiping:duration-0 data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*400ms)] motion-reduce:duration-100 supports-[-webkit-touch-callout:none]:absolute dark:bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  keepMounted = false,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: SheetSide
  showCloseButton?: boolean
  keepMounted?: boolean
}) {
  const setSide = React.useContext(SheetSideContext)

  useIsomorphicLayoutEffect(() => {
    setSide?.(side)
  }, [setSide, side])

  return (
    <SheetPortal keepMounted={keepMounted}>
      <SheetOverlay />
      <SheetPrimitive.Viewport
        data-slot="sheet-viewport"
        className="pointer-events-none fixed inset-0 z-50"
      >
        <SheetPrimitive.Popup
          data-slot="sheet-content"
          data-side={side}
          className={cn(
            // Base: Base UI's drawer timing, following the finger while swiped.
            "pointer-events-auto fixed z-50 flex max-h-dvh flex-col gap-4 overflow-y-auto overscroll-contain bg-background text-body text-popover-foreground shadow-lift dark:bg-popover outline-none transition-transform duration-[450ms] ease-(--motion-ease-drawer) data-swiping:duration-0 data-swiping:select-none data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*400ms)] motion-reduce:transition-opacity motion-reduce:duration-100 motion-reduce:data-starting-style:opacity-0 motion-reduce:data-ending-style:opacity-0 contrast-more:shadow-none contrast-more:outline contrast-more:outline-foreground forced-colors:outline forced-colors:outline-[CanvasText]",
            // Right and left: full height, 3/4 of a phone, 24rem from sm, rounded
            // on the edge that faces in (as the drawer is).
            "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:sm:max-w-dialog data-[side=left]:rounded-r-card data-[side=left]:transform-[translateX(var(--drawer-swipe-movement-x,0px))] data-[side=left]:data-starting-style:transform-[translateX(calc(-100%-2px))] data-[side=left]:data-ending-style:transform-[translateX(calc(-100%-2px))]",
            "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:sm:max-w-dialog data-[side=right]:rounded-l-card data-[side=right]:transform-[translateX(var(--drawer-swipe-movement-x,0px))] data-[side=right]:data-starting-style:transform-[translateX(calc(100%+2px))] data-[side=right]:data-ending-style:transform-[translateX(calc(100%+2px))]",
            // Top and bottom: full width, rounded on the edge that faces in.
            "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:rounded-b-card data-[side=top]:transform-[translateY(var(--drawer-swipe-movement-y,0px))] data-[side=top]:data-starting-style:transform-[translateY(calc(-100%-2px))] data-[side=top]:data-ending-style:transform-[translateY(calc(-100%-2px))]",
            "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:rounded-t-card data-[side=bottom]:transform-[translateY(var(--drawer-swipe-movement-y,0px))] data-[side=bottom]:data-starting-style:transform-[translateY(calc(100%+2px))] data-[side=bottom]:data-ending-style:transform-[translateY(calc(100%+2px))]",
            className
          )}
          {...props}
        >
          <SheetPrimitive.Content
            data-slot="sheet-body"
            className="contents"
          >
            {children}
          </SheetPrimitive.Content>
          {showCloseButton && (
            <SheetPrimitive.Close
              data-slot="sheet-close"
              render={
                <Button
                  variant="ghost"
                  className="absolute top-3 end-3 rounded-full text-muted-foreground"
                  size="icon-sm"
                />
              }
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetPrimitive.Viewport>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-6 pe-12", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-6", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-body text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-small text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
