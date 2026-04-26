"use client";

/**
 * Waveform
 * @registryDescription Static, scrolling, microphone, recording, and scrubber waveform primitives for audio timelines.
 * @registryCategory audio
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LiveWaveform, type LiveWaveformProps } from "./live-waveform";

// ---- TYPES -----------------------------------------------------------------

interface WaveformProps
  extends React.ComponentProps<"div">, VariantProps<typeof waveformVariants> {
  /** Audio waveform data as Float32Array (-1 to 1) or number[] */
  data: Float32Array | number[];
  /** Number of bars to render. Data will be downsampled. Default: 100 */
  bars?: number;
  /** Current playback progress (0-1). Bars before this point are highlighted. */
  progress?: number;
  /** Color of played bars. Default: primary */
  playedColor?: string;
  /** Color of unplayed bars. Default: muted-foreground/30 */
  unplayedColor?: string;
  /** Gap between bars in pixels. Default: 1 */
  gap?: number;
  /** Upstream alias for gap between bars in pixels. */
  barGap?: number;
  /** Width of each bar in pixels. */
  barWidth?: number;
  /** Minimum height of each bar in pixels. */
  barHeight?: number;
  /** Shared bar color when played/unplayed colors are not set. */
  barColor?: string;
  /** Border radius of each bar. Default: 1 */
  barRadius?: number;
  /** Fade the waveform edges for a softer look. */
  fadeEdges?: boolean;
  /** Width of the edge fade in pixels. */
  fadeWidth?: number;
  /** Height of the waveform container. */
  height?: number | string;
  /** Called when user clicks a position on the waveform (0-1) */
  onSeek?: (position: number) => void;
}

export type ScrollingWaveformProps = Omit<WaveformProps, "data" | "onSeek"> & {
  speed?: number;
  barCount?: number;
  data?: number[];
};

export type AudioScrubberProps = Omit<WaveformProps, "progress" | "onSeek"> & {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  showHandle?: boolean;
};

export type StaticWaveformProps = Omit<WaveformProps, "data"> & {
  bars?: number;
  seed?: number;
};

export type MicrophoneWaveformProps = Omit<LiveWaveformProps, "mode">;

export type LiveMicrophoneWaveformProps = Omit<
  LiveWaveformProps,
  "mode" | "historySize" | "updateRate"
> & {
  historySize?: number;
  updateRate?: number;
  savedHistoryRef?: React.MutableRefObject<number[]>;
  dragOffset?: number;
  setDragOffset?: (offset: number) => void;
  enableAudioPlayback?: boolean;
  playbackRate?: number;
};

export type RecordingWaveformProps = Omit<
  WaveformProps,
  "data" | "progress" | "onSeek"
> & {
  recording?: boolean;
  fftSize?: number;
  smoothingTimeConstant?: number;
  sensitivity?: number;
  onError?: (error: Error) => void;
  onRecordingComplete?: (data: number[]) => void;
  updateRate?: number;
  showHandle?: boolean;
  deviceId?: string;
};

// ---- VARIANTS --------------------------------------------------------------

const waveformBaseClass = "flex w-full items-end overflow-hidden";

