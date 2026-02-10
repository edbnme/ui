/**
 * Popover Component (Static Version)
 *
 * A styled, reusable UI component for displaying rich content in a portal-like layer.
 * Pure CSS transitions, no motion/react dependency (~30KB savings).
 *
 * Based on WAI-ARIA Disclosure and Dialog patterns.
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
  forwardRef,
  type ReactNode,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { useStableId } from "@/hooks/use-stable-id";
import { useControllableBoolean } from "@/hooks/use-controllable-state";
import useClickOutside from "@/hooks/use-click-outside";

// =============================================================================
// TYPES
// =============================================================================

interface PopoverContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  uniqueId: string;
  setTriggerRef: (node: HTMLElement | null) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

// =============================================================================
// CONTEXT
// =============================================================================

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover(componentName = "PopoverTrigger"): PopoverContextValue {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error(`${componentName} must be used within <Popover>`);
  }
  return context;
}

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook to delay unmounting for exit animations
 * Returns { shouldRender, state } where:
 * - shouldRender: whether the component should be in the DOM
 * - state: 'open' | 'closed' for data-state attribute
 */
function useDelayedUnmount(
  isOpen: boolean,
  duration: number = 200
): {
  shouldRender: boolean;
  state: "open" | "closed";
} {
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  const [state, setState] = React.useState<"open" | "closed">(
    isOpen ? "open" : "closed"
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
// POPOVER ROOT
// =============================================================================

export interface PopoverRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

function PopoverRoot({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  style,
}: PopoverRootProps) {
  const [isOpen, setIsOpen] = useControllableBoolean({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const uniqueId = useStableId("popover");
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const openPopover = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closePopover = useCallback(() => setIsOpen(false), [setIsOpen]);
  const togglePopover = useCallback(
    () => setIsOpen((prev) => !prev),
    [setIsOpen]
  );

  // Callback to set trigger ref from child
  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  const contextValue = useMemo<PopoverContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      open: openPopover,
      close: closePopover,
      toggle: togglePopover,
      uniqueId,
      setTriggerRef,
      contentRef,
    }),
    [
      isOpen,
      setIsOpen,
      openPopover,
      closePopover,
      togglePopover,
      uniqueId,
      setTriggerRef,
    ]
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      <div
        className={cn("relative flex items-center justify-center", className)}
        style={style}
        data-slot="popover"
        data-state={isOpen ? "open" : "closed"}
      >
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

PopoverRoot.displayName = "PopoverRoot";

// =============================================================================
// POPOVER TRIGGER
// =============================================================================

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ className, asChild = false, ...props }, ref) {
    const { toggle, isOpen, uniqueId, setTriggerRef } =
      usePopover("PopoverTrigger");

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        toggle();
        props.onClick?.(e);
      },
      [toggle, props]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
        props.onKeyDown?.(event);
      },
      [toggle, props]
    );

    // Merge refs using callback
    const mergedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        // Update internal triggerRef via callback
        setTriggerRef(node);
        // Update forwarded ref
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, setTriggerRef]
    );

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={mergedRef}
        type={asChild ? undefined : "button"}
        className={cn("inline-flex items-center justify-center", className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={`popover-content-${uniqueId}`}
        data-slot="popover-trigger"
        data-state={isOpen ? "open" : "closed"}
        {...props}
      />
    );
  }
);

PopoverTrigger.displayName = "PopoverTrigger";

// =============================================================================
// POPOVER LABEL
// =============================================================================

export interface PopoverLabelProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function PopoverLabel({ children, className, style }: PopoverLabelProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      style={style}
      data-slot="popover-label"
    >
      {children}
    </span>
  );
}

PopoverLabel.displayName = "PopoverLabel";

// =============================================================================
// POPOVER CONTENT
// =============================================================================

export interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

