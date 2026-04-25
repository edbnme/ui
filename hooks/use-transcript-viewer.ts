"use client";

/**
 * useTranscriptViewer
 * @registryDescription Hook for transcript playback, word timing, scrubbing, and current-word tracking.
 * @registryVariant audio
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

// ---- TYPES -----------------------------------------------------------------

type AlignmentPayload = {
  characters?: string[];
  characterStartTimesSeconds?: number[];
  characterEndTimesSeconds?: number[];
  character_start_times_seconds?: number[];
  character_end_times_seconds?: number[];
};

type AlignmentCharacter = {
  character: string;
  startTimeMs: number;
  endTimeMs: number;
};

/** Supports both the repo's nested alignment shape and the upstream top-level shape. */
export interface CharacterAlignmentResponseModel extends AlignmentPayload {
  alignment?: AlignmentPayload;
  normalized_alignment?: AlignmentPayload;
  normalizedAlignment?: AlignmentPayload;
}

export type ComposeSegmentsOptions = {
  hideAudioTags?: boolean;
};

type BaseSegment = {
  segmentIndex: number;
  text: string;
};

export type TranscriptWord = BaseSegment & {
  kind: "word";
  wordIndex: number;
  startTime: number;
  endTime: number;
};

export type TranscriptGap = BaseSegment & {
  kind: "gap";
};

export type TranscriptSegment = TranscriptWord | TranscriptGap;

export type ComposeSegmentsResult = {
  segments: TranscriptSegment[];
  words: TranscriptWord[];
};

export type SegmentComposer = (
  alignment: CharacterAlignmentResponseModel
) => ComposeSegmentsResult;

type CharacterComposer = (
  alignment: CharacterAlignmentResponseModel
) => AlignmentCharacter[];

// ---- HELPERS ---------------------------------------------------------------

function getAlignmentSource(
  alignment: CharacterAlignmentResponseModel | undefined
): AlignmentPayload | undefined {
  return (
    alignment?.normalizedAlignment ??
    alignment?.normalized_alignment ??
    alignment?.alignment ??
    alignment
  );
}

function toAlignmentCharacters(
  alignment: CharacterAlignmentResponseModel,
  composer?: CharacterComposer
): AlignmentCharacter[] {
  if (composer) {
    return composer(alignment);
  }

  const source = getAlignmentSource(alignment);
  const characters = source?.characters ?? [];
  const starts =
    source?.characterStartTimesSeconds ??
    source?.character_start_times_seconds ??
    [];
  const ends =
    source?.characterEndTimesSeconds ??
    source?.character_end_times_seconds ??
    [];

  return characters.map((character, index) => ({
    character,
    startTimeMs: (starts[index] ?? 0) * 1000,
    endTimeMs: (ends[index] ?? starts[index] ?? 0) * 1000,
  }));
}

function composeTextSegments(text: string): ComposeSegmentsResult {
  const segments: TranscriptSegment[] = [];
  const words: TranscriptWord[] = [];
  const tokens = text.match(/\S+|\s+/g) ?? [];

  let segmentIndex = 0;
  let wordIndex = 0;

  for (const token of tokens) {
    if (/\s+/.test(token)) {
      segments.push({
        kind: "gap",
        segmentIndex: segmentIndex++,
        text: token,
      });
      continue;
    }

    const word: TranscriptWord = {
      kind: "word",
      segmentIndex: segmentIndex++,
      wordIndex: wordIndex++,
      text: token,
      startTime: 0,
      endTime: 0,
    };

    segments.push(word);
    words.push(word);
  }

  return { segments, words };
}

// ---- SEGMENT COMPOSITION ---------------------------------------------------

export function composeSegments(
  alignment: CharacterAlignmentResponseModel,
  options: ComposeSegmentsOptions & { composer?: CharacterComposer } = {}
): ComposeSegmentsResult {
  const characters = toAlignmentCharacters(alignment, options.composer);

  if (characters.length === 0) {
    return { segments: [], words: [] };
  }

  const segments: TranscriptSegment[] = [];
  const words: TranscriptWord[] = [];

  let wordBuffer = "";
  let whitespaceBuffer = "";
  let wordStart = 0;
  let wordEnd = 0;
  let segmentIndex = 0;
  let wordIndex = 0;
  let insideAudioTag = false;

  const hideAudioTags = options.hideAudioTags ?? false;

  const flushWhitespace = () => {
    if (!whitespaceBuffer) {
      return;
    }

    segments.push({
      kind: "gap",
      segmentIndex: segmentIndex++,
      text: whitespaceBuffer,
    });
    whitespaceBuffer = "";
  };

  const flushWord = () => {
    if (!wordBuffer) {
      return;
    }

    const word: TranscriptWord = {
      kind: "word",
      segmentIndex: segmentIndex++,
      wordIndex: wordIndex++,
      text: wordBuffer,
      startTime: wordStart / 1000,
      endTime: wordEnd / 1000,
    };

    segments.push(word);
    words.push(word);
    wordBuffer = "";
  };

  for (const character of characters) {
    if (hideAudioTags) {
      if (character.character === "[") {
        flushWord();
        whitespaceBuffer = "";
        insideAudioTag = true;
        continue;
      }

      if (insideAudioTag) {
        if (character.character === "]") {
          insideAudioTag = false;
        }
        continue;
      }
    }

    if (/\s/.test(character.character)) {
      flushWord();
      whitespaceBuffer += character.character;
      continue;
    }

    if (whitespaceBuffer) {
      flushWhitespace();
    }

    if (!wordBuffer) {
      wordBuffer = character.character;
      wordStart = character.startTimeMs;
      wordEnd = character.endTimeMs;
      continue;
    }

    wordBuffer += character.character;
    wordEnd = character.endTimeMs;
  }

  flushWord();
  flushWhitespace();

  return { segments, words };
}

