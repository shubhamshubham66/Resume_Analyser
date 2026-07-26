import * as pdfjsLib from "pdfjs-dist";

/**
 * Configure the PDF.js worker.
 * 
 * Strategy:
 * 1. Primary: Use the self-hosted worker copied to /public by the postinstall script.
 *    This guarantees the worker version matches the API version exactly.
 * 2. Fallback: Use unpkg CDN with pdfjsLib.version to ensure version parity.
 */
if (typeof window !== "undefined") {
  // Use self-hosted worker file (copied from node_modules by postinstall script)
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export interface ParsedResume {
  text: string;
  pageCount: number;
  metadata: Record<string, string>;
}

/**
 * Parse a PDF file and extract text content
 */
export async function parsePDF(file: File): Promise<ParsedResume> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  const metadata: Record<string, string> = {};

  // Extract metadata
  const info = await pdf.getMetadata();
  if (info.info) {
    const pdfInfo = info.info as Record<string, unknown>;
    if (pdfInfo.Title) metadata.title = String(pdfInfo.Title);
    if (pdfInfo.Author) metadata.author = String(pdfInfo.Author);
    if (pdfInfo.Subject) metadata.subject = String(pdfInfo.Subject);
  }

  // Extract text from all pages
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => {
        if ("str" in item) return item.str;
        return "";
      })
      .join(" ");
    fullText += pageText + "\n\n";
  }

  return {
    text: fullText.trim(),
    pageCount: pdf.numPages,
    metadata,
  };
}
