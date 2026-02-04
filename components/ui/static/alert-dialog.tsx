/**
 * Alert Dialog Component (Static Version)
 *
 * A modal dialog for important interactions that require acknowledgement.
 * Pure CSS transitions, no motion/react dependency (~30KB savings).
 *
 * Based on WAI-ARIA Alert Dialog pattern.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 *
 * @packageDocumentation
 */

"use client";

// =============================================================================
// IMPORTS
// =============================================================================

import * as React from "react";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useStableId } from "@/hooks/use-stable-id";
import { useControllableBoolean } from "@/hooks/use-controllable-state";

// =============================================================================
// TYPES
// =============================================================================

interface AlertDialogContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  onOpenChange?: (open: boolean) => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialog(): AlertDialogContextValue {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      "useAlertDialog must be used within <AlertDialog>. " +
        "Wrap your component tree with <AlertDialog>",
    );
  }
  return context;
}

// =============================================================================
// UTILITY HOOKS
// =============================================================================

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}

/**
 * Hook to delay unmounting for exit animations
 * Returns { shouldRender, state } where:
 * - shouldRender: whether the component should be in the DOM
 * - state: 'open' | 'closed' for data-state attribute
 */
function useDelayedUnmount(
  isOpen: boolean,
  duration: number = 200,
): {
  shouldRender: boolean;
  state: "open" | "closed";
} {
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  const [state, setState] = React.useState<"open" | "closed">(
    isOpen ? "open" : "closed",
  );

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready before animation
      requestAnimationFrame(() => {
        setState("open");
      });
    } else {
      setState("closed");
      // Wait for exit animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  return { shouldRender, state };
}

// =============================================================================
// ALERT DIALOG ROOT
// =============================================================================

export interface AlertDialogRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function AlertDialogRoot({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: AlertDialogRootProps) {
  const [isOpen, setIsOpen] = useControllableBoolean({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const uniqueId = useStableId("alert-dialog");
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const contextValue = useMemo<AlertDialogContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      uniqueId,
      triggerRef,
      contentRef,
      onOpenChange,
    }),
    [isOpen, setIsOpen, uniqueId, onOpenChange],
  );

  return (
    <AlertDialogContext.Provider value={contextValue}>
      {children}
    </AlertDialogContext.Provider>
  );
}

AlertDialogRoot.displayName = "AlertDialogRoot";

// =============================================================================
// ALERT DIALOG TRIGGER
// =============================================================================

export interface AlertDialogTriggerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  asChild?: boolean;
}

function AlertDialogTrigger({
  children,
  className,
  style,
  asChild = false,
}: AlertDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useAlertDialog();

  const handleClick = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(true);
      }
    },
    [setIsOpen],
  );

  const commonProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    "aria-haspopup": "dialog" as const,
    "aria-expanded": isOpen,
    "aria-controls": `${uniqueId}-content`,
    "data-slot": "alert-dialog-trigger",
    "data-state": isOpen ? "open" : "closed",
  };

  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<
      Record<string, unknown>
    >;
    return (
      <div
        ref={triggerRef as React.RefObject<HTMLDivElement>}
        className="contents"
      >
        {React.cloneElement(childElement, commonProps)}
      </div>
    );
  }

  return (
    <div
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      className={cn("relative inline-flex cursor-pointer", className)}
      style={style}
      role="button"
      tabIndex={0}
      {...commonProps}
    >
      {children}
    </div>
  );
}

AlertDialogTrigger.displayName = "AlertDialogTrigger";

// =============================================================================
// ALERT DIALOG CONTAINER (PORTAL)
// =============================================================================

export interface AlertDialogContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function AlertDialogContainer({ children }: AlertDialogContainerProps) {
  const { isOpen, uniqueId } = useAlertDialog();
  const mounted = useIsMounted();

  if (!mounted || !isOpen) return null;

  return createPortal(
    <>
      <div
        key={`backdrop-${uniqueId}`}
        className={cn(
          "fixed inset-0 z-100 bg-black/50 backdrop-blur-lg",
          "transition-opacity duration-200",
        )}
        data-slot="alert-dialog-backdrop"
      />
      <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none">
        {children}
      </div>
    </>,
    document.body,
  );
}

AlertDialogContainer.displayName = "AlertDialogContainer";

// =============================================================================
// ALERT DIALOG CONTENT
// =============================================================================

export interface AlertDialogContentProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showCloseButton?: boolean;
  onCloseButtonClick?: () => void;
  preventEscapeClose?: boolean;
  preventOutsideClose?: boolean;
  standalone?: boolean;
}

