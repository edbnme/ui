"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"

import { PopupMotionProvider, usePopupMotion, usePopupMotionState, usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"

function HoverCard({ open, onOpenChange, ...props }: PreviewCardPrimitive.Root.Props) {
  const [motion, handleOpenChange] = usePopupMotionState(open, onOpenChange)

  return (
    <PopupMotionProvider value={motion}>
      <PreviewCardPrimitive.Root data-slot="hover-card" open={open} onOpenChange={handleOpenChange} {...props} />
    </PopupMotionProvider>
  )
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const portalContainer = usePortalContainer()

  const motion = usePopupMotion()

  return (
    <PreviewCardPrimitive.Portal
      data-slot="hover-card-portal"
      container={portalContainer}
    >
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
        data-motion={motion}
          className={cn(
            "z-50 w-64 origin-(--transform-origin) rounded-2xl bg-popover p-5 text-[15px] text-popover-foreground shadow-[0_1px_1px_rgb(16_16_20_/_0.04),0_8px_20px_-8px_rgb(16_16_20_/_0.16)] border border-border outline-hidden duration-100 transition-[opacity,scale] duration-(--motion-duration-surface-in) ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-(--motion-duration-surface-out) data-[motion=instant]:transition-none motion-reduce:transition-opacity motion-reduce:duration-100 motion-reduce:data-ending-style:duration-[80ms] motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100 motion-reduce:data-[motion=instant]:transition-none",
            className
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
