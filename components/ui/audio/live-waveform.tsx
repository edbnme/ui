"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export type LiveWaveformProps = HTMLAttributes<HTMLDivElement> & {
  /** Whether microphone capture is active. Default: false */
  active?: boolean;
  /** Whether to show processing animation. Default: false */
  processing?: boolean;
  /** Specific audio input device ID */
  deviceId?: string;
  /** Width of each bar in pixels. Default: 3 */
  barWidth?: number;
  /** Minimum bar height in pixels. Default: 4 */
  barHeight?: number;
  /** Gap between bars in pixels. Default: 1 */
  barGap?: number;
  /** Corner radius of bars in pixels. Default: 1.5 */
  barRadius?: number;
  /** Bar color (CSS color string). Default: uses currentColor */
  barColor?: string;
  /** Whether to fade edges to transparent. Default: true */
  fadeEdges?: boolean;
  /** Width of edge fade in pixels. Default: 24 */
  fadeWidth?: number;
  /** Height of the waveform. Default: 64 */
  height?: string | number;
  /** Sensitivity multiplier. Default: 1 */
  sensitivity?: number;
  /** Audio analyser smoothing. Default: 0.8 */
  smoothingTimeConstant?: number;
  /** FFT size for frequency analysis. Default: 256 */
  fftSize?: number;
  /** Number of history entries for scrolling mode. Default: 60 */
  historySize?: number;
  /** Update rate in fps. Default: 30 */
  updateRate?: number;
  /** Rendering mode. Default: "static" */
  mode?: "scrolling" | "static";
  /** Called when an error occurs */
  onError?: (error: Error) => void;
  /** Called when the audio stream is ready */
  onStreamReady?: (stream: MediaStream) => void;
  /** Called when the audio stream ends */
  onStreamEnd?: () => void;
};

// =============================================================================
// COMPONENT
// =============================================================================

