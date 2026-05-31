/**
 * Image — safe image wrapper for React PDF documents.
 *
 * @registryTitle PDF Image
 * @registryDescription Image wrapper with alt metadata, fit controls, dimensions, and fallback text.
 * @registryCategory media
 * @registryDemos basic=Basic, fallback=Fallback, background=Background
 */

import * as React from "react";
import {
  Image,
  ImageBackground,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { SourceObject, Sizes, SrcSet, Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  getPdfPrimitiveProps,
  mergePdfStyles,
  normalizePdfString,
  resolvePdfSize,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfImageProps extends PdfPrimitiveProps {
  src?: SourceObject | null;
  source?: SourceObject | null;
  cache?: boolean;
  srcSet?: SrcSet;
  sizes?: Sizes;
  alt?: string;
  width?: number | string;
  height?: number | string;
  fit?: "cover" | "contain" | "fill";
  fallback?: string;
  style?: PdfStyleInput;
}

export interface PdfImageBackgroundProps extends PdfImageProps {
  children: React.ReactNode;
  imageStyle?: PdfStyleInput;
}

export function PdfImage({
  src,
  alt,
  width = "100%",
  height = 120,
  fit = "cover",
  fallback = "Image unavailable",
  style,
  source,
  cache,
  srcSet,
  sizes,
  ...primitiveProps
}: PdfImageProps) {
  const theme = usePdfTheme();
  const resolvedWidth = resolvePdfSize(width) ?? "100%";
  const resolvedHeight = resolvePdfSize(height) ?? 120;
  const imageSource = src ?? source;
  const hasSource =
    typeof imageSource === "string"
      ? normalizePdfString(imageSource).length > 0
      : !!imageSource;
  const styles = StyleSheet.create({
    image: {
      height: resolvedHeight,
      objectFit: fit,
      width: resolvedWidth,
    } as Style,
    fallback: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      height: resolvedHeight,
      justifyContent: "center",
      width: resolvedWidth,
    } as Style,
    fallbackText: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
  });
  if (!hasSource) {
    return (
      <View
        {...getPdfPrimitiveProps(primitiveProps)}
        style={mergePdfStyles(styles.fallback, style)}
      >
        <Text style={styles.fallbackText}>{fallback}</Text>
      </View>
    );
  }
  return (
    <Image
      {...getPdfPrimitiveProps(primitiveProps)}
      src={imageSource as SourceObject}
      cache={cache}
      srcSet={srcSet}
      sizes={sizes}
      aria-label={alt}
      style={mergePdfStyles(styles.image, style)}
    />
  );
}

export function PdfImageBackground({
  children,
  imageStyle,
  fallback = "Image unavailable",
  style,
  source,
  src,
  cache,
  srcSet,
  sizes,
  width = "100%",
  height = 160,
  fit = "cover",
  alt,
  ...primitiveProps
}: PdfImageBackgroundProps) {
  const theme = usePdfTheme();
  const imageSource = src ?? source;
  const resolvedWidth = resolvePdfSize(width) ?? "100%";
  const resolvedHeight = resolvePdfSize(height) ?? 160;
  const hasSource =
    typeof imageSource === "string"
      ? normalizePdfString(imageSource).length > 0
      : !!imageSource;
  const styles = StyleSheet.create({
    background: {
      minHeight: resolvedHeight,
      objectFit: fit,
      width: resolvedWidth,
    } as Style,
    fallback: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      minHeight: resolvedHeight,
      justifyContent: "center",
      width: resolvedWidth,
    } as Style,
    fallbackText: createPdfTextStyle(theme, { size: "sm", tone: "muted" }),
  });

  if (!hasSource) {
    return (
      <View
        {...getPdfPrimitiveProps(primitiveProps)}
        style={mergePdfStyles(styles.fallback, style)}
      >
        <Text style={styles.fallbackText}>{fallback}</Text>
        {children}
      </View>
    );
  }

  return (
    <ImageBackground
      {...getPdfPrimitiveProps(primitiveProps)}
      src={imageSource as SourceObject}
      cache={cache}
      srcSet={srcSet}
      sizes={sizes}
      aria-label={alt}
      imageStyle={mergePdfStyles(imageStyle)[0]}
      style={mergePdfStyles(styles.background, style)}
    >
      {children}
    </ImageBackground>
  );
}
