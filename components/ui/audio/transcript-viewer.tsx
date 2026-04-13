"use client";

import * as React from "react";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  useTranscriptViewer,
  type CharacterAlignmentResponseModel,
  type SegmentComposer,
  type TranscriptSegment,
  type TranscriptWord,
  type UseTranscriptViewerResult,
} from "@/hooks/use-transcript-viewer";
import {
  ScrubBarContainer,
  ScrubBarTrack,
  ScrubBarProgress,
  ScrubBarThumb,
  ScrubBarTimeLabel,
} from "@/components/ui/audio/scrub-bar";

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type AudioType = "native" | "external";

interface TranscriptViewerContextValue extends UseTranscriptViewerResult {
  audioType: AudioType;
  audioProps: React.AudioHTMLAttributes<HTMLAudioElement>;
}

const TranscriptViewerContext =
  createContext<TranscriptViewerContextValue | null>(null);

function useTranscriptViewerContext(): TranscriptViewerContextValue {
  const ctx = useContext(TranscriptViewerContext);
  if (!ctx) {
    throw new Error(
      "TranscriptViewer compound components must be used within TranscriptViewerContainer"
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// TranscriptViewerContainer
// ---------------------------------------------------------------------------

export interface TranscriptViewerContainerProps {
  alignment?: CharacterAlignmentResponseModel;
  text?: string;
  src?: string;
  composer?: SegmentComposer;
  hideAudioTags?: boolean;
  onTimeUpdate?: (time: number) => void;
  children: ReactNode;
  className?: string;
}

export function TranscriptViewerContainer({
  alignment,
  text,
  src,
  composer,
  hideAudioTags = true,
  onTimeUpdate,
  children,
  className,
}: TranscriptViewerContainerProps) {
  const viewer = useTranscriptViewer({
    alignment,
    text,
    composer,
    hideAudioTags,
    onTimeUpdate,
  });

  const audioType: AudioType = src ? "native" : "external";

  const audioProps: React.AudioHTMLAttributes<HTMLAudioElement> = useMemo(
    () => ({
      src,
      preload: "metadata" as const,
    }),
    [src]
  );

  const ctx = useMemo<TranscriptViewerContextValue>(
    () => ({
      ...viewer,
      audioType,
      audioProps,
    }),
    [viewer, audioType, audioProps]
  );

  return (
    <TranscriptViewerContext.Provider value={ctx}>
      <div
        data-slot="transcript-viewer"
        className={cn("flex flex-col gap-4", className)}
      >
        {children}
      </div>
    </TranscriptViewerContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// TranscriptViewerWord
// ---------------------------------------------------------------------------

export interface TranscriptViewerWordProps {
  word: TranscriptWord;
  status: "spoken" | "current" | "unspoken";
  onClick?: () => void;
  className?: string;
}

export function TranscriptViewerWord({
  word,
  status,
  onClick,
  className,
}: TranscriptViewerWordProps) {
  return (
    <span
      data-slot="transcript-word"
      data-status={status}
      className={cn(
        "cursor-pointer transition-colors duration-150",
        status === "spoken" && "text-foreground",
        status === "current" &&
          "text-foreground bg-primary/20 rounded-sm px-0.5 -mx-0.5",
        status === "unspoken" && "text-muted-foreground/50",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={-1}
    >
      {word.text}
    </span>
  );
}

// ---------------------------------------------------------------------------
// TranscriptViewerWords
// ---------------------------------------------------------------------------

export interface TranscriptViewerWordsProps {
  className?: string;
}

export function TranscriptViewerWords({
  className,
}: TranscriptViewerWordsProps) {
  const { segments, currentWordIndex, currentTime, seekToWord } =
    useTranscriptViewerContext();

  const segmentsWithStatus = useMemo(() => {
    return segments.map((segment) => {
      if (segment.kind === "gap") return segment;

      let status: "spoken" | "current" | "unspoken";
      if (segment.wordIndex === currentWordIndex) {
        status = "current";
      } else if (
        currentWordIndex >= 0 &&
        segment.wordIndex < currentWordIndex
      ) {
        status = "spoken";
      } else if (
        currentWordIndex >= 0 &&
        segment.wordIndex === currentWordIndex + 1 &&
        currentTime > segment.startTime - 0.1
      ) {
        // Near-end: about to transition
        status = "current";
      } else {
        status = "unspoken";
      }

      return { ...segment, status };
    });
  }, [segments, currentWordIndex, currentTime]);

  return (
    <div
      data-slot="transcript-words"
      className={cn(
        "leading-relaxed text-base flex flex-wrap gap-x-1.5 gap-y-1",
        className
      )}
    >
      {segmentsWithStatus.map((segment, i) => {
        if (segment.kind === "gap") {
          return null;
        }

        return (
          <TranscriptViewerWord
            key={`word-${segment.wordIndex}`}
            word={segment}
            status={
              (
                segment as TranscriptWord & {
                  status: "spoken" | "current" | "unspoken";
                }
              ).status
            }
            onClick={() => seekToWord(segment.wordIndex)}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TranscriptViewerAudio
// ---------------------------------------------------------------------------

export function TranscriptViewerAudio() {
  const { audioRef, audioProps, audioType } = useTranscriptViewerContext();

  if (audioType !== "native") return null;

  return (
    <audio
      ref={audioRef}
      data-slot="transcript-audio"
      className="hidden"
      {...audioProps}
    />
  );
}

// ---------------------------------------------------------------------------
// TranscriptViewerPlayPauseButton
// ---------------------------------------------------------------------------

export interface TranscriptViewerPlayPauseButtonProps {
  children?: ReactNode | ((state: { isPlaying: boolean }) => ReactNode);
  className?: string;
}

export function TranscriptViewerPlayPauseButton({
  children,
  className,
}: TranscriptViewerPlayPauseButtonProps) {
  const { isPlaying, play, pause } = useTranscriptViewerContext();

  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  if (typeof children === "function") {
    return <>{children({ isPlaying })}</>;
  }

  return (
    <button
      data-slot="transcript-play-pause"
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "h-10 w-10",
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      onClick={handleClick}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {children ?? (isPlaying ? <PauseIcon /> : <PlayIcon />)}
    </button>
  );
}

// ---------------------------------------------------------------------------
// TranscriptViewerScrubBar
// ---------------------------------------------------------------------------

export interface TranscriptViewerScrubBarProps {
  className?: string;
  showTime?: boolean;
}

export function TranscriptViewerScrubBar({
  className,
  showTime = true,
}: TranscriptViewerScrubBarProps) {
  const { currentTime, duration, seekToTime, startScrubbing, endScrubbing } =
    useTranscriptViewerContext();

  return (
    <ScrubBarContainer
      value={currentTime}
      duration={duration || 1}
      onScrub={seekToTime}
      onScrubStart={startScrubbing}
      onScrubEnd={() => endScrubbing()}
      className={className}
    >
      {showTime && <ScrubBarTimeLabel time={currentTime} />}
      <ScrubBarTrack>
        <ScrubBarProgress />
        <ScrubBarThumb />
      </ScrubBarTrack>
      {showTime && (
        <ScrubBarTimeLabel time={Math.max(0, (duration || 0) - currentTime)} />
      )}
    </ScrubBarContainer>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export type {
  CharacterAlignmentResponseModel,
  TranscriptSegment,
  TranscriptWord,
};
