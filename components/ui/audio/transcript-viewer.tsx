"use client";

/**
 * Transcript Viewer
 * @registryDescription Playback-aligned transcript primitives with word highlighting and scrub controls.
 * @registryCategory display
 */

import {
  createContext,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  ScrubBarContainer,
  ScrubBarProgress,
  ScrubBarThumb,
  ScrubBarTimeLabel,
  ScrubBarTrack,
} from "@/components/ui/audio/scrub-bar";
import { Button } from "@/components/ui/static/button";
import {
  useTranscriptViewer,
  type CharacterAlignmentResponseModel,
  type TranscriptGap,
  type TranscriptSegment,
  type TranscriptWord as TranscriptWordType,
  type UseTranscriptViewerProps,
  type UseTranscriptViewerResult,
} from "@/hooks/use-transcript-viewer";
import { cn } from "@/lib/utils";

// ---- ICONS -----------------------------------------------------------------

function PlayIcon({ className, ...props }: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function PauseIcon({ className, ...props }: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M6 4h4v16H6V4Zm8 0h4v16h-4V4Z" />
    </svg>
  );
}

// ---- CONTEXT ----------------------------------------------------------------

type TranscriptViewerContextValue = UseTranscriptViewerResult & {
  alignment?: CharacterAlignmentResponseModel;
  audioSrc?: string;
  audioType: AudioMimeType;
};

const TranscriptViewerContext =
  createContext<TranscriptViewerContextValue | null>(null);

function useTranscriptViewerContext() {
  const context = useContext(TranscriptViewerContext);
  if (!context) {
    throw new Error(
      "useTranscriptViewerContext must be used within a TranscriptViewer"
    );
  }
  return context;
}

type TranscriptViewerProviderProps = {
  value: TranscriptViewerContextValue;
  children: ReactNode;
};

function TranscriptViewerProvider({
  value,
  children,
}: TranscriptViewerProviderProps) {
  return (
    <TranscriptViewerContext.Provider value={value}>
      {children}
    </TranscriptViewerContext.Provider>
  );
}

// ---- CONTAINER --------------------------------------------------------------

type AudioMimeType =
  | "audio/mpeg"
  | "audio/wav"
  | "audio/ogg"
  | "audio/mp3"
  | "audio/m4a"
  | "audio/aac"
  | "audio/webm";

export type TranscriptViewerContainerProps = {
  audioSrc?: string;
  src?: string;
  audioType?: AudioMimeType;
  alignment?: CharacterAlignmentResponseModel;
  text?: string;
  segmentComposer?: UseTranscriptViewerProps["segmentComposer"];
  composer?: UseTranscriptViewerProps["composer"];
  hideAudioTags?: boolean;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "children"> &
  Pick<
    UseTranscriptViewerProps,
    "onPlay" | "onPause" | "onTimeUpdate" | "onEnded" | "onDurationChange"
  >;

function TranscriptViewerContainer({
  audioSrc,
  src,
  audioType = "audio/mpeg",
  alignment,
  text,
  segmentComposer,
  composer,
  hideAudioTags = true,
  children,
  className,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onDurationChange,
  ...props
}: TranscriptViewerContainerProps) {
  const viewerState = useTranscriptViewer({
    alignment,
    text,
    segmentComposer,
    composer,
    hideAudioTags,
    onPlay,
    onPause,
    onTimeUpdate,
    onEnded,
    onDurationChange,
  });

  const resolvedAudioSrc = audioSrc ?? src;

  const contextValue = useMemo(
    () => ({
      ...viewerState,
      alignment,
      audioSrc: resolvedAudioSrc,
      audioType,
    }),
    [viewerState, alignment, resolvedAudioSrc, audioType]
  );

  return (
    <TranscriptViewerProvider value={contextValue}>
      <div
        data-slot="transcript-viewer-root"
        className={cn("space-y-4 p-4", className)}
        {...props}
      >
        {children}
      </div>
    </TranscriptViewerProvider>
  );
}

// ---- WORDS ------------------------------------------------------------------

type TranscriptViewerWordStatus = "spoken" | "unspoken" | "current";

interface TranscriptViewerWordProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  word: TranscriptWordType;
  status: TranscriptViewerWordStatus;
  children?: ReactNode;
}

