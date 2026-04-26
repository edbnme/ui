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
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfWatermarkProps {
  children: string;
  opacity?: number;
  rotate?: number;
  style?: PdfStyleInput;
}

export function PdfWatermark({
  children,
  opacity = 0.08,
  rotate = -28,
  style,
}: PdfWatermarkProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    watermark: {
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: 58,
      fontWeight: 700,
      left: 0,
      opacity,
      position: "absolute",
      right: 0,
      textAlign: "center",
      top: "45%",
      transform: `rotate(${rotate}deg)`,
    } as Style,
  });
  return (
    <Text fixed style={mergePdfStyles(styles.watermark, style)}>
      {children}
    </Text>
  );
}
