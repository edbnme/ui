import { existsSync, readFileSync, readdirSync } from "node:fs";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  normalize,
  posix,
  relative,
  sep,
} from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
const componentsConfig = JSON.parse(
  readFileSync(join(root, "components.json"), "utf8")
);
const expectedBaseUrl = "https://ui.edbn.me/r";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
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
  if (specifier.startsWith("@"))
    return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}

function isSafeRelativePath(filePath) {
  if (!filePath || isAbsolute(filePath) || filePath.includes("\\"))
    return false;
  const normalized = normalize(filePath);
  return (
    normalized !== ".." &&
    !normalized.startsWith(`..${sep}`) &&
    !normalized.split(sep).includes("..")
  );
}

function isSafeTarget(target) {
  if (typeof target !== "string" || target.includes("\\")) return false;
  const prefix = ["@ui/", "@lib/", "@hooks/"].find((value) =>
    target.startsWith(value)
  );
  return Boolean(prefix && isSafeRelativePath(target.slice(prefix.length)));
}

function extractImportSpecifiers(source) {
  const specifiers = new Set();
  const staticPattern =
    /\b(?:import|export)\s+(?:type\s+)?(?:[^"'`;]*?\sfrom\s*)?["']([^"']+)["']/g;
  const dynamicPattern = /\bimport\(\s*["']([^"']+)["']\s*\)/g;
  let match;
  while ((match = staticPattern.exec(source)) !== null)
    specifiers.add(match[1]);
  while ((match = dynamicPattern.exec(source)) !== null)
    specifiers.add(match[1]);
  return [...specifiers];
}

function walkSourceFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name))
    .map((entry) =>
      relative(root, join(entry.parentPath, entry.name)).split(sep).join("/")
    );
}

function resolveRelativeImport(sourcePath, specifier, sourcePaths) {
  const candidate = posix.normalize(
    posix.join(posix.dirname(sourcePath), specifier)
  );
  return [
    candidate,
    `${candidate}.ts`,
    `${candidate}.tsx`,
    `${candidate}.mts`,
    `${candidate}/index.ts`,
    `${candidate}/index.tsx`,
  ].find((value) => sourcePaths.has(value));
}

function expectedTargetFor(item, file) {
  if (item.type === "registry:ui") {
    return file.type === "registry:ui" && file.path.startsWith("components/ui/")
      ? `@ui/${file.path.slice("components/ui/".length)}`
      : null;
  }
  if (item.type === "registry:base") {
    if (file.type === "registry:lib" && file.path.startsWith("lib/"))
      return `@lib/${file.path.slice("lib/".length)}`;
    if (file.type === "registry:hook" && file.path.startsWith("hooks/"))
      return `@hooks/${file.path.slice("hooks/".length)}`;
    return null;
  }
  return null;
}

function targetSpecifier(target) {
  const extensionless = target.replace(/\.[cm]?[jt]sx?$/, "");
  if (extensionless.startsWith("@ui/"))
    return `@/components/ui/${extensionless.slice("@ui/".length)}`;
  if (extensionless.startsWith("@lib/"))
    return `@/lib/${extensionless.slice("@lib/".length)}`;
  if (extensionless.startsWith("@hooks/"))
    return `@/hooks/${extensionless.slice("@hooks/".length)}`;
  return null;
}

function validateDependencyCycles(itemsByName, dependencyNamesByItem) {
  const visiting = new Set();
  const visited = new Set();
  function visit(name, path) {
    if (visiting.has(name)) {
      fail(`registry dependency cycle: ${[...path, name].join(" -> ")}`);
      return;
    }
    if (visited.has(name)) return;
    visiting.add(name);
    for (const dependency of dependencyNamesByItem.get(name) ?? []) {
      if (itemsByName.has(dependency) && dependency !== "edbn-base")
        visit(dependency, [...path, name]);
    }
    visiting.delete(name);
    visited.add(name);
  }
  for (const name of itemsByName.keys()) visit(name, []);
}

if (registry.name !== "edbn-ui") fail("registry.name must be edbn-ui");
if (!Array.isArray(registry.items)) fail("registry.items must be an array");
if (Object.keys(componentsConfig.registries ?? {}).length > 0)
  fail("components.json must not configure third-party registries");

const items = Array.isArray(registry.items) ? registry.items : [];
const itemsByName = new Map();
for (const item of items) {
  if (typeof item.name !== "string" || !slugPattern.test(item.name))
    fail(`invalid registry item name: ${item.name}`);
  if (itemsByName.has(item.name)) fail(`duplicate registry item: ${item.name}`);
  itemsByName.set(item.name, item);
  if (!["registry:base", "registry:ui"].includes(item.type))
    fail(`${item.name}: unsupported registry item type ${item.type}`);
}

