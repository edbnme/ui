/**
 * Sheet Component
 *
 * A slide-out panel component that appears from any edge of the screen.
 * Features drag-to-dismiss, smooth animations, and proper focus management.
 *
 * Built on Base UI Dialog primitive.
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { DragHandle, CloseButton } from "@/lib/icons";
import { useShouldDisableAnimation } from "@/components/motion-provider";

// =============================================================================
// SHEET VARIANTS (CVA)
// side panels
// =============================================================================

const sheetVariants = cva(
  [
    "fixed z-[101] flex flex-col",
    "bg-background/98 backdrop-blur-2xl backdrop-saturate-150",
    "shadow-2xl shadow-black/30",
    // Dark mode
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
// SHEET CONTEXT
// =============================================================================

type SheetContextValue = {
  disableAnimation: boolean;
  side: "top" | "right" | "bottom" | "left";
  enableDrag: boolean;
};

const SheetContext = React.createContext<SheetContextValue>({
  disableAnimation: false,
  side: "right",
  enableDrag: true,
});

// =============================================================================
// SHEET ROOT
// =============================================================================

export type SheetProps = {
  /** Disable animations for this sheet */
  disableAnimation?: boolean;
  /** Enable swipe-to-dismiss gesture (default: true) */
  enableDrag?: boolean;
  /** Whether the sheet is open (controlled) */
  open?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Whether to close on outside click (default: true) */
  dismissible?: boolean;
  /** Whether the sheet is modal (default: true) */
  modal?: boolean;
  children?: React.ReactNode;
};

/**
 * Sheet Root Component
 *
 * Wraps Base UI Dialog.Root. The scrollbar compensation is handled automatically
 * by Base UI's internal scroll lock.
 */
function Sheet({
  disableAnimation,
  enableDrag = true,
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen,
  ...props
}: SheetProps) {
  const shouldDisable = useShouldDisableAnimation(disableAnimation);

  // Handle defaultOpen by using internal state when uncontrolled
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider
      value={{
        disableAnimation: shouldDisable,
        side: "right",
        enableDrag,
      }}
    >
      <Dialog.Root
        data-slot="sheet"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </Dialog.Root>
    </SheetContext.Provider>
  );
}

// =============================================================================
// SHEET TRIGGER
// =============================================================================

export type SheetTriggerProps = {
  /** Render as child element (for custom trigger components) */
  asChild?: boolean;
} & React.ComponentProps<typeof Dialog.Trigger>;

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ asChild, children, className, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return (
        <Dialog.Trigger
          ref={ref}
          data-slot="sheet-trigger"
          className={className}
          render={children}
          {...props}
        />
      );
    }

    return (
      <Dialog.Trigger
        ref={ref}
        data-slot="sheet-trigger"
        className={className}
        {...props}
      >
        {children}
      </Dialog.Trigger>
    );
  }
);

SheetTrigger.displayName = "SheetTrigger";

// =============================================================================
// SHEET CLOSE
// =============================================================================

export type SheetCloseProps = {
  /** Render as child element (for custom close components) */
  asChild?: boolean;
} & React.ComponentProps<typeof Dialog.Close>;

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ asChild, children, className, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return (
        <Dialog.Close
          ref={ref}
          data-slot="sheet-close"
          className={className}
          render={children}
          {...props}
        />
      );
    }

    return (
      <Dialog.Close
        ref={ref}
        data-slot="sheet-close"
        className={className}
        {...props}
      >
        {children}
      </Dialog.Close>
    );
  }
);

SheetClose.displayName = "SheetClose";

// =============================================================================
// SHEET PORTAL
// =============================================================================

function SheetPortal({
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Portal>) {
  return (
    <Dialog.Portal data-slot="sheet-portal" {...props}>
      {children}
    </Dialog.Portal>
  );
}

// =============================================================================
// SHEET OVERLAY
// backdrop with blur
// =============================================================================

const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Dialog.Backdrop>
>(({ className, ...props }, ref) => {
  const { disableAnimation } = React.useContext(SheetContext);

  return (
    <Dialog.Backdrop
      ref={ref}
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-100",
        "bg-black/50 backdrop-blur-xl backdrop-saturate-150",
        // Use CSS transitions for Base UI animations
        "transition-opacity",
        disableAnimation ? "duration-0" : "duration-300",
        // Entry animation
        "data-starting-style:opacity-0",
        // Exit animation
        "data-ending-style:opacity-0",
        // Default visible state
        "opacity-100",
        className
      )}
      {...props}
    />
  );
});

SheetOverlay.displayName = "SheetOverlay";

// =============================================================================
// SHEET CONTENT
// Main sheet panel with drag-to-dismiss
// =============================================================================

export type SheetContentProps = {
  /** Show the Modern drag handle indicator */
  showDragHandle?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
} & VariantProps<typeof sheetVariants> &
  React.ComponentProps<typeof Dialog.Popup>;

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
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
    // Ensure side is never null/undefined
    const side = sideProp ?? "right";
    const { disableAnimation } = React.useContext(SheetContext);

    // Build animation classes based on side
    const getAnimationClasses = () => {
      if (disableAnimation) return "";

      const baseTransition = "transition-all duration-300 ease-out";
      const slideClasses = {
        right: [
          baseTransition,
          "data-starting-style:translate-x-full",
          "data-ending-style:translate-x-full",
          "translate-x-0",
        ],
        left: [
          baseTransition,
          "data-starting-style:-translate-x-full",
          "data-ending-style:-translate-x-full",
          "translate-x-0",
        ],
        top: [
          baseTransition,
          "data-starting-style:-translate-y-full",
          "data-ending-style:-translate-y-full",
          "translate-y-0",
        ],
        bottom: [
          baseTransition,
          "data-starting-style:translate-y-full",
          "data-ending-style:translate-y-full",
          "translate-y-0",
        ],
      };
      return slideClasses[side].join(" ");
    };

    return (
      <SheetPortal>
        <SheetOverlay />
        <Dialog.Popup
          ref={ref}
          data-slot="sheet-content"
          className={cn(
            sheetVariants({ side }),
            getAnimationClasses(),
            className
          )}
          {...props}
        >
          {/* Drag Handle for bottom/top sheets */}
          {(side === "bottom" || side === "top") && showDragHandle && (
            <DragHandle
              className={cn(side === "bottom" ? "mt-3 mb-1" : "mb-3 mt-1")}
            />
          )}

          {/* Close Button */}
          {showCloseButton && (
            <Dialog.Close
              className="absolute top-4 right-4 z-10"
              render={<CloseButton aria-label="Close sheet" />}
            />
          )}

          {children}
        </Dialog.Popup>
      </SheetPortal>
    );
  }
);

SheetContent.displayName = "SheetContent";

// =============================================================================
// SHEET HEADER
// header with border separator
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
// footer with action buttons
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
// title
// =============================================================================

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
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

SheetTitle.displayName = "SheetTitle";

// =============================================================================
// SHEET DESCRIPTION
// description
// =============================================================================

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn(
      "text-[13px] text-muted-foreground leading-relaxed",
      className
    )}
    {...props}
  />
));

SheetDescription.displayName = "SheetDescription";

// =============================================================================
// SHEET BODY
// Scrollable content area with padding
// =============================================================================

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "flex-1 overflow-y-auto px-5 py-4",
        // Modern overscroll behavior
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
