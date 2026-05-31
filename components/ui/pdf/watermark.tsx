/**
 * Watermark — fixed watermark for React PDF pages.
 *
 * @registryTitle PDF Watermark
 * @registryDescription Fixed centered watermark text for drafts, confidential documents, and samples.
 * @registryCategory chrome
 * @registryDemos basic=Basic, subtle=Subtle
 */

import { Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  clampPdfNumber,
  createPdfTextStyle,
  formatPdfValue,
  getPdfPrimitiveProps,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfWatermarkProps extends PdfPrimitiveProps {
  children: string;
  opacity?: number;
  rotate?: number;
  fixed?: boolean;
  style?: PdfStyleInput;
}

export function PdfWatermark({
  children,
  opacity = 0.08,
  rotate = -28,
  fixed = true,
  style,
  ...primitiveProps
}: PdfWatermarkProps) {
  const theme = usePdfTheme();
  const safeOpacity = clampPdfNumber(opacity, 0.08, 0, 1);
  const safeRotate = clampPdfNumber(rotate, -28, -360, 360);
  const styles = StyleSheet.create({
    watermark: {
      ...createPdfTextStyle(theme, {
        align: "center",
        fontSize: 58,
        weight: "bold",
      }),
      left: 0,
      opacity: safeOpacity,
      position: "absolute",
      right: 0,
      textAlign: "center",
      top: "45%",
      transform: `rotate(${safeRotate}deg)`,
    } as Style,
  });
  return (
    <Text
      {...getPdfPrimitiveProps({ ...primitiveProps, fixed })}
      style={mergePdfStyles(styles.watermark, style)}
    >
      {formatPdfValue(children)}
    </Text>
  );
}
