# Archived Components

> **Archived:** 2026-03-12
> **Reason:** Simplified to CSS-only (static) components. Removed motion/react dependency.

This directory contains the archived animated component variants and their supporting
infrastructure. These components used `motion/react` for spring animations.

## Why Archived?

The project consolidated to a single component variant: **static** (CSS-only, Base UI).
This reduces bundle size, eliminates the `motion` dependency, and simplifies maintenance.

## What's Here

| Directory                                         | Description                                                                                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `components/ui/animated/`                         | All animated UI components (button, sheet, alert-dialog, dropdown-menu, popover, pull-down, shimmering-text, slide-to-unlock) |
| `components/ui/sidebar/`                          | Sidebar using animated Button + Sheet                                                                                         |
| `components/motion-provider.tsx`                  | Global animation provider with reduced motion detection                                                                       |
| `lib/motion.ts`                                   | Spring preset constants                                                                                                       |
| `lib/animations/`                                 | Animation system (presets, variants, utils)                                                                                   |
| `lib/icons.tsx`                                   | Animated icon components (spinners, morphing icons)                                                                           |
| `hooks/use-reduced-motion.ts`                     | Reduced motion preference detection                                                                                           |
| `hooks/use-low-power-device.ts`                   | Low power device detection                                                                                                    |
| `scripts/registry-config/animated-components.mjs` | Registry build config for animated components                                                                                 |

## Restoring

To restore any component, copy it back to its original location and update imports.
The animated components require `motion` (motion/react) as a dependency.
