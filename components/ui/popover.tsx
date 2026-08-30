"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import {
  PopupMotionProvider,
  usePopupMotion,
  usePopupMotionState,
  usePortalContainer,
} from "@/lib/ui-environment"
import { cn } from "@/lib/utils"

function Popover<Payload = unknown>({
  open,
  onOpenChange,
  ...props
}: PopoverPrimitive.Root.Props<Payload>) {
  const [motion, handleOpenChange] = usePopupMotionState(
    open,
    onOpenChange
  )

  return (
    <PopupMotionProvider value={motion}>
      <PopoverPrimitive.Root
        data-slot="popover"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </PopupMotionProvider>
  )
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const portalContainer = usePortalContainer()
  const motion = usePopupMotion()

  return (
    <PopoverPrimitive.Portal container={portalContainer}>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          data-motion={motion}
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-xl border border-foreground/8 bg-popover/95 p-2.5 text-sm text-popover-foreground shadow-[0_18px_50px_-22px_rgb(0_0_0_/_0.4),inset_0_1px_0_color-mix(in_oklch,var(--foreground)_8%,transparent)] ring-1 ring-foreground/8 outline-hidden transition-[opacity,transform] duration-(--motion-duration-surface-in) ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-(--motion-duration-surface-out) data-[motion=instant]:transition-none motion-reduce:transition-none motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100 supports-[backdrop-filter:blur(0)]:bg-popover/82 supports-[backdrop-filter:blur(0)]:backdrop-blur-xl supports-[backdrop-filter:blur(0)]:saturate-150 contrast-more:bg-popover contrast-more:shadow-none forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] [@media_(prefers-reduced-transparency:_reduce)]:bg-popover [@media_(prefers-reduced-transparency:_reduce)]:backdrop-blur-none",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
