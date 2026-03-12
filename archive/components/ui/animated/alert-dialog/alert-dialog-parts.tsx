"use client";

import * as React from "react";
import { type ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { useAlertDialog, dialogSprings } from "./alert-dialog-context";

// =============================================================================
// ALERT DIALOG HEADER
// =============================================================================

/**
 * AlertDialogHeader props
 */
export interface AlertDialogHeaderProps {
  /** Child content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Optional icon to display */
  icon?: ReactNode;
  /** Icon wrapper class */
  iconClassName?: string;
}

/**
 * AlertDialogHeader - Header section with optional icon
 */
export function AlertDialogHeader({
  children,
  className,
  icon,
  iconClassName,
}: AlertDialogHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-4 sm:gap-5",
        className
      )}
      data-slot="alert-dialog-header"
    >
      {icon && (
        <div
          className={cn(
            "size-14 sm:size-16 rounded-full flex items-center justify-center",
            "bg-primary/10 dark:bg-primary/20",
            iconClassName
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

/**
 * AlertDialogBody props
 */
export interface AlertDialogBodyProps {
  /** Child content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AlertDialogBody - Main content area with fade animation
 */
export function AlertDialogBody({ children, className }: AlertDialogBodyProps) {
  const { disableAnimation } = useAlertDialog();

  const bodyClasses = cn(
    "flex flex-col items-center text-center gap-5 sm:gap-6",
    className
  );

  if (!disableAnimation) {
    return (
      <motion.div
        className={bodyClasses}
        data-slot="alert-dialog-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={dialogSprings.content}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={bodyClasses} data-slot="alert-dialog-body">
      {children}
    </div>
  );
}

AlertDialogBody.displayName = "AlertDialogBody";

// =============================================================================
// ALERT DIALOG FOOTER
// =============================================================================

/**
 * AlertDialogFooter props
 */
export interface AlertDialogFooterProps {
  /** Child content (action buttons) */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AlertDialogFooter - Footer section for action buttons
 */
export function AlertDialogFooter({
  children,
  className,
}: AlertDialogFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-full gap-2 sm:gap-3 pt-4 sm:pt-5",
        className
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

/**
 * AlertDialogTitle props
 */
export interface AlertDialogTitleProps {
  /** Title text */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * AlertDialogTitle - Dialog title for aria-labelledby
 */
export function AlertDialogTitle({
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
        className
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

/**
 * AlertDialogSubtitle props
 */
export interface AlertDialogSubtitleProps {
  /** Subtitle text */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * AlertDialogSubtitle - Optional subtitle below the title
 */
export function AlertDialogSubtitle({
  children,
  className,
  style,
}: AlertDialogSubtitleProps) {
  const { disableAnimation } = useAlertDialog();

  if (disableAnimation) {
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

  return (
    <motion.div
      className={cn("text-sm text-muted-foreground font-medium", className)}
      style={style}
      data-slot="alert-dialog-subtitle"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...dialogSprings.content,
        delay: dialogSprings.contentFadeDelay + 0.02,
      }}
    >
      {children}
    </motion.div>
  );
}

AlertDialogSubtitle.displayName = "AlertDialogSubtitle";

// =============================================================================
// ALERT DIALOG DESCRIPTION
// =============================================================================

/**
 * AlertDialogDescription props
 */
export interface AlertDialogDescriptionProps {
  /** Description text */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * AlertDialogDescription - Dialog description for aria-describedby
 */
export function AlertDialogDescription({
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
        className
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
// ALERT DIALOG IMAGE
// =============================================================================

/**
 * AlertDialogImage props
 */
export interface AlertDialogImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * AlertDialogImage - Image with fade animation
 */
export function AlertDialogImage({
  src,
  alt,
  className,
  style,
}: AlertDialogImageProps) {
  const { disableAnimation } = useAlertDialog();

  if (!disableAnimation) {
    return (
      <motion.img
        src={src}
        alt={alt}
        className={cn(className)}
        style={style}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
        data-slot="alert-dialog-image"
      />
    );
  }

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
