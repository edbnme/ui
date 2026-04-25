/**
 * Toast — Transient notifications that auto-dismiss.
 *
 * Built on the Base UI `Toast` primitive. Use for brief, non-blocking
 * status messages ("Saved", "Link copied", "Failed to upload"). For
 * inline status banners that stay visible, use `Alert`. For blocking
 * confirmation, use `AlertDialog`.
 *
 * Setup (once, usually in `app/layout.tsx`):
 * ```tsx
 * import { ToastProvider, ToastViewport } from "@/components/ui/static/toast";
 *
 * <ToastProvider>
 *   {children}
 *   <ToastViewport />
 * </ToastProvider>
 * ```
 *
 * Show a toast (imperative API):
 * ```tsx
 * const toast = useToastManager();
 * toast.add({ title: "Saved", description: "Your changes were saved." });
 * ```
 *
 * Accessibility: `ToastRoot` renders in a live region — screen readers
 * announce new toasts as they appear. Close buttons get `aria-label`
 * automatically from Base UI. Respects `prefers-reduced-motion`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/toast
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/toast
 * @registryDescription Notification toasts with auto-dismiss, actions, and stacking.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import { X } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- PROVIDER ---------------------------------------------------------------

/**
 * Top-level provider. Owns the toast queue, limit, and global timeout.
 * Wrap your app root once; never nested.
 *
 * @since 0.1.0
 */
const ToastProvider = Toast.Provider;

// ---- PORTAL -----------------------------------------------------------------

/**
 * Portals the `ToastViewport` (and its toasts) to `document.body` so
 * nothing overflow-clips them. Use when your viewport sits deep in the
 * tree.
 *
 * @since 0.1.0
 */
const ToastPortal = Toast.Portal;

// ---- VIEWPORT ---------------------------------------------------------------

export type ToastViewportProps = React.ComponentPropsWithoutRef<
  typeof Toast.Viewport
>;

/**
 * The positioning container. Defaults to top-of-screen on mobile, bottom
 * right on `sm+`.
 *
 * @since 0.1.0
 */
function ToastViewport({ className, ...props }: ToastViewportProps) {
  return (
    <Toast.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4",
        "sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-96",
        className
      )}
      {...props}
    />
  );
}
ToastViewport.displayName = "ToastViewport";

// ---- ROOT -------------------------------------------------------------------

export type ToastRootProps = React.ComponentPropsWithoutRef<typeof Toast.Root>;

/**
 * A single toast. Handles swipe-to-dismiss, timed auto-dismiss, and
 * entrance / exit animations.
 *
 * Data attributes for animating:
 * - `data-starting-style` — initial mount (slides in)
 * - `data-ending-style` — unmounting (slides out)
 * - `data-swipe-move` — user is dragging
 * - `data-swipe-end` — drag completed past threshold
 * - `data-swipe-cancel` — drag released before threshold
 *
 * @since 0.1.0
 */
function ToastRoot({ className, ...props }: ToastRootProps) {
  return (
    <Toast.Root
      data-slot="toast-root"
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-md border border-border bg-background p-4 pr-6 shadow-lg",
        "transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none",
        "data-swipe-cancel:translate-x-0",
        "data-swipe-end:translate-x-(--toast-swipe-end-x)",
        "data-swipe-move:translate-x-(--toast-swipe-move-x)",
        "data-starting-style:opacity-0 data-starting-style:translate-y-full sm:data-starting-style:translate-x-full sm:data-starting-style:translate-y-0",
        "data-ending-style:opacity-0 data-ending-style:translate-x-full",
        className
      )}
      {...props}
    />
  );
}
ToastRoot.displayName = "ToastRoot";

// ---- CONTENT ----------------------------------------------------------------

export type ToastContentProps = React.ComponentPropsWithoutRef<
  typeof Toast.Content
>;

/**
 * Wrapper for the title + description pair — keeps them grouped so the
 * close button can float to the right.
 *
 * @since 0.1.0
 */
function ToastContent({ className, ...props }: ToastContentProps) {
  return (
    <Toast.Content
      data-slot="toast-content"
      className={cn("flex-1", className)}
      {...props}
    />
  );
}
ToastContent.displayName = "ToastContent";

// ---- TITLE ------------------------------------------------------------------

export type ToastTitleProps = React.ComponentPropsWithoutRef<typeof Toast.Title>;

/**
 * The announcement headline. Linked to the root via `aria-labelledby`.
 *
 * @since 0.1.0
 */
function ToastTitle({ className, ...props }: ToastTitleProps) {
  return (
    <Toast.Title
      data-slot="toast-title"
      className={cn("text-sm font-semibold [&+div]:text-xs", className)}
      {...props}
    />
  );
}
ToastTitle.displayName = "ToastTitle";

// ---- DESCRIPTION ------------------------------------------------------------

export type ToastDescriptionProps = React.ComponentPropsWithoutRef<
  typeof Toast.Description
>;

/**
 * Supporting body text. Linked to the root via `aria-describedby`.
 *
 * @since 0.1.0
 */
function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return (
    <Toast.Description
      data-slot="toast-description"
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  );
}
ToastDescription.displayName = "ToastDescription";

// ---- CLOSE ------------------------------------------------------------------

export type ToastCloseProps = React.ComponentPropsWithoutRef<typeof Toast.Close>;

/**
 * The dismiss button. Appears on hover (kept discoverable for keyboard
 * users — fades in on focus too).
 *
 * @since 0.1.0
 */
function ToastClose({ className, children, ...props }: ToastCloseProps) {
  return (
    <Toast.Close
      data-slot="toast-close"
      className={cn(
        "absolute right-1 top-1 rounded-md p-1 text-foreground/50",
        "opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none",
        "hover:text-foreground",
        "focus:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "group-hover:opacity-100",
        className
      )}
      {...props}
    >
      {children ?? <X className="h-4 w-4" />}
    </Toast.Close>
  );
}
ToastClose.displayName = "ToastClose";

// ---- ACTION -----------------------------------------------------------------

export type ToastActionProps = React.ComponentPropsWithoutRef<
  typeof Toast.Action
>;

/**
 * Optional primary action embedded in the toast (e.g. "Undo").
 *
 * @since 0.1.0
 */
function ToastAction({ className, ...props }: ToastActionProps) {
  return (
    <Toast.Action
      data-slot="toast-action"
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-secondary",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
ToastAction.displayName = "ToastAction";

// ---- IMPERATIVE API ---------------------------------------------------------

/**
 * Create a standalone toast manager (for use outside React — e.g. inside
 * a RTK Query middleware or a non-React error handler).
 *
 * @since 0.1.0
 */
const createToastManager = Toast.createToastManager;

/**
 * Hook that returns the current provider's toast manager. Call
 * `manager.add(...)` / `manager.close(...)` / `manager.update(...)`.
 *
 * @since 0.1.0
 */
const useToastManager = Toast.useToastManager;

// ---- EXPORTS ----------------------------------------------------------------

export {
  ToastProvider,
  ToastPortal,
  ToastViewport,
  ToastRoot,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  createToastManager,
  useToastManager,
};