function AlertDialogContent({
  children,
  className,
  style,
  showCloseButton = false,
  onCloseButtonClick,
  preventEscapeClose = false,
  preventOutsideClose = true,
  standalone = false,
}: AlertDialogContentProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef, contentRef } =
    useAlertDialog();
  const mounted = useIsMounted();
  const { shouldRender, state } = useDelayedUnmount(isOpen, 200);

  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !preventEscapeClose) {
        setIsOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const first = firstFocusableRef.current;
        const last = lastFocusableRef.current;

        if (!first || !last) return;

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen, preventEscapeClose]);

  // Body scroll lock and initial focus
  useEffect(() => {
    if (!isOpen) return;

    const triggerElement = triggerRef.current;
    const contentElement = contentRef.current;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements =
      contentElement?.querySelectorAll(focusableSelector);

    if (focusableElements && focusableElements.length > 0) {
      firstFocusableRef.current = focusableElements[0] as HTMLElement;
      lastFocusableRef.current = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      requestAnimationFrame(() => {
        (focusableElements[0] as HTMLElement).focus();
      });
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      triggerElement?.focus();
    };
  }, [isOpen, triggerRef, contentRef]);

  // Handle outside click
  useEffect(() => {
    if (!isOpen || preventOutsideClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen, preventOutsideClose, contentRef]);

  const contentClasses = cn(
    "relative z-10 pointer-events-auto",
    "overflow-hidden",
    "rounded-2xl sm:rounded-3xl",
    "border border-border",
    "bg-background",
    "shadow-2xl shadow-black/50 dark:shadow-black/80",
    "outline-none focus:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "w-full max-w-[calc(100vw-2rem)] sm:max-w-md",
    // CSS animations with tw-animate-css
    "duration-200",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
    "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
    className,
  );

  const ContentPanel = (
    <div
      ref={contentRef}
      className={contentClasses}
      style={style}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={`${uniqueId}-title`}
      aria-describedby={`${uniqueId}-description`}
      id={`${uniqueId}-content`}
      data-slot="alert-dialog-content"
      data-state={state}
    >
      {showCloseButton && <AlertDialogClose onClick={onCloseButtonClick} />}
      {children}
    </div>
  );

  if (standalone) {
    return ContentPanel;
  }

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <>
      <div
        key={`backdrop-${uniqueId}`}
        className={cn(
          "fixed inset-0 z-100 bg-black/50 backdrop-blur-lg",
          "duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        )}
        data-slot="alert-dialog-overlay"
        data-state={state}
      />
      <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none">
        {ContentPanel}
      </div>
    </>,
    document.body,
  );
}

AlertDialogContent.displayName = "AlertDialogContent";

// =============================================================================
// ALERT DIALOG HEADER
// =============================================================================

export interface AlertDialogHeaderProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconClassName?: string;
}

function AlertDialogHeader({
  children,
  className,
  icon,
  iconClassName,
}: AlertDialogHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-4 sm:gap-5",
        "p-6 pb-4 sm:p-8 sm:pb-5",
        className,
      )}
      data-slot="alert-dialog-header"
    >
      {icon && (
        <div
          className={cn(
            "size-14 sm:size-16 rounded-full flex items-center justify-center",
            "bg-primary/10 dark:bg-primary/20",
            iconClassName,
          )}
        >
          {icon}
        </div>
      )}
      <div className="space-y-2 sm:space-y-3">{children}</div>
    </div>
  );
}

AlertDialogHeader.displayName = "AlertDialogHeader";

// =============================================================================
// ALERT DIALOG BODY
// =============================================================================

export interface AlertDialogBodyProps {
  children: ReactNode;
  className?: string;
}

function AlertDialogBody({ children, className }: AlertDialogBodyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-5 sm:gap-6 p-6 sm:p-8",
        className,
      )}
      data-slot="alert-dialog-body"
    >
      {children}
    </div>
  );
}

AlertDialogBody.displayName = "AlertDialogBody";

// =============================================================================
// ALERT DIALOG FOOTER
// =============================================================================

export interface AlertDialogFooterProps {
  children: ReactNode;
  className?: string;
}

function AlertDialogFooter({ children, className }: AlertDialogFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-full gap-2 sm:gap-3",
        "px-6 pb-6 pt-2 sm:px-8 sm:pb-8 sm:pt-3",
        className,
      )}
      data-slot="alert-dialog-footer"
    >
      {children}
    </div>
  );
}

AlertDialogFooter.displayName = "AlertDialogFooter";

// =============================================================================
// ALERT DIALOG TITLE
// =============================================================================

export interface AlertDialogTitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function AlertDialogTitle({
  children,
  className,
  style,
}: AlertDialogTitleProps) {
  const { uniqueId } = useAlertDialog();

  return (
    <div
      className={cn(
        "text-lg sm:text-xl font-semibold tracking-tight leading-tight",
        "text-foreground",
        className,
      )}
      style={style}
      id={`${uniqueId}-title`}
      data-slot="alert-dialog-title"
    >
      {children}
    </div>
  );
}