const waveformVariants = cva(waveformBaseClass, {
  variants: {
    size: {
      sm: "h-8",
      md: "h-16",
      lg: "h-24",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ---- HELPERS ---------------------------------------------------------------

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function resolveHeight(height?: number | string, size?: WaveformProps["size"]) {
  if (typeof height === "number") {
    return {
      className: undefined,
      style: { height: `${height}px` } satisfies React.CSSProperties,
    };
  }

  if (typeof height === "string") {
    const isCssValue = /\d/.test(height) || height.includes("var(");
    if (isCssValue) {
      return {
        className: undefined,
        style: { height } satisfies React.CSSProperties,
      };
    }

    return {
      className: height,
      style: undefined,
    };
  }

  return {
    className: waveformVariants({ size }),
    style: undefined,
  };
}

function createSeededBars(count: number, seed: number) {
  return Array.from({ length: count }, (_, index) => {
    const value = Math.sin(seed + index * 17.133) * 10000;
    return 0.2 + (value - Math.floor(value)) * 0.6;
  });
}

function edgeMask(fadeWidth: number) {
  return `linear-gradient(to right, transparent 0, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)`;
}

function getAudioContextClass() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ||
    null
  );
}

function getMicrophoneConstraints(deviceId?: string) {
  if (deviceId) {
    return {
      deviceId: { exact: deviceId },
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    } satisfies MediaTrackConstraints;
  }

  return {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  } satisfies MediaTrackConstraints;
}

function averageAmplitude(data: Uint8Array, sensitivity: number) {
  if (data.length === 0) {
    return 0;
  }

  const average = data.reduce((sum, value) => sum + value, 0) / data.length;
  return clamp((average / 255) * sensitivity, 0, 1);
}

/**
 * Downsample audio data to target bar count by averaging chunks.
 * @registryCategory audio
 */
function downsample(
  data: Float32Array | number[],
  targetBars: number
): number[] {
  const length = data.length;
  if (length === 0) {
    return new Array(targetBars).fill(0);
  }

  const chunkSize = Math.max(1, Math.floor(length / targetBars));
  const result: number[] = [];

  for (let index = 0; index < targetBars; index += 1) {
    const start = index * chunkSize;
    const end = Math.min(start + chunkSize, length);
    let sum = 0;

    for (let cursor = start; cursor < end; cursor += 1) {
      sum += Math.abs(data[cursor]);
    }

    result.push(sum / Math.max(end - start, 1));
  }

  const max = Math.max(...result, 0.001);
  return result.map((value) => value / max);
}

// ---- SHARED MICROPHONE HISTORY ---------------------------------------------

type MicrophoneHistoryOptions = {
  active: boolean;
  deviceId?: string;
  fftSize: number;
  smoothingTimeConstant: number;
  sensitivity: number;
  historySize: number;
  updateRate: number;
  onError?: (error: Error) => void;
  onStop?: (history: number[]) => void;
  captureAudio?: boolean;
  savedHistoryRef?: React.MutableRefObject<number[]>;
};

function useMicrophoneHistory({
  active,
  deviceId,
  fftSize,
  smoothingTimeConstant,
  sensitivity,
  historySize,
  updateRate,
  onError,
  onStop,
  captureAudio = false,
  savedHistoryRef,
}: MicrophoneHistoryOptions) {
  // eslint-disable-next-line react-hooks/refs
  const initialSavedHistory = savedHistoryRef?.current ?? [];
  const internalHistoryRef = React.useRef<number[]>(initialSavedHistory);
  const historyRef = savedHistoryRef ?? internalHistoryRef;
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const previousUrlRef = React.useRef<string | null>(null);

  /* eslint-disable react-hooks/refs -- Seed state from persisted waveform history. */
  const [history, setHistory] = React.useState<number[]>(
    () => historyRef.current
  );
  /* eslint-enable react-hooks/refs */
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const setSharedHistory = React.useCallback(
    (nextHistory: number[]) => {
      historyRef.current = nextHistory;
      setHistory(nextHistory);
    },
    [historyRef]
  );

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const syncTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const syncDuration = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.playbackRate = 1;
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
    };
  }, [audioUrl]);

  React.useEffect(() => {
    if (!active) {
      return;
    }

    let cancelled = false;
    let animationId = 0;
    let lastUpdate = 0;
    let stream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    let audioContext: AudioContext | null = null;

    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass || !navigator.mediaDevices?.getUserMedia) {
      onError?.(new Error("Audio input is not supported in this environment."));
      return;
    }

    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
      setAudioUrl(null);
    }

    chunksRef.current = [];
    setSharedHistory([]);
    setCurrentTime(0);
    setDuration(0);

    const setup = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: getMicrophoneConstraints(deviceId),
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        audioContext = new AudioContextClass();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = smoothingTimeConstant;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        if (captureAudio && typeof MediaRecorder !== "undefined") {
          recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunksRef.current.push(event.data);
            }
          };
          recorder.onstop = () => {
            if (cancelled || chunksRef.current.length === 0) {
              return;
            }

            const blob = new Blob(chunksRef.current, {
              type: chunksRef.current[0]?.type || "audio/webm",
            });
            const nextUrl = URL.createObjectURL(blob);

            if (previousUrlRef.current) {
              URL.revokeObjectURL(previousUrlRef.current);
            }

            previousUrlRef.current = nextUrl;
            setAudioUrl(nextUrl);
          };
          recorder.start(100);
        }

        const tick = (timestamp: number) => {
          if (cancelled) {
            return;
          }

          if (timestamp - lastUpdate < updateRate) {
            animationId = requestAnimationFrame(tick);
            return;
          }

          analyser.getByteFrequencyData(data);
          const amplitude = averageAmplitude(data, sensitivity);
          const nextHistory = [
            ...historyRef.current.slice(-(historySize - 1)),
            amplitude,
          ];

          setSharedHistory(nextHistory);
          lastUpdate = timestamp;
          animationId = requestAnimationFrame(tick);
        };

        animationId = requestAnimationFrame(tick);
      } catch (error) {
        onError?.(error as Error);
      }
    };

    void setup();

    return () => {
      cancelled = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (audioContext && audioContext.state !== "closed") {
        void audioContext.close();
      }
      onStop?.(historyRef.current);
    };
  }, [
    active,
    captureAudio,
    deviceId,
    fftSize,
    historySize,
    onError,
    onStop,
    sensitivity,
    setSharedHistory,
    smoothingTimeConstant,
    updateRate,
    historyRef,
  ]);

  React.useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const estimatedDuration = duration || history.length * (updateRate / 1000);

  return {
    audioRef,
    audioUrl,
    currentTime,
    duration: estimatedDuration,
    history,
    setCurrentTime,
    setDuration,
  };
}

