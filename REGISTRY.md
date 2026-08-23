# edbn/ui registry guide

`registry.json` is the authored source of truth. It contains `edbn-base` plus 62 official shadcn Base UI component items.

## Install Examples

```bash
# Install the foundation first.
npx shadcn@4.19.0 add https://edbn.dev/r/edbn-base.json

# Install one or more components.
npx shadcn@4.19.0 add https://edbn.dev/r/button.json https://edbn.dev/r/dialog.json
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

1. Add or update source in `components/ui/`.
2. Author the corresponding item in `registry.json`.
3. Validate and rebuild:

```bash
npm run registry:validate
npm run registry:build
```

4. Review the exact diff in `public/r/`.
