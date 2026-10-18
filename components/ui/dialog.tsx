"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
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
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 min-h-dvh bg-black/20 transition-opacity duration-150 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:bg-black/50",
        className
      )}
      {...props}
    />
  )
}

// One sheet of paper, as on kew.edbn.me, with Base UI's motion: it rises a
// touch and settles in 100ms, and steps back and dims while a dialog opened
// from it sits on top.
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-[calc(50%+1.25rem*var(--nested-dialogs))] left-1/2 z-50 grid w-[26rem] max-w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] -translate-x-1/2 -translate-y-1/2 scale-[calc(1-0.1*var(--nested-dialogs))] gap-5 overflow-y-auto overscroll-contain rounded-card bg-popover p-6 text-[15px] text-popover-foreground shadow-lift outline-none transition-[top,scale,opacity] duration-(--motion-duration-surface-in) ease-out after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-black/5 after:opacity-0 after:transition-opacity after:duration-(--motion-duration-surface-in) data-starting-style:top-[calc(50%+0.25rem+1.25rem*var(--nested-dialogs))] data-starting-style:scale-[.96] data-starting-style:opacity-0 data-ending-style:top-[calc(50%+0.25rem+1.25rem*var(--nested-dialogs))] data-ending-style:scale-[.96] data-ending-style:opacity-0 data-nested-dialog-open:after:opacity-100 dark:after:bg-black/30 motion-reduce:transition-opacity motion-reduce:data-starting-style:top-[calc(50%+1.25rem*var(--nested-dialogs))] motion-reduce:data-ending-style:top-[calc(50%+1.25rem*var(--nested-dialogs))] motion-reduce:data-starting-style:scale-[calc(1-0.1*var(--nested-dialogs))] motion-reduce:data-ending-style:scale-[calc(1-0.1*var(--nested-dialogs))] contrast-more:shadow-none contrast-more:outline contrast-more:outline-foreground forced-colors:outline forced-colors:outline-[CanvasText]",
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
                className="absolute top-3 end-3 text-muted-foreground"
                size="icon-sm"
              />
            }
          >
            <XIcon />
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
      className={cn("flex flex-col gap-1.5 pe-8", className)}
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
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
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
        "font-heading text-lg leading-snug font-medium",
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
