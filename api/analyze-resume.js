/**
 * Vercel Serverless Function: POST /api/analyze-resume
 * Uses Groq API (fast inference) for resume analysis.
 * GROQ_API_KEY from process.env.
 */

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
    }

    const chunks = [];
    for await (const chunk of req) { chunks.push(chunk); }
    const rawBody = Buffer.concat(chunks);

    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) return res.status(400).json({ error: "Invalid form data" });

    const parts = parseMultipart(rawBody, boundaryMatch[1]);
    const resumePart = parts.find((p) => p.name === "resume");

    if (!resumePart || !resumePart.data || resumePart.data.length === 0) {
      return res.status(400).json({ error: "No resume file provided." });
    }

    const fileName = (resumePart.filename || "").toLowerCase();
    const isPDF = fileName.endsWith(".pdf");
    const isDOCX = fileName.endsWith(".docx");

    if (!isPDF && !isDOCX) {
      return res.status(400).json({ error: "Only PDF and DOCX files accepted." });
    }
    if (resumePart.data.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "File too large. Max 5MB." });
    }

    // Extract text
    let extractedText = "";
    if (isPDF) {
      const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
      const d = await pdfParse(resumePart.data);
      extractedText = d.text;
    } else {
      const mammoth = (await import("mammoth")).default;
      const r = await mammoth.extractRawText({ buffer: resumePart.data });
      extractedText = r.value;
    }

    if (!extractedText || extractedText.trim().length < 30) {
      return res.status(400).json({ error: "Cannot extract text from file." });
    }

    const text = extractedText.length > 12000 ? extractedText.substring(0, 12000) : extractedText;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY not set in environment variables." });
    }

    const prompt = `Analyze this resume. Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{"overall_score":<number 1-100>,"weak_points":["..."],"missing_skills_or_sections":["..."],"formatting_issues":["..."],"suggestions":["..."]}

Scoring (out of 100): 90-100 excellent, 70-89 good, 50-69 average, 30-49 below average, 1-29 poor.
Be specific and actionable.

Resume:
${text}`;

    // Call Groq API (OpenAI-compatible)
    let apiResponse;
    try {
      apiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are an expert resume reviewer. Return ONLY valid JSON, no markdown." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });
    } catch (networkErr) {
      return res.status(500).json({ error: "Network error: " + networkErr.message });
    }

    if (!apiResponse.ok) {
      const errBody = await apiResponse.text();
      return res.status(apiResponse.status).json({
        error: "Groq API error (" + apiResponse.status + "): " + errBody.substring(0, 500)
      });
    }

    const data = await apiResponse.json();
    const responseText = data.choices?.[0]?.message?.content || "";

    if (!responseText) {
      return res.status(500).json({ error: "Empty AI response." });
    }

    // Parse JSON
    let result;
    try {
      let c = responseText.trim();
      if (c.startsWith("```json")) c = c.slice(7);
      else if (c.startsWith("```")) c = c.slice(3);
      if (c.endsWith("```")) c = c.slice(0, -3);
      result = JSON.parse(c.trim());
    } catch (e) {
      return res.status(500).json({ error: "AI response is not valid JSON: " + responseText.substring(0, 200) });
    }

    return res.status(200).json({
      overall_score: Math.min(100, Math.max(1, Number(result.overall_score) || 50)),
      weak_points: Array.isArray(result.weak_points) ? result.weak_points.filter(s => typeof s === "string").slice(0, 10) : [],
      missing_skills_or_sections: Array.isArray(result.missing_skills_or_sections) ? result.missing_skills_or_sections.filter(s => typeof s === "string").slice(0, 10) : [],
      formatting_issues: Array.isArray(result.formatting_issues) ? result.formatting_issues.filter(s => typeof s === "string").slice(0, 10) : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions.filter(s => typeof s === "string").slice(0, 15) : [],
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + (err.message || String(err)) });
  }
}

function parseMultipart(body, boundary) {
  const parts = [];
  const b = Buffer.from("--" + boundary);
  let start = body.indexOf(b) + b.length + 2;
  while (start < body.length) {
    const next = body.indexOf(b, start);
    if (next === -1) break;
    const part = body.slice(start, next - 2);
    const hEnd = part.indexOf("\r\n\r\n");
    if (hEnd === -1) { start = next + b.length + 2; continue; }
    const h = part.slice(0, hEnd).toString("utf-8");
    const c = part.slice(hEnd + 4);
    const n = h.match(/name="([^"]+)"/);
    const f = h.match(/filename="([^"]+)"/);
    if (n) parts.push({ name: n[1], filename: f ? f[1] : null, data: c });
    start = next + b.length + 2;
    if (body.indexOf(Buffer.from("--" + boundary + "--"), next) === next) break;
  }
  return parts;
}