const baseItems = items.filter((item) => item.type === "registry:base");
const uiItems = items.filter((item) => item.type === "registry:ui");
if (baseItems.length !== 1 || baseItems[0]?.name !== "edbn-base")
  fail("edbn-base must be the only registry:base item");
if (uiItems.length === 0) fail("registry must contain registry:ui items");

const manifestFiles = new Set();
const fileOwners = new Map();
const targetOwners = new Map();
const ownerBySpecifier = new Map();
const sourcePaths = new Set(
  items.flatMap((item) => (item.files ?? []).map((file) => file.path))
);
const baseImportSpecifiers = new Set();

for (const file of baseItems[0]?.files ?? []) {
  const specifier = targetSpecifier(file.target);
  if (specifier) baseImportSpecifiers.add(specifier);
}

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
    const expectedTarget = expectedTargetFor(item, file);
    if (!expectedTarget || file.target !== expectedTarget) {
      fail(
        `${item.name}: expected target ${expectedTarget}, found ${file.target}`
      );
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
    if (fileOwners.has(file.path))
      fail(`${item.name}: source owned by ${fileOwners.get(file.path)}`);
    else fileOwners.set(file.path, item.name);
    if (targetOwners.has(file.target))
      fail(`${item.name}: target owned by ${targetOwners.get(file.target)}`);
    else targetOwners.set(file.target, item.name);
    manifestFiles.add(file.path);
    const specifier = targetSpecifier(file.target);
    if (specifier) ownerBySpecifier.set(specifier, item.name);
  }
}

const dependencyNamesByItem = new Map();
for (const item of items) {
  const registryDependencies = item.registryDependencies ?? [];
  const dependencyNames = new Set();
  dependencyNamesByItem.set(item.name, dependencyNames);
  if (item.type === "registry:ui") {
    if (registryDependencies[0] !== `${expectedBaseUrl}/edbn-base.json`)
      fail(`${item.name}: edbn-base must be the first registry dependency`);
  }
  for (const url of registryDependencies) {
    let referencedName;
    try {
      const parsed = new URL(url);
      if (
        !url.startsWith(`${expectedBaseUrl}/`) ||
        !parsed.pathname.endsWith(".json")
      ) {
        throw new Error("unsupported URL");
      }
      referencedName = basename(parsed.pathname, ".json");
    } catch {
      fail(`${item.name}: invalid registry dependency URL ${url}`);
      continue;
    }
    if (!itemsByName.has(referencedName))
      fail(`${item.name}: unknown registry dependency ${referencedName}`);
    if (referencedName === item.name)
      fail(`${item.name}: self registry dependency is not allowed`);
    dependencyNames.add(referencedName);
  }

  const declaredPackages = new Set(
    (item.dependencies ?? []).map(dependencyName)
  );
  for (const file of item.files ?? []) {
    const absolutePath = join(root, file.path);
    if (!existsSync(absolutePath)) continue;
    const source = readFileSync(absolutePath, "utf8");
    for (const specifier of extractImportSpecifiers(source)) {
      if (
        specifier === "react" ||
        specifier.startsWith("react/") ||
        specifier === "react-dom" ||
        specifier.startsWith("react-dom/")
      ) {
        continue;
      }
      if (specifier.startsWith(".")) {
        const resolved = resolveRelativeImport(
          file.path,
          specifier,
          sourcePaths
        );
        if (!resolved)
          fail(`${item.name}: unresolved relative import ${specifier}`);
        else if (fileOwners.get(resolved) !== item.name)
          fail(
            `${item.name}: relative import escapes item ownership: ${specifier}`
          );
        continue;
      }
      if (baseImportSpecifiers.has(specifier)) continue;
      if (specifier.startsWith("@/")) {
        const owner = ownerBySpecifier.get(specifier);
        if (!owner) {
          fail(`${item.name}: unsupported internal import ${specifier}`);
        } else if (owner !== item.name && !dependencyNames.has(owner)) {
          fail(`${item.name}: missing registry dependency for ${owner}`);
        }
        continue;
      }
      const packageName = importedPackage(specifier);
      if (!declaredPackages.has(packageName))
        fail(`${item.name}: undeclared package import ${packageName}`);
    }
  }
}

validateDependencyCycles(itemsByName, dependencyNamesByItem);

for (const file of walkSourceFiles(join(root, "components", "ui"))) {
  if (!manifestFiles.has(file))
    fail(`unregistered registry source file: ${file}`);
}
for (const file of manifestFiles) {
  if (
    file.startsWith("components/ui/") &&
    !existsSync(join(root, file))
  ) {
    fail(`registered source file is missing: ${file}`);
  }
}

if (errors.length > 0) {
  for (const error of [...new Set(errors)])
    console.error(`[registry] ${error}`);
  process.exit(1);
}

console.log(`[registry] valid: ${uiItems.length} components + edbn-base`);
