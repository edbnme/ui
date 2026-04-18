/**
 * Input — Single-line text input.
 *
 * Built on the Base UI `Input` primitive. A thin styled wrapper around
 * `<input>` that carries shadcn/Tailwind-v4 design tokens and correctly
 * handles disabled, error (`aria-invalid`), and focus-visible states.
 *
 * Anatomy:
 * ```tsx
 * <InputRoot type="email" placeholder="you@example.com" />
 *
 * // Error state (pair with a FormField / visible message for context)
 * <InputRoot aria-invalid aria-describedby="email-error" />
 * <p id="email-error" className="text-sm text-destructive">Invalid.</p>
 * ```
 *
 * Accessibility: the element is a real `<input>`, so native form
 * participation, labels (`<label htmlFor>`), and validation work out of
 * the box. For error messaging, set `aria-invalid` and `aria-describedby`
 * pointing at the message element.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/input
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/input
 * @registryDescription Styled text input with variants for email, password, and more.
 */

"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type InputRootProps = React.ComponentPropsWithoutRef<typeof InputPrimitive>;

/**
 * A styled text input.
 *
 * Focus: 1 px `ring` in `ring` color. Error: `aria-invalid` adds a
 * destructive-tinted ring.
 *
 * @since 0.1.0
 */
function InputRoot({ className, ...props }: InputRootProps) {
  return (
    <InputPrimitive
      data-slot="input-root"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "md:text-sm",
        className
      )}
      {...props}
    />
  );
}
InputRoot.displayName = "InputRoot";

// ---- EXPORTS ----------------------------------------------------------------

export { InputRoot };

/**
 * Backward-compatible alias — `Input` was the original shared-variant
 * export before the static-variant split.
 *
 * @deprecated prefer `InputRoot` for clarity.
 */
export { InputRoot as Input };
