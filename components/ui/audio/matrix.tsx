"use client";

/**
 * Matrix
 * @registryDescription Dot-matrix animation presets for compact loaders, voice activity, and ambient status.
 * @registryCategory display
 */

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Frame = number[][];
type MatrixMode = "default" | "vu";

interface CellPosition {
  x: number;
  y: number;
}

interface MatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: number;
  cols: number;
  pattern?: Frame;
  frames?: Frame[];
  fps?: number;
  autoplay?: boolean;
  loop?: boolean;
  size?: number;
  gap?: number;
  palette?: { on: string; off: string };
  brightness?: number;
  ariaLabel?: string;
  onFrame?: (index: number) => void;
  mode?: MatrixMode;
  levels?: number[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function ensureFrameSize(frame: Frame, rows: number, cols: number): Frame {
  const result: Frame = [];
  for (let r = 0; r < rows; r++) {
    const row = frame[r] || [];
    result.push([]);
    for (let c = 0; c < cols; c++) {
      result[r][c] = row[c] ?? 0;
    }
  }
  return result;
}

function emptyFrame(rows: number, cols: number): Frame {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function setPixel(frame: Frame, row: number, col: number, value: number): void {
  if (row >= 0 && row < frame.length && col >= 0 && col < frame[0].length) {
    frame[row][col] = value;
  }
}

// ---------------------------------------------------------------------------
// useAnimation
// ---------------------------------------------------------------------------

function useAnimation(
  frames: Frame[] | undefined,
  options: {
    fps: number;
    autoplay: boolean;
    loop: boolean;
    onFrame?: (index: number) => void;
  }
): { frameIndex: number; isPlaying: boolean } {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(options.autoplay);
  const frameIdRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const { autoplay, fps, loop, onFrame } = options;

  useEffect(() => {
    if (!frames || frames.length === 0 || !isPlaying) return;

    const frameInterval = 1000 / fps;

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      accumulatorRef.current += deltaTime;

      if (accumulatorRef.current >= frameInterval) {
        accumulatorRef.current -= frameInterval;
        setFrameIndex((prev) => {
          const next = prev + 1;
          if (next >= frames.length) {
            if (loop) {
              onFrame?.(0);
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          onFrame?.(next);
          return next;
        });
      }
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [frames, isPlaying, fps, loop, onFrame]);

  useEffect(() => {
    lastTimeRef.current = 0;
    accumulatorRef.current = 0;
    const resetFrame = requestAnimationFrame(() => {
      setFrameIndex(0);
      setIsPlaying(autoplay);
    });

    return () => cancelAnimationFrame(resetFrame);
  }, [frames, autoplay]);

  return { frameIndex, isPlaying };
}

// ---------------------------------------------------------------------------
// Presets: digits
// ---------------------------------------------------------------------------

export const digits: Frame[] = [
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
];

// ---------------------------------------------------------------------------
// Presets: chevrons
// ---------------------------------------------------------------------------

export const chevronLeft: Frame = [
  [0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
];

export const chevronRight: Frame = [
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0],
];

// ---------------------------------------------------------------------------
// Presets: loader
// ---------------------------------------------------------------------------

export const loader: Frame[] = (() => {
  const frames: Frame[] = [];
  const size = 7;
  const center = 3;
  const radius = 2.5;

  for (let frame = 0; frame < 12; frame++) {
    const f = emptyFrame(size, size);
    for (let i = 0; i < 8; i++) {
      const angle = (frame / 12) * Math.PI * 2 + (i / 8) * Math.PI * 2;
      const x = Math.round(center + Math.cos(angle) * radius);
      const y = Math.round(center + Math.sin(angle) * radius);
      const brightness = 1 - i / 10;
      setPixel(f, y, x, Math.max(0.2, brightness));
    }
    frames.push(f);
  }
  return frames;
})();

// ---------------------------------------------------------------------------
// Presets: pulse
// ---------------------------------------------------------------------------

export const pulse: Frame[] = (() => {
  const frames: Frame[] = [];
  const size = 7;
  const center = 3;

  for (let frame = 0; frame < 16; frame++) {
    const f = emptyFrame(size, size);
    const phase = (frame / 16) * Math.PI * 2;
    const intensity = (Math.sin(phase) + 1) / 2;

    setPixel(f, center, center, 1);

    const radius = Math.floor((1 - intensity) * 3) + 1;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - radius) < 0.7) {
          setPixel(f, center + dy, center + dx, intensity * 0.6);
        }
        if (dist < radius) {
          setPixel(
            f,
            center + dy,
            center + dx,
            Math.max(f[center + dy]?.[center + dx] ?? 0, intensity * 0.3)
          );
        }
      }
    }
    frames.push(f);
  }
  return frames;
})();

// ---------------------------------------------------------------------------
// Presets: vu
// ---------------------------------------------------------------------------

export function vu(columns: number, levels: number[]): Frame {
  const rows = 7;
  const frame = emptyFrame(rows, columns);

  for (let col = 0; col < Math.min(columns, levels.length); col++) {
    const level = Math.max(0, Math.min(1, levels[col]));
    const height = Math.floor(level * rows);

    for (let row = 0; row < rows; row++) {
      const rowFromBottom = rows - 1 - row;
      if (rowFromBottom < height) {
        let brightness = 1;
        if (row < rows * 0.3) brightness = 1;
        else if (row < rows * 0.6) brightness = 0.8;
        else brightness = 0.6;
        frame[row][col] = brightness;
      }
    }
  }
  return frame;
}

// ---------------------------------------------------------------------------
// Presets: wave
// ---------------------------------------------------------------------------

export const wave: Frame[] = (() => {
  const frames: Frame[] = [];
  const rows = 7;
  const cols = 7;

  for (let frame = 0; frame < 24; frame++) {
    const f = emptyFrame(rows, cols);
    const phase = (frame / 24) * Math.PI * 2;

    for (let col = 0; col < cols; col++) {
      const colPhase = (col / cols) * Math.PI * 2;
      const height = Math.sin(phase + colPhase) * 2.5 + 3.5;
      const row = Math.floor(height);

      if (row >= 0 && row < rows) {
        setPixel(f, row, col, 1);
        const frac = height - row;
        if (row > 0) setPixel(f, row - 1, col, 1 - frac);
        if (row < rows - 1) setPixel(f, row + 1, col, frac);
      }
    }
    frames.push(f);
  }
  return frames;
})();

// ---------------------------------------------------------------------------
// Presets: snake
// ---------------------------------------------------------------------------

export const snake: Frame[] = (() => {
  const frames: Frame[] = [];
  const rows = 7;
  const cols = 7;
  const path: Array<[number, number]> = [];

  let x = 0;
  let y = 0;
  let dx = 1;
  let dy = 0;

  const visited = new Set<string>();
  while (path.length < rows * cols) {
    path.push([y, x]);
    visited.add(`${y},${x}`);

    const nextX = x + dx;
    const nextY = y + dy;

    if (
      nextX >= 0 &&
      nextX < cols &&
      nextY >= 0 &&
      nextY < rows &&
      !visited.has(`${nextY},${nextX}`)
    ) {
      x = nextX;
      y = nextY;
    } else {
      const newDx = -dy;
      const newDy = dx;
      dx = newDx;
      dy = newDy;

      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        nx < cols &&
        ny >= 0 &&
        ny < rows &&
        !visited.has(`${ny},${nx}`)
      ) {
        x = nx;
        y = ny;
      } else {
        break;
      }
    }
  }

  const snakeLength = 5;
  for (let frame = 0; frame < path.length; frame++) {
    const f = emptyFrame(rows, cols);
    for (let i = 0; i < snakeLength; i++) {
      const idx = frame - i;
      if (idx >= 0 && idx < path.length) {
        const [py, px] = path[idx];
        const brightness = 1 - i / snakeLength;
        setPixel(f, py, px, brightness);
      }
    }
    frames.push(f);
  }
  return frames;
})();

