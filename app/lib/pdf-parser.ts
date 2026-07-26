import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Configure the worker - import from same package to ensure version match
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
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
