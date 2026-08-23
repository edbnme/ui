# edbn/ui registry guide

`registry.json` is the authored source of truth. It contains `edbn-base` plus every installable official shadcn Base UI component discovered by the last manual sync.

## Install Examples

```bash
# Install the foundation first.
npx shadcn@latest add https://edbn.dev/r/edbn-base.json

# Install one or more components.
npx shadcn@latest add https://edbn.dev/r/button.json https://edbn.dev/r/dialog.json
```

## Contract

- Public source lives in `components/ui/` and is imported directly by file.
- `edbn-base` installs the stock CSS foundation, utility, and mobile hook.
- Each component item uses official target placeholders and explicit production registry dependencies.
- Form, Data Table, Date Picker, and Typeset remain private site recipes.
- Product blocks, application layouts, renderer helpers, and PEN are not registry primitives.

## Generated output

`shadcn build registry.json --output public/r` generates one flat JSON route per item plus `registry.json`. Generated files are tracked and must not be hand-edited.

## Maintaining The Registry

1. From the parent repository, run `npm run registry:official:sync` to replace stock source from the official registry.
2. Add a representative site demo for every newly discovered component.
3. Validate and rebuild:

```bash
npm run registry:validate
npm run registry:build
```

4. Review the exact diff in `public/r/`.
