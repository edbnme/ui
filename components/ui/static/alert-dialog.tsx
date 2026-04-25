/**
 * AlertDialog — modal confirmation surface built on Base UI's AlertDialog.
 *
 * Use for **destructive or blocking decisions** (delete, discard, sign out).
 * AlertDialog differs from Dialog in three key ways, enforced by Base UI:
 *   1. Non-dismissible — no Escape key, no backdrop-click dismissal.
 *   2. Role `alertdialog` — announces immediately, traps focus.
 *   3. Requires an explicit action/cancel pair (not just a close button).
 *
 * Every sub-component accepts Base UI's `render` prop for element
 * polymorphism (the Base UI equivalent of the Radix / shadcn `asChild`
 * pattern).
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.3.0
 * @brand      edbn/ui — <https://ui.edbn.me>
 * @docs       https://ui.edbn.me/docs/components/alert-dialog
 * @source     https://ui.edbn.me/r/alert-dialog.json
 * @registry   https://ui.edbn.me/r
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/alert-dialog
 * @a11y       WAI-ARIA AlertDialog pattern (role="alertdialog"); focus trap,
 *             scroll lock, automatic `aria-labelledby` / `aria-describedby`
 *             wiring via Base UI. Always render a Title and an explicit
 *             action/cancel pair.
 *
 * ## Anatomy
 * ```tsx
 * <AlertDialogRoot>
 *   <AlertDialogTrigger>Delete</AlertDialogTrigger>
 *   <AlertDialogPortal>
 *     <AlertDialogBackdrop />
 *     <AlertDialogPopup>
 *       <AlertDialogHeader>
 *         <AlertDialogTitle>Delete account?</AlertDialogTitle>
 *         <AlertDialogDescription>This is permanent.</AlertDialogDescription>
 *       </AlertDialogHeader>
 *       <AlertDialogFooter>
 *         <AlertDialogClose>Cancel</AlertDialogClose>
 *         <AlertDialogAction>Delete</AlertDialogAction>
 *       </AlertDialogFooter>
 *     </AlertDialogPopup>
 *   </AlertDialogPortal>
 * </AlertDialogRoot>
 * ```
 *
 * ## Controlled
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 * <AlertDialogRoot open={open} onOpenChange={setOpen}>…</AlertDialogRoot>
 * ```
 *
 * ## Detached trigger with typed payload
 * ```tsx
 * const handle = createAlertDialogHandle<{ projectId: string }>();
 * <AlertDialogTrigger handle={handle} payload={{ projectId: "p1" }}>Delete</AlertDialogTrigger>
 * <AlertDialogRoot handle={handle}>
 *   {({ payload }) => <AlertDialogPortal>…</AlertDialogPortal>}
 * </AlertDialogRoot>
 * ```
 * @registryDescription Accessible alert dialog with focus trap, keyboard handling, and portal rendering.
 * @registryCssVars
 */
"use client";

import * as React from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "@/lib/utils";

// ---- ALERT DIALOG ROOT ------------------------------------------------------

/**
 * Top-level AlertDialog provider. Forwards all Base UI `AlertDialog.Root`
 * props (`open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`,
 * `actionsRef`, `handle`, `defaultTriggerId`, `triggerId`).
 *
 * Note: AlertDialog is always modal and always traps focus. Unlike Dialog,
 * it cannot be dismissed by Escape key or backdrop click — the user must
 * choose the action or the cancel button.
 *
 * @since 0.3.0
 */
export type AlertDialogRootProps = React.ComponentProps<
  typeof AlertDialog.Root
>;
const AlertDialogRoot = (props: AlertDialogRootProps) => (
  <AlertDialog.Root {...props} />
);
AlertDialogRoot.displayName = "AlertDialogRoot";

// ---- ALERT DIALOG TRIGGER ---------------------------------------------------

/**
 * Styled button that opens the alert dialog. Pass Base UI's `render` prop to
 * use a custom element (e.g. your `Button`).
 *
 * **Data attributes** — `data-disabled`, `data-popup-open`.
 *
 * **Passthrough props** — `className`, `handle`, `id`, `nativeButton`,
 * `payload`, `render`, `style`, plus native `<button>` attrs.
 *
 * @since 0.3.0
 */
export type AlertDialogTriggerProps = React.ComponentProps<
  typeof AlertDialog.Trigger
