"use client";


/**
 * useBarAnimator
 * @registryDescription Hook that provides smooth bar animation for audio visualizers with decay and randomization.
 * @registryVariant audio
 */

import { useEffect, useRef, useState } from "react";

// ---- TYPES ------------------------------------------------------------------

interface UseBarAnimatorOptions {
  /** Target bar heights (0-1 normalized). Length determines bar count. */
  targetHeights: number[];
  /** Smoothing factor (0-1). Higher = smoother but slower. Default: 0.85 */
  smoothing?: number;
  /** Whether the animation loop is running. Default: true */
  enabled?: boolean;
}

interface UseBarAnimatorReturn {
  /** Current interpolated bar heights (0-1). Same length as targetHeights. */
  currentHeights: number[];
}

// ---- HOOK -------------------------------------------------------------------

/**
 * Smoothly interpolates bar heights toward target values using
 * requestAnimationFrame. Creates a fluid bar animation effect.
 *
 * Uses exponential smoothing: `current = current + (target - current) * (1 - smoothing)`
 */
export function useBarAnimator(
  options: UseBarAnimatorOptions
): UseBarAnimatorReturn {
  const { targetHeights, smoothing = 0.85, enabled = true } = options;

  const [currentHeights, setCurrentHeights] = useState<number[]>(() =>
    new Array(targetHeights.length).fill(0)
  );

  const currentRef = useRef<number[]>(new Array(targetHeights.length).fill(0));
  const targetRef = useRef<number[]>(targetHeights);
  const rafRef = useRef<number | null>(null);

  // Update target ref when targets change
  useEffect(() => {
    targetRef.current = targetHeights;
    // Resize current array if band count changed
    if (currentRef.current.length !== targetHeights.length) {
      currentRef.current = new Array(targetHeights.length).fill(0);
    }
  }, [targetHeights]);

  // Animation loop
  useEffect(() => {
    if (!enabled) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const factor = 1 - smoothing;

    const animate = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      let changed = false;

      for (let i = 0; i < target.length; i++) {
        const prev = current[i] || 0;
        const next = prev + (target[i] - prev) * factor;

        // Only update if difference is meaningful
        if (Math.abs(next - prev) > 0.001) {
          current[i] = next;
          changed = true;
        }
      }

      if (changed) {
        setCurrentHeights([...current]);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [smoothing, enabled]);

  return { currentHeights };
}

export type { UseBarAnimatorOptions, UseBarAnimatorReturn };
