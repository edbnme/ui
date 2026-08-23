import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, isAbsolute, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = join(root, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const expectedBaseUrl = "https://edbn.dev/r";
const errors = [];

function fail(message) {
  errors.push(message);
}

function dependencyName(specifier) {
  if (specifier.startsWith("@")) {
    const packageSlash = specifier.indexOf("/");
    const versionAt = specifier.indexOf("@", packageSlash);
    return versionAt === -1 ? specifier : specifier.slice(0, versionAt);
  }

  const versionAt = specifier.indexOf("@");
  return versionAt === -1 ? specifier : specifier.slice(0, versionAt);
}

function importedPackage(specifier) {
  if (specifier.startsWith("@base-ui/react")) return "@base-ui/react";
  if (specifier.startsWith("@shadcn/react")) return "@shadcn/react";
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}

function isSafeRelativePath(path) {
  if (!path || isAbsolute(path)) return false;
  const normalized = normalize(path);
  return (
    normalized !== ".." &&
    !normalized.startsWith(`..${sep}`) &&
    !normalized.split(sep).includes("..")
  );
}

function isSafeTarget(target) {
  if (typeof target !== "string" || target.includes("\\")) return false;
  const prefix = ["@components/", "@ui/", "@lib/", "@hooks/"].find((value) =>
    target.startsWith(value)
  );
  return Boolean(prefix && isSafeRelativePath(target.slice(prefix.length)));
}

if (registry.name !== "edbn-ui") fail("registry.name must be edbn-ui");
if (!Array.isArray(registry.items)) fail("registry.items must be an array");

const items = Array.isArray(registry.items) ? registry.items : [];
const names = new Set();

for (const item of items) {
  if (names.has(item.name)) fail(`duplicate registry item: ${item.name}`);
  names.add(item.name);
}

const base = items.find((item) => item.name === "edbn-base");
const uiItems = items.filter((item) => item.type === "registry:ui");

if (!base || base.type !== "registry:base") {
  fail("edbn-base must exist as registry:base");
}
if (uiItems.length !== 62) {
  fail(`expected 62 registry:ui items, found ${uiItems.length}`);
}

const manifestFiles = new Set();

for (const item of items) {
  if (!Array.isArray(item.files) || item.files.length === 0) {
    fail(`${item.name}: files must not be empty`);
    continue;
  }

  for (const file of item.files) {
    if (!isSafeRelativePath(file.path)) {
      fail(`${item.name}: unsafe file path ${file.path}`);
      continue;
    }

    if (!isSafeTarget(file.target)) {
      fail(`${item.name}: unsafe or missing target ${file.target}`);
      continue;
    }

    const expectedTarget =
      file.type === "registry:ui"
        ? `@ui/${basename(file.path)}`
        : file.path === "lib/utils.ts"
          ? "@lib/utils.ts"
          : file.path === "hooks/use-mobile.ts"
            ? "@hooks/use-mobile.ts"
            : null;
    if (file.target !== expectedTarget) {
      fail(`${item.name}: expected target ${expectedTarget}, found ${file.target}`);
      continue;
    }

    const absolutePath = join(root, file.path);
    const withinRoot = relative(root, absolutePath);
    if (withinRoot.startsWith("..") || isAbsolute(withinRoot)) {
      fail(`${item.name}: file escapes registry root: ${file.path}`);
      continue;
    }
    if (!existsSync(absolutePath)) {
      fail(`${item.name}: missing source file ${file.path}`);
      continue;
    }

    manifestFiles.add(file.path);

    if (file.type !== "registry:ui") continue;

    const source = readFileSync(absolutePath, "utf8");
    const declared = new Set((item.dependencies || []).map(dependencyName));
    const registryDependencies = new Set(item.registryDependencies || []);
    const importPattern = /from\s+["']([^"']+)["']/g;
    let match;

    while ((match = importPattern.exec(source)) !== null) {
      const specifier = match[1];

      if (specifier === "react" || specifier.startsWith("react/")) continue;

      if (specifier.startsWith("@/components/ui/")) {
        const dependency = specifier.slice("@/components/ui/".length);
        const expected = `${expectedBaseUrl}/${dependency}.json`;
        if (!registryDependencies.has(expected)) {
          fail(`${item.name}: missing registry dependency ${expected}`);
        }
        continue;
      }

      if (specifier === "@/lib/utils" || specifier === "@/hooks/use-mobile") {
        continue;
      }

      if (specifier.startsWith("@/")) {
        fail(`${item.name}: unsupported internal import ${specifier}`);
        continue;
      }

      const packageName = importedPackage(specifier);
      if (!declared.has(packageName)) {
        fail(`${item.name}: undeclared package import ${packageName}`);
      }
    }
  }

  if (item.type === "registry:ui") {
    const dependencies = item.registryDependencies || [];
    if (dependencies[0] !== `${expectedBaseUrl}/edbn-base.json`) {
      fail(`${item.name}: edbn-base must be the first registry dependency`);
    }

    for (const url of dependencies) {
      if (!url.startsWith(`${expectedBaseUrl}/`) || !url.endsWith(".json")) {
        fail(`${item.name}: invalid registry dependency URL ${url}`);
        continue;
      }
      const referencedName = basename(new URL(url).pathname, ".json");
      if (!names.has(referencedName)) {
        fail(`${item.name}: unknown registry dependency ${referencedName}`);
      }
    }
  }
}

const sourceFiles = readdirSync(join(root, "components", "ui"))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => `components/ui/${file}`);

for (const file of sourceFiles) {
  if (!manifestFiles.has(file)) fail(`unregistered UI source file: ${file}`);
}

if (sourceFiles.length !== 62) {
  fail(`expected 62 UI source files, found ${sourceFiles.length}`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`[registry] ${error}`);
  process.exit(1);
}

console.log(`[registry] valid: ${uiItems.length} components + edbn-base`);
