/**
 * Component Variant Index
 *
 * IMPORTANT: This project uses isolated component variants.
 * Import components explicitly from their variant folders:
 *
 *   Animated (motion/react): @/components/ui/animated/button
 *   Static (CSS-only):       @/components/ui/static/button
 *
 * Standalone components (no variant) are exported below.
 *
 * @packageDocumentation
 */

// =============================================================================
// STANDALONE COMPONENTS (not part of animated/static variant system)
// =============================================================================

export { Toaster } from "./sonner";
export { WheelPicker } from "./wheel-picker";

// =============================================================================
// VARIANT TYPES
// =============================================================================

export type ComponentVariant = "animated" | "static";
