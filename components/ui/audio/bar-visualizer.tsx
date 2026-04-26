"use client";

/**
 * Bar Visualizer
 * @registryDescription Animated audio bars for microphone levels, agent states, and ambient voice activity.
 * @registryCategory audio
 */

import {
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

// ---- AUDIO ANALYSER UTILITIES -----------------------------------------------

export interface AudioAnalyserOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
}

function createAudioAnalyser(
  mediaStream: MediaStream,
  options: AudioAnalyserOptions = {}
) {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(mediaStream);
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = options.fftSize ?? 2048;
  analyser.smoothingTimeConstant = options.smoothingTimeConstant ?? 0.8;
  if (options.minDecibels !== undefined)
    analyser.minDecibels = options.minDecibels;
  if (options.maxDecibels !== undefined)
    analyser.maxDecibels = options.maxDecibels;

  source.connect(analyser);

  return {
    analyser,
    cleanup: () => {
      source.disconnect();
      audioContext.close();
    },
  };
}

// ---- useAudioVolume ---------------------------------------------------------

/**
 * Hook for tracking the volume of an audio stream using the Web Audio API.
 * @param mediaStream - The MediaStream to analyze
 * @param options - Audio analyser options
 * @returns The current volume level (0-1)
 * @registryCategory audio
 */
export function useAudioVolume(
  mediaStream?: MediaStream | null,
  options: AudioAnalyserOptions = { fftSize: 32, smoothingTimeConstant: 0 }
) {
  const [volume, setVolume] = useState(0);
  const volumeRef = useRef(0);
  const frameId = useRef<number | undefined>(undefined);

  const memoizedOptions = useMemo(
    () => options,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      options.fftSize,
      options.smoothingTimeConstant,
      options.minDecibels,
      options.maxDecibels,
    ]
  );

  useEffect(() => {
    if (!mediaStream) {
      setVolume(0);
      volumeRef.current = 0;
      return;
    }

    const { analyser, cleanup } = createAudioAnalyser(
      mediaStream,
      memoizedOptions
    );

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let lastUpdate = 0;
    const updateInterval = 1000 / 30;

    const updateVolume = (timestamp: number) => {
      if (timestamp - lastUpdate >= updateInterval) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const a = dataArray[i];
          sum += a * a;
        }
        const newVolume = Math.sqrt(sum / dataArray.length) / 255;

        if (Math.abs(newVolume - volumeRef.current) > 0.01) {
          volumeRef.current = newVolume;
          setVolume(newVolume);
        }
        lastUpdate = timestamp;
      }
      frameId.current = requestAnimationFrame(updateVolume);
    };

    frameId.current = requestAnimationFrame(updateVolume);

    return () => {
      cleanup();
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [mediaStream, memoizedOptions]);

  return volume;
}

// ---- useMultibandVolume -----------------------------------------------------

export interface MultiBandVolumeOptions {
  bands?: number;
  loPass?: number;
  hiPass?: number;
  updateInterval?: number;
  analyserOptions?: AudioAnalyserOptions;
}

const multibandDefaults: MultiBandVolumeOptions = {
  bands: 5,
  loPass: 100,
  hiPass: 600,
  updateInterval: 32,
  analyserOptions: { fftSize: 2048 },
};

const normalizeDb = (value: number) => {
  if (value === -Infinity) return 0;
  const minDb = -100;
  const maxDb = -10;
  const db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100;
  return Math.sqrt(db);
};

/**
 * Hook for tracking volume across multiple frequency bands.
 * @param mediaStream - The MediaStream to analyze
 * @param options - Multiband options
 * @returns Array of volume levels for each frequency band
 */
