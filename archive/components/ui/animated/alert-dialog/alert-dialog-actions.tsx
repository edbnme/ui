"use client";

import * as React from "react";
import { useCallback, type ReactNode } from "react";
import { XIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

import { useAlertDialog } from "./alert-dialog-context";

// ---- ALERT DIALOG ACTION BUTTON ---------------------------------------------

/**
 * AlertDialogAction props
 */
export interface AlertDialogActionProps {
  /** Button label */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Button variant - use "destructive" for dangerous actions */
  variant?: "default" | "destructive";
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Disable the button */
  disabled?: boolean;
}

/**
 * AlertDialogAction - Primary action button that closes the dialog
 *
 * @example
 * ```tsx
 * <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
 * <AlertDialogAction>Confirm</AlertDialogAction>
 * ```
 */
export function AlertDialogAction({
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
    [onClick, setIsOpen]
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
        className
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

// ---- ALERT DIALOG CANCEL BUTTON ---------------------------------------------

/**
 * AlertDialogCancel props
 */
export interface AlertDialogCancelProps {
  /** Button label (defaults to "Cancel") */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Disable the button */
  disabled?: boolean;
}

/**
 * AlertDialogCancel - Secondary button that closes the dialog
 */
export function AlertDialogCancel({
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
    [onClick, setIsOpen]
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
        className
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

// ---- ALERT DIALOG CLOSE BUTTON (X ICON) -------------------------------------

/**
 * AlertDialogClose props
 */
export interface AlertDialogCloseProps {
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * AlertDialogClose - Close button with X icon (optional)
 */
export function AlertDialogClose({
  className,
  onClick,
}: AlertDialogCloseProps) {
  const { setIsOpen } = useAlertDialog();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        setIsOpen(false);
      }
    },
    [onClick, setIsOpen]
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
        className
      )}
      onClick={handleClick}
      aria-label="Close dialog"
      data-slot="alert-dialog-close"
    >
      <XIcon className="size-4" aria-hidden="true" />
    </button>
  );
}

AlertDialogClose.displayName = "AlertDialogClose";
