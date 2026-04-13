"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AlignmentCharacter {
  character: string;
  start_time_ms: number;
  end_time_ms: number;
}

/** Subset of the ElevenLabs character-alignment response shape. */
export interface CharacterAlignmentResponseModel {
  alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
  normalized_alignment?: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
}

export interface TranscriptWord {
  kind: "word";
  text: string;
  wordIndex: number;
  startTime: number;
  endTime: number;
}

interface GapSegment {
  kind: "gap";
  startTime: number;
  endTime: number;
}

export type TranscriptSegment = TranscriptWord | GapSegment;

/** User-supplied function to parse custom alignment data into character timings. */
export type SegmentComposer = (
  data: CharacterAlignmentResponseModel
) => AlignmentCharacter[];

// ---------------------------------------------------------------------------
// composeSegments
// ---------------------------------------------------------------------------

function defaultComposer(
  data: CharacterAlignmentResponseModel
): AlignmentCharacter[] {
  const alignment = data.normalized_alignment ?? data.alignment;
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;

  return chars.map((char, i) => ({
    character: char,
    start_time_ms: starts[i] * 1000,
    end_time_ms: ends[i] * 1000,
  }));
}

export function composeSegments(
  data: CharacterAlignmentResponseModel,
  options?: {
    hideAudioTags?: boolean;
    composer?: SegmentComposer;
  }
): { segments: TranscriptSegment[]; words: TranscriptWord[] } {
  const composer = options?.composer ?? defaultComposer;
  const characters = composer(data);

  if (characters.length === 0) {
    return { segments: [], words: [] };
  }

  const segments: TranscriptSegment[] = [];
  const words: TranscriptWord[] = [];

  let currentWord = "";
  let wordStart = 0;
  let wordEnd = 0;
  let wordStarted = false;
  let inAudioTag = false;
  let wordIndex = 0;

  const flushWord = () => {
    if (!wordStarted || currentWord.length === 0) return;

    const trimmed = currentWord.trim();
    if (trimmed.length === 0) {
      wordStarted = false;
      currentWord = "";
      return;
    }

    const word: TranscriptWord = {
      kind: "word",
      text: trimmed,
      wordIndex,
      startTime: wordStart / 1000,
      endTime: wordEnd / 1000,
    };
    segments.push(word);
    words.push(word);
    wordIndex++;
    wordStarted = false;
    currentWord = "";
  };

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];

    // Handle audio tags like [AudioTag]
    if (options?.hideAudioTags && char.character === "[") {
      flushWord();
      inAudioTag = true;
      continue;
    }
    if (inAudioTag) {
      if (char.character === "]") inAudioTag = false;
      continue;
    }

    if (
      char.character === " " ||
      char.character === "\n" ||
      char.character === "\t"
    ) {
      flushWord();

      // Add gap if there's a time gap
      if (segments.length > 0 && i + 1 < characters.length) {
        const nextNonSpace = characters
          .slice(i + 1)
          .find(
            (c) =>
              c.character !== " " &&
              c.character !== "\n" &&
              c.character !== "\t"
          );
        if (
          nextNonSpace &&
          nextNonSpace.start_time_ms - char.end_time_ms > 100
        ) {
          segments.push({
            kind: "gap",
            startTime: char.end_time_ms / 1000,
            endTime: nextNonSpace.start_time_ms / 1000,
          });
        }
      }
    } else {
      if (!wordStarted) {
        wordStart = char.start_time_ms;
        wordStarted = true;
        currentWord = "";
      }
      currentWord += char.character;
      wordEnd = char.end_time_ms;
    }
  }

  flushWord();

  return { segments, words };
}

// ---------------------------------------------------------------------------
// useTranscriptViewer hook
// ---------------------------------------------------------------------------

export interface UseTranscriptViewerProps {
  /** Character alignment data from ElevenLabs API. */
  alignment?: CharacterAlignmentResponseModel;
  /** Raw text to display when no alignment is available. */
  text?: string;
  /** Custom segment composer. */
  composer?: SegmentComposer;
  /** Hide [AudioTag] markers. Default: true */
  hideAudioTags?: boolean;
  /** Called when playback time updates. */
  onTimeUpdate?: (time: number) => void;
}

