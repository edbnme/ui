/**
 * Registry Update Script
 *
 * This script generates the component registry JSON files for both
 * animated and static component variants.
 *
 * Output Structure:
 *   public/r/
 *   ├── animated/
 *   │   ├── button.json
 *   │   ├── alert-dialog.json
 *   │   └── ...
 *   ├── static/
 *   │   ├── button.json
 *   │   ├── alert-dialog.json
 *   │   └── ...
 *   ├── shared/
 *   │   ├── avatar.json
 *   │   ├── input.json
 *   │   └── ...
 *   ├── registry.json (main index)
 *   └── [legacy flat structure for backwards compatibility]
 *
 * @packageDocumentation
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

// =============================================================================
// REGISTRY CONFIGURATION
// =============================================================================

/**
 * Animated component registry (with motion/react)
 */
const animatedComponents = {
  button: {
    type: "registry:ui",
    title: "Button",
    description:
      "Animated button component with press feedback, loading states, and icon support.",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "motion",
      "@phosphor-icons/react",
      "tw-animate-css",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: ["motion-provider", "icons", "use-ripple"],
    files: [{ path: "components/ui/animated/button.tsx", type: "registry:ui" }],
    variant: "animated",
  },
  "alert-dialog": {
    type: "registry:ui",
    title: "Alert Dialog",
    description:
      "Animated modal dialog with morphing animations, focus trap, and controlled/uncontrolled state.",
    dependencies: ["motion", "@phosphor-icons/react", "tw-animate-css"],
    registryDependencies: ["utils", "button"],
    inlineDependencies: [
      "motion-provider",
      "animations",
      "tokens",
      "use-stable-id",
      "use-controllable-state",
    ],
    files: [{ path: "components/ui/animated/alert-dialog.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "animated",
  },
  popover: {
    type: "registry:ui",
    title: "Popover",
    description:
      "Animated popover component with morphing transitions, focus trap, and click-outside handling.",
    dependencies: ["motion", "tw-animate-css"],
    registryDependencies: ["utils"],
    inlineDependencies: [
      "motion-provider",
      "animations",
      "tokens",
      "use-stable-id",
      "use-controllable-state",
      "use-click-outside",
    ],
    files: [{ path: "components/ui/animated/popover.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "animated",
  },
  "dropdown-menu": {
    type: "registry:ui",
    title: "Dropdown Menu",
    description:
      "Animated dropdown menu with smooth spring animations and staggered item reveals.",
    dependencies: [
      "@radix-ui/react-dropdown-menu",
      "motion",
      "@phosphor-icons/react",
      "tw-animate-css",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: ["motion-provider", "animations", "tokens"],
    files: [{ path: "components/ui/animated/dropdown-menu.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "animated",
  },
  "pull-down": {
    type: "registry:ui",
    title: "Pull Down Menu",
    description:
      "A pull down menu with morphing animations. The trigger morphs into the menu container with spring physics.",
    dependencies: ["motion", "@phosphor-icons/react", "tw-animate-css"],
    registryDependencies: ["utils"],
    inlineDependencies: ["motion-provider"],
    files: [{ path: "components/ui/animated/pull-down.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "animated",
  },
  sheet: {
    type: "registry:ui",
    title: "Sheet",
    description:
      "A slide-out panel component with drag-to-dismiss, multiple sides, and smooth animations.",
    dependencies: [
      "@radix-ui/react-dialog",
      "@phosphor-icons/react",
      "class-variance-authority",
      "motion",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: ["motion-provider", "icons"],
    files: [{ path: "components/ui/animated/sheet.tsx", type: "registry:ui" }],
    variant: "animated",
  },
  sidebar: {
    type: "registry:ui",
    title: "Sidebar",
    description:
      "A responsive sidebar component with collapsible states, mobile sheet mode, and keyboard shortcuts.",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "@phosphor-icons/react",
    ],
    registryDependencies: [
      "utils",
      "button",
      "input",
      "separator",
      "sheet",
      "skeleton",
      "tooltip",
    ],
    inlineDependencies: ["use-mobile"],
    files: [{ path: "components/ui/sidebar.tsx", type: "registry:ui" }],
    variant: "animated",
  },
  "wheel-picker": {
    type: "registry:ui",
    title: "Wheel Picker",
    description:
      "iOS-style wheel picker with smooth inertia scrolling, infinite loop support, and keyboard navigation.",
    dependencies: ["@ncdai/react-wheel-picker"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/wheel-picker.tsx", type: "registry:ui" }],
    variant: "animated",
  },
  "shimmering-text": {
    type: "registry:ui",
    title: "Shimmering Text",
    description:
      "Animated text with per-character color shimmer effect. Perfect for 'slide to unlock' style UIs.",
    dependencies: ["motion"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/animated/shimmering-text.tsx", type: "registry:ui" }],
    variant: "animated",
    credits: "@ncdai (https://chanhdai.com/components/slide-to-unlock)",
  },
  "slide-to-unlock": {
    type: "registry:ui",
    title: "Slide to Unlock",
    description:
      "A sleek, interactive slider inspired by the classic iPhone OS 'slide to unlock' gesture.",
    dependencies: ["motion"],
    registryDependencies: ["utils", "shimmering-text"],
    inlineDependencies: [],
    files: [{ path: "components/ui/animated/slide-to-unlock.tsx", type: "registry:ui" }],
    variant: "animated",
    credits: "@ncdai (https://chanhdai.com/components/slide-to-unlock)",
  },
};

/**
 * Static component registry (CSS-only, no motion)
 */
const staticComponents = {
  "button-static": {
    type: "registry:ui",
    title: "Button (Static)",
    description:
      "Static button component with CSS transitions only. No motion dependency required.",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "@phosphor-icons/react",
      "tw-animate-css",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: ["use-ripple", "icons-static"],
    files: [{ path: "components/ui/static/button.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "alert-dialog-static": {
    type: "registry:ui",
    title: "Alert Dialog (Static)",
    description:
      "Static modal dialog with CSS transitions only. No motion dependency required.",
    dependencies: ["@phosphor-icons/react", "tw-animate-css"],
    registryDependencies: ["utils"],
    inlineDependencies: [
      "use-stable-id",
      "use-controllable-state",
    ],
    files: [{ path: "components/ui/static/alert-dialog.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "static",
  },
  "popover-static": {
    type: "registry:ui",
    title: "Popover (Static)",
    description:
      "Static popover component with CSS transitions only. No motion dependency required.",
    dependencies: ["@radix-ui/react-slot", "tw-animate-css"],
    registryDependencies: ["utils"],
    inlineDependencies: [
      "use-stable-id",
      "use-controllable-state",
      "use-click-outside",
    ],
    files: [{ path: "components/ui/static/popover.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "static",
  },
  "dropdown-menu-static": {
    type: "registry:ui",
    title: "Dropdown Menu (Static)",
    description:
      "Static dropdown menu with CSS transitions only. No motion dependency required.",
    dependencies: [
      "@radix-ui/react-dropdown-menu",
      "@phosphor-icons/react",
      "tw-animate-css",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/dropdown-menu.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "static",
  },
  "pull-down-static": {
    type: "registry:ui",
    title: "Pull Down Menu (Static)",
    description:
      "A pull down menu with CSS animations. No motion dependency required (~30KB savings).",
    dependencies: ["@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/pull-down.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "sheet-static": {
    type: "registry:ui",
    title: "Sheet (Static)",
    description:
      "A slide-out panel component with CSS animations. No motion dependency required.",
    dependencies: [
      "@radix-ui/react-dialog",
      "class-variance-authority",
      "@phosphor-icons/react",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/sheet.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "sidebar-static": {
    type: "registry:ui",
    title: "Sidebar (Static)",
    description:
      "A responsive sidebar component with CSS animations. No motion dependency required.",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "@phosphor-icons/react",
    ],
    registryDependencies: [
      "utils",
      "button-static",
      "input",
      "separator",
      "sheet-static",
      "skeleton",
      "tooltip",
    ],
    inlineDependencies: ["use-mobile"],
    files: [{ path: "components/ui/static/sidebar.tsx", type: "registry:ui" }],
    variant: "static",
  },
};

/**
 * Shared components (no animation dependency, used by both variants)
 */
const sharedComponents = {
  avatar: {
    type: "registry:ui",
    title: "Avatar",
    description:
      "Composable avatar component with sizes, status indicators, and group stacking support.",
    dependencies: ["@radix-ui/react-avatar", "class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/shared/avatar.tsx", type: "registry:ui" }],
    variant: "shared",
  },
  input: {
    type: "registry:ui",
    title: "Input",
    description:
      "A styled input component with focus states, validation support, and file input styling.",
    dependencies: [],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/shared/input.tsx", type: "registry:ui" }],
    variant: "shared",
  },
  "scroll-area": {
    type: "registry:ui",
    title: "Scroll Area",
    description:
      "A scrollable area with custom scrollbars built on Radix UI ScrollArea.",
    dependencies: ["@radix-ui/react-scroll-area"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/shared/scroll-area.tsx", type: "registry:ui" }],
    variant: "shared",
  },
  separator: {
    type: "registry:ui",
    title: "Separator",
    description:
      "A visual separator for dividing content, supporting horizontal and vertical orientations.",
    dependencies: ["@radix-ui/react-separator"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/shared/separator.tsx", type: "registry:ui" }],
    variant: "shared",
  },
  skeleton: {
    type: "registry:ui",
    title: "Skeleton",
    description:
      "A loading placeholder component with pulse animation for content loading states.",
    dependencies: [],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/shared/skeleton.tsx", type: "registry:ui" }],
    variant: "shared",
  },
  slider: {
    type: "registry:ui",
    title: "Slider",
    description:
      "A range slider component with single or multiple thumbs, built on Radix UI Slider.",
    dependencies: ["@radix-ui/react-slider"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/shared/slider.tsx", type: "registry:ui" }],
    variant: "shared",
  },
  tooltip: {
    type: "registry:ui",
    title: "Tooltip",
    description:
      "A tooltip component with smooth animations and configurable positioning.",
    dependencies: ["@radix-ui/react-tooltip"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/shared/tooltip.tsx", type: "registry:ui" }],
    variant: "shared",
  },
};

/**
 * Library utilities
 */
const libraryComponents = {
  "motion-provider": {
    type: "registry:component",
    title: "Motion Provider",
    description:
      "Global animation configuration provider with reduced motion and low-power device detection.",
    dependencies: ["motion", "tw-animate-css"],
    registryDependencies: [],
    inlineDependencies: [],
    files: [
      { path: "components/motion-provider.tsx", type: "registry:component" },
      { path: "hooks/use-reduced-motion.ts", type: "registry:hook" },
      { path: "hooks/use-low-power-device.ts", type: "registry:hook" },
      { path: "lib/motion.ts", type: "registry:lib" },
    ],
    variant: "animated",
  },
  animations: {
    type: "registry:lib",
    title: "Animations",
    description:
      "Motion system with spring presets, transitions, and variant factories.",
    dependencies: ["motion", "tw-animate-css"],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "lib/animations.ts", type: "registry:lib" }],
    variant: "animated",
  },
  "static-transitions": {
    type: "registry:lib",
    title: "Static Transitions",
    description:
      "CSS-only transition utilities for static components.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "lib/static-transitions.ts", type: "registry:lib" }],
    variant: "static",
  },
  tokens: {
    type: "registry:lib",
    title: "Design Tokens",
    description:
      "Centralized design tokens for colors, spacing, typography, shadows, and more.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "lib/tokens.ts", type: "registry:lib" }],
    variant: "shared",
  },
  icons: {
    type: "registry:lib",
    title: "Animated Icons",
    description:
      "Animated icon components including loading spinners, morphing icons, and close buttons.",
    dependencies: ["motion", "@phosphor-icons/react", "tw-animate-css"],
    registryDependencies: ["utils"],
    inlineDependencies: ["motion-provider"],
    files: [{ path: "lib/icons.tsx", type: "registry:lib" }],
    variant: "animated",
  },
  "icons-static": {
    type: "registry:lib",
    title: "Static Icons",
    description:
      "CSS-only icon components for static variants.",
    dependencies: ["@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "lib/icons-static.tsx", type: "registry:lib" }],
    variant: "static",
  },
  utils: {
    type: "registry:lib",
    title: "Utils",
    description: "Utility functions including cn() for class merging.",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "lib/utils.ts", type: "registry:lib" }],
    variant: "shared",
  },
};

/**
 * Hooks
 */
const hookComponents = {
  "use-click-outside": {
    type: "registry:hook",
    title: "useClickOutside",
    description: "Hook to detect clicks outside a referenced element.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-click-outside.tsx", type: "registry:hook" }],
    variant: "shared",
  },
  "use-stable-id": {
    type: "registry:hook",
    title: "useStableId",
    description:
      "SSR-safe hook for generating stable unique IDs for accessibility attributes.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-stable-id.ts", type: "registry:hook" }],
    variant: "shared",
  },
  "use-controllable-state": {
    type: "registry:hook",
    title: "useControllableState",
    description:
      "Hook for handling controlled/uncontrolled state pattern in components.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-controllable-state.ts", type: "registry:hook" }],
    variant: "shared",
  },
  "use-merged-refs": {
    type: "registry:hook",
    title: "useMergedRefs",
    description: "Hook to merge multiple refs into a single callback ref.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-merged-refs.ts", type: "registry:hook" }],
    variant: "shared",
  },
  "use-mobile": {
    type: "registry:hook",
    title: "useMobile",
    description: "Hook to detect mobile viewport based on media query.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-mobile.ts", type: "registry:hook" }],
    variant: "shared",
  },
  "use-ripple": {
    type: "registry:hook",
    title: "useRipple",
    description:
      "Hook for creating ripple effects on click interactions.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-ripple.ts", type: "registry:hook" }],
    variant: "shared",
  },
};

// Merge all components
const allComponents = {
  ...animatedComponents,
  ...staticComponents,
  ...sharedComponents,
  ...libraryComponents,
  ...hookComponents,
};

// =============================================================================
// CSS VARS CONFIGURATION
// =============================================================================

const cssVarsLight = {
  radius: "0.75rem",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",
  card: "oklch(1 0 0)",
  "card-foreground": "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)",
  "popover-foreground": "oklch(0.145 0 0)",
  primary: "oklch(0.205 0 0)",
  "primary-foreground": "oklch(0.985 0 0)",
  secondary: "oklch(0.97 0 0)",
  "secondary-foreground": "oklch(0.205 0 0)",
  muted: "oklch(0.97 0 0)",
  "muted-foreground": "oklch(0.556 0 0)",
  accent: "oklch(0.97 0 0)",
  "accent-foreground": "oklch(0.205 0 0)",
  destructive: "oklch(0.577 0.245 27.325)",
  "destructive-foreground": "oklch(0.985 0 0)",
  border: "oklch(0.922 0 0)",
  input: "oklch(0.922 0 0)",
  ring: "oklch(0.708 0 0)",
  "chart-1": "oklch(0.646 0.222 41.116)",
  "chart-2": "oklch(0.6 0.118 184.704)",
  "chart-3": "oklch(0.398 0.07 227.392)",
  "chart-4": "oklch(0.828 0.189 84.429)",
  "chart-5": "oklch(0.769 0.188 70.08)",
  sidebar: "oklch(0.985 0 0)",
  "sidebar-foreground": "oklch(0.145 0 0)",
  "sidebar-primary": "oklch(0.205 0 0)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.97 0 0)",
  "sidebar-accent-foreground": "oklch(0.205 0 0)",
  "sidebar-border": "oklch(0.922 0 0)",
  "sidebar-ring": "oklch(0.708 0 0)",
};

const cssVarsDark = {
  background: "oklch(0.21 0.006 285.885)",
  foreground: "oklch(0.985 0 0)",
  card: "oklch(0.205 0 0)",
  "card-foreground": "oklch(0.985 0 0)",
  popover: "oklch(0.205 0 0)",
  "popover-foreground": "oklch(0.985 0 0)",
  primary: "oklch(0.922 0 0)",
  "primary-foreground": "oklch(0.205 0 0)",
  secondary: "oklch(0.269 0 0)",
  "secondary-foreground": "oklch(0.985 0 0)",
  muted: "oklch(0.269 0 0)",
  "muted-foreground": "oklch(0.708 0 0)",
  accent: "oklch(0.269 0 0)",
  "accent-foreground": "oklch(0.985 0 0)",
  destructive: "oklch(0.704 0.191 22.216)",
  "destructive-foreground": "oklch(0.985 0 0)",
  border: "oklch(1 0 0 / 10%)",
  input: "oklch(1 0 0 / 15%)",
  ring: "oklch(0.556 0 0)",
  "chart-1": "oklch(0.488 0.243 264.376)",
  "chart-2": "oklch(0.696 0.17 162.48)",
  "chart-3": "oklch(0.769 0.188 70.08)",
  "chart-4": "oklch(0.627 0.265 303.9)",
  "chart-5": "oklch(0.645 0.246 16.439)",
  sidebar: "oklch(0.205 0 0)",
  "sidebar-foreground": "oklch(0.985 0 0)",
  "sidebar-primary": "oklch(0.488 0.243 264.376)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.269 0 0)",
  "sidebar-accent-foreground": "oklch(0.985 0 0)",
  "sidebar-border": "oklch(1 0 0 / 10%)",
  "sidebar-ring": "oklch(0.556 0 0)",
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function escapeContent(content) {
  return content;
}

function updateRegistryFile(name, config, outputDir) {
  const allFiles = [...config.files];

  // Add files from inline dependencies
  if (config.inlineDependencies && config.inlineDependencies.length > 0) {
    config.inlineDependencies.forEach((depName) => {
      const depConfig = allComponents[depName];
      if (depConfig) {
        allFiles.push(...depConfig.files);
      }
    });
  }

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: config.type,
    title: config.title,
    description: config.description,
    dependencies: config.dependencies,
    registryDependencies: config.registryDependencies,
    variant: config.variant,
    files: allFiles.map((file) => {
      const fullPath = join(root, file.path);
      try {
        const content = readFileSync(fullPath, "utf-8");
        return {
          path: file.path,
          content: escapeContent(content),
          type: file.type,
        };
      } catch (_error) {
        console.warn(`[WARN] File not found: ${file.path}`);
        return {
          path: file.path,
          content: "",
          type: file.type,
        };
      }
    }),
  };

  // Add CSS vars configuration if present
  if (config.cssVars) {
    registryItem.cssVars = {
      light: cssVarsLight,
      dark: cssVarsDark,
    };
  }

  // Write to variant-specific subdirectory
  const variantDir = join(outputDir, config.variant || "shared");
  ensureDir(variantDir);
  
  const outputPath = join(variantDir, `${name.replace("-static", "")}.json`);
  writeFileSync(outputPath, JSON.stringify(registryItem, null, 2), "utf-8");
  
  // Also write to flat structure for backwards compatibility
  const flatPath = join(outputDir, `${name}.json`);
  writeFileSync(flatPath, JSON.stringify(registryItem, null, 2), "utf-8");
  
  console.log(`[OK] Updated ${config.variant}/${name}.json`);
}

function updateMainRegistry(outputDir) {
  // Group items by variant
  const animatedItems = [];
  const staticItems = [];
  const sharedItems = [];

  Object.entries(allComponents).forEach(([name, config]) => {
    const item = {
      name,
      type: config.type,
      title: config.title,
      description: config.description,
      dependencies: config.dependencies,
      registryDependencies: config.registryDependencies,
      variant: config.variant,
      files: config.files.map((f) => ({ path: f.path, type: f.type })),
    };

    if (config.variant === "animated") {
      animatedItems.push(item);
    } else if (config.variant === "static") {
      staticItems.push(item);
    } else {
      sharedItems.push(item);
    }
  });

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "edbn-ui",
    version: "0.3.0",
    homepage: "https://ui.edbn.me",
    variants: {
      animated: {
        name: "Animated",
        description: "Components with motion/react spring animations",
        dependencies: ["motion"],
        cssImport: "@/lib/styles/animated.css",
      },
      static: {
        name: "Static",
        description: "Components with CSS-only animations (lighter bundle)",
        dependencies: [],
        cssImport: "@/lib/styles/static.css",
      },
    },
    items: [...animatedItems, ...staticItems, ...sharedItems],
  };

  const registryPath = join(root, "registry.json");
  writeFileSync(registryPath, JSON.stringify(registry, null, 2), "utf-8");
  console.log("[OK] Updated registry.json");

  const publicRegistryPath = join(outputDir, "registry.json");
  writeFileSync(publicRegistryPath, JSON.stringify(registry, null, 2), "utf-8");
  console.log("[OK] Updated public/r/registry.json");
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

// ASCII Art Banner - EDBN UI
const banner = [
  "",
  "   ███████ ██████  ██████  ███    ██   ██    ██ ██████",
  "   ██      ██   ██ ██   ██ ████   ██   ██    ██   ██  ",
  "   █████   ██   ██ ██████  ██ ██  ██   ██    ██   ██  ",
  "   ██      ██   ██ ██   ██ ██  ██ ██   ██    ██   ██  ",
  "   ███████ ██████  ██████  ██   ████    ██████  ██████",
  "",
].join("\n");

console.log(banner);
console.log("[REGISTRY] Updating registry files...\n");

const outputDir = join(root, "public", "r");

// Ensure output directories exist
ensureDir(outputDir);
ensureDir(join(outputDir, "animated"));
ensureDir(join(outputDir, "static"));
ensureDir(join(outputDir, "shared"));

// Update individual component registry files
Object.entries(allComponents).forEach(([name, config]) => {
  try {
    updateRegistryFile(name, config, outputDir);
  } catch (error) {
    console.error(`[ERROR] Failed to update ${name}.json:`, error.message);
  }
});

// Update main registry
try {
  updateMainRegistry(outputDir);
} catch (error) {
  console.error("[ERROR] Failed to update main registry:", error.message);
}

console.log("\n[DONE] Registry update complete!");
console.log("\nOutput structure:");
console.log("  public/r/");
console.log("  ├── animated/   (motion/react components)");
console.log("  ├── static/     (CSS-only components)");
console.log("  ├── shared/     (variant-agnostic components)");
console.log("  └── registry.json");

// =============================================================================
// BUNDLE SIZE COMPUTATION
// =============================================================================

console.log("\n[BUNDLE] Computing bundle sizes...\n");

import("./compute-bundle-sizes.mjs").catch((error) => {
  console.warn("[WARN] Bundle size computation skipped:", error.message);
  console.log("   Run 'node oss/scripts/compute-bundle-sizes.mjs' manually to generate bundle data.");
});

