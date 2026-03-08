/**
 * Library utility registry configuration
 *
 * @see update-registry.mjs for the main orchestrator
 */

export const libraryComponents = {
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
    files: [
      { path: "lib/animations/index.ts", type: "registry:lib" },
      { path: "lib/animations/presets.ts", type: "registry:lib" },
      { path: "lib/animations/variants.ts", type: "registry:lib" },
      { path: "lib/animations/utils.ts", type: "registry:lib" },
    ],
    variant: "animated",
  },
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
};
