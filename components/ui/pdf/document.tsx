/**
 * Document - themed React PDF document and page shell.
 *
 * @registryTitle PDF Document
 * @registryDescription Document and page wrappers for metadata, permissions, bookmarks, page sizing, and theme context.
 * @registryCategory structure
 * @registryDemos basic=Basic, navigation=Navigation
 */

import * as React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  PdfThemeProvider,
  resolvePdfSize,
  type PdfStyleInput,
  type PdfTheme,
  usePdfTheme,
} from "@/lib/pdf-theme";

export type PdfDocumentProps = Omit<
  React.ComponentProps<typeof Document>,
  "children"
> & {
  children: React.ReactNode;
  theme?: Partial<PdfTheme>;
};

export interface PdfPageProps
  extends Omit<React.ComponentProps<typeof Page>, "children" | "style"> {
  children: React.ReactNode;
  padding?: number;
  backgroundColor?: string;
  style?: PdfStyleInput;
}

export function PdfDocument({
  children,
  theme,
  creator = "edbn/ui",
  producer = "@react-pdf/renderer",
  ...props
}: PdfDocumentProps) {
  return (
    <Document creator={creator} producer={producer} {...props}>
      <PdfThemeProvider theme={theme}>{children}</PdfThemeProvider>
    </Document>
  );
}

export function PdfPage({
  children,
  padding = 40,
  backgroundColor,
  style,
  size = "A4",
  wrap = true,
  ...props
}: PdfPageProps) {
  const theme = usePdfTheme();
  const pagePadding = resolvePdfSize(padding) ?? 40;
  const styles = StyleSheet.create({
    page: {
      backgroundColor: backgroundColor ?? theme.colors.background,
      padding: pagePadding,
    } as Style,
  });

  return (
    <Page
      size={size}
      wrap={wrap}
      style={mergePdfStyles(styles.page, style)}
      {...props}
    >
      {children}
    </Page>
  );
}
