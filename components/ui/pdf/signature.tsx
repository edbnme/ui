/**
 * Signature — signature line for React PDF documents.
 *
 * @registryTitle PDF Signature
 * @registryDescription Signature block with label, signer text, date, and optional image signature.
 * @registryCategory forms
 * @registryDemos basic=Basic, image=Image
 */

import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  createPdfTextStyle,
  formatPdfValue,
  getPdfPrimitiveProps,
  isPdfNodeEmpty,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfSignatureProps extends PdfPrimitiveProps {
  label?: string;
  name?: string;
  date?: string;
  imageSrc?: string;
  style?: PdfStyleInput;
}

export function PdfSignature({
  label = "Signature",
  name,
  date,
  imageSrc,
  style,
  ...primitiveProps
}: PdfSignatureProps) {
  const theme = usePdfTheme();
  const hasName = !isPdfNodeEmpty(name);
  const hasDate = !isPdfNodeEmpty(date);
  const styles = StyleSheet.create({
    root: { marginTop: theme.spacing.lg, width: 180 } as Style,
    image: {
      height: 34,
      marginBottom: 4,
      objectFit: "contain",
      width: 150,
    } as Style,
    line: {
      borderBottomColor: theme.colors.foreground,
      borderBottomWidth: 1,
      height: imageSrc ? 4 : 32,
      marginBottom: 5,
    } as Style,
    label: {
      ...createPdfTextStyle(theme, { size: "xs", tone: "muted" }),
      textTransform: "uppercase",
    } as Style,
    name: {
      ...createPdfTextStyle(theme, { size: "sm", weight: "bold" }),
      marginTop: 3,
    } as Style,
    date: {
      ...createPdfTextStyle(theme, { size: "xs", tone: "muted" }),
      marginTop: 2,
    } as Style,
  });
  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.root, style)}
    >
      {imageSrc ? (
        <Image src={imageSrc} aria-label={label} style={styles.image} />
      ) : null}
      <View style={styles.line} />
      <Text style={styles.label}>{formatPdfValue(label)}</Text>
      {hasName ? (
        <Text style={styles.name}>{formatPdfValue(name)}</Text>
      ) : null}
      {hasDate ? (
        <Text style={styles.date}>{formatPdfValue(date)}</Text>
      ) : null}
    </View>
  );
}
