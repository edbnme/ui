/**
 * PDF Fonts - helpers for React PDF font, emoji, and hyphenation setup.
 *
 * @registryTitle PDF Fonts
 * @registryDescription Idempotent font registration and hyphenation helpers for React PDF documents.
 * @registryVariant pdf
 */

import { Font } from "@react-pdf/renderer";
import type {
  EmojiSource,
  FontStyle,
  FontWeight,
  HyphenationCallback,
} from "@react-pdf/types";

export interface PdfFontSource {
  src: string;
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
  postscriptName?: string;
  method?: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
}

export type PdfFontConfig =
  | ({
      family: string;
    } & PdfFontSource)
  | {
      family: string;
      fonts: PdfFontSource[];
    };

const registeredFontKeys = new Set<string>();

function stableFontKey(config: PdfFontConfig): string {
  return JSON.stringify(config);
}

export function registerPdfFont(config: PdfFontConfig): boolean {
  const key = stableFontKey(config);
  if (registeredFontKeys.has(key)) return false;
  Font.register(config);
  registeredFontKeys.add(key);
  return true;
}

export function registerPdfFonts(configs: readonly PdfFontConfig[]): number {
  return configs.reduce(
    (count, config) => count + (registerPdfFont(config) ? 1 : 0),
    0
  );
}

export function registerPdfEmojiSource(source: EmojiSource): void {
  Font.registerEmojiSource(source);
}

export function registerPdfHyphenationCallback(
  callback: HyphenationCallback
): void {
  Font.registerHyphenationCallback(callback);
}

export const disablePdfHyphenation: HyphenationCallback = (word) => [word];

export function disablePdfWordHyphenation(): void {
  registerPdfHyphenationCallback(disablePdfHyphenation);
}
