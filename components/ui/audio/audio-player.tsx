"use client";

import {
  createContext,
  type HTMLProps,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

enum ReadyState {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4,
}

enum NetworkState {
  NETWORK_EMPTY = 0,
  NETWORK_IDLE = 1,
  NETWORK_LOADING = 2,
  NETWORK_NO_SOURCE = 3,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const formattedMins = mins < 10 ? `0${mins}` : mins;
  const formattedSecs = secs < 10 ? `0${secs}` : secs;
  return hrs > 0
    ? `${hrs}:${formattedMins}:${formattedSecs}`
    : `${mins}:${formattedSecs}`;
}

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function PlayIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function PauseIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AudioPlayerItem<TData = unknown> {
  id: string | number;
  src: string;
  data?: TData;
}

interface AudioPlayerApi<TData = unknown> {
  ref: RefObject<HTMLAudioElement | null>;
  activeItem: AudioPlayerItem<TData> | null;
  duration: number | undefined;
  error: MediaError | null;
  isPlaying: boolean;
  isBuffering: boolean;
  playbackRate: number;
  isItemActive: (id: string | number | null) => boolean;
  setActiveItem: (item: AudioPlayerItem<TData> | null) => Promise<void>;
  play: (item?: AudioPlayerItem<TData> | null) => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AudioPlayerContext = createContext<AudioPlayerApi<unknown> | null>(null);

export function useAudioPlayer<TData = unknown>(): AudioPlayerApi<TData> {
  const api = useContext(AudioPlayerContext) as AudioPlayerApi<TData> | null;
  if (!api) {
    throw new Error(
      "useAudioPlayer cannot be called outside of AudioPlayerProvider"
    );
  }
  return api;
}

const AudioPlayerTimeContext = createContext<number | null>(null);

export const useAudioPlayerTime = () => {
  const time = useContext(AudioPlayerTimeContext);
  if (time === null) {
    throw new Error(
      "useAudioPlayerTime cannot be called outside of AudioPlayerProvider"
    );
  }
  return time;
};

// ---------------------------------------------------------------------------
// useAnimationFrame – drives state polling
// ---------------------------------------------------------------------------

type Callback = (delta: number) => void;

function useAnimationFrame(callback: Callback) {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const callbackRef = useRef<Callback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        const delta = time - previousTimeRef.current;
        callbackRef.current(delta);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = null;
    };
  }, []);
}

// ---------------------------------------------------------------------------
// AudioPlayerProvider
// ---------------------------------------------------------------------------

