/**
 * Textarea — Multi-line text input with optional auto-resize.
 *
 * A pure-CSS component (no Base UI primitive — native `<textarea>` gives
 * us everything we need plus correct form participation). Supports an
 * opt-in `autoResize` mode that grows the element to fit its content on
 * every input, then caps at the browser's natural scroll when a `max-h-*`
 * class is applied.
 *
 * Anatomy:
 * ```tsx
 * <Textarea placeholder="Write a message…" />
 * <Textarea autoResize placeholder="Grows as you type" />
 * <Textarea autoResize className="max-h-60" />
 * ```
 *
 * Accessibility: native `<textarea>` — native label wiring, native
 * `required`, native `aria-invalid`. For error messaging, pair with
 * `aria-describedby` pointing at the message element.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/textarea
 * @registryDescription Multi-line text input with auto-resize support.
 */

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * When `true`, the element resizes to fit its content on every input
   * event. Combine with `max-h-*` to set an upper bound.
   */
  autoResize?: boolean;
  /** Forwarded ref — React 19 ref-as-prop. */
  ref?: React.Ref<HTMLTextAreaElement>;
}

/**
 * Multi-line text input.
 *
 * @since 0.1.0
 */
function Textarea({
  className,
  autoResize = false,
  ref: forwardedRef,
  ...props
}: TextareaProps) {
  const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

  const resize = React.useCallback(() => {
    const el = internalRef.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize]);

  // ---- Merged ref: keep our internal pointer AND honor consumer ref -------
  const handleRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>
        ).current = node;
      }
      // Initial sizing after mount.
      if (node && autoResize) {
        node.style.height = "auto";
        node.style.height = `${node.scrollHeight}px`;
      }
    },
    [forwardedRef, autoResize]
  );

  // Re-measure when controlled value changes.
  React.useEffect(() => {
    if (autoResize && props.value !== undefined) {
      resize();
    }
  }, [autoResize, props.value, resize]);

  // Listen for uncontrolled input events.
  React.useEffect(() => {
    const el = internalRef.current;
    if (!el || !autoResize) return;
    const handler = () => resize();
    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, [autoResize, resize]);

  return (
    <textarea
      ref={handleRef}
      data-slot="textarea"
      className={cn(
        "flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none",
        "transition-[color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        "dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "md:text-sm",
        autoResize && "resize-none overflow-hidden",
        !autoResize && "min-h-20",
        className
      )}
      {...props}
    />
  );
}
Textarea.displayName = "Textarea";

// ---- EXPORTS ----------------------------------------------------------------

export { Textarea };
