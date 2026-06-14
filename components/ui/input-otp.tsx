/**
 * Input OTP - Premium solid verification code input.
 *
 * Built on Base UI OTP Field v1.5.0 preview. The wrapper preserves the local
 * InputOTP naming while mapping to OTPField Root, Input, and Separator parts.
 * The legacy maxLength prop remains as an alias for upstream length.
 *
 * @package @edbn/ui
 * @version 0.3.0
 * @since 0.1.0
 * @docs https://ui.edbn.me/docs/components/input-otp
 * @upstream https://base-ui.com/react/components/otp-field
 * @registryDescription Premium solid one-time password input with paste, validation, and separators.
 * @registryTitle Input OTP
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { OTPFieldPreview as OTPField } from "@base-ui/react/otp-field";
import { MinusIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

type StateClassName<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

function composeClassName<State>(
  baseClassName: string,
  className: StateClassName<State>
) {
  if (typeof className === "function") {
    return (state: State) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

type InputOTPContextValue = {
  length: number;
};

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null);

// ---- ROOT -------------------------------------------------------------------

export type InputOTPProps = Omit<
  React.ComponentProps<typeof OTPField.Root>,
  "length"
> & {
  /**
   * Upstream Base UI prop. Required by OTP Field; defaults to maxLength or 6
   * for backward compatibility with the previous InputOTP API.
   */
  length?: number;
  /**
   * Backward-compatible alias for length from the previous input-otp wrapper.
   */
  maxLength?: number;
  /**
   * Backward-compatible alias merged onto the root container className.
   */
  containerClassName?: string;
};

function InputOTP({
  className,
  containerClassName,
  length,
  maxLength,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: InputOTPProps) {
  const resolvedLength = length ?? maxLength ?? 6;
  const resolvedAriaLabel =
    ariaLabel ?? (!id && !ariaLabelledBy ? "One-time password" : undefined);
  const mergedClassName =
    typeof className === "function"
      ? (state: OTPField.Root.State) => cn(containerClassName, className(state))
      : cn(containerClassName, className);

  return (
    <InputOTPContext.Provider value={{ length: resolvedLength }}>
      <OTPField.Root
        id={id}
        aria-label={resolvedAriaLabel}
        aria-labelledby={ariaLabelledBy}
        length={resolvedLength}
        data-slot="input-otp"
        className={composeClassName<OTPField.Root.State>(
          cn(
            "flex items-center gap-2",
            "data-disabled:opacity-50 data-readonly:opacity-80"
          ),
          mergedClassName
        )}
        {...props}
      />
    </InputOTPContext.Provider>
  );
}
InputOTP.displayName = "InputOTP";

// ---- GROUP ------------------------------------------------------------------

export type InputOTPGroupProps = React.ComponentPropsWithRef<"div">;

function InputOTPGroup({ className, ref, ...props }: InputOTPGroupProps) {
  return (
    <div
      ref={ref}
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}
InputOTPGroup.displayName = "InputOTPGroup";

// ---- SLOT -------------------------------------------------------------------

export type InputOTPSlotProps = React.ComponentProps<typeof OTPField.Input> & {
  index: number;
};

function InputOTPSlot({
  index,
  className,
  "aria-label": ariaLabel,
  ...props
}: InputOTPSlotProps) {
  const context = React.useContext(InputOTPContext);
  const length = context?.length ?? index + 1;
  const accessibleName =
    index === 0
      ? undefined
      : (ariaLabel ?? `Character ${index + 1} of ${length}`);

  return (
    <OTPField.Input
      data-slot="input-otp-slot"
      aria-label={accessibleName}
      className={composeClassName<OTPField.Input.State>(
        cn(
          "relative m-0 flex h-10 w-10 rounded-none border border-border bg-background p-0 text-center text-sm font-medium text-foreground shadow-sm outline-none",
          "transition-[border-color,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none",
          "first:rounded-l-md first:border-l last:rounded-r-md",
          "[&:not(:first-child)]:border-l-0",
          "focus:z-10 focus:border-ring focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          "data-filled:bg-muted/30 data-focused:z-10",
          "data-invalid:border-destructive data-invalid:ring-destructive/20",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "data-readonly:bg-muted/40"
        ),
        className
      )}
      {...props}
    />
  );
}
InputOTPSlot.displayName = "InputOTPSlot";

// ---- SEPARATOR --------------------------------------------------------------

export type InputOTPSeparatorProps = React.ComponentProps<
  typeof OTPField.Separator
>;

function InputOTPSeparator({
  children,
  className,
  ...props
}: InputOTPSeparatorProps) {
  return (
    <OTPField.Separator
      data-slot="input-otp-separator"
      className={composeClassName<OTPField.Separator.State>(
        "flex items-center justify-center text-muted-foreground",
        className
      )}
      {...props}
    >
      {children ?? <MinusIcon aria-hidden className="size-4" />}
    </OTPField.Separator>
  );
}
InputOTPSeparator.displayName = "InputOTPSeparator";

// ---- EXPORTS ----------------------------------------------------------------

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