export function AudioPlayerProvider<TData = unknown>({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const itemRef = useRef<AudioPlayerItem<TData> | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [readyState, setReadyState] = useState<number>(0);
  const [networkState, setNetworkState] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [error, setError] = useState<MediaError | null>(null);
  const [activeItem, _setActiveItem] = useState<AudioPlayerItem<TData> | null>(
    null
  );
  const [paused, setPaused] = useState(true);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);

  const setActiveItem = useCallback(
    async (item: AudioPlayerItem<TData> | null) => {
      if (!audioRef.current) return;
      if (item?.id === itemRef.current?.id) return;
      itemRef.current = item;
      const currentRate = audioRef.current.playbackRate;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (item === null) {
        audioRef.current.removeAttribute("src");
      } else {
        audioRef.current.src = item.src;
      }
      audioRef.current.load();
      audioRef.current.playbackRate = currentRate;
    },
    []
  );

  const play = useCallback(
    async (item?: AudioPlayerItem<TData> | null) => {
      if (!audioRef.current) return;

      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (error) {
          console.error("Play promise error:", error);
        }
      }

      if (item === undefined) {
        const playPromise = audioRef.current.play();
        playPromiseRef.current = playPromise;
        return playPromise;
      }
      if (item?.id === activeItem?.id) {
        const playPromise = audioRef.current.play();
        playPromiseRef.current = playPromise;
        return playPromise;
      }

      itemRef.current = item;
      const currentRate = audioRef.current.playbackRate;
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      audioRef.current.currentTime = 0;
      if (item === null) {
        audioRef.current.removeAttribute("src");
      } else {
        audioRef.current.src = item.src;
      }
      audioRef.current.load();
      audioRef.current.playbackRate = currentRate;
      const playPromise = audioRef.current.play();
      playPromiseRef.current = playPromise;
      return playPromise;
    },
    [activeItem]
  );

  const pause = useCallback(async () => {
    if (!audioRef.current) return;
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch (e) {
        console.error(e);
      }
    }
    audioRef.current.pause();
    playPromiseRef.current = null;
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRateState(rate);
  }, []);

  const isItemActive = useCallback(
    (id: string | number | null) => {
      return activeItem?.id === id;
    },
    [activeItem]
  );

  useAnimationFrame(() => {
    if (audioRef.current) {
      _setActiveItem(itemRef.current);
      setReadyState(audioRef.current.readyState);
      setNetworkState(audioRef.current.networkState);
      setTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      setPaused(audioRef.current.paused);
      setError(audioRef.current.error);
      setPlaybackRateState(audioRef.current.playbackRate);
    }
  });

  const isPlaying = !paused;
  const isBuffering =
    readyState < ReadyState.HAVE_FUTURE_DATA &&
    networkState === NetworkState.NETWORK_LOADING;

  const api = useMemo<AudioPlayerApi<TData>>(
    () => ({
      ref: audioRef,
      duration,
      error,
      isPlaying,
      isBuffering,
      activeItem,
      playbackRate,
      isItemActive,
      setActiveItem,
      play,
      pause,
      seek,
      setPlaybackRate,
    }),
    [
      audioRef,
      duration,
      error,
      isPlaying,
      isBuffering,
      activeItem,
      playbackRate,
      isItemActive,
      setActiveItem,
      play,
      pause,
      seek,
      setPlaybackRate,
    ]
  );

  return (
    <AudioPlayerContext.Provider value={api as AudioPlayerApi<unknown>}>
      <AudioPlayerTimeContext.Provider value={time}>
        <audio ref={audioRef} className="hidden" crossOrigin="anonymous" />
        {children}
      </AudioPlayerTimeContext.Provider>
    </AudioPlayerContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// AudioPlayerProgress – custom slider (no Radix dependency)
// ---------------------------------------------------------------------------

export const AudioPlayerProgress = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const player = useAudioPlayer();
  const time = useAudioPlayerTime();
  const wasPlayingRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const progress =
    player.duration && Number.isFinite(player.duration) && player.duration > 0
      ? (time / player.duration) * 100
      : 0;

  const disabled =
    player.duration === undefined ||
    !Number.isFinite(player.duration) ||
    Number.isNaN(player.duration);

  const seekFromPointer = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el || disabled) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      player.seek(ratio * (player.duration ?? 0));
    },
    [disabled, player]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      wasPlayingRef.current = player.isPlaying;
      player.pause();
      seekFromPointer(e.clientX);

      const onMove = (ev: PointerEvent) => seekFromPointer(ev.clientX);
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        if (wasPlayingRef.current) player.play();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [disabled, player, seekFromPointer]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (!player.isPlaying) player.play();
        else player.pause();
      }
    },
    [player]
  );

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuenow={Math.round(time)}
      aria-valuemin={0}
      aria-valuemax={Math.round(player.duration ?? 0)}
      aria-label="Audio progress"
      tabIndex={disabled ? -1 : 0}
      data-slot="audio-player-progress"
      data-disabled={disabled || undefined}
      className={cn(
        "group/player relative flex h-4 touch-none items-center select-none data-[disabled]:opacity-50",
        className
      )}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div className="bg-muted relative h-[4px] w-full grow overflow-hidden rounded-full">
        <div
          className="bg-primary absolute h-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div
        className="relative flex h-0 w-0 items-center justify-center opacity-0 group-hover/player:opacity-100 focus-visible:opacity-100"
        data-slot="slider-thumb"
        style={{ left: `${progress}%` }}
      >
        <div className="bg-foreground absolute size-3 rounded-full shadow-sm" />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// AudioPlayerTime / AudioPlayerDuration
// ---------------------------------------------------------------------------

export const AudioPlayerTime = ({
  className,
  ...props
}: HTMLProps<HTMLSpanElement>) => {
  const time = useAudioPlayerTime();
  return (
    <span
      data-slot="audio-player-time"
      {...props}
      className={cn("text-muted-foreground/70 text-sm tabular-nums", className)}
    >
      {formatTime(time)}
    </span>
  );
};

export const AudioPlayerDuration = ({
  className,
  ...props
}: HTMLProps<HTMLSpanElement>) => {
  const player = useAudioPlayer();
  return (
    <span
      data-slot="audio-player-duration"
      {...props}
      className={cn("text-muted-foreground/70 text-sm tabular-nums", className)}
    >
      {player.duration !== null &&
      player.duration !== undefined &&
      !Number.isNaN(player.duration)
        ? formatTime(player.duration)
        : "--:--"}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Spinner (internal)
// ---------------------------------------------------------------------------

function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-muted border-t-foreground size-3.5 animate-spin rounded-full border-2",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal PlayButton
// ---------------------------------------------------------------------------

interface InternalPlayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  loading?: boolean;
}

const InternalPlayButton = ({
  playing,
  onPlayingChange,
  className,
  onClick,
  loading,
  ...otherProps
}: InternalPlayButtonProps) => {
  return (
    <button
      {...otherProps}
      type="button"
      onClick={(e) => {
        onPlayingChange(!playing);
        onClick?.(e);
      }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      aria-label={playing ? "Pause" : "Play"}
    >
      {playing ? (
        <PauseIcon
          className={cn("size-4", loading && "opacity-0")}
          aria-hidden="true"
        />
      ) : (
        <PlayIcon
          className={cn("size-4", loading && "opacity-0")}
          aria-hidden="true"
        />
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] backdrop-blur-xs">
          <Spinner />
        </div>
      )}
    </button>
  );
};

// ---------------------------------------------------------------------------
// AudioPlayerButton
// ---------------------------------------------------------------------------

export interface AudioPlayerButtonProps<
  TData = unknown,
> extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  item?: AudioPlayerItem<TData>;
  variant?: string;
  size?: string;
}