// ---- COMPONENTS ------------------------------------------------------------

function Waveform({
  data,
  bars,
  progress = 0,
  playedColor,
  unplayedColor,
  gap = 1,
  barGap,
  barWidth,
  barHeight,
  barColor,
  barRadius = 1,
  fadeEdges = false,
  fadeWidth = 24,
  height,
  onSeek,
  size,
  className,
  role,
  "aria-label": ariaLabel,
  onKeyDown,
  style,
  ...props
}: WaveformProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const targetBars = bars ?? Math.max(data.length, 1);
  const barData = React.useMemo(
    () => downsample(data, targetBars),
    [data, targetBars]
  );

  const { className: heightClassName, style: heightStyle } = resolveHeight(
    height,
    size
  );

  const actualGap = barGap ?? gap;
  const progressIndex = Math.floor(clamp(progress, 0, 1) * barData.length);

  const handleSeek = React.useCallback(
    (clientX: number) => {
      if (!onSeek || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const nextPosition = clamp((clientX - rect.left) / rect.width, 0, 1);
      onSeek(nextPosition);
    },
    [onSeek]
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      handleSeek(event.clientX);
    },
    [handleSeek]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onSeek) {
        onKeyDown?.(event);
        return;
      }

      const step = 0.05;
      const keyboardMap: Record<string, number> = {
        ArrowLeft: clamp(progress - step, 0, 1),
        ArrowDown: clamp(progress - step, 0, 1),
        ArrowRight: clamp(progress + step, 0, 1),
        ArrowUp: clamp(progress + step, 0, 1),
        Home: 0,
        End: 1,
      };

      if (!(event.key in keyboardMap)) {
        onKeyDown?.(event);
        return;
      }

      event.preventDefault();
      onSeek(keyboardMap[event.key]);
      onKeyDown?.(event);
    },
    [onKeyDown, onSeek, progress]
  );

  const maskImage = fadeEdges ? edgeMask(fadeWidth) : undefined;
  const defaultPlayedColor = barColor || playedColor || "var(--color-primary)";
  const defaultUnplayedColor =
    unplayedColor || barColor || "var(--color-muted-foreground)";

  return (
    <div
      ref={containerRef}
      data-slot="waveform"
      className={cn(
        height ? waveformBaseClass : waveformVariants({ size }),
        heightClassName,
        onSeek && "cursor-pointer",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={role ?? (onSeek ? "slider" : "img")}
      aria-label={ariaLabel ?? "Audio waveform"}
      aria-valuenow={
        onSeek ? Math.round(clamp(progress, 0, 1) * 100) : undefined
      }
      aria-valuemin={onSeek ? 0 : undefined}
      aria-valuemax={onSeek ? 100 : undefined}
      tabIndex={onSeek ? 0 : props.tabIndex}
      style={{
        ...heightStyle,
        ...style,
        maskImage,
        WebkitMaskImage: maskImage,
      }}
      {...props}
    >
      {barData.map((value, index) => {
        const isPlayed = index < progressIndex;
        return (
          <div
            key={index}
            data-slot="waveform-bar"
            className="shrink-0 transition-colors duration-150"
            style={{
              width: barWidth ?? undefined,
              flex: barWidth ? undefined : 1,
              minWidth: barWidth ? undefined : 1,
              minHeight: barHeight,
              height: `${Math.max(0.05, value) * 100}%`,
              backgroundColor: isPlayed
                ? defaultPlayedColor
                : defaultUnplayedColor,
              opacity: isPlayed ? 1 : barColor ? 0.35 : 0.3,
              borderRadius: barRadius,
              marginLeft: index > 0 ? actualGap : 0,
            }}
          />
        );
      })}
    </div>
  );
}

function ScrollingWaveform({
  speed = 50,
  barCount = 60,
  barWidth = 4,
  barHeight = 4,
  barGap = 2,
  fadeEdges = true,
  data,
  ...props
}: ScrollingWaveformProps) {
  const [bars, setBars] = React.useState<number[]>(() =>
    data?.length ? downsample(data, barCount) : createSeededBars(barCount, 42)
  );

  React.useEffect(() => {
    if (data?.length) {
      setBars(downsample(data, barCount));
      return;
    }

    setBars(createSeededBars(barCount, 42));
  }, [barCount, data]);

  React.useEffect(() => {
    if (data?.length || speed <= 0) {
      return;
    }

    let frame = 0;
    let lastTick = 0;

    const animate = (timestamp: number) => {
      if (!lastTick || timestamp - lastTick >= speed) {
        lastTick = timestamp;
        setBars((current) => [...current.slice(1), 0.2 + Math.random() * 0.6]);
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [barCount, data, speed]);

  return (
    <Waveform
      data={bars}
      bars={barCount}
      barWidth={barWidth}
      barHeight={barHeight}
      barGap={barGap}
      fadeEdges={fadeEdges}
      {...props}
    />
  );
}

function AudioScrubber({
  data,
  currentTime = 0,
  duration = 100,
  onSeek,
  showHandle = true,
  className,
  ...props
}: AudioScrubberProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [localProgress, setLocalProgress] = React.useState(() =>
    duration > 0 ? currentTime / duration : 0
  );

  React.useEffect(() => {
    if (!isDragging && duration > 0) {
      setLocalProgress(currentTime / duration);
    }
  }, [currentTime, duration, isDragging]);

  const handleScrub = React.useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const progress = rect.width === 0 ? 0 : x / rect.width;
      setLocalProgress(progress);
      onSeek?.(progress * duration);
    },
    [duration, onSeek]
  );

  React.useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      handleScrub(event.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleScrub, isDragging]);

  return (
    <div
      ref={containerRef}
      data-slot="audio-scrubber"
      role="slider"
      tabIndex={0}
      aria-label="Audio waveform scrubber"
      aria-valuenow={currentTime}
      aria-valuemin={0}
      aria-valuemax={duration}
      className={cn("relative cursor-pointer select-none", className)}
      onMouseDown={(event) => {
        event.preventDefault();
        setIsDragging(true);
        handleScrub(event.clientX);
      }}
      onKeyDown={(event) => {
        const step = duration / 20 || 1;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onSeek?.(clamp(currentTime - step, 0, duration));
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          onSeek?.(clamp(currentTime + step, 0, duration));
        }
        if (event.key === "Home") {
          event.preventDefault();
          onSeek?.(0);
        }
        if (event.key === "End") {
          event.preventDefault();
          onSeek?.(duration);
        }
      }}
    >
      <Waveform
        data={data}
        progress={localProgress}
        role="presentation"
        aria-label={undefined}
        {...props}
      />
      {showHandle && (
        <div
          data-slot="audio-scrubber-handle"
          className="bg-primary absolute top-1/2 h-full w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${localProgress * 100}%` }}
        />
      )}
    </div>
  );
}

