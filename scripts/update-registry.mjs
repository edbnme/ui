/**
 * Registry Update Script
 *
 * This script generates the component registry JSON files for both
 * animated and static component variants.
 *
 * CROSS-REFERENCE: The docs/explorer presentation registry is in
 * src/components/site/docs/explorer/component-registry.ts.
 * When adding a new component, ensure it's registered in BOTH files:
 *   - Here (registry-config/): files, dependencies, devDependencies (build/distribution)
 *   - There: slug, name, description, demos (presentation/docs)
 *
 * Output Structure:
 *   public/r/
 *   ├── animated/
 *   │   ├── button.json
 *   │   ├── alert-dialog.json
 *   │   └── ...
 *   ├── static/
 *   │   ├── button.json
 *   │   ├── alert-dialog.json
 *   │   └── ...
 *   ├── shared/
 *   │   ├── avatar.json
 *   │   ├── input.json
 *   │   └── ...
 *   ├── registry.json (main index)
 *   └── [legacy flat structure for backwards compatibility]
 *
 * @packageDocumentation
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Registry configuration imports (split into separate files for maintainability)
import { animatedComponents } from "./registry-config/animated-components.mjs";
import { staticComponents } from "./registry-config/static-components.mjs";
import { staticSharedComponents } from "./registry-config/shared-components.mjs";
import { libraryComponents } from "./registry-config/library-components.mjs";
import { hookComponents } from "./registry-config/hooks-config.mjs";
import { cssVarsLight, cssVarsDark } from "./registry-config/css-vars.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

// =============================================================================
// MERGED REGISTRY
// =============================================================================

// Merge all components
const allComponents = {
  ...animatedComponents,
  ...staticComponents,
  ...staticSharedComponents,
  ...libraryComponents,
  ...hookComponents,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function escapeContent(content) {
  return content;
}

function updateRegistryFile(name, config, outputDir) {
  const allFiles = [...config.files];

  // Add files from inline dependencies
  if (config.inlineDependencies && config.inlineDependencies.length > 0) {
    config.inlineDependencies.forEach((depName) => {
      const depConfig = allComponents[depName];
      if (depConfig) {
        allFiles.push(...depConfig.files);
      }
    });
  }

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: config.type,
    title: config.title,
    description: config.description,
    dependencies: config.dependencies,
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

  const outputPath = join(variantDir, `${name.replace("-static", "")}.json`);
  writeFileSync(outputPath, JSON.stringify(registryItem, null, 2), "utf-8");

  // Also write to flat structure for backwards compatibility
  const flatPath = join(outputDir, `${name}.json`);
  writeFileSync(flatPath, JSON.stringify(registryItem, null, 2), "utf-8");

  console.log(`[OK] Updated ${config.variant}/${name}.json`);
}

function updateMainRegistry(outputDir) {
  // Group items by variant
  const animatedItems = [];
  const staticItems = [];
  const sharedItems = [];

  Object.entries(allComponents).forEach(([name, config]) => {
    const item = {
      name,
      type: config.type,
      title: config.title,
      description: config.description,
      dependencies: config.dependencies,
      registryDependencies: config.registryDependencies,
      variant: config.variant,
      files: config.files.map((f) => ({ path: f.path, type: f.type })),
    };

    if (config.variant === "animated") {
      animatedItems.push(item);
    } else if (config.variant === "static") {
      staticItems.push(item);
    } else {
      sharedItems.push(item);
    }
  });

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "edbn-ui",
    version: "0.2.5",
    homepage: "https://ui.edbn.me",
    variants: {
      animated: {
        name: "Animated",
        description: "Components with motion/react spring animations",
        dependencies: ["motion"],
        cssImport: "@/lib/styles/animated.css",
      },
      static: {
        name: "Static",
        description: "Components with CSS-only animations (lighter bundle)",
        dependencies: [],
        cssImport: "@/lib/styles/static.css",
      },
    },
    items: [...animatedItems, ...staticItems, ...sharedItems],
  };

  const registryPath = join(root, "registry.json");
  writeFileSync(registryPath, JSON.stringify(registry, null, 2), "utf-8");
  console.log("[OK] Updated registry.json");

  const publicRegistryPath = join(outputDir, "registry.json");
  writeFileSync(publicRegistryPath, JSON.stringify(registry, null, 2), "utf-8");
  console.log("[OK] Updated public/r/registry.json");
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

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
ensureDir(join(outputDir, "animated"));
ensureDir(join(outputDir, "static"));

// Update individual component registry files
Object.entries(allComponents).forEach(([name, config]) => {
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
console.log("  ├── animated/   (motion/react components)");
console.log("  ├── static/     (CSS-only + Base UI components)");
console.log("  └── registry.json");

// =============================================================================
// BUNDLE SIZE COMPUTATION
// =============================================================================

console.log("\n[BUNDLE] Computing bundle sizes...\n");

import("./compute-bundle-sizes.mjs").catch((error) => {
  console.warn("[WARN] Bundle size computation skipped:", error.message);
  console.log(
    "   Run 'node oss/scripts/compute-bundle-sizes.mjs' manually to generate bundle data."
  );
});
