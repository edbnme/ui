/**
 * Parse an npm dependency declaration used by the shadcn registry schema.
 *
 * Registry dependencies may be bare package names (`motion`) or carry an
 * install range (`motion@^12.0.0`). Scoped declarations keep the version
 * delimiter after the package name (`@tanstack/react-table@^8.21.3`).
 */
export function parseDependencySpecifier(value) {
  const specifier = String(value).trim();

  if (!specifier) {
    throw new Error("Dependency declarations cannot be empty");
  }

  const versionIndex = specifier.startsWith("@")
    ? specifier.indexOf("@", specifier.indexOf("/") + 1)
    : specifier.indexOf("@");
  const name =
    versionIndex === -1 ? specifier : specifier.slice(0, versionIndex);
  const version =
    versionIndex === -1 ? null : specifier.slice(versionIndex + 1);

  if (!name || (specifier.startsWith("@") && !name.includes("/"))) {
    throw new Error(`Invalid dependency declaration "${specifier}"`);
  }

  if (versionIndex !== -1 && !version) {
    throw new Error(`Missing version in dependency declaration "${specifier}"`);
  }

  return { name, specifier, version };
}

/** Return the installable package name without its optional version range. */
export function getDependencyName(value) {
  return parseDependencySpecifier(value).name;
}

/**
 * Deduplicate dependency declarations by package name while preserving a
 * versioned declaration over a bare import-derived declaration.
 */
export function mergeDependencySpecifiers(values) {
  const byName = new Map();

  for (const value of values) {
    const next = parseDependencySpecifier(value);
    const current = byName.get(next.name);

    if (!current || (!current.version && next.version)) {
      byName.set(next.name, next);
      continue;
    }

    if (
      current.version &&
      next.version &&
      current.specifier !== next.specifier
    ) {
      throw new Error(
        `Conflicting dependency declarations for "${next.name}": ` +
          `"${current.specifier}" and "${next.specifier}"`
      );
    }
  }

  return [...byName.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ specifier }) => specifier);
}
