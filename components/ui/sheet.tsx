/**
 * Sheet - directional slide-out panel built on `@base-ui/react/dialog`.
 *
 * Use Sheet for non-gesture side panels and task drawers. It keeps the full
 * Dialog primitive API, including detached triggers, controlled state, modal
 * modes, `render` composition, refs, function `className` / `style`, and
 * transition data attributes.
 *
 * Anatomy:
 * ```tsx
 * <SheetRoot>
 *   <SheetTrigger>Open</SheetTrigger>
 *   <SheetPortal>
 *     <SheetBackdrop />
 *     <SheetViewport>
 *       <SheetPopup side="right">
 *         <SheetCloseIconButton />
 *         <SheetHeader>
 *           <SheetTitle>Title</SheetTitle>
 *           <SheetDescription>Description</SheetDescription>
 *         </SheetHeader>
 *         <SheetBody>Content</SheetBody>
 *         <SheetFooter>
 *           <SheetClose>Done</SheetClose>
 *         </SheetFooter>
 *       </SheetPopup>
 *     </SheetViewport>
 *   </SheetPortal>
 * </SheetRoot>
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @docs       https://ui.edbn.me/docs/components/sheet
 * @source     https://ui.edbn.me/r/sheet.json
 * @registry   https://ui.edbn.me/r
 * @upstream   https://base-ui.com/react/components/dialog
 * @registryDescription Premium solid slide-out panel built on Base UI Dialog with directional CSS transitions.
 */
"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type StateClassName<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

