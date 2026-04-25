"use client";


/**
 * useShikiHighlight
 * @registryDescription Client-side Shiki highlighting hook with lazy loading and JSX rendering.
 * @registryVariant audio
 */

import { useEffect, useState, type CSSProperties, type JSX } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

import {
  preStyle,
  shikiOptionsForLang,
  type PreComponentProps,
} from "@/lib/shiki-config";

export type PreStyleVariant = "base" | "codeBlock" | "server" | "mapPreview";

interface UseShikiHighlightOptions {
  preVariant?: PreStyleVariant;
  skip?: boolean;
}

export function useShikiHighlight(
  code: string,
  lang: string,
  options: UseShikiHighlightOptions = {}
): JSX.Element | null {
  const { preVariant = "codeBlock", skip = false } = options;
  const [highlighted, setHighlighted] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (skip) return;

    let cancelled = false;

    async function highlight() {
      try {
        const { codeToHast } = await import("shiki");
        if (cancelled) return;

        const hast = await codeToHast(code.trim(), shikiOptionsForLang(lang));
        if (cancelled) return;

        const rendered = toJsxRuntime(hast, {
          Fragment,
          jsx,
          jsxs,
          components: {
            pre: ({ style, children, ...rest }: PreComponentProps) => (
              <pre
                {...rest}
                style={preStyle(preVariant, style as CSSProperties)}
              >
                {children}
              </pre>
            ),
          },
        }) as JSX.Element;

        setHighlighted(rendered);
      } catch {
        setHighlighted(null);
      }
    }

    void highlight();

    return () => {
      cancelled = true;
    };
  }, [code, lang, preVariant, skip]);

  return skip ? null : highlighted;
}
