/**
 * PDF Render Node - server-side React PDF render helpers.
 *
 * @registryTitle PDF Render Node
 * @registryDescription Node helpers for rendering React PDF documents to files, buffers, strings, and streams.
 * @registryVariant pdf
 */

import {
  renderToBuffer,
  renderToFile,
  renderToStream,
  renderToString,
} from "@react-pdf/renderer";

export type PdfDocumentElement = Parameters<typeof renderToBuffer>[0];

export function renderPdfToFile(
  document: PdfDocumentElement,
  filePath: string,
  callback?: (output: NodeJS.ReadableStream, filePath: string) => unknown
) {
  return renderToFile(document, filePath, callback);
}

export function renderPdfToBuffer(document: PdfDocumentElement) {
  return renderToBuffer(document);
}

export function renderPdfToStream(document: PdfDocumentElement) {
  return renderToStream(document);
}

/**
 * React PDF still exports renderToString, but renderToBuffer is preferred for
 * new Node integrations because renderToString is deprecated upstream.
 */
export function renderPdfToString(document: PdfDocumentElement) {
  return renderToString(document);
}
