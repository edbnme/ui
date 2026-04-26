/**
 * KeepTogether — prevent a PDF fragment from splitting across pages.
 *
 * @registryTitle PDF Keep Together
 * @registryDescription Wrap content with React PDF `wrap={false}` to keep a fragment on one page.
 * @registryCategory layout
 * @registryDemos basic=Basic
 */

import * as React from "react";
import { View } from "@react-pdf/renderer";
import { mergePdfStyles, type PdfStyleInput } from "@/lib/pdf-theme";

export interface PdfKeepTogetherProps {
  children: React.ReactNode;
  style?: PdfStyleInput;
}

export function PdfKeepTogether({ children, style }: PdfKeepTogetherProps) {
  return (
    <View wrap={false} style={mergePdfStyles(style)}>
      {children}
    </View>
  );
}
