/**
 * Sheet Component (Static Version)
 *
 * A slide-out panel component that appears from any edge of the screen.
 * Uses CSS animations only, no motion/react dependency.
 *
 * Built on Radix UI Dialog primitive.
 *
 * Note: Radix UI's Dialog/Sheet uses react-remove-scroll-bar internally
 * which automatically handles scrollbar compensation to prevent layout shift.
 * No manual scrollbar width calculation is needed.
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// =============================================================================
// SHEET VARIANTS (CVA)
// =============================================================================

const sheetVariants = cva(
  [
    "fixed z-[101] flex flex-col",
    "bg-background/98 backdrop-blur-2xl backdrop-saturate-150",
    "shadow-2xl shadow-black/30",
    "dark:bg-background/95 dark:shadow-black/50",
  ].join(" "),
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-border/40 rounded-b-2xl max-h-[85vh]",
        right:
          "inset-y-0 right-0 h-full w-[85vw] border-l border-border/40 sm:max-w-md rounded-l-2xl",
        bottom:
          "inset-x-0 bottom-0 border-t border-border/40 rounded-t-2xl max-h-[85vh]",
        left: "inset-y-0 left-0 h-full w-[85vw] border-r border-border/40 sm:max-w-md rounded-r-2xl",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

// =============================================================================
// SHEET ROOT
// =============================================================================

export type SheetProps = React.ComponentProps<typeof SheetPrimitive.Root>;

/**
 * Sheet Root Component
 *
 * Wraps Radix Dialog.Root. The scrollbar compensation is handled automatically
 * by Radix's internal react-remove-scroll-bar package.
 */
function Sheet(props: SheetProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

// =============================================================================
// SHEET TRIGGER
// =============================================================================

const SheetTrigger = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Trigger>,
  React.ComponentProps<typeof SheetPrimitive.Trigger>
>(({ ...props }, ref) => (
  <SheetPrimitive.Trigger ref={ref} data-slot="sheet-trigger" {...props} />
));

SheetTrigger.displayName = SheetPrimitive.Trigger.displayName;

// =============================================================================
// SHEET CLOSE
// =============================================================================

const SheetClose = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Close>,
  React.ComponentProps<typeof SheetPrimitive.Close>
>(({ ...props }, ref) => (
  <SheetPrimitive.Close ref={ref} data-slot="sheet-close" {...props} />
));

SheetClose.displayName = SheetPrimitive.Close.displayName;

// =============================================================================
// SHEET PORTAL
// =============================================================================

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

// =============================================================================
// SHEET OVERLAY
// =============================================================================

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentProps<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    data-slot="sheet-overlay"
    className={cn(
      "fixed inset-0 z-100",
      "bg-black/50 backdrop-blur-xl backdrop-saturate-150",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "duration-200",
      className
    )}
    {...props}
  />
));

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// =============================================================================
// DRAG HANDLE (Static)
// =============================================================================

function DragHandle({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto h-1.5 w-10 shrink-0 rounded-full bg-border",
        className
      )}
    />
  );
}

// =============================================================================
// CLOSE BUTTON (Static)
// =============================================================================

const CloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "rounded-full p-2",
      "bg-muted/80 hover:bg-muted",
      "text-muted-foreground hover:text-foreground",
      "transition-colors duration-150",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    <X className="size-4" weight="bold" />
    <span className="sr-only">Close</span>
  </button>
));

CloseButton.displayName = "CloseButton";

// =============================================================================
// SHEET CONTENT
// =============================================================================

export type SheetContentProps = {
  showDragHandle?: boolean;
  showCloseButton?: boolean;
} & VariantProps<typeof sheetVariants> &
  React.ComponentProps<typeof SheetPrimitive.Content>;

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      className,
      children,
      side: sideProp = "right",
      showDragHandle = true,
      showCloseButton = true,
      ...props
    },
    ref
  ) => {
    const side = sideProp ?? "right";

    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
          ref={ref}
          data-slot="sheet-content"
          className={cn(
            sheetVariants({ side }),
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            side === "right" &&
              "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            side === "left" &&
              "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            side === "top" &&
              "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
            side === "bottom" &&
              "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            "duration-200 ease-out",
            className
          )}
          {...props}
        >
          {(side === "bottom" || side === "top") && showDragHandle && (
            <DragHandle
              className={cn(side === "bottom" ? "mt-3 mb-1" : "mb-3 mt-1")}
            />
          )}

          {showCloseButton && (
            <SheetPrimitive.Close asChild>
              <CloseButton
                className="absolute top-4 right-4 z-10"
                aria-label="Close sheet"
              />
            </SheetPrimitive.Close>
          )}

          {children}
        </SheetPrimitive.Content>
      </SheetPortal>
    );
  }
);

SheetContent.displayName = SheetPrimitive.Content.displayName;

// =============================================================================
// SHEET HEADER
// =============================================================================

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-1 px-5 pt-5 pb-4",
        "border-b border-border/40",
        className
      )}
      {...props}
    />
  );
}

// =============================================================================
// SHEET FOOTER
// =============================================================================

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 px-5 py-4",
        "border-t border-border/40",
        "bg-muted/30",
        className
      )}
      {...props}
    />
  );
}

// =============================================================================
// SHEET TITLE
// =============================================================================

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentProps<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn(
      "text-base font-semibold tracking-tight leading-none",
      "text-foreground",
      className
    )}
    {...props}
  />
));

SheetTitle.displayName = SheetPrimitive.Title.displayName;

// =============================================================================
// SHEET DESCRIPTION
// =============================================================================

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentProps<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn(
      "text-[13px] text-muted-foreground leading-relaxed",
      className
    )}
    {...props}
  />
));

SheetDescription.displayName = SheetPrimitive.Description.displayName;

// =============================================================================
// SHEET BODY
// =============================================================================

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "flex-1 overflow-y-auto px-5 py-4",
        "overscroll-contain",
        className
      )}
      {...props}
    />
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetBody,
  sheetVariants,
};
