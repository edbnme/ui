/**
 * Toast — Notification toasts with provider, viewport, and configurable actions.
 * Built on @base-ui/react Toast primitive.
 *
 * @example
 * <ToastProvider>
 *   <ToastViewport />
 *   // Toasts triggered via useToastManager
 * </ToastProvider>
 *
 * @see https://base-ui.com/react/components/toast
 */
"use client";

import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react";

// =============================================================================
// TOAST PROVIDER
// =============================================================================

const ToastProvider = Toast.Provider;

// =============================================================================
// TOAST VIEWPORT
// =============================================================================

const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Toast.Viewport>
>(({ className, ...props }, ref) => (
  <Toast.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-96",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

// =============================================================================
// TOAST ROOT
// =============================================================================

const ToastRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Toast.Root>
>(({ className, ...props }, ref) => (
  <Toast.Root
    ref={ref}
    className={cn(
      "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border border-border bg-background p-4 pr-6 shadow-lg transition-all",
      "data-swipe-cancel:translate-x-0",
      "data-swipe-end:translate-x-(--toast-swipe-end-x)",
      "data-swipe-move:translate-x-(--toast-swipe-move-x)",
      "data-starting-style:opacity-0 data-starting-style:translate-y-full sm:data-starting-style:translate-x-full sm:data-starting-style:translate-y-0",
      "data-ending-style:opacity-0 data-ending-style:translate-x-full",
      className
    )}
    {...props}
  />
));
ToastRoot.displayName = "ToastRoot";

// =============================================================================
// TOAST TITLE
// =============================================================================

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Toast.Title>
>(({ className, ...props }, ref) => (
  <Toast.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

// =============================================================================
// TOAST DESCRIPTION
// =============================================================================

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<typeof Toast.Description>
>(({ className, ...props }, ref) => (
  <Toast.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

// =============================================================================
// TOAST CLOSE
// =============================================================================

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof Toast.Close>
>(({ className, ...props }, ref) => (
  <Toast.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity",
      "hover:text-foreground",
      "focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring",
      "group-hover:opacity-100",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </Toast.Close>
));
ToastClose.displayName = "ToastClose";

// =============================================================================
// TOAST ACTION
// =============================================================================

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithRef<typeof Toast.Action>
>(({ className, ...props }, ref) => (
  <Toast.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium transition-colors",
      "hover:bg-secondary",
      "focus:outline-none focus:ring-1 focus:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
