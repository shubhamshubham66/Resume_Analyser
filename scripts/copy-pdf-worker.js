/**
 * Copies the pdf.js worker file from node_modules to the public directory.
 * This ensures the worker version always matches the installed pdfjs-dist version.
 * Runs automatically via the "postinstall" npm script.
 */
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const publicDir = resolve(projectRoot, "public");

// Ensure public directory exists
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Try multiple possible worker file locations (varies by pdfjs-dist version)
const possibleWorkerPaths = [
  resolve(projectRoot, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
  resolve(projectRoot, "node_modules/pdfjs-dist/build/pdf.worker.mjs"),
  resolve(projectRoot, "node_modules/pdfjs-dist/build/pdf.worker.min.js"),
  resolve(projectRoot, "node_modules/pdfjs-dist/build/pdf.worker.js"),
  resolve(projectRoot, "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs"),
  resolve(projectRoot, "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"),
];

let copied = false;
for (const workerPath of possibleWorkerPaths) {
  if (existsSync(workerPath)) {
    const destFile = resolve(publicDir, "pdf.worker.min.mjs");
    copyFileSync(workerPath, destFile);
    console.log(`✓ Copied pdf.js worker to public/pdf.worker.min.mjs`);
    console.log(`  Source: ${workerPath}`);
    copied = true;
    break;
  }
}

if (!copied) {
  console.warn("⚠ Could not find pdf.js worker file in node_modules/pdfjs-dist/");
  console.warn("  The app will fall back to CDN-based worker loading.");
  console.warn("  Searched paths:", possibleWorkerPaths.map(p => p.replace(projectRoot, ".")));
}
