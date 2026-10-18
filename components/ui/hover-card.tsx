"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"

import { usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
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
          className={cn(
            "z-50 w-64 origin-(--transform-origin) rounded-panel border border-border/60 bg-popover p-5 text-[15px] text-popover-foreground shadow-popup outline-hidden transition-[opacity,scale] duration-(--motion-duration-surface-in) ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-(--motion-duration-surface-out) motion-reduce:transition-opacity motion-reduce:duration-100 motion-reduce:data-ending-style:duration-[80ms] motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
            className
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