// ---- HOOK ------------------------------------------------------------------

export interface UseTranscriptViewerProps {
  alignment?: CharacterAlignmentResponseModel;
  text?: string;
  segmentComposer?: SegmentComposer;
  composer?: CharacterComposer;
  hideAudioTags?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
  onDurationChange?: (duration: number) => void;
}

export interface UseTranscriptViewerResult {
  segments: TranscriptSegment[];
  words: TranscriptWord[];
  spokenSegments: TranscriptSegment[];
  unspokenSegments: TranscriptSegment[];
  currentWord: TranscriptWord | null;
  currentSegmentIndex: number;
  currentWordIndex: number;
  seekToTime: (time: number) => void;
  seekToWord: (word: number | TranscriptWord) => void;
  audioRef: RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  isScrubbing: boolean;
  duration: number;
  currentTime: number;
  play: () => void;
  pause: () => void;
  startScrubbing: () => void;
  endScrubbing: (time?: number) => void;
}

export function useTranscriptViewer({
  alignment,
  text,
  segmentComposer,
  composer,
  hideAudioTags = true,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onDurationChange,
}: UseTranscriptViewerProps): UseTranscriptViewerResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const handleTimeUpdateRef = useRef<(time: number) => void>(() => {});
  const onDurationChangeRef = useRef<(duration: number) => void>(() => {});

  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { segments, words } = useMemo(() => {
    if (alignment && segmentComposer) {
      return segmentComposer(alignment);
    }

    if (alignment) {
      return composeSegments(alignment, { hideAudioTags, composer });
    }

    if (text) {
      return composeTextSegments(text);
    }

    return { segments: [], words: [] };
  }, [alignment, segmentComposer, hideAudioTags, composer, text]);

  const guessedDuration = useMemo(() => {
    const source = getAlignmentSource(alignment);
    const ends =
      source?.characterEndTimesSeconds ?? source?.character_end_times_seconds;

    if (Array.isArray(ends) && ends.length > 0) {
      const last = ends[ends.length - 1];
      return Number.isFinite(last) ? last : 0;
    }

    if (words.length > 0) {
      const lastWord = words[words.length - 1];
      return Number.isFinite(lastWord.endTime) ? lastWord.endTime : 0;
    }

    return 0;
  }, [alignment, words]);

  const [currentWordIndex, setCurrentWordIndex] = useState<number>(() =>
    words.length > 0 ? 0 : -1
  );

  const findWordIndex = useCallback(
    (time: number) => {
      if (words.length === 0) {
        return -1;
      }

      let low = 0;
      let high = words.length - 1;
      let answer = -1;

      while (low <= high) {
        const middle = Math.floor((low + high) / 2);
        const word = words[middle];

        if (time >= word.startTime && time < word.endTime) {
          answer = middle;
          break;
        }

        if (time < word.startTime) {
          high = middle - 1;
        } else {
          low = middle + 1;
        }
      }

      return answer;
    },
    [words]
  );

  const handleWordTracking = useCallback(
    (nextTime: number) => {
      if (words.length === 0) {
        setCurrentWordIndex(-1);
        return;
      }

      const activeWord =
        currentWordIndex >= 0 && currentWordIndex < words.length
          ? words[currentWordIndex]
          : undefined;

      if (!activeWord) {
        const found = findWordIndex(nextTime);
        if (found !== -1) {
          setCurrentWordIndex(found);
        }
        return;
      }

      let nextIndex = currentWordIndex;

      if (
        nextTime >= activeWord.endTime &&
        currentWordIndex + 1 < words.length
      ) {
        while (
          nextIndex + 1 < words.length &&
          nextTime >= words[nextIndex + 1].startTime
        ) {
          nextIndex += 1;
        }

        if (nextTime < words[nextIndex].endTime) {
          setCurrentWordIndex(nextIndex);
          return;
        }

        setCurrentWordIndex(nextIndex);
        return;
      }

      if (nextTime < activeWord.startTime) {
        const found = findWordIndex(nextTime);
        if (found !== -1) {
          setCurrentWordIndex(found);
        }
        return;
      }

      const found = findWordIndex(nextTime);
      if (found !== -1 && found !== currentWordIndex) {
        setCurrentWordIndex(found);
      }
    },
    [currentWordIndex, findWordIndex, words]
  );

  useEffect(() => {
    handleTimeUpdateRef.current = (time) => {
      handleWordTracking(time);
      onTimeUpdate?.(time);
    };
  }, [handleWordTracking, onTimeUpdate]);

  useEffect(() => {
    onDurationChangeRef.current = onDurationChange ?? (() => {});
  }, [onDurationChange]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(guessedDuration);
    setIsPlaying(false);
    setIsScrubbing(false);
    setCurrentWordIndex(words.length > 0 ? 0 : -1);
  }, [alignment, text, guessedDuration, words.length]);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startRaf = useCallback(() => {
    if (rafRef.current !== null) {
      return;
    }

    const tick = () => {
      const node = audioRef.current;
      if (!node) {
        rafRef.current = null;
        return;
      }

      const nextTime = node.currentTime;
      setCurrentTime(nextTime);
      handleTimeUpdateRef.current(nextTime);

      if (Number.isFinite(node.duration) && node.duration > 0) {
        setDuration((previousDuration) => {
          if (!previousDuration) {
            onDurationChangeRef.current(node.duration);
            return node.duration;
          }
          return previousDuration;
        });
      }

      if (node.paused) {
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const syncPlayback = () => {
      setIsPlaying(!audio.paused);
    };

    const syncTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const syncDuration = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const handlePlay = () => {
      syncPlayback();
      startRaf();
      onPlay?.();
    };

    const handlePause = () => {
      syncPlayback();
      syncTime();
      stopRaf();
      onPause?.();
    };

    const handleEnded = () => {
      syncPlayback();
      syncTime();
      stopRaf();
      onEnded?.();
    };

    const handleTimeUpdateEvent = () => {
      syncTime();
      handleTimeUpdateRef.current(audio.currentTime);
    };

    const handleSeeked = () => {
      syncTime();
      handleTimeUpdateRef.current(audio.currentTime);
    };

    const handleDuration = () => {
      syncDuration();
      onDurationChange?.(audio.duration);
    };

    syncPlayback();
    syncTime();
    syncDuration();

    if (!audio.paused) {
      startRaf();
    } else {
      stopRaf();
    }

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdateEvent);
    audio.addEventListener("seeked", handleSeeked);
    audio.addEventListener("durationchange", handleDuration);
    audio.addEventListener("loadedmetadata", handleDuration);

    return () => {
      stopRaf();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdateEvent);
      audio.removeEventListener("seeked", handleSeeked);
      audio.removeEventListener("durationchange", handleDuration);
      audio.removeEventListener("loadedmetadata", handleDuration);
    };
  }, [onDurationChange, onEnded, onPause, onPlay, startRaf, stopRaf]);

  const seekToTime = useCallback((time: number) => {
    const node = audioRef.current;
    if (!node) {
      return;
    }

    setCurrentTime(time);
    node.currentTime = time;
    handleTimeUpdateRef.current(time);
  }, []);

  const seekToWord = useCallback(
    (word: number | TranscriptWord) => {
      const target = typeof word === "number" ? words[word] : word;
      if (!target) {
        return;
      }

      seekToTime(target.startTime);
    },
    [seekToTime, words]
  );

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      void audio.play();
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
    }
  }, []);

  const startScrubbing = useCallback(() => {
    setIsScrubbing(true);
    stopRaf();
  }, [stopRaf]);

  const endScrubbing = useCallback(
    (time?: number) => {
      if (typeof time === "number") {
        seekToTime(time);
      }

      setIsScrubbing(false);

      const node = audioRef.current;
      if (node && !node.paused) {
        startRaf();
      }
    },
    [seekToTime, startRaf]
  );

  const currentWord =
    currentWordIndex >= 0 && currentWordIndex < words.length
      ? words[currentWordIndex]
      : null;

  const currentSegmentIndex = currentWord?.segmentIndex ?? -1;

  const spokenSegments = useMemo(() => {
    if (segments.length === 0 || currentSegmentIndex <= 0) {
      return [];
    }

    return segments.slice(0, currentSegmentIndex);
  }, [segments, currentSegmentIndex]);

  const unspokenSegments = useMemo(() => {
    if (segments.length === 0) {
      return [];
    }

    if (currentSegmentIndex === -1) {
      return segments;
    }

    if (currentSegmentIndex + 1 >= segments.length) {
      return [];
    }

    return segments.slice(currentSegmentIndex + 1);
  }, [segments, currentSegmentIndex]);

  return {
    segments,
    words,
    spokenSegments,
    unspokenSegments,
    currentWord,
    currentSegmentIndex,
    currentWordIndex,
    seekToTime,
    seekToWord,
    audioRef,
    isPlaying,
    isScrubbing,
    duration: duration || guessedDuration,
    currentTime,
    play,
    pause,
    startScrubbing,
    endScrubbing,
  };
}
