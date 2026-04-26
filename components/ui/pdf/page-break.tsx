/**
 * PageBreak — explicit page break for React PDF documents.
 *
 * @registryTitle PDF Page Break
 * @registryDescription Insert an explicit React PDF page break in flowing documents.
 * @registryCategory layout
 * @registryDemos basic=Basic
 */

import { View } from "@react-pdf/renderer";

export function PdfPageBreak() {
  return <View break />;
}
