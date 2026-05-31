/**
 * Form - printable and fillable form fields for React PDF documents.
 *
 * @registryTitle PDF Form
 * @registryDescription Printable fields plus opt-in native AcroForm text, checkbox, select, list, and fieldset wrappers.
 * @registryCategory forms
 * @registryDemos basic=Basic, checkbox=Checkbox, native=Native
 */

import * as React from "react";
import {
  Checkbox,
  FieldSet,
  List as ReactPdfList,
  Select,
  TextInput,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  clampPdfNumber,
  createPdfTextStyle,
  formatPdfValue,
  getPdfPrimitiveProps,
  isPdfNodeEmpty,
  mergePdfStyles,
  type PdfPrimitiveProps,
  type PdfStyleInput,
  usePdfTheme,
} from "@/lib/pdf-theme";

export interface PdfFormProps extends PdfPrimitiveProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  style?: PdfStyleInput;
}

export interface PdfFormFieldProps extends PdfPrimitiveProps {
  label: string;
  value?: React.ReactNode;
  placeholder?: string;
  lines?: number;
  style?: PdfStyleInput;
}

export interface PdfCheckboxFieldProps extends PdfPrimitiveProps {
  label: string;
  checked?: boolean | "indeterminate";
  style?: PdfStyleInput;
}

export interface PdfNativeFieldCommonProps extends PdfPrimitiveProps {
  name?: string;
  required?: boolean;
  noExport?: boolean;
  readOnly?: boolean;
  value?: number | string;
  defaultValue?: number | string;
}

export interface PdfTextInputFormat {
  type:
    | "date"
    | "time"
    | "percent"
    | "number"
    | "zip"
    | "zipPlus4"
    | "phone"
    | "ssn";
  param?: string;
  nDec?: number;
  sepComma?: boolean;
  negStyle?: "MinusBlack" | "Red" | "ParensBlack" | "ParensRed";
  currency?: string;
  currencyPrepend?: boolean;
}

export interface PdfFieldSetProps extends PdfPrimitiveProps {
  name: string;
  children: React.ReactNode;
  label?: React.ReactNode;
  style?: PdfStyleInput;
  labelStyle?: PdfStyleInput;
}

export interface PdfTextInputFieldProps extends PdfNativeFieldCommonProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  multiline?: boolean;
  password?: boolean;
  noSpell?: boolean;
  format?: PdfTextInputFormat;
  fontSize?: number;
  maxLength?: number;
  lines?: number;
  style?: PdfStyleInput;
  labelStyle?: PdfStyleInput;
  inputStyle?: PdfStyleInput;
}

export interface PdfCheckboxInputFieldProps extends PdfNativeFieldCommonProps {
  label?: React.ReactNode;
  checked?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  onState?: string;
  offState?: string;
  xMark?: boolean;
  style?: PdfStyleInput;
  labelStyle?: PdfStyleInput;
  checkboxStyle?: PdfStyleInput;
}

export interface PdfSelectFieldProps extends PdfNativeFieldCommonProps {
  label?: React.ReactNode;
  select?: string[];
  sort?: boolean;
  edit?: boolean;
  multiSelect?: boolean;
  noSpell?: boolean;
  style?: PdfStyleInput;
  labelStyle?: PdfStyleInput;
  inputStyle?: PdfStyleInput;
}

export type PdfListInputFieldProps = PdfSelectFieldProps;

function getNativeFieldProps({
  id,
  debug,
  fixed,
  break: pageBreak,
  minPresenceAhead,
  name,
  required,
  noExport,
  readOnly,
  value,
  defaultValue,
}: PdfNativeFieldCommonProps) {
  return {
    id,
    debug,
    fixed,
    break: pageBreak,
    minPresenceAhead,
    name,
    required,
    noExport,
    readOnly,
    value,
    defaultValue,
  };
}

export function PdfForm({
  children,
  columns = 1,
  style,
  ...primitiveProps
}: PdfFormProps) {
  const styles = StyleSheet.create({
    root: {
      flexDirection: columns === 2 ? "row" : "column",
      flexWrap: "wrap",
      gap: 8,
    } as Style,
  });
  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.root, style)}
    >
      {children}
    </View>
  );
}

function NativeFieldLabel({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: PdfStyleInput;
}) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    label: {
      ...createPdfTextStyle(theme, { size: "xs", tone: "muted" }),
      marginBottom: 4,
      textTransform: "uppercase",
    } as Style,
  });
  if (isPdfNodeEmpty(children)) return null;
  return <Text style={mergePdfStyles(styles.label, style)}>{children}</Text>;
}

export function PdfFormField({
  label,
  value,
  placeholder = "",
  lines = 1,
  style,
  ...primitiveProps
}: PdfFormFieldProps) {
  const theme = usePdfTheme();
  const safeLines = clampPdfNumber(lines, 1, 1, 12);
  const formattedValue = formatPdfValue(value);
  const hasValue = !isPdfNodeEmpty(formattedValue);
  const styles = StyleSheet.create({
    field: { flex: 1, marginBottom: theme.spacing.sm } as Style,
    label: {
      ...createPdfTextStyle(theme, { size: "xs", tone: "muted" }),
      marginBottom: 4,
      textTransform: "uppercase",
    } as Style,
    box: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      minHeight: safeLines * 18,
      padding: 6,
    } as Style,
    value: createPdfTextStyle(theme, {
      size: "sm",
      tone: hasValue ? "default" : "muted",
    }),
  });
  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.field, style)}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <Text style={styles.value}>
          {hasValue ? formattedValue : placeholder}
        </Text>
      </View>
    </View>
  );
}