export function useMultibandVolume(
  mediaStream?: MediaStream | null,
  options: MultiBandVolumeOptions = {}
) {
  const opts = useMemo(
    () => ({ ...multibandDefaults, ...options }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      options.bands,
      options.loPass,
      options.hiPass,
      options.updateInterval,
      options.analyserOptions?.fftSize,
      options.analyserOptions?.smoothingTimeConstant,
      options.analyserOptions?.minDecibels,
      options.analyserOptions?.maxDecibels,
    ]
  );

  const [frequencyBands, setFrequencyBands] = useState<number[]>(() =>
    new Array(opts.bands).fill(0)
  );
  const bandsRef = useRef<number[]>(new Array(opts.bands).fill(0));
  const frameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!mediaStream) {
      const emptyBands = new Array(opts.bands).fill(0);
      setFrequencyBands(emptyBands);
      bandsRef.current = emptyBands;
      return;
    }

    const { analyser, cleanup } = createAudioAnalyser(
      mediaStream,
      opts.analyserOptions
    );

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const sliceStart = opts.loPass!;
    const sliceEnd = opts.hiPass!;
    const sliceLength = sliceEnd - sliceStart;
    const chunkSize = Math.ceil(sliceLength / opts.bands!);

    let lastUpdate = 0;
    const updateInterval = opts.updateInterval!;

    const updateVolume = (timestamp: number) => {
      if (timestamp - lastUpdate >= updateInterval) {
        analyser.getFloatFrequencyData(dataArray);

        const chunks = new Array(opts.bands!);
        for (let i = 0; i < opts.bands!; i++) {
          let sum = 0;
          let count = 0;
          const startIdx = sliceStart + i * chunkSize;
          const endIdx = Math.min(sliceStart + (i + 1) * chunkSize, sliceEnd);

          for (let j = startIdx; j < endIdx; j++) {
            sum += normalizeDb(dataArray[j]);
            count++;
          }
          chunks[i] = count > 0 ? sum / count : 0;
        }

        let hasChanged = false;
        for (let i = 0; i < chunks.length; i++) {
          if (Math.abs(chunks[i] - bandsRef.current[i]) > 0.01) {
            hasChanged = true;
            break;
          }
        }

        if (hasChanged) {
          bandsRef.current = chunks;
          setFrequencyBands(chunks);
        }
        lastUpdate = timestamp;
      }
      frameId.current = requestAnimationFrame(updateVolume);
    };

    frameId.current = requestAnimationFrame(updateVolume);

    return () => {
      cleanup();
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [mediaStream, opts]);

  return frequencyBands;
}

// ---- useBarAnimator ---------------------------------------------------------

type AnimationState =
  | "connecting"
  | "initializing"
  | "listening"
  | "speaking"
  | "thinking"
  | undefined;

const generateConnectingSequence = (columns: number): number[][] => {
  const seq = [];
  for (let x = 0; x < columns; x++) {
    seq.push([x, columns - 1 - x]);
  }
  return seq;
};

const generateListeningSequence = (columns: number): number[][] => {
  const center = Math.floor(columns / 2);
  const noIndex = -1;
  return [[center], [noIndex]];
};

/**
 * Create animation sequences for different states.
 * @param state - Current animation state
 * @param columns - Number of bars
 * @param interval - Animation frame interval in ms
 * @returns Array of highlighted bar indices
 */
