# edbn/ui registry guide

`registry.json` is the authored source of truth. It contains `edbn-base` and
every installable official shadcn Base UI component discovered by the last
manual sync.

## Install Examples

```bash
# Install the foundation first.
npx shadcn@4.19.0 add https://ui.edbn.me/r/edbn-base.json

# Install one or more components.
npx shadcn@4.19.0 add https://ui.edbn.me/r/button.json https://ui.edbn.me/r/dialog.json

```

## Contract

- Public source lives in `components/ui/` and is imported directly by file.
- `edbn-base` installs the stock CSS foundation, utility, and mobile hook.
- Each component item uses official target placeholders and explicit production registry dependencies.
- Table compositions and their TanStack dependencies live in the private site
  repository, not this OSS package.
- Product blocks, application layouts, and renderer helpers are not registry primitives.

## Generated output

`shadcn build registry.json --output public/r` generates one flat JSON route
per primitive plus `registry.json`. Generated files are tracked and
must not be hand-edited.

## Maintaining The Registry

1. From the parent repository, run `npm run registry:official:sync` to replace
   only stock source from the official registry. The iframe-aware adapter
   overlay and base extensions are preserved.
2. Add a representative site demo for every newly discovered component.
3. Validate and rebuild:

```bash
npm run registry:validate
npm run registry:build
```

4. Review the exact diff in `public/r/`.

## Legal

Public registry output and the source in this package are subject to the
[Source-Available License](https://ui.edbn.me/docs/components/license). See the
[Terms of Use](https://ui.edbn.me/terms), [Privacy Policy](https://ui.edbn.me/privacy),
and [Legal Notice](https://ui.edbn.me/legal) for the hosted site and related
services. Third-party dependencies and assets remain subject to their own
licenses.
