"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

type RecorderState = "idle" | "recording" | "paused" | "stopped";

interface AudioRecorderProps
  extends
    Omit<React.ComponentProps<"div">, "onError">,
    VariantProps<typeof audioRecorderVariants> {
  /** Called when recording is complete with the audio blob */
  onRecordingComplete?: (blob: Blob, url: string) => void;
  /** Called when recording state changes */
  onStateChange?: (state: RecorderState) => void;
  /** Called on error */
  onError?: (error: string) => void;
  /** Maximum recording duration in seconds. Default: 300 (5 minutes) */
  maxDuration?: number;
  /** Preferred MIME type. Default: auto-detected */
  mimeType?: string;
  /** Whether to show the timer */
  showTimer?: boolean;
  /** Whether to show level meter */
  showLevel?: boolean;
}

// =============================================================================
// VARIANTS
// =============================================================================

const audioRecorderVariants = cva(
  "inline-flex items-center gap-3 rounded-xl border border-border/50 bg-background px-4 py-3 shadow-xs shadow-black/5",
  {
    variants: {
      size: {
        sm: "px-3 py-2 gap-2",
        md: "px-4 py-3 gap-3",
        lg: "px-5 py-4 gap-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// =============================================================================
// HELPERS
// =============================================================================

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function getPreferredMimeType(preferred?: string): string {
  if (preferred && MediaRecorder.isTypeSupported(preferred)) {
    return preferred;
  }
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}

// =============================================================================
// COMPONENT
// =============================================================================

function AudioRecorder({
  onRecordingComplete,
  onStateChange,
  onError,
  maxDuration = 300,
  mimeType: preferredMimeType,
  showTimer = true,
  showLevel = true,
  size,
  className,
  ...props
}: AudioRecorderProps) {
  const [state, setState] = React.useState<RecorderState>("idle");
  const [elapsed, setElapsed] = React.useState(0);
  const [level, setLevel] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const updateState = React.useCallback(
    (newState: RecorderState) => {
      setState(newState);
      onStateChange?.(newState);
    },
    [onStateChange]
  );

  // Level meter animation
  const startLevelMeter = React.useCallback(
    (stream: MediaStream) => {
      if (!showLevel) return;

      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          setLevel(sum / dataArray.length / 255);
          rafRef.current = requestAnimationFrame(updateLevel);
        };

        rafRef.current = requestAnimationFrame(updateLevel);
      } catch {
        // Level meter is optional; don't fail
      }
    },
    [showLevel]
  );

  const stopLevelMeter = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    analyserRef.current = null;
    setLevel(0);
  }, []);

  const startRecording = React.useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      const msg = "Recording not supported in this browser";
      setError(msg);
      onError?.(msg);
      return;
    }

    setError(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getPreferredMimeType(preferredMimeType);
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        onRecordingComplete?.(blob, url);
      };

      recorder.onerror = () => {
        const msg = "Recording error occurred";
        setError(msg);
        onError?.(msg);
        updateState("stopped");
      };

      recorder.start(100); // Collect data every 100ms
      updateState("recording");
      setElapsed(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // Start level meter
      startLevelMeter(stream);
    } catch (err) {
      let msg = "Failed to access microphone";
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError")
          msg = "Microphone permission denied";
        else if (err.name === "NotFoundError") msg = "No microphone found";
      }
      setError(msg);
      onError?.(msg);
    }
  }, [
    preferredMimeType,
    maxDuration,
    onRecordingComplete,
    onError,
    updateState,
    startLevelMeter,
  ]);

  const stopRecording = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    stopLevelMeter();

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    updateState("stopped");
  }, [updateState, stopLevelMeter]);

  const pauseRecording = React.useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.pause();
      updateState("paused");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [updateState]);

  const resumeRecording = React.useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "paused") {
      recorder.resume();
      updateState("recording");
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  }, [updateState, maxDuration, stopRecording]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopLevelMeter();
      const stream = streamRef.current;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRecording = state === "recording";
  const isPaused = state === "paused";
  const isIdle = state === "idle" || state === "stopped";

  return (
    <div
      data-slot="audio-recorder"
      data-state={state}
      className={cn(audioRecorderVariants({ size }), className)}
      {...props}
    >
      {/* Record / Stop button */}
      <button
        type="button"
        onClick={isIdle ? startRecording : stopRecording}
        className={cn(
          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
          isRecording || isPaused
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 ring-2 ring-destructive/30"
            : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        )}
        aria-label={isIdle ? "Start recording" : "Stop recording"}
      >
        {isIdle ? (
          <div className="w-3 h-3 rounded-full bg-current" />
        ) : (
          <div className="w-3 h-3 rounded-sm bg-current" />
        )}
      </button>

      {/* Level meter */}
      {showLevel && (isRecording || isPaused) && (
        <div className="flex items-center gap-0.5 h-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-primary transition-[height] duration-75"
              style={{
                height: `${Math.max(15, level * 100 * (1 - i * 0.15))}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Timer */}
      {showTimer && (
        <span
          className={cn(
            "font-mono tabular-nums text-sm",
            isRecording
              ? "text-destructive"
              : isPaused
                ? "text-muted-foreground/80"
                : "text-muted-foreground/80"
          )}
        >
          {formatDuration(elapsed)}
        </span>
      )}

      {/* Pause / Resume */}
      {(isRecording || isPaused) && (
        <button
          type="button"
          onClick={isRecording ? pauseRecording : resumeRecording}
          className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={isRecording ? "Pause recording" : "Resume recording"}
        >
          {isRecording ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="3" y="2" width="3" height="10" rx="0.5" />
              <rect x="8" y="2" width="3" height="10" rx="0.5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M4 2v10l8-5z" />
            </svg>
          )}
        </button>
      )}

      {/* Error */}
      {error && (
        <span className="text-xs text-destructive truncate max-w-[200px]">
          {error}
        </span>
      )}
    </div>
  );
}

AudioRecorder.displayName = "AudioRecorder";

export { AudioRecorder, audioRecorderVariants };
export type { AudioRecorderProps, RecorderState };
