/**
 * discover.mjs — Single source of truth for registry configuration.
 *
 * Scans component source files and derives the full registry config object
 * (the shape historically hand-authored in `static-components.mjs`,
 * `shared-components.mjs`, `audio-components.mjs`, `hooks-config.mjs`,
 * `audio-hooks-config.mjs`, and `library-components.mjs`).
 *
 * The component file itself is the only authoring surface:
 *   - File path          → slug, type, variant, files list
 *   - ES import graph    → dependencies, registryDependencies, inlineDependencies
 *   - JSDoc header       → title, description, cssVars, isNew, demos, part-of
 *
 * The scanner is zero-dependency (no external npm packages) — it uses
 * regex-based parsing tuned to this codebase's conventions. All parsing is
 * pure and deterministic so output is reproducible.
 *
 * Recognized JSDoc tags (all optional):
 *   @registrySlug <slug>                  override filename-based slug
 *   @registryDescription <text>           registry-facing short description
 *   @registryDependencies <csv>           force-add npm deps (rare edge case)
 *   @registryRegistryDependencies <csv>   force-add registry deps
 *   @registryCssVars                      include shadcn cssVars block
 *   @registryIsNew                        flag for explorer "NEW" badge
 *   @registryPartOf <parent-slug>         mark file as helper (not standalone)
 *   @registryDemos <csv>                  explorer demos, e.g. "basic=Basic, form=With Form"
 *   @registryVariant <variant>            override directory-inferred variant
 *   @registryType <registry:kind>         override directory-inferred type
 *   @registryCategory <name>              sidebar grouping key (e.g. "chat",
 *                                         "audio", "display"). Consumers
 *                                         read this to split the sidebar.
 *
 * @packageDocumentation
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, dirname, basename, extname, posix } from "path";

// ---- CONSTANTS --------------------------------------------------------------

/**
 * Maps a source subdirectory (relative to the oss/ root) to its default
 * registry characteristics. Files inside the directory inherit these unless
 * overridden by JSDoc tags.
 */
export const SOURCE_DIRS = [
  {
    dir: "components/ui/static",
    type: "registry:ui",
    variant: "static",
    prefix: "",
  },
  {
    dir: "components/ui/audio",
    type: "registry:ui",
    variant: "audio",
    prefix: "audio-",
  },
  { dir: "hooks", type: "registry:hook", variant: "static", prefix: "" },
  { dir: "lib", type: "registry:lib", variant: "static", prefix: "" },
];

/**
 * Slug overrides for lib files whose registry slug historically differs from
 * their filename. These are the canonical names consumers reference (via
 * `inlineDependencies`). Encoded here (not in JSDoc) because these files are
 * tiny and we want zero intrusion into the lib source.
 */
const LIB_SLUG_OVERRIDES = {
  "lib/motion.ts": "motion-lib",
};

/**
 * Lib files whose `variant` should be "audio" even though they live in lib/.
 * Matches the historical shape where motion-lib and shiki-config were audio.
 */
const LIB_VARIANT_OVERRIDES = {
  "lib/motion.ts": "audio",
  "lib/shiki-config.ts": "audio",
};

/**
 * Filename patterns for files that are NEVER standalone registry entries.
 * Currently unused — every lib/hook file is registered so it can be referenced
 * as an inline dependency.
 */
const NON_REGISTRY_LIB_FILES = new Set();

/**
 * Peer dependencies that must NEVER appear in a component's `dependencies`
 * (they come from the consumer's React installation). Matches the peerDeps
 * in oss/package.json.
 */
const PEER_DEPS = new Set([
  "react",
  "react-dom",
  "@types/react",
  "@types/react-dom",
]);

/**
 * Import specifiers that resolve to `utils` always go into
 * `registryDependencies` (not inlineDependencies), matching shadcn convention.
 */
const UTILS_IMPORT = "@/lib/utils";

/** File extensions scanned as TypeScript source. */
const SOURCE_EXTS = new Set([".ts", ".tsx"]);

