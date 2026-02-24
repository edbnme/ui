# Changelog

All notable changes to **edbn/ui** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed (Phase 9 — Deprecated File Cleanup)

- **Deleted 5 deprecated static components** — replaced by Base UI v2 equivalents
  - `static/alert-dialog.tsx` → use `static/alert-dialog-v2.tsx`
  - `static/dropdown-menu.tsx` → use `static/menu.tsx`
  - `static/popover.tsx` → use `static/popover-v2.tsx`
  - `static/sheet.tsx` → use `static/sheet-v2.tsx`
  - `static/pull-down.tsx` → use `static/menu.tsx` / `static/context-menu.tsx`
- **Deleted 5 outdated static docs pages** for the removed components

### Fixed

- **shared/alert.tsx** — `AlertTitle` ref type corrected (`HTMLParagraphElement` → `HTMLHeadingElement`), `AlertDescription` ref type corrected (`HTMLParagraphElement` → `HTMLDivElement`), empty interface → type alias
- **shared/badge.tsx** — Empty interface `BadgeProps` → type alias
- **shared/label.tsx** — Empty interface `LabelProps` → type alias
- **shared/separator.tsx** — Removed duplicate export statement
- **static/sidebar.tsx** — Updated Slot import to `@/lib/primitives` adapter layer

### Changed

- **index.ts** — Updated `Static*` re-exports to point to Base UI v2 components instead of deleted deprecated files
- **docs/COMPONENT-VARIANTS.md** — Updated to reflect full Base UI static component catalog (30+ components)

## [0.2.5] - 2026-02-11

### Added

- **Maps Component Library** — Full MapLibre GL JS composable React wrapper with `Map`, `MapMarker`, `MapPopup`, `MapControls`, `MapRoute`, `MapClusterLayer`, `MapLayerControl` components
- **MapPanel System** — 6 composable overlay panel components (`MapPanel`, `MapPanelHeader`, `MapPanelTitle`, `MapPanelBody`, `MapPanelSection`, `MapPanelFooter`) with CVA variants
- **Popup Composables** — `PopupShell`, `PopupHeader`, `PopupTitle`, `PopupDescription`, `PopupBody`, `PopupFooter`, `PopupArrow`
- **10 Registry Components** — `map-search`, `map-heatmap`, `map-directions`, `map-deckgl`, `map-scatterplot`, `map-gpu-heatmap`, `map-hexbin`, `map-arc`, `map-spatial`, `map-draw`
- **Map Position System** — `ATTRIBUTION_CLEARANCE_CLASS` and `positionClasses` for consistent control positioning
- **Shared Geocoder** — Reusable Nominatim geocoding with AbortController support
- **Map Hooks** — `useMapLayer`, `useDebouncedCallback`, `useMapEvent` for declarative MapLibre interactions

### Fixed

- **Control Overlap** — Bottom-positioned controls now clear attribution bar with `bottom-8` offset
- **Cluster Animation** — Widened cross-fade zone, exponential interpolation, paint transitions
- **Search "No Results"** — Guard against debounced re-trigger after selection
- **Heatmap Interpolation** — Fixed invalid `heatmap-intensity` expression
- **Build Errors** — Deck.gl event handler types, MapBox GL Draw overloads, React 19 ref patterns

### Changed

- **Map Theme** — Enhanced with color tokens, position system, shared constants
- **Registry Rebuild** — Updated all registry JSON files for new map components

## [0.2.4] - 2025-02-06

### Changed

- **Registry Rebuild** — Updated registry JSON files for Sheet, Sidebar, Alert Dialog, and Wheel Picker components
- **Alert Dialog (Static)** — Moved padding from sub-components to content root (`p-6 sm:p-8`) for more consistent spacing

## [0.2.0] - 2026-01-03

### Added

- Professional versioning with semantic versioning (SemVer)
- Comprehensive CHANGELOG documentation
- Package metadata (author, license, repository, keywords)

### Changed

- **Breaking:** All file names now follow kebab-case convention
  - Hooks: `useStableId.ts` → `use-stable-id.ts`
  - Components: `MotionProvider.tsx` → `motion-provider.tsx`
- Updated all import paths to match new file names
- Registry script updated for new file structure
- Documentation code examples updated with new import paths

### Hooks Renamed

| Old Name                  | New Name                    |
| ------------------------- | --------------------------- |
| `useClickOutside.tsx`     | `use-click-outside.tsx`     |
| `useControllableState.ts` | `use-controllable-state.ts` |
| `useFocusTrap.ts`         | `use-focus-trap.ts`         |
| `useLowPowerDevice.ts`    | `use-low-power-device.ts`   |
| `useMergedRefs.ts`        | `use-merged-refs.ts`        |
| `usePreventScroll.ts`     | `use-prevent-scroll.ts`     |
| `useReducedMotion.ts`     | `use-reduced-motion.ts`     |
| `useStableId.ts`          | `use-stable-id.ts`          |

### Components Renamed

| Old Name                | New Name                 |
| ----------------------- | ------------------------ |
| `ColorBends.tsx`        | `color-bends.tsx`        |
| `ComponentShowcase.tsx` | `component-showcase.tsx` |
| `FloatingNav.tsx`       | `floating-nav.tsx`       |
| `Footer.tsx`            | `footer.tsx`             |
| `ModeToggle.tsx`        | `mode-toggle.tsx`        |
| `MotionProvider.tsx`    | `motion-provider.tsx`    |
| `Preloader.tsx`         | `preloader.tsx`          |
| `ThemeProvider.tsx`     | `theme-provider.tsx`     |

### Migration Guide

If you're upgrading from 0.1.x, update your imports:

```tsx
// Before
import { useShouldDisableAnimation } from "@/components/MotionProvider";
import { useStableId } from "@/hooks/useStableId";

// After
import { useShouldDisableAnimation } from "@/components/motion-provider";
import { useStableId } from "@/hooks/use-stable-id";
```

## [0.1.0] - 2025-12-XX

### Added

- Initial release of edbn/ui component library
- Core UI components: Button, Alert Dialog, Popover, Dropdown Menu, Sheet
- Motion system with spring animations
- MotionProvider for global animation configuration
- Accessibility-first design with ARIA support
- Custom hooks for common patterns:
  - `useClickOutside` - Click outside detection
  - `useControllableState` - Controlled/uncontrolled pattern
  - `useFocusTrap` - Focus management for modals
  - `useLowPowerDevice` - Device capability detection
  - `useMergedRefs` - Ref composition
  - `usePreventScroll` - Scroll locking
  - `useReducedMotion` - Motion preference detection
  - `useStableId` - SSR-safe ID generation
- Registry system for shadcn-compatible distribution
- Full TypeScript support
- Tailwind CSS v4 integration

---

[Unreleased]: https://github.com/edbnme/ui.edbn.me/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/edbnme/ui.edbn.me/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/edbnme/ui.edbn.me/releases/tag/v0.1.0
