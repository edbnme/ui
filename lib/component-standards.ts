/**
 * Component Standards Contract
 *
 * Defines the enforced conventions for all edbn-ui components.
 * Used by the build-time validation script (validate-registry.mjs)
 * and as documentation for contributors.
 *
 * @packageDocumentation
 */

// =============================================================================
// COMPONENT CONTRACT TYPES
// =============================================================================

/**
 * Every UI component MUST satisfy this contract.
 */
export interface ComponentContract {
  /** Component must include "use client" directive */
  hasUseClientDirective: boolean;
  /** Component must use forwardRef for ref forwarding */
  usesForwardRef: boolean;
  /** Component must include a data-slot attribute for DOM identification */
  hasDataSlot: boolean;
  /** Component must accept className prop for consumer customization */
  acceptsClassName: boolean;
  /** Component must export a PascalCase named component */
  hasPascalCaseExport: boolean;
  /** Component must export a Props interface (e.g. ButtonProps) */
  hasPropsExport: boolean;
}

/**
 * Registry metadata every item MUST declare.
 */
export interface RegistryItemContract {
  /** shadcn registry type */
  type: "registry:ui" | "registry:component" | "registry:lib" | "registry:hook";
  /** Component variant tier */
  variant: "static" | "audio";
  /** npm dependencies (external packages) */
  dependencies: string[];
  /** Other registry items this item depends on */
  registryDependencies: string[];
  /** Files bundled inline with this item (not separate registry items) */
  inlineDependencies: string[];
  /** Source files included in the registry JSON */
  files: Array<{ path: string; type: string }>;
}

// =============================================================================
// VALIDATION PATTERNS (regex for build-time static analysis)
// =============================================================================

/**
 * Patterns used by validate-registry.mjs to check component source files.
 */
