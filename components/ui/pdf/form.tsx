/**
 * Form — printable form fields for React PDF documents.
 *
 * @registryTitle PDF Form
 * @registryDescription Printable text and checkbox fields for generated PDF forms.
 * @registryCategory forms
 * @registryDemos basic=Basic, checkbox=Checkbox
 */

import * as React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  mergePdfStyles,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfFormProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  style?: PdfStyleInput;
}

export interface PdfFormFieldProps {
  label: string;
  value?: React.ReactNode;
  placeholder?: string;
  lines?: number;
  style?: PdfStyleInput;
}

export interface PdfCheckboxFieldProps {
  label: string;
  checked?: boolean;
  style?: PdfStyleInput;
}

export function PdfForm({ children, columns = 1, style }: PdfFormProps) {
  const styles = StyleSheet.create({
    root: {
      flexDirection: columns === 2 ? "row" : "column",
      gap: 8,
      flexWrap: "wrap",
    } as Style,
  });
  return <View style={mergePdfStyles(styles.root, style)}>{children}</View>;
}

export function PdfFormField({
  label,
  value,
  placeholder = "",
  lines = 1,
  style,
}: PdfFormFieldProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    field: { flex: 1, marginBottom: theme.spacing.sm } as Style,
    label: {
      color: theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.xs,
      marginBottom: 4,
      textTransform: "uppercase",
    } as Style,
    box: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      minHeight: lines * 18,
      padding: 6,
    } as Style,
    value: {
      color: value ? theme.colors.foreground : theme.colors.mutedForeground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
    } as Style,
  });
  return (
    <View style={mergePdfStyles(styles.field, style)}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <Text style={styles.value}>{value ?? placeholder}</Text>
      </View>
    </View>
  );
}

export function PdfCheckboxField({
  label,
  checked = false,
  style,
}: PdfCheckboxFieldProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    row: {
      alignItems: "center",
      flexDirection: "row",
      gap: 6,
      marginBottom: theme.spacing.sm,
    } as Style,
    box: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderWidth: 1,
      height: 10,
      justifyContent: "center",
      width: 10,
    } as Style,
    check: { color: theme.colors.primary, fontSize: 8 } as Style,
    label: {
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
    } as Style,
  });
  return (
    <View style={mergePdfStyles(styles.row, style)}>
      <View style={styles.box}>
        {checked ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
