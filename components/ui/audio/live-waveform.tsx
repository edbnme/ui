"use client";

/**
 * Live Waveform
 * @registryDescription Canvas waveform for live microphone input, processing animations, and idle audio states.
 * @registryCategory audio
 */

import { useCallback, useEffect, useRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

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

type AudioContextConstructor = new (
  contextOptions?: AudioContextOptions
) => AudioContext;

// ---- HELPERS ---------------------------------------------------------------

function getAudioContextConstructor() {
  const browserWindow = window as typeof window & {
    webkitAudioContext?: AudioContextConstructor;
  };

  return window.AudioContext ?? browserWindow.webkitAudioContext;
}

// ---- COMPONENT --------------------------------------------------------------

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
  const fadeAnimationRef = useRef<number | null>(null);
  const lastActiveDataRef = useRef<number[]>([]);
  const processingBarsRef = useRef<number[]>([]);
  const needsRedrawRef = useRef(true);
  const cachedGradientRef = useRef<{
    width: number;
    gradient: CanvasGradient | null;
  }>({ width: 0, gradient: null });

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  const teardownAudioCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      onStreamEnd?.();
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }

    audioContextRef.current = null;
    analyserRef.current = null;
  }, [onStreamEnd]);

  // Set up microphone capture
  useEffect(() => {
    if (!active) {
      teardownAudioCapture();
      return;
    }

    let cancelled = false;

    const setup = async () => {
      let capturedStream: MediaStream | null = null;

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("MediaDevices API not available");
        }

        const AudioContextCtor = getAudioContextConstructor();
        if (!AudioContextCtor) {
          throw new Error("AudioContext API not available");
        }

        const constraints: MediaStreamConstraints = {
          audio: {
            ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        };

        capturedStream = await navigator.mediaDevices.getUserMedia(constraints);

        if (cancelled) {
          capturedStream.getTracks().forEach((track) => track.stop());
          return;
        }

        const audioContext = new AudioContextCtor();

        const source = audioContext.createMediaStreamSource(capturedStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = smoothingTimeConstant;
        source.connect(analyser);

        streamRef.current = capturedStream;
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        onStreamReady?.(capturedStream);
      } catch (err) {
        capturedStream?.getTracks().forEach((track) => track.stop());
        if (!cancelled) {
          onError?.(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    setup();

    return () => {
      cancelled = true;
      teardownAudioCapture();
    };
  }, [
    active,
    deviceId,
    fftSize,
    smoothingTimeConstant,
    onError,
    onStreamReady,
    teardownAudioCapture,
  ]);

  // Processing animation
  useEffect(() => {
    if (!processing) {
      if (processingBarsRef.current.length > 0 && mode === "static") {
        historyRef.current = [...processingBarsRef.current];
      }

      if (processingAnimationRef.current) {
        cancelAnimationFrame(processingAnimationRef.current);
        processingAnimationRef.current = null;
      }
      processingBarsRef.current = [];
      needsRedrawRef.current = true;
      return;
    }

    if (active) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let time = 0;
    let transitionProgress = 0;

    const animateProcessing = () => {
      time += 0.03;
      transitionProgress = Math.min(1, transitionProgress + 0.02);

      const rect = containerRef.current?.getBoundingClientRect();
      const barCount = Math.floor((rect?.width || 200) / (barWidth + barGap));
      const processingData: number[] = [];

      if (mode === "static") {
        const halfCount = Math.floor(barCount / 2);

        for (let i = 0; i < barCount; i++) {
          const normalizedPosition = (i - halfCount) / halfCount;
          const centerWeight = 1 - Math.abs(normalizedPosition) * 0.4;

          const wave1 = Math.sin(time * 1.5 + normalizedPosition * 3) * 0.25;
          const wave2 = Math.sin(time * 0.8 - normalizedPosition * 2) * 0.2;
          const wave3 = Math.cos(time * 2 + normalizedPosition) * 0.15;
          const processingValue = (0.2 + wave1 + wave2 + wave3) * centerWeight;

          let finalValue = processingValue;

          if (lastActiveDataRef.current.length > 0 && transitionProgress < 1) {
            const lastDataIndex = Math.min(
              i,
              lastActiveDataRef.current.length - 1
            );
            const lastValue = lastActiveDataRef.current[lastDataIndex] || 0;

            finalValue =
              lastValue * (1 - transitionProgress) +
              processingValue * transitionProgress;
          }

          processingData.push(Math.max(0.05, Math.min(1, finalValue)));
        }

        processingBarsRef.current = processingData;
      } else {
        for (let i = 0; i < barCount; i++) {
          const normalizedPosition = (i - barCount / 2) / (barCount / 2);
          const centerWeight = 1 - Math.abs(normalizedPosition) * 0.4;

          const wave1 = Math.sin(time * 1.5 + i * 0.15) * 0.25;
          const wave2 = Math.sin(time * 0.8 - i * 0.1) * 0.2;
          const wave3 = Math.cos(time * 2 + i * 0.05) * 0.15;
          const processingValue = (0.2 + wave1 + wave2 + wave3) * centerWeight;

          let finalValue = processingValue;

          if (lastActiveDataRef.current.length > 0 && transitionProgress < 1) {
            const lastDataIndex = Math.floor(
              (i / Math.max(barCount, 1)) * lastActiveDataRef.current.length
            );
            const lastValue = lastActiveDataRef.current[lastDataIndex] || 0;

            finalValue =
              lastValue * (1 - transitionProgress) +
              processingValue * transitionProgress;
          }

          processingData.push(Math.max(0.05, Math.min(1, finalValue)));
        }

        historyRef.current = processingData;
      }

      needsRedrawRef.current = true;
      processingAnimationRef.current = requestAnimationFrame(animateProcessing);
    };

    processingAnimationRef.current = requestAnimationFrame(animateProcessing);

    return () => {
      if (processingAnimationRef.current) {
        cancelAnimationFrame(processingAnimationRef.current);
      }
    };
  }, [processing, active, barWidth, barGap, mode]);

  useEffect(() => {
    if (fadeAnimationRef.current) {
      cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = null;
    }

    if (active || processing || historyRef.current.length === 0) {
      return;
    }

    let fadeProgress = 0;

    const fadeToIdle = () => {
      fadeProgress += 0.03;

      if (fadeProgress < 1) {
        historyRef.current = historyRef.current.map(
          (value) => value * (1 - fadeProgress)
        );
        needsRedrawRef.current = true;
        fadeAnimationRef.current = requestAnimationFrame(fadeToIdle);
        return;
      }

      historyRef.current = [];
      needsRedrawRef.current = true;
      fadeAnimationRef.current = null;
    };

    fadeAnimationRef.current = requestAnimationFrame(fadeToIdle);

    return () => {
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
        fadeAnimationRef.current = null;
      }
    };
  }, [active, processing, mode]);

  // Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = (width: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      needsRedrawRef.current = true;
      cachedGradientRef.current = { width: 0, gradient: null };
    };

    const resizeFromBounds = () => {
      const rect = container.getBoundingClientRect();
      resizeCanvas(rect.width, rect.height);
    };

    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver === "undefined") {
      resizeFromBounds();
      window.addEventListener("resize", resizeFromBounds);
    } else {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height: h } = entry.contentRect;
          resizeCanvas(width, h);
        }
      });
      resizeObserver.observe(container);
    }

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
            lastActiveDataRef.current = newBars;
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

            lastActiveDataRef.current = [...historyRef.current];
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
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resizeFromBounds);
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
      className={cn("relative h-full w-full", className)}
      aria-label={
        active
          ? "Live audio waveform"
          : processing
            ? "Processing audio"
            : "Audio waveform idle"
      }
      role="img"
      style={{ height: heightStyle }}
      {...props}
    >
      {!active && !processing && (
        <div className="border-muted-foreground/20 absolute top-1/2 right-0 left-0 -translate-y-1/2 border-t-2 border-dotted" />
      )}
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
};

LiveWaveform.displayName = "LiveWaveform";
