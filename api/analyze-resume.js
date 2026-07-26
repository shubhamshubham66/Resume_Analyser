/**
 * Vercel Serverless Function: POST /api/analyze-resume
 *
 * Accepts a multipart form upload with a "resume" field (PDF or DOCX).
 * Extracts text, sends to Grok (xAI) for analysis, returns structured JSON.
 *
 * XAI_API_KEY from process.env — never exposed to the client.
 */

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse multipart form data
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks);

    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ error: "Invalid multipart form data" });
    }

    const parts = parseMultipart(rawBody, boundaryMatch[1]);
    const resumePart = parts.find((p) => p.name === "resume");

    if (!resumePart || !resumePart.data || resumePart.data.length === 0) {
      return res.status(400).json({ error: "No resume file provided." });
    }

    const fileName = (resumePart.filename || "").toLowerCase();
    const isPDF = fileName.endsWith(".pdf");
    const isDOCX = fileName.endsWith(".docx");

    if (!isPDF && !isDOCX) {
      return res.status(400).json({ error: "Invalid file type. Only PDF and DOCX accepted." });
    }

    if (resumePart.data.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "File size exceeds 5MB limit." });
    }

    // Extract text
    let extractedText = "";
    if (isPDF) {
      const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
      const pdfData = await pdfParse(resumePart.data);
      extractedText = pdfData.text;
    } else if (isDOCX) {
      const mammoth = await import("mammoth");
      const result = await mammoth.default.extractRawText({ buffer: resumePart.data });
      extractedText = result.value;
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({
        error: "Could not extract enough text. Ensure your resume has readable text.",
      });
    }

    const maxChars = 15000;
    const textToAnalyze = extractedText.length > maxChars
      ? extractedText.substring(0, maxChars)
      : extractedText;

    // Check API key
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "XAI_API_KEY not configured on server." });
    }

    // Build prompt
    const prompt = `You are an expert resume reviewer and ATS specialist. Analyze this resume and return ONLY a JSON object (no markdown, no code blocks) with this exact structure:
{"overall_score": <1-10>, "weak_points": ["..."], "missing_skills_or_sections": ["..."], "formatting_issues": ["..."], "suggestions": ["..."]}

Scoring: 9-10 excellent, 7-8 good, 5-6 average, 3-4 below average, 1-2 poor.
Be specific and actionable. Return ONLY valid JSON.

Resume:
${textToAnalyze}`;

    // Call xAI Grok API
    let grokResponse;
    try {
      grokResponse = await fetch("https://api.x.ai/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-3-mini-fast",
          input: prompt,
        }),
      });
    } catch (fetchErr) {
      console.error("Fetch to xAI failed:", fetchErr);
      return res.status(500).json({ error: `Cannot reach AI service: ${fetchErr.message}` });
    }

    if (!grokResponse.ok) {
      const errText = await grokResponse.text();
      console.error(`xAI API [${grokResponse.status}]:`, errText);
      return res.status(500).json({ 
        error: `AI API error (${grokResponse.status}): ${errText.substring(0, 300)}` 
      });
    }

    const grokData = await grokResponse.json();

    // Parse response - try multiple formats
    let responseText = "";
    
    // Format 1: output[].content[].text
    if (grokData.output && Array.isArray(grokData.output)) {
      for (const item of grokData.output) {
        if (item.type === "message" && Array.isArray(item.content)) {
          for (const block of item.content) {
            if (block.type === "output_text" && block.text) {
              responseText += block.text;
            }
          }
        }
      }
    }
    // Format 2: output_text direct
    if (!responseText && grokData.output_text) {
      responseText = grokData.output_text;
    }
    // Format 3: choices format
    if (!responseText && grokData.choices?.[0]?.message?.content) {
      responseText = grokData.choices[0].message.content;
    }

    if (!responseText) {
      console.error("Empty response from xAI. Full response:", JSON.stringify(grokData).substring(0, 500));
      return res.status(500).json({ error: "AI returned empty response. Raw: " + JSON.stringify(grokData).substring(0, 200) });
    }

    // Parse JSON from response
    let analysisResult;
    try {
      let cleaned = responseText.trim();
      if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
      else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
      if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
      cleaned = cleaned.trim();
      analysisResult = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parse failed. Response:", responseText.substring(0, 500));
      return res.status(500).json({ error: "Failed to parse AI response as JSON." });
    }

    // Sanitize
    return res.status(200).json({
      overall_score: Math.min(10, Math.max(1, Number(analysisResult.overall_score) || 5)),
      weak_points: Array.isArray(analysisResult.weak_points)
        ? analysisResult.weak_points.filter(s => typeof s === "string").slice(0, 10) : [],
      missing_skills_or_sections: Array.isArray(analysisResult.missing_skills_or_sections)
        ? analysisResult.missing_skills_or_sections.filter(s => typeof s === "string").slice(0, 10) : [],
      formatting_issues: Array.isArray(analysisResult.formatting_issues)
        ? analysisResult.formatting_issues.filter(s => typeof s === "string").slice(0, 10) : [],
      suggestions: Array.isArray(analysisResult.suggestions)
        ? analysisResult.suggestions.filter(s => typeof s === "string").slice(0, 15) : [],
    });

  } catch (error) {
    console.error("Unhandled error:", error);
    return res.status(500).json({ error: `Server error: ${error.message || "Unknown"}` });
  }
}

function parseMultipart(body, boundary) {
  const parts = [];
  const boundaryBuf = Buffer.from(`--${boundary}`);
  let start = body.indexOf(boundaryBuf) + boundaryBuf.length + 2;

  while (start < body.length) {
    const next = body.indexOf(boundaryBuf, start);
    if (next === -1) break;

    const partData = body.slice(start, next - 2);
    const headerEnd = partData.indexOf("\r\n\r\n");
    if (headerEnd === -1) { start = next + boundaryBuf.length + 2; continue; }

    const headers = partData.slice(0, headerEnd).toString("utf-8");
    const content = partData.slice(headerEnd + 4);
    const nameMatch = headers.match(/name="([^"]+)"/);
    const fileMatch = headers.match(/filename="([^"]+)"/);

    if (nameMatch) {
      parts.push({ name: nameMatch[1], filename: fileMatch?.[1] || null, data: content });
    }
    start = next + boundaryBuf.length + 2;
    if (body.indexOf(Buffer.from(`--${boundary}--`), next) === next) break;
  }
  return parts;
}
