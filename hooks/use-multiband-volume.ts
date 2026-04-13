"use client";

import { useMemo } from "react";

// =============================================================================
// TYPES
// =============================================================================

interface UseMultibandVolumeOptions {
  /** Number of frequency bands to split into. Default: 5 */
  bands?: number;
  /** Minimum value threshold (0-255). Values below this become 0. Default: 0 */
  minThreshold?: number;
}

interface UseMultibandVolumeReturn {
  /** Array of band volumes, each 0-1. Length equals `bands`. */
  bandVolumes: number[];
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Splits raw frequency data (Uint8Array from AnalyserNode.getByteFrequencyData)
 * into N bands and returns normalized volume levels (0-1) per band.
 *
 * Typical band mapping (5 bands):
 * - Band 0: Sub-bass (0-60 Hz)
 * - Band 1: Bass (60-250 Hz)
 * - Band 2: Low-mid (250-2000 Hz)
 * - Band 3: High-mid (2000-6000 Hz)
 * - Band 4: Treble (6000+ Hz)
 */
export function useMultibandVolume(
  data: Uint8Array | null,
  options: UseMultibandVolumeOptions = {}
): UseMultibandVolumeReturn {
  const { bands = 5, minThreshold = 0 } = options;

  const bandVolumes = useMemo(() => {
    if (!data || data.length === 0) {
      return new Array(bands).fill(0) as number[];
    }

    const bandSize = Math.floor(data.length / bands);
    const result: number[] = [];

    for (let i = 0; i < bands; i++) {
      const start = i * bandSize;
      const end = i === bands - 1 ? data.length : start + bandSize;

      let sum = 0;
      let count = 0;
      for (let j = start; j < end; j++) {
        const val = data[j] > minThreshold ? data[j] : 0;
        sum += val;
        count++;
      }

      // Normalize to 0-1 range (max byte value = 255)
      result.push(count > 0 ? sum / count / 255 : 0);
    }

    return result;
  }, [data, bands, minThreshold]);

  return { bandVolumes };
}

export type { UseMultibandVolumeOptions, UseMultibandVolumeReturn };