function TranscriptViewerWord({
  word,
  status,
  className,
  children,
  ...props
}: TranscriptViewerWordProps) {
  return (
    <span
      data-slot="transcript-word"
      data-kind="word"
      data-status={status}
      className={cn(
        "rounded-sm px-0.5 transition-colors",
        status === "spoken" && "text-foreground",
        status === "unspoken" && "text-muted-foreground",
        status === "current" && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {children ?? word.text}
    </span>
  );
}

interface TranscriptViewerWordsProps extends HTMLAttributes<HTMLDivElement> {
  renderWord?: (props: {
    word: TranscriptWordType;
    status: TranscriptViewerWordStatus;
  }) => ReactNode;
  renderGap?: (props: {
    segment: TranscriptGap;
    status: TranscriptViewerWordStatus;
  }) => ReactNode;
  wordClassNames?: string;
  gapClassNames?: string;
}

function TranscriptViewerWords({
  className,
  renderWord,
  renderGap,
  wordClassNames,
  gapClassNames,
  ...props
}: TranscriptViewerWordsProps) {
  const {
    spokenSegments,
    unspokenSegments,
    currentWord,
    segments,
    duration,
    currentTime,
    seekToWord,
  } = useTranscriptViewerContext();

  const nearEnd = useMemo(() => {
    if (!duration) {
      return false;
    }

    return currentTime >= duration - 0.01;
  }, [currentTime, duration]);

  const segmentsWithStatus = useMemo(() => {
    if (nearEnd) {
      return segments.map((segment) => ({
        segment,
        status: "spoken" as const,
      }));
    }

    const entries: Array<{
      segment: TranscriptSegment;
      status: TranscriptViewerWordStatus;
    }> = [];

    for (const segment of spokenSegments) {
      entries.push({ segment, status: "spoken" });
    }

    if (currentWord) {
      entries.push({ segment: currentWord, status: "current" });
    }

    for (const segment of unspokenSegments) {
      entries.push({ segment, status: "unspoken" });
    }

    return entries;
  }, [spokenSegments, unspokenSegments, currentWord, nearEnd, segments]);

  return (
    <div
      data-slot="transcript-words"
      className={cn("text-xl leading-relaxed", className)}
      {...props}
    >
      {segmentsWithStatus.map(({ segment, status }) => {
        if (segment.kind === "gap") {
          const content = renderGap
            ? renderGap({ segment, status })
            : segment.text;

          return (
            <span
              key={`gap-${segment.segmentIndex}`}
              data-kind="gap"
              data-status={status}
              className={cn(gapClassNames)}
            >
              {content}
            </span>
          );
        }

        if (renderWord) {
          return (
            <span
              key={`word-${segment.segmentIndex}`}
              data-kind="word"
              data-status={status}
              className={cn(wordClassNames)}
            >
              {renderWord({ word: segment, status })}
            </span>
          );
        }

        return (
          <TranscriptViewerWord
            key={`word-${segment.segmentIndex}`}
            word={segment}
            status={status}
            className={cn(wordClassNames, "cursor-pointer")}
            onClick={() => seekToWord(segment)}
          />
        );
      })}
    </div>
  );
}

// ---- AUDIO ------------------------------------------------------------------

function TranscriptViewerAudio({
  ...props
}: ComponentPropsWithoutRef<"audio">) {
  const { audioRef, audioSrc, audioType } = useTranscriptViewerContext();

  if (!audioSrc) {
    return null;
  }

  return (
    <audio
      data-slot="transcript-audio"
      {...props}
      ref={audioRef}
      controls={false}
      preload="metadata"
      src={audioSrc}
    >
      <source src={audioSrc} type={audioType} />
    </audio>
  );
}

// ---- PLAY / PAUSE -----------------------------------------------------------

type RenderChildren = (state: { isPlaying: boolean }) => ReactNode;

type TranscriptViewerPlayPauseButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "children"
> & {
  children?: ReactNode | RenderChildren;
};

function TranscriptViewerPlayPauseButton({
  className,
  children,
  onClick,
  ...props
}: TranscriptViewerPlayPauseButtonProps) {
  const { isPlaying, play, pause } = useTranscriptViewerContext();
  const Icon = isPlaying ? PauseIcon : PlayIcon;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }

    onClick?.(event);
  };

  const content =
    typeof children === "function"
      ? (children as RenderChildren)({ isPlaying })
      : children;

  return (
    <Button
      data-slot="transcript-play-pause-button"
      type="button"
      variant="outline"
      size="icon"
      aria-label={isPlaying ? "Pause audio" : "Play audio"}
      data-playing={isPlaying}
      className={cn("cursor-pointer", className)}
      onClick={handleClick}
      {...props}
    >
      {content ?? <Icon className="size-4" />}
    </Button>
  );
}

// ---- SCRUB BAR --------------------------------------------------------------

type TranscriptViewerScrubBarProps = Omit<
  ComponentPropsWithoutRef<typeof ScrubBarContainer>,
  "duration" | "value" | "onScrub" | "onScrubStart" | "onScrubEnd"
> & {
  showTime?: boolean;
  showTimeLabels?: boolean;
  labelsClassName?: string;
  trackClassName?: string;
  progressClassName?: string;
  thumbClassName?: string;
};

function TranscriptViewerScrubBar({
  className,
  showTime,
  showTimeLabels,
  labelsClassName,
  trackClassName,
  progressClassName,
  thumbClassName,
  ...props
}: TranscriptViewerScrubBarProps) {
  const { duration, currentTime, seekToTime, startScrubbing, endScrubbing } =
    useTranscriptViewerContext();

  const shouldShowTimeLabels = showTimeLabels ?? showTime ?? true;

  return (
    <ScrubBarContainer
      data-slot="transcript-scrub-bar"
      duration={duration}
      value={currentTime}
      onScrubStart={startScrubbing}
      onScrubEnd={endScrubbing}
      onScrub={seekToTime}
      className={className}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-1">
        <ScrubBarTrack className={trackClassName}>
          <ScrubBarProgress className={progressClassName} />
          <ScrubBarThumb className={thumbClassName} />
        </ScrubBarTrack>
        {shouldShowTimeLabels && (
          <div
            className={cn(
              "text-muted-foreground flex items-center justify-between text-xs",
              labelsClassName
            )}
          >
            <ScrubBarTimeLabel time={currentTime} />
            <ScrubBarTimeLabel time={Math.max(0, duration - currentTime)} />
          </div>
        )}
      </div>
    </ScrubBarContainer>
  );
}

// ---- EXPORTS ----------------------------------------------------------------

export {
  TranscriptViewerAudio,
  TranscriptViewerContainer,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerProvider,
  TranscriptViewerScrubBar,
  TranscriptViewerWord,
  TranscriptViewerWords,
  useTranscriptViewerContext,
};
export type { CharacterAlignmentResponseModel };
