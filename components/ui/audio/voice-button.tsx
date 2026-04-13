"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { LiveWaveform } from "./live-waveform";

// =============================================================================
// ICONS
// =============================================================================

function CheckSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// =============================================================================
// TYPES
// =============================================================================

export type VoiceButtonState =
  | "idle"
  | "recording"
  | "processing"
  | "success"
  | "error";

export interface VoiceButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onError"
> {
  state?: VoiceButtonState;
  onPress?: () => void;
  label?: React.ReactNode;
  trailing?: React.ReactNode;
  icon?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  waveformClassName?: string;
  feedbackDuration?: number;
}

// =============================================================================
// VARIANT STYLING
// =============================================================================

const variantClasses: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<string, string> = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-10 px-8 text-sm",
  icon: "h-9 w-9",
};

// =============================================================================
// COMPONENT
// =============================================================================

export const VoiceButton = React.forwardRef<
  HTMLButtonElement,
  VoiceButtonProps
>(
  (
    {
      state = "idle",
      onPress,
      label,
      trailing,
      icon,
      variant = "outline",
      size = "default",
      className,
      waveformClassName,
      feedbackDuration = 1500,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [showFeedback, setShowFeedback] = React.useState(false);

    React.useEffect(() => {
      if (state === "success" || state === "error") {
        setShowFeedback(true);
        const timeout = setTimeout(
          () => setShowFeedback(false),
          feedbackDuration
        );
        return () => clearTimeout(timeout);
      } else {
        setShowFeedback(false);
      }
    }, [state, feedbackDuration]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      onPress?.();
    };

    const isRecording = state === "recording";
    const isProcessing = state === "processing";
    const isSuccess = state === "success";
    const isError = state === "error";
    const isDisabled = disabled || isProcessing;

    const shouldShowWaveform = isRecording || isProcessing || showFeedback;
    const shouldShowTrailing = !shouldShowWaveform && trailing;

    return (
      <button
        ref={ref}
        type="button"
        data-slot="voice-button"
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant] ?? variantClasses.outline,
          sizeClasses[size] ?? sizeClasses.default,
          size === "icon" && "relative",
          className
        )}
        aria-label="Voice Button"
        {...props}
      >
        {size !== "icon" && label && (
          <span className="inline-flex shrink-0 items-center justify-start">
            {label}
          </span>
        )}

        <div
          className={cn(
            "relative box-content flex shrink-0 items-center justify-center overflow-hidden transition-all duration-300",
            size === "icon"
              ? "absolute inset-0 rounded-sm border-0"
              : "h-5 w-24 rounded-sm border",
            isRecording
              ? "bg-primary/10 dark:bg-primary/5"
              : size === "icon"
                ? "bg-muted/50 border-0"
                : "border-border bg-muted/50",
            waveformClassName
          )}
        >
          {shouldShowWaveform && (
            <LiveWaveform
              active={isRecording}
              processing={isProcessing || isSuccess}
              barWidth={2}
              barGap={1}
              barRadius={4}
              fadeEdges={false}
              sensitivity={1.8}
              smoothingTimeConstant={0.85}
              height={20}
              mode="static"
              className="animate-in fade-in absolute inset-0 h-full w-full duration-300"
            />
          )}

          {shouldShowTrailing && (
            <div className="animate-in fade-in absolute inset-0 flex items-center justify-center duration-300">
              {typeof trailing === "string" ? (
                <span className="text-muted-foreground px-1.5 font-mono text-[10px] font-medium select-none">
                  {trailing}
                </span>
              ) : (
                trailing
              )}
            </div>
          )}

          {!shouldShowWaveform &&
            !shouldShowTrailing &&
            icon &&
            size === "icon" && (
              <div className="animate-in fade-in absolute inset-0 flex items-center justify-center duration-300">
                {icon}
              </div>
            )}

          {isSuccess && showFeedback && (
            <div className="animate-in fade-in bg-background/80 absolute inset-0 flex items-center justify-center duration-300">
              <span className="text-primary text-[10px] font-medium">
                <CheckSvg className="size-3.5" />
              </span>
            </div>
          )}

          {isError && showFeedback && (
            <div className="animate-in fade-in bg-background/80 absolute inset-0 flex items-center justify-center duration-300">
              <span className="text-destructive text-[10px] font-medium">
                <XSvg className="size-3.5" />
              </span>
            </div>
          )}
        </div>
      </button>
    );
  }
);

VoiceButton.displayName = "VoiceButton";
