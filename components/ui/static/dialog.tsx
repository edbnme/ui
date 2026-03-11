/**
 * Dialog — CSS-only modal dialog for overlaying content.
 * Built on @base-ui/react Dialog primitive.
 *
 * @example
 * <DialogRoot>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <DialogPortal>
 *     <DialogBackdrop />
 *     <DialogViewport>
 *       <DialogPopup>
 *         <DialogHeader>
 *           <DialogTitle>Dialog Title</DialogTitle>
 *           <DialogDescription>Description text</DialogDescription>
 *         </DialogHeader>
 *         <DialogFooter>
 *           <DialogClose>Close</DialogClose>
 *         </DialogFooter>
 *       </DialogPopup>
 *     </DialogViewport>
 *   </DialogPortal>
 * </DialogRoot>
 *
 * @see https://base-ui.com/react/components/dialog
 */
"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react";

// =============================================================================
// DIALOG ROOT
// =============================================================================

const DialogRoot = Dialog.Root;

// =============================================================================
// DIALOG TRIGGER
// =============================================================================

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Trigger>
>(({ className, ...props }, ref) => (
  <Dialog.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors select-none",
      "hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring active:bg-muted/80",
      className
    )}
    {...props}
  />
));
DialogTrigger.displayName = "DialogTrigger";

// =============================================================================
// DIALOG PORTAL
// =============================================================================

const DialogPortal = Dialog.Portal;

// =============================================================================
// DIALOG BACKDROP
// =============================================================================

const DialogBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Backdrop>
>(({ className, ...props }, ref) => (
  <Dialog.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "transition-all duration-200",
      "data-starting-style:opacity-0 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
DialogBackdrop.displayName = "DialogBackdrop";

// =============================================================================
// DIALOG VIEWPORT
// =============================================================================

const DialogViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Viewport>
>(({ className, ...props }, ref) => (
  <Dialog.Viewport
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center overflow-auto",
      className
    )}
    {...props}
  />
));
DialogViewport.displayName = "DialogViewport";

// =============================================================================
// DIALOG POPUP
// =============================================================================

const DialogPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Popup>
>(({ className, ...props }, ref) => (
  <Dialog.Popup
    ref={ref}
    className={cn(
      "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
      "rounded-lg border border-border bg-background p-6 shadow-lg",
      "transition-all duration-200",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
DialogPopup.displayName = "DialogPopup";

// =============================================================================
// DIALOG TITLE
// =============================================================================

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

// =============================================================================
// DIALOG DESCRIPTION
// =============================================================================

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("mt-2 text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

// =============================================================================
// DIALOG CLOSE
// =============================================================================

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Close>
>(({ className, ...props }, ref) => (
  <Dialog.Close
    ref={ref}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </Dialog.Close>
));
DialogClose.displayName = "DialogClose";

// =============================================================================
// DIALOG HEADER
// =============================================================================

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// =============================================================================
// DIALOG FOOTER
// =============================================================================

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
};
