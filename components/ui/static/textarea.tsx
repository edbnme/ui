/**
 * Textarea — Multi-line text input with optional auto-resize.
 *
 * @example
 * <Textarea placeholder="Write a message..." />
 * <Textarea autoResize placeholder="Auto-growing textarea" />
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const resizeTextarea = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    const setRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        // Forward ref to consumer
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
            node;
        }
        // Initial auto-resize
        if (node && autoResize) {
          node.style.height = "auto";
          node.style.height = `${node.scrollHeight}px`;
        }
      },
      [ref, autoResize]
    );

    // Re-measure when controlled value changes
    React.useEffect(() => {
      if (autoResize && props.value !== undefined) {
        resizeTextarea();
      }
    }, [autoResize, props.value, resizeTextarea]);

    // Attach input listener for auto-resize via ref (avoids dual React types issue)
    React.useEffect(() => {
      const el = textareaRef.current;
      if (!el || !autoResize) return;
      const handler = () => resizeTextarea();
      el.addEventListener("input", handler);
      return () => el.removeEventListener("input", handler);
    }, [autoResize, resizeTextarea]);

    return (
      <textarea
        ref={setRef}
        data-slot="textarea"
        className={cn(
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          autoResize && "resize-none overflow-hidden",
          !autoResize && "min-h-20",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
