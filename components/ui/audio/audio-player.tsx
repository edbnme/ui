"use client";

/**
 * Audio Player
 * @registryDescription Composable audio playback primitives for buttons, progress, duration, and speed controls.
 * @registryCategory audio
 */
import * as React from "react";
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
import { Gear } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
} from "@/components/ui/static/menu";
import { cn } from "@/lib/utils";

// ---- VARIANTS ---------------------------------------------------------------

const audioPlayerButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-xl text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-xl px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
);

export type AudioPlayerButtonVariantProps = VariantProps<
  typeof audioPlayerButtonVariants
>;

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

export interface AudioPlayerApi<TData = unknown> {
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

export interface AudioPlayerProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seek granularity in seconds for keyboard arrow keys. Default: 0.25 */
  step?: number;
  /** Called whenever the user seeks (pointer or keyboard) with the new time. */
  onSeek?: (time: number) => void;
  /** Forces the slider into the disabled state. */
  disabled?: boolean;
}

export const AudioPlayerProgress = ({
  className,
  step = 0.25,
  onSeek,
  disabled: disabledProp,
  ...props
}: AudioPlayerProgressProps) => {
  const player = useAudioPlayer();
  const time = useAudioPlayerTime();
  const wasPlayingRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const duration = player.duration;
  const hasValidDuration =
    duration !== undefined && Number.isFinite(duration) && duration > 0;

  const progress = hasValidDuration ? (time / (duration as number)) * 100 : 0;

  const intrinsicDisabled = !hasValidDuration;
  const disabled = disabledProp ?? intrinsicDisabled;

  const seekTo = useCallback(
    (target: number) => {
      if (!hasValidDuration) return;
      const clamped = Math.max(0, Math.min(duration as number, target));
      player.seek(clamped);
      onSeek?.(clamped);
    },
    [hasValidDuration, duration, player, onSeek]
  );

  const seekFromPointer = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el || disabled || !hasValidDuration) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      seekTo(ratio * (duration as number));
    },
    [disabled, hasValidDuration, duration, seekTo]
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
      if (disabled) return;
      const dur = duration ?? 0;
      const bigStep = Math.max(step, dur * 0.1);
      switch (e.key) {
        case " ": {
          e.preventDefault();
          if (!player.isPlaying) player.play();
          else player.pause();
          break;
        }
        case "ArrowRight":
        case "ArrowUp": {
          e.preventDefault();
          seekTo(time + (e.shiftKey ? bigStep : step));
          break;
        }
        case "ArrowLeft":
        case "ArrowDown": {
          e.preventDefault();
          seekTo(time - (e.shiftKey ? bigStep : step));
          break;
        }
        case "Home": {
          e.preventDefault();
          seekTo(0);
          break;
        }
        case "End": {
          e.preventDefault();
          if (hasValidDuration) seekTo(duration as number);
          break;
        }
        case "PageUp": {
          e.preventDefault();
          seekTo(time + 10);
          break;
        }
        case "PageDown": {
          e.preventDefault();
          seekTo(time - 10);
          break;
        }
      }
    },
    [disabled, duration, hasValidDuration, player, seekTo, step, time]
  );

  const valueText = hasValidDuration
    ? `${formatTime(time)} of ${formatTime(duration as number)}`
    : formatTime(time);

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuenow={Math.round(time)}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration ?? 0)}
      aria-valuetext={valueText}
      aria-label="Audio progress"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      data-slot="audio-player-progress"
      data-disabled={disabled || undefined}
      className={cn(
        "group/player relative flex h-4 touch-none items-center select-none data-disabled:opacity-50",
        className
      )}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div className="bg-muted relative h-1 w-full grow overflow-hidden rounded-full">
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
      className={cn("text-muted-foreground text-sm tabular-nums", className)}
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
      className={cn("text-muted-foreground text-sm tabular-nums", className)}
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