function composeStateClassName<State>(
  baseClassName: string,
  className: StateClassName<State>
) {
  if (typeof className === "function") {
    return (state: State) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

// ---- SHEET ROOT -------------------------------------------------------------

/**
 * Top-level Sheet state holder. Forwards all Base UI `Dialog.Root` props:
 * `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `modal`,
 * `disablePointerDismissal`, `actionsRef`, `handle`, `triggerId`,
 * `defaultTriggerId`, and function-as-children payload rendering.
 *
 * @since 0.1.0
 */
export type SheetRootProps<Payload = unknown> = Dialog.Root.Props<Payload>;
function SheetRoot<Payload = unknown>(props: SheetRootProps<Payload>) {
  return <Dialog.Root {...props} />;
}
SheetRoot.displayName = "SheetRoot";

// ---- SHEET TRIGGER ----------------------------------------------------------

/**
 * Button that opens the sheet. Pass Base UI's `render` prop to compose with a
 * design-system button while preserving trigger behavior.
 *
 * **Data attributes** - `data-popup-open`, `data-disabled`.
 *
 * @since 0.1.0
 */
export type SheetTriggerProps<Payload = unknown> =
  Dialog.Trigger.Props<Payload> & React.RefAttributes<HTMLElement>;
function SheetTrigger<Payload = unknown>({
  className,
  ...props
}: SheetTriggerProps<Payload>) {
  return (
    <Dialog.Trigger
      data-slot="sheet-trigger"
      className={composeStateClassName<Dialog.Trigger.State>(
        cn(
          "inline-flex h-10 items-center justify-center rounded-md px-4",
          "border border-border bg-background text-sm font-medium text-foreground",
          "select-none transition-colors duration-150 ease-out",
          "hover:bg-muted active:bg-muted/80",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          "motion-reduce:transition-none"
        ),
        className
      )}
      {...props}
    />
  );
}
SheetTrigger.displayName = "SheetTrigger";

// ---- SHEET PORTAL -----------------------------------------------------------

/**
 * Portals sheet content into a stable DOM location. Supports `container`,
 * `keepMounted`, `render`, `className`, and `style`.
 *
 * @since 0.1.0
 */
export type SheetPortalProps = React.ComponentProps<typeof Dialog.Portal>;
const SheetPortal = (props: SheetPortalProps) => <Dialog.Portal {...props} />;
SheetPortal.displayName = "SheetPortal";

// ---- SHEET BACKDROP ---------------------------------------------------------

/**
 * Solid dim layer behind the sheet.
 *
 * **Data attributes** - `data-open`, `data-closed`, `data-starting-style`,
 * `data-ending-style`.
 *
 * @since 0.1.0
 */
export type SheetBackdropProps = React.ComponentProps<typeof Dialog.Backdrop>;
function SheetBackdrop({ className, ...props }: SheetBackdropProps) {
  return (
    <Dialog.Backdrop
      data-slot="sheet-backdrop"
      className={composeStateClassName<Dialog.Backdrop.State>(
        cn(
          "fixed inset-0 z-50 bg-foreground/45",
          "transition-opacity duration-200 ease-out",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
          "motion-reduce:transition-none"
        ),
        className
      )}
      {...props}
    />
  );
}
SheetBackdrop.displayName = "SheetBackdrop";

// ---- SHEET VIEWPORT ---------------------------------------------------------

/**
 * Full-viewport positioning and clipping container for the popup.
 *
 * **Data attributes** - `data-open`, `data-closed`, `data-nested`,
 * `data-nested-dialog-open`, `data-starting-style`, `data-ending-style`.
 *
 * @since 0.1.0
 */
export type SheetViewportProps = React.ComponentProps<typeof Dialog.Viewport>;
function SheetViewport({ className, ...props }: SheetViewportProps) {
  return (
    <Dialog.Viewport
      data-slot="sheet-viewport"
      className={composeStateClassName<Dialog.Viewport.State>(
        cn("fixed inset-0 z-50 overflow-hidden pointer-events-none"),
        className
      )}
      {...props}
    />
  );
}
SheetViewport.displayName = "SheetViewport";

// ---- SHEET POPUP ------------------------------------------------------------

const sheetVariants = cva(
  [
    "fixed z-50 flex flex-col overflow-hidden border-border bg-background text-foreground shadow-2xl",
    "pointer-events-auto outline-none transform-gpu",
    "transition-[transform,opacity] duration-200 ease-out",
    "data-starting-style:opacity-0 data-ending-style:opacity-0",
    "motion-reduce:transition-opacity",
  ],
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 max-h-[min(80dvh,42rem)] w-full rounded-b-xl border-b",
          "data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
          "motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-ending-style:translate-y-0",
        ],
        right: [
          "inset-y-0 right-0 h-dvh w-[min(30rem,calc(100vw-1rem))] border-l sm:w-[30rem]",
          "data-starting-style:translate-x-full data-ending-style:translate-x-full",
          "motion-reduce:data-starting-style:translate-x-0 motion-reduce:data-ending-style:translate-x-0",
        ],
        bottom: [
          "inset-x-0 bottom-0 max-h-[min(82dvh,44rem)] w-full rounded-t-xl border-t",
          "data-starting-style:translate-y-full data-ending-style:translate-y-full",
          "motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-ending-style:translate-y-0",
        ],
        left: [
          "inset-y-0 left-0 h-dvh w-[min(30rem,calc(100vw-1rem))] border-r sm:w-[30rem]",
          "data-starting-style:-translate-x-full data-ending-style:-translate-x-full",
          "motion-reduce:data-starting-style:translate-x-0 motion-reduce:data-ending-style:translate-x-0",
        ],
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

export type SheetSide = NonNullable<VariantProps<typeof sheetVariants>["side"]>;
export interface SheetPopupProps
  extends Dialog.Popup.Props,
    VariantProps<typeof sheetVariants> {}

/**
 * The sheet surface. Choose an edge with `side="top" | "right" | "bottom" |
 * "left"`; `right` is the default.
 *
 * **Data attributes** - `data-open`, `data-closed`, `data-nested`,
 * `data-nested-dialog-open`, `data-starting-style`, `data-ending-style`.
 *
 * @since 0.1.0
 */
function SheetPopup({
  className,
  side = "right",
  ...props
}: SheetPopupProps) {
  return (
    <Dialog.Popup
      data-slot="sheet-popup"
      className={composeStateClassName<Dialog.Popup.State>(
        sheetVariants({ side }),
        className
      )}
      {...props}
    />
  );
}
SheetPopup.displayName = "SheetPopup";

// ---- SHEET CLOSE ------------------------------------------------------------

/**
 * Unstyled close action. Use inside `SheetFooter` for Cancel, Done, or custom
 * action buttons. For the corner X affordance, use `SheetCloseIconButton`.
 *
 * **Data attributes** - `data-disabled`.
 *
 * @since 0.1.0
 */
export type SheetCloseProps = React.ComponentProps<typeof Dialog.Close>;
function SheetClose({ className, ...props }: SheetCloseProps) {
  return (
    <Dialog.Close
      data-slot="sheet-close"
      className={composeStateClassName<Dialog.Close.State>(
        cn(
          "inline-flex items-center justify-center select-none",
          "transition-colors duration-150 ease-out",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          "motion-reduce:transition-none"
        ),
        className
      )}
      {...props}
    />
  );
}
SheetClose.displayName = "SheetClose";

// ---- SHEET CLOSE ICON BUTTON ------------------------------------------------

/**
 * Styled corner close button with a 32px hit target and an accessible name.
 *
 * @since 0.3.0
 */
export type SheetCloseIconButtonProps = SheetCloseProps;
function SheetCloseIconButton({
  className,
  "aria-label": ariaLabel = "Close sheet",
  ...props
}: SheetCloseIconButtonProps) {
  return (
    <Dialog.Close
      data-slot="sheet-close-icon-button"
      aria-label={ariaLabel}
      className={composeStateClassName<Dialog.Close.State>(
        cn(
          "absolute top-4 right-4 z-10 inline-flex size-8 items-center justify-center rounded-md",
          "text-muted-foreground transition-colors duration-150 ease-out",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          "motion-reduce:transition-none"
        ),
        className
      )}
      {...props}
    >
      <X aria-hidden className="size-4" weight="bold" />
      <span className="sr-only">Close</span>
    </Dialog.Close>
  );
}
SheetCloseIconButton.displayName = "SheetCloseIconButton";

// ---- SHEET HEADER -----------------------------------------------------------

/**
 * Top region for `SheetTitle` and `SheetDescription`.
 *
 * @since 0.1.0
 */
export type SheetHeaderProps = React.ComponentProps<"div">;
function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-4 pr-14", className)}
      {...props}
    />
  );
}
SheetHeader.displayName = "SheetHeader";

