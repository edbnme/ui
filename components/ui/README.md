# oss/components/ui/

Source of truth for all distributable UI components. This directory is a git submodule (`edbnme/ui`).

## Categories

- `animated/` — Motion-enhanced components (Base UI + motion/react)
  - `button.tsx`, `alert-dialog.tsx`, `popover.tsx`, `sheet.tsx`, `shimmering-text.tsx`, `slide-to-unlock.tsx`
  - `dropdown-menu/` — Multi-file dropdown (trigger, content, items)
  - `pull-down/` — Multi-file pull-down refresh
- `static/` — CSS-only components (Base UI, no JavaScript animations)
  - 41 components: accordion, badge, card, checkbox, dialog, form, input, select, table, tabs, toast, tooltip, etc.
- Shared root files (re-exported by both variants):
  - `alert-dialog.tsx`, `button.tsx`, `dropdown-menu.tsx`, `popover.tsx`, `sheet.tsx`, `sidebar.tsx`, `sonner.tsx`, `wheel-picker.tsx`

## Key Patterns

- All components build on `@base-ui/react` primitives
- Animated components use `springPresets` from `oss/lib/motion.ts` (never hardcode spring values)
- Styling uses `cn()` from `oss/lib/utils.ts` and `cva` from `class-variance-authority`
- After changing any file here, run `npm run registry:build` to regenerate registry JSONs

## Registry

Changes here are distributed via `public/r/*.json` files. The registry build script is `oss/scripts/update-registry.mjs`.
