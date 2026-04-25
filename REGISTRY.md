# edbn-ui Registry Guide

> Current guide for the active OSS registry shipped from `oss/public/r/`.
> Animated variants were archived; see `archive/README.md` for the historical motion-based components.

## Install Examples

```bash
# Default UI component (flat URL)
npx shadcn@latest add https://ui.edbn.me/r/button.json

# Explicit static variant
npx shadcn@latest add https://ui.edbn.me/r/static/button.json

# Shared primitive or hook
npx shadcn@latest add https://ui.edbn.me/r/shared/scroll-area.json
npx shadcn@latest add https://ui.edbn.me/r/use-click-outside.json

# Audio component
npx shadcn@latest add https://ui.edbn.me/r/audio/audio-message.json
```

## Current Registry Families

| Family       | Path               | Notes                                                        |
| ------------ | ------------------ | ------------------------------------------------------------ |
| Default flat | `/r/*.json`        | Current default install URLs for UI components and utilities |
| Static       | `/r/static/*.json` | CSS-only Base UI components                                  |
| Shared       | `/r/shared/*.json` | Shared primitives, hooks, and utilities                      |
| Audio        | `/r/audio/*.json`  | Audio and AI components plus related hooks                   |
| Main index   | `/r/registry.json` | Registry index for the active OSS registry                   |

## What Changed

- Animated registry items are no longer part of the active OSS registry.
- The active registry now focuses on static UI components, shared utilities, and audio components.
- Maps registry items are maintained in the parent site repo, not in this submodule.

## Maintaining The Registry

1. Add or update registry config in `oss/scripts/registry-config/`.
2. Keep source files in the matching OSS directories:
   - `oss/components/ui/static/`
   - `oss/components/ui/shared/`
   - `oss/lib/`
   - `oss/hooks/`
   - `oss/components/ui/audio/`
3. Rebuild the registry:

```bash
npm run registry:build
```

4. Review the generated output in `oss/public/r/`.

## Registry Config Files

| File                                                 | Responsibility       |
| ---------------------------------------------------- | -------------------- |
| `oss/scripts/registry-config/static-components.mjs`  | Static UI components |
| `oss/scripts/registry-config/shared-components.mjs`  | Shared primitives    |
| `oss/scripts/registry-config/library-components.mjs` | Shared library items |
| `oss/scripts/registry-config/hooks-config.mjs`       | Shared hooks         |
| `oss/scripts/registry-config/audio-components.mjs`   | Audio components     |
| `oss/scripts/registry-config/audio-hooks-config.mjs` | Audio-specific hooks |

Flat install URLs like `button.json` remain published for convenience, but new docs and examples should describe the current static, shared, and audio families rather than the archived animated registry.
