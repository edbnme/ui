/**
 * Input OTP — One-time password / verification-code input with
 * customizable slots. Built on the `input-otp` library.
 *
 * Each character lives in a separate visual slot that animates its
 * active / filled / caret states. Group + separator composition lets
 * you render patterns like `000 - 000` for 6-digit codes.
 *
 * Anatomy:
 * ```tsx
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
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/input-otp
 * @upstream   input-otp — https://input-otp.rodz.dev
 * @registryDescription One-time password input with auto-focus, paste support, and separators.
 * @registryTitle Input OTP
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type InputOTPProps = React.ComponentPropsWithoutRef<typeof OTPInput>;

/**
 * The OTP input root. Forwards all `OTPInput` props (incl. `maxLength`,
 * `value`, `onChange`, `pattern`).
 *
 * @since 0.1.0
 */
function InputOTP({
  className,
  containerClassName,
  ...props
}: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}
InputOTP.displayName = "InputOTP";

// ---- GROUP ------------------------------------------------------------------

export type InputOTPGroupProps = React.ComponentPropsWithoutRef<"div">;

/**
 * Visually groups a run of consecutive slots (gives them shared rounded
 * corners & connected borders).
 *
 * @since 0.1.0
 */
function InputOTPGroup({ className, ...props }: InputOTPGroupProps) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}
InputOTPGroup.displayName = "InputOTPGroup";

// ---- SLOT -------------------------------------------------------------------

export interface InputOTPSlotProps
  extends React.ComponentPropsWithoutRef<"div"> {
  /** Which character index in the OTP value this slot displays. */
  index: number;
}

/**
 * A single-character slot. Pulls its char / active / caret state from the
 * surrounding `OTPInput` via context.
 *
 * @since 0.1.0
 */
function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const slot = inputOTPContext?.slots[index];

  if (!slot) return null;

  const { char, hasFakeCaret, isActive } = slot;

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive ? "" : undefined}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border border-border text-sm font-medium",
        "transition-[box-shadow,border-color] duration-150 ease-out motion-reduce:transition-none",
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
          <div className="h-4 w-px animate-pulse bg-foreground duration-1000 motion-reduce:animate-none" />
        </div>
      )}
    </div>
  );
}
InputOTPSlot.displayName = "InputOTPSlot";

// ---- SEPARATOR --------------------------------------------------------------

export type InputOTPSeparatorProps = React.ComponentPropsWithoutRef<"div">;

/**
 * Visual divider rendered between two `InputOTPGroup`s. Default content
 * is a minus icon — override by passing children.
 *
 * @since 0.1.0
 */
function InputOTPSeparator({
  children,
  className,
  ...props
}: InputOTPSeparatorProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      data-slot="input-otp-separator"
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {children ?? (
        <MinusIcon className="h-4 w-4 text-muted-foreground" aria-hidden />
      )}
    </div>
  );
}
InputOTPSeparator.displayName = "InputOTPSeparator";

// ---- EXPORTS ----------------------------------------------------------------

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
