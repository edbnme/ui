/**
 * Static component registry configuration (CSS-only, no motion)
 *
 * @see update-registry.mjs for the main orchestrator
 */

export const staticComponents = {
  "button-static": {
    type: "registry:ui",
    title: "Button (Static)",
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
  "alert-dialog-static": {
    type: "registry:ui",
    title: "Alert Dialog (Static)",
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
  "popover-static": {
    type: "registry:ui",
    title: "Popover (Static)",
    description:
      "Static popover built on Base UI Popover with CSS transitions.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/popover.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "static",
  },
  "dropdown-menu-static": {
    type: "registry:ui",
    title: "Dropdown Menu (Static)",
    description:
      "Static dropdown menu built on Base UI Menu with full sub-menu support.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/menu.tsx", type: "registry:ui" }],
    cssVars: true,
    variant: "static",
  },
  "context-menu-static": {
    type: "registry:ui",
    title: "Context Menu (Static)",
    description:
      "Static context menu built on Base UI ContextMenu with right-click trigger.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/context-menu.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  "sheet-static": {
    type: "registry:ui",
    title: "Sheet (Static)",
    description:
      "Static slide-out panel built on Base UI Dialog with directional CSS transitions.",
    dependencies: [
      "@base-ui/react",
      "class-variance-authority",
      "@phosphor-icons/react",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/sheet-v2.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "dialog-static": {
    type: "registry:ui",
    title: "Dialog (Static)",
    description:
      "Static dialog/modal built on Base UI Dialog with CSS transitions.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/dialog.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "tooltip-static": {
    type: "registry:ui",
    title: "Tooltip (Static)",
    description:
      "Static tooltip built on Base UI Tooltip with arrow and CSS transitions.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/tooltip.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "checkbox-static": {
    type: "registry:ui",
    title: "Checkbox (Static)",
    description:
      "Static checkbox built on Base UI Checkbox with indeterminate support.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/checkbox.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "checkbox-group-static": {
    type: "registry:ui",
    title: "Checkbox Group (Static)",
    description:
      "Static checkbox group built on Base UI CheckboxGroup for parent-child checkbox control.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils", "checkbox-static"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/checkbox-group.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  "radio-group-static": {
    type: "registry:ui",
    title: "Radio Group (Static)",
    description: "Static radio group built on Base UI RadioGroup.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/radio.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "switch-static": {
    type: "registry:ui",
    title: "Switch (Static)",
    description: "Static switch/toggle built on Base UI Switch.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/switch.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "toggle-static": {
    type: "registry:ui",
    title: "Toggle (Static)",
    description:
      "Static toggle button built on Base UI Toggle with CVA variants.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/toggle.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "toggle-group-static": {
    type: "registry:ui",
    title: "Toggle Group (Static)",
    description: "Static toggle group built on Base UI ToggleGroup.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: ["utils", "toggle-static"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/toggle-group.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  "slider-static": {
    type: "registry:ui",
    title: "Slider (Static)",
    description:
      "Static slider built on Base UI Slider with track, thumb, and value display.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/slider.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "number-field-static": {
    type: "registry:ui",
    title: "Number Field (Static)",
    description:
      "Static number field built on Base UI NumberField with increment/decrement.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/number-field.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  "field-static": {
    type: "registry:ui",
    title: "Field (Static)",
    description:
      "Static form field built on Base UI Field with label, description, error, and validity.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/field.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "fieldset-static": {
    type: "registry:ui",
    title: "Fieldset (Static)",
    description:
      "Static fieldset built on Base UI Fieldset with root and legend.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/fieldset.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "form-static": {
    type: "registry:ui",
    title: "Form (Static)",
    description: "Static form built on Base UI Form.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/form.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "progress-static": {
    type: "registry:ui",
    title: "Progress (Static)",
    description:
      "Static progress bar built on Base UI Progress with indeterminate state.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/progress.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "meter-static": {
    type: "registry:ui",
    title: "Meter (Static)",
    description:
      "Static meter/gauge built on Base UI Meter with track, indicator, label, and value.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/meter.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "toast-static": {
    type: "registry:ui",
    title: "Toast (Static)",
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
  "accordion-static": {
    type: "registry:ui",
    title: "Accordion (Static)",
    description:
      "Static accordion built on Base UI Accordion with CSS height transitions.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/accordion.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  "collapsible-static": {
    type: "registry:ui",
    title: "Collapsible (Static)",
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
  "tabs-static": {
    type: "registry:ui",
    title: "Tabs (Static)",
    description: "Static tabs built on Base UI Tabs with animated indicator.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/tabs.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "scroll-area-static": {
    type: "registry:ui",
    title: "Scroll Area (Static)",
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
  "select-static": {
    type: "registry:ui",
    title: "Select (Static)",
    description: "Static select built on Base UI Select with scroll arrows.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/select.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "toolbar-static": {
    type: "registry:ui",
    title: "Toolbar (Static)",
    description:
      "Static toolbar built on Base UI Toolbar with button, group, link, input, and separator.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/toolbar.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "navigation-menu-static": {
    type: "registry:ui",
    title: "Navigation Menu (Static)",
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
  "preview-card-static": {
    type: "registry:ui",
    title: "Preview Card (Static)",
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
  "sidebar-static": {
    type: "registry:ui",
    title: "Sidebar (Static)",
    description:
      "A responsive sidebar component with Base UI sheet and tooltip. No motion dependency required.",
    dependencies: [
      "@base-ui/react",
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
      "tooltip-static",
    ],
    inlineDependencies: ["use-mobile", "primitives"],
    files: [{ path: "components/ui/static/sidebar.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "drawer-static": {
    type: "registry:ui",
    title: "Drawer (Static)",
    description:
      "Static drawer/bottom sheet component built on Base UI Dialog with snap points and nested support.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/drawer.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "input-otp-static": {
    type: "registry:ui",
    title: "Input OTP (Static)",
    description:
      "Static OTP/verification code input built on input-otp with customizable slots.",
    dependencies: ["input-otp"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/static/input-otp.tsx", type: "registry:ui" },
    ],
    variant: "static",
  },
  "hover-card-static": {
    type: "registry:ui",
    title: "Hover Card (Static)",
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
  "resizable-static": {
    type: "registry:ui",
    title: "Resizable (Static)",
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
  "menubar-static": {
    type: "registry:ui",
    title: "Menubar (Static)",
    description:
      "Static menubar built on Base UI Menubar and Menu with keyboard navigation and sub-menus.",
    dependencies: ["@base-ui/react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/menubar.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "autocomplete-static": {
    type: "registry:ui",
    title: "Autocomplete (Static)",
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
  "calendar-static": {
    type: "registry:ui",
    title: "Calendar (Static)",
    description:
      "Static date picker calendar with single, multiple, and range selection modes built on react-day-picker.",
    dependencies: ["react-day-picker", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/calendar.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "carousel-static": {
    type: "registry:ui",
    title: "Carousel (Static)",
    description:
      "Static accessible carousel with touch/swipe support, loop mode, and keyboard navigation built on Embla Carousel.",
    dependencies: ["embla-carousel-react", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/carousel.tsx", type: "registry:ui" }],
    variant: "static",
  },
  "chart-static": {
    type: "registry:ui",
    title: "Chart (Static)",
    description:
      "Composable, themed chart components built on Recharts with CSS variable theming, pre-styled tooltips, and legends.",
    dependencies: ["recharts"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/static/chart.tsx", type: "registry:ui" }],
    variant: "static",
  },
};
