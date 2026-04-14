"use client";

import * as React from "react";
import { useCallback, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePopover } from "./popover-context";

// ---- POPOVER HEADER ---------------------------------------------------------

/**
 * PopoverHeader props
 */
export interface PopoverHeaderProps {
  /** Header content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * PopoverHeader - Header section for title and description
 */
export function PopoverHeader({
  children,
  className,
  style,
}: PopoverHeaderProps) {
  const { disableAnimation } = usePopover("PopoverHeader");

  const headerClasses = cn(
    "flex flex-col items-start gap-2",
    "border-b border-border",
    "px-5 py-4",
    "bg-background",
    className
  );

  if (!disableAnimation) {
    return (
      <motion.div
        className={headerClasses}
        style={{
          ...style,
          isolation: "isolate",
          position: "relative",
          zIndex: 2,
        }}
        data-slot="popover-header"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={headerClasses}
      style={{
        ...style,
        isolation: "isolate",
        position: "relative",
        zIndex: 2,
      }}
      data-slot="popover-header"
    >
      {children}
    </div>
  );
}

PopoverHeader.displayName = "PopoverHeader";

// ---- POPOVER TITLE ----------------------------------------------------------

/**
 * PopoverTitle props
 */
export interface PopoverTitleProps {
  /** Title content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * PopoverTitle - Title with morphing animation from trigger label
 */
export function PopoverTitle({
  children,
  className,
  style,
}: PopoverTitleProps) {
  const { uniqueId, disableAnimation } = usePopover("PopoverTitle");

  const titleClasses = cn(
    "flex items-center gap-2",
    "text-sm font-semibold leading-none",
    "text-foreground",
    className
  );

  if (!disableAnimation) {
    return (
      <motion.h2
        id={`popover-title-${uniqueId}`}
        layoutId={`popover-label-${uniqueId}`}
        className={titleClasses}
        style={style}
        data-slot="popover-title"
      >
        {children}
      </motion.h2>
    );
  }

  return (
    <h2
      id={`popover-title-${uniqueId}`}
      className={titleClasses}
      style={style}
      data-slot="popover-title"
    >
      {children}
    </h2>
  );
}

PopoverTitle.displayName = "PopoverTitle";

// ---- POPOVER DESCRIPTION ----------------------------------------------------

/**
 * PopoverDescription props
 */
export interface PopoverDescriptionProps {
  /** Description content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * PopoverDescription - Description text with fade animation
 */
export function PopoverDescription({
  children,
  className,
  style,
}: PopoverDescriptionProps) {
  const { uniqueId, disableAnimation } = usePopover("PopoverDescription");

  const descriptionClasses = cn("text-sm text-muted-foreground", className);

  if (!disableAnimation) {
    return (
      <motion.p
        id={`popover-description-${uniqueId}`}
        className={descriptionClasses}
        style={style}
        variants={{
          initial: { opacity: 0, y: 5 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 5 },
        }}
        data-slot="popover-description"
      >
        {children}
      </motion.p>
    );
  }

  return (
    <p
      id={`popover-description-${uniqueId}`}
      className={descriptionClasses}
      style={style}
      data-slot="popover-description"
    >
      {children}
    </p>
  );
}

PopoverDescription.displayName = "PopoverDescription";

// ---- POPOVER BODY -----------------------------------------------------------

/**
 * PopoverBody props
 */
export interface PopoverBodyProps {
  /** Body content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * PopoverBody - Main content area with fade animation
 */
export function PopoverBody({ children, className, style }: PopoverBodyProps) {
  const { disableAnimation } = usePopover("PopoverBody");

  const bodyClasses = cn("p-5 bg-background", className);

  if (!disableAnimation) {
    return (
      <motion.div
        className={bodyClasses}
        style={{
          ...style,
          isolation: "isolate",
          position: "relative",
          zIndex: 1,
        }}
        variants={{
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 10 },
        }}
        data-slot="popover-body"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={bodyClasses}
      style={{
        ...style,
        isolation: "isolate",
        position: "relative",
        zIndex: 1,
      }}
      data-slot="popover-body"
    >
      {children}
    </div>
  );
}

PopoverBody.displayName = "PopoverBody";

// ---- POPOVER FOOTER ---------------------------------------------------------

/**
 * PopoverFooter props
 */
export interface PopoverFooterProps {
  /** Footer content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * PopoverFooter - Footer section for action buttons
 */
export function PopoverFooter({
  children,
  className,
  style,
}: PopoverFooterProps) {
  const { disableAnimation } = usePopover("PopoverFooter");

  const footerClasses = cn(
    "flex items-center justify-end gap-2",
    "border-t border-border",
    "px-5 py-3.5",
    "bg-background",
    className
  );

  if (!disableAnimation) {
    return (
      <motion.div
        className={footerClasses}
        style={{
          ...style,
          isolation: "isolate",
          position: "relative",
          zIndex: 2,
        }}
        variants={{
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 10 },
        }}
        data-slot="popover-footer"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={footerClasses}
      style={{
        ...style,
        isolation: "isolate",
        position: "relative",
        zIndex: 2,
      }}
      data-slot="popover-footer"
    >
      {children}
    </div>
  );
}

PopoverFooter.displayName = "PopoverFooter";

// ---- POPOVER CLOSE ----------------------------------------------------------

/**
 * PopoverClose props
 */
export interface PopoverCloseProps {
  /** Close button content or custom child */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Use custom child as button */
  asChild?: boolean;
}

/**
 * PopoverClose - Button that closes the popover
 */
export function PopoverClose({
  children = "Close",
  className,
  style,
  asChild = false,
}: PopoverCloseProps) {
  const { close } = usePopover("PopoverClose");

  const handleClick = useCallback(() => {
    close();
  }, [close]);

  // asChild pattern
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<
      Record<string, unknown>
    >;
    return React.cloneElement(childElement, {
      onClick: handleClick,
      "data-slot": "popover-close",
    });
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center",
        "px-4 py-2 rounded-lg",
        "text-sm font-medium",
        "bg-secondary text-secondary-foreground",
        "hover:bg-secondary/80",
        "transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      style={style}
      onClick={handleClick}
      data-slot="popover-close"
    >
      {children}
    </button>
  );
}

PopoverClose.displayName = "PopoverClose";
