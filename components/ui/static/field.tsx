/**
 * Field — Form field wrapper with label, description, and error support.
 * Built on @base-ui/react Field primitive.
 *
 * @example
 * <FieldRoot name="email">
 *   <FieldLabel>Email</FieldLabel>
 *   <FieldControl render={<Input />} />
 *   <FieldDescription>We'll never share your email.</FieldDescription>
 *   <FieldError />
 * </FieldRoot>
 *
 * @see https://base-ui.com/react/components/field
 */
"use client";

import * as React from "react";
import { Field } from "@base-ui/react/field";
import { cn } from "@/lib/utils";

// ---- FIELD ROOT -------------------------------------------------------------

const FieldRoot = React.forwardRef<HTMLDivElement, Field.Root.Props>(
  ({ className, ...props }, ref) => (
    <Field.Root ref={ref} className={cn("space-y-2", className)} {...props} />
  )
);
FieldRoot.displayName = "FieldRoot";

// ---- FIELD LABEL ------------------------------------------------------------

const FieldLabel = React.forwardRef<HTMLLabelElement, Field.Label.Props>(
  ({ className, ...props }, ref) => (
    <Field.Label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
FieldLabel.displayName = "FieldLabel";

// ---- FIELD CONTROL ----------------------------------------------------------

const FieldControl = React.forwardRef<HTMLInputElement, Field.Control.Props>(
  ({ className, ...props }, ref) => (
    <Field.Control
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
        "transition-colors",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
);
FieldControl.displayName = "FieldControl";

// ---- FIELD DESCRIPTION ------------------------------------------------------

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  Field.Description.Props
>(({ className, ...props }, ref) => (
  <Field.Description
    ref={ref}
    className={cn("text-[0.8rem] text-muted-foreground", className)}
    {...props}
  />
));
FieldDescription.displayName = "FieldDescription";

// ---- FIELD ERROR ------------------------------------------------------------

const FieldError = React.forwardRef<HTMLDivElement, Field.Error.Props>(
  ({ className, ...props }, ref) => (
    <Field.Error
      ref={ref}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    />
  )
);
FieldError.displayName = "FieldError";

// ---- FIELD VALIDITY ---------------------------------------------------------

const FieldValidity = Field.Validity;
FieldValidity.displayName = "FieldValidity";

// ---- EXPORTS ----------------------------------------------------------------

export {
  FieldRoot,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
};
