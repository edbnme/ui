/**
 * Bundle Size Computation Script
 *
 * Fetches bundle size data from Bundlephobia API for all component dependencies,
 * computes totals, and writes a comprehensive JSON file for visualization.
 *
 * Features:
 * - Fetches sizes from Bundlephobia API with retry logic
 * - Caches results by package@version to avoid redundant requests
 * - Falls back to estimates for unavailable packages
 * - Computes per-component totals including shared dependencies
 * - Generates comparison data between animated vs static variants
 *
 * Output: public/data/bundle-sizes.json
 *
 * @packageDocumentation
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

// =============================================================================
// CONFIGURATION
// =============================================================================

const BUNDLEPHOBIA_API = "https://bundlephobia.com/api/size";
const CACHE_FILE = join(root, ".cache", "bundle-sizes-cache.json");
const OUTPUT_FILE = join(root, "public", "data", "bundle-sizes.json");

// Rate limiting: max 10 requests per second
const RATE_LIMIT_MS = 120;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Known package sizes for fallback (when Bundlephobia can't analyze)
// These are approximate sizes in bytes
const FALLBACK_SIZES = {
  motion: { size: 150000, gzip: 45000 },
  "tw-animate-css": { size: 18000, gzip: 5000 },
  clsx: { size: 1800, gzip: 600 },
  "tailwind-merge": { size: 28000, gzip: 8000 },
  "class-variance-authority": { size: 4500, gzip: 1500 },
  "next-themes": { size: 4000, gzip: 1200 },
  "@base-ui/react": { size: 85000, gzip: 25000 },
  "@phosphor-icons/react": {
    size: 1200,
    gzip: 400,
    note: "Per icon, tree-shakable",
  },
};

// =============================================================================
// CACHE MANAGEMENT
// =============================================================================

let cache = {};

function loadCache() {
  try {
    if (existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
      // Only use cache entries less than 7 days old
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      cache = Object.fromEntries(
        Object.entries(cacheData).filter(
          ([, entry]) => now - (entry.timestamp || 0) < maxAge
        )
      );
      console.log(
        `[CACHE] Loaded ${Object.keys(cache).length} cached package sizes`
      );
    }
  } catch (error) {
    console.warn("[WARN] Could not load cache:", error.message);
    cache = {};
  }
}

function saveCache() {
  try {
    const cacheDir = dirname(CACHE_FILE);
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }
    writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch (error) {
    console.warn("[WARN] Could not save cache:", error.message);
  }
}

// =============================================================================
// API FETCHING
// =============================================================================

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "edbn-ui-bundle-analyzer/1.0",
          Accept: "application/json",
        },
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = parseInt(response.headers.get("Retry-After") || "5");
        console.log(`[WAIT] Rate limited, waiting ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt < retries) {
        console.log(`[WARN] Attempt ${attempt} failed, retrying...`);
        await sleep(RETRY_DELAY_MS * attempt);
      } else {
        throw error;
      }
    }
  }
}

async function getPackageSize(packageName) {
  // Check cache first
  if (cache[packageName]) {
    return cache[packageName].data;
  }

  // Check fallback
  if (FALLBACK_SIZES[packageName]) {
    const fallback = {
      name: packageName,
      size: FALLBACK_SIZES[packageName].size,
      gzip: FALLBACK_SIZES[packageName].gzip,
      version: "latest",
      source: "fallback",
      note: FALLBACK_SIZES[packageName].note,
    };
    cache[packageName] = { data: fallback, timestamp: Date.now() };
    return fallback;
  }

  try {
    // Rate limit
    await sleep(RATE_LIMIT_MS);

    console.log(`[FETCH] Fetching size for ${packageName}...`);
    const data = await fetchWithRetry(
      `${BUNDLEPHOBIA_API}?package=${encodeURIComponent(packageName)}`
    );

    const result = {
      name: data.name,
      version: data.version,
      size: data.size,
      gzip: data.gzip,
      dependencyCount: data.dependencyCount || 0,
      source: "bundlephobia",
    };

    cache[packageName] = { data: result, timestamp: Date.now() };
    console.log(
      `[OK] ${packageName}@${data.version}: ${formatBytes(data.gzip)} gzip`
    );
    return result;
  } catch (error) {
    console.warn(`[WARN] Could not fetch ${packageName}: ${error.message}`);

    // Create estimate based on package type
    const estimate = estimatePackageSize(packageName);
    cache[packageName] = { data: estimate, timestamp: Date.now() };
    return estimate;
  }
}

function estimatePackageSize(packageName) {
  // Estimate based on package naming patterns
  let size = 10000; // Default 10KB
  let gzip = 3000; // Default 3KB gzip

  if (packageName.startsWith("@base-ui/")) {
    size = 85000;
    gzip = 25000;
  } else if (packageName.startsWith("@phosphor-icons/")) {
    size = 1200;
    gzip = 400;
  } else if (
    packageName.includes("motion") ||
    packageName.includes("animate")
  ) {
    size = 50000;
    gzip = 15000;
  }

  return {
    name: packageName,
    size,
    gzip,
    version: "unknown",
    source: "estimate",
  };
}

// =============================================================================
// REGISTRY PARSING
// =============================================================================

function loadRegistry() {
  const registryPath = join(root, "registry.json");
  try {
    return JSON.parse(readFileSync(registryPath, "utf-8"));
  } catch (error) {
    console.error("[ERROR] Could not load registry.json:", error.message);
    process.exit(1);
  }
}

function extractAllDependencies(registry) {
  const allDeps = new Set();

  for (const item of registry.items || []) {
    if (item.dependencies) {
      item.dependencies.forEach((dep) => allDeps.add(dep));
    }
  }

  return Array.from(allDeps).sort();
}

// =============================================================================
// SIZE COMPUTATION
// =============================================================================

function computeComponentSizes(registry, packageSizes) {
  const components = {};
  const packageSizeMap = new Map(packageSizes.map((p) => [p.name, p]));

  for (const item of registry.items || []) {
    // Skip non-UI components
    if (item.type !== "registry:ui") continue;

    const componentName = item.name.replace("-static", "");
    const variant = item.variant || "shared";

    // Calculate sizes for this component
    const deps = (item.dependencies || []).map((dep) => {
      const pkgData = packageSizeMap.get(dep) || {
        name: dep,
        size: 5000,
        gzip: 1500,
        source: "unknown",
      };
      return {
        name: dep,
        size: pkgData.size,
        gzip: pkgData.gzip,
        version: pkgData.version,
        source: pkgData.source,
      };
    });

    // Compute totals
    const totalSize = deps.reduce((sum, d) => sum + d.size, 0);
    const totalGzip = deps.reduce((sum, d) => sum + d.gzip, 0);

    // Determine component key
    const key =
      variant === "static" ? `${componentName}-static` : componentName;

    components[key] = {
      name: componentName,
      title: item.title,
      description: item.description,
      variant,
      sizes: {
        minified: totalSize,
        gzipped: totalGzip,
        // Estimate component's own size (without deps) as ~2KB average
        selfSize: 2000,
        selfGzip: 600,
      },
      dependencies: deps,
      dependencyCount: deps.length,
    };
  }

  return components;
}

function computeVariantComparisons(components) {
  const comparisons = {};
  const animatedComponents = Object.entries(components).filter(
    ([, c]) => c.variant === "animated"
  );

  for (const [name, animated] of animatedComponents) {
    const staticName = `${animated.name}-static`;
    const staticComponent = components[staticName];

    if (staticComponent) {
      const sizeDiff = animated.sizes.gzipped - staticComponent.sizes.gzipped;
      const percentDiff = Math.round((sizeDiff / animated.sizes.gzipped) * 100);

      comparisons[animated.name] = {
        animated: {
          name,
          gzipped: animated.sizes.gzipped,
        },
        static: {
          name: staticName,
          gzipped: staticComponent.sizes.gzipped,
        },
        difference: {
          bytes: sizeDiff,
          percent: percentDiff,
          savings: formatBytes(sizeDiff),
        },
      };
    }
  }

  return comparisons;
}

// =============================================================================
// UTILITIES
// =============================================================================

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function main() {
  console.log("[BUNDLE] Computing bundle sizes...\n");

  // Load cache
  loadCache();

  // Load registry
  const registry = loadRegistry();
  console.log(`[INFO] Found ${registry.items?.length || 0} registry items\n`);

  // Extract all unique dependencies
  const allDeps = extractAllDependencies(registry);
  console.log(`[INFO] Found ${allDeps.length} unique dependencies\n`);

  // Fetch sizes for all dependencies
  const packageSizes = [];
  for (const dep of allDeps) {
    const size = await getPackageSize(dep);
    packageSizes.push(size);
  }

  // Save cache after fetching
  saveCache();

  console.log("\n[SIZES] Computing component sizes...\n");

  // Compute per-component sizes
  const components = computeComponentSizes(registry, packageSizes);

  // Compute variant comparisons
  const comparisons = computeVariantComparisons(components);

  // Create summary stats
  const summary = {
    totalPackages: packageSizes.length,
    totalComponents: Object.keys(components).length,
    animatedComponents: Object.values(components).filter(
      (c) => c.variant === "animated"
    ).length,
    staticComponents: Object.values(components).filter(
      (c) => c.variant === "static"
    ).length,
    sharedComponents: Object.values(components).filter(
      (c) => c.variant === "shared"
    ).length,
    largestDependency: packageSizes.reduce((max, p) =>
      p.gzip > max.gzip ? p : max
    ),
    computedAt: new Date().toISOString(),
  };

  // Build output
  const output = {
    $schema: "https://ui.edbn.me/schemas/bundle-sizes.json",
    version: "1.0.0",
    summary,
    packages: packageSizes,
    components,
    comparisons,
  };

  // Write output
  ensureDir(dirname(OUTPUT_FILE));
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

  console.log(`\n[DONE] Bundle sizes computed successfully!`);
  console.log(`[OUTPUT] ${OUTPUT_FILE}`);
  console.log(`\n[SUMMARY]`);
  console.log(`   • ${summary.totalPackages} packages analyzed`);
  console.log(`   • ${summary.totalComponents} components processed`);
  console.log(
    `   • ${Object.keys(comparisons).length} animated/static comparisons`
  );
  console.log(
    `   • Largest dependency: ${summary.largestDependency.name} (${formatBytes(summary.largestDependency.gzip)} gzip)`
  );
}

main().catch((error) => {
  console.error("[ERROR] Fatal error:", error);
  process.exit(1);
});
