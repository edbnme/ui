# edbn/ui

[![Version](https://img.shields.io/badge/version-0.2.5-blue.svg)](https://github.com/edbnme/ui.edbn.me/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.md)

Locally owned shadcn component source generated from the Base UI + Nova + neutral + Lucide preset. The supported baseline is React 19 and Tailwind CSS 4.

These aren't just demos, they're meant to be copied into your project and customized.

## What's here

- 62 public components in `components/ui/`
- Stock `cn` utility and responsive hook in `lib/` and `hooks/`
- Authored registry manifest in `registry.json`
- Tracked CLI output in `public/r/`

## Installation

Install the shared foundation, then add components by URL:

```bash
npx shadcn@4.19.0 add https://edbn.dev/r/edbn-base.json
npx shadcn@4.19.0 add https://edbn.dev/r/button.json
```

Or copy the code directly from `components/ui/`.

## License

Free for personal and open source projects. Commercial use requires a license. See [LICENSE.md](LICENSE.md).

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

React 19, Tailwind CSS 4, shadcn 4.19.0, Base UI, Lucide, and Vitest.

## Issues

Bugs? Ideas? [Open an issue](https://github.com/edbnme/ui.edbn.me/issues).
