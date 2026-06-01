# oss/components/ui/

Source of truth for all distributable UI components. This directory is a git submodule (`edbnme/ui`).

## Categories

- Root files such as `accordion.tsx`, `button.tsx`, `dialog.tsx`, `input.tsx`, `select.tsx`, and `tooltip.tsx` are the canonical CSS-only components.
- `audio/` contains audio and AI chat components.
- `pdf/` contains React PDF document components.
- `sonner.tsx` is a local provider wrapper and is not emitted as a registry item.

## Key Patterns

- Import components from `@/components/ui/<component>`.
- All component wrappers build on their upstream primitives and keep the upstream API available.
- Styling uses `cn()` from `oss/lib/utils.ts` and semantic design tokens.
- After changing any file here, run `npm run registry:build` to regenerate registry JSONs.

## Registry

Changes here are distributed via `public/r/*.json` files. The registry build script is `oss/scripts/update-registry.mjs`.
