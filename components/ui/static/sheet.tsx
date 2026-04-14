/**
 * Sheet — CSS-only slide-out panel built on @base-ui/react Dialog.
 * Supports directional slide from top, right, bottom, left.
 *
 * @example
 * <SheetRoot>
 *   <SheetTrigger>Open</SheetTrigger>
 *   <SheetPortal>
 *     <SheetBackdrop />
 *     <SheetViewport>
 *       <SheetPopup side="right">
 *         <SheetHeader>
 *           <SheetTitle>Sheet Title</SheetTitle>
 *           <SheetDescription>Description</SheetDescription>
 *         </SheetHeader>
 *         <SheetBody>Content here</SheetBody>
 *         <SheetFooter>
 *           <SheetClose>Close</SheetClose>
 *         </SheetFooter>
 *       </SheetPopup>
 *     </SheetViewport>
 *   </SheetPortal>
 * </SheetRoot>
 *
 * @see https://base-ui.com/react/components/dialog
 */
"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- SHEET ROOT -------------------------------------------------------------

const SheetRoot = Dialog.Root;

// ---- SHEET TRIGGER ----------------------------------------------------------

const SheetTrigger = React.forwardRef<
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
SheetTrigger.displayName = "SheetTrigger";

// ---- SHEET PORTAL -----------------------------------------------------------

const SheetPortal = Dialog.Portal;

// ---- SHEET BACKDROP ---------------------------------------------------------

const SheetBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Backdrop>
>(({ className, ...props }, ref) => (
  <Dialog.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "transition-opacity duration-300",
      "data-starting-style:opacity-0 data-ending-style:opacity-0",
      className
    )}
    {...props}
  />
));
SheetBackdrop.displayName = "SheetBackdrop";

// ---- SHEET VIEWPORT ---------------------------------------------------------

const SheetViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Viewport>
>(({ className, ...props }, ref) => (
  <Dialog.Viewport
    ref={ref}
    className={cn("fixed inset-0 z-50", className)}
    {...props}
  />
));
SheetViewport.displayName = "SheetViewport";

// ---- SHEET POPUP VARIANTS ---------------------------------------------------

const sheetVariants = cva(
  [
    "fixed z-50 bg-background shadow-lg border border-border",
    "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
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

// ---- SHEET POPUP ------------------------------------------------------------

interface SheetPopupProps
  extends
    React.ComponentPropsWithoutRef<typeof Dialog.Popup>,
    VariantProps<typeof sheetVariants> {}

const SheetPopup = React.forwardRef<HTMLDivElement, SheetPopupProps>(
  ({ className, side = "right", ...props }, ref) => (
    <Dialog.Popup
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    />
  )
);
SheetPopup.displayName = "SheetPopup";

// ---- SHEET CLOSE ------------------------------------------------------------

const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Close>
>(({ className, children, ...props }, ref) => (
  <Dialog.Close
    ref={ref}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </>
    )}
  </Dialog.Close>
));
SheetClose.displayName = "SheetClose";

// ---- SHEET HEADER -----------------------------------------------------------

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 p-6 pb-0", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

// ---- SHEET TITLE ------------------------------------------------------------

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

// ---- SHEET DESCRIPTION ------------------------------------------------------

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// ---- SHEET BODY -------------------------------------------------------------

const SheetBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto p-6", className)} {...props} />
);
SheetBody.displayName = "SheetBody";

// ---- SHEET FOOTER -----------------------------------------------------------

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 p-6 pt-0 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);
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
