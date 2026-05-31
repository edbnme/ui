/**
 * Link — clickable text link for React PDF documents.
 *
 * @registryTitle PDF Link
 * @registryDescription Clickable PDF link with theme-aware styling and safe fallback text.
 * @registryCategory typography
 * @registryDemos basic=Basic
 */

import * as React from "react";
import {
  Link as ReactPdfLink,
  Text as ReactPdfText,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  formatPdfValue,
  getPdfFlowProps,
  mergePdfStyles,
  normalizePdfString,
  type PdfAdvancedLinkProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfLinkProps extends PdfAdvancedLinkProps {
  src?: string | null;
  href?: string | null;
  children: React.ReactNode;
  fallbackText?: React.ReactNode;
  style?: PdfStyleInput;
}

export function PdfLink({
  src,
  href,
  children,
  fallbackText,
  style,
  ...flowProps
}: PdfLinkProps) {
  const theme = usePdfTheme();
  const linkTarget = normalizePdfString(src ?? href);
  const styles = StyleSheet.create({
    link: {
      ...createPdfTextStyle(theme, { color: theme.colors.primary, size: "sm" }),
      textDecoration: "underline",
    } as Style,
    fallback: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
  });

  if (!linkTarget) {
    return (
      <ReactPdfText
        {...getPdfFlowProps(flowProps)}
        style={mergePdfStyles(styles.fallback, style)}
      >
        {formatPdfValue(fallbackText ?? children)}
      </ReactPdfText>
    );
  }

  return (
    <ReactPdfLink
      {...getPdfFlowProps(flowProps)}
      src={linkTarget}
      style={mergePdfStyles(styles.link, style)}
    >
      {formatPdfValue(children)}
    </ReactPdfLink>
  );
}