// ---------------------------------------------------------------------------
// Matrix component
// ---------------------------------------------------------------------------

export const Matrix = React.forwardRef<HTMLDivElement, MatrixProps>(
  (
    {
      rows,
      cols,
      pattern,
      frames,
      fps = 12,
      autoplay = true,
      loop = true,
      size = 10,
      gap = 2,
      palette = { on: "currentColor", off: "var(--muted-foreground)" },
      brightness = 1,
      ariaLabel,
      onFrame,
      mode = "default",
      levels,
      className,
      ...props
    },
    ref
  ) => {
    const { frameIndex } = useAnimation(frames, {
      fps,
      autoplay: autoplay && !pattern,
      loop,
      onFrame,
    });

    const currentFrame = useMemo(() => {
      if (mode === "vu" && levels && levels.length > 0) {
        return ensureFrameSize(vu(cols, levels), rows, cols);
      }
      if (pattern) return ensureFrameSize(pattern, rows, cols);
      if (frames && frames.length > 0) {
        return ensureFrameSize(frames[frameIndex] || frames[0], rows, cols);
      }
      return ensureFrameSize([], rows, cols);
    }, [pattern, frames, frameIndex, rows, cols, mode, levels]);

    const cellPositions = useMemo(() => {
      const positions: CellPosition[][] = [];
      for (let row = 0; row < rows; row++) {
        positions[row] = [];
        for (let col = 0; col < cols; col++) {
          positions[row][col] = {
            x: col * (size + gap),
            y: row * (size + gap),
          };
        }
      }
      return positions;
    }, [rows, cols, size, gap]);

    const svgDimensions = useMemo(
      () => ({
        width: cols * (size + gap) - gap,
        height: rows * (size + gap) - gap,
      }),
      [rows, cols, size, gap]
    );

    const isAnimating = !pattern && frames && frames.length > 0;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={ariaLabel ?? "matrix display"}
        aria-live={isAnimating ? "polite" : undefined}
        data-slot="matrix"
        className={cn("relative inline-block", className)}
        style={
          {
            "--matrix-on": palette.on,
            "--matrix-off": palette.off,
          } as React.CSSProperties
        }
        {...props}
      >
        <svg
          width={svgDimensions.width}
          height={svgDimensions.height}
          viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
          xmlns="http://www.w3.org/2000/svg"
          className="block"
          style={{ overflow: "visible" }}
        >
          <defs>
            <radialGradient id="matrix-pixel-on" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--matrix-on)" stopOpacity="1" />
              <stop
                offset="70%"
                stopColor="var(--matrix-on)"
                stopOpacity="0.85"
              />
              <stop
                offset="100%"
                stopColor="var(--matrix-on)"
                stopOpacity="0.6"
              />
            </radialGradient>
            <radialGradient id="matrix-pixel-off" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor="var(--muted-foreground)"
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor="var(--muted-foreground)"
                stopOpacity="0.7"
              />
            </radialGradient>
            <filter
              id="matrix-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <style>
            {`
              .matrix-pixel {
                transition: opacity 300ms ease-out, transform 150ms ease-out;
                transform-origin: center;
                transform-box: fill-box;
              }
              .matrix-pixel-active {
                filter: url(#matrix-glow);
              }
            `}
          </style>

          {currentFrame.map((row, rowIndex) =>
            row.map((value, colIndex) => {
              const pos = cellPositions[rowIndex]?.[colIndex];
              if (!pos) return null;

              const opacity = clamp(brightness * value);
              const isActive = opacity > 0.5;
              const isOn = opacity > 0.05;
              const fill = isOn
                ? "url(#matrix-pixel-on)"
                : "url(#matrix-pixel-off)";
              const scale = isActive ? 1.1 : 1;
              const radius = (size / 2) * 0.9;

              return (
                <circle
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "matrix-pixel",
                    isActive && "matrix-pixel-active",
                    !isOn && "opacity-20 dark:opacity-[0.1]"
                  )}
                  cx={pos.x + size / 2}
                  cy={pos.y + size / 2}
                  r={radius}
                  fill={fill}
                  opacity={isOn ? opacity : 0.1}
                  style={{ transform: `scale(${scale})` }}
                />
              );
            })
          )}
        </svg>
      </div>
    );
  }
);

Matrix.displayName = "Matrix";
