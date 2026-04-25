/**
 * Dialog — modal overlay built on Base UI's Dialog primitive.
 *
 * Provides an accessible, composable dialog system with focus management,
 * scroll locking, keyboard dismissal, and motion-safe transitions. Every
 * sub-component extends its Base UI counterpart and accepts Base UI's
 * `render` prop for element polymorphism (the Base UI equivalent of the
 * Radix / shadcn `asChild` pattern).
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.2.5
 * @brand      edbn/ui — <https://ui.edbn.me>
 * @docs       https://ui.edbn.me/docs/components/dialog
 * @source     https://ui.edbn.me/r/dialog.json
 * @registry   https://ui.edbn.me/r
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/dialog
 * @a11y       WAI-ARIA Dialog (Modal) pattern; focus trap, Escape dismiss,
 *             scroll lock, and automatic `aria-labelledby` /
 *             `aria-describedby` wiring via Base UI.
 *
 * ## Anatomy
 * ```tsx
 * <DialogRoot>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <DialogPortal>
 *     <DialogBackdrop />
 *     <DialogPopup>
 *       <DialogCloseIconButton />        // optional corner close
 *       <DialogHeader>
 *         <DialogTitle>—</DialogTitle>
 *         <DialogDescription>—</DialogDescription>
 *       </DialogHeader>
 *       <DialogFooter>
 *         <DialogClose>Cancel</DialogClose>   // unstyled action
 *       </DialogFooter>
 *     </DialogPopup>
 *   </DialogPortal>
 * </DialogRoot>
 * ```
 *
 * ## Controlled open state
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 * <DialogRoot open={open} onOpenChange={setOpen}>—</DialogRoot>
 * ```
 *
 * ## Imperative close via `actionsRef`
 * ```tsx
 * const actions = React.useRef<Dialog.Root.Actions>(null);
 * <DialogRoot actionsRef={actions}>—</DialogRoot>
 * // Later: actions.current?.unmount();
 * ```
 *
 * ## Detached trigger with typed payload
 * ```tsx
 * const handle = createDialogHandle<{ userId: string }>();
 * <DialogTrigger handle={handle} payload={{ userId: "1" }}>Edit</DialogTrigger>
 * <DialogRoot handle={handle}>
 *   {({ payload }) => <DialogPortal>—</DialogPortal>}
 * </DialogRoot>
 * ```
 * @registryDescription Modal dialog with focus trap, backdrop, and controlled state.
 */
"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- DIALOG ROOT ------------------------------------------------------------

/**
 * Top-level Dialog provider. Manages open state, focus trap, scroll lock,
 * and keyboard dismissal. Forwards all Base UI `Dialog.Root` props, including
 * `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `modal`,
 * `disablePointerDismissal`, `actionsRef`, `handle`, `defaultTriggerId`, and
 * `triggerId`.
 *
 * @since 0.2.5
 */
export type DialogRootProps = React.ComponentProps<typeof Dialog.Root>;
const DialogRoot = (props: DialogRootProps) => <Dialog.Root {...props} />;
DialogRoot.displayName = "DialogRoot";

// ---- DIALOG TRIGGER ---------------------------------------------------------

/**
 * Styled button that opens the dialog. Pass Base UI's `render` prop to use a
 * custom element (e.g. your design-system `Button`) while preserving
 * dialog-trigger behavior.
 *
 * **Data attributes**
 * - `data-disabled` — present when disabled
 * - `data-popup-open` — present while the dialog is open
 *
 * **Passthrough props** — `className`, `handle`, `id`, `nativeButton`,
 * `payload`, `render`, `style`, plus native `<button>` attrs.
 *
 * @since 0.2.5
 * @example Custom render
 * ```tsx
 * <DialogTrigger render={<Button variant="outline">Open</Button>} />
 * ```
 */
