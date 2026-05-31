/**
 * QRCode — QR code renderer for React PDF documents.
 *
 * @registryTitle PDF QR Code
 * @registryDescription Real QR code matrix rendering for React PDF using the qrcode package.
 * @registryCategory media
 * @registryDemos basic=Basic, branded=Branded
 */

import { Svg, Rect, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import QRCode from "qrcode";
import type { QRCodeErrorCorrectionLevel, QRCodeSegment } from "qrcode";
import {
  clampPdfNumber,
  createPdfTextStyle,
  getPdfPrimitiveProps,
  mergePdfStyles,
  normalizePdfString,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export type PdfQRCodeValue = string | QRCodeSegment[];
export type PdfQRCodeErrorCorrectionLevel = QRCodeErrorCorrectionLevel;

export interface PdfQRCodeProps extends PdfPrimitiveProps {
  value?: PdfQRCodeValue | null;
  size?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: PdfQRCodeErrorCorrectionLevel;
  quietZone?: number;
  emptyText?: string;
  invalidText?: string;
  style?: PdfStyleInput;
}

export interface PdfQRCodeMatrix {
  size: number;
  data: boolean[];
}

function hasQRCodeValue(value: PdfQRCodeValue | null | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return normalizePdfString(value).length > 0;
}

export function createPdfQRCodeMatrix(
  value: PdfQRCodeValue | null | undefined,
  errorCorrectionLevel: PdfQRCodeErrorCorrectionLevel = "M"
): PdfQRCodeMatrix | null {
  if (!hasQRCodeValue(value)) return null;
  try {
    const qr = QRCode.create(
      Array.isArray(value) ? value : normalizePdfString(value),
      {
        errorCorrectionLevel,
      }
    );
    const modules = qr.modules as unknown as { size: number; data: boolean[] };
    return { size: modules.size, data: Array.from(modules.data, Boolean) };
  } catch {
    return null;
  }
}

export function PdfQRCode({
  value,
  size = 96,
  darkColor,
  lightColor = "#ffffff",
  errorCorrectionLevel = "M",
  quietZone = 0,
  emptyText = "QR code value is empty",
  invalidText = "QR code value is invalid",
  style,
  ...primitiveProps
}: PdfQRCodeProps) {
  const theme = usePdfTheme();
  const matrix = createPdfQRCodeMatrix(value, errorCorrectionLevel);
  const hasValue = hasQRCodeValue(value);
  const qrSize = clampPdfNumber(size, 96, 24, 512);
  const padding = clampPdfNumber(quietZone, 0, 0, qrSize / 3);
  const styles = StyleSheet.create({
    empty: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      height: qrSize,
      justifyContent: "center",
      width: qrSize,
    } as Style,
    emptyText: createPdfTextStyle(theme, {
      align: "center",
      size: "xs",
      tone: "muted",
    }),
  });

  if (!matrix) {
    return (
      <View
        {...getPdfPrimitiveProps(primitiveProps)}
        style={mergePdfStyles(styles.empty, style)}
      >
        <Text style={styles.emptyText}>
          {hasValue ? invalidText : emptyText}
        </Text>
      </View>
    );
  }

  const drawableSize = qrSize - padding * 2;
  const moduleSize = drawableSize / matrix.size;
  const fill = darkColor ?? theme.colors.foreground;
  return (
    <Svg
      {...getPdfPrimitiveProps(primitiveProps)}
      width={qrSize}
      height={qrSize}
      style={mergePdfStyles(style)}
    >
      <Rect x={0} y={0} width={qrSize} height={qrSize} fill={lightColor} />
      {matrix.data.map((active, index) => {
        if (!active) return null;
        const x = padding + (index % matrix.size) * moduleSize;
        const y = padding + Math.floor(index / matrix.size) * moduleSize;
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