// ---- FILE SYSTEM HELPERS ----------------------------------------------------

/** Recursively list TS/TSX files under `dir` (relative paths). */
function listSourceFiles(root, subdir) {
  const abs = join(root, subdir);
  /** @type {string[]} */
  const results = [];
  let entries;
  try {
    entries = readdirSync(abs);
  } catch {
    return results;
  }
  for (const entry of entries) {
    const entryAbs = join(abs, entry);
    let st;
    try {
      st = statSync(entryAbs);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      // Skip styles/ and other non-source subfolders.
      if (entry === "styles" || entry === "__tests__") continue;
      results.push(...listSourceFiles(root, posix.join(subdir, entry)));
    } else if (SOURCE_EXTS.has(extname(entry))) {
      // Skip barrel index files.
      if (basename(entry, extname(entry)) === "index") continue;
      results.push(posix.join(subdir, entry));
    }
  }
  return results;
}

// ---- JSDOC PARSING ----------------------------------------------------------

/**
 * Extract the file-header JSDoc block — the very first /** ... *\/ that
 * appears before any code (after an optional "use client" directive and
 * imports). This avoids accidentally grabbing a JSDoc attached to an
 * interface prop further down the file.
 */
function extractJsDocBlock(source) {
  // Match an optional leading "use client" directive + whitespace, then the
  // very first JSDoc block. We explicitly require the block to appear BEFORE
  // any `import`, `export`, `function`, `const`, etc. to stay deterministic.
  const headerRe =
    /^\s*(?:["']use (?:client|server|strict)["'];?\s*)?\/\*\*([\s\S]*?)\*\//;
  const m = source.match(headerRe);
  if (!m) return null;
  return m[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, ""))
    .join("\n")
    .trim();
}

/**
 * Parse registry-related JSDoc tags. Returns an object with parsed tag
 * values. All fields are optional.
 */
function parseJsDocTags(jsdoc) {
  /** @type {Record<string, unknown>} */
  const tags = {};
  if (!jsdoc) return tags;

  const get = (name) => {
    const re = new RegExp(`^@${name}\\b[ \\t]*(.*)$`, "m");
    const m = jsdoc.match(re);
    return m ? m[1].trim() : undefined;
  };
  const flag = (name) => {
    const re = new RegExp(`^@${name}\\b`, "m");
    return re.test(jsdoc);
  };
  const csv = (val) =>
    val
      ? val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const slug = get("registrySlug");
  if (slug) tags.slug = slug;

  const title = get("registryTitle");
  if (title) tags.title = title;

  const description = get("registryDescription");
  if (description) tags.description = description;

  const variant = get("registryVariant");
  if (variant) tags.variant = variant;

  const type = get("registryType");
  if (type) tags.type = type;

  const category = get("registryCategory");
  if (category) tags.category = category;

  tags.extraDependencies = csv(get("registryDependencies"));
  tags.extraRegistryDependencies = csv(get("registryRegistryDependencies"));

  if (flag("registryCssVars")) tags.cssVars = true;
  if (flag("registryIsNew")) tags.isNew = true;
  if (flag("registryInlineOnly")) tags.inlineOnly = true;

  const partOf = get("registryPartOf");
  if (partOf) tags.partOf = partOf;

  const demosRaw = get("registryDemos");
  if (demosRaw) {
    tags.demos = demosRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((pair) => {
        const eq = pair.indexOf("=");
        if (eq === -1) {
          const slug = pair;
          return {
            slug,
            name: toPascalCase(slug)
              .replace(/([A-Z])/g, " $1")
              .trim(),
          };
        }
        return {
          slug: pair.slice(0, eq).trim(),
          name: pair.slice(eq + 1).trim(),
        };
      });
  }

  return tags;
}

/**
 * Derive the short description from the first JSDoc line
 * (the `Component — description.` pattern), if @registryDescription is absent.
 */
function fallbackDescription(jsdoc) {
  if (!jsdoc) return "";
  const firstLine = jsdoc.split("\n")[0].trim();
  // Pattern: "ComponentName — rest of description."
  const m = firstLine.match(/^\w[\w-]*\s+[—-]\s+(.+)$/);
  if (m) return m[1].trim().replace(/\.$/, "") + ".";
  return firstLine;
}

// ---- IMPORT PARSING ---------------------------------------------------------

/**
 * Extract all import specifiers from a source file. Covers:
 *   - Static:  `import X from "spec"` / `import { A } from "spec"` / `import "spec"`
 *   - Type:    `import type { X } from "spec"` / `: import("spec").Type`
 *   - Dynamic: `import("spec")`
 *   - CJS:     `require("spec")`
 *
 * `require()` and `import("...")` are critical because several components
 * lazy-load heavy deps (e.g. `orb.tsx` does `require("three")`) and the
 * scanner MUST still capture those as real dependencies.
 *
 * Block comments are stripped first so JSDoc `@example` blocks don't pollute
 * the results.
 */
function parseImportSpecifiers(source) {
  const stripped = source.replace(/\/\*[\s\S]*?\*\//g, "");
  /** @type {Set<string>} */
  const specs = new Set();

  // Static `import ... from "spec"` / `import "spec"` (multi-line tolerant).
  const staticRe =
    /^\s*import\s+(?:type\s+)?(?:[\s\S]*?from\s+)?["']([^"']+)["'];?/gm;
  let m;
  while ((m = staticRe.exec(stripped)) !== null) {
    specs.add(m[1]);
  }

  // Dynamic `import("spec")` — used for type-only imports AND runtime lazy loads.
  const dynamicRe = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
  while ((m = dynamicRe.exec(stripped)) !== null) {
    specs.add(m[1]);
  }

  // CJS `require("spec")`.
  const requireRe = /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g;
  while ((m = requireRe.exec(stripped)) !== null) {
    specs.add(m[1]);
  }

  return Array.from(specs);
}

// ---- NAME HELPERS -----------------------------------------------------------

function toPascalCase(slug) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");
}

function toTitleCase(slug) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(" ");
}

