/**
 * QRCode — QR code renderer for React PDF documents.
 *
 * @registryTitle PDF QR Code
 * @registryDescription Real QR code matrix rendering for React PDF using the qrcode package.
 * @registryCategory media
 * @registryDemos basic=Basic, branded=Branded
 */

import QRCode from "qrcode";
import { Svg, Rect, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfQRCodeProps {
  value: string;
  size?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  emptyText?: string;
  style?: PdfStyleInput;
}

export interface PdfQRCodeMatrix {
  size: number;
  data: boolean[];
}

export function createPdfQRCodeMatrix(
  value: string,
  errorCorrectionLevel: "L" | "M" | "Q" | "H" = "M"
): PdfQRCodeMatrix | null {
  if (!value.trim()) return null;
  const qr = QRCode.create(value, { errorCorrectionLevel });
  const modules = qr.modules as unknown as { size: number; data: boolean[] };
  return { size: modules.size, data: Array.from(modules.data, Boolean) };
}

export function PdfQRCode({
  value,
  size = 96,
  darkColor,
  lightColor = "#ffffff",
  errorCorrectionLevel = "M",
  emptyText = "QR code value is empty",
  style,
}: PdfQRCodeProps) {
  const theme = usePdfTheme();
  const matrix = createPdfQRCodeMatrix(value, errorCorrectionLevel);
  const styles = StyleSheet.create({
    empty: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      height: size,
      justifyContent: "center",
      width: size,
    } as Style,
    emptyText: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.xs,
      textAlign: "center",
    } as Style,
  });

  if (!matrix) {
    return (
      <View style={mergePdfStyles(styles.empty, style)}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  const moduleSize = size / matrix.size;
  const fill = darkColor ?? theme.colors.foreground;
  return (
    <Svg width={size} height={size} style={mergePdfStyles(style)}>
      <Rect x={0} y={0} width={size} height={size} fill={lightColor} />
      {matrix.data.map((active, index) => {
        if (!active) return null;
        const x = (index % matrix.size) * moduleSize;
        const y = Math.floor(index / matrix.size) * moduleSize;
        return (
          <Rect
            key={index}
            x={x}
            y={y}
            width={moduleSize}
            height={moduleSize}
            fill={fill}
          />
        );
      })}
    </Svg>
  );
}
