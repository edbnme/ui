"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { PopupMotionProvider, usePopupMotion, usePopupMotionState, usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ open, onOpenChange, ...props }: DialogPrimitive.Root.Props) {
  const [motion, handleOpenChange] = usePopupMotionState(open, onOpenChange)

  return (
    <PopupMotionProvider value={motion}>
      <DialogPrimitive.Root data-slot="dialog" open={open} onOpenChange={handleOpenChange} {...props} />
    </PopupMotionProvider>
  )
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ container, ...props }: DialogPrimitive.Portal.Props) {
  const portalContainer = usePortalContainer(container)

  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      container={portalContainer}
      {...props}
    />
  )
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  const motion = usePopupMotion()

  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      data-motion={motion}
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/20 transition-opacity duration-200 ease-(--motion-ease-out) data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-150 data-[motion=instant]:transition-none motion-reduce:duration-100 motion-reduce:data-ending-style:duration-[80ms]",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  const motion = usePopupMotion()

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-motion={motion}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-[26rem] max-w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto -translate-x-1/2 -translate-y-1/2 gap-5 rounded-3xl bg-popover p-7 pt-11 text-[15px] text-popover-foreground border border-border shadow-[0_1px_1px_rgb(16_16_20_/_0.06),0_10px_18px_-6px_rgb(16_16_20_/_0.16),0_28px_44px_-16px_rgb(16_16_20_/_0.3)] outline-none transition-[opacity,scale] duration-200 ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-150 data-[motion=instant]:transition-none motion-reduce:transition-opacity motion-reduce:duration-100 motion-reduce:data-ending-style:duration-[80ms] motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100 motion-reduce:data-[motion=instant]:transition-none",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-lg"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-7 -mb-7 flex flex-col-reverse gap-2 rounded-b-3xl border-t bg-muted p-7 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-lg leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-[13px] text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:[@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