/**
 * Hook names are camelCase (useFoo) not PascalCase. When the type is hook,
 * we want `useFoo`, not `UseFoo`.
 */
function hookTitle(slug) {
  // slug like "use-click-outside" → "useClickOutside"
  const parts = slug.split("-");
  return parts
    .map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1)))
    .join("");
}

// ---- CORE SCAN --------------------------------------------------------------

/**
 * @typedef {object} ScannedFile
 * @property {string} relPath        - Path relative to oss/ root (posix).
 * @property {string} slug           - Registry slug.
 * @property {string} type           - registry:ui | registry:hook | registry:lib | registry:component
 * @property {string} variant        - static | audio
 * @property {string} title          - Human title.
 * @property {string} description    - Registry description.
 * @property {string[]} imports      - Raw import specifiers.
 * @property {object} tags           - Parsed JSDoc tags.
 * @property {string} source         - Raw file contents.
 */

/**
 * Walk all source dirs, read each file, and produce a per-file scan record.
 * No dependency resolution is done here — that happens in a second pass.
 *
 * @param {string} root - Absolute path of oss/ root.
 * @returns {ScannedFile[]}
 */
function scanFiles(root) {
  /** @type {ScannedFile[]} */
  const scanned = [];

  for (const cfg of SOURCE_DIRS) {
    const files = listSourceFiles(root, cfg.dir);
    for (const relPath of files) {
      const abs = join(root, relPath);
      const source = readFileSync(abs, "utf-8");
      const jsdoc = extractJsDocBlock(source);
      const tags = parseJsDocTags(jsdoc);
      const imports = parseImportSpecifiers(source);

      // Determine filename stem (no extension).
      const stem = basename(relPath).replace(/\.tsx?$/, "");

      // Slug resolution: tag override > lib override table > prefix+stem.
      // Prefix is skipped when the filename already starts with the prefix,
      // so `components/ui/audio/audio-player.tsx` → slug "audio-player"
      // (not "audio-audio-player").
      let slug;
      if (tags.slug) {
        slug = tags.slug;
      } else if (LIB_SLUG_OVERRIDES[relPath]) {
        slug = LIB_SLUG_OVERRIDES[relPath];
      } else if (cfg.prefix && stem.startsWith(cfg.prefix)) {
        slug = stem;
      } else {
        slug = cfg.prefix + stem;
      }

      // Variant resolution.
      let variant =
        tags.variant || LIB_VARIANT_OVERRIDES[relPath] || cfg.variant;

      // Type resolution.
      const type = tags.type || cfg.type;

      // Title: explicit @registryTitle > hook camelCase > TitleCase from stem.
      let title;
      if (tags.title) {
        title = tags.title;
      } else if (type === "registry:hook") {
        title = hookTitle(stem);
      } else {
        title = toTitleCase(stem);
      }

      // Description: tag > JSDoc first line fallback > filename.
      const description =
        tags.description || fallbackDescription(jsdoc) || `${title} component.`;

      scanned.push({
        relPath,
        slug,
        type,
        variant,
        title,
        description,
        imports,
        tags,
        source,
        sourceDirCfg: cfg,
      });
    }
  }

  return scanned;
}

