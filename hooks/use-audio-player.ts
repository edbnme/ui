"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";

// =============================================================================
// TYPES
// =============================================================================

interface AudioPlayerState {
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Current playback position in seconds */
  currentTime: number;
  /** Total duration of the audio in seconds */
  duration: number;
  /** Current volume (0-1) */
  volume: number;
  /** Whether audio is muted */
  isMuted: boolean;
  /** Current playback speed */
  playbackRate: number;
  /** Whether audio is buffering */
  isBuffering: boolean;
  /** Whether audio has ended */
  hasEnded: boolean;
  /** Error message if any */
  error: string | null;
}

interface AudioPlayerActions {
  /** Play the audio */
  play: () => void;
  /** Pause the audio */
  pause: () => void;
  /** Toggle play/pause */
  toggle: () => void;
  /** Seek to a specific time in seconds */
  seek: (time: number) => void;
  /** Set the volume (0-1) */
  setVolume: (volume: number) => void;
  /** Toggle mute */
  toggleMute: () => void;
  /** Set playback speed */
  setPlaybackRate: (rate: number) => void;
  /** Load a new audio source */
  load: (src: string) => void;
}

interface UseAudioPlayerOptions {
  /** Audio source URL */
  src?: string;
  /** Initial volume (0-1) */
  initialVolume?: number;
  /** Initial playback rate */
  initialPlaybackRate?: number;
  /** Whether to autoplay */
  autoplay?: boolean;
  /** Called when playback ends */
  onEnded?: () => void;
  /** Called when time updates */
  onTimeUpdate?: (time: number) => void;
  /** Called on error */
  onError?: (error: string) => void;
}

type UseAudioPlayerReturn = AudioPlayerState &
  AudioPlayerActions & {
    /** Reference to the underlying HTMLAudioElement */
    audioRef: React.RefObject<HTMLAudioElement | null>;
  };

// =============================================================================
// HOOK
// =============================================================================

export function useAudioPlayer(
  options: UseAudioPlayerOptions = {}
): UseAudioPlayerReturn {
  const {
    src,
    initialVolume = 1,
    initialPlaybackRate = 1,
    autoplay = false,
    onEnded,
    onTimeUpdate,
    onError,
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(initialPlaybackRate);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = initialVolume;
    audio.playbackRate = initialPlaybackRate;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handleDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setHasEnded(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
      onEnded?.();
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    const handleError = () => {
      const msg = audio.error?.message || "Failed to load audio";
      setError(msg);
      setIsPlaying(false);
      onError?.(msg);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [onEnded, onTimeUpdate, onError]);

  // Load source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    setError(null);
    setHasEnded(false);
    setCurrentTime(0);
    setDuration(0);
    audio.src = src;
    audio.load();

    if (autoplay) {
      audio.play().catch(() => {
        // Autoplay may be blocked by browser policy
      });
    }
  }, [src, autoplay]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {
      // Playback may be blocked by browser policy
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(time, audio.duration || 0));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, vol));
    audio.volume = clamped;
    setVolumeState(clamped);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlaybackRateState(rate);
  }, []);

  const load = useCallback((newSrc: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    setHasEnded(false);
    setCurrentTime(0);
    setDuration(0);
    audio.src = newSrc;
    audio.load();
  }, []);

  return useMemo(
    () => ({
      // State
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playbackRate,
      isBuffering,
      hasEnded,
      error,
      // Actions
      play,
      pause,
      toggle,
      seek,
      setVolume,
      toggleMute,
      setPlaybackRate,
      load,
      // Ref
      audioRef,
    }),
    [
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playbackRate,
      isBuffering,
      hasEnded,
      error,
      play,
      pause,
      toggle,
      seek,
      setVolume,
      toggleMute,
      setPlaybackRate,
      load,
    ]
  );
}

export type {
  UseAudioPlayerOptions,
  UseAudioPlayerReturn,
  AudioPlayerState,
  AudioPlayerActions,
};