function PopoverContent({
  children,
  className,
  style,
  closeOnEscape = true,
  closeOnClickOutside = true,
}: PopoverContentProps) {
  const { isOpen, close, uniqueId, contentRef } = usePopover("PopoverContent");
  const { shouldRender, state } = useDelayedUnmount(isOpen, 200);

  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  useClickOutside(contentRef, () => {
    if (closeOnClickOutside) {
      close();
    }
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        close();
        event.preventDefault();
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
  }, [isOpen, close, closeOnEscape]);

  useEffect(() => {
    if (!isOpen) return;

    const contentElement = contentRef.current;
    if (!contentElement) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements =
      contentElement.querySelectorAll(focusableSelector);

    if (focusableElements.length > 0) {
      firstFocusableRef.current = focusableElements[0] as HTMLElement;
      lastFocusableRef.current = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      requestAnimationFrame(() => {
        (focusableElements[0] as HTMLElement).focus();
      });
    }
  }, [isOpen, contentRef]);

  if (!shouldRender) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-100",
        "min-w-75 max-w-[95vw]",
        "overflow-hidden rounded-2xl",
        "border border-border",
        "bg-background",
        "p-4",
        "shadow-2xl shadow-black/20 dark:shadow-black/50",
        "outline-none focus:outline-none",
        // CSS animations with tw-animate-css
        "duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
        "data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2",
        className
      )}
      style={{
        ...style,
        isolation: "isolate",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`popover-title-${uniqueId}`}
      aria-describedby={`popover-description-${uniqueId}`}
      id={`popover-content-${uniqueId}`}
      data-slot="popover-content"
      data-state={state}
    >
      {children}
    </div>
  );
}

PopoverContent.displayName = "PopoverContent";

// =============================================================================
// POPOVER HEADER
// =============================================================================

export interface PopoverHeaderProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function PopoverHeader({ children, className, style }: PopoverHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2",
        "border-b border-border",
        "px-5 py-4",
        "bg-background",
        className
      )}
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

// =============================================================================
// POPOVER TITLE
// =============================================================================

export interface PopoverTitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function PopoverTitle({ children, className, style }: PopoverTitleProps) {
  const { uniqueId } = usePopover("PopoverTitle");

  return (
    <h2
      id={`popover-title-${uniqueId}`}
      className={cn(
        "flex items-center gap-2",
        "text-sm font-semibold leading-none",
        "text-foreground",
        className
      )}
      style={style}
      data-slot="popover-title"
    >
      {children}
    </h2>
  );
}

PopoverTitle.displayName = "PopoverTitle";

// =============================================================================
// POPOVER DESCRIPTION
// =============================================================================

export interface PopoverDescriptionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function PopoverDescription({
  children,
  className,
  style,
}: PopoverDescriptionProps) {
  const { uniqueId } = usePopover("PopoverDescription");

  return (
    <p
      id={`popover-description-${uniqueId}`}
      className={cn("text-sm text-muted-foreground", className)}
      style={style}
      data-slot="popover-description"
    >
      {children}
    </p>
  );
}

PopoverDescription.displayName = "PopoverDescription";

// =============================================================================
// POPOVER BODY
// =============================================================================

export interface PopoverBodyProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function PopoverBody({ children, className, style }: PopoverBodyProps) {
  return (
    <div
      className={cn("p-5 bg-background", className)}
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

// =============================================================================
// POPOVER FOOTER
// =============================================================================

export interface PopoverFooterProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function PopoverFooter({ children, className, style }: PopoverFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2",
        "border-t border-border",
        "px-5 py-3.5",
        "bg-background",
        className
      )}
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

// =============================================================================
// POPOVER CLOSE
// =============================================================================

export interface PopoverCloseProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  asChild?: boolean;
}

function PopoverClose({
  children = "Close",
  className,
  style,
  asChild = false,
}: PopoverCloseProps) {
  const { close } = usePopover("PopoverClose");

  const handleClick = useCallback(() => {
    close();
  }, [close]);

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

// =============================================================================
// EXPORTS
// =============================================================================

const Popover = PopoverRoot;

export {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverLabel,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverBody,
  PopoverFooter,
  PopoverClose,
};
