/**
 * Toast - Premium solid notification primitives.
 *
 * Built on Base UI Toast v1.5.0. The wrapper preserves Provider, Portal,
 * Viewport, Root, Positioner, Arrow, Content, Title, Description, Close,
 * Action, createToastManager, and useToastManager APIs.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.1.0
 * @docs https://ui.edbn.me/docs/components/toast
 * @upstream https://base-ui.com/react/components/toast
 * @registryDescription Premium solid notification toasts with actions, stacking, and swipe dismissal.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import { X } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

type StateClassName<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

function composeClassName<State>(
  baseClassName: string,
  className: StateClassName<State>
) {
  if (typeof className === "function") {
    return (state: State) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

// ---- PROVIDER ---------------------------------------------------------------

export type ToastProviderProps = Toast.Provider.Props;
const ToastProvider = Toast.Provider;

// ---- PORTAL -----------------------------------------------------------------

export type ToastPortalProps = React.ComponentProps<typeof Toast.Portal>;
const ToastPortal = Toast.Portal;

// ---- VIEWPORT ---------------------------------------------------------------

export type ToastViewportProps = React.ComponentProps<typeof Toast.Viewport>;

function ToastViewport({ className, ...props }: ToastViewportProps) {
  return (
    <Toast.Viewport
      data-slot="toast-viewport"
      className={composeClassName<Toast.Viewport.State>(
        cn(
          "fixed top-0 right-0 z-100 flex max-h-screen w-full flex-col-reverse gap-2 p-4",
          "sm:bottom-0 sm:top-auto sm:flex-col md:max-w-96",
          "data-expanded:gap-3"
        ),
        className
      )}
      {...props}
    />
  );
}
ToastViewport.displayName = "ToastViewport";

// ---- POSITIONER -------------------------------------------------------------

export type ToastPositionerProps = React.ComponentProps<
  typeof Toast.Positioner
>;

function ToastPositioner({ className, ...props }: ToastPositionerProps) {
  return (
    <Toast.Positioner
      data-slot="toast-positioner"
      className={composeClassName<Toast.Positioner.State>(
        cn(
          "z-100 max-w-[calc(100vw-2rem)] outline-none",
          "data-anchor-hidden:pointer-events-none data-anchor-hidden:opacity-0"
        ),
        className
      )}
      {...props}
    />
  );
}
ToastPositioner.displayName = "ToastPositioner";

// ---- ROOT -------------------------------------------------------------------

export type ToastRootProps = React.ComponentProps<typeof Toast.Root>;

function ToastRoot({ className, ...props }: ToastRootProps) {
  return (
    <Toast.Root
      data-slot="toast-root"
      className={composeClassName<Toast.Root.State>(
        cn(
          "group pointer-events-auto relative flex w-full items-start justify-between gap-3 overflow-hidden rounded-lg border border-border/80 bg-background p-4 pr-10 shadow-lg",
          "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          "data-starting-style:translate-y-3 data-starting-style:opacity-0 sm:data-starting-style:translate-x-4 sm:data-starting-style:translate-y-0",
          "data-ending-style:translate-y-2 data-ending-style:opacity-0 sm:data-ending-style:translate-x-4 sm:data-ending-style:translate-y-0",
          "data-swiping:translate-x-(--toast-swipe-movement-x) data-swiping:translate-y-(--toast-swipe-movement-y)",
          "data-expanded:shadow-xl data-limited:opacity-0"
        ),
        className
      )}
      {...props}
    />
  );
}
ToastRoot.displayName = "ToastRoot";

// ---- ARROW ------------------------------------------------------------------

export type ToastArrowProps = React.ComponentProps<typeof Toast.Arrow>;

function ToastArrow({ className, children, ...props }: ToastArrowProps) {
  return (
    <Toast.Arrow
      data-slot="toast-arrow"
      className={composeClassName<Toast.Arrow.State>(
        cn(
          "data-[side=top]:rotate-180 data-[side=left]:-rotate-90 data-[side=right]:rotate-90",
          "data-uncentered:opacity-0"
        ),
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          aria-hidden
          width="14"
          height="7"
          viewBox="0 0 14 7"
          className="block fill-background stroke-border"
        >
          <path d="M0 0h14L7 7z" strokeWidth="1" />
        </svg>
      )}
    </Toast.Arrow>
  );
}
ToastArrow.displayName = "ToastArrow";

// ---- CONTENT ----------------------------------------------------------------

export type ToastContentProps = React.ComponentProps<typeof Toast.Content>;

function ToastContent({ className, ...props }: ToastContentProps) {
  return (
    <Toast.Content
      data-slot="toast-content"
      className={composeClassName<Toast.Content.State>(
        "flex-1 space-y-1",
        className
      )}
      {...props}
    />
  );
}
ToastContent.displayName = "ToastContent";

// ---- TITLE ------------------------------------------------------------------

export type ToastTitleProps = React.ComponentProps<typeof Toast.Title>;

function ToastTitle({ className, ...props }: ToastTitleProps) {
  return (
    <Toast.Title
      data-slot="toast-title"
      className={composeClassName<Toast.Title.State>(
        "text-sm font-semibold leading-5 text-foreground",
        className
      )}
      {...props}
    />
  );
}
ToastTitle.displayName = "ToastTitle";

// ---- DESCRIPTION ------------------------------------------------------------

export type ToastDescriptionProps = React.ComponentProps<
  typeof Toast.Description
>;

function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return (
    <Toast.Description
      data-slot="toast-description"
      className={composeClassName<Toast.Description.State>(
        "text-sm leading-5 text-muted-foreground opacity-90",
        className
      )}
      {...props}
    />
  );
}
ToastDescription.displayName = "ToastDescription";

// ---- CLOSE ------------------------------------------------------------------

export type ToastCloseProps = React.ComponentProps<typeof Toast.Close>;

function ToastClose({ className, children, ...props }: ToastCloseProps) {
  const ariaLabel =
    props["aria-label"] ?? (children ? undefined : "Close notification");

  return (
    <Toast.Close
      data-slot="toast-close"
      aria-label={ariaLabel}
      className={composeClassName<Toast.Close.State>(
        cn(
          "absolute right-1 top-1 inline-flex size-8 items-center justify-center rounded-md p-1 text-muted-foreground",
          "opacity-0 transition-[opacity,color,background-color] duration-150 ease-out motion-reduce:transition-none",
          "hover:bg-muted hover:text-foreground",
          "focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "group-hover:opacity-100"
        ),
        className
      )}
      {...props}
    >
      {children ?? <X aria-hidden className="size-4" />}
    </Toast.Close>
  );
}
ToastClose.displayName = "ToastClose";

// ---- ACTION -----------------------------------------------------------------

export type ToastActionProps = React.ComponentProps<typeof Toast.Action>;

function ToastAction({ className, ...props }: ToastActionProps) {
  return (
    <Toast.Action
      data-slot="toast-action"
      className={composeClassName<Toast.Action.State>(
        cn(
          "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium shadow-sm",
          "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50"
        ),
        className
      )}
      {...props}
    />
  );
}
ToastAction.displayName = "ToastAction";

// ---- IMPERATIVE API ---------------------------------------------------------

const createToastManager = Toast.createToastManager;
const useToastManager = Toast.useToastManager;

// ---- EXPORTS ----------------------------------------------------------------

export {
  ToastProvider,
  ToastPortal,
  ToastViewport,
  ToastPositioner,
  ToastRoot,
  ToastArrow,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  createToastManager,
  useToastManager,
};
