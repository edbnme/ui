"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

import { PopupMotionProvider, usePopupMotion, usePopupMotionState, usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function AlertDialog({ open, onOpenChange, ...props }: AlertDialogPrimitive.Root.Props) {
  const [motion, handleOpenChange] = usePopupMotionState(open, onOpenChange)

  return (
    <PopupMotionProvider value={motion}>
      <AlertDialogPrimitive.Root data-slot="alert-dialog" open={open} onOpenChange={handleOpenChange} {...props} />
    </PopupMotionProvider>
  )
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  container,
  ...props
}: AlertDialogPrimitive.Portal.Props) {
  const portalContainer = usePortalContainer(container)

  return (
    <AlertDialogPrimitive.Portal
      data-slot="alert-dialog-portal"
      container={portalContainer}
      {...props}
    />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  const motion = usePopupMotion()

  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      data-motion={motion}
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/20 transition-opacity duration-200 ease-(--motion-ease-out) data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-150 data-[motion=instant]:transition-none motion-reduce:duration-100 motion-reduce:data-ending-style:duration-[80ms]",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  size?: "default" | "sm"
}) {
  const motion = usePopupMotion()

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-motion={motion}
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-[26rem] max-w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto -translate-x-1/2 -translate-y-1/2 gap-5 rounded-3xl bg-popover p-7 text-popover-foreground border border-border shadow-[0_1px_1px_rgb(16_16_20_/_0.06),0_10px_18px_-6px_rgb(16_16_20_/_0.16),0_28px_44px_-16px_rgb(16_16_20_/_0.3)] outline-none data-[size=sm]:max-w-xs transition-[opacity,scale] duration-200 ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-150 data-[motion=instant]:transition-none motion-reduce:transition-opacity motion-reduce:duration-100 motion-reduce:data-ending-style:duration-[80ms] motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100 motion-reduce:data-[motion=instant]:transition-none",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "-mx-7 -mb-7 flex flex-col-reverse gap-2 rounded-b-3xl border-t bg-muted p-7 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "font-heading text-lg font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-[13px] text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:[@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