export const validationPatterns = {
  /** Matches the "use client" directive at the top of a file */
  useClientDirective: /^["']use client["'];?\s*$/m,

  /** Matches forwardRef usage */
  forwardRef: /forwardRef[<(]/,

  /** Matches data-slot attribute in JSX */
  dataSlot: /data-slot\s*=\s*["']/,

  /** Matches className in component props/interface */
  classNameProp: /className\s*[?:]|\.\.\.props/,

  /** Matches PascalCase export (component name) */
  pascalCaseExport: /export\s+(?:const|function)\s+[A-Z][a-zA-Z]+/,

  /** Matches Props interface/type export */
  propsExport: /export\s+(?:interface|type)\s+\w+Props/,

  /** Matches npm package imports (not relative, not aliased) */
  npmImport: /from\s+["']([^./@ ][^"' ]*|@[^/"' ]+\/[^"' ]+)["']/g,

  /** Matches aliased internal imports (@/lib/*, @/hooks/*, @/components/*) */
  aliasedImport: /from\s+["'](@\/[^"']+)["']/g,

  /**
   * Hardcoded color patterns that should use semantic tokens instead.
   * Matches: bg-white, text-black, bg-red-500, text-green-*, hex in className, etc.
   */
  hardcodedColors:
    /\b(?:bg|text|border|ring|shadow|outline|fill|stroke)-(?:white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d+)?\b/g,

  /** Matches hex color values */
  hexColors: /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g,
} as const;

/**
 * Known exceptions to hardcoded color rules.
 * These components intentionally use non-semantic colors.
 */
export const hardcodedColorExemptions: Record<string, string> = {
  // Avatar status indicators use semantic status colors
  "components/ui/shared/avatar.tsx":
    "Status indicator colors (green/gray/yellow/red) are semantically meaningful",
  // Slide-to-unlock mimics iOS design
  "components/ui/animated/slide-to-unlock.tsx":
    "iOS-specific design requires zinc/white palette",
  // Backdrop overlays use semi-transparent black universally
  "bg-black/50": "Backdrop overlays — bg-black/50 is a universal pattern",
  // Maps components have their own color system
  "maps/": "Maps components use MapLibre-specific color tokens",
};

// =============================================================================
// CSS RULES
// =============================================================================

/**
 * CSS styling rules all components must follow.
 *
 * 1. Use ONLY semantic token classes:
 *    - bg-background, text-foreground, bg-primary, text-primary-foreground
 *    - NOT bg-white, text-black, bg-zinc-100, #ffffff
 *
 * 2. Use CSS custom properties for theming:
 *    - var(--primary), var(--background)
 *    - NOT oklch(0.205 0 0), rgb(255,255,255)
 *
 * 3. All color values must work in both light and dark mode.
 *    Use Tailwind's dark: variant or CSS custom properties that swap.
 *
 * 4. Consumers must import the variant CSS file in their project:
 *    - Animated: @import "@/lib/styles/animated.css"
 *      Provides: ripple keyframe, spring timing tokens, morphing animations
 *    - Static:  @import "@/lib/styles/static.css"
 *      Provides: CSS-only transitions, static button states, loading animations
 *    - Both import base.css automatically (design tokens, layer definitions)
 *
 * 5. tweakcn compatibility:
 *    The CSS variable structure (--primary, --background, etc. in OKLCH)
 *    is shadcn/tweakcn-compatible. Consumers can use tweakcn to customize
 *    the theme without modifying component source code.
 */
export const cssRules = {
  /** Semantic token class prefixes that are always allowed */
  allowedPrefixes: [
    "bg-background",
    "bg-foreground",
    "bg-card",
    "bg-popover",
    "bg-primary",
    "bg-secondary",
    "bg-muted",
    "bg-accent",
    "bg-destructive",
    "bg-sidebar",
    "bg-input",
    "bg-border",
    "text-foreground",
    "text-primary",
    "text-secondary",
    "text-muted",
    "text-accent",
    "text-destructive",
    "text-popover",
    "text-card",
    "text-sidebar",
    "border-border",
    "border-input",
    "border-primary",
    "border-destructive",
    "ring-ring",
    "ring-primary",
    "ring-destructive",
  ],

  /** CSS variable names that must exist in both light and dark mode */
  requiredCssVars: [
    "--background",
    "--foreground",
    "--card",
    "--card-foreground",
    "--popover",
    "--popover-foreground",
    "--primary",
    "--primary-foreground",
    "--secondary",
    "--secondary-foreground",
    "--muted",
    "--muted-foreground",
    "--accent",
    "--accent-foreground",
    "--destructive",
    "--destructive-foreground",
    "--border",
    "--input",
    "--ring",
    "--radius",
  ],
} as const;

// =============================================================================
// EXPORT CONVENTIONS
// =============================================================================

/**
 * File and export naming conventions:
 *
 * Component files:
 *   - PascalCase component: `export const Button = forwardRef(...)`
 *   - Props interface: `export interface ButtonProps extends ...`
 *   - Variants (if CVA): `export const buttonVariants = cva(...)`
 *   - Alias export: `export type { ButtonProps as ButtonRootProps }`
 *
 * Hook files:
 *   - camelCase function: `export function useRipple() { ... }`
 *   - Interface if applicable: `export interface Ripple { ... }`
 *
 * Library files:
 *   - Named exports only (no default exports)
 *   - Group related utilities: `export { cn }` from utils
 *
 * Import order within components:
 *   1. React imports
 *   2. External library imports (alphabetical)
 *   3. Internal imports (@/lib/*, @/hooks/*, @/components/*)
 */
export const exportConventions = {
  /** Components use PascalCase */
  componentNaming: "PascalCase",
  /** Hooks use camelCase with 'use' prefix */
  hookNaming: "camelCase with 'use' prefix",
  /** No default exports — named exports only */
  exportStyle: "named",
  /** displayName must be set for forwardRef components */
  requireDisplayName: true,
} as const;

// =============================================================================
// BASE UI MIGRATION ORDER
// =============================================================================

/**
 * Migration plan from legacy primitives to Base UI (MUI headless).
 *
 * Components import primitives from @/lib/primitives.ts instead of
 * directly from external packages. When migrating, only primitives.ts changes.
 *
 * Migration order (simplest to most complex):
 */
export const baseUIMigrationOrder = [
  {
    package: "@base-ui/react",
    priority: 0,
    status: "active" as const,
    consumers: [
      "accordion",
      "alert-dialog",
      "checkbox",
      "collapsible",
      "context-menu",
      "dialog",
      "dropdown-menu",
      "field",
      "form",
      "input",
      "number-field",
      "popover",
      "preview-card",
      "progress",
      "radio-group",
      "scroll-area",
      "select",
      "separator",
      "sheet",
      "slider",
      "switch",
      "tabs",
      "toast",
      "toggle",
      "toggle-group",
      "toolbar",
      "tooltip",
      "avatar",
    ],
    notes: "Primary headless primitive provider — all components use Base UI",
  },
] as const;
