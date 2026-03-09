/**
 * Animated component registry configuration (with motion/react)
 *
 * @see update-registry.mjs for the main orchestrator
 */

export const animatedComponents = {
  button: {
    type: "registry:ui",
    title: "Button",
    description:
      "Animated button component with press feedback, loading states, and icon support.",
    dependencies: [
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
    files: [
      {
        path: "components/ui/animated/alert-dialog/index.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/alert-dialog/alert-dialog-context.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/alert-dialog/alert-dialog.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/alert-dialog/alert-dialog-content.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/alert-dialog/alert-dialog-parts.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/alert-dialog/alert-dialog-actions.tsx",
        type: "registry:ui",
      },
    ],
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
    files: [
      {
        path: "components/ui/animated/popover/index.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/popover/popover-context.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/popover/popover.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/popover/popover-content.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/popover/popover-parts.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: true,
    variant: "animated",
  },
  "dropdown-menu": {
    type: "registry:ui",
    title: "Dropdown Menu",
    description:
      "Animated dropdown menu with smooth spring animations and staggered item reveals.",
    dependencies: [
      "@base-ui/react",
      "motion",
      "@phosphor-icons/react",
      "tw-animate-css",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: ["motion-provider", "animations", "tokens"],
    files: [
      {
        path: "components/ui/animated/dropdown-menu/index.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/dropdown-menu/dropdown-menu-context.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/dropdown-menu/dropdown-menu-animations.ts",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/dropdown-menu/dropdown-menu.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/dropdown-menu/dropdown-menu-content.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/dropdown-menu/dropdown-menu-items.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/dropdown-menu/dropdown-menu-sub.tsx",
        type: "registry:ui",
      },
    ],
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
    files: [
      {
        path: "components/ui/animated/pull-down/index.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/pull-down/pull-down-context.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/pull-down/pull-down-utils.ts",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/pull-down/pull-down.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/pull-down/pull-down-container.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/pull-down/pull-down-content.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/pull-down/pull-down-items.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/animated/pull-down/pull-down-submenu.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: true,
    variant: "animated",
  },
  sheet: {
    type: "registry:ui",
    title: "Sheet",
    description:
      "A slide-out panel component with drag-to-dismiss, multiple sides, and smooth animations.",
    dependencies: [
      "@base-ui/react",
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
    dependencies: ["class-variance-authority", "@phosphor-icons/react"],
    registryDependencies: [
      "utils",
      "button",
      "input",
      "separator",
      "sheet",
      "skeleton",
      "tooltip",
    ],
    inlineDependencies: ["use-mobile", "primitives"],
    files: [
      { path: "components/ui/sidebar/index.tsx", type: "registry:ui" },
      {
        path: "components/ui/sidebar/sidebar-context.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/sidebar/sidebar-provider.tsx",
        type: "registry:ui",
      },
      { path: "components/ui/sidebar/sidebar.tsx", type: "registry:ui" },
      {
        path: "components/ui/sidebar/sidebar-structure.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/sidebar/sidebar-group.tsx",
        type: "registry:ui",
      },
      {
        path: "components/ui/sidebar/sidebar-menu.tsx",
        type: "registry:ui",
      },
    ],
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
    files: [
      {
        path: "components/ui/animated/shimmering-text.tsx",
        type: "registry:ui",
      },
    ],
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
    files: [
      {
        path: "components/ui/animated/slide-to-unlock.tsx",
        type: "registry:ui",
      },
    ],
    variant: "animated",
    credits: "@ncdai (https://chanhdai.com/components/slide-to-unlock)",
  },
};
