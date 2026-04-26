/**
 * PDF Theme — shared theme tokens and helpers for edbn/ui PDF components.
 *
 * @registryTitle PDF Theme
 * @registryDescription Theme provider, default tokens, and style helpers for PDF components.
 * @registryVariant pdf
 * @registryType registry:lib
 */

import * as React from "react";
import type { Style } from "@react-pdf/types";

// ---- TYPES -----------------------------------------------------------------

export interface PdfTheme {
  colors: {
    background: string;
    foreground: string;
    mutedForeground: string;
    border: string;
    primary: string;
    primaryForeground: string;
    muted: string;
    destructive: string;
    warning: string;
    success: string;
  };
  spacing: {
    page: number;
    section: number;
    gap: number;
    sm: number;
    md: number;
    lg: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    fontFamily: string;
    monoFontFamily: string;
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export type PdfStyleInput = Style | Style[] | null | undefined | false;

// ---- DEFAULT THEME ---------------------------------------------------------

export const defaultPdfTheme: PdfTheme = {
  colors: {
    background: "#ffffff",
    foreground: "#111827",
    mutedForeground: "#6b7280",
    border: "#d1d5db",
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    muted: "#f3f4f6",
    destructive: "#dc2626",
    warning: "#b45309",
    success: "#15803d",
  },
  spacing: {
    page: 36,
    section: 16,
    gap: 10,
    sm: 6,
    md: 10,
    lg: 16,
  },
  radii: {
    sm: 4,
    md: 7,
    lg: 10,
  },
  typography: {
    fontFamily: "Helvetica",
    monoFontFamily: "Courier",
    xs: 8,
    sm: 9,
    base: 10.5,
    lg: 13,
    xl: 18,
    xxl: 28,
  },
};

// ---- CONTEXT ---------------------------------------------------------------

const PdfThemeContext = React.createContext<PdfTheme>(defaultPdfTheme);

export interface PdfThemeProviderProps {
  theme?: Partial<PdfTheme>;
  children: React.ReactNode;
}

function mergeTheme(theme?: Partial<PdfTheme>): PdfTheme {
  if (!theme) return defaultPdfTheme;
  return {
    colors: { ...defaultPdfTheme.colors, ...theme.colors },
    spacing: { ...defaultPdfTheme.spacing, ...theme.spacing },
    radii: { ...defaultPdfTheme.radii, ...theme.radii },
    typography: { ...defaultPdfTheme.typography, ...theme.typography },
  };
}

export function PdfThemeProvider({ theme, children }: PdfThemeProviderProps) {
  const resolvedTheme = React.useMemo(() => mergeTheme(theme), [theme]);
  return (
    <PdfThemeContext.Provider value={resolvedTheme}>
      {children}
    </PdfThemeContext.Provider>
  );
}

export function usePdfTheme(): PdfTheme {
  return React.useContext(PdfThemeContext) ?? defaultPdfTheme;
}

// ---- STYLE HELPERS ---------------------------------------------------------

export function mergePdfStyles(...styles: PdfStyleInput[]): Style[] {
  return styles.flatMap((style) => {
    if (!style) return [];
    return Array.isArray(style) ? style.filter(Boolean) : [style];
  });
}

export function getToneColor(theme: PdfTheme, tone?: string): string {
  switch (tone) {
    case "primary":
      return theme.colors.primary;
    case "muted":
      return theme.colors.mutedForeground;
    case "destructive":
      return theme.colors.destructive;
    case "warning":
      return theme.colors.warning;
    case "success":
      return theme.colors.success;
    default:
      return theme.colors.foreground;
  }
}
