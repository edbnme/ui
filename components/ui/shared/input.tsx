/**
 * Input Component
 *
 * A styled input component with focus states, validation support,
 * and file input styling. Built on Base UI Input primitive with
 * automatic Field integration.
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<
  typeof InputPrimitive
> {
  type?: React.HTMLInputTypeAttribute;
}

function Input({ className, type, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40 data-invalid:border-destructive",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

Input.displayName = "Input";

export { Input };