function MicrophoneWaveform(props: MicrophoneWaveformProps) {
  return <LiveWaveform mode="static" {...props} />;
}

function StaticWaveform({
  bars = 40,
  seed = 42,
  ...props
}: StaticWaveformProps) {
  const data = React.useMemo(() => createSeededBars(bars, seed), [bars, seed]);
  return <Waveform data={data} bars={bars} {...props} />;
}

function LiveMicrophoneWaveform({
  active = false,
  fftSize = 256,
  smoothingTimeConstant = 0.8,
  sensitivity = 1,
  onError,
  historySize = 150,
  updateRate = 50,
  barWidth = 3,
  barHeight = 4,
  barGap = 1,
  barRadius = 1,
  barColor,
  fadeEdges = true,
  fadeWidth = 24,
  height = 128,
  className,
  savedHistoryRef,
  dragOffset,
  setDragOffset,
  enableAudioPlayback = true,
  playbackRate = 1,
  deviceId,
  ...props
}: LiveMicrophoneWaveformProps) {
  const { audioRef, audioUrl, currentTime, duration, history, setCurrentTime } =
    useMicrophoneHistory({
      active,
      deviceId,
      fftSize,
      smoothingTimeConstant,
      sensitivity,
      historySize,
      updateRate,
      onError,
      captureAudio: enableAudioPlayback,
      savedHistoryRef,
    });

  const externalTime =
    typeof dragOffset === "number" && history.length > 0
      ? (1 - clamp(dragOffset / history.length, 0, 1)) * duration
      : currentTime;

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.playbackRate = playbackRate;
  }, [audioRef, playbackRate, audioUrl]);

  const handleSeek = React.useCallback(
    (time: number) => {
      setCurrentTime(time);

      if (duration > 0 && history.length > 0) {
        setDragOffset?.((1 - time / duration) * history.length);
      }

      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    },
    [audioRef, duration, history.length, setCurrentTime, setDragOffset]
  );

  if (active) {
    return (
      <>
        <LiveWaveform
          active
          deviceId={deviceId}
          fftSize={fftSize}
          smoothingTimeConstant={smoothingTimeConstant}
          sensitivity={sensitivity}
          historySize={historySize}
          updateRate={updateRate}
          barWidth={barWidth}
          barHeight={barHeight}
          barGap={barGap}
          barRadius={barRadius}
          barColor={barColor}
          fadeEdges={fadeEdges}
          fadeWidth={fadeWidth}
          height={height}
          className={className}
          mode="scrolling"
          onError={onError}
          {...props}
        />
        {audioUrl ? (
          <audio ref={audioRef} className="hidden" src={audioUrl} />
        ) : null}
      </>
    );
  }

  if (history.length > 0 && enableAudioPlayback) {
    return (
      <>
        <AudioScrubber
          data={history}
          currentTime={externalTime}
          duration={
            duration || Math.max(history.length * (updateRate / 1000), 0.1)
          }
          onSeek={handleSeek}
          barWidth={barWidth}
          barHeight={barHeight}
          barGap={barGap}
          barRadius={barRadius}
          barColor={barColor}
          fadeEdges={fadeEdges}
          fadeWidth={fadeWidth}
          height={height}
          className={className}
          {...props}
        />
        {audioUrl ? (
          <audio ref={audioRef} className="hidden" src={audioUrl} />
        ) : null}
      </>
    );
  }

  return (
    <Waveform
      data={history}
      bars={history.length || historySize}
      barWidth={barWidth}
      barHeight={barHeight}
      barGap={barGap}
      barRadius={barRadius}
      barColor={barColor}
      fadeEdges={fadeEdges}
      fadeWidth={fadeWidth}
      height={height}
      className={className}
      {...props}
    />
  );
}

