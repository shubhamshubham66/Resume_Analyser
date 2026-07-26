/**
 * API Route: POST /api/analyze-resume
 * 
 * Accepts a multipart form upload with a "resume" field (PDF or DOCX).
 * Extracts text from the file, sends it to Google Gemini for analysis,
 * and returns structured JSON with score, weak points, and suggestions.
 * 
 * The GEMINI_API_KEY is read from process.env — never exposed to the client.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// PDF and DOCX parsers (server-only)
import pdf from "pdf-parse";
import mammoth from "mammoth";

export async function action({ request }: { request: Request }) {
  // Only allow POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "No resume file provided. Please upload a PDF or DOCX file." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isPDF = fileName.endsWith(".pdf") || file.type === "application/pdf";
    const isDOCX =
      fileName.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isPDF && !isDOCX) {
      return new Response(
        JSON.stringify({ error: "Invalid file type. Only PDF and DOCX files are accepted." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "File size exceeds 5MB limit." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract text from file
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    if (isPDF) {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } else if (isDOCX) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return new Response(
        JSON.stringify({
          error: "Could not extract enough text from the file. Please ensure your resume contains readable text (not just images).",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Truncate very long resumes to avoid token limits
    const maxChars = 15000;
    const textToAnalyze = extractedText.length > maxChars
      ? extractedText.substring(0, maxChars) + "\n\n[Text truncated for analysis]"
      : extractedText;

    // Get Gemini API key from environment (server-side only, never exposed to client)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error. Please contact the administrator." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    // Call Gemini API
    const geminiResult = await model.generateContent(prompt);
    const responseText = geminiResult.response.text();

    // Parse the JSON response
    let analysisResult;
    try {
      // Clean up potential markdown code blocks from response
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
      return new Response(
        JSON.stringify({ error: "Failed to parse AI analysis response. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate and sanitize the response structure
    const sanitized = {
      overall_score: Math.min(10, Math.max(1, Number(analysisResult.overall_score) || 5)),
      weak_points: Array.isArray(analysisResult.weak_points)
        ? analysisResult.weak_points.filter((s: unknown) => typeof s === "string").slice(0, 10)
        : [],
      missing_skills_or_sections: Array.isArray(analysisResult.missing_skills_or_sections)
        ? analysisResult.missing_skills_or_sections.filter((s: unknown) => typeof s === "string").slice(0, 10)
        : [],
      formatting_issues: Array.isArray(analysisResult.formatting_issues)
        ? analysisResult.formatting_issues.filter((s: unknown) => typeof s === "string").slice(0, 10)
        : [],
      suggestions: Array.isArray(analysisResult.suggestions)
        ? analysisResult.suggestions.filter((s: unknown) => typeof s === "string").slice(0, 15)
        : [],
    };

    return new Response(JSON.stringify(sanitized), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: `Analysis failed: ${message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
