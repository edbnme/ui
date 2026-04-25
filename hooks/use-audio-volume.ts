"use client";


/**
 * useAudioVolume
 * @registryDescription Hook that tracks real-time volume level from an audio source using Web Audio API AnalyserNode.
 * @registryVariant audio
 */

import { useCallback, useEffect, useRef, useState } from "react";

// ---- AUDIO CONTEXT SINGLETON ------------------------------------------------

let sharedAudioContext: AudioContext | null = null;

/**
 * Get or create a shared AudioContext singleton.
 * Must be called from a user gesture context (click/touch) on first call.
 * Handles Safari's webkitAudioContext prefix.
 */
function getAudioContext(): AudioContext {
  if (sharedAudioContext && sharedAudioContext.state !== "closed") {
    return sharedAudioContext;
  }

  const AudioContextClass =
    typeof window !== "undefined"
      ? window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      : null;

  if (!AudioContextClass) {
    throw new Error("AudioContext is not supported in this environment");
  }

  sharedAudioContext = new AudioContextClass();
  return sharedAudioContext;
}

// ---- TYPES ------------------------------------------------------------------

interface UseAudioVolumeOptions {
  /** The MediaStream to analyse (e.g., from getUserMedia) */
  stream?: MediaStream | null;
  /** FFT size for the analyser (power of 2). Higher = more data points. Default: 2048 */
  fftSize?: number;
  /** Whether to capture frequency data (true) or time-domain waveform data (false). Default: false */
  frequencyMode?: boolean;
  /** Smoothing time constant for the analyser (0-1). Default: 0.8 */
  smoothingTimeConstant?: number;
  /** Whether the analysis loop is active. Default: true */
  enabled?: boolean;
}

interface UseAudioVolumeReturn {
  /** The current volume data array (Uint8Array). Updated every animation frame. */
  data: Uint8Array | null;
  /** The AnalyserNode instance (for advanced usage) */
  analyser: AnalyserNode | null;
  /** Whether the hook has an active stream connected */
  isActive: boolean;
  /** Error message if AudioContext creation failed */
  error: string | null;
}

// ---- HOOK -------------------------------------------------------------------

export function useAudioVolume(
  options: UseAudioVolumeOptions = {}
): UseAudioVolumeReturn {
  const {
    stream = null,
    fftSize = 2048,
    frequencyMode = false,
    smoothingTimeConstant = 0.8,
    enabled = true,
  } = options;

  const [data, setData] = useState<Uint8Array | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rafRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  // Set up AudioContext + AnalyserNode when stream changes
  useEffect(() => {
    if (!stream || !enabled) {
      setIsActive(false);
      return;
    }

    let audioCtx: AudioContext;
    try {
      audioCtx = getAudioContext();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create AudioContext"
      );
      return;
    }

    // Resume AudioContext if suspended (autoplay policy)
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothingTimeConstant;

    const bufferLength = frequencyMode
      ? analyser.frequencyBinCount
      : analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    let source: MediaStreamAudioSourceNode;
    try {
      source = audioCtx.createMediaStreamSource(stream);
    } catch {
      setError("Failed to create media stream source");
      return;
    }

    source.connect(analyser);
    // Don't connect analyser to destination — we only want to read data, not play it back

    sourceRef.current = source;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    setAnalyserNode(analyser);
    setIsActive(true);
    setError(null);

    // RAF loop
    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      if (frequencyMode) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      } else {
        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
      }

      // Create a new Uint8Array copy to trigger state update
      setData(new Uint8Array(dataArrayRef.current));
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      source.disconnect();
      analyser.disconnect();
      sourceRef.current = null;
      analyserRef.current = null;
      dataArrayRef.current = null;
      setIsActive(false);
    };
  }, [stream, fftSize, frequencyMode, smoothingTimeConstant, enabled]);

  return { data, analyser: analyserNode, isActive, error };
}

export { getAudioContext };
export type { UseAudioVolumeOptions, UseAudioVolumeReturn };
