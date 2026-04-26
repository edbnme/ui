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
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfSignatureProps {
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
}: PdfSignatureProps) {
  const theme = usePdfTheme();
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
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.xs,
      textTransform: "uppercase",
    } as Style,
    name: {
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      fontWeight: 700,
      marginTop: 3,
    } as Style,
    date: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.xs,
      marginTop: 2,
    } as Style,
  });
  return (
    <View style={mergePdfStyles(styles.root, style)}>
      {imageSrc ? <Image src={imageSrc} style={styles.image} /> : null}
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      {name ? <Text style={styles.name}>{name}</Text> : null}
      {date ? <Text style={styles.date}>{date}</Text> : null}
    </View>
  );
}
