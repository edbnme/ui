/**
 * Static component registry configuration (CSS-only, no motion)
 *
 * NOTE: Keys use clean names (no "-static" suffix).
 * The `variant: "static"` field distinguishes these from animated variants.
 *
 * @see update-registry.mjs for the main orchestrator
 */

export const staticComponents = {
  button: {
    type: "registry:ui",
    title: "Button",
    description:
      "Static button component with CSS transitions only. No motion dependency required.",
    dependencies: [
      "class-variance-authority",
      "@phosphor-icons/react",
      "tw-animate-css",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: ["use-ripple", "icons-static", "primitives"],
    files: [{ path: "components/ui/static/button.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "alert-dialog": {
    type: "registry:ui",
    title: "Alert Dialog",
    description:
      "Static alert dialog built on Base UI AlertDialog with CSS transitions.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/alert-dialog.tsx", type: "registry:ui" },
    ],
    cssVars: true,
    variant: "static",
  },
  popover: {
    type: "registry:ui",
    title: "Popover",
    description:
      "Static popover built on Base UI Popover with CSS transitions.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/popover.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "static",
  },
  "dropdown-menu": {
    type: "registry:ui",
    title: "Dropdown Menu",
    description:
      "Static dropdown menu built on Base UI Menu with full sub-menu support.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/menu.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "static",
  },
  "context-menu": {
    type: "registry:ui",
    title: "Context Menu",
    description:
      "Static context menu built on Base UI ContextMenu with right-click trigger.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/context-menu.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  sheet: {
    type: "registry:ui",
    title: "Sheet",
    description:
      "Static slide-out panel built on Base UI Dialog with directional CSS transitions.",
    dependencies: [
      "@base-ui/react",
      "class-variance-authority",
      "@phosphor-icons/react",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/sheet.tsx", type: "registry:ui" }],
    variant: "static",
  },
  dialog: {
    type: "registry:ui",
    title: "Dialog",
    description:
      "Static dialog/modal built on Base UI Dialog with CSS transitions.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/dialog.tsx", type: "registry:ui" }],
    variant: "static",
  },
  tooltip: {
    type: "registry:ui",
    title: "Tooltip",
    description:
      "Static tooltip built on Base UI Tooltip with arrow and CSS transitions.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/tooltip.tsx", type: "registry:ui" }],
    variant: "static",
  },
  checkbox: {
    type: "registry:ui",
    title: "Checkbox",
    description:
      "Static checkbox built on Base UI Checkbox with indeterminate support.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/checkbox.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "checkbox-group": {
    type: "registry:ui",
    title: "Checkbox Group",
    description:
      "Static checkbox group built on Base UI CheckboxGroup for parent-child checkbox control.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils", "checkbox"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/checkbox-group.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  "radio-group": {
    type: "registry:ui",
    title: "Radio Group",
    description: "Static radio group built on Base UI RadioGroup.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/radio.tsx", type: "registry:ui" }],
    variant: "static",
  },
  switch: {
    type: "registry:ui",
    title: "Switch",
    description: "Static switch/toggle built on Base UI Switch.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/switch.tsx", type: "registry:ui" }],
    variant: "static",
  },
  toggle: {
    type: "registry:ui",
    title: "Toggle",
    description:
      "Static toggle button built on Base UI Toggle with CVA variants.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/toggle.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "toggle-group": {
    type: "registry:ui",
    title: "Toggle Group",
    description: "Static toggle group built on Base UI ToggleGroup.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: ["utils", "toggle"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/toggle-group.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  slider: {
    type: "registry:ui",
    title: "Slider",
    description:
      "Static slider built on Base UI Slider with track, thumb, and value display.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/slider.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "number-field": {
    type: "registry:ui",
    title: "Number Field",
    description:
      "Static number field built on Base UI NumberField with increment/decrement.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/number-field.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  field: {
    type: "registry:ui",
    title: "Field",
    description:
      "Static form field built on Base UI Field with label, description, error, and validity.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/field.tsx", type: "registry:ui" }],
    variant: "static",
  },
  fieldset: {
    type: "registry:ui",
    title: "Fieldset",
    description:
      "Static fieldset built on Base UI Fieldset with root and legend.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/fieldset.tsx", type: "registry:ui" }],
    variant: "static",
  },
  form: {
    type: "registry:ui",
    title: "Form",
    description: "Static form built on Base UI Form.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/form.tsx", type: "registry:ui" }],
    variant: "static",
  },
  progress: {
    type: "registry:ui",
    title: "Progress",
    description:
      "Static progress bar built on Base UI Progress with indeterminate state.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/progress.tsx", type: "registry:ui" }],
    variant: "static",
  },
  meter: {
    type: "registry:ui",
    title: "Meter",
    description:
      "Static meter/gauge built on Base UI Meter with track, indicator, label, and value.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/meter.tsx", type: "registry:ui" }],
    variant: "static",
  },
  toast: {
    type: "registry:ui",
    title: "Toast",
    description:
      "Static toast notifications built on Base UI Toast with CVA variants.",
    dependencies: [
      "@base-ui/react",
      "class-variance-authority",
      "@phosphor-icons/react",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/toast.tsx", type: "registry:ui" }],
    variant: "static",
  },
  accordion: {
    type: "registry:ui",
    title: "Accordion",
    description:
      "Static accordion built on Base UI Accordion with CSS height transitions.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/accordion.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  collapsible: {
    type: "registry:ui",
    title: "Collapsible",
    description:
      "Static collapsible built on Base UI Collapsible with CSS height transitions.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/collapsible.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  tabs: {
    type: "registry:ui",
    title: "Tabs",
    description: "Static tabs built on Base UI Tabs with animated indicator.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/tabs.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "scroll-area": {
    type: "registry:ui",
    title: "Scroll Area",
    description:
      "Static scroll area built on Base UI ScrollArea with custom scrollbars.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/scroll-area.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  select: {
    type: "registry:ui",
    title: "Select",
    description: "Static select built on Base UI Select with scroll arrows.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/select.tsx", type: "registry:ui" }],
    variant: "static",
  },
  toolbar: {
    type: "registry:ui",
    title: "Toolbar",
    description:
      "Static toolbar built on Base UI Toolbar with button, group, link, input, and separator.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/toolbar.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "navigation-menu": {
    type: "registry:ui",
    title: "Navigation Menu",
    description:
      "Static navigation menu built on Base UI NavigationMenu with viewport and CSS transitions.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/navigation-menu.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  "preview-card": {
    type: "registry:ui",
    title: "Preview Card",
    description:
      "Static preview card built on Base UI PreviewCard with hover trigger and arrow.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/preview-card.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  sidebar: {
    type: "registry:ui",
    title: "Sidebar",
    description:
      "A responsive sidebar component with Base UI sheet and tooltip. No motion dependency required.",
    dependencies: [
      "@base-ui/react",
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
    inlineDependencies: ["use-mobile", "primitives"],
    files: [{ path: "components/ui/static/sidebar.tsx", type: "registry:ui" }],
    variant: "static",
  },
  drawer: {
    type: "registry:ui",
    title: "Drawer",
    description:
      "Static drawer/bottom sheet component built on Base UI Dialog with snap points and nested support.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/drawer.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "input-otp": {
    type: "registry:ui",
    title: "Input OTP",
    description:
      "Static OTP/verification code input built on input-otp with customizable slots.",
    dependencies: ["input-otp", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/input-otp.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  "hover-card": {
    type: "registry:ui",
    title: "Hover Card",
    description:
      "Static hover card built on Base UI PreviewCard with arrow and CSS transitions.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/hover-card.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  resizable: {
    type: "registry:ui",
    title: "Resizable",
    description:
      "Static resizable panel groups with drag handles built on react-resizable-panels.",
    dependencies: ["react-resizable-panels", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/resizable.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  menubar: {
    type: "registry:ui",
    title: "Menubar",
    description:
      "Static menubar built on Base UI Menubar and Menu with keyboard navigation and sub-menus.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/menubar.tsx", type: "registry:ui" }],
    variant: "static",
  },
  autocomplete: {
    type: "registry:ui",
    title: "Autocomplete",
    description:
      "Static autocomplete/combobox built on Base UI Autocomplete with filtering and groups.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/autocomplete.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  calendar: {
    type: "registry:ui",
    title: "Calendar",
    description:
      "Static date picker calendar with single, multiple, and range selection modes built on react-day-picker.",
    dependencies: ["react-day-picker", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/calendar.tsx", type: "registry:ui" }],
    variant: "static",
  },
  carousel: {
    type: "registry:ui",
    title: "Carousel",
    description:
      "Static accessible carousel with touch/swipe support, loop mode, and keyboard navigation built on Embla Carousel.",
    dependencies: ["embla-carousel-react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/carousel.tsx", type: "registry:ui" }],
    variant: "static",
  },
  chart: {
    type: "registry:ui",
    title: "Chart",
    description:
      "Composable, themed chart components built on Recharts with CSS variable theming, pre-styled tooltips, and legends.",
    dependencies: ["recharts"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/chart.tsx", type: "registry:ui" }],
    variant: "static",
  },
};
