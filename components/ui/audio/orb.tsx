"use client";

/**
 * Orb
 * @registryDescription Lightweight canvas agent orb for listening, talking, thinking, and idle voice states.
 * @registryCategory display
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

export type AgentState = "idle" | "thinking" | "listening" | "talking";

export type OrbProps = React.HTMLAttributes<HTMLDivElement> & {
  colors?: [string, string];
  colorsRef?: React.RefObject<[string, string]>;
  seed?: number;
  agentState?: AgentState;
  volumeMode?: "auto" | "manual";
  manualInput?: number;
  manualOutput?: number;
  inputVolumeRef?: React.RefObject<number>;
  outputVolumeRef?: React.RefObject<number>;
  getInputVolume?: () => number;
  getOutputVolume?: () => number;
  intensity?: number;
};

type Rgb = { r: number; g: number; b: number };

type DrawConfig = {
  colors: [string, string];
  state: AgentState;
  inputVolume: number;
  outputVolume: number;
  intensity: number;
  time: number;
};

// ---- HELPERS ----------------------------------------------------------------

function splitmix32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x9e3779b9) | 0;
    let value = seed ^ (seed >>> 16);
    value = Math.imul(value, 0x21f0aaad);
    value = value ^ (value >>> 15);
    value = Math.imul(value, 0x735a2d97);
    return ((value = value ^ (value >>> 15)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function fade(value: number) {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

function parseHexColor(color: string): Rgb | null {
  const normalized = color.trim();
  const match = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;

  const hex = match[1];
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((character) => character + character)
          .join("")
      : hex;

  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

function colorWithAlpha(color: string, alpha: number) {
  const rgb = parseHexColor(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp(alpha, 0, 1)})`;
}

function createNoise(seed: number) {
  const random = splitmix32(seed);
  const permutation = Array.from({ length: 256 }, (_, index) => index);

  for (let index = permutation.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [permutation[index], permutation[swapIndex]] = [
      permutation[swapIndex],
      permutation[index],
    ];
  }

  const table = [...permutation, ...permutation];

  return (value: number) => {
    const whole = Math.floor(value) & 255;
    const fraction = value - Math.floor(value);
    const eased = fade(fraction);
    const left = table[whole] % 2 === 0 ? fraction : -fraction;
    const right = table[whole + 1] % 2 === 0 ? fraction - 1 : 1 - fraction;

    return lerp(left, right, eased);
  };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;

    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function getAutoVolumes(state: AgentState, time: number) {
  if (state === "listening") {
    return {
      input: clamp(0.58 + Math.sin(time * 3.4) * 0.24, 0, 1),
      output: 0.34 + Math.sin(time * 0.8) * 0.04,
    };
  }

  if (state === "talking") {
    return {
      input: clamp(0.46 + Math.sin(time * 5.6) * 0.2, 0, 1),
      output: clamp(0.78 + Math.sin(time * 4.1) * 0.18, 0, 1),
    };
  }

  if (state === "thinking") {
    return {
      input: 0.22 + Math.sin(time * 1.8) * 0.05,
      output: clamp(0.54 + Math.sin(time * 1.2) * 0.14, 0, 1),
    };
  }

  return {
    input: 0.08 + Math.sin(time * 0.7) * 0.025,
    output: 0.2 + Math.sin(time * 0.55) * 0.04,
  };
}

function getAccessibleLabel(state: AgentState) {
  return `${state.charAt(0).toUpperCase()}${state.slice(1)} agent orb`;
}

function drawOrb(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  noise: (value: number) => number,
  config: DrawConfig
) {
  const { colors, inputVolume, outputVolume, intensity, time, state } = config;
  const centerX = width / 2;
  const centerY = height / 2;
  const shortestSide = Math.max(1, Math.min(width, height));
  const radius = shortestSide * 0.24;
  const reactiveVolume = clamp((inputVolume + outputVolume) / 2, 0, 1);
  const activeScale = state === "idle" ? 0.55 : 1;

  context.clearRect(0, 0, width, height);

  const haloRadius = radius * (2.15 + outputVolume * 0.7);
  const halo = context.createRadialGradient(
    centerX,
    centerY,
    radius * 0.2,
    centerX,
    centerY,
    haloRadius
  );
  halo.addColorStop(0, colorWithAlpha(colors[0], 0.24 * activeScale));
  halo.addColorStop(0.45, colorWithAlpha(colors[1], 0.13 * activeScale));
  halo.addColorStop(1, colorWithAlpha(colors[1], 0));
  context.fillStyle = halo;
  context.beginPath();
  context.arc(centerX, centerY, haloRadius, 0, Math.PI * 2);
  context.fill();

  const segments = 176;
  context.save();
  context.shadowColor = colorWithAlpha(colors[1], 0.3 + outputVolume * 0.2);
  context.shadowBlur = radius * (0.36 + outputVolume * 0.24);
  context.beginPath();

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const n1 = noise(angle * 1.7 + time * 0.32) * radius * 0.09;
    const n2 = noise(angle * 3.6 - time * 0.42 + 37) * radius * 0.055;
    const n3 = noise(angle * 7.2 + time * 0.68 + 91) * radius * 0.032;
    const breathing = Math.sin(time * 1.8 + angle * 2) * radius * 0.018;
    const deformation =
      (n1 + n2 + n3 + breathing) * (0.7 + reactiveVolume * 1.8) * intensity;
    const currentRadius = radius + deformation;
    const x = centerX + Math.cos(angle) * currentRadius;
    const y = centerY + Math.sin(angle) * currentRadius;

    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }

  context.closePath();

  const fill = context.createRadialGradient(
    centerX - radius * 0.3,
    centerY - radius * 0.38,
    radius * 0.08,
    centerX,
    centerY,
    radius * 1.28
  );
  fill.addColorStop(0, "rgba(255,255,255,0.95)");
  fill.addColorStop(0.18, colors[0]);
  fill.addColorStop(0.64, colors[1]);
  fill.addColorStop(1, "rgba(12,12,16,0.94)");
  context.fillStyle = fill;
  context.fill();
  context.restore();

  const inner = context.createRadialGradient(
    centerX,
    centerY,
    radius * 0.12,
    centerX,
    centerY,
    radius * 1.1
  );
  inner.addColorStop(0, "rgba(255,255,255,0.04)");
  inner.addColorStop(0.72, "rgba(0,0,0,0)");
  inner.addColorStop(1, "rgba(0,0,0,0.18)");
  context.fillStyle = inner;
  context.beginPath();
  context.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
  context.fill();

  const highlight = context.createRadialGradient(
    centerX - radius * 0.28,
    centerY - radius * 0.34,
    0,
    centerX - radius * 0.28,
    centerY - radius * 0.34,
    radius * 0.55
  );
  highlight.addColorStop(0, "rgba(255,255,255,0.26)");
  highlight.addColorStop(0.42, "rgba(255,255,255,0.08)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = highlight;
  context.beginPath();
  context.arc(centerX, centerY, radius * 1.05, 0, Math.PI * 2);
  context.fill();

  const ringCount = state === "thinking" ? 3 : 2;
  for (let index = 0; index < ringCount; index += 1) {
    const phase = (time * (0.34 + index * 0.08) + index * 0.3) % 1;
    const ringRadius = radius * (1.16 + phase * (0.55 + outputVolume * 0.25));
    const opacity = (1 - phase) * (0.11 + outputVolume * 0.12) * activeScale;
    context.strokeStyle = colorWithAlpha(colors[index % 2], opacity);
    context.lineWidth = Math.max(1, radius * 0.012);
    context.beginPath();
    context.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
    context.stroke();
  }
}

// ---- COMPONENT --------------------------------------------------------------

export const Orb = React.forwardRef<HTMLDivElement, OrbProps>(function Orb(
  {
    colors = ["#CADCFC", "#A0B9D1"],
    colorsRef,
    seed = 42,
    agentState = "idle",
    volumeMode = "auto",
    manualInput,
    manualOutput,
    inputVolumeRef,
    outputVolumeRef,
    getInputVolume,
    getOutputVolume,
    intensity = 1,
    className,
    role,
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const frameRef = React.useRef<number | null>(null);
  const currentVolumesRef = React.useRef({ input: 0, output: 0 });
  const latestRef = React.useRef({
    colors,
    colorsRef,
    agentState,
    volumeMode,
    manualInput,
    manualOutput,
    inputVolumeRef,
    outputVolumeRef,
    getInputVolume,
    getOutputVolume,
    intensity,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const noise = React.useMemo(() => createNoise(seed), [seed]);

  React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, []);

  React.useEffect(() => {
    latestRef.current = {
      colors,
      colorsRef,
      agentState,
      volumeMode,
      manualInput,
      manualOutput,
      inputVolumeRef,
      outputVolumeRef,
      getInputVolume,
      getOutputVolume,
      intensity,
    };
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = rootRef.current;
    if (!canvas || !container) return;

    let context: CanvasRenderingContext2D | null = null;
    try {
      context = canvas.getContext("2d");
    } catch {
      return;
    }

    if (!context) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, rect.width || 240);
      const height = Math.max(1, rect.height || 240);
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timestamp: number) => {
      resize();
      const latest = latestRef.current;
      const time = timestamp / 1000;
      const liveColors = latest.colorsRef?.current ?? latest.colors;
      const targetVolumes =
        latest.volumeMode === "manual"
          ? {
              input: clamp(
                latest.manualInput ??
                  latest.inputVolumeRef?.current ??
                  latest.getInputVolume?.() ??
                  0,
                0,
                1
              ),
              output: clamp(
                latest.manualOutput ??
                  latest.outputVolumeRef?.current ??
                  latest.getOutputVolume?.() ??
                  0,
                0,
                1
              ),
            }
          : getAutoVolumes(latest.agentState, time);

      currentVolumesRef.current.input = lerp(
        currentVolumesRef.current.input,
        targetVolumes.input,
        0.12
      );
      currentVolumesRef.current.output = lerp(
        currentVolumesRef.current.output,
        targetVolumes.output,
        0.12
      );

      const dpr = window.devicePixelRatio || 1;
      drawOrb(context, canvas.width / dpr, canvas.height / dpr, noise, {
        colors: liveColors,
        state: latest.agentState,
        inputVolume: currentVolumesRef.current.input,
        outputVolume: currentVolumesRef.current.output,
        intensity: clamp(latest.intensity, 0.4, 1.8),
        time,
      });

      if (!prefersReducedMotion) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [noise, prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      className={cn("relative h-full w-full overflow-visible", className)}
      data-slot="audio-orb"
      data-state={agentState}
      role={role ?? "img"}
      aria-label={ariaLabel ?? getAccessibleLabel(agentState)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
});

Orb.displayName = "Orb";
