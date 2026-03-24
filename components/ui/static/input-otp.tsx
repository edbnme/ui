/**
 * Input OTP — Verification code input with customizable slots.
 * Built on the `input-otp` library.
 *
 * @example
 * <InputOTP maxLength={6}>
 *   <InputOTPGroup>
 *     <InputOTPSlot index={0} />
 *     <InputOTPSlot index={1} />
 *     <InputOTPSlot index={2} />
 *   </InputOTPGroup>
 *   <InputOTPSeparator />
 *   <InputOTPGroup>
 *     <InputOTPSlot index={3} />
 *     <InputOTPSlot index={4} />
 *     <InputOTPSlot index={5} />
 *   </InputOTPGroup>
 * </InputOTP>
 *
 * @see https://input-otp.rodz.dev
 */
"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// =============================================================================
// INPUT OTP ROOT
// =============================================================================

type InputOTPProps = React.ComponentPropsWithoutRef<typeof OTPInput>;

const InputOTP = React.forwardRef<
  React.ComponentRef<typeof OTPInput>,
  InputOTPProps
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-disabled:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

// =============================================================================
// INPUT OTP GROUP
// =============================================================================

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

// =============================================================================
// INPUT OTP SLOT
// =============================================================================

interface InputOTPSlotProps extends React.ComponentPropsWithoutRef<"div"> {
  index: number;
}

const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const slot = inputOTPContext.slots[index];

    if (!slot) return null;

    const { char, hasFakeCaret, isActive } = slot;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center border border-border text-sm font-medium transition-shadow",
          "first:rounded-l-md first:border-l last:rounded-r-md",
          "[&:not(:first-child)]:border-l-0",
          isActive && "z-10 ring-2 ring-ring ring-offset-background",
          className
        )}
        {...props}
      >
        {char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-px animate-pulse bg-foreground duration-1000" />
          </div>
        )}
      </div>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

// =============================================================================
// INPUT OTP SEPARATOR
// =============================================================================

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <MinusIcon className="h-4 w-4 text-muted-foreground" />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

// =============================================================================
// EXPORTS
// =============================================================================

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