export type DialogTriggerProps = React.ComponentProps<typeof Dialog.Trigger>;
function DialogTrigger({ className, ...props }: DialogTriggerProps) {
  return (
    <Dialog.Trigger
      data-slot="dialog-trigger"
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
DialogTrigger.displayName = "DialogTrigger";

// ---- DIALOG PORTAL ----------------------------------------------------------

/**
 * Portals dialog content into a stable DOM location. Pass `keepMounted` to
 * retain children in the tree when closed (required when driving exit
 * animations with an external animator such as Framer Motion's
 * `<AnimatePresence>`).
 *
 * **Passthrough props** — `className`, `container`, `keepMounted`, `render`,
 * `style`.
 *
 * @since 0.2.5
 */
export type DialogPortalProps = React.ComponentProps<typeof Dialog.Portal>;
const DialogPortal = (props: DialogPortalProps) => <Dialog.Portal {...props} />;
DialogPortal.displayName = "DialogPortal";

// ---- DIALOG BACKDROP --------------------------------------------------------

/**
 * Dimming overlay behind the popup. By design, Base UI omits nested backdrops
 * so a parent dialog remains visible beneath a nested one.
 *
 * **Data attributes** — `data-open`, `data-closed`, `data-starting-style`,
 * `data-ending-style`.
 *
 * @since 0.2.5
 */
export type DialogBackdropProps = React.ComponentProps<typeof Dialog.Backdrop>;
function DialogBackdrop({ className, ...props }: DialogBackdropProps) {
  return (
    <Dialog.Backdrop
      data-slot="dialog-backdrop"
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
DialogBackdrop.displayName = "DialogBackdrop";

// ---- DIALOG VIEWPORT --------------------------------------------------------

/**
 * Optional scroll container for dialogs whose content can exceed the viewport.
 * Skip for centered, fixed-size dialogs.
 *
 * **Data attributes** — `data-open`, `data-closed`, `data-nested`,
 * `data-nested-dialog-open`, `data-starting-style`, `data-ending-style`.
 *
 * @since 0.2.5
 */
export type DialogViewportProps = React.ComponentProps<typeof Dialog.Viewport>;
function DialogViewport({ className, ...props }: DialogViewportProps) {
  return (
    <Dialog.Viewport
      data-slot="dialog-viewport"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-auto",
        className
      )}
      {...props}
    />
  );
}
DialogViewport.displayName = "DialogViewport";

// ---- DIALOG POPUP -----------------------------------------------------------

/**
 * The dialog surface. Centered with a subtle scale-in. `aria-labelledby` and
 * `aria-describedby` are wired automatically when `DialogTitle` and
 * `DialogDescription` are present inside. Supports `initialFocus` and
 * `finalFocus` refs to override focus destinations on open/close.
 *
 * **Data attributes** — `data-open`, `data-closed`, `data-nested`,
 * `data-nested-dialog-open`, `data-starting-style`, `data-ending-style`.
 *
 * **CSS variables** — `--nested-dialogs` (nesting depth), used here for a
 * push-back effect on the parent when a child dialog opens.
 *
 * @since 0.2.5
 * @example Focus the first input on open
 * ```tsx
 * const inputRef = React.useRef<HTMLInputElement>(null);
 * <DialogPopup initialFocus={inputRef}>
 *   <input ref={inputRef} />
 * </DialogPopup>
 * ```
 */
export type DialogPopupProps = React.ComponentProps<typeof Dialog.Popup>;
function DialogPopup({ className, ...props }: DialogPopupProps) {
  return (
    <Dialog.Popup
      data-slot="dialog-popup"
      className={cn(
        // Positioning — centered overlay
        "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        // Size — respects small viewports
        "w-[calc(100vw-2rem)] max-w-lg",
        // Surface — Apple-like material: crisp radius, subtle border, soft shadow
        "rounded-xl border border-border bg-background p-6 text-foreground shadow-2xl",
        // Transition — GPU-accelerated
        "transform-gpu transition-[translate,scale,opacity] duration-200 ease-out",
        // Enter / exit (data-starting-style / data-ending-style)
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        // Reduced motion — keep fade, drop transforms
        "motion-reduce:transform-none motion-reduce:transition-opacity",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        // Nested stacking effect driven by --nested-dialogs
        "data-nested-dialog-open:scale-[calc(1-0.05*var(--nested-dialogs))]",
        "data-nested-dialog-open:opacity-80",
        "motion-reduce:data-nested-dialog-open:scale-100",
        "motion-reduce:data-nested-dialog-open:opacity-100",
        // Focus is managed by children
        "focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
DialogPopup.displayName = "DialogPopup";

// ---- DIALOG TITLE -----------------------------------------------------------

/**
 * Accessible dialog title. Its id is wired to the popup's `aria-labelledby`
 * automatically. If the visual design omits a heading, wrap in a visually-
 * hidden element via `render` — **do not omit the `DialogTitle` itself**.
 *
 * @since 0.2.5
 */
export type DialogTitleProps = React.ComponentProps<typeof Dialog.Title>;
function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <Dialog.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg leading-none font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}
DialogTitle.displayName = "DialogTitle";

// ---- DIALOG DESCRIPTION -----------------------------------------------------

/**
 * Accessible dialog description. Wired to `aria-describedby` automatically.
 *
 * @since 0.2.5
 */
export type DialogDescriptionProps = React.ComponentProps<
  typeof Dialog.Description
>;
function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <Dialog.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
DialogDescription.displayName = "DialogDescription";

// ---- DIALOG CLOSE -----------------------------------------------------------

/**
 * Unstyled action that closes the dialog when activated. Use inside
 * `DialogFooter` for "Cancel" / "Done" / custom close buttons. Bring your own
 * surface classes — this component only supplies behavior, focus ring, and
 * disabled handling.
 *
 * For the common corner-X pattern, use {@link DialogCloseIconButton}.
 *
 * **Data attributes** — `data-disabled`.
 *
 * **Passthrough props** — `className`, `nativeButton`, `render`, `style`, plus
 * native `<button>` attrs.
 *
 * @since 0.2.5
 * @example Footer cancel button
 * ```tsx
 * <DialogFooter>
 *   <DialogClose className="h-9 rounded-md border px-4 text-sm">
 *     Cancel
 *   </DialogClose>
 * </DialogFooter>
 * ```
 *
 * @example Custom element via render
 * ```tsx
 * <DialogClose render={<Button variant="ghost">Cancel</Button>} />
 * ```
 */
export type DialogCloseProps = React.ComponentProps<typeof Dialog.Close>;
function DialogClose({ className, ...props }: DialogCloseProps) {
  return (
    <Dialog.Close
      data-slot="dialog-close"
      className={cn(
        "inline-flex items-center justify-center",
        "select-none transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
DialogClose.displayName = "DialogClose";

// ---- DIALOG CLOSE ICON BUTTON -----------------------------------------------

/**
 * Styled corner-X close button — a convenience built on Base UI's
 * `Dialog.Close`. Renders an absolutely positioned circular 32px hit-target
 * with the Phosphor X icon and an accessible name ("Close dialog") for
 * screen readers.
 *
 * Place inside a `DialogPopup` before `DialogHeader`; the header has `pr-6`
 * by default to reserve space for this button.
 *
 * **Data attributes** — `data-disabled`.
 *
 * @since 0.2.5
 * @example
 * ```tsx
 * <DialogPopup>
 *   <DialogCloseIconButton />
 *   <DialogHeader>—</DialogHeader>
 * </DialogPopup>
 * ```
 */
export type DialogCloseIconButtonProps = DialogCloseProps;
function DialogCloseIconButton({
  className,
  "aria-label": ariaLabel = "Close dialog",
  ...props
}: DialogCloseIconButtonProps) {
  return (
    <Dialog.Close
      data-slot="dialog-close-icon-button"
      aria-label={ariaLabel}
      className={cn(
        "absolute top-3 right-3",
        "inline-flex size-8 items-center justify-center rounded-full",
        "text-muted-foreground opacity-70 transition-opacity",
        "hover:bg-muted hover:opacity-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "data-disabled:pointer-events-none data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <X aria-hidden className="size-4" weight="bold" />
      <span className="sr-only">Close</span>
    </Dialog.Close>
  );
}
DialogCloseIconButton.displayName = "DialogCloseIconButton";

// ---- DIALOG HEADER ----------------------------------------------------------

/**
 * Layout helper grouping `DialogTitle` + `DialogDescription`. Reserves right
 * padding (`pr-6`) for an optional `DialogCloseIconButton`. Not a Base UI
 * element — renders a `<div>` with a stable `data-slot` for global styling.
 *
 * @since 0.2.5
 */
export type DialogHeaderProps = React.ComponentProps<"div">;
function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col space-y-1.5 pr-6 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}
DialogHeader.displayName = "DialogHeader";

// ---- DIALOG FOOTER ----------------------------------------------------------

/**
 * Layout helper — horizontal action row on =sm; reversed vertical stack on
 * narrow viewports so the primary action stays on top.
 *
 * @since 0.2.5
 */
export type DialogFooterProps = React.ComponentProps<"div">;
function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}
DialogFooter.displayName = "DialogFooter";

// ---- DIALOG HANDLE (imperative / detached-trigger API) ----------------------

/**
 * Handle type produced by {@link createDialogHandle}. Pass the same handle to
 * `<DialogRoot>` and any detached `<DialogTrigger>`s to connect them without
 * prop drilling.
 *
 * @since 0.2.5
 */
const DialogHandle = Dialog.Handle;

/**
 * Creates a typed handle for detached triggers. The generic is the payload
 * type carried from a trigger to the root's function-as-children.
 *
 * @since 0.2.5
 * @example
 * ```tsx
 * const handle = createDialogHandle<{ id: string }>();
 * ```
 */
const createDialogHandle = Dialog.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

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
  DialogCloseIconButton,
  DialogHeader,
  DialogFooter,
  DialogHandle,
  createDialogHandle,
};
