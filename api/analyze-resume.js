/**
 * Vercel Serverless Function: POST /api/analyze-resume
 *
 * Accepts a multipart form upload with a "resume" field (PDF or DOCX).
 * Extracts text from the file, sends it to Grok (xAI) API for analysis,
 * and returns structured JSON with score, weak points, and suggestions.
 *
 * The XAI_API_KEY is read from process.env — never exposed to the client.
 */

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
    // Parse multipart form data manually
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

    // Get xAI (Grok) API key from environment (server-side only)
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      console.error("XAI_API_KEY not found in environment variables");
      return res.status(500).json({ error: "Server configuration error. Please contact the administrator." });
    }

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

    // Call Grok (xAI) API - OpenAI-compatible endpoint
    const grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          {
            role: "system",
            content: "You are an expert resume reviewer. Always respond with valid JSON only, no markdown or code blocks."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!grokResponse.ok) {
      const errorBody = await grokResponse.text();
      console.error(`Grok API error [${grokResponse.status}]:`, errorBody);
      
      if (grokResponse.status === 401) {
        return res.status(500).json({
          error: "API key is invalid. Please check the XAI_API_KEY configuration.",
        });
      }
      
      if (grokResponse.status === 429) {
        return res.status(429).json({
          error: "AI service is temporarily busy. Please try again in a few seconds.",
        });
      }

      if (grokResponse.status === 404) {
        return res.status(500).json({
          error: "AI model not found. Please contact the administrator.",
        });
      }
      
      return res.status(500).json({ error: `AI analysis failed (${grokResponse.status}). Please try again.` });
    }

    const grokData = await grokResponse.json();
    const responseText = grokData.choices?.[0]?.message?.content || "";

    if (!responseText) {
      return res.status(500).json({ error: "AI returned an empty response. Please try again." });
    }

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
      console.error("Failed to parse Grok response:", responseText);
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
