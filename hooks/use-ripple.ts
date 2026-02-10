"use client";

import { useState, useCallback, useEffect } from "react";
import type * as React from "react";

/**
 * Ripple effect data structure
 */
export interface Ripple {
  x: number;
  y: number;
  size: number;
  key: number;
}

/**
 * Hook to manage ripple effects on button click
 *
 * Creates expanding circular ripples from the click point,
 * automatically cleaning up after animation completes.
 */
export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple: Ripple = { x, y, size, key: Date.now() };
      setRipples((prev) => [...prev, newRipple]);
    },
    [],
  );

  // Auto-cleanup ripples after animation
  useEffect(() => {
    if (ripples.length > 0) {
      const lastRipple = ripples[ripples.length - 1];
      const timeout = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.key !== lastRipple.key));
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [ripples]);

  return { ripples, createRipple };
}