export function PdfCheckboxField({
  label,
  checked = false,
  style,
  ...primitiveProps
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
    check: createPdfTextStyle(theme, {
      color: theme.colors.primary,
      fontSize: 8,
    }),
    label: createPdfTextStyle(theme, { size: "sm" }),
  });
  return (
    <View
      {...getPdfPrimitiveProps(primitiveProps)}
      style={mergePdfStyles(styles.row, style)}
    >
      <View style={styles.box}>
        {checked ? (
          <Text style={styles.check}>
            {checked === "indeterminate" ? "-" : "\u2713"}
          </Text>
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function PdfFieldSet({
  name,
  children,
  label,
  style,
  labelStyle,
  ...primitiveProps
}: PdfFieldSetProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    fieldset: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
    } as Style,
  });
  return (
    <FieldSet
      {...getPdfPrimitiveProps(primitiveProps)}
      name={name}
      style={mergePdfStyles(styles.fieldset, style)}
    >
      <NativeFieldLabel style={labelStyle}>{label}</NativeFieldLabel>
      {children}
    </FieldSet>
  );
}

export function PdfTextInputField({
  label,
  description,
  align,
  multiline,
  password,
  noSpell,
  format,
  fontSize,
  maxLength,
  lines = multiline ? 4 : 1,
  style,
  labelStyle,
  inputStyle,
  ...fieldProps
}: PdfTextInputFieldProps) {
  const theme = usePdfTheme();
  const safeLines = clampPdfNumber(lines, multiline ? 4 : 1, 1, 12);
  const styles = StyleSheet.create({
    root: { flex: 1, marginBottom: theme.spacing.sm } as Style,
    input: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: fontSize ?? theme.typography.sm,
      minHeight: safeLines * 18,
      padding: 6,
      width: "100%",
    } as Style,
    description: createPdfTextStyle(theme, { size: "xs", tone: "muted" }),
  });

  return (
    <View style={mergePdfStyles(styles.root, style)}>
      <NativeFieldLabel style={labelStyle}>{label}</NativeFieldLabel>
      <TextInput
        {...getNativeFieldProps(fieldProps)}
        align={align}
        multiline={multiline}
        password={password}
        noSpell={noSpell}
        format={format}
        fontSize={fontSize}
        maxLength={maxLength}
        style={mergePdfStyles(styles.input, inputStyle)}
      />
      {isPdfNodeEmpty(description) ? null : (
        <Text style={styles.description}>{formatPdfValue(description)}</Text>
      )}
    </View>
  );
}

export function PdfCheckboxInputField({
  label,
  checked,
  backgroundColor,
  borderColor,
  onState,
  offState,
  xMark,
  style,
  labelStyle,
  checkboxStyle,
  ...fieldProps
}: PdfCheckboxInputFieldProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    row: {
      alignItems: "center",
      flexDirection: "row",
      gap: 6,
      marginBottom: theme.spacing.sm,
    } as Style,
    checkbox: {
      height: 12,
      width: 12,
    } as Style,
    label: createPdfTextStyle(theme, { size: "sm" }),
  });

  return (
    <View style={mergePdfStyles(styles.row, style)}>
      <Checkbox
        {...getNativeFieldProps(fieldProps)}
        checked={checked}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        onState={onState}
        offState={offState}
        xMark={xMark}
        style={mergePdfStyles(styles.checkbox, checkboxStyle)}
      />
      {isPdfNodeEmpty(label) ? null : (
        <Text style={mergePdfStyles(styles.label, labelStyle)}>
          {formatPdfValue(label)}
        </Text>
      )}
    </View>
  );
}

export function PdfSelectField({
  label,
  select = [],
  sort,
  edit,
  multiSelect,
  noSpell,
  style,
  labelStyle,
  inputStyle,
  ...fieldProps
}: PdfSelectFieldProps) {
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    root: { flex: 1, marginBottom: theme.spacing.sm } as Style,
    input: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      minHeight: 24,
      padding: 4,
      width: "100%",
    } as Style,
  });
  const props = {
    ...getNativeFieldProps(fieldProps),
    select,
    sort,
    edit,
    multiSelect,
    noSpell,
    style: mergePdfStyles(styles.input, inputStyle),
  } as React.ComponentProps<typeof Select>;

  return (
    <View style={mergePdfStyles(styles.root, style)}>
      <NativeFieldLabel style={labelStyle}>{label}</NativeFieldLabel>
      <Select {...props} />
    </View>
  );
}

export function PdfListInputField(props: PdfListInputFieldProps) {
  const {
    label,
    select = [],
    sort,
    edit,
    multiSelect,
    noSpell,
    style,
    labelStyle,
    inputStyle,
    ...fieldProps
  } = props;
  const theme = usePdfTheme();
  const styles = StyleSheet.create({
    root: { flex: 1, marginBottom: theme.spacing.sm } as Style,
    input: {
      borderColor: theme.colors.border,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      color: theme.colors.foreground,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sm,
      minHeight: 56,
      padding: 4,
      width: "100%",
    } as Style,
  });
  const listProps = {
    ...getNativeFieldProps(fieldProps),
    select,
    sort,
    edit,
    multiSelect,
    noSpell,
    style: mergePdfStyles(styles.input, inputStyle),
  } as React.ComponentProps<typeof ReactPdfList>;

  return (
    <View style={mergePdfStyles(styles.root, style)}>
      <NativeFieldLabel style={labelStyle}>{label}</NativeFieldLabel>
      <ReactPdfList {...listProps} />
    </View>
  );
}