export interface UseTranscriptViewerResult {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  segments: TranscriptSegment[];
  words: TranscriptWord[];
  currentWordIndex: number;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isScrubbing: boolean;
  play: () => void;
  pause: () => void;
  seekToTime: (time: number) => void;
  seekToWord: (wordIndex: number) => void;
  startScrubbing: () => void;
  endScrubbing: (time?: number) => void;
}

export function useTranscriptViewer(
  props: UseTranscriptViewerProps
): UseTranscriptViewerResult {
  const {
    alignment,
    text,
    composer,
    hideAudioTags = true,
    onTimeUpdate,
  } = props;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const handleTimeUpdateRef = useRef(onTimeUpdate);
  handleTimeUpdateRef.current = onTimeUpdate;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Parse segments & words
  const { segments, words } = useMemo(() => {
    if (alignment) {
      return composeSegments(alignment, { hideAudioTags, composer });
    }

    // Fallback: plain text
    if (text) {
      const textWords = text.split(/\s+/).filter(Boolean);
      const wordSegments: TranscriptWord[] = textWords.map((w, i) => ({
        kind: "word" as const,
        text: w,
        wordIndex: i,
        startTime: 0,
        endTime: 0,
      }));
      return {
        segments: wordSegments as TranscriptSegment[],
        words: wordSegments,
      };
    }

    return { segments: [], words: [] };
  }, [alignment, text, hideAudioTags, composer]);

  // Guess duration from alignment data if audio doesn't report it
  const guessedDuration = useMemo(() => {
    if (words.length === 0) return 0;
    const lastWord = words[words.length - 1];
    return lastWord.endTime;
  }, [words]);

  // Binary search for current word
  const findWordIndex = useCallback(
    (time: number): number => {
      if (words.length === 0) return -1;

      let lo = 0;
      let hi = words.length - 1;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const word = words[mid];

        if (time >= word.startTime && time <= word.endTime) {
          return mid;
        }
        if (time < word.startTime) {
          hi = mid - 1;
        } else {
          lo = mid + 1;
        }
      }

      // If not exactly in a word, find the closest previous word
      if (lo > 0 && lo <= words.length) {
        const prev = words[lo - 1];
        // If we're close to the previous word's end, return it
        if (time - prev.endTime < 0.15) return lo - 1;
      }

      return -1;
    },
    [words]
  );

  const currentWordIndex = useMemo(
    () => findWordIndex(currentTime),
    [findWordIndex, currentTime]
  );

  // rAF loop for time tracking
  const startRaf = useCallback(() => {
    const tick = () => {
      const audio = audioRef.current;
      if (audio && !isScrubbing) {
        const time = audio.currentTime;
        setCurrentTime(time);
        handleTimeUpdateRef.current?.(time);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [isScrubbing]);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== undefined) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      startRaf();
    };
    const handlePause = () => {
      setIsPlaying(false);
      stopRaf();
    };
    const handleEnded = () => {
      setIsPlaying(false);
      stopRaf();
    };
    const handleDurationChange = () => {
      setDuration(audio.duration || guessedDuration);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || guessedDuration);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Set initial duration
    if (audio.duration) setDuration(audio.duration);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      stopRaf();
    };
  }, [startRaf, stopRaf, guessedDuration]);

  const play = useCallback(() => {
    audioRef.current?.play()?.catch(() => {});
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const seekToTime = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
      handleTimeUpdateRef.current?.(time);
    }
  }, []);

  const seekToWord = useCallback(
    (wordIndex: number) => {
      if (wordIndex >= 0 && wordIndex < words.length) {
        seekToTime(words[wordIndex].startTime);
      }
    },
    [words, seekToTime]
  );

  const startScrubbing = useCallback(() => {
    setIsScrubbing(true);
    stopRaf();
  }, [stopRaf]);

  const endScrubbing = useCallback(
    (time?: number) => {
      setIsScrubbing(false);
      if (time !== undefined) {
        seekToTime(time);
      }
      if (isPlaying) {
        startRaf();
      }
    },
    [isPlaying, seekToTime, startRaf]
  );

  return {
    audioRef,
    segments,
    words,
    currentWordIndex,
    currentTime,
    duration: duration || guessedDuration,
    isPlaying,
    isScrubbing,
    play,
    pause,
    seekToTime,
    seekToWord,
    startScrubbing,
    endScrubbing,
  };
}
