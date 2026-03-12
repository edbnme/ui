/**
 * AlertDialog (Static) — CSS-only alert dialog (no motion animations).
 * Built on @base-ui/react AlertDialog primitive.
 *
 * @example
 * <AlertDialogRoot>
 *   <AlertDialogTrigger>Delete</AlertDialogTrigger>
 *   <AlertDialogPortal>
 *     <AlertDialogBackdrop />
 *     <AlertDialogViewport>
 *       <AlertDialogPopup>
 *         <AlertDialogTitle>Confirm</AlertDialogTitle>
 *         <AlertDialogDescription>Are you sure?</AlertDialogDescription>
 *         <AlertDialogClose>Cancel</AlertDialogClose>
 *       </AlertDialogPopup>
 *     </AlertDialogViewport>
 *   </AlertDialogPortal>
 * </AlertDialogRoot>
 *
 * @see https://base-ui.com/react/components/alert-dialog
 */
"use client";

import * as React from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "@/lib/utils";

// =============================================================================
// ALERT DIALOG ROOT
// =============================================================================

const AlertDialogRoot = AlertDialog.Root;

// =============================================================================
// ALERT DIALOG TRIGGER
// =============================================================================

const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Trigger>
>(({ className, ...props }, ref) => (
  <AlertDialog.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors select-none",
      "hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring active:bg-muted/80",
      className
    )}
    {...props}
  />
));
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// =============================================================================
// ALERT DIALOG PORTAL
// =============================================================================

const AlertDialogPortal = AlertDialog.Portal;

// =============================================================================
// ALERT DIALOG BACKDROP
// =============================================================================

const AlertDialogBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <AlertDialog.Backdrop
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
AlertDialogBackdrop.displayName = "AlertDialogBackdrop";

// =============================================================================
// ALERT DIALOG VIEWPORT
// =============================================================================

const AlertDialogViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Viewport>
>(({ className, ...props }, ref) => (
  <AlertDialog.Viewport
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center overflow-auto",
      className
    )}
    {...props}
  />
));
AlertDialogViewport.displayName = "AlertDialogViewport";

// =============================================================================
// ALERT DIALOG POPUP
// =============================================================================

const AlertDialogPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Popup>
>(({ className, ...props }, ref) => (
  <AlertDialog.Popup
    ref={ref}
    className={cn(
      "fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
      "rounded-lg border border-border bg-background p-6 shadow-lg",
      "transition-all duration-200",
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
AlertDialogPopup.displayName = "AlertDialogPopup";

// =============================================================================
// ALERT DIALOG TITLE
// =============================================================================

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Title>
>(({ className, ...props }, ref) => (
  <AlertDialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

// =============================================================================
// ALERT DIALOG DESCRIPTION
// =============================================================================

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Description>
>(({ className, ...props }, ref) => (
  <AlertDialog.Description
    ref={ref}
    className={cn("mt-2 text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

// =============================================================================
// ALERT DIALOG CLOSE
// =============================================================================

const AlertDialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Close>
>(({ className, ...props }, ref) => (
  <AlertDialog.Close
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors select-none",
      "border border-border bg-background text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring",
      className
    )}
    {...props}
  />
));
AlertDialogClose.displayName = "AlertDialogClose";

// =============================================================================
// ALERT DIALOG ACTION (Destructive action button)
// =============================================================================

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AlertDialog.Close>
>(({ className, ...props }, ref) => (
  <AlertDialog.Close
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors select-none",
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring",
      className
    )}
    {...props}
  />
));
AlertDialogAction.displayName = "AlertDialogAction";

// =============================================================================
// ALERT DIALOG HEADER
// =============================================================================

const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
AlertDialogHeader.displayName = "AlertDialogHeader";

// =============================================================================
// ALERT DIALOG FOOTER
// =============================================================================

const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-6 flex justify-end gap-3", className)}
    {...props}
  />
));
AlertDialogFooter.displayName = "AlertDialogFooter";

// =============================================================================
// ALERT DIALOG HANDLE (for programmatic open/close from detached triggers)
// =============================================================================

const AlertDialogHandle = AlertDialog.Handle;
const createAlertDialogHandle = AlertDialog.createHandle;

// =============================================================================
// EXPORTS
// =============================================================================

export {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogViewport,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogHandle,
  createAlertDialogHandle,
};
