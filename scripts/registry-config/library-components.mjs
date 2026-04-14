/**
 * Library utility registry configuration
 *
 * @see update-registry.mjs for the main orchestrator
 */

export const libraryComponents = {
  "static-transitions": {
    type: "registry:lib",
    title: "Static Transitions",
    description: "CSS-only transition utilities for static components.",
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
    variant: "static",
  },
  "icons-static": {
    type: "registry:lib",
    title: "Static Icons",
    description: "CSS-only icon components for static variants.",
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
    variant: "static",
  },
  "motion-lib": {
    type: "registry:lib",
    title: "Motion Library",
    description:
      "Spring presets and animation utilities for motion/react components.",
    dependencies: ["motion/react"],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "lib/motion.ts", type: "registry:lib" }],
    variant: "audio",
  },
  "shiki-config": {
    type: "registry:lib",
    title: "Shiki Config",
    description:
      "Shared Shiki theme and pre-style configuration for code highlighting.",
    dependencies: ["shiki"],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "lib/shiki-config.ts", type: "registry:lib" }],
    variant: "audio",
  },
};
