/**
 * Textarea - Premium solid multi-line text input.
 *
 * Native textarea wrapper with full form behavior, accessible validation
 * attributes, optional auto-resize, explicit ref forwarding, and solid
 * state-aware styling.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.1.0
 * @docs https://ui.edbn.me/docs/components/textarea
 * @registryDescription Premium solid multi-line text input with optional auto-resize.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export interface TextareaProps extends React.ComponentPropsWithRef<"textarea"> {
  /**
   * Resize to fit content on mount, controlled value changes, and input.
   * Combine with a max-height class to cap growth.
   */
  autoResize?: boolean;
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function Textarea({
  className,
  autoResize = false,
  ref,
  onInput,
  ...props
}: TextareaProps) {
  const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

  const resize = React.useCallback(() => {
    const element = internalRef.current;
    if (!element || !autoResize) return;

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [autoResize]);

  const setRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      assignRef(ref, node);
      if (node && autoResize) {
        node.style.height = "auto";
        node.style.height = `${node.scrollHeight}px`;
      }
    },
    [autoResize, ref]
  );

  React.useLayoutEffect(() => {
    resize();
  }, [resize, props.value]);

  function handleInput(
    event: Parameters<NonNullable<TextareaProps["onInput"]>>[0]
  ) {
    onInput?.(event);
    resize();
  }

  return (
    <textarea
      ref={setRef}
      data-slot="textarea"
      className={cn(
        "flex w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base shadow-xs outline-none",
        "transition-[border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "read-only:bg-muted/40",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "md:text-sm",
        autoResize && "resize-none overflow-hidden",
        !autoResize && "min-h-20",
        className
      )}
      onInput={handleInput}
      {...props}
    />
  );
}
Textarea.displayName = "Textarea";

// ---- EXPORTS ----------------------------------------------------------------

export { Textarea };