function RecordingWaveform({
  recording = false,
  fftSize = 256,
  smoothingTimeConstant = 0.8,
  sensitivity = 1,
  onError,
  onRecordingComplete,
  updateRate = 50,
  showHandle = true,
  barWidth = 3,
  barHeight = 4,
  barGap = 1,
  barRadius = 1,
  barColor,
  height = 128,
  className,
  deviceId,
  ...props
}: RecordingWaveformProps) {
  const { currentTime, duration, history, setCurrentTime } =
    useMicrophoneHistory({
      active: recording,
      deviceId,
      fftSize,
      smoothingTimeConstant,
      sensitivity,
      historySize: 200,
      updateRate,
      onError,
      onStop: onRecordingComplete,
    });

  if (recording) {
    return (
      <LiveWaveform
        active
        deviceId={deviceId}
        fftSize={fftSize}
        smoothingTimeConstant={smoothingTimeConstant}
        sensitivity={sensitivity}
        updateRate={updateRate}
        barWidth={barWidth}
        barHeight={barHeight}
        barGap={barGap}
        barRadius={barRadius}
        barColor={barColor}
        height={height}
        className={className}
        mode="static"
        onError={onError}
        {...props}
      />
    );
  }

  if (history.length > 0) {
    return (
      <AudioScrubber
        data={history}
        currentTime={currentTime}
        duration={
          duration || Math.max(history.length * (updateRate / 1000), 0.1)
        }
        onSeek={setCurrentTime}
        showHandle={showHandle}
        barWidth={barWidth}
        barHeight={barHeight}
        barGap={barGap}
        barRadius={barRadius}
        barColor={barColor}
        height={height}
        className={className}
        {...props}
      />
    );
  }

  return (
    <Waveform
      data={[]}
      bars={40}
      barWidth={barWidth}
      barHeight={barHeight}
      barGap={barGap}
      barRadius={barRadius}
      barColor={barColor}
      height={height}
      className={className}
      {...props}
    />
  );
}

Waveform.displayName = "Waveform";
ScrollingWaveform.displayName = "ScrollingWaveform";
AudioScrubber.displayName = "AudioScrubber";
MicrophoneWaveform.displayName = "MicrophoneWaveform";
StaticWaveform.displayName = "StaticWaveform";
LiveMicrophoneWaveform.displayName = "LiveMicrophoneWaveform";
RecordingWaveform.displayName = "RecordingWaveform";

export {
  AudioScrubber,
  LiveMicrophoneWaveform,
  MicrophoneWaveform,
  RecordingWaveform,
  ScrollingWaveform,
  StaticWaveform,
  Waveform,
  downsample,
  waveformVariants,
};