interface InternalPlayButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    AudioPlayerButtonVariantProps {
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
  variant,
  size,
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
      className={cn(audioPlayerButtonVariants({ variant, size }), className)}
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

export interface AudioPlayerButtonProps<TData = unknown>
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    AudioPlayerButtonVariantProps {
  item?: AudioPlayerItem<TData>;
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

export interface AudioPlayerSpeedProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    AudioPlayerButtonVariantProps {
  speeds?: readonly number[];
}

export function AudioPlayerSpeed({
  speeds = PLAYBACK_SPEEDS,
  className,
  variant = "outline",
  size = "icon",
  ...props
}: AudioPlayerSpeedProps) {
  const player = useAudioPlayer();

  return (
    <MenuRoot>
      <MenuTrigger
        type="button"
        aria-label="Playback speed"
        className={cn(audioPlayerButtonVariants({ variant, size }), className)}
        {...props}
      >
        <Gear className="size-4" aria-hidden="true" />
      </MenuTrigger>
      <MenuPortal>
        <MenuPositioner sideOffset={4} align="end">
          <MenuPopup className="min-w-32">
            <MenuRadioGroup
              value={String(player.playbackRate)}
              onValueChange={(value) => player.setPlaybackRate(Number(value))}
            >
              {speeds.map((speed) => (
                <MenuRadioItem key={speed} value={String(speed)}>
                  {speed === 1 ? "Normal" : `${speed}x`}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
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
      {speeds.map((speed) => {
        const isActive = currentSpeed === speed;
        return (
          <button
            key={speed}
            type="button"
            aria-pressed={isActive}
            className={cn(
              audioPlayerButtonVariants({
                variant: isActive ? "default" : "outline",
                size: "sm",
              }),
              "min-w-12.5 font-mono"
            )}
            onClick={() => player.setPlaybackRate(speed)}
          >
            {speed}x
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example tracks
// ---------------------------------------------------------------------------

const embeddedSampleAudioSrc =
  "data:audio/wav;base64,UklGRuQDAABXQVZFZm10IBAAAAABAAEAoA8AAEAfAAACABAAZGF0YcADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACaL6oYaPaN2M3Mjdho9qoYmi+xMG8blfmu2ufMlNZE880VUy6XMRgeyfz03DXNxtQu8NkS3ixLMqMgAABd37XNItMn7dIPOivLMgwjNwPo4WnOrdEz6rwMbCkZM1IlawaR5E/PZtBW55gJcyczM3MnmAlW52bQT8+R5GsGUiUZM2wpvAwz6q3Rac7o4TcDDCPLMjor0g8n7SLTtc1d3wAAoyBLMt4s2RIu8MbUNc303Mn8GB6XMVMuzRVE85TW58yu2pX5bxuxMJovqhho9o3YzcyN2Gj2qhiaL7EwbxuV+a7a58yU1kTzzRVTLpcxGB7J/PTcNc3G1C7w2RLeLEsyoyAAAF3ftc0i0yft0g86K8syDCM3A+jhac6t0TPqvAxsKRkzUiVrBpHkT89m0FbnmAlzJzMzcyeYCVbnZtBPz5HkawZSJRkzbCm8DDPqrdFpzujhNwMMI8syOivSDyftItO1zV3fAACjIEsy3izZEi7wxtQ1zfTcyfwYHpcxUy7NFUTzlNbnzK7alflvG7Ewmi+qGGj2jdjNzI3YaPaqGJovsTBvG5X5rtrnzJTWRPPNFVMulzEYHsn89Nw1zcbULvDZEt4sSzKjIAAAXd+1zSLTJ+3SDzoryzIMIzcD6OFpzq3RM+q8DGwpGTNSJWsGkeRPz2bQVueYCXMnMzNzJ5gJVudm0E/PkeRrBlIlGTNsKbwMM+qt0WnO6OE3AwwjyzI6K9IPJ+0i07XNXd8AAKMgSzLeLNkSLvDG1DXN9NzJ/BgelzFTLs0VRPOU1ufMrtqV+W8bsTCaL6oYaPaN2M3Mjdho9qoYmi+xMG8blfmu2ufMlNZE880VUy6XMRgeyfz03DXNxtQu8NkS3ixLMqMgAABd37XNItMn7dIPOivLMgwjNwPo4WnOrdEz6rwMbCkZM1IlawaR5E/PZtBW55gJcyczM3MnmAlW52bQT8+R5GsGUiUZM2wpvAwz6q3Rac7o4TcDDCPLMjor0g8n7SLTtc1d3wAAoyBLMt4s2RIu8MbUNc303Mn8GB6XMVMuzRVE85TW58yu2pX5bxuxMJovqhho9o3YzcyN2Gj2qhiaL7EwbxuV+a7a58yU1kTzzRVTLpcxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

export const exampleTracks: AudioPlayerItem<{ name: string }>[] = [
  {
    id: "0",
    src: embeddedSampleAudioSrc,
    data: { name: "Sample voice note" },
  },
  {
    id: "1",
    src: embeddedSampleAudioSrc,
    data: { name: "Follow-up clip" },
  },
  {
    id: "2",
    src: embeddedSampleAudioSrc,
    data: { name: "Generated reply" },
  },
  {
    id: "3",
    src: embeddedSampleAudioSrc,
    data: { name: "Review marker" },
  },
  {
    id: "4",
    src: embeddedSampleAudioSrc,
    data: { name: "Short note" },
  },
  {
    id: "5",
    src: embeddedSampleAudioSrc,
    data: { name: "Audio memo" },
  },
  {
    id: "6",
    src: embeddedSampleAudioSrc,
    data: { name: "Voice capture" },
  },
  {
    id: "7",
    src: embeddedSampleAudioSrc,
    data: { name: "Playback sample" },
  },
  {
    id: "8",
    src: embeddedSampleAudioSrc,
    data: { name: "Transcript cue" },
  },
  {
    id: "9",
    src: embeddedSampleAudioSrc,
    data: { name: "Final sample" },
  },
];
