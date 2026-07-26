/**
 * Vercel Serverless Function: POST /api/analyze-resume
 *
 * Accepts a multipart form upload with a "resume" field (PDF or DOCX).
 * Extracts text from the file, sends it to Google Gemini for analysis,
 * and returns structured JSON with score, weak points, and suggestions.
 *
 * The GEMINI_API_KEY is read from process.env — never exposed to the client.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse multipart form data manually using Web API
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
    }

    // Read raw body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks);

    // Extract boundary
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ error: "Invalid multipart form data" });
    }
    const boundary = boundaryMatch[1];

    // Parse multipart manually
    const parts = parseMultipart(rawBody, boundary);
    const resumePart = parts.find((p) => p.name === "resume");

    if (!resumePart || !resumePart.data || resumePart.data.length === 0) {
      return res.status(400).json({ error: "No resume file provided. Please upload a PDF or DOCX file." });
    }

    // Validate file type
    const fileName = (resumePart.filename || "").toLowerCase();
    const isPDF = fileName.endsWith(".pdf");
    const isDOCX = fileName.endsWith(".docx");

    if (!isPDF && !isDOCX) {
      return res.status(400).json({ error: "Invalid file type. Only PDF and DOCX files are accepted." });
    }

    // Validate file size (5MB max)
    if (resumePart.data.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "File size exceeds 5MB limit." });
    }

    // Extract text from file
    let extractedText = "";

    if (isPDF) {
      const pdfData = await pdf(resumePart.data);
      extractedText = pdfData.text;
    } else if (isDOCX) {
      const result = await mammoth.extractRawText({ buffer: resumePart.data });
      extractedText = result.value;
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        error: "Could not extract enough text from the file. Please ensure your resume contains readable text (not just images).",
      });
    }

    // Truncate very long resumes to avoid token limits
    const maxChars = 15000;
    const textToAnalyze =
      extractedText.length > maxChars
        ? extractedText.substring(0, maxChars) + "\n\n[Text truncated for analysis]"
        : extractedText;

    // Get Gemini API key from environment (server-side only)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return res.status(500).json({ error: "Server configuration error. Please contact the administrator." });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);

    // Craft the analysis prompt
    const prompt = `You are an expert resume reviewer and ATS (Applicant Tracking System) specialist. Analyze the following resume text and provide a detailed, structured evaluation.

Resume Text:
---
${textToAnalyze}
---

Analyze this resume and return your evaluation as a JSON object with EXACTLY this structure:
{
  "overall_score": <number from 1 to 10>,
  "weak_points": [<array of strings describing weak areas or areas needing improvement>],
  "missing_skills_or_sections": [<array of strings listing missing important skills, keywords, or standard resume sections>],
  "formatting_issues": [<array of strings describing any formatting problems detected>],
  "suggestions": [<array of specific, actionable suggestions to improve the resume>]
}

Guidelines for scoring:
- 9-10: Excellent, ATS-optimized, strong impact statements, complete sections
- 7-8: Good, minor improvements needed
- 5-6: Average, several areas need attention
- 3-4: Below average, significant improvements required
- 1-2: Poor, major restructuring needed

Be specific and actionable in your feedback. Each weak point and suggestion should be a clear, concise sentence.
Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`;

    // Try models in order: gemini-2.0-flash first, fallback to gemini-1.5-flash
    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
    let geminiResult = null;
    let lastError = null;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        geminiResult = await model.generateContent(prompt);
        break; // Success, exit loop
      } catch (err) {
        lastError = err;
        const errMsg = err.message || "";
        // If rate limited, try next model
        if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("Too Many Requests")) {
          console.warn(`Rate limited on ${modelName}, trying next model...`);
          continue;
        }
        // For other errors, throw immediately
        throw err;
      }
    }

    if (!geminiResult) {
      // All models rate limited
      const retryMatch = (lastError?.message || "").match(/retry in ([\d.]+)s/i);
      const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
      return res.status(429).json({
        error: `AI service is temporarily busy due to high demand. Please try again in ${retrySeconds} seconds.`,
      });
    }

    const responseText = geminiResult.response.text();

    // Parse the JSON response
    let analysisResult;
    try {
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7);
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      cleanedResponse = cleanedResponse.trim();
      analysisResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", responseText);
      return res.status(500).json({ error: "Failed to parse AI analysis response. Please try again." });
    }

    // Validate and sanitize the response structure
    const sanitized = {
      overall_score: Math.min(10, Math.max(1, Number(analysisResult.overall_score) || 5)),
      weak_points: Array.isArray(analysisResult.weak_points)
        ? analysisResult.weak_points.filter((s) => typeof s === "string").slice(0, 10)
        : [],
      missing_skills_or_sections: Array.isArray(analysisResult.missing_skills_or_sections)
        ? analysisResult.missing_skills_or_sections.filter((s) => typeof s === "string").slice(0, 10)
        : [],
      formatting_issues: Array.isArray(analysisResult.formatting_issues)
        ? analysisResult.formatting_issues.filter((s) => typeof s === "string").slice(0, 10)
        : [],
      suggestions: Array.isArray(analysisResult.suggestions)
        ? analysisResult.suggestions.filter((s) => typeof s === "string").slice(0, 15)
        : [],
    };

    return res.status(200).json(sanitized);
  } catch (error) {
    console.error("Resume analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    
    // Handle rate limit errors with user-friendly message
    if (message.includes("429") || message.includes("quota") || message.includes("Too Many Requests")) {
      const retryMatch = message.match(/retry in ([\d.]+)s/i);
      const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
      return res.status(429).json({
        error: `AI service is temporarily busy. Please wait ${retrySeconds} seconds and try again.`,
      });
    }
    
    return res.status(500).json({ error: `Analysis failed. Please try again in a moment.` });
  }
}

/**
 * Parse multipart form data from a buffer
 */
function parseMultipart(body, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const endBoundary = Buffer.from(`--${boundary}--`);

  let start = body.indexOf(boundaryBuffer) + boundaryBuffer.length + 2; // skip \r\n

  while (start < body.length) {
    const nextBoundary = body.indexOf(boundaryBuffer, start);
    if (nextBoundary === -1) break;

    const partData = body.slice(start, nextBoundary - 2); // -2 for \r\n before boundary
    const headerEnd = partData.indexOf("\r\n\r\n");

    if (headerEnd === -1) {
      start = nextBoundary + boundaryBuffer.length + 2;
      continue;
    }

    const headerStr = partData.slice(0, headerEnd).toString("utf-8");
    const content = partData.slice(headerEnd + 4);

    const nameMatch = headerStr.match(/name="([^"]+)"/);
    const filenameMatch = headerStr.match(/filename="([^"]+)"/);

    if (nameMatch) {
      parts.push({
        name: nameMatch[1],
        filename: filenameMatch ? filenameMatch[1] : null,
        data: content,
      });
    }

    start = nextBoundary + boundaryBuffer.length + 2;

    // Check if we hit the end boundary
    if (body.indexOf(endBoundary, nextBoundary) === nextBoundary) break;
  }

  return parts;
}
