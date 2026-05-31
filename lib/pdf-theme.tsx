/**
 * PDF Theme — shared theme tokens and helpers for edbn/ui PDF components.
 *
 * @registryTitle PDF Theme
 * @registryDescription Theme provider, default tokens, and style helpers for PDF components.
 * @registryVariant pdf
 * @registryType registry:lib
 */

import * as React from "react";
import type {
  Bookmark,
  HitSlop,
  HyphenationCallback,
  Style,
} from "@react-pdf/types";

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

export type PdfStyleInput = Style | PdfStyleInput[] | null | undefined | false;

export type PdfTextSize = "xs" | "sm" | "base" | "lg" | "xl" | "xxl";
export type PdfTextTone =
  | "default"
  | "muted"
  | "primary"
  | "destructive"
  | "warning"
  | "success";
export type PdfTextWeight = "normal" | "medium" | "bold";
export type PdfTextAlign = "left" | "center" | "right";
export type PdfBookmark = Bookmark;
export type PdfHitSlop = HitSlop;
export type PdfHyphenationCallback = HyphenationCallback;

export interface PdfTextStyleOptions {
  size?: PdfTextSize;
  tone?: PdfTextTone;
  weight?: PdfTextWeight;
  align?: PdfTextAlign;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  marginBottom?: number;
}

export interface PdfPrimitiveProps {
  id?: string;
  bookmark?: PdfBookmark;
  debug?: boolean;
  fixed?: boolean;
  break?: boolean;
  minPresenceAhead?: number;
}

export interface PdfFlowProps extends PdfPrimitiveProps {
  wrap?: boolean;
}

export interface PdfTextRenderProps {
  pageNumber: number;
  totalPages: number;
  subPageNumber: number;
  subPageTotalPages: number;
}

export interface PdfViewRenderProps {
  pageNumber: number;
  subPageNumber: number;
}

export interface PdfAdvancedTextProps extends PdfFlowProps {
  render?: (props: PdfTextRenderProps) => React.ReactNode;
  hyphenationCallback?: PdfHyphenationCallback;
  orphans?: number;
  widows?: number;
}

export interface PdfAdvancedLinkProps extends PdfFlowProps {
  hitSlop?: PdfHitSlop;
}

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
  return styles.flatMap((style): Style[] => {
    if (!style) return [];
    if (Array.isArray(style)) return mergePdfStyles(...style);
    return [style];
  });
}

export function getPdfPrimitiveProps({
  break: pageBreak,
  id,
  bookmark,
  debug,
  fixed,
  minPresenceAhead,
}: PdfPrimitiveProps = {}) {
  return {
    id,
    bookmark,
    debug,
    fixed,
    break: pageBreak,
    minPresenceAhead,
  };
}

export function getPdfFlowProps({
  wrap,
  ...primitiveProps
}: PdfFlowProps = {}) {
  return {
    ...getPdfPrimitiveProps(primitiveProps),
    wrap,
  };
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

export function getPdfFontWeight(weight?: PdfTextWeight): 400 | 600 | 700 {
  if (weight === "bold") return 700;
  if (weight === "medium") return 600;
  return 400;
}

export function createPdfTextStyle(
  theme: PdfTheme,
  {
    size = "sm",
    tone = "default",
    weight = "normal",
    align = "left",
    color,
    fontFamily,
    fontSize,
    lineHeight = 1.45,
    marginBottom = 0,
  }: PdfTextStyleOptions = {}
): Style {
  return {
    color: color ?? getToneColor(theme, tone),
    fontFamily: fontFamily ?? theme.typography.fontFamily,
    fontSize: fontSize ?? theme.typography[size],
    fontWeight: getPdfFontWeight(weight),
    lineHeight,
    marginBottom,
    textAlign: align,
  } as Style;
}

export function isPdfNodeEmpty(value: React.ReactNode): boolean {
  if (value == null || typeof value === "boolean") return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.every(isPdfNodeEmpty);
  return false;
}

export function formatPdfValue(
  value: unknown,
  emptyValue: React.ReactNode = ""
): React.ReactNode {
  if (value == null) return emptyValue;
  if (React.isValidElement(value)) return value;
  if (Array.isArray(value)) {
    if (value.some(React.isValidElement)) {
      const nodes = value.filter(
        (item) => !isPdfNodeEmpty(item as React.ReactNode)
      );
      return nodes.length > 0 ? nodes : emptyValue;
    }
    const values = value
      .map((item) => formatPdfValue(item, ""))
      .filter((item) => !isPdfNodeEmpty(item as React.ReactNode));
    return values.length > 0 ? values.join(", ") : emptyValue;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? emptyValue
      : value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : emptyValue;
  }
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") {
    return value.trim().length > 0 ? value : emptyValue;
  }
  return emptyValue;
}

export function normalizePdfString(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

export function clampPdfNumber(
  value: number | undefined,
  fallback: number,
  min = 0,
  max = Number.MAX_SAFE_INTEGER
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

export function resolvePdfSize(
  value: number | string | undefined
): number | string | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  return undefined;
}