>;
function AlertDialogTrigger({ className, ...props }: AlertDialogTriggerProps) {
  return (
    <AlertDialog.Trigger
      data-slot="alert-dialog-trigger"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4",
        "border border-border bg-background text-sm font-medium text-foreground",
        "select-none transition-colors",
        "hover:bg-muted active:bg-muted/80",
        "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// ---- ALERT DIALOG PORTAL ----------------------------------------------------

/**
 * Portals alert dialog content into a stable DOM location. Pass
 * `keepMounted` to retain children when closed (for external animators).
 *
 * **Passthrough props** — `className`, `container`, `keepMounted`, `render`,
 * `style`.
 *
 * @since 0.3.0
 */
export type AlertDialogPortalProps = React.ComponentProps<
  typeof AlertDialog.Portal
>;
const AlertDialogPortal = (props: AlertDialogPortalProps) => (
  <AlertDialog.Portal {...props} />
);
AlertDialogPortal.displayName = "AlertDialogPortal";

// ---- ALERT DIALOG BACKDROP --------------------------------------------------

/**
 * Dimming overlay behind the popup. The user cannot dismiss by clicking
 * this — AlertDialog requires an explicit choice.
 *
 * **Data attributes** — `data-open`, `data-closed`, `data-starting-style`,
 * `data-ending-style`.
 *
 * @since 0.3.0
 */
export type AlertDialogBackdropProps = React.ComponentProps<
  typeof AlertDialog.Backdrop
>;
function AlertDialogBackdrop({
  className,
  ...props
}: AlertDialogBackdropProps) {
  return (
    <AlertDialog.Backdrop
      data-slot="alert-dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        "transition-opacity duration-200 ease-out",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    />
  );
}
AlertDialogBackdrop.displayName = "AlertDialogBackdrop";

// ---- ALERT DIALOG VIEWPORT --------------------------------------------------

/**
 * Optional scroll container for alert dialogs with tall content. Omit for
 * centered, fixed-size dialogs.
 *
 * **Data attributes** — `data-open`, `data-closed`, `data-starting-style`,
 * `data-ending-style`.
 *
 * @since 0.3.0
 */
export type AlertDialogViewportProps = React.ComponentProps<
  typeof AlertDialog.Viewport
>;
function AlertDialogViewport({
  className,
  ...props
}: AlertDialogViewportProps) {
  return (
    <AlertDialog.Viewport
      data-slot="alert-dialog-viewport"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-auto",
        className
      )}
      {...props}
    />
  );
}
AlertDialogViewport.displayName = "AlertDialogViewport";

// ---- ALERT DIALOG POPUP -----------------------------------------------------

/**
 * The alert dialog surface. Smaller than Dialog (`max-w-md`) — alert dialogs
 * are intentionally compact to keep the decision focused. `aria-labelledby`
 * and `aria-describedby` are wired automatically when `AlertDialogTitle` and
 * `AlertDialogDescription` are present inside.
 *
 * **Data attributes** — `data-open`, `data-closed`, `data-starting-style`,
 * `data-ending-style`.
 *
 * @since 0.3.0
 */
export type AlertDialogPopupProps = React.ComponentProps<
  typeof AlertDialog.Popup
