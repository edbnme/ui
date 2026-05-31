/**
 * PDF Render Web - client-side React PDF render helpers.
 *
 * @registryTitle PDF Render Web
 * @registryDescription Web helpers around usePDF, BlobProvider, PDFDownloadLink, PDFViewer, and pdf().
 * @registryVariant pdf
 */

import type * as React from "react";
import {
  BlobProvider,
  PDFDownloadLink,
  PDFViewer,
  pdf,
  usePDF,
} from "@react-pdf/renderer";

export const PdfBlobProvider = BlobProvider;
export const PdfDownloadLink = PDFDownloadLink;
export const PdfViewer = PDFViewer;
export const createPdfInstance = pdf;
export const usePdfDocument = usePDF;

export type PdfBlobProviderProps = React.ComponentProps<typeof BlobProvider>;
export type PdfBlobProviderParams = Parameters<
  PdfBlobProviderProps["children"]
>[0];
export type PdfDownloadLinkProps = React.ComponentProps<typeof PDFDownloadLink>;
export type PdfViewerProps = React.ComponentProps<typeof PDFViewer>;