// ---- RESOLUTION -------------------------------------------------------------

/**
 * Build a lookup that resolves an `@/...` import specifier to its registry
 * slug. Also tracks which files belong to which slug (for sibling inclusion).
 */
function buildLookup(scanned) {
  // Map: source relative path (without ext) → ScannedFile
  // For files marked @registryPartOf, resolution returns the PARENT file so
  // imports of helper files (e.g. @/lib/slot) resolve to the bundled parent
  // registry entry (primitives) rather than creating a missing reference.
  const byPath = new Map();
  const bySlug = new Map();
  for (const s of scanned) {
    bySlug.set(s.slug, s);
  }
  for (const s of scanned) {
    const noExt = s.relPath.replace(/\.tsx?$/, "");
    if (s.tags.partOf) {
      const parent = bySlug.get(s.tags.partOf);
      byPath.set(noExt, parent || s);
    } else {
      byPath.set(noExt, s);
    }
  }
  return byPath;
}

/** Resolve `@/foo/bar` → relative source path without extension. */
function resolveAtImport(spec) {
  if (!spec.startsWith("@/")) return null;
  return spec.slice(2);
}

/**
 * For a given scanned file, walk its relative imports (`./x`, `../x`)
 * transitively within the same directory to collect sibling files that
 * should be bundled into the same registry entry.
 *
 * Only files with `@registryPartOf <parentSlug>` matching the current
 * component's slug (or the main file) get bundled.
 */
function collectSiblingFiles(main, scanned) {
  const mainDir = dirname(main.relPath);
  const siblingsBySlug = new Map();
  for (const s of scanned) {
    if (s === main) continue;
    if (dirname(s.relPath) !== mainDir) continue;
    if (s.tags.partOf === main.slug) {
      siblingsBySlug.set(s.relPath, s);
    }
  }
  // Also: transitively walk `./x` imports starting from main, BUT only include
  // files that have an explicit @registryPartOf declaring membership. This
  // keeps discovery deterministic and avoids accidentally inlining siblings.
  return Array.from(siblingsBySlug.values());
}

/**
 * Turn a ScannedFile into a fully-resolved registry config entry matching
 * the shape produced historically by the hand-authored .mjs configs.
 */
