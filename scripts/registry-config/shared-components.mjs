/**
 * Shared component registry configuration (no animation dependency, used by both variants)
 *
 * @see update-registry.mjs for the main orchestrator
 */

export const staticSharedComponents = {
  alert: {
    type: "registry:ui",
    title: "Alert",
    description:
      "Alert component with CVA variants for default, destructive, success, warning, and info states.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/alert.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "aspect-ratio": {
    type: "registry:ui",
    title: "Aspect Ratio",
    description:
      "A CSS aspect-ratio wrapper component for maintaining consistent proportions.",
    dependencies: [],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/aspect-ratio.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  avatar: {
    type: "registry:ui",
    title: "Avatar",
    description:
      "Composable avatar component with sizes, status indicators, and group stacking support.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/avatar.tsx", type: "registry:ui" }],
    variant: "static",
  },
  input: {
    type: "registry:ui",
    title: "Input",
    description:
      "A styled input component with focus states, validation support, and file input styling.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/input.tsx", type: "registry:ui" }],
    variant: "static",
  },
  label: {
    type: "registry:ui",
    title: "Label",
    description:
      "A styled label component with peer/group disabled state support.",
    dependencies: [],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/label.tsx", type: "registry:ui" }],
    variant: "static",
  },
  badge: {
    type: "registry:ui",
    title: "Badge",
    description:
      "Badge component with CVA variants for default, secondary, destructive, and outline styles.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/badge.tsx", type: "registry:ui" }],
    variant: "static",
  },
  textarea: {
    type: "registry:ui",
    title: "Textarea",
    description: "A styled textarea component with auto-resize support.",
    dependencies: [],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/textarea.tsx", type: "registry:ui" }],
    variant: "static",
  },
  card: {
    type: "registry:ui",
    title: "Card",
    description:
      "Card component with header, title, description, content, and footer sub-components.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/card.tsx", type: "registry:ui" }],
    variant: "static",
  },
  table: {
    type: "registry:ui",
    title: "Table",
    description:
      "Table component with header, body, footer, row, head, cell, and caption sub-components.",
    dependencies: [],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/table.tsx", type: "registry:ui" }],
    variant: "static",
  },
  breadcrumb: {
    type: "registry:ui",
    title: "Breadcrumb",
    description:
      "Breadcrumb navigation component with list, item, link, page, separator, and ellipsis.",
    dependencies: [],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/breadcrumb.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  pagination: {
    type: "registry:ui",
    title: "Pagination",
    description:
      "Pagination component with previous, next, links, and ellipsis.",
    dependencies: [],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/pagination.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  separator: {
    type: "registry:ui",
    title: "Separator",
    description:
      "A visual separator for dividing content, supporting horizontal and vertical orientations.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/separator.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  skeleton: {
    type: "registry:ui",
    title: "Skeleton",
    description:
      "A loading placeholder component with pulse animation for content loading states.",
    dependencies: [],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/skeleton.tsx", type: "registry:ui" }],
    variant: "static",
  },
};