>;
function AlertDialogPopup({ className, ...props }: AlertDialogPopupProps) {
  return (
    <AlertDialog.Popup
      data-slot="alert-dialog-popup"
      className={cn(
        // Positioning — centered
        "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        // Size — compact for focused decisions
        "w-[calc(100vw-2rem)] max-w-md",
        // Surface — Apple-like
        "rounded-xl border border-border bg-background p-6 text-foreground shadow-2xl",
        // Transition — GPU-accelerated
        "transform-gpu transition-[translate,scale,opacity] duration-200 ease-out",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        // Reduced motion
        "motion-reduce:transform-none motion-reduce:transition-opacity",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        // Focus managed by children
        "focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
AlertDialogPopup.displayName = "AlertDialogPopup";

// ---- ALERT DIALOG TITLE -----------------------------------------------------

/**
 * Accessible alert dialog title. Wired to `aria-labelledby` automatically.
 * **Required** — AlertDialog without a Title will warn in dev.
 *
 * @since 0.3.0
 */
export type AlertDialogTitleProps = React.ComponentProps<
  typeof AlertDialog.Title
>;
function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <AlertDialog.Title
      data-slot="alert-dialog-title"
      className={cn(
        "text-lg leading-none font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}
AlertDialogTitle.displayName = "AlertDialogTitle";

// ---- ALERT DIALOG DESCRIPTION -----------------------------------------------

/**
 * Accessible alert dialog description. Wired to `aria-describedby`
 * automatically. Keep concise — one or two sentences max.
 *
 * @since 0.3.0
 */
export type AlertDialogDescriptionProps = React.ComponentProps<
  typeof AlertDialog.Description
>;
function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialog.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
AlertDialogDescription.displayName = "AlertDialogDescription";

// ---- ALERT DIALOG CLOSE (cancel action) -------------------------------------

/**
 * The cancel button. Styled as a secondary/outline button by default;
 * overridable via `className` or `render`. Activating this closes the
 * dialog without running the destructive action.
 *
 * **Data attributes** — `data-disabled`.
 *
 * **Passthrough props** — `className`, `nativeButton`, `render`, `style`,
 * plus native `<button>` attrs.
 *
 * @since 0.3.0
 */
export type AlertDialogCloseProps = React.ComponentProps<
  typeof AlertDialog.Close
>;
function AlertDialogClose({ className, ...props }: AlertDialogCloseProps) {
  return (
    <AlertDialog.Close
      data-slot="alert-dialog-close"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4",
        "border border-border bg-background text-sm font-medium text-foreground",
        "select-none transition-colors",
        "hover:bg-muted active:bg-muted/80",
        "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
AlertDialogClose.displayName = "AlertDialogClose";

// ---- ALERT DIALOG ACTION (destructive action) -------------------------------

/**
 * The primary/destructive action button. Styled as `bg-destructive` by
 * default since alert dialogs most commonly confirm destructive operations.
 * For non-destructive confirmations, override `className` or pass a
 * `render` prop with your own button variant.
 *
 * Implemented on top of Base UI's `AlertDialog.Close` — activating the
 * action closes the dialog. Wire the actual destructive side-effect to the
 * button's `onClick`.
 *
 * **Data attributes** — `data-disabled`.
 *
 * @since 0.3.0
 * @example
 * ```tsx
 * <AlertDialogAction onClick={() => deleteAccount()}>
 *   Delete account
 * </AlertDialogAction>
 * ```
 */
export type AlertDialogActionProps = React.ComponentProps<
  typeof AlertDialog.Close
>;
function AlertDialogAction({ className, ...props }: AlertDialogActionProps) {
  return (
    <AlertDialog.Close
      data-slot="alert-dialog-action"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4",
        "bg-destructive text-sm font-medium text-destructive-foreground",
        "select-none transition-colors",
        "hover:bg-destructive/90 active:bg-destructive/80",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
AlertDialogAction.displayName = "AlertDialogAction";

// ---- ALERT DIALOG HEADER ----------------------------------------------------

/**
 * Layout helper grouping `AlertDialogTitle` + `AlertDialogDescription`.
 * Renders a `<div>` with a stable `data-slot`.
 *
 * @since 0.3.0
 */
export type AlertDialogHeaderProps = React.ComponentProps<"div">;
function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}
AlertDialogHeader.displayName = "AlertDialogHeader";

// ---- ALERT DIALOG FOOTER ----------------------------------------------------

/**
 * Layout helper — horizontal action row on ≥sm; reversed vertical stack on
 * narrow viewports so the primary action stays on top (easier to tap).
 *
 * @since 0.3.0
 */
export type AlertDialogFooterProps = React.ComponentProps<"div">;
function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}
AlertDialogFooter.displayName = "AlertDialogFooter";

// ---- ALERT DIALOG HANDLE (detached-trigger API) -----------------------------

/**
 * Handle type produced by {@link createAlertDialogHandle}. Pass the same
 * handle to `<AlertDialogRoot>` and any detached `<AlertDialogTrigger>`s to
 * connect them without prop drilling.
 *
 * @since 0.3.0
 */
const AlertDialogHandle = AlertDialog.Handle;

/**
 * Creates a typed handle for detached triggers. The generic is the payload
 * type carried from a trigger to the root's function-as-children.
 *
 * @since 0.3.0
 * @example
 * ```tsx
 * const handle = createAlertDialogHandle<{ id: string }>();
 * ```
 */
const createAlertDialogHandle = AlertDialog.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

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
