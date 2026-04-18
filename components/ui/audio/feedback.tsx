"use client";


/**
 * Feedback
 * @registryCategory chat
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

type FeedbackValue = "positive" | "negative" | null;

interface FeedbackProps extends React.ComponentProps<"div"> {
  /** Current feedback value */
  value?: FeedbackValue;
  /** Called when feedback changes */
  onValueChange?: (value: FeedbackValue) => void;
  /** Called when copy is clicked */
  onCopy?: () => void;
  /** Called when regenerate is clicked */
  onRegenerate?: () => void;
  /** Show copy button */
  showCopy?: boolean;
  /** Show regenerate button */
  showRegenerate?: boolean;
}

// ---- INLINE ICONS -----------------------------------------------------------

function ThumbsUpIcon({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M4 6.5L5.5 1.5C6.05 1.5 6.5 1.95 6.5 2.5V5H10.68C10.85 5 11.01 5.04 11.16 5.12C11.3 5.19 11.42 5.3 11.51 5.43C11.6 5.56 11.65 5.71 11.66 5.87C11.67 6.03 11.64 6.18 11.57 6.33L9.72 10.33C9.63 10.52 9.49 10.69 9.31 10.8C9.14 10.92 8.93 10.98 8.72 10.98H4M4 6.5V11M4 6.5H2.5C2.22 6.5 2 6.72 2 7V10.5C2 10.78 2.22 11 2.5 11H4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function ThumbsDownIcon({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M10 7.5L8.5 12.5C7.95 12.5 7.5 12.05 7.5 11.5V9H3.32C3.15 9 2.99 8.96 2.84 8.88C2.7 8.81 2.58 8.7 2.49 8.57C2.4 8.44 2.35 8.29 2.34 8.13C2.33 7.97 2.36 7.82 2.43 7.67L4.28 3.67C4.37 3.48 4.51 3.31 4.69 3.2C4.86 3.08 5.07 3.02 5.28 3.02H10M10 7.5V3M10 7.5H11.5C11.78 7.5 12 7.28 12 7V3.5C12 3.22 11.78 3 11.5 3H10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <rect
        x="5"
        y="5"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M9 5V3.5C9 2.67 8.33 2 7.5 2H3.5C2.67 2 2 2.67 2 3.5V7.5C2 8.33 2.67 9 3.5 9H5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M1.5 2.5V5.5H4.5M12.5 11.5V8.5H9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.4 8.5A5 5 0 008.35 12.15L9.5 11M11.6 5.5A5 5 0 005.65 1.85L4.5 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---- VARIANTS ---------------------------------------------------------------

const feedbackButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg p-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      state: {
        default:
          "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/80",
        active: "text-foreground bg-primary/10",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

// ---- COMPONENT --------------------------------------------------------------

function Feedback({
  value,
  onValueChange,
  onCopy,
  onRegenerate,
  showCopy = true,
  showRegenerate = true,
  className,
  ...props
}: FeedbackProps) {
  const [copied, setCopied] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<FeedbackValue>(null);

  const currentValue = value ?? internalValue;
  const handleChange = (newValue: FeedbackValue) => {
    const resolvedValue = currentValue === newValue ? null : newValue;
    if (value === undefined) {
      setInternalValue(resolvedValue);
    }
    onValueChange?.(resolvedValue);
  };

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-slot="feedback"
      className={cn("inline-flex items-center gap-1", className)}
      role="group"
      aria-label="Message feedback"
      {...props}
    >
      <button
        type="button"
        onClick={() => handleChange("positive")}
        className={cn(
          feedbackButtonVariants({
            state: currentValue === "positive" ? "active" : "default",
          })
        )}
        aria-label="Good response"
        aria-pressed={currentValue === "positive"}
      >
        <ThumbsUpIcon filled={currentValue === "positive"} />
      </button>
      <button
        type="button"
        onClick={() => handleChange("negative")}
        className={cn(
          feedbackButtonVariants({
            state: currentValue === "negative" ? "active" : "default",
          })
        )}
        aria-label="Bad response"
        aria-pressed={currentValue === "negative"}
      >
        <ThumbsDownIcon filled={currentValue === "negative"} />
      </button>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className={cn(feedbackButtonVariants({ state: "default" }))}
          aria-label={copied ? "Copied" : "Copy response"}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7L6 10L11 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <CopyIcon />
          )}
        </button>
      )}
      {showRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className={cn(feedbackButtonVariants({ state: "default" }))}
          aria-label="Regenerate response"
        >
          <RefreshIcon />
        </button>
      )}
    </div>
  );
}

Feedback.displayName = "Feedback";

export { Feedback, feedbackButtonVariants };
export type { FeedbackProps, FeedbackValue };