export const useBarAnimator = (
  state: AnimationState,
  columns: number,
  interval: number
): number[] => {
  const indexRef = useRef(0);
  const [currentFrame, setCurrentFrame] = useState<number[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const sequence = useMemo(() => {
    if (state === "thinking" || state === "listening") {
      return generateListeningSequence(columns);
    } else if (state === "connecting" || state === "initializing") {
      return generateConnectingSequence(columns);
    } else if (state === undefined || state === "speaking") {
      return [new Array(columns).fill(0).map((_, idx) => idx)];
    } else {
      return [[]];
    }
  }, [state, columns]);

  useEffect(() => {
    indexRef.current = -1;
    let startTime = performance.now() - interval;

    const animate = (time: DOMHighResTimeStamp) => {
      const timeElapsed = time - startTime;

      if (timeElapsed >= interval) {
        indexRef.current = (indexRef.current + 1) % sequence.length;
        setCurrentFrame(sequence[indexRef.current] || []);
        startTime = time;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [interval, sequence]);

  return currentFrame;
};

// ---- TYPES & COMPONENT ------------------------------------------------------

export type AgentState =
  | "connecting"
  | "initializing"
  | "listening"
  | "speaking"
  | "thinking";

export interface BarVisualizerProps extends HTMLAttributes<HTMLDivElement> {
  /** Voice assistant state */
  state?: AgentState;
  /** Number of bars to display. Default: 15 */
  barCount?: number;
  /** Audio source for real-time visualization */
  mediaStream?: MediaStream | null;
  /** Minimum bar height as percentage. Default: 20 */
  minHeight?: number;
  /** Maximum bar height as percentage. Default: 100 */
  maxHeight?: number;
  /** Enable demo mode with fake audio data. Default: false */
  demo?: boolean;
  /** Align bars from center instead of bottom. Default: false */
  centerAlign?: boolean;
}

const BarVisualizerComponent = forwardRef<HTMLDivElement, BarVisualizerProps>(
  (
    {
      state,
      barCount = 15,
      mediaStream,
      minHeight = 20,
      maxHeight = 100,
      demo = false,
      centerAlign = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Audio processing
    const realVolumeBands = useMultibandVolume(mediaStream, {
      bands: barCount,
      loPass: 100,
      hiPass: 200,
    });

    // Demo mode: generate fake volume data
    const fakeVolumeBandsRef = useRef<number[]>(new Array(barCount).fill(0.2));
    const [fakeVolumeBands, setFakeVolumeBands] = useState<number[]>(() =>
      new Array(barCount).fill(0.2)
    );
    const fakeAnimationRef = useRef<number | undefined>(undefined);
    const idleFakeVolumeBands = useMemo(
      () => new Array(barCount).fill(0.2),
      [barCount]
    );

    useEffect(() => {
      if (!demo) return;

      if (state !== "speaking" && state !== "listening") {
        fakeVolumeBandsRef.current = idleFakeVolumeBands;
        return;
      }

      let lastUpdate = 0;
      const updateInterval = 50;
      const startTime = Date.now() / 1000;

      const updateFakeVolume = (timestamp: number) => {
        if (timestamp - lastUpdate >= updateInterval) {
          const time = Date.now() / 1000 - startTime;
          const newBands = new Array(barCount);

          for (let i = 0; i < barCount; i++) {
            const waveOffset = i * 0.5;
            const baseVolume = Math.sin(time * 2 + waveOffset) * 0.3 + 0.5;
            const randomNoise = Math.random() * 0.2;
            newBands[i] = Math.max(0.1, Math.min(1, baseVolume + randomNoise));
          }

          let hasChanged = false;
          for (let i = 0; i < barCount; i++) {
            if (Math.abs(newBands[i] - fakeVolumeBandsRef.current[i]) > 0.05) {
              hasChanged = true;
              break;
            }
          }

          if (hasChanged) {
            fakeVolumeBandsRef.current = newBands;
            setFakeVolumeBands(newBands);
          }

          lastUpdate = timestamp;
        }
        fakeAnimationRef.current = requestAnimationFrame(updateFakeVolume);
      };

      fakeAnimationRef.current = requestAnimationFrame(updateFakeVolume);

      return () => {
        if (fakeAnimationRef.current) {
          cancelAnimationFrame(fakeAnimationRef.current);
        }
      };
    }, [demo, state, barCount, idleFakeVolumeBands]);

    const volumeBands = useMemo(
      () =>
        demo
          ? state === "speaking" || state === "listening"
            ? fakeVolumeBands
            : idleFakeVolumeBands
          : realVolumeBands,
      [demo, fakeVolumeBands, idleFakeVolumeBands, realVolumeBands, state]
    );

    // Animation sequencing
    const highlightedIndices = useBarAnimator(
      state,
      barCount,
      state === "connecting"
        ? 2000 / barCount
        : state === "thinking"
          ? 150
          : state === "listening"
            ? 500
            : 1000
    );

    return (
      <div
        ref={ref}
        data-slot="bar-visualizer"
        data-state={state}
        className={cn(
          "relative flex justify-center gap-1",
          centerAlign ? "items-center" : "items-end",
          "bg-muted h-32 w-full overflow-hidden rounded-lg p-4",
          className
        )}
        style={{ ...style }}
        {...props}
      >
        {volumeBands.map((volume, index) => {
          const heightPct = Math.min(
            maxHeight,
            Math.max(minHeight, volume * 100 + 5)
          );
          const isHighlighted = highlightedIndices?.includes(index) ?? false;

          return (
            <Bar
              key={index}
              heightPct={heightPct}
              isHighlighted={isHighlighted}
              state={state}
            />
          );
        })}
      </div>
    );
  }
);

// Memoized Bar component to prevent unnecessary re-renders
const Bar = memo<{
  heightPct: number;
  isHighlighted: boolean;
  state?: AgentState;
}>(({ heightPct, isHighlighted, state }) => (
  <div
    data-highlighted={isHighlighted}
    className={cn(
      "min-w-0 max-w-3 flex-1 transition-[height,opacity,transform] duration-150 ease-out",
      "rounded-full",
      "bg-border data-[highlighted=true]:bg-primary",
      state === "speaking" && "bg-primary",
      state === "thinking" && isHighlighted && "animate-pulse"
    )}
    style={{
      height: `${heightPct}%`,
      animationDuration: state === "thinking" ? "300ms" : undefined,
    }}
  />
));

Bar.displayName = "Bar";

// Wrap the main component with memo for prop comparison optimization
const BarVisualizer = memo(BarVisualizerComponent, (prevProps, nextProps) => {
  return (
    prevProps.state === nextProps.state &&
    prevProps.barCount === nextProps.barCount &&
    prevProps.mediaStream === nextProps.mediaStream &&
    prevProps.minHeight === nextProps.minHeight &&
    prevProps.maxHeight === nextProps.maxHeight &&
    prevProps.demo === nextProps.demo &&
    prevProps.centerAlign === nextProps.centerAlign &&
    prevProps.className === nextProps.className &&
    JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
  );
});

BarVisualizerComponent.displayName = "BarVisualizerComponent";
BarVisualizer.displayName = "BarVisualizer";

export { BarVisualizer };
