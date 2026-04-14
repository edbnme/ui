/**
 * Registry Validation Script
 *
 * Build-time validation for edbn-ui registry JSON files.
 * Checks dependency declarations, import resolution, component conventions,
 * and hardcoded color usage.
 *
 * Usage: node oss/scripts/validate-registry.mjs
 * Exit code: 0 on success, 1 on validation errors
 *
 * @packageDocumentation
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..", "..");

// ---- CONFIGURATION ----------------------------------------------------------

/** Registry output directories (check both, prefer public/r/) */
const REGISTRY_DIRS = [
  join(root, "public", "r"),
  join(root, "oss", "public", "r"),
];

/** Items exempt from UI component checks (hooks, libs, etc.) */
const NON_UI_TYPES = ["registry:hook", "registry:lib", "registry:component"];

/** Files exempt from hardcoded color warnings */
const COLOR_EXEMPTIONS = [
  "components/ui/static/avatar.tsx",
  "components/ui/animated/slide-to-unlock.tsx",
  "maps/",
];

// ---- VALIDATION PATTERNS ----------------------------------------------------

const patterns = {
  useClient: /^["']use client["'];?\s*$/m,
  forwardRef: /forwardRef[<(]/,
  dataSlot: /data-slot\s*=\s*["']/,

  /** Hardcoded Tailwind color classes */
  hardcodedColors:
    /\b(?:bg|text|border|ring|shadow|outline|fill|stroke)-(?:white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d+)?(?:\/\d+)?\b/g,
};

// ---- HELPERS ----------------------------------------------------------------

let errors = 0;
let warnings = 0;

function error(item, msg) {
  console.error(`  [ERROR] ${item}: ${msg}`);
  errors++;
}

function warn(item, msg) {
  console.warn(`  [WARN]  ${item}: ${msg}`);
  warnings++;
}

function getRegistryDir() {
  for (const dir of REGISTRY_DIRS) {
    if (existsSync(dir)) return dir;
  }
  return null;
}

function extractNpmPackage(importPath) {
  if (importPath.startsWith("@")) {
    const parts = importPath.split("/");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : importPath;
  }
  return importPath.split("/")[0];
}

function isColorExempt(filePath) {
  return COLOR_EXEMPTIONS.some((exemption) => filePath.includes(exemption));
}

// ---- VALIDATORS -------------------------------------------------------------

function validateFileContent(item, file) {
  if (!file.content || file.content.trim().length === 0) {
    error(item.name, `File ${file.path} has empty content`);
  }
}

function validateDependencies(item, file) {
  if (!file.content) return;

  const content = file.content;
  const declaredDeps = new Set(item.dependencies || []);

  const npmImportRegex =
    /(?:import\s+.*?from|import)\s+["']([^./@ ][^"' ]*|@[^/"' ]+\/[^"' ]+)["']/g;
  let match;
  const foundPackages = new Set();

  while ((match = npmImportRegex.exec(content)) !== null) {
    const pkg = extractNpmPackage(match[1]);
    if (pkg === "react" || pkg === "react-dom" || pkg === "react/jsx-runtime")
      continue;
    if (pkg.startsWith("node:")) continue;
    foundPackages.add(pkg);
  }

  for (const pkg of foundPackages) {
    if (!declaredDeps.has(pkg)) {
      error(
        item.name,
        `npm import "${pkg}" in ${file.path} not declared in dependencies`
      );
    }
  }
}

function validateComponentConventions(item, file) {
  if (!file.content) return;
  if (NON_UI_TYPES.includes(item.type)) return;

  const content = file.content;

  // Only check "use client" on UI/component files, not on bundled lib/hook files
  const isUiFile =
    file.type === "registry:ui" || file.type === "registry:component";

  if (isUiFile && !patterns.useClient.test(content)) {
    error(item.name, `Missing "use client" directive in ${file.path}`);
  }

  if (file.type === "registry:ui" && !patterns.forwardRef.test(content)) {
    warn(
      item.name,
      `No forwardRef found in ${file.path} — expected for UI components`
    );
  }

  if (file.type === "registry:ui" && !patterns.dataSlot.test(content)) {
    warn(item.name, `No data-slot attribute found in ${file.path}`);
  }
}

function validateHardcodedColors(item, file) {
  if (!file.content) return;
  if (isColorExempt(file.path)) return;

  const content = file.content;
  const matches = content.match(patterns.hardcodedColors);

  if (matches) {
    const filtered = matches.filter((m) => {
      if (m === "bg-black/50" || m === "bg-black") return false;
      if (m === "text-white") return false;
      return true;
    });

    if (filtered.length > 0) {
      warn(
        item.name,
        `Hardcoded colors in ${file.path}: ${[...new Set(filtered)].join(", ")}`
      );
    }
  }
}

// ---- MAIN -------------------------------------------------------------------

console.log("");
console.log("   ╔═══════════════════════════════════════╗");
console.log("   ║   EDBN UI — Registry Validation       ║");
console.log("   ╚═══════════════════════════════════════╝");
console.log("");

const registryDir = getRegistryDir();

if (!registryDir) {
  console.error(
    "[FATAL] No registry directory found. Run `npm run registry:build` first."
  );
  console.error("  Checked:", REGISTRY_DIRS.join(", "));
  process.exit(1);
}

console.log(`[INFO] Using registry at: ${registryDir}`);
console.log("");

const jsonFiles = readdirSync(registryDir).filter(
  (f) =>
    f.endsWith(".json") && f !== "registry.json" && f !== "demo-sources.json"
);

console.log(`[INFO] Found ${jsonFiles.length} registry items to validate\n`);

let registryIndex = null;
const indexPath = join(registryDir, "registry.json");
if (existsSync(indexPath)) {
  try {
    registryIndex = JSON.parse(readFileSync(indexPath, "utf-8"));
  } catch (e) {
    error("registry.json", `Failed to parse: ${e.message}`);
  }
}

for (const jsonFile of jsonFiles) {
  const filePath = join(registryDir, jsonFile);
  let item;

  try {
    item = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (e) {
    error(jsonFile, `Failed to parse JSON: ${e.message}`);
    continue;
  }

  console.log(`  Validating: ${item.name || jsonFile}`);

  if (!item.files || !Array.isArray(item.files)) {
    error(item.name || jsonFile, "Missing or invalid 'files' array");
    continue;
  }

  for (const file of item.files) {
    validateFileContent(item, file);
    validateDependencies(item, file);
    validateComponentConventions(item, file);
    validateHardcodedColors(item, file);
  }
}

if (registryIndex) {
  console.log("\n  Validating: registry.json (index)");

  if (!registryIndex.items || !Array.isArray(registryIndex.items)) {
    error("registry.json", "Missing or invalid 'items' array");
  } else {
    const indexedNames = new Set(registryIndex.items.map((i) => i.name));

    for (const jsonFile of jsonFiles) {
      const name = jsonFile.replace(".json", "");
      if (!indexedNames.has(name)) {
        warn(
          "registry.json",
          `${name} has a JSON file but is not in the index`
        );
      }
    }
  }
}

// ---- SUMMARY ----------------------------------------------------------------

console.log("\n" + "=".repeat(50));
console.log(`  Validation complete: ${jsonFiles.length} items checked`);
console.log(`  Errors:   ${errors}`);
console.log(`  Warnings: ${warnings}`);
console.log("=".repeat(50) + "\n");

if (errors > 0) {
  console.error(
    "[FAIL] Registry validation failed with errors. Fix them before building.\n"
  );
  process.exit(1);
} else if (warnings > 0) {
  console.log("[PASS] Registry validation passed with warnings.\n");
} else {
  console.log("[PASS] Registry validation passed — all checks clean.\n");
}
