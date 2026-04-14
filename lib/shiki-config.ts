import type { CSSProperties, ReactNode } from "react";
import type { BundledLanguage, BundledTheme } from "shiki";

export const SHIKI_THEMES = {
  light: "github-light" as BundledTheme,
  dark: "github-dark-dimmed" as BundledTheme,
};

export const SHIKI_OPTIONS = {
  themes: SHIKI_THEMES,
  defaultColor: false as const,
};

export function shikiOptionsForLang(lang: string) {
  return {
    lang: lang as BundledLanguage,
    ...SHIKI_OPTIONS,
  };
}

export const PRE_STYLES = {
  base: {
    margin: 0,
    background: "transparent",
    fontSize: "inherit",
    lineHeight: "inherit",
    whiteSpace: "pre",
    wordBreak: "normal",
    overflowWrap: "normal",
    maxWidth: "100%",
  } satisfies CSSProperties,

  codeBlock: {
    padding: "0.75rem",
  } satisfies CSSProperties,

  server: {
    padding: 0,
    overflow: "visible",
    tabSize: 2,
  } satisfies CSSProperties,

  mapPreview: {
    padding: "1rem",
    fontSize: "0.8125rem",
    lineHeight: "1.5",
  } satisfies CSSProperties,
} as const;

export function preStyle(
  variant: keyof typeof PRE_STYLES,
  existingStyle?: CSSProperties
): CSSProperties {
  if (variant === "base") {
    return { ...PRE_STYLES.base, ...existingStyle };
  }

  return { ...PRE_STYLES.base, ...PRE_STYLES[variant], ...existingStyle };
}

export type PreComponentProps = {
  style?: CSSProperties;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
};
