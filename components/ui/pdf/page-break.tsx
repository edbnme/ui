/**
 * PageBreak - explicit page break for React PDF documents.
 *
 * @registryTitle PDF Page Break
 * @registryDescription Insert an explicit React PDF page break in flowing documents.
 * @registryCategory layout
 * @registryDemos basic=Basic
 */

import { View } from "@react-pdf/renderer";
import { getPdfPrimitiveProps, type PdfPrimitiveProps } from "@/lib/pdf-theme";

export type PdfPageBreakProps = PdfPrimitiveProps;

export function PdfPageBreak(props: PdfPageBreakProps) {
  return <View {...getPdfPrimitiveProps({ ...props, break: true })} />;
}