function resolveEntry(main, lookup, scanned) {
  // Skip helpers.
  if (main.tags.partOf) return null;
  // Skip lib files explicitly marked as non-registry items.
  if (NON_REGISTRY_LIB_FILES.has(main.relPath)) return null;

  /** @type {Set<string>} */
  const npmDeps = new Set();
  /** @type {Set<string>} */
  const registryDeps = new Set();
  /** @type {Set<string>} */
  const inlineDeps = new Set();

  // Collect siblings first so we can also include their imports.
  const siblings = collectSiblingFiles(main, scanned);
  const allFilesToAnalyze = [main, ...siblings];

  for (const file of allFilesToAnalyze) {
    for (const spec of file.imports) {
      // Relative imports: handled via sibling collection, skip for deps.
      if (spec.startsWith("./") || spec.startsWith("../")) continue;

      // utils special-case.
      if (spec === UTILS_IMPORT) {
        registryDeps.add("utils");
        continue;
      }

      // @/ prefixed imports.
      if (spec.startsWith("@/")) {
        const resolvedPath = resolveAtImport(spec);
        const target = lookup.get(resolvedPath);
        if (!target) {
          // Unresolved internal import — skip silently (might be a type-only
          // or a non-registered module like lib/styles/*).
          continue;
        }
        // Skip self-references: sibling files (`@registryPartOf <slug>`) are
        // redirected through the lookup to their parent entry. When the
        // parent or one of its siblings imports another sibling, the redirect
        // yields the parent itself — we must not add the parent as its own
        // dependency.
        if (target.slug === main.slug) continue;
        if (target.type === "registry:ui") {
          registryDeps.add(target.slug);
        } else {
          inlineDeps.add(target.slug);
        }
        continue;
      }

      // Skip `@types/...` type-only — not real deps.
      if (spec.startsWith("@types/")) continue;

      // Everything else is an npm dep. Normalize to package name (handles
      // scoped packages and sub-paths: `@base-ui/react/menu` → `@base-ui/react`).
      const pkg = spec.startsWith("@")
        ? spec.split("/").slice(0, 2).join("/")
        : spec.split("/")[0];

      // Skip peer dependencies (react / react-dom).
      if (PEER_DEPS.has(pkg)) continue;

      npmDeps.add(pkg);
    }
  }

  // Merge explicit JSDoc-added deps.
  for (const d of main.tags.extraDependencies || []) npmDeps.add(d);
  for (const d of main.tags.extraRegistryDependencies || [])
    registryDeps.add(d);

  // Transitive npm deps from inline dependencies. The shadcn registry model
  // installs ONE component at a time — when a component pulls in a hook/lib
  // as an inline dep, the consumer still needs that helper's npm packages
  // to be declared on the PARENT's `dependencies` (the validator enforces
  // this rule). We walk one level deep only.
  for (const inlineSlug of inlineDeps) {
    const inlineTarget = scanned.find(
      (s) => s.slug === inlineSlug && !s.tags.partOf
    );
    if (!inlineTarget) continue;
    for (const spec of inlineTarget.imports) {
      if (spec.startsWith("./") || spec.startsWith("../")) continue;
      if (spec.startsWith("@/")) continue;
      if (spec.startsWith("@types/")) continue;
      const pkg = spec.startsWith("@")
        ? spec.split("/").slice(0, 2).join("/")
        : spec.split("/")[0];
      if (PEER_DEPS.has(pkg)) continue;
      npmDeps.add(pkg);
    }
  }

  // Sort to match hand-authored style (natural order with a few stable rules).
  const sorted = (s) => Array.from(s).sort();

  /** @type {{path: string, type: string}[]} */
  const files = [
    { path: main.relPath, type: main.type },
    ...siblings.map((s) => ({ path: s.relPath, type: s.type })),
  ];

  /** @type {Record<string, unknown>} */
  const entry = {
    type: main.type,
    title: main.title,
    description: main.description,
    dependencies: sorted(npmDeps),
    registryDependencies: sorted(registryDeps),
    inlineDependencies: sorted(inlineDeps),
    files,
    variant: main.variant,
  };

  if (main.tags.cssVars) entry.cssVars = true;
  if (main.tags.isNew) entry.isNew = true;
  if (main.tags.demos) entry.demos = main.tags.demos;
  if (main.tags.category) entry.category = main.tags.category;

  return entry;
}

// ---- PUBLIC API -------------------------------------------------------------

