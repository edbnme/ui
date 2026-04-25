/**
 * Registry Update Script
 *
 * Generates component registry JSON files for every variant (static, audio,
 * hooks, lib). Registry config is DERIVED from the component source files
 * themselves via `registry-config/discover.mjs` — there is no hand-authored
 * config to keep in sync.
 *
 * To change a component's registry metadata, edit the component's JSDoc
 * header tags (see `registry-config/discover.mjs` for the full tag reference).
 *
 * Output Structure:
 *   public/r/
 *   ├── static/          variant-specific copies
 *   ├── audio/
 *   ├── <slug>.json      flat root-level (loaded by the frontend)
 *   └── registry.json    main index
 *
 * @packageDocumentation
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { discoverAll } from "./registry-config/discover.mjs";
import { cssVarsLight, cssVarsDark } from "./registry-config/css-vars.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

// ---- SINGLE SOURCE OF TRUTH — derived from source files -------------------

const { all: allConfig } = discoverAll(root);

// Split by type for the orchestrator's downstream logic. The buckets preserve
// backwards-compatible names so the rest of this script (and any external
// tooling) continues to work without changes.
const partition = (pred) =>
  Object.fromEntries(Object.entries(allConfig).filter(([, c]) => pred(c)));

const staticComponents = partition(
  (c) => c.type === "registry:ui" && c.variant === "static"
);
const audioComponents = partition(
  (c) => c.type === "registry:ui" && c.variant === "audio"
);
const libraryComponents = partition((c) => c.type === "registry:lib");
const hookComponents = partition(
  (c) => c.type === "registry:hook" && c.variant === "static"
);
const audioHookComponents = partition(
  (c) => c.type === "registry:hook" && c.variant === "audio"
);

// ---- COMPONENT REGISTRY — Entry-list approach (avoids name collisions between variants) -

// Build a flat list of [name, config] entries from all component sets.
const allEntries = [
  ...Object.entries(staticComponents),
  ...Object.entries(libraryComponents),
  ...Object.entries(hookComponents),
  ...Object.entries(audioComponents),
  ...Object.entries(audioHookComponents),
];

// Lookup map for inline dependency resolution.
// Only library and hook components are referenced as inlineDependencies,
// so there are no name collisions here.
const inlineLookup = {
  ...libraryComponents,
  ...hookComponents,
  ...audioHookComponents,
};

// ---- HELPER FUNCTIONS -------------------------------------------------------

function sortedUnique(values) {
  return Array.from(new Set(values)).sort();
}

function collectInlineConfigs(config, seen = new Set()) {
  const collected = [];

  for (const depName of config.inlineDependencies || []) {
    if (seen.has(depName)) continue;
    seen.add(depName);

    const depConfig = inlineLookup[depName];
    if (!depConfig) continue;

    collected.push(depConfig);
    collected.push(...collectInlineConfigs(depConfig, seen));
  }

  return collected;
}

function collectRegistryFiles(config) {
  const inlineConfigs = collectInlineConfigs(config);
  const filesByPath = new Map();

  for (const file of config.files) {
    filesByPath.set(file.path, file);
  }

  for (const depConfig of inlineConfigs) {
    for (const file of depConfig.files) {
      if (!filesByPath.has(file.path)) {
        filesByPath.set(file.path, file);
      }
    }
  }

  return Array.from(filesByPath.values());
}

function collectRegistryDependencies(config) {
  const inlineConfigs = collectInlineConfigs(config);
  const dependencies = [...(config.dependencies || [])];

  for (const depConfig of inlineConfigs) {
    dependencies.push(...(depConfig.dependencies || []));
  }

  return sortedUnique(dependencies);
}

function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function escapeContent(content) {
  return content;
}

function updateRegistryFile(name, config, outputDir) {
  const allFiles = collectRegistryFiles(config);
  const dependencies = collectRegistryDependencies(config);

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: config.type,
    title: config.title,
    description: config.description,
    dependencies,
    registryDependencies: config.registryDependencies,
    variant: config.variant,
    files: allFiles.map((file) => {
      const fullPath = join(root, file.path);
      try {
        const content = readFileSync(fullPath, "utf-8");
        return {
          path: file.path,
          content: escapeContent(content),
          type: file.type,
        };
      } catch {
        console.warn(`[WARN] File not found: ${file.path}`);
        return {
          path: file.path,
          content: "",
          type: file.type,
        };
      }
    }),
  };

  // Add CSS vars configuration if present
  if (config.cssVars) {
    registryItem.cssVars = {
      light: cssVarsLight,
      dark: cssVarsDark,
    };
  }

  // Write to variant-specific subdirectory
  const variantDir = join(outputDir, config.variant || "static");
  ensureDir(variantDir);

  const outputPath = join(variantDir, `${name}.json`);
  writeFileSync(outputPath, JSON.stringify(registryItem, null, 2), "utf-8");

  // Also write to flat structure for backwards compatibility
  const flatPath = join(outputDir, `${name}.json`);
  writeFileSync(flatPath, JSON.stringify(registryItem, null, 2), "utf-8");

  console.log(`[OK] Updated ${config.variant}/${name}.json`);
}

function updateMainRegistry(outputDir) {
  // Collect all items
  const items = allEntries.map(([name, config]) => ({
    name,
    type: config.type,
    title: config.title,
    description: config.description,
    dependencies: collectRegistryDependencies(config),
    registryDependencies: config.registryDependencies,
    variant: config.variant,
    files: config.files.map((f) => ({ path: f.path, type: f.type })),
  }));

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "edbn-ui",
    version: "0.3.0",
    homepage: "https://ui.edbn.me",
    variants: {
      static: {
        name: "Static",
        description: "Components with CSS-only animations (lighter bundle)",
        dependencies: [],
        cssImport: "@/lib/styles/static.css",
      },
      audio: {
        name: "Audio",
        description:
          "AI chat and audio components with Web Audio API and motion animations",
        dependencies: ["class-variance-authority"],
        cssImport: null,
      },
    },
    items,
  };

  const registryPath = join(root, "registry.json");
  writeFileSync(registryPath, JSON.stringify(registry, null, 2), "utf-8");
  console.log("[OK] Updated registry.json");

  const publicRegistryPath = join(outputDir, "registry.json");
  writeFileSync(publicRegistryPath, JSON.stringify(registry, null, 2), "utf-8");
  console.log("[OK] Updated public/r/registry.json");
}

// ---- MAIN EXECUTION ---------------------------------------------------------

// ASCII Art Banner - EDBN UI
const banner = [
  "",
  "   ███████ ██████  ██████  ███    ██   ██    ██ ██████",
  "   ██      ██   ██ ██   ██ ████   ██   ██    ██   ██  ",
  "   █████   ██   ██ ██████  ██ ██  ██   ██    ██   ██  ",
  "   ██      ██   ██ ██   ██ ██  ██ ██   ██    ██   ██  ",
  "   ███████ ██████  ██████  ██   ████    ██████  ██████",
  "",
].join("\n");

console.log(banner);
console.log("[REGISTRY] Updating registry files...\n");

const outputDir = join(root, "public", "r");

// Ensure output directories exist
ensureDir(outputDir);
ensureDir(join(outputDir, "static"));
ensureDir(join(outputDir, "audio"));

// Update individual component registry files
allEntries.forEach(([name, config]) => {
  try {
    updateRegistryFile(name, config, outputDir);
  } catch (error) {
    console.error(`[ERROR] Failed to update ${name}.json:`, error.message);
  }
});

// Update main registry
try {
  updateMainRegistry(outputDir);
} catch (error) {
  console.error("[ERROR] Failed to update main registry:", error.message);
}

console.log("\n[DONE] Registry update complete!");
console.log("\nOutput structure:");
console.log("  public/r/");
console.log("  ├── static/     (CSS-only + Base UI components)");
console.log("  ├── audio/      (Audio/AI chat components)");
console.log("  └── registry.json");

// ---- BUNDLE SIZE COMPUTATION ------------------------------------------------

console.log("\n[BUNDLE] Computing bundle sizes...\n");

import("./compute-bundle-sizes.mjs").catch((error) => {
  console.warn("[WARN] Bundle size computation skipped:", error.message);
  console.log(
    "   Run 'node oss/scripts/compute-bundle-sizes.mjs' manually to generate bundle data."
  );
});
