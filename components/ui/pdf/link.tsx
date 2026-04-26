/**
 * Link — clickable text link for React PDF documents.
 *
 * @registryTitle PDF Link
 * @registryDescription Clickable PDF link with theme-aware styling and safe fallback text.
 * @registryCategory typography
 * @registryDemos basic=Basic
 */

import * as React from "react";
import { Link as ReactPdfLink, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfLinkProps {
  src: string;
  children: React.ReactNode;
  style?: PdfStyleInput;
}

export function PdfLink({ src, children, style }: PdfLinkProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    link: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      textDecoration: "underline",
    } as Style,
  });
  return (
    <ReactPdfLink src={src} style={mergePdfStyles(styles.link, style)}>
      {children}
    </ReactPdfLink>
  );
}