export function AudioPlayerButton<TData = unknown>({
  item,
  ...otherProps
}: AudioPlayerButtonProps<TData>) {
  const player = useAudioPlayer<TData>();

  if (!item) {
    return (
      <InternalPlayButton
        {...otherProps}
        playing={player.isPlaying}
        onPlayingChange={(shouldPlay) => {
          if (shouldPlay) player.play();
          else player.pause();
        }}
        loading={player.isBuffering && player.isPlaying}
      />
    );
  }

  return (
    <InternalPlayButton
      {...otherProps}
      playing={player.isItemActive(item.id) && player.isPlaying}
      onPlayingChange={(shouldPlay) => {
        if (shouldPlay) player.play(item);
        else player.pause();
      }}
      loading={
        player.isItemActive(item.id) && player.isBuffering && player.isPlaying
      }
    />
  );
}

// ---------------------------------------------------------------------------
// AudioPlayerSpeed
// ---------------------------------------------------------------------------

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

export interface AudioPlayerSpeedProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  speeds?: readonly number[];
  variant?: string;
  size?: string;
}

export function AudioPlayerSpeed({
  speeds = PLAYBACK_SPEEDS,
  className,
  ...props
}: AudioPlayerSpeedProps) {
  const player = useAudioPlayer();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const label =
    player.playbackRate === 1 ? "Normal" : `${player.playbackRate}x`;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-xs font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className
        )}
        onClick={() => setOpen((v) => !v)}
        aria-label="Playback speed"
        {...props}
      >
        {label}
      </button>
      {open && (
        <div className="bg-popover text-popover-foreground absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 overflow-hidden rounded-md border shadow-md">
          {speeds.map((speed) => (
            <button
              key={speed}
              type="button"
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-accent",
                player.playbackRate === speed && "bg-accent font-semibold"
              )}
              onClick={() => {
                player.setPlaybackRate(speed);
                setOpen(false);
              }}
            >
              {speed === 1 ? "Normal" : `${speed}x`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AudioPlayerSpeedButtonGroup
// ---------------------------------------------------------------------------

export interface AudioPlayerSpeedButtonGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  speeds?: readonly number[];
}

export function AudioPlayerSpeedButtonGroup({
  speeds = [0.5, 1, 1.5, 2],
  className,
  ...props
}: AudioPlayerSpeedButtonGroupProps) {
  const player = useAudioPlayer();
  const currentSpeed = player.playbackRate;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label="Playback speed controls"
      {...props}
    >
      {speeds.map((speed) => (
        <button
          key={speed}
          type="button"
          className={cn(
            "min-w-[50px] rounded-md border px-2 py-1 font-mono text-xs transition-colors",
            currentSpeed === speed
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background hover:bg-accent"
          )}
          onClick={() => player.setPlaybackRate(speed)}
        >
          {speed}x
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example tracks
// ---------------------------------------------------------------------------

export const exampleTracks: AudioPlayerItem<{ name: string }>[] = [
  {
    id: "0",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/00.mp3",
    data: { name: "II - 00" },
  },
  {
    id: "1",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/01.mp3",
    data: { name: "II - 01" },
  },
  {
    id: "2",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/02.mp3",
    data: { name: "II - 02" },
  },
  {
    id: "3",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/03.mp3",
    data: { name: "II - 03" },
  },
  {
    id: "4",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/04.mp3",
    data: { name: "II - 04" },
  },
  {
    id: "5",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/05.mp3",
    data: { name: "II - 05" },
  },
  {
    id: "6",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/06.mp3",
    data: { name: "II - 06" },
  },
  {
    id: "7",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/07.mp3",
    data: { name: "II - 07" },
  },
  {
    id: "8",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/08.mp3",
    data: { name: "II - 08" },
  },
  {
    id: "9",
    src: "https://storage.googleapis.com/eleven-public-cdn/audio/ui-elevenlabs-io/09.mp3",
    data: { name: "II - 09" },
  },
];
