# edbn/ui

[![Version](https://img.shields.io/badge/version-0.2.5-blue.svg)](https://github.com/edbnme/ui.edbn.me/releases)
[![License](https://img.shields.io/badge/license-source--available-blue.svg)](LICENSE.md)

Public source-available shadcn components generated from the Base UI + Nova + neutral + Lucide preset. The supported baseline is React 19 and Tailwind CSS 4.

These aren't just demos, they're meant to be copied into your project and customized.

## What's here

- Manifest-driven public components in `components/ui/`
- Stock `cn` utility and responsive hook in `lib/` and `hooks/`
- Authored registry manifest in `registry.json`
- Tracked CLI output in `public/r/`

## Installation

Install the shared foundation, then add components by URL:

```bash
npx shadcn@latest add https://ui.edbn.me/r/edbn-base.json
npx shadcn@latest add https://ui.edbn.me/r/button.json
```

Or copy the code directly from `components/ui/`.

## License

Free noncommercial use is available under the dual license. Commercial use requires an active Pro license. See [LICENSE.md](LICENSE.md), the [online license](https://ui.edbn.me/docs/components/license), the [Terms of Use](https://ui.edbn.me/terms), the [Privacy Policy](https://ui.edbn.me/privacy), and the [Legal Notice](https://ui.edbn.me/legal).

## Docs

See [ui.edbn.me](https://ui.edbn.me) for examples and API docs.

## Contributing

Pull requests welcome. Check [CONTRIBUTING.md](CONTRIBUTING.md) first.

## Security

For security policy and reporting vulnerabilities, please see [SECURITY.md](SECURITY.md).

## Development

```bash
npm run build     # Validate the registry and typecheck source
npm run test:run  # Run tests
```

After changing components or the manifest:

```bash
npm run registry:validate
npm run registry:build
```

## Stack

React 19, Tailwind CSS 4, Base UI, Lucide, Vitest, and the exact shadcn version recorded in `registry.json`.

## Issues

Bugs? Ideas? [Open an issue](https://github.com/edbnme/ui.edbn.me/issues).
