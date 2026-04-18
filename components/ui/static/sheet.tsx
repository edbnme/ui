/**
 * Sheet — CSS-only slide-out panel built on `@base-ui/react` Dialog.
 *
 * A side drawer that slides in from any of the four edges. Uses Base UI's
 * `data-starting-style` / `data-ending-style` hooks to animate open/close
 * via CSS transforms — no `motion` dependency. All animations honor
 * `prefers-reduced-motion`.
 *
 * Anatomy:
 * ```tsx
 * <SheetRoot>
 *   <SheetTrigger>Open</SheetTrigger>
 *   <SheetPortal>
 *     <SheetBackdrop />
 *     <SheetViewport>
 *       <SheetPopup side="right">
 *         <SheetHeader>
 *           <SheetTitle>Title</SheetTitle>
 *           <SheetDescription>Description</SheetDescription>
 *         </SheetHeader>
 *         <SheetBody>…content…</SheetBody>
 *         <SheetFooter>
 *           <SheetClose>Close</SheetClose>
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
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/sheet
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/dialog
 * @registryDescription Static slide-out panel built on Base UI Dialog with directional CSS transitions.
 */

"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

/**
 * The sheet's controlled root. Direct re-export from Base UI.
 *
 * @since 0.1.0
 */
const SheetRoot = Dialog.Root;

// ---- TRIGGER ----------------------------------------------------------------

export type SheetTriggerProps = React.ComponentPropsWithoutRef<
  typeof Dialog.Trigger
>;

/**
 * Element that opens the sheet when activated.
 *
 * @since 0.1.0
 */
function SheetTrigger({ className, ...props }: SheetTriggerProps) {
  return (
    <Dialog.Trigger
      data-slot="sheet-trigger"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground select-none",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-muted active:bg-muted/80",
        "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring",
        className
      )}
      {...props}
    />
  );
}
SheetTrigger.displayName = "SheetTrigger";

// ---- PORTAL -----------------------------------------------------------------

/**
 * Portals the sheet's children to the document body. Direct re-export.
 *
 * @since 0.1.0
 */
const SheetPortal = Dialog.Portal;

// ---- BACKDROP ---------------------------------------------------------------

export type SheetBackdropProps = React.ComponentPropsWithoutRef<
  typeof Dialog.Backdrop
>;

/**
 * Dim layer behind the sheet.
 *
 * @since 0.1.0
 */
function SheetBackdrop({ className, ...props }: SheetBackdropProps) {
  return (
    <Dialog.Backdrop
      data-slot="sheet-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        "transition-opacity duration-300 motion-reduce:transition-none",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    />
  );
}
SheetBackdrop.displayName = "SheetBackdrop";

// ---- VIEWPORT ---------------------------------------------------------------

export type SheetViewportProps = React.ComponentPropsWithoutRef<
  typeof Dialog.Viewport
>;

/**
 * Full-viewport wrapper that contains the popup. Typically invisible.
 *
 * @since 0.1.0
 */
function SheetViewport({ className, ...props }: SheetViewportProps) {
  return (
    <Dialog.Viewport
      data-slot="sheet-viewport"
      className={cn("fixed inset-0 z-50", className)}
      {...props}
    />
  );
}
SheetViewport.displayName = "SheetViewport";

// ---- POPUP VARIANTS ---------------------------------------------------------

const sheetVariants = cva(
  [
    "fixed z-50 bg-background shadow-lg border border-border",
    "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
    "motion-reduce:transition-none",
    "flex flex-col overflow-y-auto",
  ],
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 max-h-[80vh] rounded-b-2xl",
          "data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
        ],
        right: [
          "inset-y-0 right-0 w-full max-w-sm sm:max-w-md",
          "data-starting-style:translate-x-full data-ending-style:translate-x-full",
        ],
        bottom: [
          "inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl",
          "data-starting-style:translate-y-full data-ending-style:translate-y-full",
        ],
        left: [
          "inset-y-0 left-0 w-full max-w-sm sm:max-w-md",
          "data-starting-style:-translate-x-full data-ending-style:-translate-x-full",
        ],
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

// ---- POPUP ------------------------------------------------------------------

export interface SheetPopupProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Popup>,
    VariantProps<typeof sheetVariants> {}

/**
 * The sheet surface itself. Choose edge via `side="top" | "right" |
 * "bottom" | "left"` (default `right`).
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
      className={cn(sheetVariants({ side }), className)}
      {...props}
    />
  );
}
SheetPopup.displayName = "SheetPopup";

// ---- CLOSE ------------------------------------------------------------------

export type SheetCloseProps = React.ComponentPropsWithoutRef<
  typeof Dialog.Close
>;

/**
 * Button that closes the sheet. Defaults to an X-icon button in the top
 * right; pass children to override.
 *
 * @since 0.1.0
 */
function SheetClose({ className, children, ...props }: SheetCloseProps) {
  return (
    <Dialog.Close
      data-slot="sheet-close"
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
        "transition-opacity duration-150 ease-out motion-reduce:transition-none",
        "hover:opacity-100",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <X className="h-4 w-4" aria-hidden />
          <span className="sr-only">Close</span>
        </>
      )}
    </Dialog.Close>
  );
}
SheetClose.displayName = "SheetClose";

// ---- HEADER -----------------------------------------------------------------

export type SheetHeaderProps = React.ComponentPropsWithoutRef<"div">;

/**
 * Top region of the sheet — houses title & description.
 *
 * @since 0.1.0
 */
function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col space-y-2 p-6 pb-0", className)}
      {...props}
    />
  );
}
SheetHeader.displayName = "SheetHeader";

// ---- TITLE ------------------------------------------------------------------

export type SheetTitleProps = React.ComponentPropsWithoutRef<
  typeof Dialog.Title
>;

/**
 * Accessible sheet title — linked via `aria-labelledby`.
 *
 * @since 0.1.0
 */
function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}
SheetTitle.displayName = "SheetTitle";

// ---- DESCRIPTION ------------------------------------------------------------

export type SheetDescriptionProps = React.ComponentPropsWithoutRef<
  typeof Dialog.Description
>;

/**
 * Accessible sheet description — linked via `aria-describedby`.
 *
 * @since 0.1.0
 */
function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <Dialog.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
SheetDescription.displayName = "SheetDescription";

// ---- BODY -------------------------------------------------------------------

export type SheetBodyProps = React.ComponentPropsWithoutRef<"div">;

/**
 * Scrollable main content area.
 *
 * @since 0.1.0
 */
function SheetBody({ className, ...props }: SheetBodyProps) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("flex-1 overflow-y-auto p-6", className)}
      {...props}
    />
  );
}
SheetBody.displayName = "SheetBody";

// ---- FOOTER -----------------------------------------------------------------

export type SheetFooterProps = React.ComponentPropsWithoutRef<"div">;

/**
 * Bottom region — typically holds action buttons.
 *
 * @since 0.1.0
 */
function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "flex flex-col-reverse gap-2 p-6 pt-0 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}
SheetFooter.displayName = "SheetFooter";

// ---- EXPORTS ----------------------------------------------------------------

export {
  SheetRoot,
  SheetTrigger,
  SheetPortal,
  SheetBackdrop,
  SheetViewport,
  SheetPopup,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  sheetVariants,
};