// ---- SHEET TITLE ------------------------------------------------------------

/**
 * Accessible sheet title. Its id is wired to the popup automatically.
 *
 * @since 0.1.0
 */
export type SheetTitleProps = React.ComponentProps<typeof Dialog.Title>;
function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={composeStateClassName<Dialog.Title.State>(
        cn("text-lg leading-none font-semibold tracking-tight text-foreground"),
        className
      )}
      {...props}
    />
  );
}
SheetTitle.displayName = "SheetTitle";

// ---- SHEET DESCRIPTION ------------------------------------------------------

/**
 * Accessible sheet description. Its id is wired to the popup automatically.
 *
 * @since 0.1.0
 */
export type SheetDescriptionProps = React.ComponentProps<
  typeof Dialog.Description
>;
function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <Dialog.Description
      data-slot="sheet-description"
      className={composeStateClassName<Dialog.Description.State>(
        cn("text-sm leading-relaxed text-muted-foreground"),
        className
      )}
      {...props}
    />
  );
}
SheetDescription.displayName = "SheetDescription";

// ---- SHEET BODY -------------------------------------------------------------

/**
 * Scrollable main content region.
 *
 * @since 0.1.0
 */
export type SheetBodyProps = React.ComponentProps<"div">;
function SheetBody({ className, ...props }: SheetBodyProps) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4",
        className
      )}
      {...props}
    />
  );
}
SheetBody.displayName = "SheetBody";

// ---- SHEET FOOTER -----------------------------------------------------------

/**
 * Bottom action row. On narrow viewports, actions stack with the primary
 * action nearest the sheet content.
 *
 * @since 0.1.0
 */
export type SheetFooterProps = React.ComponentProps<"div">;
function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}
SheetFooter.displayName = "SheetFooter";

// ---- SHEET HANDLE -----------------------------------------------------------

/**
 * Handle class for detached triggers and imperative sheet control.
 *
 * @since 0.3.0
 */
const SheetHandle = Dialog.Handle;

/**
 * Creates a typed handle for detached triggers.
 *
 * @since 0.3.0
 */
const createSheetHandle = Dialog.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  SheetRoot,
  SheetTrigger,
  SheetPortal,
  SheetBackdrop,
  SheetViewport,
  SheetPopup,
  SheetClose,
  SheetCloseIconButton,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetHandle,
  createSheetHandle,
  sheetVariants,
};
