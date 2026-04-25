"use client";


/**
 * Speech Input
 * @registryCategory display
 */
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
      <path d="M17 11a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2z" />
    </svg>
  );
}

function StopIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SpeechInputState =
  | "idle"
  | "listening"
  | "processing"
  | "error"
  | "unsupported";

export interface SpeechInputProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onError" | "children"
> {
  /** Called with transcript text. isFinal=true when the result is final. */
  onTranscript?: (text: string, isFinal: boolean) => void;
  /** Called when an error occurs */
  onError?: (error: string) => void;
  /** Called when listening state changes */
  onStateChange?: (state: SpeechInputState) => void;
  /** BCP-47 language tag. Default: "en-US" */
  lang?: string;
  /** Whether to keep listening after each final result. Default: false */
  continuous?: boolean;
  /** Whether to return interim (partial) results. Default: true */
  interimResults?: boolean;
  /** Custom trigger button renderer */
  children?: (state: SpeechInputState, toggle: () => void) => React.ReactNode;
}

// ---------------------------------------------------------------------------
// Speech support check
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionConstructor = any;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

// ---------------------------------------------------------------------------
// SpeechInput
// ---------------------------------------------------------------------------

export const SpeechInput = React.forwardRef<HTMLDivElement, SpeechInputProps>(
  (
    {
      onTranscript,
      onError,
      onStateChange,
      lang = "en-US",
      continuous = false,
      interimResults = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState<SpeechInputState>("idle");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    const updateState = useCallback(
      (newState: SpeechInputState) => {
        setState(newState);
        onStateChange?.(newState);
      },
      [onStateChange]
    );

    // Check support on mount
    useEffect(() => {
      const SpeechRecognitionCtor = getSpeechRecognition();
      if (!SpeechRecognitionCtor) {
        updateState("unsupported");
      }
    }, [updateState]);

    const stop = useCallback(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      updateState("idle");
    }, [updateState]);

    const start = useCallback(() => {
      const SpeechRecognitionCtor = getSpeechRecognition();
      if (!SpeechRecognitionCtor) {
        updateState("unsupported");
        return;
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = continuous;
      recognition.lang = lang;
      recognition.interimResults = interimResults;
      recognition.maxAlternatives = 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        if (result) {
          const transcript = result[0].transcript;
          const isFinal = result.isFinal;
          onTranscript?.(transcript, isFinal);
        }
      };

      recognition.onspeechend = () => {
        if (!continuous) {
          updateState("processing");
        }
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        if (state === "listening") {
          updateState("idle");
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        const errorMessage = event.error;

        if (errorMessage === "no-speech") {
          updateState("idle");
          return;
        }

        if (
          errorMessage === "not-allowed" ||
          errorMessage === "service-not-allowed"
        ) {
          onError?.("Microphone access denied");
        } else if (errorMessage === "audio-capture") {
          onError?.("No microphone found");
        } else {
          onError?.(errorMessage);
        }

        updateState("error");
        recognitionRef.current = null;
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
        updateState("listening");
      } catch {
        onError?.("Failed to start speech recognition");
        updateState("error");
      }
    }, [
      continuous,
      lang,
      interimResults,
      onTranscript,
      onError,
      updateState,
      state,
    ]);

    const toggle = useCallback(() => {
      if (state === "listening") {
        stop();
      } else if (state === "idle" || state === "error") {
        start();
      }
    }, [state, start, stop]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
      };
    }, []);

    return (
      <div
        ref={ref}
        data-slot="speech-input"
        data-state={state}
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        {children ? (
          children(state, toggle)
        ) : (
          <>
            <button
              type="button"
              onClick={toggle}
              disabled={state === "unsupported"}
              data-slot="speech-toggle"
              className={cn(
                "inline-flex items-center justify-center rounded-full transition-colors size-10",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                state === "listening"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
                state === "unsupported" && "opacity-50 cursor-not-allowed"
              )}
              aria-label={
                state === "listening"
                  ? "Stop listening"
                  : state === "unsupported"
                    ? "Speech recognition not supported"
                    : "Start listening"
              }
            >
              {state === "listening" ? (
                <StopIcon className="size-5" />
              ) : (
                <MicIcon
                  className="size-5"
                  opacity={state === "unsupported" ? 0.5 : 1}
                />
              )}
            </button>
            {state === "listening" && (
              <span className="text-muted-foreground animate-pulse text-sm">
                Listening…
              </span>
            )}
            {state === "processing" && (
              <span className="text-muted-foreground text-sm">Processing…</span>
            )}
            {state === "unsupported" && (
              <span className="text-muted-foreground text-xs">
                Not supported
              </span>
            )}
          </>
        )}
      </div>
    );
  }
);

SpeechInput.displayName = "SpeechInput";
