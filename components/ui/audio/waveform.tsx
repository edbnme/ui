"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

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
  /** Border radius of each bar. Default: 1 */
  barRadius?: number;
  /** Called when user clicks a position on the waveform (0-1) */
  onSeek?: (position: number) => void;
}

// =============================================================================
// VARIANTS
// =============================================================================

const waveformVariants = cva(
  "flex items-center justify-center w-full overflow-hidden",
  {
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
  }
);

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Downsample audio data to target bar count by averaging chunks.
 */
function downsample(
  data: Float32Array | number[],
  targetBars: number
): number[] {
  const len = data.length;
  if (len === 0) return new Array(targetBars).fill(0);

  const chunkSize = Math.max(1, Math.floor(len / targetBars));
  const result: number[] = [];

  for (let i = 0; i < targetBars; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, len);
    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += Math.abs(data[j]);
    }
    result.push(sum / (end - start));
  }

  // Normalize to 0-1
  const max = Math.max(...result, 0.001);
  return result.map((v) => v / max);
}

// =============================================================================
// COMPONENT
// =============================================================================

function Waveform({
  data,
  bars = 100,
  progress = 0,
  playedColor,
  unplayedColor,
  gap = 1,
  barRadius = 1,
  onSeek,
  size,
  className,
  ...props
}: WaveformProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const barData = React.useMemo(() => downsample(data, bars), [data, bars]);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onSeek || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      onSeek(pos);
    },
    [onSeek]
  );

  const progressIndex = Math.floor(progress * barData.length);

  return (
    <div
      ref={containerRef}
      data-slot="waveform"
      className={cn(
        waveformVariants({ size }),
        onSeek && "cursor-pointer",
        className
      )}
      onClick={handleClick}
      role={onSeek ? "slider" : "img"}
      aria-label="Audio waveform"
      aria-valuenow={onSeek ? Math.round(progress * 100) : undefined}
      aria-valuemin={onSeek ? 0 : undefined}
      aria-valuemax={onSeek ? 100 : undefined}
      {...props}
    >
      {barData.map((height, i) => {
        const isPlayed = i < progressIndex;
        const barHeight = Math.max(0.05, height);

        return (
          <div
            key={i}
            className="flex-1 transition-colors duration-150"
            style={{
              height: `${barHeight * 100}%`,
              backgroundColor: isPlayed
                ? playedColor || "var(--color-primary)"
                : unplayedColor || "var(--color-muted-foreground)",
              opacity: isPlayed ? 1 : 0.3,
              borderRadius: barRadius,
              marginLeft: i > 0 ? gap : 0,
              minWidth: 1,
            }}
          />
        );
      })}
    </div>
  );
}

Waveform.displayName = "Waveform";

export { Waveform, waveformVariants, downsample };
export type { WaveformProps };
