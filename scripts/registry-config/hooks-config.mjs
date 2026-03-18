/**
 * Hook registry configuration
 *
 * @see update-registry.mjs for the main orchestrator
 */

export const hookComponents = {
  "use-click-outside": {
    type: "registry:hook",
    title: "useClickOutside",
    description: "Hook to detect clicks outside a referenced element.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-click-outside.tsx", type: "registry:hook" }],
    variant: "static",
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
    variant: "static",
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
    variant: "static",
  },
  "use-merged-refs": {
    type: "registry:hook",
    title: "useMergedRefs",
    description: "Hook to merge multiple refs into a single callback ref.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-merged-refs.ts", type: "registry:hook" }],
    variant: "static",
  },
  "use-mobile": {
    type: "registry:hook",
    title: "useMobile",
    description: "Hook to detect mobile viewport based on media query.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-mobile.ts", type: "registry:hook" }],
    variant: "static",
  },
  "use-focus-trap": {
    type: "registry:hook",
    title: "useFocusTrap",
    description:
      "Hook to trap focus within a container element for accessibility in modals, dialogs, and sheets.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-focus-trap.ts", type: "registry:hook" }],
    variant: "static",
  },
  "use-prevent-scroll": {
    type: "registry:hook",
    title: "usePreventScroll",
    description:
      "Hook to prevent body scrolling while active, with nested lock support.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-prevent-scroll.ts", type: "registry:hook" }],
    variant: "static",
  },
};
