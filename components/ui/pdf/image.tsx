/**
 * Image — safe image wrapper for React PDF documents.
 *
 * @registryTitle PDF Image
 * @registryDescription Image wrapper with alt metadata, fit controls, dimensions, and fallback text.
 * @registryCategory media
 * @registryDemos basic=Basic, fallback=Fallback
 */

import { Image, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfImageProps {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fit?: "cover" | "contain" | "fill";
  fallback?: string;
  style?: PdfStyleInput;
}

export function PdfImage({
  src,
  alt,
  width = "100%",
  height = 120,
  fit = "cover",
  fallback = "Image unavailable",
  style,
}: PdfImageProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    image: { height, objectFit: fit, width } as Style,
    fallback: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      height,
      justifyContent: "center",
      width,
    } as Style,
    fallbackText: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
    } as Style,
  });
  if (!src) {
    return (
      <View style={mergePdfStyles(styles.fallback, style)}>
        <Text style={styles.fallbackText}>{fallback}</Text>
      </View>
    );
  }
  return (
    <Image
      src={src}
      aria-label={alt}
      style={mergePdfStyles(styles.image, style)}
    />
  );
}