AlertDialogTitle.displayName = "AlertDialogTitle";

// =============================================================================
// ALERT DIALOG SUBTITLE
// =============================================================================

export interface AlertDialogSubtitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function AlertDialogSubtitle({
  children,
  className,
  style,
}: AlertDialogSubtitleProps) {
  return (
    <div
      className={cn("text-sm text-muted-foreground font-medium", className)}
      style={style}
      data-slot="alert-dialog-subtitle"
    >
      {children}
    </div>
  );
}

AlertDialogSubtitle.displayName = "AlertDialogSubtitle";

// =============================================================================
// ALERT DIALOG DESCRIPTION
// =============================================================================

export interface AlertDialogDescriptionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function AlertDialogDescription({
  children,
  className,
  style,
}: AlertDialogDescriptionProps) {
  const { uniqueId } = useAlertDialog();

  return (
    <div
      className={cn(
        "text-sm sm:text-[13px] text-muted-foreground leading-relaxed",
        "max-w-full sm:max-w-70 mx-auto",
        className,
      )}
      style={style}
      id={`${uniqueId}-description`}
      data-slot="alert-dialog-description"
    >
      {children}
    </div>
  );
}

AlertDialogDescription.displayName = "AlertDialogDescription";

// =============================================================================
// ALERT DIALOG ACTION BUTTON
// =============================================================================

export interface AlertDialogActionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "default" | "destructive";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

function AlertDialogAction({
  children,
  className,
  style,
  variant = "default",
  onClick,
  disabled = false,
}: AlertDialogActionProps) {
  const { setIsOpen } = useAlertDialog();

  const isDestructive = variant === "destructive";

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        setIsOpen(false);
      }
    },
    [onClick, setIsOpen],
  );

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-xl sm:rounded-2xl px-5 py-3 sm:py-3.5",
        "text-sm sm:text-base font-semibold",
        "shadow-sm",
        isDestructive
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80"
          : "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        "transition-[color,background-color,transform] duration-150",
        "active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "touch-manipulation select-none",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      style={style}
      onClick={handleClick}
      disabled={disabled}
      data-slot="alert-dialog-action"
    >
      {children}
    </button>
  );
}

AlertDialogAction.displayName = "AlertDialogAction";

// =============================================================================
// ALERT DIALOG CANCEL BUTTON
// =============================================================================

export interface AlertDialogCancelProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

function AlertDialogCancel({
  children = "Cancel",
  className,
  style,
  onClick,
  disabled = false,
}: AlertDialogCancelProps) {
  const { setIsOpen } = useAlertDialog();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        setIsOpen(false);
      }
    },
    [onClick, setIsOpen],
  );

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-xl sm:rounded-2xl px-5 py-3 sm:py-3.5",
        "text-sm sm:text-base font-medium",
        "bg-secondary text-secondary-foreground shadow-sm",
        "hover:bg-secondary/90 active:bg-secondary/80",
        "dark:bg-secondary/80 dark:hover:bg-secondary/70",
        "transition-[color,background-color,transform] duration-150",
        "active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "touch-manipulation select-none",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      style={style}
      onClick={handleClick}
      disabled={disabled}
      data-slot="alert-dialog-cancel"
    >
      {children}
    </button>
  );
}

AlertDialogCancel.displayName = "AlertDialogCancel";

// =============================================================================
// ALERT DIALOG CLOSE BUTTON (X ICON)
// =============================================================================

export interface AlertDialogCloseProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function AlertDialogClose({ className, onClick }: AlertDialogCloseProps) {
  const { setIsOpen } = useAlertDialog();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        setIsOpen(false);
      }
    },
    [onClick, setIsOpen],
  );

  return (
    <button
      type="button"
      className={cn(
        "absolute top-4 right-4",
        "p-1.5 rounded-full",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-muted/80",
        "transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      onClick={handleClick}
      aria-label="Close dialog"
      data-slot="alert-dialog-close"
    >
      <X className="size-4" aria-hidden="true" />
    </button>
  );
}

AlertDialogClose.displayName = "AlertDialogClose";

// =============================================================================
// ALERT DIALOG IMAGE
// =============================================================================

export interface AlertDialogImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

function AlertDialogImage({
  src,
  alt,
  className,
  style,
}: AlertDialogImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(className)}
      style={style}
      data-slot="alert-dialog-image"
    />
  );
}

AlertDialogImage.displayName = "AlertDialogImage";

// =============================================================================
// COMPONENT EXPORT
// =============================================================================

const AlertDialog = AlertDialogRoot;

// =============================================================================
// EXPORTS
// =============================================================================

export { AlertDialog };

export {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogContainer,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogSubtitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogImage,
};