export const LiveWaveform = ({
  active = false,
  processing = false,
  deviceId,
  barWidth = 3,
  barGap = 1,
  barRadius = 1.5,
  barColor,
  fadeEdges = true,
  fadeWidth = 24,
  barHeight: baseBarHeight = 4,
  height = 64,
  sensitivity = 1,
  smoothingTimeConstant = 0.8,
  fftSize = 256,
  historySize = 60,
  updateRate = 30,
  mode = "static",
  onError,
  onStreamReady,
  onStreamEnd,
  className,
  ...props
}: LiveWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<number[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const processingAnimationRef = useRef<number | null>(null);
  const processingBarsRef = useRef<number[]>([]);
  const needsRedrawRef = useRef(true);
  const cachedGradientRef = useRef<{
    width: number;
    gradient: CanvasGradient | null;
  }>({ width: 0, gradient: null });

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  // Set up microphone capture
  useEffect(() => {
    if (!active) {
      // Cleanup when deactivated
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        onStreamEnd?.();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      historyRef.current = [];
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        onStreamReady?.(stream);

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = smoothingTimeConstant;
        source.connect(analyser);
        analyserRef.current = analyser;
      } catch (err) {
        if (!cancelled) {
          onError?.(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        onStreamEnd?.();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
    };
  }, [
    active,
    deviceId,
    fftSize,
    smoothingTimeConstant,
    onError,
    onStreamReady,
    onStreamEnd,
  ]);

  // Processing animation
  useEffect(() => {
    if (!processing) {
      if (processingAnimationRef.current) {
        cancelAnimationFrame(processingAnimationRef.current);
        processingAnimationRef.current = null;
      }
      processingBarsRef.current = [];
      needsRedrawRef.current = true;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const step = barWidth + barGap;
    const barCount = Math.floor(rect.width / step);
    const halfCount = Math.floor(barCount / 2);

    const animateProcessing = () => {
      const time = Date.now() / 1000;
      const newBars: number[] = [];

      for (let i = 0; i < barCount; i++) {
        const distFromCenter = Math.abs(i - halfCount) / halfCount;
        const wave = Math.sin(time * 4 + i * 0.3) * 0.3 * (1 - distFromCenter);
        newBars.push(Math.max(0.05, 0.15 + wave));
      }

      processingBarsRef.current = newBars;
      needsRedrawRef.current = true;
      processingAnimationRef.current = requestAnimationFrame(animateProcessing);
    };

    processingAnimationRef.current = requestAnimationFrame(animateProcessing);

    return () => {
      if (processingAnimationRef.current) {
        cancelAnimationFrame(processingAnimationRef.current);
      }
    };
  }, [processing, barWidth, barGap]);

  // Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height: h } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        needsRedrawRef.current = true;
        cachedGradientRef.current = { width: 0, gradient: null };
      }
    });
    resizeObserver.observe(container);

    const updateInterval = 1000 / updateRate;

    const animate = (timestamp: number) => {
      animationRef.current = requestAnimationFrame(animate);

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Process audio data
      if (active && analyserRef.current) {
        const analyser = analyserRef.current;

        if (timestamp - lastUpdateRef.current >= updateInterval) {
          lastUpdateRef.current = timestamp;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);

          if (mode === "static") {
            const startFreq = Math.floor(dataArray.length * 0.05);
            const endFreq = Math.floor(dataArray.length * 0.4);
            const relevantData = dataArray.slice(startFreq, endFreq);

            const step = barWidth + barGap;
            const bCount = Math.floor(rect.width / step);
            const halfCount = Math.floor(bCount / 2);
            const newBars: number[] = [];

            // Mirror the data for symmetric display
            for (let i = halfCount - 1; i >= 0; i--) {
              const dataIndex = Math.floor(
                (i / halfCount) * relevantData.length
              );
              const value = Math.min(
                1,
                (relevantData[dataIndex] / 255) * sensitivity
              );
              newBars.push(Math.max(0.05, value));
            }

            for (let i = 0; i < halfCount; i++) {
              const dataIndex = Math.floor(
                (i / halfCount) * relevantData.length
              );
              const value = Math.min(
                1,
                (relevantData[dataIndex] / 255) * sensitivity
              );
              newBars.push(Math.max(0.05, value));
            }

            historyRef.current = newBars;
          } else {
            // Scrolling mode: push average volume to history
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = (sum / dataArray.length / 255) * sensitivity;
            historyRef.current.push(Math.max(0.05, Math.min(1, avg)));

            if (historyRef.current.length > historySize) {
              historyRef.current.shift();
            }
          }
          needsRedrawRef.current = true;
        }
      }

      // Only redraw when needed
      if (!needsRedrawRef.current && !active) {
        return;
      }
      needsRedrawRef.current = active;

      ctx.clearRect(0, 0, rect.width, rect.height);

      const computedBarColor =
        barColor ||
        (() => {
          const style = getComputedStyle(canvas);
          return style.color || "#000";
        })();

      const step = barWidth + barGap;
      const barCount = Math.floor(rect.width / step);
      const centerY = rect.height / 2;

      if (mode === "static") {
        const dataToRender = processing
          ? processingBarsRef.current
          : historyRef.current;

        for (let i = 0; i < barCount && i < dataToRender.length; i++) {
          const value = dataToRender[i] || 0.1;
          const x = i * step;
          const bh = Math.max(baseBarHeight, value * rect.height * 0.8);
          const y = centerY - bh / 2;

          ctx.fillStyle = computedBarColor;
          ctx.globalAlpha = 0.4 + value * 0.6;

          if (barRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, bh, barRadius);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, barWidth, bh);
          }
        }
      } else {
        // Scrolling mode: draw history from right to left
        for (let i = 0; i < barCount && i < historyRef.current.length; i++) {
          const dataIndex = historyRef.current.length - 1 - i;
          const value = historyRef.current[dataIndex] || 0.1;
          const x = rect.width - (i + 1) * step;
          const bh = Math.max(baseBarHeight, value * rect.height * 0.8);
          const y = centerY - bh / 2;

          ctx.fillStyle = computedBarColor;
          ctx.globalAlpha = 0.4 + value * 0.6;

          if (barRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, bh, barRadius);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, barWidth, bh);
          }
        }
      }

      // Apply edge fading
      if (fadeEdges && fadeWidth > 0 && rect.width > 0) {
        if (
          cachedGradientRef.current.width !== rect.width ||
          !cachedGradientRef.current.gradient
        ) {
          const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
          gradient.addColorStop(0, "rgba(0,0,0,1)");
          gradient.addColorStop(
            Math.min(fadeWidth / rect.width, 0.5),
            "rgba(0,0,0,0)"
          );
          gradient.addColorStop(
            1 - Math.min(fadeWidth / rect.width, 0.5),
            "rgba(0,0,0,0)"
          );
          gradient.addColorStop(1, "rgba(0,0,0,1)");
          cachedGradientRef.current = {
            width: rect.width,
            gradient,
          };
        }

        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = 1;
        ctx.fillStyle = cachedGradientRef.current.gradient!;
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.globalAlpha = 1;
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [
    active,
    processing,
    barWidth,
    barGap,
    barRadius,
    barColor,
    fadeEdges,
    fadeWidth,
    baseBarHeight,
    sensitivity,
    mode,
    historySize,
    updateRate,
  ]);

  return (
    <div
      ref={containerRef}
      data-slot="live-waveform"
      className={cn("relative", className)}
      style={{ height: heightStyle }}
      {...props}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

LiveWaveform.displayName = "LiveWaveform";
