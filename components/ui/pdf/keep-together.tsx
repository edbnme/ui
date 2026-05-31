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
import {
  getPdfPrimitiveProps,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
} from "@/lib/pdf-theme";

export interface PdfKeepTogetherProps extends PdfPrimitiveProps {
  children: React.ReactNode;
  style?: PdfStyleInput;
}

export function PdfKeepTogether({
  children,
  style,
  ...primitiveProps
}: PdfKeepTogetherProps) {
  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      wrap={false}
      style={mergePdfStyles(style)}
    >
      {children}
    </View>
  );
}