/**
 * Main entry point: scan the oss/ root and return a map of slug → config.
 *
 * Usage:
 *   import { discoverAll } from "./discover.mjs";
 *   const { static: staticMap, audio: audioMap, hooks: hookMap, lib: libMap } = discoverAll(ossRoot);
 *
 * @param {string} ossRoot Absolute path to the oss/ folder.
 * @returns {{
 *   all: Record<string, object>,
 *   byVariant: Record<string, Record<string, object>>,
 *   byType: Record<string, Record<string, object>>,
 *   scanned: ScannedFile[],
 * }}
 */
export function discoverAll(ossRoot) {
  const scanned = scanFiles(ossRoot);

  // Duplicate-slug detection.
  const slugCounts = new Map();
  for (const s of scanned) {
    if (s.tags.partOf) continue; // helpers share parent slug; allowed.
    slugCounts.set(s.slug, (slugCounts.get(s.slug) || 0) + 1);
  }
  const dupes = [...slugCounts.entries()].filter(([, c]) => c > 1);
  if (dupes.length) {
    throw new Error(
      `[discover] Duplicate registry slugs: ${dupes
        .map(([slug, count]) => `${slug} (×${count})`)
        .join(", ")}`
    );
  }

  const lookup = buildLookup(scanned);

  /** @type {Record<string, object>} */
  const all = {};
  /** @type {Record<string, Record<string, object>>} */
  const byVariant = {};
  /** @type {Record<string, Record<string, object>>} */
  const byType = {};

  for (const s of scanned) {
    const entry = resolveEntry(s, lookup, scanned);
    if (!entry) continue;
    all[s.slug] = entry;
    byVariant[s.variant] ||= {};
    byVariant[s.variant][s.slug] = entry;
    byType[s.type] ||= {};
    byType[s.type][s.slug] = entry;
  }

  return { all, byVariant, byType, scanned };
}

/**
 * Diff helper: compares the scanner's output to a previously-hand-authored
 * config object and returns an array of human-readable difference strings.
 * Used by `update-registry.mjs --check` to validate migrations.
 */
export function diffConfigs(generated, existing) {
  const diffs = [];
  const allKeys = new Set([
    ...Object.keys(generated),
    ...Object.keys(existing),
  ]);

  for (const key of [...allKeys].sort()) {
    const g = generated[key];
    const e = existing[key];
    if (!e) {
      diffs.push(`+ ${key} (only in generated)`);
      continue;
    }
    if (!g) {
      diffs.push(`- ${key} (only in existing)`);
      continue;
    }
    const fields = [
      "type",
      "title",
      "description",
      "dependencies",
      "registryDependencies",
      "inlineDependencies",
      "variant",
    ];
    for (const f of fields) {
      const gv = JSON.stringify(g[f] ?? null);
      const ev = JSON.stringify(e[f] ?? null);
      if (gv !== ev) {
        diffs.push(`~ ${key}.${f}: existing=${ev} generated=${gv}`);
      }
    }
    // Compare files paths only.
    const gFiles = (g.files || []).map((f) => f.path).sort();
    const eFiles = (e.files || []).map((f) => f.path).sort();
    if (JSON.stringify(gFiles) !== JSON.stringify(eFiles)) {
      diffs.push(
        `~ ${key}.files: existing=${JSON.stringify(
          eFiles
        )} generated=${JSON.stringify(gFiles)}`
      );
    }
  }

  return diffs;
}

// ---- CLI --------------------------------------------------------------------

// When run directly, print a JSON dump of the discovery output for debugging.
if (
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`
) {
  const root = dirname(
    dirname(new URL(import.meta.url).pathname.replace(/^\//, ""))
  );
  const out = discoverAll(root);
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        slugCount: Object.keys(out.all).length,
        byVariant: Object.fromEntries(
          Object.entries(out.byVariant).map(([v, m]) => [
            v,
            Object.keys(m).length,
          ])
        ),
        sample: Object.fromEntries(Object.entries(out.all).slice(0, 2)),
      },
      null,
      2
    )
  );
}

// Silence unused-var warning (exported helpers).
void relative;
